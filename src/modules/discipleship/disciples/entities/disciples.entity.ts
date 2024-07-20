import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';
import { DisciplesGroupEntity } from '../../disciples-group/entities/disciples-group.entity';
import { RegionEntity } from '../../../region/entities/region.entity';
import { AdminEntity } from '../../../admin/entities/admin.entity';

@Entity({ name: 'disciples' })
export class DisciplesEntity extends MainEntityAbstract {
  @Column({ unique: true })
  nim: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  book_level: string;

  @Column({ nullable: true })
  jemaat_nik: string;

  @Column({ nullable: true })
  pembimbing_id: string;

  @Column({ nullable: true })
  disciple_group_id: string;

  @Column({ nullable: true })
  admin_id: string;

  @OneToOne(() => AdminEntity)
  @JoinColumn({ name: 'admin_id' })
  admin: AdminEntity;

  @OneToOne(() => JemaatEntity, { nullable: true })
  @JoinColumn({ name: 'jemaat_id' })
  jemaat: JemaatEntity;

  @ManyToOne(() => DisciplesEntity, { nullable: true })
  @JoinColumn({ name: 'pembimbing_id' })
  pembimbing: DisciplesEntity;

  @ManyToOne(() => DisciplesGroupEntity, { nullable: true })
  @JoinColumn({ name: 'disciple_group_id' })
  disciple_group: DisciplesGroupEntity;

  @OneToMany(() => DisciplesGroupEntity, (group) => group.pembimbing, { nullable: true })
  group: DisciplesGroupEntity[];

  @OneToMany(() => DisciplesEntity, (disciples) => disciples.pembimbing)
  murid: DisciplesEntity[];

  @Column({ name: 'region_id' })
  region_id: number;

  @ManyToOne(() => RegionEntity, (region) => region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @BeforeInsert()
  async generateUniqueCode() {
    this.nim = await JemaatEntity.createUniqueCode(this.region_id);
  }

  static async createUniqueCode(region_id: number): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of the year
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2); // zero-padded month
    const latestJemaat = await this.createQueryBuilder('disciples')
      .where('disciples.region_id = :region_id', { region_id })
      .orderBy('disciples.id', 'DESC')
      .withDeleted()
      .getOne();

    const incrementId = latestJemaat ? latestJemaat.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4); // zero-padded increment id
    const incrementRegionId = ('0000' + region_id).slice(-4); // zero-padded increment id

    return `${year}${month}${incrementRegionId}${incrementIdStr}`;
  }
}
