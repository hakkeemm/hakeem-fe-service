import type { AdsSlide } from '../../../shared/components/ads';

/** Remote mock doctor photos. */
export const MOCK_DOCTOR_IMAGES = {
  maleGlasses: 'https://randomuser.me/api/portraits/men/32.jpg',
  femaleStethoscope: 'https://randomuser.me/api/portraits/women/44.jpg',
  maleCoat: 'https://randomuser.me/api/portraits/men/46.jpg',
  femaleSmile: 'https://randomuser.me/api/portraits/women/68.jpg',
  maleScrubs: 'https://randomuser.me/api/portraits/men/75.jpg',
  clinicTeam: 'https://randomuser.me/api/portraits/women/65.jpg',
} as const;

export type MockDoctorImageKey = keyof typeof MOCK_DOCTOR_IMAGES;

export type MockDoctor = {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  fee: number;
};

export const MOCK_DOCTORS: MockDoctor[] = [
  {
    id: 'doc-1',
    name: 'Chloe Kelly',
    specialty: 'M.Ch. (Neuro)',
    imageUrl: MOCK_DOCTOR_IMAGES.femaleStethoscope,
    rating: 4.5,
    reviewCount: 2530,
    fee: 50.99,
  },
  {
    id: 'doc-2',
    name: 'Lauren Hemp',
    specialty: 'Spinal Surgery',
    imageUrl: MOCK_DOCTOR_IMAGES.femaleSmile,
    rating: 4.5,
    reviewCount: 2530,
    fee: 50.99,
  },
  {
    id: 'doc-3',
    name: 'Dr. James Carter',
    specialty: 'Cardiology',
    imageUrl: MOCK_DOCTOR_IMAGES.maleGlasses,
    rating: 4.8,
    reviewCount: 1842,
    fee: 65.0,
  },
  {
    id: 'doc-4',
    name: 'Dr. Ahmed Hassan',
    specialty: 'Orthopedics',
    imageUrl: MOCK_DOCTOR_IMAGES.maleCoat,
    rating: 4.6,
    reviewCount: 980,
    fee: 55.5,
  },
  {
    id: 'doc-5',
    name: 'Dr. Emily Watson',
    specialty: 'Pediatrics',
    imageUrl: MOCK_DOCTOR_IMAGES.clinicTeam,
    rating: 4.9,
    reviewCount: 3120,
    fee: 45.0,
  },
];

export function getPopularDoctors(limit = 4): MockDoctor[] {
  return MOCK_DOCTORS.slice(0, limit);
}

type HomeAdsCopy = {
  lookingForDoctor: string;
  specialists: string;
  healthTips: string;
  connect: string;
};

/** Home ads slider slides — titles/labels come from i18n via `copy`. */
export function getMockHomeAdsSlides(copy: HomeAdsCopy): AdsSlide[] {
  return [
    {
      id: 'find-doctor',
      title: copy.lookingForDoctor,
      buttonLabel: copy.connect,
      backgroundColor: '#148F8A',
      media: {
        type: 'image',
        source: { uri: MOCK_DOCTOR_IMAGES.maleGlasses },
      },
    },
    {
      id: 'specialists',
      title: copy.specialists,
      buttonLabel: copy.connect,
      backgroundColor: '#2F80ED',
      media: {
        type: 'image',
        source: { uri: MOCK_DOCTOR_IMAGES.femaleStethoscope },
      },
    },
    {
      id: 'health-tips',
      title: copy.healthTips,
      buttonLabel: copy.connect,
      backgroundColor: '#1B6AD4',
      media: {
        type: 'image',
        source: { uri: MOCK_DOCTOR_IMAGES.maleCoat },
      },
    },
    {
      id: 'pediatrics',
      title: copy.specialists,
      buttonLabel: copy.connect,
      backgroundColor: '#0E7C7B',
      media: {
        type: 'image',
        source: { uri: MOCK_DOCTOR_IMAGES.femaleSmile },
      },
    },
  ];
}
