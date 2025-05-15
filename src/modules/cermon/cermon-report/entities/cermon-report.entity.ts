import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { CermonScheduleEntity } from '../../cermon-schedule/entities/cermon-schedule.entity';

@Entity({ name: 'cermon_report' })
@Unique(['date', 'cermon_id'])
export class CermonReportEntity extends MainEntityAbstract {
  @Column({ nullable: true })
  cermon_id: number;

  @Column({ nullable: true })
  region_id: number;

  @ManyToOne(() => CermonScheduleEntity, { nullable: true })
  @JoinColumn({ name: 'cermon_id' })
  cermon: CermonScheduleEntity;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  total_male: number;

  @Column()
  total_female: number;

  @Column()
  total_new_male: number;

  @Column()
  total_new_female: number;

  @Column({ default: false, type: 'boolean' })
  is_sync: boolean;
}
