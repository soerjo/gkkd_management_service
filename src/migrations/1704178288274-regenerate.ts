import { MigrationInterface, QueryRunner } from "typeorm";

export class Regenerate1704178288274 implements MigrationInterface {
    name = 'Regenerate1704178288274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report_region" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "date" TIMESTAMP NOT NULL, "total_male" integer NOT NULL, "total_female" integer NOT NULL, "total" integer NOT NULL, "new" integer NOT NULL, CONSTRAINT "PK_f9a58a3983576e86bda3dc30317" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_blesscomn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "date" TIMESTAMP NOT NULL, "total_male" integer NOT NULL, "total_female" integer NOT NULL, "total" integer NOT NULL, "new" integer NOT NULL, CONSTRAINT "PK_a60e56f82b88650741d5738c3f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_pemuridan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "date" TIMESTAMP NOT NULL, "total_male" integer NOT NULL, "total_female" integer NOT NULL, "total" integer NOT NULL, "new" integer NOT NULL, CONSTRAINT "PK_d688f8150f714df3ae844a0fadc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "UQ_de87485f6489f5d0995f5841952"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email")`);
        await queryRunner.query(`DROP TABLE "report_pemuridan"`);
        await queryRunner.query(`DROP TABLE "report_blesscomn"`);
        await queryRunner.query(`DROP TABLE "report_region"`);
    }

}
