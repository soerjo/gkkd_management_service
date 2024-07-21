import { GroupDto } from './group.dto';

export class CreateGroupDto extends GroupDto {
  pembimbing_nim: string;
  region_id: number;
}
