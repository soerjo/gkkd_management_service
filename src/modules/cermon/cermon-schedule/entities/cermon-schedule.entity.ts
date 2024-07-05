import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'cermon_schedule' })
export class CermonScheduleEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  time: string;

  @Column()
  region_id: number;

  @Column()
  segement: string;

  @Column()
  description: string;
}
