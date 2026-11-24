export interface HttpProblem {
  readonly status: number;
  readonly message: string;
  readonly retryable: boolean;
}

export class AppHttpError extends Error {
  readonly status: number;
  readonly retryable: boolean;

  constructor(problem: HttpProblem) {
    super(problem.message);
    this.name = 'AppHttpError';
    this.status = problem.status;
    this.retryable = problem.retryable;
  }
}
