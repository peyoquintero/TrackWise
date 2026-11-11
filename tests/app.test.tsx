// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('App data loading', () => {
  it('shows a retryable error screen when the core datasets fail to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('boom', { status: 500, statusText: 'Server Error' })),
    );

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load data');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('renders the shell and lazy-loaded data dictionary once data arrives', async () => {
    const empty = () => new Response('[]', { headers: { 'Content-Type': 'application/json' } });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => empty()),
    );

    render(<App />);
    // Tract data is empty, so open a tab that does not need map rendering.
    await userEvent.click(await screen.findByRole('button', { name: 'Data dictionary' }));

    expect(await screen.findByRole('heading', { name: /data dictionary/i })).toBeInTheDocument();
  });
});
