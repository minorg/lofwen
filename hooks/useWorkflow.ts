import { configuration } from "~/configuration";
import type { Workflow } from "~/workflows";

export function useWorkflow(): Workflow {
  return configuration.workflow;
}
