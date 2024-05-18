import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { SegmentEnum } from 'src/common/constant/segment.constant';
import { ReportRegionEntity } from 'src/modules/report-region/entities/report-region.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'sunday-service' })
export class SundayServiceEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  time: string;

  @Column()
  segment: SegmentEnum;

  @OneToMany((type) => ReportRegionEntity, (report) => report.sunday_service)
  report: ReportRegionEntity[];

  @ManyToOne((type) => SundayServiceEntity, (region) => region.report)
  @JoinColumn({ name: 'region_id' })
  region: SundayServiceEntity;
}
