import { RegionEntity } from '../../../modules/region/entities/region.entity';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'segment' })
export class SegmentEntity extends MainEntityAbstract {
  @Column({unique: true})
  name: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  region_id?: number;

  @ManyToOne(() => RegionEntity, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

}
