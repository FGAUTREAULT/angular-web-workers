declare function postMessage(message: any): void;

export const OVERLOAD_SCRIPT = (input) => {
  const fib = (entry: number) => {
    if (entry <= 1) {
      return entry;
    }
    return fib(entry - 1) + fib(entry - 2);
  };

  const runnerResult = {
    executions: 0,
    results: [],
    time: 0
  };

  const startTime = Date.now();
  for (let execution = 0; execution <= input.max; execution++) {
    runnerResult.results.push({
      number: runnerResult.executions++,
      result: fib(execution),
    });
  }

  // Slow calculation
  let x = 0;
  while (x < 10000000000) {
    x++;
  }

  const endTime = Date.now();
  runnerResult.time = (endTime - startTime) / 1000;

  if (input.worker) {
    postMessage(runnerResult);
  } else {
    return runnerResult;
  }
};
