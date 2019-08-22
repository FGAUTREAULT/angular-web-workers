export class ExecutionResults {
  constructor(
    public executionResults: Results[],
    public executions: number,
    public executionTime: number,
    public scheduleTime: number
  ) { }
}

export class Results {
  constructor(
    public number: number,
    public result: number
  ) { }
}

export interface IWorkerEntry {
  id: number;
  promise: Promise<any>;
}
