import { AsyncLocalStorage } from "node:async_hooks";
import { Worker } from "@temporalio/worker";
import { Context } from "@temporalio/activity";
import { Client } from "@temporalio/client";
import { randomUUID } from "node:crypto";

console.log("LOADING test.js");

export async function hereItStarts() {
  const asyncLocalStorage = new AsyncLocalStorage();

  function logWithId(msg) {
    const id = asyncLocalStorage.getStore();
    console.log(`${id !== undefined ? id : "-"}:`, msg);
  }

  asyncLocalStorage.run(1, () => {
    logWithId("start");
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId("finish");
    });
  });

  const workflowId = "test" + randomUUID();
  const client = new Client({});
  await client.workflow.start("httpWorkflow", {
    workflowId: workflowId,
    taskQueue: "test",
  });

  const worker = await Worker.create({
    taskQueue: "test",
    activities: {
      async testActivity() {
        console.log(
          `testActivity ${Context.current().info.workflowExecution.workflowId}`
        );
      },
    },
    maxConcurrentActivityTaskExecutions: 1,
  });
  await worker.run();
}
