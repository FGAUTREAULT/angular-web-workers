import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WebworkerService } from './service/webworker.service';
import { OVERLOAD_SCRIPT } from './scripts/overload.script';
import { ExecutionResults } from './model/results.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  max: number;
  nonWorkerResults: ExecutionResults;
  workerResults: ExecutionResults;

  currentWorkerPromise: Promise<any>;

  constructor(
    private workerService: WebworkerService,
    private readonly ref: ChangeDetectorRef
  ) {
    this.max = 10;
    this.nonWorkerResults = new ExecutionResults([], 0, 0, 0);
    this.workerResults = new ExecutionResults([], 0, 0, 0);
  }

  public cancelWithWorker() {
    this.workerService.terminate(this.currentWorkerPromise).then((result) => {
      this.currentWorkerPromise = undefined;
      this.ref.markForCheck();
    });
  }

  public calculateWithWorker() {
    this.workerResults = new ExecutionResults([], 0, 0, 0);
    const startTime = Date.now();

    const input = {
      host: window.location.host,
      max: this.max,
      path: window.location.pathname,
      protocol: window.location.protocol,
      worker: true
    };

    this.currentWorkerPromise = this.workerService.run(OVERLOAD_SCRIPT, input);

    this.currentWorkerPromise.then(
      (result) => {
        this.workerResults.executionResults = result.results;
        this.workerResults.executions = result.executions;
        this.workerResults.executionTime = result.time;
        this.ref.markForCheck();
      }
    ).catch(console.error);

    const endTime = Date.now();
    this.workerResults.scheduleTime = (endTime - startTime) / 1000;
  }

  public calculateWithoutWorker() {
    this.nonWorkerResults = new ExecutionResults([], 0, 0, 0);
    const startTime = Date.now();

    const input = {
      host: window.location.host,
      max: this.max,
      path: window.location.pathname,
      protocol: window.location.protocol,
      worker: false
    };

    const result = OVERLOAD_SCRIPT(input);
    this.nonWorkerResults.executionResults = result.results;
    this.nonWorkerResults.executions = result.executions;
    this.nonWorkerResults.executionTime = result.time;

    const endTime = Date.now();
    this.nonWorkerResults.scheduleTime = (endTime - startTime) / 1000;
    this.ref.markForCheck();
  }
}
