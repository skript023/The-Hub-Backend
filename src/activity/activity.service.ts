import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Activity } from './schema/activity.schema';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import response from '../interfaces/response.dto';
import Profile from 'src/auth/interface/user.profile';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel(Activity.name)
        private activityModel: mongoose.Model<Activity>,
        private response: response<Activity>,
    ) {}

    async create(activity: CreateActivityDto) 
    {
        activity.start_date = new Date(activity.start_date).toLocaleDateString();
        activity.end_date = new Date(activity.end_date).toLocaleDateString();

        const result = await this.activityModel.create(activity);

        if (!result)
            throw new InternalServerErrorException('Failed create task');

        this.response.message = `Success create task ${result.name}`;
        this.response.success = true;

        return this.response.json();
    }

    async findAll(user: Profile) 
    {
        const activities = await this.activityModel
            .find({ user_id: user._id }, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']).sort({ createdAt: -1 });

        this.response.data = activities;
        this.response.message = 'Success retrieve tasks';
        this.response.success = true;

        return this.response.json();
    }

    async findOne(id: string) 
    {
        const activity = await this.activityModel
            .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('user', ['fullname', 'username']);

        if (!activity) throw new NotFoundException('Task not found.');

        this.response.data = activity;
        this.response.message = 'Success retrieve task';
        this.response.success = true;

        return this.response.json();
    }

    async update(id: string, activity: UpdateActivityDto) 
    {
        activity.start_date = new Date(activity.start_date).toLocaleDateString();
        activity.end_date = new Date(activity.end_date).toLocaleDateString();

        const result = await this.activityModel.findByIdAndUpdate(
            id,
            activity,
            {
                new: true,
                runValidators: true,
            },
        );

        if (!result)
            throw new NotFoundException('Unable to update non-existing data');

        this.response.message = `Success update ${result.name} task`;
        this.response.success = true;

        return this.response.json();
    }

    async remove(id: string)
    {
        const result = await this.activityModel.findByIdAndDelete(id);

        if (!result) throw new NotFoundException('Activity not found.');

        this.response.message = `Success delete ${result.name} task`;
        this.response.success = true;

        return this.response.json();
    }

    async completeTask(id: string)
    {
        const activity = (await this.activityModel.findById(
            id,
        )) as UpdateActivityDto;

        if (!activity) throw new NotFoundException('Activity not found.');

        activity.status = 'Completed';
        activity.end_date = new Date().toLocaleDateString();

        const result = await this.activityModel.findByIdAndUpdate(id, activity, {
                new: true,
                runValidators: true,
            },
        );

        this.response.message = `${result.name} task mark as completed`;
        this.response.success = true;

        return this.response.json();
    }
}
