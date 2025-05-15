import { RegionEntity } from '../../../../modules/region/entities/region.entity';
import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { HospitaltityDataEntity } from '../../data/entities/hospitality-data.entity';
import { CermonScheduleEntity } from '../../../../modules/cermon/cermon-schedule/entities/cermon-schedule.entity';

@Entity({ name: 'hospitality_report' })
export class HospitalityReportEntity extends MainEntityAbstract {
  @Column()
  hospitality_data_id: number;

  @Column()
  sunday_service_id: number;

  @Column({type: 'date'})
  date: Date|string;

  @Column({ nullable: true })
  region_id?: number;

  @ManyToOne(() => CermonScheduleEntity, { nullable: true })
  @JoinColumn({ name: 'sunday_service_id' })
  sunday_service: CermonScheduleEntity;

  @ManyToOne(() => HospitaltityDataEntity, { nullable: true })
  @JoinColumn({ name: 'hospitality_data_id' })
  hospitality_data: HospitaltityDataEntity;

  @ManyToOne(() => RegionEntity, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;


}
