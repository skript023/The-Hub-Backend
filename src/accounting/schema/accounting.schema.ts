import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class Accounting {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user_id: string;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    location: string;

    @Prop({ type: String, required: true })
    payment_method: string;

    @Prop({ type: TransactionDirection, required: true })
    type: TransactionDirection;

    @Prop({ type: Number, required: true })
    amount: number;

    @Prop({ type: String, default: new Date().toLocaleDateString() })
    date: string;
}

export const AccountingSchema = SchemaFactory.createForClass(Accounting);

AccountingSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true,
});
