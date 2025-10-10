import type { MoviesFormData } from "./components/MoviesForm/MoviesForm.svelte";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      formData?: MoviesFormData;
    }
    // interface Platform {}
  }
}

export {};
