import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCalendarStore } from '~/stores/calendarStore';
import { stationsService } from '~/services/stationsService';

vi.mock('~/services/stationsService', () => ({
  stationsService: {
    getStations: vi.fn()
  }
}));

describe('calendarStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const store = useCalendarStore();
    expect(store.selectedStation).toBeNull();
    expect(store.stations).toEqual([]);
    expect(store.bookings).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should fetch stations', async () => {
    const mockStations = [{ id: 1, name: 'Berlin' }];
    stationsService.getStations.mockResolvedValueOnce(mockStations);

    const store = useCalendarStore();
    await store.fetchStations();

    expect(stationsService.getStations).toHaveBeenCalled();
    expect(store.stations).toEqual(mockStations);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should handle fetch stations error', async () => {
    stationsService.getStations.mockRejectedValueOnce(new Error('API Error'));

    const store = useCalendarStore();
    await store.fetchStations();

    expect(store.error).toBe('Failed to fetch stations');
    expect(store.isLoading).toBe(false);
  });

  it('should navigate to next week', () => {
    const store = useCalendarStore();
    const initialDate = new Date(store.currentDate);
    
    store.nextWeek();
    
    expect(store.currentDate.getTime()).toBeGreaterThan(initialDate.getTime());
  });

  it('should navigate to previous week', () => {
    const store = useCalendarStore();
    const initialDate = new Date(store.currentDate);
    
    store.previousWeek();
    
    expect(store.currentDate.getTime()).toBeLessThan(initialDate.getTime());
  });
});