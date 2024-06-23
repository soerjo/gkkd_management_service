import { PartialType } from '@nestjs/swagger';
import { CreateJadwalIbadahDto } from './create-jadwal-ibadah.dto';

export class UpdateJadwalIbadahDto extends PartialType(CreateJadwalIbadahDto) {}
