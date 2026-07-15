export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes?: string;
}
