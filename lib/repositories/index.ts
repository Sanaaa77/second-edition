import { getSupabaseClient } from "@/lib/supabase/utils";

export class UniversityRepository {
  public async findAll() {
    const supabase = getSupabaseClient();
    return await supabase.from('universities').select('*, city:cities(*), rankings(*), university_media(*), university_translations(*)');
  }
  public async findBySlug(slug: string) {
    const supabase = getSupabaseClient();
    return await supabase
      .from('universities')
      .select('*, city:cities(*, city_translations(*)), faculties(*, programs(*)), rankings(*), university_media(*), campuses(*), faqs(*, faq_translations(*)), career_outcomes(*), university_translations(*)')
      .eq('slug', slug)
      .single();
  }
  public async findById(id: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('universities').select('*, city:cities(*), university_translations(*)').eq('id', id).single();
  }
}

export class ProgramRepository {
  public async findAll(filters?: any) {
    const supabase = getSupabaseClient();
    let query = supabase.from('programs').select('*, university:universities(*)');
    // Implement filters (degree_level, language, etc.)
    return await query;
  }
  public async findById(id: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('programs').select('*, university:universities(*), career_outcomes(*)').eq('id', id).single();
  }
}

export class ArticleRepository {
  public async findPublished(category?: string) {
    const supabase = getSupabaseClient();
    let query = supabase.from('articles').select('*, article_translations(*)').eq('published', true);
    if (category) query = query.eq('category', category);
    return await query.order('created_at', { ascending: false });
  }
  public async findBySlug(slug: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('articles').select('*, article_translations(*)').eq('slug', slug).single();
  }
}

export class CityRepository {
  public async findAll() {
    const supabase = getSupabaseClient();
    return await supabase.from('cities').select('*, city_translations(*)');
  }
  public async findBySlug(slug: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('cities').select('*, universities(*), living_cost_details(*), city_translations(*)').eq('slug', slug).single();
  }
}

export class ScholarshipRepository {
  public async findAll() {
    const supabase = getSupabaseClient();
    return await supabase.from('scholarships').select('*, university:universities(*)');
  }
}

export class ProfileRepository {
  public async getById(id: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('profiles').select('*').eq('id', id).single();
  }
  public async update(id: string, updates: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('profiles').update(updates).eq('id', id);
  }
}

export class ApplicationRepository {
  public async findByProfileId(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('applications').select('*, university:universities(*), program:programs(*)').eq('profile_id', profileId).order('created_at', { ascending: false });
  }
  public async findById(id: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('applications').select('*').eq('id', id).single();
  }
  public async updateStatus(id: string, status: string, note?: string) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) throw error;
    await supabase.from('application_status_history').insert({ application_id: id, status, note });
  }
}

export class OfferRepository {
  public async findByProfileId(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('offers').select('*, university:universities(*)').eq('profile_id', profileId);
  }
}

export class VisaRepository {
  public async findByProfileId(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('visa_applications').select('*').eq('profile_id', profileId).maybeSingle();
  }
}

export class PredictionRepository {
  public async findByProfileId(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('student_predictions').select('*').eq('profile_id', profileId);
  }
  public async upsert(prediction: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('student_predictions').upsert(prediction);
  }
}

export class DecisionReportRepository {
  public async findLatestByProfileId(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('decision_reports').select('*').eq('profile_id', profileId).order('created_at', { ascending: false }).limit(1).maybeSingle();
  }
  public async insert(report: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('decision_reports').insert(report);
  }
}

export class DreamUniversityRepository {
  public async findByProfileId(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('dream_universities').select('*, university:universities(*), program:programs(*)').eq('profile_id', profileId);
  }
  public async add(dream: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('dream_universities').insert(dream);
  }
  public async remove(profileId: string, universityId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('dream_universities').delete().eq('profile_id', profileId).eq('university_id', universityId);
  }
}

export class WeightRepository {
  public async getAll() {
    const supabase = getSupabaseClient();
    return await supabase.from('admission_weights').select('*');
  }
}

export class CRMRepository {
  public async findAssignedStudents(advisorId: string) {
    const supabase = getSupabaseClient();
    return await supabase
      .from('advisor_students')
      .select('*, student:profiles(*)')
      .eq('advisor_id', advisorId);
  }

  public async findConsultations(advisorId: string) {
    const supabase = getSupabaseClient();
    return await supabase
      .from('consultations')
      .select('*, student:profiles(*)')
      .eq('advisor_id', advisorId)
      .order('scheduled_at', { ascending: true });
  }

  public async createConsultation(consultation: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('consultations').insert(consultation);
  }

  public async findLeads(advisorId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('leads').select('*').eq('advisor_id', advisorId);
  }

  public async findTasks(advisorId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('advisor_tasks').select('*, student:profiles(*)').eq('advisor_id', advisorId);
  }

  public async findNotes(studentId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('advisor_notes').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
  }

  public async saveNote(note: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('advisor_notes').insert(note);
  }

  public async findMessages(threadId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('messages').select('*').eq('thread_id', threadId).order('created_at', { ascending: true });
  }

  public async sendMessage(message: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('messages').insert(message);
  }
}

export class AcademyRepository {
  public async findAllCourses() {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_courses').select('*').eq('is_published', true);
  }

  public async findCourseBySlug(slug: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_courses').select('*, modules:academy_modules(*, lessons:academy_lessons(*))').eq('slug', slug).single();
  }

  public async getProgress(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_progress').select('*').eq('profile_id', profileId);
  }

  public async updateProgress(profileId: string, courseId: string, completedLessons: string[]) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_progress').upsert({
      profile_id: profileId,
      course_id: courseId,
      completed_lessons: completedLessons,
      last_activity: new Date().toISOString()
    });
  }

  public async getStats(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_stats').select('*').eq('profile_id', profileId).maybeSingle();
  }

  public async updateStats(profileId: string, updates: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_stats').update(updates).eq('profile_id', profileId);
  }

  public async addXP(profileId: string, amount: number, reason: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_xp_history').insert({
      profile_id: profileId,
      amount,
      reason
    });
  }

  public async getVocabulary(profileId: string) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_vocabulary').select('*').eq('profile_id', profileId);
  }

  public async saveVocabulary(vocab: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_vocabulary').upsert(vocab);
  }

  public async insertCourse(course: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_courses').insert(course);
  }

  public async insertLesson(lesson: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_lessons').insert(lesson);
  }

  public async updateCourse(id: string, updates: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('academy_courses').update(updates).eq('id', id);
  }
}

export class ApplicationHistoryRepository {
  static async logAction(log: any) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('application_audit_logs').insert(log);
    if (error) throw error;
  }
}

export class ChecklistRepository {
  static async findByApplicationId(applicationId: string) {
    const supabase = getSupabaseClient();
    return await supabase
      .from('application_checklists')
      .select('*')
      .eq('application_id', applicationId)
      .order('is_completed', { ascending: true });
  }
}
