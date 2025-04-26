import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { BlesscomnEntity } from '../../../../modules/blesscomn/blesscomn/entities/blesscomn.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity({ name: 'report_blesscomn' })
@Unique(['date', 'blesscomn_id'])
export class ReportBlesscomnEntity extends MainEntityAbstract {
  @Column({ type: 'date', default: new Date() })
  date: Date;

  @Column({ default: 0 })
  total_male: number;

  @Column({ default: 0 })
  total_female: number;

  @Column({ default: 0 })
  new_male: number;

  @Column({ default: 0 })
  new_female: number;

  @Column({ default: 0 })
  total: number;

  @Column({ default: 0 })
  new: number;

  @Column()
  blesscomn_id: string;

  @ManyToOne((type) => BlesscomnEntity)
  @JoinColumn({ name: 'blesscomn_id' })
  blesscomn: BlesscomnEntity;

  @Column({ default: false, type: 'boolean' })
  is_sync: boolean;

}
