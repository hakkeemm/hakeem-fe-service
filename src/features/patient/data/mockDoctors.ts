import type { AdsSlide } from '../../shared/components/ads';

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
};

export const MOCK_DOCTORS: MockDoctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. James Carter',
    specialty: 'Cardiology',
    imageUrl: MOCK_DOCTOR_IMAGES.maleGlasses,
  },
  {
    id: 'doc-2',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Dermatology',
    imageUrl: MOCK_DOCTOR_IMAGES.femaleStethoscope,
  },
  {
    id: 'doc-3',
    name: 'Dr. Ahmed Hassan',
    specialty: 'Orthopedics',
    imageUrl: MOCK_DOCTOR_IMAGES.maleCoat,
  },
  {
    id: 'doc-4',
    name: 'Dr. Emily Watson',
    specialty: 'Pediatrics',
    imageUrl: MOCK_DOCTOR_IMAGES.femaleSmile,
  },
  {
    id: 'doc-5',
    name: 'Dr. Michael Brown',
    specialty: 'Neurology',
    imageUrl: MOCK_DOCTOR_IMAGES.maleScrubs,
  },
];

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
