import {
    Controller,
    Get,
    Body,
    Post,
    Param,
    Delete,
    Patch,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('activity')
export class ActivityController {
    constructor(private activityService: ActivityService) {}

    @Post('migration')
    migrate(@Body() body: CreateActivityDto) {
        return this.activityService.create(body);
    }

    @Patch('complete/:id')
    completeTask(@Param('id') id: string) {
        return this.activityService.completeTask(id);
    }

    @Post()
    create(@Body() body: CreateActivityDto) {
        return this.activityService.create(body);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get()
    findAll() {
        return this.activityService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.activityService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() activity: UpdateActivityDto) {
        return this.activityService.update(id, activity);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.activityService.remove(id);
    }
}
