import { MainEntityAbstract } from "../../../common/abstract/main-entity.abstract";
import { Column, Entity } from "typeorm";

@Entity({name: 'report_blesscomn'})
export class ReportBlesscomnEntity extends MainEntityAbstract {
    @Column()
    date: Date

    @Column()
    total_male: number

    @Column()
    total_female: number

    @Column()
    total: number

    @Column()
    new: number
}
