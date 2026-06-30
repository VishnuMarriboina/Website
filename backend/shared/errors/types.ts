export interface ValidationDetail {
  field: string | undefined;
  message: string;
}

export interface SerializedError {
  success: false;
  message: string;
  errorCode: string;
  errors?: ValidationDetail[];
}
