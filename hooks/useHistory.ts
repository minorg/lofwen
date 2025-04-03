import { useStore } from "~/hooks/useStore";
import type { History } from "~/models";

export function useHistory(): History {
  return useStore();
}
