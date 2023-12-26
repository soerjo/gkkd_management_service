import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1703597921314 implements MigrationInterface {
    name = 'Migrations1703597921314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blesscomn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "location" character varying NOT NULL, "lead" character varying NOT NULL, "members" text NOT NULL, CONSTRAINT "PK_c24102ac08aeb1058a1be77c93b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pemuridan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "lead" character varying NOT NULL, "members" text NOT NULL, "region" character varying, CONSTRAINT "PK_6482bc4ef60e430ad91d874918a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jemaat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying DEFAULT '', "updated_by" character varying DEFAULT '', "deleted_by" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "sexs" character varying NOT NULL, "place_birthday" character varying NOT NULL, "date_birthday" TIMESTAMP NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "father_name" character varying NOT NULL, "mother_name" character varying NOT NULL, "birth_order" integer NOT NULL, "total_brother_sister" integer NOT NULL, "marital_status" boolean NOT NULL, "husband_wife_name" character varying NOT NULL, "wedding_date" TIMESTAMP NOT NULL, "region_service" character varying NOT NULL, CONSTRAINT "PK_004b2720dcf6fbdd1c43afee158" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "jemaat"`);
        await queryRunner.query(`DROP TABLE "pemuridan"`);
        await queryRunner.query(`DROP TABLE "blesscomn"`);
    }

}
