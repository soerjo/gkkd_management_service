import { Module } from '@nestjs/common';
import { SegmentService } from './services/segment.service';
import { SegmentController } from './controllers/segment.controller';
import { SegmentRepository } from './repositories/segment.repository';

@Module({
  controllers: [SegmentController],
  providers: [SegmentService, SegmentRepository],
  exports: [SegmentService],
})
export class SegmentModule {}
