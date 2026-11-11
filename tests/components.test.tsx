// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { FloatingAssistant } from '../src/components/FloatingAssistant';
import { Header } from '../src/components/Header';
import { onActivate } from '../src/lib/a11y';
import { fetchJson } from '../src/lib/fetchJson';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' }, ...init });

const Boom = () => {
  throw new Error('kaboom');
};

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('shows an accessible fallback when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
  });
});

describe('Header', () => {
  const setup = () => {
    const props = { setActiveTab: vi.fn(), setIsDark: vi.fn(), onExport: vi.fn() };
    render(<Header activeTab="dashboard" isDark={false} {...props} />);
    return props;
  };

  it('switches tabs', async () => {
    const { setActiveTab } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Food Truck Route' }));
    expect(setActiveTab).toHaveBeenCalledWith('route');
    await userEvent.click(screen.getByRole('button', { name: 'Data dictionary' }));
    expect(setActiveTab).toHaveBeenCalledWith('dictionary');
  });

  it('toggles theme and exports CSV', async () => {
    const { setIsDark, onExport } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(setIsDark).toHaveBeenCalledWith(true);
    await userEvent.click(screen.getByRole('button', { name: /export csv/i }));
    expect(onExport).toHaveBeenCalledOnce();
  });
});

describe('FloatingAssistant', () => {
  const openAndAsk = async (question: string) => {
    await userEvent.click(screen.getByRole('button', { name: 'Open Tracky Assistant' }));
    await userEvent.type(screen.getByPlaceholderText('Ask Tracky a question...'), question);
    await userEvent.click(screen.getByRole('button', { name: 'Send query' }));
  };

  it('posts the question and shows the reply', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ reply: 'Orange County has the most.' }));
    vi.stubGlobal('fetch', fetchMock);
    render(<FloatingAssistant />);

    await openAndAsk('Which county?');

    expect(await screen.findByText('Orange County has the most.')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ message: 'Which county?' }) }),
    );
  });

  it('shows an honest error (no stale numbers) when the server is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network down')));
    render(<FloatingAssistant />);

    await openAndAsk('hello');

    expect(await screen.findByText(/unable to reach the assistant/i)).toBeInTheDocument();
    expect(screen.queryByText(/2,429,919/)).not.toBeInTheDocument();
  });

  it('surfaces server validation errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: 'Message is too long.' }, { status: 400 })));
    render(<FloatingAssistant />);

    await openAndAsk('x');

    await waitFor(() => expect(screen.getByText('Message is too long.')).toBeInTheDocument());
  });
});

describe('fetchJson', () => {
  it('returns parsed JSON on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ ok: true })));
    await expect(fetchJson('/x')).resolves.toEqual({ ok: true });
  });

  it('throws on non-2xx responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 404, statusText: 'Not Found' })));
    await expect(fetchJson('/missing')).rejects.toThrow('404');
  });
});

describe('onActivate', () => {
  const key = (k: string) => ({ key: k, preventDefault: vi.fn() }) as unknown as React.KeyboardEvent;

  it('fires on Enter and Space only', () => {
    const action = vi.fn();
    const handler = onActivate(action);
    handler(key('Enter'));
    handler(key(' '));
    handler(key('a'));
    expect(action).toHaveBeenCalledTimes(2);
  });
});
