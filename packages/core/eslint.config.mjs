import { config } from '@openhome-os/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['jest.config.cjs'],
  },
];
