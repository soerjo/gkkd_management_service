import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'pemuridan' })
export class PemuridanEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  lead: string;

  @Column('simple-array')
  members: string[];

  @Column({ nullable: true })
  region: string;

  @Column({default: ""})
  book_level: string;
}
