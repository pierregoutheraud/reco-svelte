const STORAGE_KEY = "USER_PREFERENCES";

export interface WatchLaterItem {
  id: number;
  reason: string;
  timestamp: number;
}

interface UserPreferences {
  dislikedMoviesIds: number[];
  likedMoviesIds: number[];
  alreadyRecommendedMoviesIds: number[];
  watchLater: WatchLaterItem[];
}

function loadFromStorage(): UserPreferences {
  if (typeof window === "undefined") {
    return {
      dislikedMoviesIds: [],
      likedMoviesIds: [],
      alreadyRecommendedMoviesIds: [],
      watchLater: []
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        dislikedMoviesIds: Array.isArray(parsed.dislikedMoviesIds)
          ? parsed.dislikedMoviesIds
          : [],
        likedMoviesIds: Array.isArray(parsed.likedMoviesIds)
          ? parsed.likedMoviesIds
          : [],
        alreadyRecommendedMoviesIds: Array.isArray(
          parsed.alreadyRecommendedMoviesIds
        )
          ? parsed.alreadyRecommendedMoviesIds
          : [],
        watchLater: Array.isArray(parsed.watchLater) ? parsed.watchLater : []
      };
    }
  } catch (error) {
    console.error("Failed to load movie preferences from storage:", error);
  }

  return {
    dislikedMoviesIds: [],
    likedMoviesIds: [],
    alreadyRecommendedMoviesIds: [],
    watchLater: []
  };
}

function saveToStorage(preferences: UserPreferences): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save movie preferences to storage:", error);
  }
}

class UserPreferencesStore {
  private dislikedMoviesIds = $state<number[]>([]);
  private likedMoviesIds = $state<number[]>([]);
  private alreadyRecommendedMoviesIds = $state<number[]>([]);
  watchLater = $state<WatchLaterItem[]>([]);

  constructor() {
    const stored = loadFromStorage();
    this.dislikedMoviesIds = stored.dislikedMoviesIds;
    this.likedMoviesIds = stored.likedMoviesIds;
    this.alreadyRecommendedMoviesIds = stored.alreadyRecommendedMoviesIds;
    this.watchLater = stored.watchLater;
  }

  get disliked(): number[] {
    return this.dislikedMoviesIds;
  }

  get liked(): number[] {
    return this.likedMoviesIds;
  }

  get alreadyRecommended(): number[] {
    return this.alreadyRecommendedMoviesIds;
  }

  addDisliked(movieId: number, save: boolean = true): void {
    // Remove from liked list if it exists there
    const likedIndex = this.likedMoviesIds.indexOf(movieId);
    if (likedIndex > -1) {
      this.likedMoviesIds.splice(likedIndex, 1);
    }

    if (!this.dislikedMoviesIds.includes(movieId)) {
      this.dislikedMoviesIds.push(movieId);
    }
    if (save) {
      this.save();
    }
  }

  addLiked(movieId: number, save: boolean = true): void {
    // Remove from disliked list if it exists there
    const dislikedIndex = this.dislikedMoviesIds.indexOf(movieId);
    if (dislikedIndex > -1) {
      this.dislikedMoviesIds.splice(dislikedIndex, 1);
    }

    if (!this.likedMoviesIds.includes(movieId)) {
      this.likedMoviesIds.push(movieId);
    }

    if (save) {
      this.save();
    }
  }

  addMultipleDisliked(movieIds: number[]): void {
    for (const id of movieIds) {
      this.addDisliked(id, false);
    }
    this.save();
  }

  addMultipleLiked(movieIds: number[]): void {
    for (const id of movieIds) {
      this.addLiked(id, false);
    }
    this.save();
  }

  removeDisliked(movieId: number): void {
    const index = this.dislikedMoviesIds.indexOf(movieId);
    if (index > -1) {
      this.dislikedMoviesIds.splice(index, 1);
      this.save();
    }
  }

  removeLiked(movieId: number): void {
    const index = this.likedMoviesIds.indexOf(movieId);
    if (index > -1) {
      this.likedMoviesIds.splice(index, 1);
      this.save();
    }
  }

  addAlreadyRecommended(movieId: number): void {
    if (this.alreadyRecommendedMoviesIds.includes(movieId)) {
      return;
    }

    this.alreadyRecommendedMoviesIds.push(movieId);

    this.save();
  }

  addToWatchLater(movieId: number, reason: string): void {
    // Check if already in watch later
    const existingIndex = this.watchLater.findIndex((h) => h.id === movieId);

    if (existingIndex > -1) {
      // Update existing entry
      this.watchLater[existingIndex] = {
        id: movieId,
        reason,
        timestamp: Date.now()
      };
    } else {
      // Add new entry
      this.watchLater.push({
        id: movieId,
        reason,
        timestamp: Date.now()
      });
    }

    this.save();
  }

  getWatchLaterMovie(movieId: number): WatchLaterItem | undefined {
    return this.watchLater.find((h) => h.id === movieId);
  }

  removeFromWatchLater(movieId: number): void {
    const index = this.watchLater.findIndex((h) => h.id === movieId);
    if (index > -1) {
      this.watchLater.splice(index, 1);
      this.save();
    }
  }

  addMultipleAlreadyRecommended(movieIds: number[]): void {
    let changed = false;

    for (const id of movieIds) {
      if (this.alreadyRecommendedMoviesIds.includes(id)) {
        continue;
      }
      this.alreadyRecommendedMoviesIds.push(id);
      changed = true;
    }

    if (!changed) {
      return;
    }

    this.save();
  }

  clear(): void {
    this.dislikedMoviesIds = [];
    this.likedMoviesIds = [];
    this.alreadyRecommendedMoviesIds = [];
    this.watchLater = [];
    this.save();
  }

  private save(): void {
    saveToStorage({
      dislikedMoviesIds: this.dislikedMoviesIds,
      likedMoviesIds: this.likedMoviesIds,
      alreadyRecommendedMoviesIds: this.alreadyRecommendedMoviesIds,
      watchLater: this.watchLater
    });
  }
}

export const userPreferences = new UserPreferencesStore();
