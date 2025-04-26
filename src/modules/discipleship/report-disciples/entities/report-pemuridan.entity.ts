import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { DisciplesGroupEntity } from '../../disciples-group/entities/disciples-group.entity';

@Entity({ name: 'report_pemuridan' })
@Unique(['date', 'disciple_group_unique_id'])
export class ReportPemuridanEntity extends MainEntityAbstract {
  @Column()
  disciple_group_unique_id: string;

  @ManyToOne(() => DisciplesGroupEntity)
  @JoinColumn({ name: 'disciple_group_unique_id' })
  disciple_group: DisciplesGroupEntity;

  @Column({ type: 'date', default: new Date() })
  date: Date;

  @Column({ default: '' })
  material: string;

  @Column({ nullable: true })
  pembimbing_nim: string;

  @Column({ nullable: true })
  region_id?: number;

  @Column({ default: false, type: 'boolean' })
  is_sync: boolean;
}
