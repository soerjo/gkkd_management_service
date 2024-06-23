import { PartialType } from '@nestjs/swagger';
import { CreatePenyerahanAnakDto } from './create-penyerahan-anak.dto';

export class UpdatePenyerahanAnakDto extends PartialType(CreatePenyerahanAnakDto) {}
