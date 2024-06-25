import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { BlesscomnEntity } from 'src/modules/blesscomn/blesscomn/entities/blesscomn.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'report_blesscomn' })
export class ReportBlesscomnEntity extends MainEntityAbstract {
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

  @ManyToOne((type) => BlesscomnEntity)
  @JoinColumn({ name: 'blesscomn_id' })
  blesscomn: BlesscomnEntity;
}
