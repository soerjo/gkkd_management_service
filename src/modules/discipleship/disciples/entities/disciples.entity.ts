import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';
import { DisciplesGroupEntity } from '../../disciples-group/entities/disciples-group.entity';

@Entity({ name: 'disciples' })
export class DisciplesEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column({ nullable: true })
  book_level: string;

  @OneToOne(() => JemaatEntity, { nullable: true })
  @JoinColumn({ name: 'jemaat_id' })
  jemaat: JemaatEntity;

  @ManyToOne(() => DisciplesEntity, { nullable: true })
  @JoinColumn({ name: 'pembimbing_id' })
  pembimbing: DisciplesEntity;

  @ManyToOne(() => DisciplesGroupEntity, { nullable: true })
  @JoinColumn({ name: 'disciple_group_id' })
  disciple_group: DisciplesGroupEntity;

  @OneToMany(() => DisciplesEntity, (disciples) => disciples.pembimbing)
  murid: DisciplesEntity[];
}
