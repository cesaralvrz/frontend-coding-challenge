import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/vue'
import Autocomplete from '~/components/common/Autocomplete.vue'

describe('Autocomplete', () => {
  const mockSearchFn = vi.fn()
  const defaultProps = {
    modelValue: '',
    searchFunction: mockSearchFn,
    placeholder: 'Search...'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(Autocomplete, {
      props: defaultProps
    })
    expect(getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('calls search function when typing', async () => {
    mockSearchFn.mockResolvedValueOnce([{ id: 1, name: 'Berlin' }])

    const { getByPlaceholderText } = render(Autocomplete, {
      props: defaultProps
    })

    const input = getByPlaceholderText('Search...')
    await fireEvent.update(input, 'Ber')

    await waitFor(() => {
      expect(mockSearchFn).toHaveBeenCalledWith('Ber')
    })
  })

  it('shows suggestions when results are available', async () => {
    mockSearchFn.mockResolvedValueOnce([
      { id: 1, name: 'Berlin' },
      { id: 2, name: 'Bergen' }
    ])

    const { getByPlaceholderText, findByText } = render(Autocomplete, {
      props: defaultProps
    })

    const input = getByPlaceholderText('Search...')
    await fireEvent.update(input, 'Ber')
    await fireEvent.focus(input)

    expect(await findByText('Berlin')).toBeInTheDocument()
    expect(await findByText('Bergen')).toBeInTheDocument()
  })

  it('emits select event when suggestion is clicked', async () => {
    const suggestion = { id: 1, name: 'Berlin' }
    mockSearchFn.mockResolvedValueOnce([suggestion])

    const { getByPlaceholderText, findByText, emitted } = render(Autocomplete, {
      props: defaultProps
    })

    const input = getByPlaceholderText('Search...')
    await fireEvent.update(input, 'Ber')
    await fireEvent.focus(input)

    const suggestionElement = await findByText('Berlin')
    await fireEvent.mouseDown(suggestionElement)

    expect(emitted().select[0][0]).toEqual(suggestion)
    const modelValueEmissions = emitted()['update:modelValue']
    expect(modelValueEmissions[modelValueEmissions.length - 1][0]).toBe('Berlin')
  })
})
