import { RegionEntity } from '../../../region/entities/region.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';
import { BlesscomnAdminEntity } from './blesscomn-admin.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'blesscomn' })
export class BlesscomnEntity extends BaseEntity {
  @Column({ unique: true })
  unique_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  day: string;

  @Column({ nullable: true })
  segment?: string;

  @Column({ nullable: true })
  location?: string;

  @Column('simple-array', { default: [] })
  members: string[];

  @Column({ nullable: true })
  lead_id?: number;

  @ManyToOne(() => JemaatEntity)
  @JoinColumn({ name: 'lead_id' })
  lead: JemaatEntity;

  @Column({ nullable: true })
  region_id: number;

  @ManyToOne(() => RegionEntity, (region) => region.blesscomn)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @OneToMany(() => BlesscomnAdminEntity, (admin) => admin.blesscomn, { nullable: true })
  admin: BlesscomnAdminEntity[];

  @PrimaryColumn({ generated: 'increment', unique: true })
  id: number;

  @Exclude()
  @Column({ nullable: true })
  created_by: number;

  @Exclude()
  @Column({ nullable: true })
  updated_by: number;

  @Exclude()
  @Column({ nullable: true })
  deleted_by: number;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  async generateUniqueCode() {
    this.unique_id = await BlesscomnEntity.createUniqueCode(this.region_id);
  }

  static async createUniqueCode(region_id: number): Promise<string> {
    const latestId = await this.createQueryBuilder('blesscomn')
      .where('blesscomn.region_id = :region_id', { region_id })
      .orderBy('blesscomn.id', 'DESC')
      .withDeleted()
      .getOne();

    const incrementId = latestId ? latestId.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4);
    const incrementRegionId = ('0000' + region_id).slice(-4);

    return `BC-${incrementRegionId}${incrementIdStr}`;
  }
}
