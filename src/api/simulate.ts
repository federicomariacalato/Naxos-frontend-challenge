/**
 * Demo switches so a reviewer can see the failure and slow states without
 * breaking their network. Add one to the URL:
 *   ?simulate=error       -> loading posts fails
 *   ?simulate=post-error  -> publishing a post fails
 *   ?simulate=slow        -> every request takes ~2.5s
 */
function flag(): string | null {
  return new URLSearchParams(window.location.search).get("simulate");
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function applySimulation(kind: "list" | "create"): Promise<void> {
  const mode = flag();
  if (mode === "slow") await wait(2500);
  if (mode === "error" && kind === "list") {
    await wait(600);
    throw new TypeError("Simulated network failure");
  }
  if (mode === "post-error" && kind === "create") {
    await wait(600);
    throw new TypeError("Simulated network failure");
  }
}
