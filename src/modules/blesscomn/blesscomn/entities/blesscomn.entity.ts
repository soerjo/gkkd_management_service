import { RegionEntity } from '../../../region/entities/region.entity';
import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';

@Entity({ name: 'blesscomn' })
export class BlesscomnEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  day: string;

  @Column({ nullable: true })
  segment?: string;

  @Column({ nullable: true })
  location?: string;

  @Column('simple-array', { default: [] })
  members: string[];

  @Column({ nullable: true })
  lead_id?: number;

  @ManyToOne(() => JemaatEntity)
  @JoinColumn({ name: 'lead_id' })
  lead: JemaatEntity;

  @Column({ nullable: true })
  region_id: number;

  @ManyToOne(() => RegionEntity, (region) => region.blesscomn)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;
}
