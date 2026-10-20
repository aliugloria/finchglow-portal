import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useActivity } from './useActivity';

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

describe('staff activity', () => {
  it('remembers read stories after remount and lets staff mark them unread again', () => {
    const first = renderHook(() => useActivity('gloria'));
    act(() => first.result.current.toggleNewsRead('n1'));
    first.unmount();
    const next = renderHook(() => useActivity('gloria'));
    expect(next.result.current.readNews).toEqual(['n1']);
    act(() => next.result.current.toggleNewsRead('n1'));
    expect(next.result.current.readNews).toEqual([]);
  });

  it('keeps only the last opened app after refresh', () => {
    const first = renderHook(() => useActivity('gloria'));
    for (const id of ['crm', 'booking-tools', 'crm', 'learning-platform', 'hr-self-service']) {
      act(() => first.result.current.recordAppUse(id));
    }
    expect(first.result.current.recentApps).toEqual(['hr-self-service']);
    first.unmount();
    expect(renderHook(() => useActivity('gloria')).result.current.recentApps).toEqual(['hr-self-service']);
  });

  it('keeps personas separate when switching and restores their own activity', () => {
    const { result, rerender } = renderHook(({ id }) => useActivity(id), { initialProps: { id: 'gloria' } });
    act(() => { result.current.recordAppUse('crm'); result.current.toggleNewsRead('n1'); });
    rerender({ id: 'trainer' });
    expect(result.current.recentApps).toEqual([]);
    expect(result.current.readNews).toEqual([]);
    act(() => result.current.toggleNewsRead('n2'));
    rerender({ id: 'gloria' });
    expect(result.current.recentApps).toEqual(['crm']);
    expect(result.current.readNews).toEqual(['n1']);
  });

  it('continues to work when browser storage cannot be accessed', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { result } = renderHook(() => useActivity('gloria'));
    act(() => { result.current.recordAppUse('crm'); result.current.toggleNewsRead('n1'); });
    expect(result.current.recentApps).toEqual(['crm']);
    expect(result.current.readNews).toEqual(['n1']);
  });

  it('ignores malformed saved entries', () => {
    localStorage.setItem('finchglow.activity.v1', JSON.stringify({ gloria: { readNews: null, recentApps: 'crm' } }));
    const { result } = renderHook(() => useActivity('gloria'));
    expect(result.current.recentApps).toEqual([]);
    expect(result.current.readNews).toEqual([]);
  });
});

it('migrates an existing history to only its most recent app', () => {
  localStorage.setItem('finchglow.activity.v1', JSON.stringify({ gloria: { readNews: ['n1'], recentApps: ['crm', 'booking-tools', 'learning-platform'] } }));
  const { result } = renderHook(() => useActivity('gloria'));
  expect(result.current.recentApps).toEqual(['crm']);
  expect(result.current.readNews).toEqual(['n1']);
});
