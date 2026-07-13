import { City } from "@/types/database";
import { BaseService } from "../BaseService";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/core/errors/AppErrors";

export class CityService extends BaseService {
  async getAll(): Promise<City[]> {
    const supabase = createClient();
    return this.execute(
      async () => {
        const { data, error } = await supabase.from('cities').select('*');
        if (error) throw new RepositoryError(error.message);
        return data as City[];
      },
      {
        name: 'CityService.getAll',
        cacheKey: 'cities_all'
      }
    );
  }
}
