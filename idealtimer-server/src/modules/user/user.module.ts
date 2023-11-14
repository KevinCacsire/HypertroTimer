import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WorkoutsService } from '../workouts/workouts.service';
import { SplitsService } from '../splits/splits.service';

@Module({
  controllers: [UserController],
  providers: [UserService, WorkoutsService, SplitsService]
})
export class UserModule {}
