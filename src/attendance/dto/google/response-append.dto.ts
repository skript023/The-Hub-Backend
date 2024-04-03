export interface ValueRange
{
    range: string;
    majorDimension: string;
    values: any[]
}

export interface UpdateValueResponse
{
    spreadsheetId: string;
    updatedRange: string;
    updatedRows: number;
    updatedColumns: number;
    updatedCells: number;
    updatedData: ValueRange;
}

export interface SheetsAppendResponse
{
    spreadsheetId: string;
    tableRange: string;
    updates: UpdateValueResponse
}