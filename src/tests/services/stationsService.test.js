import { describe, it, expect, beforeEach, vi } from 'vitest'
import { stationsService } from '~/services/stationsService'

describe('stationsService', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should fetch stations without query', async () => {
    const mockStations = [{ id: 1, name: 'Berlin' }]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStations
    })

    const result = await stationsService.getStations()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://605c94c36d85de00170da8b4.mockapi.io/stations'
    )
    expect(result).toEqual(mockStations)
  })

  it('should fetch stations with search query', async () => {
    const mockStations = [{ id: 1, name: 'Berlin' }]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStations
    })

    const result = await stationsService.getStations('Berlin')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://605c94c36d85de00170da8b4.mockapi.io/stations?search=Berlin'
    )
    expect(result).toEqual(mockStations)
  })

  it('should handle API errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    await expect(stationsService.getStations()).rejects.toThrow('HTTP error! status: 500')
  })
})
