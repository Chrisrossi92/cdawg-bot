import type { Topic } from "../config/topics.js";
import { facts as generalFacts } from "../content/facts/general.js";
import { facts as historyFacts } from "../content/facts/history.js";
import { facts as palworldFacts } from "../content/facts/palworld.js";
import { facts as pokemonFacts } from "../content/facts/pokemon.js";
import { facts as valheimFacts } from "../content/facts/valheim.js";
import { jokes as generalJokes } from "../content/jokes/general.js";
import { jokes as palworldJokes } from "../content/jokes/palworld.js";
import { jokes as valheimJokes } from "../content/jokes/valheim.js";
import { prompts as generalDiscussionPrompts } from "../content/prompts/general.js";
import { prompts as genealogyPrompts } from "../content/prompts/genealogy.js";
import { prompts as harryPotterPrompts } from "../content/prompts/harry-potter.js";
import { prompts as historyDiscussionPrompts } from "../content/prompts/history.js";
import { prompts as musicPrompts } from "../content/prompts/music.js";
import { prompts as palworldPrompts } from "../content/prompts/palworld.js";
import { prompts as pokemonDiscussionPrompts } from "../content/prompts/pokemon.js";
import { prompts as valheimPrompts } from "../content/prompts/valheim.js";
import { trivia as generalTrivia } from "../content/trivia/general.js";
import { trivia as historyTrivia } from "../content/trivia/history.js";
import { trivia as palworldTrivia } from "../content/trivia/palworld.js";
import { trivia as pokemonTrivia } from "../content/trivia/pokemon.js";
import { trivia as valheimTrivia } from "../content/trivia/valheim.js";
import { wyrPrompts as generalWyrPrompts } from "../content/wyr/general.js";
import { wyrPrompts as historyWyrPrompts } from "../content/wyr/history.js";
import { wyrPrompts as pokemonWyrPrompts } from "../content/wyr/pokemon.js";
import { wyrPrompts as valheimWyrPrompts } from "../content/wyr/valheim.js";
import type { ContentItem, ContentProvider, ContentProviderResult, ContentType } from "./content-provider.js";

type ContentPoolsByType = {
  [K in ContentType]: Partial<Record<Topic, readonly ContentItem<K>[]>>;
};

const localContentPools: ContentPoolsByType = {
  fact: {
    general: generalFacts,
    history: historyFacts,
    palworld: palworldFacts,
    pokemon: pokemonFacts,
    valheim: valheimFacts,
  },
  joke: {
    general: generalJokes,
    palworld: palworldJokes,
    valheim: valheimJokes,
  },
  wyr: {
    general: generalWyrPrompts,
    history: historyWyrPrompts,
    pokemon: pokemonWyrPrompts,
    valheim: valheimWyrPrompts,
  },
  prompt: {
    general: generalDiscussionPrompts,
    history: historyDiscussionPrompts,
    genealogy: genealogyPrompts,
    palworld: palworldPrompts,
    pokemon: pokemonDiscussionPrompts,
    "harry-potter": harryPotterPrompts,
    music: musicPrompts,
    valheim: valheimPrompts,
  },
  trivia: {
    general: generalTrivia,
    history: historyTrivia,
    pokemon: pokemonTrivia,
    palworld: palworldTrivia,
    valheim: valheimTrivia,
  },
};

export function hasLocalContentPool<T extends ContentType>(contentType: T, topic: Topic) {
  const topicPools = localContentPools[contentType];
  const topicItems = topicPools[topic];
  return Array.isArray(topicItems) && topicItems.length > 0;
}

function getLocalItemsForTopic<T extends ContentType>(
  contentType: T,
  topic: Topic,
): Omit<ContentProviderResult<T>, "providerName"> | undefined {
  const topicPools = localContentPools[contentType];
  const topicItems = topicPools[topic];

  if (topicItems && topicItems.length > 0) {
    return {
      items: topicItems,
      sourceTopic: topic,
    };
  }

  const generalItems = topicPools.general;

  if (generalItems && generalItems.length > 0) {
    return {
      items: generalItems,
      sourceTopic: "general",
    };
  }

  return undefined;
}

export const localContentProvider: ContentProvider = {
  name: "local",
  async getItems({ contentType, topic }) {
    const result = getLocalItemsForTopic(contentType, topic);

    if (!result) {
      return undefined;
    }

    return {
      ...result,
      providerName: "local",
    };
  },
};
