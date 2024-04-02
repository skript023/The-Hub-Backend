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
    @Prop({ type: String, default: null })
    date: string;
    @Prop({ type: String, default: null })
    type: string;
    @Prop({ type: String, default: null })
    jenis: string;
    @Prop({ type: String, default: null })
    deskripsi: string;
    @Prop({ type: String, default: null })
    durasi: string;
    @Prop({ type: String, default: null })
    justifikasi_approval: string;
    @Prop({ type: String, default: null })
    justifikasi_agenda: string;
}
