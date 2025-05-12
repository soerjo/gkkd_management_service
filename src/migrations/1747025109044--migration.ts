import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1747025109044 implements MigrationInterface {
    name = ' Migration1747025109044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-12T04:45:14.372Z"'`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" DROP CONSTRAINT "FK_59f82a0365f506ff4bd9c2a7d6e"`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" DROP CONSTRAINT "FK_92117f16a9331d7951d48a65f52"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "FK_055a645a861a02717154740d0b5"`);
        await queryRunner.query(`ALTER TABLE "blesscomn" DROP CONSTRAINT "PK_64eb2da04609b0c5c8a60560694"`);
        await queryRunner.query(`ALTER TABLE "blesscomn" ADD CONSTRAINT "UQ_64eb2da04609b0c5c8a60560694" UNIQUE ("unique_id")`);
        await queryRunner.query(`ALTER TABLE "blesscomn" ADD CONSTRAINT "PK_c24102ac08aeb1058a1be77c93b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" DROP COLUMN "blesscomn_id"`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" ADD "blesscomn_id" integer`);
        await queryRunner.query(`ALTER TABLE "segment" ADD CONSTRAINT "UQ_9e0406598d248857fe96f5e929d" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '"2025-05-12T04:45:14.880Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-12T04:45:14.880Z"'`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" DROP COLUMN "blesscomn_id"`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" ADD "blesscomn_id" integer`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '"2025-05-12T04:45:15.257Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '"2025-05-12T04:45:15.598Z"'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '"2025-05-12T04:45:15.685Z"'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP COLUMN "blesscomn_id"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD "blesscomn_id" integer`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("date", "disciple_group_unique_id")`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" ADD CONSTRAINT "FK_92117f16a9331d7951d48a65f52" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" ADD CONSTRAINT "FK_59f82a0365f506ff4bd9c2a7d6e" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "FK_055a645a861a02717154740d0b5" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "FK_055a645a861a02717154740d0b5"`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" DROP CONSTRAINT "FK_59f82a0365f506ff4bd9c2a7d6e"`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" DROP CONSTRAINT "FK_92117f16a9331d7951d48a65f52"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP COLUMN "blesscomn_id"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD "blesscomn_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("disciple_group_unique_id", "date")`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" DROP COLUMN "blesscomn_id"`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" ADD "blesscomn_id" character varying`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '2025-05-01'`);
        await queryRunner.query(`ALTER TABLE "segment" DROP CONSTRAINT "UQ_9e0406598d248857fe96f5e929d"`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" DROP COLUMN "blesscomn_id"`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" ADD "blesscomn_id" character varying`);
        await queryRunner.query(`ALTER TABLE "blesscomn" DROP CONSTRAINT "PK_c24102ac08aeb1058a1be77c93b"`);
        await queryRunner.query(`ALTER TABLE "blesscomn" DROP CONSTRAINT "UQ_64eb2da04609b0c5c8a60560694"`);
        await queryRunner.query(`ALTER TABLE "blesscomn" ADD CONSTRAINT "PK_64eb2da04609b0c5c8a60560694" PRIMARY KEY ("unique_id")`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "FK_055a645a861a02717154740d0b5" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blesscomn-user" ADD CONSTRAINT "FK_92117f16a9331d7951d48a65f52" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospitality_data" ADD CONSTRAINT "FK_59f82a0365f506ff4bd9c2a7d6e" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-01'`);
    }

}
