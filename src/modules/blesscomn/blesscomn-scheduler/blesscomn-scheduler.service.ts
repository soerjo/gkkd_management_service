import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AdminService } from '../../admin/services/admin.service';
import { RoleEnum } from '../../../common/constant/role.constant';
import { BotService } from '../../bot/bot.service';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { ParameterService } from '../../parameter/services/parameter.service';
import { ReportBlesscomnService } from '../report-blesscomn/services/report-blesscomn.service';

@Injectable()
export class BlesscomnSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(BlesscomnSchedulerService.name);

  constructor(
    @Inject(forwardRef(() => ReportBlesscomnService))
    private readonly cermonReportService: ReportBlesscomnService,
    private readonly adminService: AdminService,
    private readonly botService: BotService,
    private readonly paramService: ParameterService,
  ) {}

  onModuleInit() {
    // throw new Error('Method not implemented.');
    // this.handletWeekly();
  }

  @Cron('0 0 15 * *') //EVERY_15TH_DAY_OF_MONTH
  async handleMonthly() {
    this.logger.debug('handleMonthly');
  }

  @Cron('0 19 * * 0') //EVERY_SUNDAY_7_PM
  async handletWeekly(region_id?: number) {
    this.logger.debug('handletWeekly');

    const report = await this.cermonReportService.getReportByRegion({ region_id });
    const regionNotReport = report.map((report) => report.region_id);
    const regionList = new Set(regionNotReport);
    const { entities } = await this.adminService.getAll({
      region_ids: Array.from(regionList),
      role: RoleEnum.LEADER,
    });

    const userList: AdminEntity[] = entities;

    for (const user of userList) {
      if (user?.telegram_user_id && user?.blesscomn?.length) {
        for (const blesscomn of user.blesscomn) {
          const userReportList = report.filter(
            (reportData) => reportData.blesscomn_unique_id === blesscomn.blesscomn_id,
          );
          for (const userReport of userReportList) {
            const message = await this.generateMessage(user, userReport);
            if (message) await this.botService.sendMail({ telegram_user_id: user.telegram_user_id, message: message });
          }
        }
      }
    }
  }

  async generateMessage(user: AdminEntity, report: any) {
    const messageParams = await this.paramService.getOneByKey('TELEGRAM_REMINDER');
    const message = messageParams?.name;
    if (!message) return;
    const values = {
      ':admin_name': user?.name,
      ':category': 'Fellowship',
      ':name': report.blesscomn_name,
    };

    return message.replace(/:(admin_name|category|name)/g, (match) => values[match] || match);
  }
}
