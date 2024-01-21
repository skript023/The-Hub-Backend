import { Prop } from "@nestjs/mongoose";

class Evidents {
    @Prop({ default: null })
    image: string;
}

class AttributesDetail {
    name: string;
    value: string;
}

export class ProductDetail {
    order_num: string;
    type: string;
    status: string;
    attributes: AttributesDetail[];
    captures: Evidents[];
}
