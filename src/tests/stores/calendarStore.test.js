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
    expect(store.currentDate).toBeInstanceOf(Date);
    expect(store.selectedStation).toBeNull();
    expect(store.stations).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should compute currentWeekDays correctly', () => {
    const store = useCalendarStore();
    const weekDays = store.currentWeekDays;
    
    expect(weekDays).toHaveLength(7);
    expect(weekDays[0].getDay()).toBe(1); // Should start on Monday
    expect(weekDays[6].getDay()).toBe(0); // Should end on Sunday
  });

  it('should fetch and filter stations', async () => {
    const mockStations = [
      { id: 1, name: 'Berlin' },
      { id: 2, name: 'station-name{{i}}' }, // Should be filtered out
      { id: 3, name: 'Munich' }
    ];
    stationsService.getStations.mockResolvedValueOnce(mockStations);

    const store = useCalendarStore();
    await store.fetchStations();

    expect(stationsService.getStations).toHaveBeenCalled();
    expect(store.stations).toHaveLength(2);
    expect(store.stations).toEqual([
      { id: 1, name: 'Berlin' },
      { id: 3, name: 'Munich' }
    ]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should handle fetch stations error', async () => {
    stationsService.getStations.mockRejectedValueOnce(new Error('API Error'));

    const store = useCalendarStore();
    await store.fetchStations();

    expect(store.error).toBe('Failed to fetch stations');
    expect(store.isLoading).toBe(false);
    expect(store.stations).toEqual([]);
  });

  it('should set selected station', () => {
    const store = useCalendarStore();
    const station = { id: 1, name: 'Berlin' };
    
    store.setSelectedStation(station);
    expect(store.selectedStation).toEqual(station);
  });

  it('should clear selected station', () => {
    const store = useCalendarStore();
    store.setSelectedStation({ id: 1, name: 'Berlin' });
    
    store.clearStation();
    expect(store.selectedStation).toBeNull();
  });
});