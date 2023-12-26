import { PartialType } from '@nestjs/swagger';
import { CreatePemuridanDto } from './create-pemuridan.dto';

export class UpdatePemuridanDto extends PartialType(CreatePemuridanDto) {}
