// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { MoviesFormData } from "./components/MoviesForm/MoviesForm.svelte";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      csrfToken: string;
    }
    // interface PageData {}
    interface PageState {
      formData?: MoviesFormData;
    }
    // interface Platform {}
  }
}

export {};
