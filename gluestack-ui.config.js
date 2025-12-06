import { config as defaultConfig } from '@gluestack-ui/config';

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    fonts: {
      ...defaultConfig.tokens.fonts,
      body: 'Nunito-Regular',
      heading: 'Nunito-SemiBold',
      mono: 'Nunito-Regular',
    },
  },
};
