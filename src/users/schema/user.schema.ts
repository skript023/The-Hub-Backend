import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

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
export class User {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true })
    role_id: string;

    @Prop({ type: String, required: true })
    fullname: string;

    @Prop({ type: String, required: true, unique: true })
    username: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, default: null })
    hardware_id: string;

    @Prop({ type: String, default: null })
    computer_name: string;

    @Prop({ type: String, default: null })
    image: string;

    @Prop({ type: String, default: new Date().toUTCString() })
    expired: string;

    @Prop({ type: String, default: new Date().toUTCString() })
    recent_login: string;

    @Prop({ type: String, default: null })
    remember_token: string;

    @Prop({ type: String, default: null })
    refresh_token: string;

    @Prop({ type: String, default: null })
    google_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('role', {
    ref: 'Role',
    localField: 'role_id',
    foreignField: '_id',
    justOne: true,
});

UserSchema.virtual('activity', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'user_id',
});

UserSchema.virtual('asset', {
    ref: 'Asset',
    localField: '_id',
    foreignField: 'user_id',
});

UserSchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user_id',
});

UserSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'user_id',
});
