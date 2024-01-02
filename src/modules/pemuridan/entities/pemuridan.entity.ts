import { RegionEntity } from '../../region/entities/region.entity';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { JemaatEntity } from '../../jemaat/entities/jemaat.entity';
import { ReportPemuridanEntity } from '../../report-pemuridan/entities/report-pemuridan.entity';

@Entity({ name: 'pemuridan' })
export class PemuridanEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column('simple-array')
  members: string[];

  @Column({default: ""})
  book_level: string;

  @ManyToOne(type => JemaatEntity, region => region.pemuridan)
  @JoinColumn({name : 'lead_id'})
  lead: JemaatEntity

  @ManyToOne(type => RegionEntity, region => region.pemuridan)
  @JoinColumn({name : 'region_id'})
  region: RegionEntity

  @OneToMany(type => ReportPemuridanEntity, report => report.pemuridan)
  report: ReportPemuridanEntity[];
}
