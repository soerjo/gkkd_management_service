import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1747025647501 implements MigrationInterface {
    name = ' Migration1747025647501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-12T04:54:12.362Z"'`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '"2025-05-12T04:54:12.919Z"'`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" DROP CONSTRAINT "FK_385969a7129605cf8c60b8f8252"`);
        await queryRunner.query(`ALTER TABLE "cermon_report" DROP CONSTRAINT "FK_bce3c9c65b8bb21678a0a987e2f"`);
        await queryRunner.query(`ALTER TABLE "cermon_schedule" DROP CONSTRAINT "PK_a6e88cf8cdf55e493266e5ef397"`);
        await queryRunner.query(`ALTER TABLE "cermon_schedule" ADD CONSTRAINT "UQ_a6e88cf8cdf55e493266e5ef397" UNIQUE ("unique_id")`);
        await queryRunner.query(`ALTER TABLE "cermon_schedule" ADD CONSTRAINT "PK_162a8df02cbb871ac21102fbd23" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" DROP COLUMN "sunday_service_id"`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" ADD "sunday_service_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '"2025-05-12T04:54:13.149Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-12T04:54:13.149Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '"2025-05-12T04:54:13.350Z"'`);
        await queryRunner.query(`ALTER TABLE "cermon_report" DROP CONSTRAINT "UQ_23db4c3848fcecdba5eb37a82dd"`);
        await queryRunner.query(`ALTER TABLE "cermon_report" DROP COLUMN "cermon_id"`);
        await queryRunner.query(`ALTER TABLE "cermon_report" ADD "cermon_id" integer`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '"2025-05-12T04:54:13.504Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("date", "disciple_group_unique_id")`);
        await queryRunner.query(`ALTER TABLE "cermon_report" ADD CONSTRAINT "UQ_23db4c3848fcecdba5eb37a82dd" UNIQUE ("date", "cermon_id")`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" ADD CONSTRAINT "FK_385969a7129605cf8c60b8f8252" FOREIGN KEY ("sunday_service_id") REFERENCES "cermon_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cermon_report" ADD CONSTRAINT "FK_bce3c9c65b8bb21678a0a987e2f" FOREIGN KEY ("cermon_id") REFERENCES "cermon_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cermon_report" DROP CONSTRAINT "FK_bce3c9c65b8bb21678a0a987e2f"`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" DROP CONSTRAINT "FK_385969a7129605cf8c60b8f8252"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "cermon_report" DROP CONSTRAINT "UQ_23db4c3848fcecdba5eb37a82dd"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "cermon_report" DROP COLUMN "cermon_id"`);
        await queryRunner.query(`ALTER TABLE "cermon_report" ADD "cermon_id" character varying`);
        await queryRunner.query(`ALTER TABLE "cermon_report" ADD CONSTRAINT "UQ_23db4c3848fcecdba5eb37a82dd" UNIQUE ("date", "cermon_id")`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("disciple_group_unique_id", "date")`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" DROP COLUMN "sunday_service_id"`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" ADD "sunday_service_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cermon_schedule" DROP CONSTRAINT "PK_162a8df02cbb871ac21102fbd23"`);
        await queryRunner.query(`ALTER TABLE "cermon_schedule" DROP CONSTRAINT "UQ_a6e88cf8cdf55e493266e5ef397"`);
        await queryRunner.query(`ALTER TABLE "cermon_schedule" ADD CONSTRAINT "PK_a6e88cf8cdf55e493266e5ef397" PRIMARY KEY ("unique_id")`);
        await queryRunner.query(`ALTER TABLE "cermon_report" ADD CONSTRAINT "FK_bce3c9c65b8bb21678a0a987e2f" FOREIGN KEY ("cermon_id") REFERENCES "cermon_schedule"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" ADD CONSTRAINT "FK_385969a7129605cf8c60b8f8252" FOREIGN KEY ("sunday_service_id") REFERENCES "cermon_schedule"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-12'`);
    }

}
