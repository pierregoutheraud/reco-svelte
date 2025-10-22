<script lang="ts">
  import type { MediaTMDB } from "$lib/tmdb/tmdb.decl";
  import {
    ThumbsDown,
    ThumbsUp,
    BookmarkSimple,
    ArrowSquareOut
  } from "phosphor-svelte";
  import IconButton from "../Button/IconButton.svelte";
  import { userPreferences } from "../../stores/userPreferences.svelte";
  import { getMediaType } from "$lib/tmdb/tmdb";
  import type { Snippet } from "svelte";
  import { getMiruUrl } from "../../helpers/miru.helpers";
  import { toasts } from "../../stores/toasts.store";
  import type { MediaEnriched } from "../../stores/recommendationsStore.svelte";
  import * as m from "$lib/paraglide/messages.js";

  type Props = {
    media: MediaTMDB | MediaEnriched;
    right?: Snippet;
  };

  let { media, right }: Props = $props();

  let mediaType = getMediaType(media);

  let isCurrentMediaDisliked = $derived(userPreferences.isDisliked(media.id));
  let isCurrentMediaLiked = $derived(userPreferences.isLiked(media.id));
  let isCurrentMediaInWatchlist = $derived(
    userPreferences.getWatchlistByMediaId(media.id)
  );

  function handleDisliked() {
    userPreferences.addDisliked(media.id, mediaType);
  }

  function handleLiked() {
    userPreferences.addLiked(media.id, mediaType);
  }

  function handleClickWatchlist() {
    if (isCurrentMediaInWatchlist) {
      userPreferences.removeFromWatchlist(media.id);
      toasts.success(m.media_watchlist_removed());
    } else {
      const reason = "reason" in media ? media.reason : null;
      userPreferences.addToWatchlist(media.id, mediaType, reason);
      toasts.success(m.media_watchlist_added());
    }
  }
</script>

<div class="flex p-3 px-4 gap-2 justify-between bg-background">
  <div class="flex gap-2">
    <IconButton
      icon={ThumbsDown}
      class="text-rose-500"
      mode="ghost"
      size={24}
      weight={isCurrentMediaDisliked ? "fill" : "regular"}
      onclick={() => {
        handleDisliked();
      }}
    />

    <IconButton
      icon={ThumbsUp}
      class="text-teal-500"
      mode="ghost"
      size={24}
      weight={isCurrentMediaLiked ? "fill" : "regular"}
      onclick={() => {
        handleLiked();
      }}
    />

    <IconButton
      icon={BookmarkSimple}
      mode="ghost"
      size={24}
      weight={isCurrentMediaInWatchlist ? "fill" : "regular"}
      onclick={() => {
        handleClickWatchlist();
      }}
    />

    <IconButton
      icon={ArrowSquareOut}
      mode="ghost"
      size={24}
      weight="regular"
      onclick={() => {
        window.open(getMiruUrl(mediaType, media.id), "_blank");
      }}
    />
  </div>

  {@render right?.()}
</div>
