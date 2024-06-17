import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SundayServiceEntity } from 'src/modules/sunday-service/entities/sunday-service.entity';

@Entity({ name: 'report_region' })
export class ReportRegionEntity extends MainEntityAbstract {
  @Column({ type: 'date', default: new Date() })
  date: Date;

  @Column()
  total_male: number;

  @Column()
  total_female: number;

  @Column()
  total: number;

  @Column()
  new: number;

  // @Column({ nullable: true })
  // sunday_service_id?: number;

  @ManyToOne((type) => SundayServiceEntity, (region) => region.report)
  @JoinColumn({ name: 'sunday_service_id' })
  sunday_service: SundayServiceEntity;
}
