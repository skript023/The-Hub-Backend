import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AccessAction } from '../enum/access.enum';
import { AccessLevel } from '../enum/level.enum';

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Role {
    @Prop({ type: mongoose.SchemaTypes.ObjectId, auto: true })
    _id: string;

    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ required: true })
    access: AccessAction;

    @Prop({ enum: AccessLevel, required: true })
    level: AccessLevel;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'role_id',
});
