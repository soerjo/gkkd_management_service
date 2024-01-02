import { BlesscomnEntity } from "../../blesscomn/entities/blesscomn.entity";
import { MainEntityAbstract } from "../../../common/abstract/main-entity.abstract";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

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

    @ManyToOne(type => BlesscomnEntity, region => region.report)
    @JoinColumn({name : 'blesscomn_id'})
    blesscomn: BlesscomnEntity

}
