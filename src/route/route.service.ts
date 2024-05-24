import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './schema/route.schema';
import mongoose from 'mongoose';
import response from 'src/interfaces/response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RouteService {
	constructor(@InjectModel(Route.name) private routeModel: mongoose.Model<Route>,
	private response: response<Route>)
	{}

	async create(createRouteDto: CreateRouteDto) 
	{
		const result = await this.routeModel.create(createRouteDto);

		this.response.message = `You have successfully create route ${result.name}`;
		this.response.success = true;

		return this.response.json();
	}

	async findAll() 
	{
		const result = await this.routeModel.find();

		if (result.length <= 0)
        {
            this.response.message = `0 route found.`;
            this.response.success = true;

            return this.response.json();
        }

		this.response.data = result;
		this.response.message = `Route data found`;
		this.response.success = true;

		return this.response.json();
	}

	async findOne(id: string) 
	{
		const result = await this.routeModel.findById(id);

		if (!result)
        {
            throw new NotFoundException('Route not found');
        }

		this.response.data = result;
		this.response.message = `Route data found`;
		this.response.success = true;

		return this.response.json();
	}

	async update(id: string, updateRouteDto: UpdateRouteDto) 
	{
		const result = await this.routeModel.findByIdAndUpdate(id, updateRouteDto,{
            new: true,
            runValidators: true,
        });

        if (!result)
        {
            throw new NotFoundException('Role not found');
        }

        this.response.message = `You have successfully update route ${result.name}`;
        this.response.success = true;

        return this.response.json();
	}

	async remove(id: string) 
	{
		const result = await this.routeModel.findByIdAndDelete(id);

        if (!result)
        {
            throw new NotFoundException('Role not found');
        }

        this.response.message = `You have successfully delete route ${result.name}`;
        this.response.success = true;

        return this.response.json();
	}
}
