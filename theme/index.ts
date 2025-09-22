import { semantic } from './semantic';
import { tokens } from './tokens';

export const theme = {
  ...tokens,
  semantic,
};

export type Theme = typeof theme;
export * from './semantic';
export * from './tokens';

