import { api } from './api'

export const stationsService = {
  async getStations(query = '') {
    const endpoint = `/stations${query ? `?search=${query}` : ''}`
    return api.get(endpoint)
  }
}
