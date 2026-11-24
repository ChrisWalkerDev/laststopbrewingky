export interface HealthResponse {
  readonly ok: true;
  readonly service: string;
  readonly environment: string;
}

export interface ApiProblem {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string;
  readonly requestId?: string;
}
