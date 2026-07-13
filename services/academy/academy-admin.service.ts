import { BaseService } from "../BaseService";
import { AcademyRepository } from "@/lib/repositories";

export class AcademyAdminService extends BaseService {
  constructor(private readonly academyRepo: AcademyRepository) {
    super();
  }

  async createCourse(course: any) {
    return this.execute(async () => {
      return await this.academyRepo.insertCourse(course);
    }, { name: 'AcademyAdminService.createCourse' });
  }

  async createLesson(lesson: any) {
     return this.execute(async () => {
      return await this.academyRepo.insertLesson(lesson);
    }, { name: 'AcademyAdminService.createLesson' });
  }

  async publishCourse(courseId: string) {
    return this.execute(async () => {
      return await this.academyRepo.updateCourse(courseId, { is_published: true });
    }, { name: 'AcademyAdminService.publishCourse' });
  }
}
