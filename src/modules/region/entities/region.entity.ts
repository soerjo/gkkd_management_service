import { PemuridanEntity } from '../../pemuridan/entities/pemuridan.entity';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BlesscomnEntity } from '../../blesscomn/entities/blesscomn.entity';
import { ReportRegionEntity } from '../../report-region/entities/report-region.entity';

@Entity({ name: 'region' })
export class RegionEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  alt_name: string;

  @Column()
  location: string;

  @ManyToMany(() => AdminEntity, (admin) => admin.regions, { nullable: true })
  admin: AdminEntity[];

  @OneToMany(type => PemuridanEntity, pemuridan => pemuridan.region)
  pemuridan: PemuridanEntity[];

  @OneToMany(type => BlesscomnEntity, blesscomn => blesscomn.region)
  blesscomn: BlesscomnEntity[];

  @OneToMany(type => ReportRegionEntity, report => report.region)
  report: ReportRegionEntity[];
}
