import { ProcessStateExcel } from '../enums/process-state.excel.enum';

export class ErrorDetail {
  email?: string;
  errorMessage: string;
}

export class UploadExcelAndPreloadUsersDto {
  status: ProcessStateExcel;
  errorDetails?: ErrorDetail[];
}
