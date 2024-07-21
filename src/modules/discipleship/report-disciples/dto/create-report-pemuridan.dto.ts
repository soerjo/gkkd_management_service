import { ReportPemuridanDto } from './report-pemuridan.dto';

export class CreateReportPemuridanDto extends ReportPemuridanDto {
  region_tree_id: number;
  region_ids: number[];
  region_id: number;

  pembimbing_nim: string;
}
