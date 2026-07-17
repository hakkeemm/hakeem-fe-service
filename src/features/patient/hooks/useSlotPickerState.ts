import { useEffect, useMemo, useState } from 'react';

import { useAuthStore } from '../../../shared/store/authStore';
import {
  getDayByDate,
  getDoctorSchedule,
  type VisitPurpose,
  type VisitType,
} from '../data/mockDoctorSchedule';
import { getDoctorById } from '../data/mockDoctors';
import { usePatientProfileStore } from '../store/patientProfileStore';

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function useSlotPickerState(doctorId: string) {
  const doctor = useMemo(() => getDoctorById(doctorId), [doctorId]);
  const schedule = useMemo(() => getDoctorSchedule(doctorId), [doctorId]);

  const authUser = useAuthStore((state) => state.user);
  const displayName = usePatientProfileStore((state) => state.displayName);

  const selfDetails = useMemo(
    () => ({
      name: (displayName.trim() || authUser?.name || '').trim(),
      email: (authUser?.email || '').trim(),
      phone: '',
    }),
    [authUser?.email, authUser?.name, displayName],
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<VisitType | null>(null);
  const [purpose, setPurpose] = useState<VisitPurpose | null>(null);

  const [bookingForOther, setBookingForOther] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  useEffect(() => {
    const firstWorking = schedule.days[0]?.date ?? null;
    setSelectedDate(firstWorking);
    setVisitType(null);
    setPurpose(null);
    setBookingForOther(false);
  }, [schedule]);

  useEffect(() => {
    if (bookingForOther) {
      return;
    }
    setPatientName(selfDetails.name);
    setPatientEmail(selfDetails.email);
    setPatientPhone(selfDetails.phone);
  }, [bookingForOther, selfDetails.email, selfDetails.name, selfDetails.phone]);

  const selectedDay = useMemo(
    () => (selectedDate ? getDayByDate(schedule, selectedDate) : undefined),
    [schedule, selectedDate],
  );

  /** Next open slot for the selected day — assigned automatically, not chosen. */
  const assignedSlot = useMemo(() => {
    const slots = selectedDay?.slots ?? [];
    return slots.find((slot) => slot.status === 'available') ?? null;
  }, [selectedDay]);

  const assignedTime = assignedSlot?.time ?? null;
  const queuePosition = assignedSlot ? assignedSlot.queueAhead + 1 : 0;

  const fee = doctor?.fee ?? 0;

  const patientDetailsValid =
    isNonEmpty(patientName) && isNonEmpty(patientPhone);

  const canBook = Boolean(
    doctor &&
      selectedDate &&
      assignedTime &&
      visitType &&
      purpose &&
      patientDetailsValid,
  );

  const selectDate = (date: string) => {
    setSelectedDate(date);
  };

  const toggleBookingForOther = () => {
    setBookingForOther((prev) => {
      const next = !prev;
      if (next) {
        setPatientName('');
        setPatientEmail('');
        setPatientPhone('');
      } else {
        setPatientName(selfDetails.name);
        setPatientEmail(selfDetails.email);
        setPatientPhone(selfDetails.phone);
      }
      return next;
    });
  };

  return {
    doctor,
    schedule,
    selectedDate,
    visitType,
    purpose,
    assignedTime,
    queuePosition,
    fee,
    canBook,
    patientName,
    patientEmail,
    patientPhone,
    bookingForOther,
    selectDate,
    setVisitType,
    setPurpose,
    setPatientName,
    setPatientEmail,
    setPatientPhone,
    toggleBookingForOther,
  };
}
