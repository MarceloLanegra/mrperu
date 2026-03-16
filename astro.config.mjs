// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_TOKEN'
      }),
      TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_EMAIL'
      }),
      FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_EMAIL'
      })
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});