import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { RegionEntity } from '../../../../modules/region/entities/region.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'cermon_schedule' })
export class CermonScheduleEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  time: string;

  @Column()
  region_id: number;

  @ManyToOne(() => RegionEntity, (region) => region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @Column()
  segement: string;

  @Column()
  description: string;
}
