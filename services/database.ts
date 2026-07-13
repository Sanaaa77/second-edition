import { UniversityRepository, ProfileRepository, ApplicationRepository } from "@/lib/repositories";
import { University, Profile, Application } from "@/types/database";

export const UniversityService = {
  async getAll(): Promise<University[]> {
    const uniRepo = new UniversityRepository();
    const { data } = await uniRepo.findAll();
    return (data || []) as University[];
  },
  async getBySlug(slug: string): Promise<University> {
    const uniRepo = new UniversityRepository();
    const { data } = await uniRepo.findBySlug(slug);
    return data as University;
  }
};

export const ProfileService = {
  async getOwnProfile(): Promise<Profile | null> {
    const profRepo = new ProfileRepository();
    const { data } = await profRepo.getById('me'); 
    return data as Profile;
  }
};

export const ApplicationService = {
  async getMyApplications(): Promise<Application[]> {
    const appRepo = new ApplicationRepository();
    const { data } = await appRepo.findByProfileId('me');
    return (data || []) as Application[];
  }
};
