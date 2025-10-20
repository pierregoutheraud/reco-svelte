import type { MediaFormData } from "./components/MediasForm/MediasForm.svelte";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}

    // PageState interface for shallow routing with modals
    interface PageState {
      formData?: MediaFormData;
      showModal?: boolean;
      mediaType?: "movie" | "tv";
      mediaId?: string;
    }
    // interface Platform {}
  }
}

export {};
