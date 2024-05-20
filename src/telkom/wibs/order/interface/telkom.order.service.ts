import { Observable } from "rxjs";
import { ClientWritableStream } from "@grpc/grpc-js";

export interface MsaOrderRequest
{
    orderNum: string;
    pageSize?: string;
    pageNum?: string;
}

export interface MsaOrderData
{
    rnum: number;
    rowidorder: string;
    ordernumber: string;
    createddate: string;
    canum: string;
    lastname: string;
    salesrep: string;
    statusorder: string;
    intstatusorder: string;
    revision: number;
}

export interface MsaOrderReplies
{
    message: string;
    success: boolean;
    datetime: string;
    MsaOrderData: MsaOrderData;
}

export default interface MsaOrderService
{
    GetMasterDataOrder(data: MsaOrderRequest): Observable<any>;
    
    GetMasterDataOrderStream(): ClientWritableStream<MsaOrderRequest>;
}