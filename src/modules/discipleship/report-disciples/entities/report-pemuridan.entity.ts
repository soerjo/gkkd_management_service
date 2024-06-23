import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'report_pemuridan' })
export class ReportPemuridanEntity extends MainEntityAbstract {
  @Column({ type: 'date', default: new Date() })
  date: Date;

  @Column({ default: '' })
  material: string;

  @Column()
  total: number;
}
