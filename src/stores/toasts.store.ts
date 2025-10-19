import { writable } from "svelte/store";
import { generateUniqId } from "../helpers/generic.helpers";

export type ToastsStore = {
  messages: ToastMessage[];
};

export enum TOAST_TYPES {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  INFO = "INFO",
  LOADING = "LOADING"
}

export type ToastMessageLink = {
  text: string;
  callback: () => void;
};

export type ToastMessage = {
  id: string;
  content: string;
  type: TOAST_TYPES;
  settings: ToastMessageSettings;
};

export type ToastMessageSettings = {
  duration?: number;
  replace?: boolean;
  replacedByNew?: boolean;
  link?: ToastMessageLink;
};

const DEFAULT_TOAST_DURATION = 2000;

export function createToastsStore() {
  const toasts = writable<ToastsStore>({ messages: [] });
  const timeouts: Record<string, NodeJS.Timeout> = {};
  const { subscribe, set, update } = toasts;

  function scheduleRemove(id: string, settings?: ToastMessageSettings) {
    if (settings?.duration === 0) {
      return id;
    }

    timeouts[id] = setTimeout(() => {
      remove(id);
      clearTimeout(timeouts[id]);
    }, settings?.duration || DEFAULT_TOAST_DURATION);

    return id;
  }

  function add(
    content: string,
    type: TOAST_TYPES,
    settings?: ToastMessageSettings
  ): string {
    const id = generateUniqId();

    const message: ToastMessage = {
      id,
      content,
      type,
      settings: settings || {}
    };

    update((v) => {
      const messages = settings?.replace
        ? [message]
        : [...v.messages.filter((m) => !m.settings.replacedByNew), message];
      return {
        messages
      };
    });

    scheduleRemove(id, settings);

    return id;
  }

  function success(content: string, settings?: ToastMessageSettings) {
    return add(content, TOAST_TYPES.SUCCESS, settings);
  }

  function error(content: string, settings?: ToastMessageSettings) {
    return add(content, TOAST_TYPES.ERROR, settings);
  }

  function info(content: string, settings?: ToastMessageSettings) {
    return add(content, TOAST_TYPES.INFO, settings);
  }

  function loading(content = "Loading", settings?: ToastMessageSettings) {
    return add(content, TOAST_TYPES.LOADING, settings);
  }

  function updateToast(
    id: string,
    content: string,
    type: TOAST_TYPES,
    settings?: ToastMessageSettings
  ) {
    clearTimeout(timeouts[id]);

    update((v) => {
      const newMessages = v.messages.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            content,
            type,
            settings: settings || {}
          };
        }
        return m;
      });
      return {
        messages: newMessages
      };
    });

    scheduleRemove(id, settings);

    return id;
  }

  function remove(id: string) {
    update((v) => {
      return {
        messages: v.messages.filter((m) => m.id !== id)
      };
    });
  }

  return {
    subscribe,
    set,
    update,
    updateToast,
    success,
    info,
    error,
    remove,
    loading
  };
}

export const toasts = createToastsStore();
