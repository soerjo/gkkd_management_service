import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationWithRegion1704183663210 implements MigrationInterface {
    name = 'UpdateRelationWithRegion1704183663210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pemuridan" DROP COLUMN "lead"`);
        await queryRunner.query(`ALTER TABLE "pemuridan" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP COLUMN "new"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP COLUMN "total_male"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP COLUMN "total_female"`);
        await queryRunner.query(`ALTER TABLE "pemuridan" ADD "lead_id" uuid`);
        await queryRunner.query(`ALTER TABLE "pemuridan" ADD "region_id" uuid`);
        await queryRunner.query(`ALTER TABLE "blesscomn" ADD "region_id" uuid`);
        await queryRunner.query(`ALTER TABLE "report_region" ADD "region_id" uuid`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD "material" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "pemuridan" ADD CONSTRAINT "FK_45650c289b0da6d59c3a609bac6" FOREIGN KEY ("lead_id") REFERENCES "jemaat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pemuridan" ADD CONSTRAINT "FK_5fb50bfa59209c845c02bc2c94c" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blesscomn" ADD CONSTRAINT "FK_fa3f88f1bb6a85328d326dd6a4c" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_region" ADD CONSTRAINT "FK_64bab995ef2e20cc47ff56099bd" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_region" DROP CONSTRAINT "FK_64bab995ef2e20cc47ff56099bd"`);
        await queryRunner.query(`ALTER TABLE "blesscomn" DROP CONSTRAINT "FK_fa3f88f1bb6a85328d326dd6a4c"`);
        await queryRunner.query(`ALTER TABLE "pemuridan" DROP CONSTRAINT "FK_5fb50bfa59209c845c02bc2c94c"`);
        await queryRunner.query(`ALTER TABLE "pemuridan" DROP CONSTRAINT "FK_45650c289b0da6d59c3a609bac6"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP COLUMN "material"`);
        await queryRunner.query(`ALTER TABLE "report_region" DROP COLUMN "region_id"`);
        await queryRunner.query(`ALTER TABLE "blesscomn" DROP COLUMN "region_id"`);
        await queryRunner.query(`ALTER TABLE "pemuridan" DROP COLUMN "region_id"`);
        await queryRunner.query(`ALTER TABLE "pemuridan" DROP COLUMN "lead_id"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD "total_female" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD "total_male" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD "new" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pemuridan" ADD "region" character varying`);
        await queryRunner.query(`ALTER TABLE "pemuridan" ADD "lead" character varying NOT NULL`);
    }

}
