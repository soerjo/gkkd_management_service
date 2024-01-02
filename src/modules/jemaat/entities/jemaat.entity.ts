import { PemuridanEntity } from '../../pemuridan/entities/pemuridan.entity';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'jemaat' })
export class JemaatEntity extends MainEntityAbstract {
  @Column()
  full_name: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  sexs: string;

  @Column()
  place_birthday: string;

  @Column()
  date_birthday: Date;

  @Column()
  phone_number: string;

  @Column()
  address: string;

  @Column()
  father_name: string;

  @Column()
  mother_name: string;

  @Column()
  birth_order: number;

  @Column()
  total_brother_sister: number;

  @Column()
  marital_status: boolean;

  @Column()
  husband_wife_name: string;

  @Column()
  wedding_date: Date;

  @Column()
  region_service: string;

  @OneToMany(type => PemuridanEntity, pemuridan => pemuridan.lead)
  pemuridan: PemuridanEntity[];
}
