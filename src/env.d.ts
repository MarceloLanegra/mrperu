/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare var grecaptcha: any;

interface Window {
  grecaptcha: any;
}
