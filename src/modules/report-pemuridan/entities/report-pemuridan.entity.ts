import { PemuridanEntity } from "../../pemuridan/entities/pemuridan.entity";
import { MainEntityAbstract } from "../../../common/abstract/main-entity.abstract";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({name: 'report_pemuridan'})
export class ReportPemuridanEntity extends MainEntityAbstract {
    @Column()
    date: Date

    @Column({default: ''})
    material: string

    @Column()
    total: number

    @ManyToOne(type => PemuridanEntity, pemuridan => pemuridan.report)
    @JoinColumn({name : 'pemuridan_id'})
    pemuridan: PemuridanEntity

}
