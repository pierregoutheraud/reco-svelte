<script lang="ts">
  import { CRAWLER_SOURCE, type CrawlerRatings } from "$lib/api/ratings.decl";
  import RatingItem from "./RatingItem.svelte";

  interface Props {
    ratings: Partial<CrawlerRatings>;
    title: string;
    releaseDate: string | undefined | null;
    direction?: "row" | "column";
  }

  let { ratings, title, releaseDate, direction = "row" }: Props = $props();

  let releaseYear = $derived(
    releaseDate ? new Date(releaseDate).getFullYear() : null
  );

  function goToGoogle() {
    const text = `${title} ${releaseYear}`;
    const q = encodeURIComponent(text);
    const url = `https://www.google.com/search?q=${q}`;
    window.open(url, "_blank");
  }

  function goToWebsite(
    source:
      | CRAWLER_SOURCE.IMDB
      | CRAWLER_SOURCE.LETTERBOXD
      | CRAWLER_SOURCE.ALLOCINE
      | CRAWLER_SOURCE.METACRITIC
      | CRAWLER_SOURCE.ROTTEN_TOMATOES
  ) {
    const url = ratings[source]?.url;

    if (!url) {
      return;
    }

    window.open(url, "_blank");
  }
</script>

<div
  class="RatingsMongo no-scrollbar"
  class:row={direction === "row"}
  class:column={direction === "column"}
>
  {#if ratings.average?.score}
    <RatingItem
      title="Average"
      scores={[
        {
          value: ratings.average.score,
          divider: "/10"
        }
      ]}
      crawlerSource={CRAWLER_SOURCE.AVERAGE}
      onclick={() => goToGoogle()}
    />
  {/if}

  {#if ratings.imdb?.score}
    <RatingItem
      onclick={() => goToWebsite(CRAWLER_SOURCE.IMDB)}
      title="IMDb"
      scores={[
        {
          value: ratings.imdb.score,
          divider: "/10"
        }
      ]}
      crawlerSource={CRAWLER_SOURCE.IMDB}
    />
  {/if}

  {#if ratings.rotten_tomatoes?.averageScore}
    <RatingItem
      onclick={() => goToWebsite(CRAWLER_SOURCE.ROTTEN_TOMATOES)}
      title="Rotten
Tomatoes"
      crawlerSource={CRAWLER_SOURCE.ROTTEN_TOMATOES}
      scores={[
        {
          value: ratings.rotten_tomatoes.averageScore,
          divider: "%"
        }
      ]}
    />
  {/if}

  {#if ratings.metacritic?.averageScore}
    <RatingItem
      onclick={() => goToWebsite(CRAWLER_SOURCE.METACRITIC)}
      title="Metacritic"
      crawlerSource={CRAWLER_SOURCE.METACRITIC}
      scores={[
        {
          value: ratings.metacritic.averageScore,
          divider: "%"
        }
      ]}
    />
  {/if}

  {#if ratings[CRAWLER_SOURCE.LETTERBOXD]?.score}
    <RatingItem
      onclick={() => goToWebsite(CRAWLER_SOURCE.LETTERBOXD)}
      title="Letterboxd"
      crawlerSource={CRAWLER_SOURCE.LETTERBOXD}
      scores={[
        {
          value: ratings[CRAWLER_SOURCE.LETTERBOXD].score,
          divider: "/5"
        }
      ]}
    />
  {/if}
</div>

<style>
  .RatingsMongo {
    display: flex;
    gap: 20px;
    user-select: none;
  }
  .RatingsMongo.column {
    flex-direction: column;
    gap: 12px;
    padding: 0 0px;
    margin: 0 0px;
  }

  .RatingsMongo :global(.RatingBar) {
    flex-shrink: 0;
  }
</style>
