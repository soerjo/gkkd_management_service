import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CermonScheduleEntity } from '../../cermon-schedule/entities/cermon-schedule.entity';

@Entity({ name: 'cermon_report' })
export class CermonReportEntity extends MainEntityAbstract {
  @Column()
  cermon_schedule_id: number;

  @ManyToOne(() => CermonScheduleEntity, { nullable: true })
  @JoinColumn({ name: 'cermon_schedule_id' })
  cermon_schedule: CermonScheduleEntity;

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
}
