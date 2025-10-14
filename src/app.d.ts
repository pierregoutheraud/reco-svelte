import type { MediaFormData } from "../components/MediasForm/MediasForm.svelte";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      formData?: MediaFormData;
    }
    // interface Platform {}
  }
}

export {};
