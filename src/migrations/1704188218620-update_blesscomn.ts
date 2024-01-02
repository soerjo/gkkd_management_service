import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBlesscomn1704188218620 implements MigrationInterface {
    name = 'UpdateBlesscomn1704188218620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blesscomn" ADD "lead_jemaat_id" uuid`);
        await queryRunner.query(`ALTER TABLE "blesscomn" ADD CONSTRAINT "FK_9c4b1efe25c03c4fd8461c602d6" FOREIGN KEY ("lead_jemaat_id") REFERENCES "jemaat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blesscomn" DROP CONSTRAINT "FK_9c4b1efe25c03c4fd8461c602d6"`);
        await queryRunner.query(`ALTER TABLE "blesscomn" DROP COLUMN "lead_jemaat_id"`);
    }

}
