export type ThreadRenderTier = 0 | 1 | 2;

// Both full-screen canvases share density pressure, but never lower DPR or
// throttle requestAnimationFrame; a reload resets the conservative floor.
let sharedThreadRenderTier: ThreadRenderTier = 0;

export function getThreadRenderTier() {
  return sharedThreadRenderTier;
}

export function raiseThreadRenderTier(nextTier: ThreadRenderTier) {
  if (nextTier > sharedThreadRenderTier) sharedThreadRenderTier = nextTier;
  return sharedThreadRenderTier;
}
