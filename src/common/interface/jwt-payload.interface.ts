import { RegionEntity } from '../../modules/region/entities/region.entity';
import { RoleEnum } from '../constant/role.constant';

export interface IJwtPayload {
  id: number;
  name: string;
  username: string;
  email: string;
  role: RoleEnum;
  region?: RegionEntity;
  region_id?: number;
  jemaat_id?: number | undefined;
  nij?: string;
  tempPassword?: boolean;
  isPhoneValidate?: boolean;
}
