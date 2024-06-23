import { PartialType } from '@nestjs/swagger';
import { CreateMaritalDto } from './create-marital.dto';

export class UpdateMaritalDto extends PartialType(CreateMaritalDto) {}
