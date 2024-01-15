import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './schema/activity.schema';
import response from '../interfaces/response.dto';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Activity', schema: ActivitySchema },
        ]),
    ],
    controllers: [ActivityController],
    providers: [ActivityService, response<Activity>],
})
export class ActivityModule {}
