import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DisciplesGroupEntity } from '../../disciples-group/entities/disciples-group.entity';

@Entity({ name: 'report_pemuridan' })
export class ReportPemuridanEntity extends MainEntityAbstract {
  @ManyToOne(() => DisciplesGroupEntity)
  @JoinColumn({ name: 'disciple_group_id' })
  disciple_group: DisciplesGroupEntity;

  @Column({ type: 'date', default: new Date() })
  date: Date;

  @Column({ default: '' })
  material: string;

  @Column({ default: 0 })
  total_kehadiran_murid: number;
}
