import type { AdsSlide } from '../../../shared/components/ads';
import type { SpecialtyId } from './mockCategories';

/** Remote mock doctor photos. */
export const MOCK_DOCTOR_IMAGES = {
  maleGlasses: 'https://randomuser.me/api/portraits/men/32.jpg',
  femaleStethoscope: 'https://randomuser.me/api/portraits/women/44.jpg',
  maleCoat: 'https://randomuser.me/api/portraits/men/46.jpg',
  femaleSmile: 'https://randomuser.me/api/portraits/women/68.jpg',
  maleScrubs: 'https://randomuser.me/api/portraits/men/75.jpg',
  clinicTeam: 'https://randomuser.me/api/portraits/women/65.jpg',
  maleDoctor: 'https://randomuser.me/api/portraits/men/52.jpg',
  femaleDoctor: 'https://randomuser.me/api/portraits/women/52.jpg',
} as const;

export type MockDoctorImageKey = keyof typeof MOCK_DOCTOR_IMAGES;

export type MockDoctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  specialtyId: SpecialtyId;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  fee: number;
  about: string;
  address: string;
  experienceYears: number;
  patientCount: number;
  location: {
    latitude: number;
    longitude: number;
  };
};

const DEFAULT_ABOUT =
  'A dedicated specialist committed to providing compassionate, evidence-based care. Focuses on accurate diagnosis, clear communication, and personalized treatment plans to help every patient achieve better health.';

export const MOCK_DOCTORS: MockDoctor[] = [
  {
    id: 'doc-near-1',
    name: 'Dr. Leslie Alexander',
    specialty: 'Cardiologist',
    hospital: 'Siloam Hospital',
    specialtyId: 'cardiology',
    imageUrl: MOCK_DOCTOR_IMAGES.maleDoctor,
    rating: 4.9,
    reviewCount: 174,
    fee: 50.99,
    about:
      'Board-certified cardiologist with a focus on preventive heart care and the treatment of complex cardiovascular conditions. Passionate about helping patients build heart-healthy habits.',
    address: '2118 Thornridge Cir, Siloam Hospital, Syracuse',
    experienceYears: 12,
    patientCount: 4300,
    location: { latitude: 43.0481, longitude: -76.1474 },
  },
  {
    id: 'doc-near-2',
    name: 'Dr. Robert Fox',
    specialty: 'Internal Medicine',
    hospital: 'Stanford Hospital',
    specialtyId: 'pathology',
    imageUrl: MOCK_DOCTOR_IMAGES.maleGlasses,
    rating: 4.5,
    reviewCount: 83,
    fee: 55.0,
    about: DEFAULT_ABOUT,
    address: '300 Pasteur Dr, Stanford Hospital, Palo Alto',
    experienceYears: 9,
    patientCount: 2100,
    location: { latitude: 37.4331, longitude: -122.1754 },
  },
  {
    id: 'doc-near-3',
    name: 'Dr. Kristin Watson',
    specialty: 'Dermatologist',
    hospital: 'Methodist Hospital',
    specialtyId: 'dermatology',
    imageUrl: MOCK_DOCTOR_IMAGES.femaleDoctor,
    rating: 4.9,
    reviewCount: 224,
    fee: 48.0,
    about:
      'Dermatologist specializing in medical and cosmetic skin care. Experienced in treating acne, eczema, and skin cancer with a gentle, patient-first approach.',
    address: '6565 Fannin St, Methodist Hospital, Houston',
    experienceYears: 11,
    patientCount: 3800,
    location: { latitude: 29.7101, longitude: -95.3986 },
  },
  {
    id: 'doc-near-4',
    name: 'Dr. Arlene McCoy',
    specialty: 'Dermatologist',
    hospital: 'Methodist Hospital',
    specialtyId: 'dermatology',
    imageUrl: MOCK_DOCTOR_IMAGES.femaleSmile,
    rating: 4.9,
    reviewCount: 224,
    fee: 48.0,
    about: DEFAULT_ABOUT,
    address: '6565 Fannin St, Methodist Hospital, Houston',
    experienceYears: 8,
    patientCount: 2600,
    location: { latitude: 29.7101, longitude: -95.3986 },
  },
  {
    id: 'doc-3',
    name: 'Dr. James Carter',
    specialty: 'Cardiology',
    hospital: 'City Medical Center',
    specialtyId: 'cardiology',
    imageUrl: MOCK_DOCTOR_IMAGES.maleCoat,
    rating: 4.8,
    reviewCount: 1842,
    fee: 65.0,
    about:
      'Interventional cardiologist with extensive experience in minimally invasive procedures. Dedicated to delivering the highest standard of cardiac care.',
    address: '1200 N State St, City Medical Center, Los Angeles',
    experienceYears: 15,
    patientCount: 5200,
    location: { latitude: 34.0578, longitude: -118.2417 },
  },
  {
    id: 'doc-5',
    name: 'Dr. Emily Watson',
    specialty: 'Pediatrics',
    hospital: 'Children Wellness Clinic',
    specialtyId: 'pediatrics',
    imageUrl: MOCK_DOCTOR_IMAGES.clinicTeam,
    rating: 4.9,
    reviewCount: 3120,
    fee: 45.0,
    about:
      'Compassionate pediatrician focused on children’s growth, development, and preventive care. Trusted by families for a warm, reassuring bedside manner.',
    address: '450 Sutter St, Children Wellness Clinic, San Francisco',
    experienceYears: 10,
    patientCount: 4700,
    location: { latitude: 37.7891, longitude: -122.4092 },
  },
];

export function getNearbyDoctors(): MockDoctor[] {
  return MOCK_DOCTORS;
}

export function getPopularDoctors(limit = 4): MockDoctor[] {
  return MOCK_DOCTORS.slice(0, limit);
}

export function getDoctorById(id: string): MockDoctor | undefined {
  return MOCK_DOCTORS.find((doctor) => doctor.id === id);
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
