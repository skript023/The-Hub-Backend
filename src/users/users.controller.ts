import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UploadedFile,
    Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('profile/detail')
    getProfile(@Request() req) {
        return req.user;
    }
    
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }),
                    new FileTypeValidator({ fileType: 'image' }),
                ],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.userService.create(createUserDto, file);
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Auth({
        role: ['admin', 'staff'],
        access: 'read',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Auth({
        role: ['admin'],
        access: 'update',
    })
    @UseInterceptors(FileInterceptor('image'))
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }),
                    new FileTypeValidator({ fileType: 'image' }),
                ],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.userService.update(id, updateUserDto, file);
    }

    @Auth({
        role: ['admin'],
        access: 'delete',
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Get('avatar/:name')
    image(@Param('name') name: string, @Res() res: Response) {
        return this.userService.getImage(name, res);
    }

    @Delete('avatar/delete/:name')
    delete_image(@Param('name') name) {
        fs.unlinkSync(`${__dirname}/assets/avatar/${name}`);
    }
}
