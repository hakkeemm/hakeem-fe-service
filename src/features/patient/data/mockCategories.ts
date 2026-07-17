export type SpecialtyId =
  | 'neurology'
  | 'cardiology'
  | 'orthopedics'
  | 'pathology'
  | 'nephrology'
  | 'anesthesiology'
  | 'ophthalmology'
  | 'pediatrics'
  | 'oncology'
  | 'dermatology'
  | 'psychiatry'
  | 'generalSurgery'
  | 'endocrinology'
  | 'radiology'
  | 'surgery'
  | 'geriatrics';

export interface DoctorCategory {
  id: SpecialtyId;
  iconUrl: string;
  featuredOnHome?: boolean;
}

const ICON = (name: string) => `https://img.icons8.com/color/96/${name}.png`;

export const DOCTOR_CATEGORIES: DoctorCategory[] = [
  { id: 'neurology', iconUrl: ICON('brain'), featuredOnHome: true },
  { id: 'cardiology', iconUrl: ICON('heart-with-pulse'), featuredOnHome: true },
  { id: 'orthopedics', iconUrl: ICON('knee'), featuredOnHome: true },
  { id: 'pathology', iconUrl: ICON('stomach'), featuredOnHome: true },
  { id: 'nephrology', iconUrl: ICON('kidney') },
  { id: 'anesthesiology', iconUrl: ICON('syringe') },
  { id: 'ophthalmology', iconUrl: ICON('visible') },
  { id: 'pediatrics', iconUrl: ICON('baby') },
  { id: 'oncology', iconUrl: ICON('ribbon') },
  { id: 'dermatology', iconUrl: ICON('skin') },
  { id: 'psychiatry', iconUrl: ICON('mental-health') },
  { id: 'generalSurgery', iconUrl: ICON('scalpel') },
  { id: 'endocrinology', iconUrl: ICON('thyroid') },
  { id: 'radiology', iconUrl: ICON('x-ray') },
  { id: 'surgery', iconUrl: ICON('hospital') },
  { id: 'geriatrics', iconUrl: ICON('old-woman') },
];

export function getHomeFeaturedCategories(): DoctorCategory[] {
  return DOCTOR_CATEGORIES.filter((category) => category.featuredOnHome);
}
