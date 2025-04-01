import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

global.fetch = vi.fn()

beforeEach(() => {
  vi.resetAllMocks()
})

afterEach(() => {
  vi.clearAllMocks()
})
