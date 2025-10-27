import '@testing-library/jest-dom';
import { TransformStream } from 'stream/web';
import { TextDecoder } from 'util';
import 'whatwg-fetch';

// @ts-expect-error - TextDecoder is not defined in the global scope
global.TextDecoder = TextDecoder;
// @ts-expect-error - TransformStream is not defined in the global scope
global.TransformStream = TransformStream;

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));
