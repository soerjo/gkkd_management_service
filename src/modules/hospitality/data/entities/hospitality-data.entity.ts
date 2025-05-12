import { RegionEntity } from '../../../../modules/region/entities/region.entity';
import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GenderEnum } from '../../../../common/constant/gender.constant';
import { SegmentEntity } from '../../../../modules/segment/entities/segment.entity';
import { BlesscomnEntity } from '../../../../modules/blesscomn/blesscomn/entities/blesscomn.entity';

@Entity({ name: 'hospitality_data' })
export class HospitaltityDataEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column({ nullable: true })
  alias?: string;

  @Column({ default: GenderEnum.MALE })
  gender: string;

  @Column({ nullable: true })
  blesscomn_id?: number;

  @Column({ nullable: true })
  segment_id?: number;

  @Column({ nullable: true })
  region_id?: number;

  @ManyToOne(() => BlesscomnEntity, { nullable: true })
  @JoinColumn({ name: 'blesscomn_id', })
  blesscomn: BlesscomnEntity;

  @ManyToOne(() => SegmentEntity, { nullable: true })
  @JoinColumn({ name: 'segment_id' })
  segment: SegmentEntity;

  @ManyToOne(() => RegionEntity, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;
}
