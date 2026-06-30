import type { HealthCheckResponse } from '../grpc/types';

export interface ServiceDotProps {
  name: string;
  port: number;
  data?: HealthCheckResponse;
  isLoading: boolean;
  isError: boolean;
}
