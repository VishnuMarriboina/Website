export type ValidationSource = 'body' | 'query' | 'params';

export interface ValidationErrorDetail {
  field:   string | undefined;
  message: string;
}
