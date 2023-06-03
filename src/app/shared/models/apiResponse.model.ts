export class ApiResponse<T> {
  IsSucceed: boolean;
  ErrorMessages: string[];
  Exception: any;
  Data: T;
}
