import { useMemo } from "react";
import { useAddLogEntry } from "~/hooks/useAddLogEntry";
import { useLog } from "~/hooks/useLog";
import { useWorkflow } from "~/hooks/useWorkflow";
import { WorkflowEngine } from "~/lib/WorkflowEngine";

export function useWorkflowEngine(): WorkflowEngine {
  const addLogEntry = useAddLogEntry();
  const log = useLog();
  const workflow = useWorkflow();

  return useMemo(
    () => new WorkflowEngine({ addLogEntry, log, workflow }),
    [addLogEntry, log, workflow],
  );
}
