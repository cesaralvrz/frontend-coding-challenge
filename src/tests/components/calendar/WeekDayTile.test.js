import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import WeekDayTile from '~/components/calendar/WeekDayTile.vue';

describe('WeekDayTile', () => {
  const defaultProps = {
    date: new Date('2024-03-20'),
    bookings: []
  };

  it('renders the day name and date correctly', () => {
    const { getByText } = render(WeekDayTile, {
      props: defaultProps
    });

    expect(getByText('Wednesday')).toBeInTheDocument();
    expect(getByText('20')).toBeInTheDocument();
  });

  it('renders bookings when provided', () => {
    const bookings = [
      {
        id: 1,
        customerName: 'John Doe',
        startDate: '2024-03-20',
        endDate: '2024-03-22'
      }
    ];

    const { getByText } = render(WeekDayTile, {
      props: {
        ...defaultProps,
        bookings
      }
    });

    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Start')).toBeInTheDocument();
  });

  it('shows "End" text for booking end date', () => {
    const bookings = [
      {
        id: 1,
        customerName: 'John Doe',
        startDate: '2024-03-18',
        endDate: '2024-03-20'
      }
    ];

    const { getByText } = render(WeekDayTile, {
      props: {
        ...defaultProps,
        bookings
      }
    });

    expect(getByText('End')).toBeInTheDocument();
  });

  it('emits booking-click event when booking is clicked', async () => {
    const booking = {
      id: 1,
      customerName: 'John Doe',
      startDate: '2024-03-20',
      endDate: '2024-03-22'
    };

    const { getByText, emitted } = render(WeekDayTile, {
      props: {
        ...defaultProps,
        bookings: [booking]
      }
    });

    await fireEvent.click(getByText('John Doe'));
    
    expect(emitted()['booking-click']).toBeTruthy();
    expect(emitted()['booking-click'][0][0]).toEqual(booking);
  });

  it('handles empty bookings array', () => {
    const { container } = render(WeekDayTile, {
      props: defaultProps
    });

    const bookingsContainer = container.querySelector('.space-y-2');
    expect(bookingsContainer.children.length).toBe(0);
  });
});