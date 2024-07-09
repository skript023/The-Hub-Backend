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

export class Attendance 
{
    @Prop({ type: mongoose.SchemaTypes.ObjectId, auto: true })
    _id: string;
    @Prop({ type: mongoose.SchemaTypes.ObjectId, default: null })
    user_id: string;
    @Prop({ type: Number })
    sequence: number;
    @Prop({ type: String, default: null })
    range: string;
    @Prop({ type: String, default: null })
    date: string;
    @Prop({ type: String, default: null })
    type: Type;
    @Prop({ type: String, default: null })
    jenis: Jenis;
    @Prop({ type: String, default: null })
    deskripsi: string;
    @Prop({ type: String, default: null })
    durasi: string;
    @Prop({ type: String, default: null })
    justifikasi_approval: string;
    @Prop({ type: String, default: null })
    justifikasi_agenda: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

AttendanceSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});