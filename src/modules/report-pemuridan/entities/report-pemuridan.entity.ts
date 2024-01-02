import { MainEntityAbstract } from "../../../common/abstract/main-entity.abstract";
import { Column, Entity } from "typeorm";

@Entity({name: 'report_pemuridan'})
export class ReportPemuridanEntity extends MainEntityAbstract {
    @Column()
    date: Date

    @Column({default: ''})
    material: string

    @Column()
    total: number
}
