import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DisciplesEntity } from '../../disciples/entities/disciples.entity';

@Entity({ name: 'disciples_group' })
export class DisciplesGroupEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @OneToMany(() => DisciplesEntity, (disciples) => disciples.disciple_group, { nullable: true })
  anggota: DisciplesEntity[];

  @ManyToOne(() => DisciplesEntity)
  @JoinColumn({ name: 'pembimbing_id' })
  pembimbing: DisciplesEntity;
}
