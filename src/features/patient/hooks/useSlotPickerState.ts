import { useEffect, useMemo, useState } from 'react';

import {
  getDayByDate,
  getDoctorSchedule,
  type VisitPurpose,
  type VisitType,
} from '../data/mockDoctorSchedule';
import { getDoctorById } from '../data/mockDoctors';

export function useSlotPickerState(doctorId: string) {
  const doctor = useMemo(() => getDoctorById(doctorId), [doctorId]);
  const schedule = useMemo(() => getDoctorSchedule(doctorId), [doctorId]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<VisitType | null>(null);
  const [purpose, setPurpose] = useState<VisitPurpose | null>(null);

  useEffect(() => {
    const firstWorking = schedule.days[0]?.date ?? null;
    setSelectedDate(firstWorking);
    setVisitType(null);
    setPurpose(null);
  }, [schedule]);

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

  const canBook = Boolean(
    doctor && selectedDate && assignedTime && visitType && purpose,
  );

  const selectDate = (date: string) => {
    setSelectedDate(date);
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
    selectDate,
    setVisitType,
    setPurpose,
  };
}
