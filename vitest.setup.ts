import { vi } from 'vitest';
import { ref } from 'vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    d: (key: string) => key,
    locale: ref('en-US'),
  }),
}));
