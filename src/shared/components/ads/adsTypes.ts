import type { ImageSourcePropType } from 'react-native';

export type AdsMediaSource =
  | {
      type: 'image';
      source: ImageSourcePropType;
    }
  | {
      type: 'video';
      /** Local require() asset or remote URI string. */
      source: number | string;
      /** Optional poster while video loads / when inactive. */
      poster?: ImageSourcePropType;
    };

export type AdsSlide = {
  id: string;
  title: string;
  /** CTA label — defaults to "Connect" via i18n when omitted. */
  buttonLabel?: string;
  media: AdsMediaSource;
  backgroundColor?: string;
};
