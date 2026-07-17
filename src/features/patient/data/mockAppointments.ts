import type { AppointmentStatus } from '../../../shared/types/appointment';
import { getDoctorById, type MockDoctor } from './mockDoctors';
import type { VisitPurpose, VisitType } from './mockDoctorSchedule';

export type UpcomingAppointment = {
  id: string;
  doctorId: string;
  patientId: string;
  /** ISO datetime of the visit. */
  scheduledAt: string;
  status: Extract<AppointmentStatus, 'pending' | 'confirmed'>;
  visitType: VisitType;
  purpose: VisitPurpose;
  queuePosition: number;
  fee: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  bookingForOther: boolean;
  /** i18n key under patient.* when present. */
  noteKey?: string;
};

export type UpcomingAppointmentItem = UpcomingAppointment & {
  doctor: MockDoctor;
};

function hoursFromNow(hours: number): string {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date.toISOString();
}

function daysFromNow(days: number, hour = 10, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

/** Upcoming appointments for the signed-in patient (mock). Dates are relative to now. */
export function getMockUpcomingAppointments(): UpcomingAppointment[] {
  return [
    {
      id: 'appt-1',
      doctorId: 'doc-near-1',
      patientId: 'patient-1',
      scheduledAt: hoursFromNow(5.5),
      status: 'confirmed',
      visitType: 'clinic',
      purpose: 'first',
      queuePosition: 2,
      fee: 50.99,
      patientName: 'Ahmed Hassan',
      patientEmail: 'ahmed.hassan@email.com',
      patientPhone: '+966 50 123 4567',
      bookingForOther: false,
      noteKey: 'appointmentNoteArriveEarly',
    },
    {
      id: 'appt-2',
      doctorId: 'doc-near-3',
      patientId: 'patient-1',
      scheduledAt: daysFromNow(2, 14, 30),
      status: 'confirmed',
      visitType: 'online',
      purpose: 'followUp',
      queuePosition: 1,
      fee: 45.0,
      patientName: 'Sara Ali',
      patientEmail: 'sara.ali@email.com',
      patientPhone: '+966 55 987 6543',
      bookingForOther: true,
    },
    {
      id: 'appt-3',
      doctorId: 'doc-5',
      patientId: 'patient-1',
      scheduledAt: daysFromNow(6, 9, 0),
      status: 'pending',
      visitType: 'clinic',
      purpose: 'first',
      queuePosition: 4,
      fee: 60.0,
      patientName: 'Ahmed Hassan',
      patientEmail: 'ahmed.hassan@email.com',
      patientPhone: '+966 50 123 4567',
      bookingForOther: false,
    },
  ];
}

export function getUpcomingAppointments(): UpcomingAppointmentItem[] {
  return getMockUpcomingAppointments()
    .map((appointment) => {
      const doctor = getDoctorById(appointment.doctorId);
      if (!doctor) {
        return null;
      }
      return { ...appointment, doctor };
    })
    .filter((item): item is UpcomingAppointmentItem => item !== null)
    .sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
}

export function getUpcomingAppointmentById(
  appointmentId: string,
): UpcomingAppointmentItem | undefined {
  return getUpcomingAppointments().find((item) => item.id === appointmentId);
}
