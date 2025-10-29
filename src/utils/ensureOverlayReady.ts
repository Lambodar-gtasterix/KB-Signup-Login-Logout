import { InteractionManager } from 'react-native';

/**
 * Waits until ongoing interactions and the next two animation frames complete.
 * Helpful to guarantee overlays/modal loaders have rendered before heavy work begins.
 */
export function ensureOverlayReady(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  });
}

