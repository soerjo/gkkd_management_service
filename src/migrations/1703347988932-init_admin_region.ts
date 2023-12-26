import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAdminRegion1703347988932 implements MigrationInterface {
    name = 'InitAdminRegion1703347988932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "region" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "alt_name" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'ADMIN', "password" character varying, "temp_password" character varying, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_regions_region" ("adminId" uuid NOT NULL, "regionId" uuid NOT NULL, CONSTRAINT "PK_b4098a57cacbf9d7c41638151e2" PRIMARY KEY ("adminId", "regionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_95ce83b40260d834a04eb54882" ON "admin_regions_region" ("adminId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ee19cc0e44a0ea4245af22ee82" ON "admin_regions_region" ("regionId") `);
        await queryRunner.query(`ALTER TABLE "admin_regions_region" ADD CONSTRAINT "FK_95ce83b40260d834a04eb548821" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "admin_regions_region" ADD CONSTRAINT "FK_ee19cc0e44a0ea4245af22ee825" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_regions_region" DROP CONSTRAINT "FK_ee19cc0e44a0ea4245af22ee825"`);
        await queryRunner.query(`ALTER TABLE "admin_regions_region" DROP CONSTRAINT "FK_95ce83b40260d834a04eb548821"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee19cc0e44a0ea4245af22ee82"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95ce83b40260d834a04eb54882"`);
        await queryRunner.query(`DROP TABLE "admin_regions_region"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TABLE "region"`);
    }

}
