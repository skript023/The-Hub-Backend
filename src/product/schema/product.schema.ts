import mongoose from 'mongoose';
import { ProductDetail } from './product.detail';
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
export class Product {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user_id: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true, default: new Date().toLocaleDateString() })
    start_date: string;

    @Prop({ type: String, required: true, default: new Date().toLocaleDateString() })
    end_date: string;

    @Prop({ type: String, required: true })
    status: string;

    @Prop()
    detail: ProductDetail[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true,
});
