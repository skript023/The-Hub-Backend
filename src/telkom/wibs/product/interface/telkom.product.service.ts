import { Observable } from "rxjs";
import { ClientWritableStream } from "@grpc/grpc-js";

export interface MsaProductCatalogRequest
{
    catalog_name: string
    page_size?: string
    page_num?: string
}

export interface MsaCreateAttributeRequest
{
    attribute_name: string;
    data_type_cd: string;
    domain_type_cd: string;
    min_val: number;
    max_val: number;
    uom: string;
}

export interface MsaValueAttributeRequest
{
    value_attribute: string;
    seq_num: number;
    attrbute_name: string;
}

export interface MsaCreateClassProductRequest
{
    classname: string;
}

export default interface MsaProductService
{
    GetProductUnderCatalog(data: MsaProductCatalogRequest): Observable<any>;
    
    GetProductUnderCatalogStream(): ClientWritableStream<MsaProductCatalogRequest>;
    
    CreateAttribute(data: MsaCreateAttributeRequest): Observable<any>;

    CreateAttributeStream(data: MsaCreateAttributeRequest): ClientWritableStream<MsaCreateAttributeRequest>;

    AddValueAttribute(data: MsaValueAttributeRequest): Observable<any>;

    AddValueAttributeStream(data: MsaValueAttributeRequest): ClientWritableStream<MsaValueAttributeRequest>;

    CreateClassProduct(data: MsaCreateClassProductRequest): Observable<any>;

    CreateClassProductStream(data: MsaCreateClassProductRequest): ClientWritableStream<MsaCreateClassProductRequest>;
}