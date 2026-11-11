import type { KeyboardEvent } from 'react';

/** onKeyDown handler that triggers `action` on Enter/Space, for non-button elements with role="button". */
export const onActivate = (action: () => void) => (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};
