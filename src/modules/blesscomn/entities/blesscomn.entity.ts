import { RegionEntity } from '../../region/entities/region.entity';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'blesscomn' })
export class BlesscomnEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  lead: string;

  @Column('simple-array')
  members: string[];

  @ManyToOne(type => RegionEntity, region => region.blesscomn)
  @JoinColumn({name : 'region_id'})
  region: RegionEntity

}
