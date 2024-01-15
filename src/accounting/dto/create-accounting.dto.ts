export class CreateAccountingDto {
    user_id: string;
    title: string;
    description: string;
    location: string;
    payment_method: string;
    type: TransactionDirection;
    amount: number;
    date: string;
}
