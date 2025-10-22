import { tmdbIdToKey } from "../helpers/media.helpers";
import { TMDB_MEDIA_TYPE, type MediaKey } from "$lib/tmdb/tmdb.decl";

const STORAGE_KEY = "USER_PREFERENCES";

export interface WatchlistItem {
  key: string; // Format: "movie__123" or "tv__456"
  reason: string | null;
  timestamp: number;
}

interface UserPreferences {
  dislikedMediaKeys: MediaKey[];
  likedMediaKeys: MediaKey[];
  alreadyRecommendedMediaKeys: MediaKey[];
  watchlist: WatchlistItem[];
}

// Old interface for migration
interface UserPreferencesLegacy {
  dislikedMoviesIds?: number[];
  likedMoviesIds?: number[];
  alreadyRecommendedMoviesIds?: number[];
  dislikedMediaKeys?: MediaKey[];
  likedMediaKeys?: MediaKey[];
  alreadyRecommendedMediaKeys?: MediaKey[];
  watchLater?: (
    | WatchlistItem
    | { id: number; reason: string; timestamp: number }
  )[];
  watchlist?: WatchlistItem[];
}

function loadFromStorage(): UserPreferences {
  if (typeof window === "undefined") {
    return {
      dislikedMediaKeys: [],
      likedMediaKeys: [],
      alreadyRecommendedMediaKeys: [],
      watchlist: []
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: UserPreferencesLegacy = JSON.parse(stored);

      // Migrate old number[] format to new string[] keys (assume all old data is movies)
      const dislikedMediaKeys = parsed.dislikedMediaKeys
        ? parsed.dislikedMediaKeys
        : (parsed.dislikedMoviesIds || []).map((id) =>
            tmdbIdToKey(id, TMDB_MEDIA_TYPE.MOVIE)
          );

      const likedMediaKeys = parsed.likedMediaKeys
        ? parsed.likedMediaKeys
        : (parsed.likedMoviesIds || []).map((id) =>
            tmdbIdToKey(id, TMDB_MEDIA_TYPE.MOVIE)
          );

      const alreadyRecommendedMediaKeys = parsed.alreadyRecommendedMediaKeys
        ? parsed.alreadyRecommendedMediaKeys
        : (parsed.alreadyRecommendedMoviesIds || []).map((id) =>
            tmdbIdToKey(id, TMDB_MEDIA_TYPE.MOVIE)
          );

      // Migrate watchlist items (support both old "watchLater" and new "watchlist" keys)
      const watchlist = (parsed.watchlist || parsed.watchLater || []).map(
        (item) => {
          if ("key" in item) {
            return item as WatchlistItem;
          }
          // Old format with just id
          return {
            key: tmdbIdToKey(item.id, TMDB_MEDIA_TYPE.MOVIE),
            reason: item.reason,
            timestamp: item.timestamp
          };
        }
      );

      return {
        dislikedMediaKeys,
        likedMediaKeys,
        alreadyRecommendedMediaKeys,
        watchlist
      };
    }
  } catch (error) {
    console.error("Failed to load media preferences from storage:", error);
  }

  return {
    dislikedMediaKeys: [],
    likedMediaKeys: [],
    alreadyRecommendedMediaKeys: [],
    watchlist: []
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
  private dislikedMediaKeys = $state<MediaKey[]>([]);
  private likedMediaKeys = $state<MediaKey[]>([]);
  private alreadyRecommendedMediaKeys = $state<MediaKey[]>([]);
  private maxAlreadyRecommendedMediaKeys = 500;
  watchlist = $state<WatchlistItem[]>([]);

  constructor() {
    const stored = loadFromStorage();
    this.dislikedMediaKeys = stored.dislikedMediaKeys;
    this.likedMediaKeys = stored.likedMediaKeys;
    this.alreadyRecommendedMediaKeys = stored.alreadyRecommendedMediaKeys;
    this.watchlist = stored.watchlist;
  }

  get dislikedKeys(): MediaKey[] {
    return this.dislikedMediaKeys;
  }

  get likedKeys(): MediaKey[] {
    return this.likedMediaKeys;
  }

  get alreadyRecommendedKeys(): MediaKey[] {
    return this.alreadyRecommendedMediaKeys;
  }

  // Backward compatibility: check if media ID is disliked (checks all media types)
  isDisliked(mediaId: number): boolean {
    return this.dislikedMediaKeys.some((key) => key.includes(`__${mediaId}`));
  }

  isLiked(mediaId: number): boolean {
    return this.likedMediaKeys.some((key) => key.includes(`__${mediaId}`));
  }

  isAlreadyRecommended(mediaId: number): boolean {
    return this.alreadyRecommendedMediaKeys.some((key) =>
      key.includes(`__${mediaId}`)
    );
  }

  addDisliked(
    mediaId: number,
    mediaType: TMDB_MEDIA_TYPE,
    save: boolean = true
  ): void {
    const key = tmdbIdToKey(mediaId, mediaType);

    // Remove from liked list if it exists there
    const likedIndex = this.likedMediaKeys.findIndex((k) =>
      k.includes(`__${mediaId}`)
    );
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

  addLiked(
    mediaId: number,
    mediaType: TMDB_MEDIA_TYPE,
    save: boolean = true
  ): void {
    const key = tmdbIdToKey(mediaId, mediaType);

    // Remove from disliked list if it exists there
    const dislikedIndex = this.dislikedMediaKeys.findIndex((k) =>
      k.includes(`__${mediaId}`)
    );
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
    const index = this.dislikedMediaKeys.findIndex((k) =>
      k.includes(`__${mediaId}`)
    );
    if (index > -1) {
      this.dislikedMediaKeys.splice(index, 1);
      this.save();
    }
  }

  removeLiked(mediaId: number): void {
    const index = this.likedMediaKeys.findIndex((k) =>
      k.includes(`__${mediaId}`)
    );
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

  addToWatchlist(
    mediaId: number,
    mediaType: TMDB_MEDIA_TYPE,
    reason: WatchlistItem["reason"]
  ): void {
    const key = tmdbIdToKey(mediaId, mediaType);

    // Check if already in watchlist
    const existingIndex = this.watchlist.findIndex((h) => h.key === key);

    if (existingIndex > -1) {
      // Update existing entry
      this.watchlist[existingIndex] = {
        key,
        reason,
        timestamp: Date.now()
      };
    } else {
      // Add new entry
      this.watchlist.push({
        key,
        reason,
        timestamp: Date.now()
      });
    }

    this.save();
  }

  getWatchlistByKey(key: string): WatchlistItem | undefined {
    return this.watchlist.find((h) => h.key === key);
  }

  getWatchlistByMediaId(mediaId: number): WatchlistItem | undefined {
    return this.watchlist.find((h) => h.key.includes(`__${mediaId}`));
  }

  removeFromWatchlist(mediaId: number): void {
    const index = this.watchlist.findIndex((h) =>
      h.key.includes(`__${mediaId}`)
    );
    if (index > -1) {
      this.watchlist.splice(index, 1);
      this.save();
    }
  }

  clear(): void {
    this.dislikedMediaKeys = [];
    this.likedMediaKeys = [];
    this.alreadyRecommendedMediaKeys = [];
    this.watchlist = [];
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
      watchlist: this.watchlist
    });
  }
}

export const userPreferences = new UserPreferencesStore();
