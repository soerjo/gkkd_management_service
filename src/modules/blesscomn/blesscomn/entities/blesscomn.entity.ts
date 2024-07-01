import { RegionEntity } from '../../../region/entities/region.entity';
import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';

@Entity({ name: 'blesscomn' })
export class BlesscomnEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column('simple-array', { default: [] })
  members: string[];

  @ManyToOne(() => JemaatEntity)
  @JoinColumn({ name: 'lead_jemaat_id' })
  lead: JemaatEntity;

  @ManyToOne(() => RegionEntity, (region) => region.blesscomn)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;
}
