import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'cermon_schedule' })
export class CermonScheduleEntity extends MainEntityAbstract {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  day: string;

  @Column({ nullable: true })
  region_id: number;

  @Column({ nullable: true })
  segment: string;

  @Column({ nullable: true })
  description: string;
}
