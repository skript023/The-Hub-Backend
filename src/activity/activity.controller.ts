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

    @Auth({
        role: ['admin'],
        access: 'update',
    })
    @Patch('complete/:id')
    completeTask(@Param('id') id: string) {
        return this.activityService.completeTask(id);
    }

    @Auth({
        role: ['admin'],
        access: 'create',
    })
    @Post()
    create(@Body() body: CreateActivityDto) {
        return this.activityService.create(body);
    }

    @Auth({
        role: ['admin'],
        access: 'read',
    })
    @Get()
    findAll() {
        return this.activityService.findAll();
    }

    @Auth({
        role: ['admin'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.activityService.findOne(id);
    }

    @Auth({
        role: ['admin'],
        access: 'update',
    })
    @Patch(':id')
    update(@Param('id') id: string, @Body() activity: UpdateActivityDto) {
        return this.activityService.update(id, activity);
    }

    @Auth({
        role: ['admin'],
        access: 'delete',
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.activityService.remove(id);
    }
}
