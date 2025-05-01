import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1746073015422 implements MigrationInterface {
    name = ' Migration1746073015422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hospitality_data" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "alias" character varying, "gender" character varying NOT NULL DEFAULT 'laki-laki', "blesscomn_id" character varying, "segment_id" integer, "region_id" integer, CONSTRAINT "PK_fd2b19d0858c842b862b55d2031" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hospitality_report" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "hospitality_data_id" integer NOT NULL, "sunday_service_id" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "region_id" integer, CONSTRAINT "PK_d5948c77d63756231681aaf5807" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-01T04:16:59.946Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '"2025-05-01T04:17:00.369Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-01T04:17:00.369Z"'`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '"2025-05-01T04:17:00.710Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '"2025-05-01T04:17:00.925Z"'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '"2025-05-01T04:17:01.072Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("date", "disciple_group_unique_id")`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" ADD CONSTRAINT "FK_59f82a0365f506ff4bd9c2a7d6e" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" ADD CONSTRAINT "FK_c716a1a2162dcaa2356e6b1ce6c" FOREIGN KEY ("segment_id") REFERENCES "segment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" ADD CONSTRAINT "FK_4a07c70e1488072314bcf3c6f94" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" ADD CONSTRAINT "FK_385969a7129605cf8c60b8f8252" FOREIGN KEY ("sunday_service_id") REFERENCES "cermon_schedule"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" ADD CONSTRAINT "FK_65ae38fafda3a57242e6b980114" FOREIGN KEY ("hospitality_data_id") REFERENCES "hospitality_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" ADD CONSTRAINT "FK_640f0780e725d5b7a51e4576edb" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hospitality_report" DROP CONSTRAINT "FK_640f0780e725d5b7a51e4576edb"`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" DROP CONSTRAINT "FK_65ae38fafda3a57242e6b980114"`);
        await queryRunner.query(`ALTER TABLE "hospitality_report" DROP CONSTRAINT "FK_385969a7129605cf8c60b8f8252"`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" DROP CONSTRAINT "FK_4a07c70e1488072314bcf3c6f94"`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" DROP CONSTRAINT "FK_c716a1a2162dcaa2356e6b1ce6c"`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" DROP CONSTRAINT "FK_59f82a0365f506ff4bd9c2a7d6e"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("disciple_group_unique_id", "date")`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`DROP TABLE "hospitality_report"`);
        await queryRunner.query(`DROP TABLE "hospitality_data"`);
    }

}
