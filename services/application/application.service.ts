import { Application, Offer, VisaApplication } from "@/types/database";
import { BaseService } from "../BaseService";
import { createClient } from "@/lib/supabase/client";
import { ApplicationRepository, OfferRepository, VisaRepository } from "@/lib/repositories";
import { RepositoryError } from "@/lib/core/errors/AppErrors";

export class ApplicationService extends BaseService {
  constructor(
    private readonly applicationRepo: ApplicationRepository,
    private readonly offerRepo: OfferRepository,
    private readonly visaRepo: VisaRepository
  ) {
    super();
  }

  async getMyApplications(): Promise<Application[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return this.execute(
      async () => {
        const { data } = await this.applicationRepo.findByProfileId(user.id);
        return (data || []) as Application[];
      },
      {
        name: 'ApplicationService.getMyApplications',
        cacheKey: `applications_${user.id}`,
        cacheTTL: 1000 * 60 * 5
      }
    );
  }

  async getMyOffers(): Promise<Offer[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return this.execute(
      async () => {
        const { data } = await this.offerRepo.findByProfileId(user.id);
        return (data || []) as Offer[];
      },
      {
        name: 'ApplicationService.getMyOffers',
        cacheKey: `offers_${user.id}`
      }
    );
  }

  async getMyVisaStatus(): Promise<VisaApplication | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return this.execute(
      async () => {
        const { data } = await this.visaRepo.findByProfileId(user.id);
        return data as VisaApplication;
      },
      {
        name: 'ApplicationService.getMyVisaStatus',
        cacheKey: `visa_${user.id}`
      }
    );
  }

  async getDetail(id: string): Promise<Application> {
    return this.execute(
      async () => {
        const { data, error } = await this.applicationRepo.findById(id);
        if (error) throw new RepositoryError(error.message);
        return data as Application;
      },
      {
        name: `ApplicationService.getDetail(${id})`,
        cacheKey: `application_detail_${id}`
      }
    );
  }
}
