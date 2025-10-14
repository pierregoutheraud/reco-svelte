import { tmdbIdToKey } from "../helpers/media.helpers";
import { TMDB_MEDIA_TYPE } from "$lib/tmdb/tmdb.decl";

const STORAGE_KEY = "USER_PREFERENCES";

export interface WatchLaterItem {
  key: string; // Format: "movie__123" or "tv__456"
  reason: string;
  timestamp: number;
}

interface UserPreferences {
  dislikedMediaKeys: string[];
  likedMediaKeys: string[];
  alreadyRecommendedMediaKeys: string[];
  watchLater: WatchLaterItem[];
}

// Old interface for migration
interface UserPreferencesLegacy {
  dislikedMoviesIds?: number[];
  likedMoviesIds?: number[];
  alreadyRecommendedMoviesIds?: number[];
  dislikedMediaKeys?: string[];
  likedMediaKeys?: string[];
  alreadyRecommendedMediaKeys?: string[];
  watchLater?: (WatchLaterItem | { id: number; reason: string; timestamp: number })[];
}

function loadFromStorage(): UserPreferences {
  if (typeof window === "undefined") {
    return {
      dislikedMediaKeys: [],
      likedMediaKeys: [],
      alreadyRecommendedMediaKeys: [],
      watchLater: []
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: UserPreferencesLegacy = JSON.parse(stored);

      // Migrate old number[] format to new string[] keys (assume all old data is movies)
      const dislikedMediaKeys = parsed.dislikedMediaKeys
        ? parsed.dislikedMediaKeys
        : (parsed.dislikedMoviesIds || []).map(id => tmdbIdToKey(id, TMDB_MEDIA_TYPE.MOVIE));

      const likedMediaKeys = parsed.likedMediaKeys
        ? parsed.likedMediaKeys
        : (parsed.likedMoviesIds || []).map(id => tmdbIdToKey(id, TMDB_MEDIA_TYPE.MOVIE));

      const alreadyRecommendedMediaKeys = parsed.alreadyRecommendedMediaKeys
        ? parsed.alreadyRecommendedMediaKeys
        : (parsed.alreadyRecommendedMoviesIds || []).map(id => tmdbIdToKey(id, TMDB_MEDIA_TYPE.MOVIE));

      // Migrate watchLater items
      const watchLater = (parsed.watchLater || []).map(item => {
        if ("key" in item) {
          return item as WatchLaterItem;
        }
        // Old format with just id
        return {
          key: tmdbIdToKey(item.id, TMDB_MEDIA_TYPE.MOVIE),
          reason: item.reason,
          timestamp: item.timestamp
        };
      });

      return {
        dislikedMediaKeys,
        likedMediaKeys,
        alreadyRecommendedMediaKeys,
        watchLater
      };
    }
  } catch (error) {
    console.error("Failed to load media preferences from storage:", error);
  }

  return {
    dislikedMediaKeys: [],
    likedMediaKeys: [],
    alreadyRecommendedMediaKeys: [],
    watchLater: []
  };
}

function saveToStorage(preferences: UserPreferences): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save media preferences to storage:", error);
  }
}

class UserPreferencesStore {
  private dislikedMediaKeys = $state<string[]>([]);
  private likedMediaKeys = $state<string[]>([]);
  private alreadyRecommendedMediaKeys = $state<string[]>([]);
  private maxAlreadyRecommendedMediaKeys = 500;
  watchLater = $state<WatchLaterItem[]>([]);

  constructor() {
    const stored = loadFromStorage();
    this.dislikedMediaKeys = stored.dislikedMediaKeys;
    this.likedMediaKeys = stored.likedMediaKeys;
    this.alreadyRecommendedMediaKeys = stored.alreadyRecommendedMediaKeys;
    this.watchLater = stored.watchLater;
  }

  get dislikedKeys(): string[] {
    return this.dislikedMediaKeys;
  }

  get likedKeys(): string[] {
    return this.likedMediaKeys;
  }

  get alreadyRecommendedKeys(): string[] {
    return this.alreadyRecommendedMediaKeys;
  }

  // Backward compatibility: check if media ID is disliked (checks all media types)
  isDisliked(mediaId: number): boolean {
    return this.dislikedMediaKeys.some(key => key.includes(`__${mediaId}`));
  }

  isLiked(mediaId: number): boolean {
    return this.likedMediaKeys.some(key => key.includes(`__${mediaId}`));
  }

  isAlreadyRecommended(mediaId: number): boolean {
    return this.alreadyRecommendedMediaKeys.some(key => key.includes(`__${mediaId}`));
  }

  addDisliked(mediaId: number, mediaType: TMDB_MEDIA_TYPE, save: boolean = true): void {
    const key = tmdbIdToKey(mediaId, mediaType);

    // Remove from liked list if it exists there
    const likedIndex = this.likedMediaKeys.findIndex(k => k.includes(`__${mediaId}`));
    if (likedIndex > -1) {
      this.likedMediaKeys.splice(likedIndex, 1);
    }

    if (!this.dislikedMediaKeys.includes(key)) {
      this.dislikedMediaKeys.push(key);
    }
    if (save) {
      this.save();
    }
  }

  addLiked(mediaId: number, mediaType: TMDB_MEDIA_TYPE, save: boolean = true): void {
    const key = tmdbIdToKey(mediaId, mediaType);

    // Remove from disliked list if it exists there
    const dislikedIndex = this.dislikedMediaKeys.findIndex(k => k.includes(`__${mediaId}`));
    if (dislikedIndex > -1) {
      this.dislikedMediaKeys.splice(dislikedIndex, 1);
    }

    if (!this.likedMediaKeys.includes(key)) {
      this.likedMediaKeys.push(key);
    }

    if (save) {
      this.save();
    }
  }

  removeDisliked(mediaId: number): void {
    const index = this.dislikedMediaKeys.findIndex(k => k.includes(`__${mediaId}`));
    if (index > -1) {
      this.dislikedMediaKeys.splice(index, 1);
      this.save();
    }
  }

  removeLiked(mediaId: number): void {
    const index = this.likedMediaKeys.findIndex(k => k.includes(`__${mediaId}`));
    if (index > -1) {
      this.likedMediaKeys.splice(index, 1);
      this.save();
    }
  }

  addAlreadyRecommended(mediaId: number, mediaType: TMDB_MEDIA_TYPE): void {
    const key = tmdbIdToKey(mediaId, mediaType);

    if (this.alreadyRecommendedMediaKeys.includes(key)) {
      return;
    }

    this.alreadyRecommendedMediaKeys.push(key);
    this.trimAlreadyRecommended();
    this.save();
  }

  addToWatchLater(mediaId: number, mediaType: TMDB_MEDIA_TYPE, reason: string): void {
    const key = tmdbIdToKey(mediaId, mediaType);

    // Check if already in watch later
    const existingIndex = this.watchLater.findIndex((h) => h.key === key);

    if (existingIndex > -1) {
      // Update existing entry
      this.watchLater[existingIndex] = {
        key,
        reason,
        timestamp: Date.now()
      };
    } else {
      // Add new entry
      this.watchLater.push({
        key,
        reason,
        timestamp: Date.now()
      });
    }

    this.save();
  }

  getWatchLaterByKey(key: string): WatchLaterItem | undefined {
    return this.watchLater.find((h) => h.key === key);
  }

  getWatchLaterByMediaId(mediaId: number): WatchLaterItem | undefined {
    return this.watchLater.find((h) => h.key.includes(`__${mediaId}`));
  }

  removeFromWatchLater(mediaId: number): void {
    const index = this.watchLater.findIndex((h) => h.key.includes(`__${mediaId}`));
    if (index > -1) {
      this.watchLater.splice(index, 1);
      this.save();
    }
  }

  clear(): void {
    this.dislikedMediaKeys = [];
    this.likedMediaKeys = [];
    this.alreadyRecommendedMediaKeys = [];
    this.watchLater = [];
    this.save();
  }

  private trimAlreadyRecommended(): void {
    if (
      this.alreadyRecommendedMediaKeys.length >
      this.maxAlreadyRecommendedMediaKeys
    ) {
      // Keep last maxAlreadyRecommendedMediaKeys entries
      this.alreadyRecommendedMediaKeys = this.alreadyRecommendedMediaKeys.slice(
        -this.maxAlreadyRecommendedMediaKeys
      );
    }
  }

  private save(): void {
    saveToStorage({
      dislikedMediaKeys: this.dislikedMediaKeys,
      likedMediaKeys: this.likedMediaKeys,
      alreadyRecommendedMediaKeys: this.alreadyRecommendedMediaKeys,
      watchLater: this.watchLater
    });
  }
}

export const userPreferences = new UserPreferencesStore();
