import { Prop } from "@nestjs/mongoose";

class Evidents {
    @Prop({ default: null })
    image: string;
}

class ProductInformation {
    @Prop({ type: String, default: null })
    title: string;
    @Prop({ type: String, default: null })
    description: string;
    @Prop({ type: String, default: null })
    evident: Evidents[];
}

export class ProductDossier {
    @Prop({ type: String, default: null })
    rfc_num: string;
    @Prop({ type: String, default: null })
    type: string;
    @Prop({ type: String, default: null })
    status: string;
    @Prop({ type: String, default: null })
    informations: ProductInformation[];
}