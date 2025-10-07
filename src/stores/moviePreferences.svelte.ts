const STORAGE_KEY = "moviePreferences";

interface MoviePreferences {
  dislikedMoviesIds: number[];
  likedMoviesIds: number[];
  alreadyRecommendedMoviesIds: number[];
}

function loadFromStorage(): MoviePreferences {
  if (typeof window === "undefined") {
    return {
      dislikedMoviesIds: [],
      likedMoviesIds: [],
      alreadyRecommendedMoviesIds: []
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
          : []
      };
    }
  } catch (error) {
    console.error("Failed to load movie preferences from storage:", error);
  }

  return {
    dislikedMoviesIds: [],
    likedMoviesIds: [],
    alreadyRecommendedMoviesIds: []
  };
}

function saveToStorage(preferences: MoviePreferences): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save movie preferences to storage:", error);
  }
}

class MoviePreferencesStore {
  private dislikedMoviesIds = $state<number[]>([]);
  private likedMoviesIds = $state<number[]>([]);
  private alreadyRecommendedMoviesIds = $state<number[]>([]);

  constructor() {
    const stored = loadFromStorage();
    this.dislikedMoviesIds = stored.dislikedMoviesIds;
    this.likedMoviesIds = stored.likedMoviesIds;
    this.alreadyRecommendedMoviesIds = stored.alreadyRecommendedMoviesIds;
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

  addDisliked(movieId: number): void {
    if (!this.dislikedMoviesIds.includes(movieId)) {
      this.dislikedMoviesIds.push(movieId);
      this.save();
    }
  }

  addLiked(movieId: number): void {
    if (!this.likedMoviesIds.includes(movieId)) {
      this.likedMoviesIds.push(movieId);
      this.save();
    }
  }

  addMultipleDisliked(movieIds: number[]): void {
    let changed = false;
    for (const id of movieIds) {
      if (!this.dislikedMoviesIds.includes(id)) {
        this.dislikedMoviesIds.push(id);
        changed = true;
      }
    }
    if (changed) {
      this.save();
    }
  }

  addMultipleLiked(movieIds: number[]): void {
    let changed = false;
    for (const id of movieIds) {
      if (!this.likedMoviesIds.includes(id)) {
        this.likedMoviesIds.push(id);
        changed = true;
      }
    }
    if (changed) {
      this.save();
    }
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
    if (!this.alreadyRecommendedMoviesIds.includes(movieId)) {
      this.alreadyRecommendedMoviesIds.push(movieId);
      this.save();
    }
  }

  addMultipleAlreadyRecommended(movieIds: number[]): void {
    let changed = false;
    for (const id of movieIds) {
      if (!this.alreadyRecommendedMoviesIds.includes(id)) {
        this.alreadyRecommendedMoviesIds.push(id);
        changed = true;
      }
    }
    if (changed) {
      this.save();
    }
  }

  clear(): void {
    this.dislikedMoviesIds = [];
    this.likedMoviesIds = [];
    this.alreadyRecommendedMoviesIds = [];
    this.save();
  }

  private save(): void {
    saveToStorage({
      dislikedMoviesIds: this.dislikedMoviesIds,
      likedMoviesIds: this.likedMoviesIds,
      alreadyRecommendedMoviesIds: this.alreadyRecommendedMoviesIds
    });
  }
}

export const moviePreferences = new MoviePreferencesStore();
