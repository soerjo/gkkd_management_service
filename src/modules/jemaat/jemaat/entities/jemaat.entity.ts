import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GenderEnum } from '../../../../common/constant/gender.constant';
import { RegionEntity } from 'src/modules/region/entities/region.entity';

@Entity({ name: 'jemaat' })
export class JemaatEntity extends MainEntityAbstract {
  // ----------PERSONAL DATA-------------------
  @Column({ unique: true })
  nij?: string;

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

  // ----------FAMILY DATA-------------------
  @Column({ nullable: true })
  father_name: string;

  @Column({ nullable: true })
  mother_name: string;

  @Column({ nullable: true })
  birth_order: number;

  @Column({ nullable: true })
  total_brother_sister: number;

  // ----------MARITAL DATA-------------------
  @Column({ nullable: true })
  husband_wife_name: string;

  @Column({ nullable: true })
  wedding_date: Date;

  @Column({ nullable: true })
  total_son_daughter: number;

  @Column({ array: true, type: 'simple-array', nullable: true })
  son_daughter_name: string[];

  // ----------BAPTISM DATA-------------------
  @Column({ nullable: true })
  baptism_date: Date;

  @Column({ nullable: true })
  pastor: string;

  @Column({ nullable: true })
  witness_1: string;

  @Column({ nullable: true })
  witness_2: string;

  @Column({ name: 'region_id' })
  region_id: number;

  @ManyToOne(() => RegionEntity, (region) => region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @BeforeInsert()
  async generateUniqueCode() {
    this.nij = await JemaatEntity.createUniqueCode(this.region_id);
  }

  static async createUniqueCode(region_id: number): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of the year
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2); // zero-padded month
    const latestJemaat = await this.createQueryBuilder('jemaat')
      .where('jemaat.region_id = :region_id', { region_id })
      .orderBy('jemaat.id', 'DESC')
      .getOne();

    const incrementId = latestJemaat ? latestJemaat.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4); // zero-padded increment id
    const incrementRegionId = ('0000' + region_id).slice(-4); // zero-padded increment id

    return `${year}${month}${incrementRegionId}${incrementIdStr}`;
  }
}
