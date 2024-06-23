import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationBlesscomnDto } from './create-organization-blesscomn.dto';

export class UpdateOrganizationBlesscomnDto extends PartialType(CreateOrganizationBlesscomnDto) {}
