import { PartialType } from '@nestjs/swagger';
import { CreateBlesscomnDto } from './create-blesscomn.dto';

export class UpdateBlesscomnDto extends PartialType(CreateBlesscomnDto) {}
