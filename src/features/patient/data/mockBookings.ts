import type { Appointment } from '../../../shared/types/appointment';
import { getDoctorById, type MockDoctor } from './mockDoctors';

export type MockBooking = Appointment & {
  status: 'completed';
};

export type BookingHistoryItem = MockBooking & {
  doctor: MockDoctor;
};

/** Past completed bookings for the signed-in patient (mock). */
export const MOCK_BOOKINGS: MockBooking[] = [
  {
    id: 'booking-1',
    doctorId: 'doc-near-1',
    patientId: 'patient-1',
    scheduledAt: '2026-06-12T10:30:00.000Z',
    status: 'completed',
    notes: 'Follow-up checkup',
  },
  {
    id: 'booking-2',
    doctorId: 'doc-near-3',
    patientId: 'patient-1',
    scheduledAt: '2026-05-28T14:00:00.000Z',
    status: 'completed',
  },
  {
    id: 'booking-3',
    doctorId: 'doc-5',
    patientId: 'patient-1',
    scheduledAt: '2026-04-03T09:15:00.000Z',
    status: 'completed',
    notes: 'Annual visit',
  },
  {
    id: 'booking-4',
    doctorId: 'doc-3',
    patientId: 'patient-1',
    scheduledAt: '2026-03-18T16:45:00.000Z',
    status: 'completed',
  },
];

export function getBookingHistory(): BookingHistoryItem[] {
  return MOCK_BOOKINGS.map((booking) => {
    const doctor = getDoctorById(booking.doctorId);
    if (!doctor) {
      return null;
    }
    return { ...booking, doctor };
  })
    .filter((item): item is BookingHistoryItem => item !== null)
    .sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    );
}
