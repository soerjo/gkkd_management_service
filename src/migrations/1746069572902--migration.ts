import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1746069572902 implements MigrationInterface {
    name = ' Migration1746069572902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "segment" ("id" SERIAL NOT NULL, "created_by" integer, "updated_by" integer, "deleted_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "alias" character varying, "description" character varying, "region_id" integer, CONSTRAINT "PK_d648ac58d8e0532689dfb8ad7ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-01T03:19:37.293Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '"2025-05-01T03:19:37.684Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-01T03:19:37.684Z"'`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '"2025-05-01T03:19:37.891Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '"2025-05-01T03:19:38.079Z"'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '"2025-05-01T03:19:38.339Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("date", "disciple_group_unique_id")`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "segment" ADD CONSTRAINT "FK_2943b3fed795de83600b07aec27" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "segment" DROP CONSTRAINT "FK_2943b3fed795de83600b07aec27"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '2025-04-28'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '2025-04-28'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("disciple_group_unique_id", "date")`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '2025-04-28'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '2025-04-28'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '2025-04-28'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '2025-04-28'`);
        await queryRunner.query(`DROP TABLE "segment"`);
    }

}
