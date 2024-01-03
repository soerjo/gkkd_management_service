import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBlesscomn1704266502642 implements MigrationInterface {
    name = 'UpdateBlesscomn1704266502642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blesscomn" ALTER COLUMN "members" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blesscomn" ALTER COLUMN "members" DROP DEFAULT`);
    }

}
