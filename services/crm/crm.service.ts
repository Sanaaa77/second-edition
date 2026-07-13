import { CRMRepository, ProfileRepository, ApplicationRepository } from "@/lib/repositories";
import { CacheManager } from "@/lib/core/cache/CacheManager";
import { EventBus } from "@/lib/core/events/EventBus";
import { BaseService } from "../BaseService";
import { AdmissionEngine } from "@/lib/decision-engine/AdmissionEngine";

export class CRMService extends BaseService {
  constructor(
    private readonly crmRepo: CRMRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly appRepo: ApplicationRepository,
    private readonly cache: CacheManager,
    private readonly eventBus: EventBus
  ) {
    super();
  }

  async getAdvisorDashboard(advisorId: string) {
    return this.execute(async () => {
      const [students, consultations, leads, tasks] = await Promise.all([
        this.crmRepo.findAssignedStudents(advisorId),
        this.crmRepo.findConsultations(advisorId),
        this.crmRepo.findLeads(advisorId),
        this.crmRepo.findTasks(advisorId)
      ]);

      return {
        students: students.data || [],
        consultations: consultations.data || [],
        leads: leads.data || [],
        tasks: tasks.data || [],
        metrics: {
          activeStudents: students.data?.length || 0,
          pendingTasks: tasks.data?.filter(t => t.status === 'Pending').length || 0,
          upcomingMeetings: consultations.data?.filter(c => new Date(c.scheduled_at) > new Date()).length || 0
        }
      };
    }, { 
      name: 'CRMService.getAdvisorDashboard', 
      cacheKey: `advisor_dashboard_${advisorId}` 
    });
  }

  async getStudentAIAssistance(studentId: string) {
    return this.execute(async () => {
      const { data: profile } = await this.profileRepo.getById(studentId);
      const { data: applications } = await this.appRepo.findByProfileId(studentId);
      
      if (!profile) throw new Error("Student not found");

      // Use the Admission Engine to generate insights for the advisor
      const analysis = AdmissionEngine.analyze(profile as any);
      
      return {
        summary: `Student has a ${analysis.probability}% admission probability.`,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        risks: analysis.riskFactors,
        suggestedNextAction: analysis.nextBestActions[0],
        applicationStatus: applications?.length ? applications[0].status : 'No Active Applications'
      };
    }, { name: 'CRMService.getStudentAIAssistance' });
  }

  async scheduleMeeting(advisorId: string, studentId: string, meetingData: any) {
    return this.execute(async () => {
      const result = await this.crmRepo.createConsultation({
        advisor_id: advisorId,
        student_id: studentId,
        ...meetingData
      });
      
      this.cache.invalidatePattern(`advisor_dashboard_${advisorId}`);
      
      await this.eventBus.publish({
        type: 'NotificationCreated',
        payload: {
          profile_id: studentId,
          title: "New Meeting Scheduled",
          message: `Your advisor has scheduled a meeting: ${meetingData.title}`,
          type: "Meeting"
        },
        metadata: { timestamp: new Date().toISOString(), correlationId: crypto.randomUUID() }
      });

      return result;
    }, { name: 'CRMService.scheduleMeeting' });
  }

  async addInternalNote(advisorId: string, studentId: string, content: string, tags: string[]) {
    return this.execute(async () => {
      return await this.crmRepo.saveNote({
        advisor_id: advisorId,
        student_id: studentId,
        content,
        tags
      });
    }, { name: 'CRMService.addInternalNote' });
  }
}
