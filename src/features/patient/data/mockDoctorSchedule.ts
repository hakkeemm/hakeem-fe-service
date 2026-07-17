export type SlotPeriod = 'morning' | 'afternoon' | 'evening';
export type SlotStatus = 'available' | 'taken';
export type VisitType = 'clinic' | 'online';
export type VisitPurpose = 'first' | 'followUp';

export type MockTimeSlot = {
  time: string;
  period: SlotPeriod;
  status: SlotStatus;
  /** Patients already booked for this exact time (queue ahead of you). */
  queueAhead: number;
};

export type MockAvailableDay = {
  /** ISO date YYYY-MM-DD */
  date: string;
  slots: MockTimeSlot[];
};

export type MockDoctorSchedule = {
  doctorId: string;
  /** How many days ahead this doctor accepts bookings (from today). */
  bookingHorizonDays: number;
  /** Weekdays the doctor works (0 = Sunday … 6 = Saturday). */
  workingWeekdays: number[];
  /** Periods this doctor offers on working days. */
  workingPeriods: SlotPeriod[];
  /** Working days within the booking horizon. */
  days: MockAvailableDay[];
  /** Inclusive booking window for the day picker. */
  calendar: {
    selectableRangeStart: string;
    selectableRangeEnd: string;
  };
};

export const SLOT_PERIODS: SlotPeriod[] = ['morning', 'afternoon', 'evening'];

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

function addDays(base: Date, offset: number): Date {
  const next = startOfDay(base);
  next.setDate(next.getDate() + offset);
  return next;
}

/** Weekdays the doctor typically works (0 = Sunday … 6 = Saturday). */
const DOCTOR_AVAILABLE_WEEKDAYS: Record<string, number[]> = {
  'doc-near-1': [0, 1, 2, 3, 4],
  'doc-near-2': [1, 2, 3, 4, 5],
  'doc-near-3': [0, 2, 4],
  'doc-near-4': [1, 3],
  'doc-3': [1, 2, 3, 4, 5],
  'doc-5': [0, 1, 2, 3, 4, 5, 6],
};

/** Which parts of the day the doctor offers. */
const DOCTOR_WORKING_PERIODS: Record<string, SlotPeriod[]> = {
  'doc-near-1': ['morning', 'afternoon', 'evening'],
  'doc-near-2': ['morning', 'afternoon'],
  'doc-near-3': ['afternoon', 'evening'],
  'doc-near-4': ['morning', 'evening'],
  'doc-3': ['morning', 'afternoon', 'evening'],
  'doc-5': ['morning', 'afternoon'],
};

/** Days ahead each doctor accepts bookings. */
const DOCTOR_BOOKING_HORIZON_DAYS: Record<string, number> = {
  'doc-near-1': 29,
  'doc-near-2': 14,
  'doc-near-3': 45,
  'doc-near-4': 21,
  'doc-3': 30,
  'doc-5': 60,
};

const DEFAULT_WEEKDAYS = [1, 2, 3, 4, 5];
const DEFAULT_PERIODS: SlotPeriod[] = ['morning', 'afternoon', 'evening'];
const DEFAULT_HORIZON_DAYS = 30;

function buildSlotsForDay(seed: number, workingPeriods: SlotPeriod[]): MockTimeSlot[] {
  const morning: MockTimeSlot[] = [
    {
      time: '09:00 AM',
      period: 'morning',
      status: seed % 3 === 0 ? 'taken' : 'available',
      queueAhead: seed % 3 === 0 ? 3 : 1,
    },
    { time: '09:30 AM', period: 'morning', status: 'available', queueAhead: 0 },
    {
      time: '10:00 AM',
      period: 'morning',
      status: seed % 2 === 0 ? 'taken' : 'available',
      queueAhead: seed % 2 === 0 ? 2 : 0,
    },
    { time: '10:30 AM', period: 'morning', status: 'available', queueAhead: 2 },
    {
      time: '11:00 AM',
      period: 'morning',
      status: seed % 5 === 0 ? 'taken' : 'available',
      queueAhead: seed % 5 === 0 ? 4 : 1,
    },
    { time: '11:30 AM', period: 'morning', status: 'available', queueAhead: 0 },
  ];
  const afternoon: MockTimeSlot[] = [
    { time: '01:00 PM', period: 'afternoon', status: 'available', queueAhead: 1 },
    {
      time: '01:30 PM',
      period: 'afternoon',
      status: seed % 4 === 0 ? 'taken' : 'available',
      queueAhead: seed % 4 === 0 ? 2 : 0,
    },
    { time: '02:00 PM', period: 'afternoon', status: 'available', queueAhead: 0 },
    {
      time: '02:30 PM',
      period: 'afternoon',
      status: seed % 3 === 1 ? 'taken' : 'available',
      queueAhead: seed % 3 === 1 ? 3 : 2,
    },
    { time: '03:00 PM', period: 'afternoon', status: 'available', queueAhead: 1 },
    { time: '03:30 PM', period: 'afternoon', status: 'available', queueAhead: 0 },
  ];
  const evening: MockTimeSlot[] = [
    {
      time: '05:00 PM',
      period: 'evening',
      status: seed % 2 === 1 ? 'taken' : 'available',
      queueAhead: seed % 2 === 1 ? 2 : 0,
    },
    { time: '05:30 PM', period: 'evening', status: 'available', queueAhead: 1 },
    { time: '06:00 PM', period: 'evening', status: 'available', queueAhead: 0 },
    {
      time: '06:30 PM',
      period: 'evening',
      status: seed % 5 === 2 ? 'taken' : 'available',
      queueAhead: seed % 5 === 2 ? 3 : 2,
    },
    { time: '07:00 PM', period: 'evening', status: 'available', queueAhead: 0 },
  ];

  const byPeriod: Record<SlotPeriod, MockTimeSlot[]> = {
    morning,
    afternoon,
    evening,
  };

  return workingPeriods.flatMap((period) => byPeriod[period]);
}

export function getDoctorWorkingWeekdays(doctorId: string): number[] {
  return DOCTOR_AVAILABLE_WEEKDAYS[doctorId] ?? DEFAULT_WEEKDAYS;
}

export function getDoctorWorkingPeriods(doctorId: string): SlotPeriod[] {
  return DOCTOR_WORKING_PERIODS[doctorId] ?? DEFAULT_PERIODS;
}

export function getDoctorBookingHorizonDays(doctorId: string): number {
  return DOCTOR_BOOKING_HORIZON_DAYS[doctorId] ?? DEFAULT_HORIZON_DAYS;
}

export function isWorkingDate(dateIso: string, workingWeekdays: number[]): boolean {
  const date = new Date(`${dateIso}T12:00:00`);
  return workingWeekdays.includes(date.getDay());
}

export function getDoctorSchedule(doctorId: string, fromDate = new Date()): MockDoctorSchedule {
  const workingWeekdays = getDoctorWorkingWeekdays(doctorId);
  const workingPeriods = getDoctorWorkingPeriods(doctorId);
  const bookingHorizonDays = getDoctorBookingHorizonDays(doctorId);
  const today = startOfDay(fromDate);
  const rangeEnd = addDays(today, Math.max(bookingHorizonDays - 1, 0));
  const days: MockAvailableDay[] = [];

  for (
    let cursor = new Date(today);
    cursor.getTime() <= rangeEnd.getTime();
    cursor.setDate(cursor.getDate() + 1)
  ) {
    if (!workingWeekdays.includes(cursor.getDay())) {
      continue;
    }
    const date = formatIsoDate(cursor);
    const seed = date.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + doctorId.length;
    days.push({
      date,
      slots: buildSlotsForDay(seed, workingPeriods),
    });
  }

  return {
    doctorId,
    bookingHorizonDays,
    workingWeekdays,
    workingPeriods,
    days,
    calendar: {
      selectableRangeStart: formatIsoDate(today),
      selectableRangeEnd: formatIsoDate(rangeEnd),
    },
  };
}

export function getDayByDate(
  schedule: MockDoctorSchedule,
  date: string,
): MockAvailableDay | undefined {
  return schedule.days.find((day) => day.date === date);
}

export function isDateInBookingRange(
  dateIso: string,
  rangeStart: string,
  rangeEnd: string,
): boolean {
  return dateIso >= rangeStart && dateIso <= rangeEnd;
}

/** Month keys (YYYY-MM) touched by the booking window, for month navigation. */
export function listBookingMonths(rangeStart: string, rangeEnd: string): Array<{
  year: number;
  month: number;
}> {
  const start = new Date(`${rangeStart}T12:00:00`);
  const end = new Date(`${rangeEnd}T12:00:00`);
  const months: Array<{ year: number; month: number }> = [];
  let year = start.getFullYear();
  let month = start.getMonth();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push({ year, month });
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return months;
}
