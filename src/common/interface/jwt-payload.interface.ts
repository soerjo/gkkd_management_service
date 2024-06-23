import { RegionEntity } from 'src/modules/region/entities/region.entity';
import { RoleEnum } from '../constant/role.constant';

export interface IJwtPayload {
  id: number;
  username: string;
  email: string;
  role: RoleEnum;
  region?: RegionEntity;
  jemaat_id?: number | undefined;
  nij?: string;
  tempPassword: boolean;
}
