import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GenderEnum } from '../../../common/constant/gender.constant';
import { PemuridanEntity } from 'src/modules/pemuridan/entities/pemuridan.entity';
import { RegionEntity } from 'src/modules/region/entities/region.entity';
import { BlesscomnEntity } from 'src/modules/blesscomn/entities/blesscomn.entity';

@Entity({ name: 'jemaat' })
export class JemaatEntity extends MainEntityAbstract {
  @Column()
  full_name: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: GenderEnum.MALE })
  gender: string;

  @Column()
  place_birthday: string;

  @Column({ type: 'date', default: new Date() })
  date_birthday: Date;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  father_name: string;

  @Column({ nullable: true })
  mother_name: string;

  @Column({ nullable: true })
  birth_order: number;

  @Column({ nullable: true })
  total_brother_sister: number;

  @Column({ default: false })
  marital_status: boolean;

  @Column({ nullable: true })
  husband_wife_name: string;

  @Column({ nullable: true })
  wedding_date: Date;

  @Column({ nullable: true })
  region_service: string;

  @OneToMany((type) => PemuridanEntity, (pemuridan) => pemuridan.lead, { nullable: true })
  pemuridan: PemuridanEntity[];

  @ManyToOne((type) => RegionEntity, (region) => region.jemaat, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @OneToMany((type) => BlesscomnEntity, (blesscomn) => blesscomn.lead, { nullable: true })
  lead_blesscomn: BlesscomnEntity[];
}
