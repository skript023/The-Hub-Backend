import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

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
export class Route {
    @Prop({ type: mongoose.SchemaTypes.ObjectId, auto: true })
    _id: string;

    @Prop({ type: mongoose.SchemaTypes.ObjectId, default: null })
    role_id: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    type: string;

    @Prop({ type: String, required: true, unique: true })
    frontend: string;

    @Prop({ type: String, required: true, unique: true })
    backend: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);

RouteSchema.virtual('role', {
    ref: 'Role',
    localField: 'role_id',
    foreignField: '_id',
    justOne: true
});
