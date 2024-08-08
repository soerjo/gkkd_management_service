import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
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
import { DisciplesEntity } from '../../disciples/entities/disciples.entity';
import { RegionEntity } from '../../../region/entities/region.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'disciples_group' })
export class DisciplesGroupEntity extends BaseEntity {
  @PrimaryColumn({ unique: true })
  unique_id: string;

  @Column({ generated: 'increment' })
  id: number;

  @Column()
  name: string;

  @Column()
  pembimbing_nim: string;

  @Column()
  pembimbing_id: number;

  @OneToMany(() => DisciplesEntity, (disciples) => disciples.group)
  anggota: DisciplesEntity[];

  @ManyToOne(() => DisciplesEntity)
  @JoinColumn({ name: 'pembimbing_id' })
  pembimbing: DisciplesEntity;

  @Column({ nullable: true })
  region_id?: number;

  @ManyToOne(() => RegionEntity, (region) => region)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

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
    this.unique_id = await DisciplesGroupEntity.createUniqueCode(this.region_id);
  }

  static async createUniqueCode(region_id: number): Promise<string> {
    console.log({ region_id });
    const latestId = await this.createQueryBuilder('disciples_group')
      .orderBy('disciples_group.id', 'DESC')
      .withDeleted()
      .getOne();

    const incrementId = latestId ? latestId.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4);
    const incrementRegionId = ('0000' + region_id).slice(-4);

    return `GD-${incrementRegionId}${incrementIdStr}`;
  }
}
