import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MonthlyViewResetService {
  private readonly logger = new Logger(MonthlyViewResetService.name);
  constructor(private readonly prisma: PrismaService) {}

  // Chạy vào 0h ngày đầu tháng
  @Cron('0 0 1 * *')
  async resetMonthlyViews() {
    await this.prisma.food.updateMany({ data: { monthlyView: 0 } });
    this.logger.log('All monthlyView reset to 0');
  }
}
