export type CityId =
  | 'cairo'
  | 'giza'
  | 'alexandria'
  | 'dakahlia'
  | 'redSea'
  | 'beheira'
  | 'fayoum'
  | 'gharbia'
  | 'ismailia'
  | 'menoufia'
  | 'minya'
  | 'qalyubia'
  | 'newValley'
  | 'suez'
  | 'aswan'
  | 'assiut'
  | 'beniSuef'
  | 'portSaid'
  | 'damietta'
  | 'sharqia'
  | 'southSinai'
  | 'kafrElSheikh'
  | 'matrouh'
  | 'luxor'
  | 'qena'
  | 'northSinai'
  | 'sohag';

export type MockCity = {
  id: CityId;
};

/** Egyptian governorates used for doctor city filter. */
export const EGYPT_CITIES: MockCity[] = [
  { id: 'cairo' },
  { id: 'giza' },
  { id: 'alexandria' },
  { id: 'dakahlia' },
  { id: 'redSea' },
  { id: 'beheira' },
  { id: 'fayoum' },
  { id: 'gharbia' },
  { id: 'ismailia' },
  { id: 'menoufia' },
  { id: 'minya' },
  { id: 'qalyubia' },
  { id: 'newValley' },
  { id: 'suez' },
  { id: 'aswan' },
  { id: 'assiut' },
  { id: 'beniSuef' },
  { id: 'portSaid' },
  { id: 'damietta' },
  { id: 'sharqia' },
  { id: 'southSinai' },
  { id: 'kafrElSheikh' },
  { id: 'matrouh' },
  { id: 'luxor' },
  { id: 'qena' },
  { id: 'northSinai' },
  { id: 'sohag' },
];
