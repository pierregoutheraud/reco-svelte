<script lang="ts">
  import { CRAWLER_SOURCE, type CrawlerRatings } from "$lib/api/ratings.decl";
  import RatingItem from "./RatingItem.svelte";

  interface Props {
    ratings: Partial<CrawlerRatings>;
    title?: string;
    releaseDate?: string | null;
  }

  let { ratings, title, releaseDate }: Props = $props();

  let releaseYear = $derived(
    releaseDate ? new Date(releaseDate).getFullYear() : null
  );

  function goToGoogle() {
    if (!title) {
      return;
    }

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

<div class="flex gap-1 select-none no-scrollbar">
  {#if ratings.imdb?.score}
    <RatingItem
      onclick={() => goToWebsite(CRAWLER_SOURCE.IMDB)}
      title="IMDb"
      scores={[
        {
          value: ratings.imdb.score
        }
      ]}
      crawlerSource={CRAWLER_SOURCE.IMDB}
    />
  {/if}

  {#if ratings.rotten_tomatoes?.averageScore}
    <RatingItem
      onclick={() => goToWebsite(CRAWLER_SOURCE.ROTTEN_TOMATOES)}
      title={`RT`}
      crawlerSource={CRAWLER_SOURCE.ROTTEN_TOMATOES}
      scores={[
        {
          value: ratings.rotten_tomatoes.averageScore
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
          value: ratings.metacritic.averageScore
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

  {#if ratings.average?.score}
    <RatingItem
      title="Average"
      scores={[
        {
          value: ratings.average.score
        }
      ]}
      crawlerSource={CRAWLER_SOURCE.AVERAGE}
      onclick={() => goToGoogle()}
    />
  {/if}
</div>
