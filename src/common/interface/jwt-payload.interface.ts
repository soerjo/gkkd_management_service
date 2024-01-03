import { RegionEntity } from 'src/modules/region/entities/region.entity';
import { RoleEnum } from '../constant/role.constant';

export interface IJwtPayload {
  username: string;
  email: string;
  role: RoleEnum[];
  regions?: RegionEntity[] | undefined;
  jemaat_id?: string | undefined;
}
