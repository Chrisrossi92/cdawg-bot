const apiConfigForm = document.querySelector("#api-config-form");
const apiBaseUrlInput = document.querySelector("#api-base-url");
const autoRefreshEnabledInput = document.querySelector("#auto-refresh-enabled");
const refreshAllButton = document.querySelector("#refresh-all");

const healthCards = document.querySelector("#health-cards");
const healthOutput = document.querySelector("#health-output");
const settingsOutput = document.querySelector("#settings-output");
const manualPushOutput = document.querySelector("#manual-push-output");
const channelOperationsOutput = document.querySelector("#channel-operations-output");
const dailyTriviaOutput = document.querySelector("#daily-trivia-output");
const feedsOutput = document.querySelector("#feeds-output");
const metricsOutput = document.querySelector("#metrics-output");
const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");
const manualPushForm = document.querySelector("#manual-push-form");
const manualPushStatus = document.querySelector("#manual-push-status");
const dailyTriviaForm = document.querySelector("#daily-trivia-form");
const dailyTriviaStatus = document.querySelector("#daily-trivia-status");
const dailyTriviaSummary = document.querySelector("#daily-trivia-summary");
const feedForm = document.querySelector("#feed-form");
const feedStatus = document.querySelector("#feed-status");
const manualPushChannelMeta = document.querySelector("#manual-push-channel-meta");
const channelOperationsGrid = document.querySelector("#channel-operations-grid");
const channelOperationsFilter = document.querySelector("#channel-operations-filter");
const channelOperationsSort = document.querySelector("#channel-operations-sort");
const feedsList = document.querySelector("#feeds-list");

const passiveMetricsList = document.querySelector("#passive-metrics-list");
const commandMetricsList = document.querySelector("#command-metrics-list");
const providerUsageList = document.querySelector("#provider-usage-list");
const providerSuccessList = document.querySelector("#provider-success-list");
const providerFallbackList = document.querySelector("#provider-fallback-list");
const providerFailureList = document.querySelector("#provider-failure-list");

const refreshHealthButton = document.querySelector("#refresh-health");
const refreshSettingsButton = document.querySelector("#refresh-settings");
const refreshMetricsButton = document.querySelector("#refresh-metrics");
const refreshChannelOperationsButton = document.querySelector("#refresh-channel-operations");
const refreshFeedsButton = document.querySelector("#refresh-feeds");
const resetSettingsButton = document.querySelector("#reset-settings");
const resetFeedFormButton = document.querySelector("#reset-feed-form");

const apiBaseUrlStorageKey = "cdawg-dashboard-api-base-url";
const autoRefreshStorageKey = "cdawg-dashboard-auto-refresh-enabled";
const autoRefreshIntervalMs = 15000;

let lastSettingsSnapshot = null;
let autoRefreshTimer = null;
let channelPresets = [];
let channelAutomationStatuses = [];
let dailyTriviaChallenge = null;
let feeds = [];

const savedApiBaseUrl = window.localStorage.getItem(apiBaseUrlStorageKey);
const savedAutoRefresh = window.localStorage.getItem(autoRefreshStorageKey);

if (savedApiBaseUrl) {
  apiBaseUrlInput.value = savedApiBaseUrl;
}

if (savedAutoRefresh === "true") {
  autoRefreshEnabledInput.checked = true;
}

function getApiBaseUrl() {
  return apiBaseUrlInput.value.replace(/\/+$/, "");
}

function setPrettyJson(target, value) {
  target.textContent = JSON.stringify(value, null, 2);
}

function setStatusMessage(message, kind = "neutral") {
  settingsStatus.textContent = message;
  settingsStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setManualPushStatus(message, kind = "neutral") {
  manualPushStatus.textContent = message;
  manualPushStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setFeedStatus(message, kind = "neutral") {
  feedStatus.textContent = message;
  feedStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setDailyTriviaStatus(message, kind = "neutral") {
  dailyTriviaStatus.textContent = message;
  dailyTriviaStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function getSelectedChannelPreset() {
  const selectedChannelId = manualPushForm.elements.channelPreset.value;
  return channelPresets.find((preset) => preset.channelId === selectedChannelId) ?? null;
}

function renderPresetOptions(targetSelect, previousValue) {
  targetSelect.replaceChildren();

  for (const preset of channelPresets) {
    const option = document.createElement("option");
    option.value = preset.channelId;
    option.textContent = preset.label;
    targetSelect.append(option);
  }

  if (channelPresets.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No channel presets available";
    targetSelect.append(option);
  }

  const hasPreviousValue = channelPresets.some((preset) => preset.channelId === previousValue);
  targetSelect.value = hasPreviousValue ? previousValue : channelPresets[0]?.channelId ?? "";
}

function renderChannelPresetOptions() {
  renderPresetOptions(manualPushForm.elements.channelPreset, manualPushForm.elements.channelPreset.value);
  renderPresetOptions(dailyTriviaForm.elements.channelPreset, dailyTriviaForm.elements.channelPreset.value);
  renderPresetOptions(feedForm.elements.channelPreset, feedForm.elements.channelPreset.value);
}

function syncManualPushPresetSelection(prefillTopic = true) {
  const selectedPreset = getSelectedChannelPreset();

  if (!selectedPreset) {
    manualPushChannelMeta.textContent = "Select a channel preset to use its channel ID.";
    return;
  }

  manualPushChannelMeta.textContent = `Channel ID: ${selectedPreset.channelId}`;

  if (prefillTopic) {
    manualPushForm.elements.topicOverride.value = selectedPreset.defaultTopic ?? "";
  }
}

function createHealthCard(label, value, statusClass = "") {
  const wrapper = document.createElement("article");
  wrapper.className = "health-card";

  const title = document.createElement("strong");
  title.textContent = label;

  const content = document.createElement("div");
  content.className = `health-value ${statusClass}`.trim();
  content.textContent = value;

  wrapper.append(title, content);
  return wrapper;
}

function renderHealthCards(health) {
  healthCards.replaceChildren(
    createHealthCard("API", health.ok ? "Online" : "Offline", health.ok ? "ok" : "bad"),
    createHealthCard("Bot Ready", health.botReady ? "Ready" : "Not Ready", health.botReady ? "ok" : "bad"),
    createHealthCard("Bot Tag", health.botTag || "Unavailable"),
    createHealthCard("API Enabled", health.apiEnabled ? "Enabled" : "Disabled", health.apiEnabled ? "ok" : "bad"),
  );
}

function renderMetricList(target, entries) {
  target.replaceChildren();

  const normalizedEntries = entries.length > 0 ? entries : [["none", 0]];

  for (const [label, value] of normalizedEntries) {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const count = document.createElement("span");

    name.className = "metric-name";
    count.className = "metric-value";
    name.textContent = label;
    count.textContent = String(value);

    item.append(name, count);
    target.append(item);
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "none";
  }

  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return "none";
  }

  const deltaMs = timestamp - Date.now();
  const absoluteDeltaMs = Math.abs(deltaMs);
  const totalMinutes = Math.round(absoluteDeltaMs / 60000);

  if (totalMinutes < 1) {
    return deltaMs >= 0 ? "in less than a minute" : "less than a minute ago";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  const joined = parts.join(" ");
  return deltaMs >= 0 ? `in ${joined}` : `${joined} ago`;
}

function getChannelOperationStatusText(channelStatus) {
  if (channelStatus.blockedReason === "silenced") {
    return `Silenced until ${formatTimestamp(channelStatus.blockedUntil)}`;
  }

  if (channelStatus.blockedReason === "cooldown") {
    return `Cooling down until ${formatTimestamp(channelStatus.blockedUntil)}`;
  }

  if (channelStatus.blockedReason === "skip-next") {
    return "Skip next automated send is pending";
  }

  return "Active";
}

function getChannelStatusLabel(channelStatus) {
  if (channelStatus.blockedReason === "silenced") {
    return "Silenced";
  }

  if (channelStatus.blockedReason === "cooldown") {
    return "Cooling Down";
  }

  if (channelStatus.blockedReason === "skip-next") {
    return "Skip Next";
  }

  return "Active";
}

function getChannelStatusRank(channelStatus) {
  if (channelStatus.blockedReason === "silenced") {
    return 0;
  }

  if (channelStatus.blockedReason === "cooldown") {
    return 1;
  }

  if (channelStatus.blockedReason === "skip-next") {
    return 2;
  }

  return 3;
}

function getFilteredAndSortedChannelStatuses() {
  const filterValue = channelOperationsFilter.value;
  const sortValue = channelOperationsSort.value;

  const filteredStatuses = channelAutomationStatuses.filter((channelStatus) => {
    if (filterValue === "active") {
      return !channelStatus.blockedReason;
    }

    if (filterValue === "blocked") {
      return Boolean(channelStatus.blockedReason);
    }

    return true;
  });

  return [...filteredStatuses].sort((left, right) => {
    if (sortValue === "next-eligible") {
      const leftEligible = left.nextEligibleSendAt ?? Number.POSITIVE_INFINITY;
      const rightEligible = right.nextEligibleSendAt ?? Number.POSITIVE_INFINITY;
      return leftEligible - rightEligible || left.label.localeCompare(right.label);
    }

    if (sortValue === "name") {
      return left.label.localeCompare(right.label);
    }

    return getChannelStatusRank(left) - getChannelStatusRank(right) || left.label.localeCompare(right.label);
  });
}

function createStatusBadge(label, tone) {
  const badge = document.createElement("span");
  badge.className = `status-badge ${tone}`;
  badge.textContent = label;
  return badge;
}

function findPresetForChannel(channelId) {
  return channelPresets.find((preset) => preset.channelId === channelId) ?? null;
}

function getFeedBlockedLabel(feed) {
  if (feed.blockedReason === "silenced") {
    return "silenced";
  }

  if (feed.blockedReason === "cooldown") {
    return "cooldown";
  }

  if (feed.blockedReason === "skip-next") {
    return "skip-next";
  }

  if (feed.blockedReason === "outside-window") {
    return "outside-window";
  }

  if (feed.blockedReason === "trivia-ineligible") {
    return "trivia-ineligible";
  }

  return feed.blockedReason || "clear";
}

function getDailyTriviaBlockedLabel(challenge) {
  if (challenge.blockedReason === "silenced") {
    return "silenced";
  }

  if (challenge.blockedReason === "cooldown") {
    return "cooldown";
  }

  if (challenge.blockedReason === "skip-next") {
    return "skip-next";
  }

  if (challenge.blockedReason === "outside-window") {
    return "outside-window";
  }

  if (challenge.blockedReason === "trivia-ineligible") {
    return "trivia-ineligible";
  }

  return challenge.blockedReason || "clear";
}

function createChannelActionButton(label, handler, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", handler);
  return button;
}

function renderChannelOperations() {
  channelOperationsGrid.replaceChildren();
  const visibleChannelStatuses = getFilteredAndSortedChannelStatuses();

  if (visibleChannelStatuses.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent =
      channelAutomationStatuses.length === 0 ? "No channel automation status available." : "No channels match the current filter.";
    channelOperationsGrid.append(emptyState);
    return;
  }

  for (const channelStatus of visibleChannelStatuses) {
    const card = document.createElement("section");
    const main = document.createElement("div");
    const times = document.createElement("div");
    const identity = document.createElement("div");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    const status = document.createElement("p");
    const badges = document.createElement("div");
    const nextEligible = document.createElement("p");
    const blockedUntil = document.createElement("p");
    const lastSend = document.createElement("p");
    const actions = document.createElement("div");
    const primaryActions = document.createElement("div");
    const secondaryActions = document.createElement("div");

    card.className = "channel-operation-card compact";
    main.className = "channel-operation-main";
    times.className = "channel-operation-times";
    identity.className = "channel-operation-identity";
    title.textContent = channelStatus.label;
    meta.className = "channel-operation-meta";
    meta.textContent = `Channel ID: ${channelStatus.channelId}${channelStatus.defaultTopic ? ` • Topic: ${channelStatus.defaultTopic}` : ""}`;
    status.className = `channel-operation-status ${channelStatus.blockedReason ? "blocked" : "active"}`;
    status.textContent = getChannelOperationStatusText(channelStatus);
    badges.className = "channel-operation-badges";
    badges.append(
      createStatusBadge(getChannelStatusLabel(channelStatus), channelStatus.blockedReason ? "blocked" : "active"),
      createStatusBadge(channelStatus.defaultTopic ?? "no-topic", "neutral"),
      createStatusBadge(channelStatus.automationMode, "neutral"),
    );
    if (channelStatus.skipNextSendPending) {
      badges.append(createStatusBadge("skip-next pending", "blocked"));
    }
    nextEligible.className = "channel-operation-detail channel-operation-detail-strong";
    nextEligible.textContent = `Next eligible: ${formatTimestamp(channelStatus.nextEligibleSendAt)} (${formatRelativeTime(channelStatus.nextEligibleSendAt)})`;
    blockedUntil.className = "channel-operation-detail";
    blockedUntil.textContent = `Blocked until: ${formatTimestamp(channelStatus.blockedUntil)} (${formatRelativeTime(channelStatus.blockedUntil)})`;
    lastSend.className = "channel-operation-detail";
    lastSend.textContent = `Last automated send: ${formatTimestamp(channelStatus.lastAutomatedSendAt)} (${formatRelativeTime(channelStatus.lastAutomatedSendAt)})`;
    actions.className = "channel-operation-actions";
    primaryActions.className = "channel-operation-action-group";
    secondaryActions.className = "channel-operation-action-group secondary";

    primaryActions.append(
      createChannelActionButton("Trigger Next Now", () => void applyChannelOperation(channelStatus.channelId, "trigger-now")),
      createChannelActionButton("Skip Next", () => void applyChannelOperation(channelStatus.channelId, "skip-next")),
      createChannelActionButton("Silence 1 Hour", () => void applyChannelOperation(channelStatus.channelId, "silence", 60 * 60 * 1000)),
      createChannelActionButton("Silence 6 Hours", () => void applyChannelOperation(channelStatus.channelId, "silence", 6 * 60 * 60 * 1000)),
      createChannelActionButton("Cool Down 30 Minutes", () => void applyChannelOperation(channelStatus.channelId, "cooldown", 30 * 60 * 1000)),
    );
    secondaryActions.append(
      createChannelActionButton("Clear Skip", () => void applyChannelOperation(channelStatus.channelId, "clear-skip-next")),
      createChannelActionButton("Resume", () => void applyChannelOperation(channelStatus.channelId, "resume")),
    );

    actions.append(primaryActions, secondaryActions);
    identity.append(title, badges);
    main.append(identity, status, nextEligible, blockedUntil, meta);
    times.append(lastSend);
    card.append(main, times, actions);
    channelOperationsGrid.append(card);
  }
}

function resetFeedForm() {
  feedForm.elements.feedId.value = "";
  feedForm.elements.enabled.value = "true";
  feedForm.elements.channelId.value = "";
  feedForm.elements.contentType.value = "prompt";
  feedForm.elements.cadenceMinutes.value = "60";
  feedForm.elements.topicOverride.value = "";
  feedForm.elements.allowedStartTime.value = "";
  feedForm.elements.allowedEndTime.value = "";
  feedForm.elements.channelPreset.value = channelPresets[0]?.channelId ?? "";
  setFeedStatus("Feed form reset.");
}

function applyDailyTriviaToForm(challenge) {
  const preset = challenge ? findPresetForChannel(challenge.channelId) : null;
  dailyTriviaForm.elements.enabled.value = String(challenge?.enabled ?? true);
  dailyTriviaForm.elements.channelPreset.value = preset?.channelId ?? channelPresets[0]?.channelId ?? "";
  dailyTriviaForm.elements.dailyTime.value = challenge?.dailyTime ?? "09:00";
  dailyTriviaForm.elements.topicOverride.value = challenge?.topicOverride ?? "";
  dailyTriviaForm.elements.allowedStartTime.value = challenge?.allowedWindow?.startTime ?? "";
  dailyTriviaForm.elements.allowedEndTime.value = challenge?.allowedWindow?.endTime ?? "";
}

function populateFeedForm(feed) {
  const preset = findPresetForChannel(feed.channelId);
  feedForm.elements.feedId.value = feed.id;
  feedForm.elements.enabled.value = String(feed.enabled);
  feedForm.elements.channelPreset.value = preset?.channelId ?? channelPresets[0]?.channelId ?? "";
  feedForm.elements.channelId.value = preset ? "" : feed.channelId;
  feedForm.elements.contentType.value = feed.contentType;
  feedForm.elements.cadenceMinutes.value = String(feed.cadenceMinutes);
  feedForm.elements.topicOverride.value = feed.topicOverride ?? "";
  feedForm.elements.allowedStartTime.value = feed.allowedWindow?.startTime ?? "";
  feedForm.elements.allowedEndTime.value = feed.allowedWindow?.endTime ?? "";
  setFeedStatus(`Editing ${feed.id}.`);
}

function renderFeeds() {
  feedsList.replaceChildren();

  if (feeds.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No feeds configured.";
    feedsList.append(emptyState);
    return;
  }

  for (const feed of feeds) {
    const row = document.createElement("section");
    const main = document.createElement("div");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    const primaryDetail = document.createElement("p");
    const secondaryDetail = document.createElement("p");
    const blockedDetail = document.createElement("p");
    const badges = document.createElement("div");
    const actions = document.createElement("div");

    row.className = "channel-operation-card compact";
    main.className = "channel-operation-main";
    title.textContent = `${feed.channelLabel} • ${feed.contentType}`;
    meta.className = "channel-operation-meta";
    meta.textContent = `Channel ${feed.channelId}${feed.topicOverride ? ` • Topic override ${feed.topicOverride}` : ` • Topic ${feed.presetTopic ?? "none"}`}${feed.allowedWindow ? ` • Window ${feed.allowedWindow.startTime}-${feed.allowedWindow.endTime}` : ""}${feed.triviaEligibility && !feed.triviaEligibility.ok ? ` • ${feed.triviaEligibility.error}` : ""}`;
    primaryDetail.className = "channel-operation-detail channel-operation-detail-strong";
    primaryDetail.textContent = `Next run: ${formatTimestamp(feed.nextRunAt)} (${formatRelativeTime(feed.nextRunAt)})`;
    secondaryDetail.className = "channel-operation-detail";
    secondaryDetail.textContent = `Cadence: every ${feed.cadenceMinutes} min • Last run: ${formatTimestamp(feed.lastExecutedAt)} (${formatRelativeTime(feed.lastExecutedAt)})`;
    blockedDetail.className = "channel-operation-detail";
    blockedDetail.textContent = feed.blockedReason
      ? `Blocked: ${getFeedBlockedLabel(feed)}${feed.blockedUntil ? ` until ${formatTimestamp(feed.blockedUntil)} (${formatRelativeTime(feed.blockedUntil)})` : ""}`
      : "Blocked: none";
    badges.className = "channel-operation-badges";
    badges.append(
      createStatusBadge(feed.enabled ? "enabled" : "disabled", feed.enabled ? "active" : "neutral"),
      createStatusBadge(feed.contentType, "neutral"),
      createStatusBadge(feed.presetTopic ?? "custom", "neutral"),
    );
    if (feed.blockedReason) {
      badges.append(createStatusBadge(getFeedBlockedLabel(feed), "blocked"));
    }
    for (const warning of feed.overlapWarnings ?? []) {
      badges.append(createStatusBadge(warning.code === "AGGRESSIVE_CADENCE" ? "fast cadence" : "overlap", "blocked"));
    }
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Edit", () => populateFeedForm(feed)),
      createChannelActionButton(feed.enabled ? "Disable" : "Enable", () => void setFeedEnabledState(feed.id, !feed.enabled)),
      createChannelActionButton("Delete", () => void deleteFeed(feed.id)),
    );

    main.append(title, badges, primaryDetail, blockedDetail, secondaryDetail, meta);
    row.append(main, actions);
    feedsList.append(row);
  }
}

function renderDailyTriviaChallenge() {
  dailyTriviaSummary.replaceChildren();

  if (!dailyTriviaChallenge) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "Daily Trivia Challenge is not configured yet.";
    dailyTriviaSummary.append(emptyState);
    applyDailyTriviaToForm(null);
    return;
  }

  const row = document.createElement("section");
  const main = document.createElement("div");
  const title = document.createElement("h3");
  const badges = document.createElement("div");
  const primaryDetail = document.createElement("p");
  const blockedDetail = document.createElement("p");
  const secondaryDetail = document.createElement("p");
  const sessionDetail = document.createElement("p");
  const meta = document.createElement("p");

  row.className = "channel-operation-card compact";
  main.className = "channel-operation-main";
  title.textContent = `${dailyTriviaChallenge.channelLabel} • Daily Trivia`;
  badges.className = "channel-operation-badges";
  badges.append(
    createStatusBadge(dailyTriviaChallenge.enabled ? "enabled" : "disabled", dailyTriviaChallenge.enabled ? "active" : "neutral"),
    createStatusBadge("daily-trivia", "neutral"),
    createStatusBadge(dailyTriviaChallenge.presetTopic ?? "custom", "neutral"),
  );
  if (dailyTriviaChallenge.blockedReason) {
    badges.append(createStatusBadge(getDailyTriviaBlockedLabel(dailyTriviaChallenge), "blocked"));
  }
  primaryDetail.className = "channel-operation-detail channel-operation-detail-strong";
  primaryDetail.textContent = `Next run: ${formatTimestamp(dailyTriviaChallenge.nextRunAt)} (${formatRelativeTime(dailyTriviaChallenge.nextRunAt)})`;
  blockedDetail.className = "channel-operation-detail";
  blockedDetail.textContent = dailyTriviaChallenge.blockedReason
    ? `Blocked: ${getDailyTriviaBlockedLabel(dailyTriviaChallenge)}${dailyTriviaChallenge.blockedUntil ? ` until ${formatTimestamp(dailyTriviaChallenge.blockedUntil)} (${formatRelativeTime(dailyTriviaChallenge.blockedUntil)})` : ""}`
    : "Blocked: none";
  secondaryDetail.className = "channel-operation-detail";
  secondaryDetail.textContent = `Daily time: ${dailyTriviaChallenge.dailyTime} • Last run: ${formatTimestamp(dailyTriviaChallenge.lastExecutedAt)} (${formatRelativeTime(dailyTriviaChallenge.lastExecutedAt)})`;
  sessionDetail.className = "channel-operation-detail";
  sessionDetail.textContent = dailyTriviaChallenge.latestSession
    ? `Session: ${dailyTriviaChallenge.latestSession.active ? "active" : "closed"} • Answers: ${dailyTriviaChallenge.latestSession.answerCount} • Correct recorded: ${dailyTriviaChallenge.latestSession.hasCorrectAnswer ? "yes" : "no"}${dailyTriviaChallenge.latestSession.fastestCorrectUserId ? ` • Fastest correct: <@${dailyTriviaChallenge.latestSession.fastestCorrectUserId}>` : ""}`
    : "Session: none yet";
  meta.className = "channel-operation-meta";
  meta.textContent = `Channel ${dailyTriviaChallenge.channelId}${dailyTriviaChallenge.topicOverride ? ` • Topic override ${dailyTriviaChallenge.topicOverride}` : ` • Topic ${dailyTriviaChallenge.presetTopic ?? "none"}`}${dailyTriviaChallenge.allowedWindow ? ` • Window ${dailyTriviaChallenge.allowedWindow.startTime}-${dailyTriviaChallenge.allowedWindow.endTime}` : ""}${dailyTriviaChallenge.latestSession?.category ? ` • Category ${dailyTriviaChallenge.latestSession.category}` : ""}${dailyTriviaChallenge.latestSession?.difficulty ? ` • Difficulty ${dailyTriviaChallenge.latestSession.difficulty}` : ""}${dailyTriviaChallenge.triviaEligibility && !dailyTriviaChallenge.triviaEligibility.ok ? ` • ${dailyTriviaChallenge.triviaEligibility.error}` : ""}`;

  main.append(title, badges, primaryDetail, blockedDetail, secondaryDetail, sessionDetail, meta);
  row.append(main);
  dailyTriviaSummary.append(row);
  applyDailyTriviaToForm(dailyTriviaChallenge);
}

function sortCounterEntries(counterMap) {
  return Object.entries(counterMap).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
}

async function fetchJson(path, init) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, init);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed with ${response.status}`);
  }

  return data;
}

function applySettingsToForm(settings) {
  settingsForm.elements.passiveEnabled.value = String(settings.passiveChat.enabled);
  settingsForm.elements.triggerChance.value = String(settings.passiveChat.triggerChance);
  settingsForm.elements.globalCooldownMs.value = String(settings.passiveChat.globalCooldownMs);
  settingsForm.elements.channelCooldownMs.value = String(settings.passiveChat.channelCooldownMs);
  settingsForm.elements.quietChannelThresholdMs.value = String(settings.passiveChat.quietChannelThresholdMs);
  settingsForm.elements.conversationNudgeMessageThreshold.value = String(
    settings.passiveChat.conversationNudgeMessageThreshold,
  );
  settingsForm.elements.providerLoggingEnabled.value = String(settings.contentProviders.debugLogging);
}

function resetSettingsForm() {
  if (!lastSettingsSnapshot) {
    return;
  }

  applySettingsToForm(lastSettingsSnapshot);
  setStatusMessage("Form reset to current runtime settings.");
}

async function loadHealth() {
  try {
    const data = await fetchJson("/health");
    renderHealthCards(data);
    setPrettyJson(healthOutput, data);
  } catch (error) {
    healthCards.replaceChildren(createHealthCard("Health", "Unavailable", "bad"));
    healthOutput.textContent = `Failed to load health.\n${error.message}`;
  }
}

async function loadSettings() {
  try {
    const data = await fetchJson("/api/settings");
    lastSettingsSnapshot = data.settings;
    applySettingsToForm(data.settings);
    setPrettyJson(settingsOutput, data);
  } catch (error) {
    settingsOutput.textContent = `Failed to load settings.\n${error.message}`;
    setStatusMessage(`Settings load failed: ${error.message}`, "error");
  }
}

async function loadMetrics() {
  try {
    const data = await fetchJson("/api/metrics");
    const metrics = data.metrics;

    renderMetricList(passiveMetricsList, [
      ["total triggers", metrics.passiveChat.triggerCount],
      ["quiet-gap triggers", metrics.passiveChat.quietGapTriggerCount],
      ["conversation nudges", metrics.passiveChat.conversationNudgeCount],
    ]);
    renderMetricList(commandMetricsList, sortCounterEntries(metrics.slashCommandUsageCounts));
    renderMetricList(providerUsageList, sortCounterEntries(metrics.contentProviders.usageCounts));
    renderMetricList(providerSuccessList, sortCounterEntries(metrics.contentProviders.apiSuccessCounts));
    renderMetricList(providerFallbackList, sortCounterEntries(metrics.contentProviders.fallbackToLocalCounts));
    renderMetricList(providerFailureList, sortCounterEntries(metrics.contentProviders.apiFailureCounts));
    setPrettyJson(metricsOutput, data);
  } catch (error) {
    metricsOutput.textContent = `Failed to load metrics.\n${error.message}`;
  }
}

async function loadChannelPresets() {
  try {
    const data = await fetchJson("/api/channel-presets");
    channelPresets = Array.isArray(data.channelPresets) ? data.channelPresets : [];
    const previousSelection = manualPushForm.elements.channelPreset.value;
    renderChannelPresetOptions();
    syncManualPushPresetSelection(!previousSelection || previousSelection !== manualPushForm.elements.channelPreset.value);
    if (!dailyTriviaChallenge) {
      applyDailyTriviaToForm(null);
    }
    if (!feedForm.elements.feedId.value) {
      feedForm.elements.channelPreset.value = feedForm.elements.channelPreset.value || channelPresets[0]?.channelId || "";
      if (!feedForm.elements.cadenceMinutes.value) {
        feedForm.elements.cadenceMinutes.value = "60";
      }
      if (!feedForm.elements.contentType.value) {
        feedForm.elements.contentType.value = "prompt";
      }
    }
  } catch (error) {
    channelPresets = [];
    renderChannelPresetOptions();
    manualPushChannelMeta.textContent = `Preset load failed: ${error.message}`;
  }
}

async function loadFeeds() {
  try {
    const data = await fetchJson("/api/feeds");
    feeds = Array.isArray(data.feeds) ? data.feeds : [];
    renderFeeds();
    setPrettyJson(feedsOutput, data);
  } catch (error) {
    feeds = [];
    renderFeeds();
    feedsOutput.textContent = `Failed to load feeds.\n${error.message}`;
  }
}

async function loadDailyTriviaChallenge() {
  try {
    const data = await fetchJson("/api/daily-trivia");
    dailyTriviaChallenge = data.dailyTriviaChallenge ?? null;
    renderDailyTriviaChallenge();
    setPrettyJson(dailyTriviaOutput, data);
  } catch (error) {
    dailyTriviaChallenge = null;
    renderDailyTriviaChallenge();
    dailyTriviaOutput.textContent = `Failed to load daily trivia.\n${error.message}`;
    setDailyTriviaStatus(`Daily trivia load failed: ${error.message}`, "error");
  }
}

async function loadChannelOperations() {
  try {
    const data = await fetchJson("/api/channel-automation-status");
    channelAutomationStatuses = Array.isArray(data.channelAutomationStatuses) ? data.channelAutomationStatuses : [];
    renderChannelOperations();
    setPrettyJson(channelOperationsOutput, data);
  } catch (error) {
    channelAutomationStatuses = [];
    renderChannelOperations();
    channelOperationsOutput.textContent = `Failed to load channel automation status.\n${error.message}`;
  }
}

function buildSettingsPayload() {
  return {
    passiveChat: {
      enabled: settingsForm.elements.passiveEnabled.value === "true",
      triggerChance: Number(settingsForm.elements.triggerChance.value),
      globalCooldownMs: Number(settingsForm.elements.globalCooldownMs.value),
      channelCooldownMs: Number(settingsForm.elements.channelCooldownMs.value),
      quietChannelThresholdMs: Number(settingsForm.elements.quietChannelThresholdMs.value),
      conversationNudgeMessageThreshold: Number(settingsForm.elements.conversationNudgeMessageThreshold.value),
    },
    contentProviders: {
      debugLogging: settingsForm.elements.providerLoggingEnabled.value === "true",
    },
  };
}

async function saveSettings(event) {
  event.preventDefault();
  setStatusMessage("Saving...");

  try {
    const data = await fetchJson("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildSettingsPayload()),
    });

    lastSettingsSnapshot = data.settings;
    applySettingsToForm(data.settings);
    setPrettyJson(settingsOutput, data);
    setStatusMessage("Settings saved.", "success");
    await loadHealth();
  } catch (error) {
    setStatusMessage(`Save failed: ${error.message}`, "error");
  }
}

function buildManualPushPayload() {
  const selectedPreset = getSelectedChannelPreset();
  const topicOverride = manualPushForm.elements.topicOverride.value.trim();

  return {
    channelId: selectedPreset ? selectedPreset.channelId : "",
    contentType: manualPushForm.elements.contentType.value,
    ...(topicOverride ? { topicOverride } : {}),
  };
}

async function submitManualPush(event) {
  event.preventDefault();
  setManualPushStatus("Sending...");

  const payload = buildManualPushPayload();
  setPrettyJson(manualPushOutput, payload);

  try {
    const data = await fetchJson("/api/actions/push-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setPrettyJson(manualPushOutput, data);
    setManualPushStatus(`Sent ${data.contentType} to ${data.channelId}.`, "success");
    await loadHealth();
  } catch (error) {
    manualPushOutput.textContent = `Manual push failed.\n${error.message}`;
    setManualPushStatus(`Push failed: ${error.message}`, "error");
  }
}

function buildDailyTriviaPayload() {
  const topicOverride = dailyTriviaForm.elements.topicOverride.value.trim();
  const allowedStartTime = dailyTriviaForm.elements.allowedStartTime.value;
  const allowedEndTime = dailyTriviaForm.elements.allowedEndTime.value;

  return {
    enabled: dailyTriviaForm.elements.enabled.value === "true",
    channelId: dailyTriviaForm.elements.channelPreset.value,
    dailyTime: dailyTriviaForm.elements.dailyTime.value,
    topicOverride: topicOverride || null,
    allowedWindow: allowedStartTime && allowedEndTime ? { startTime: allowedStartTime, endTime: allowedEndTime } : null,
  };
}

async function saveDailyTriviaChallenge(event) {
  event.preventDefault();
  setDailyTriviaStatus("Saving...");

  const payload = buildDailyTriviaPayload();

  try {
    const data = await fetchJson("/api/daily-trivia/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    dailyTriviaChallenge = data.dailyTriviaChallenge ?? null;
    renderDailyTriviaChallenge();
    setPrettyJson(dailyTriviaOutput, data);
    setDailyTriviaStatus("Daily trivia saved.", "success");
    await loadChannelOperations();
  } catch (error) {
    setDailyTriviaStatus(`Daily trivia save failed: ${error.message}`, "error");
  }
}

function buildFeedPayload() {
  const manualChannelId = feedForm.elements.channelId.value.trim();
  const topicOverride = feedForm.elements.topicOverride.value.trim();
  const allowedStartTime = feedForm.elements.allowedStartTime.value;
  const allowedEndTime = feedForm.elements.allowedEndTime.value;

  return {
    enabled: feedForm.elements.enabled.value === "true",
    channelId: manualChannelId || feedForm.elements.channelPreset.value,
    contentType: feedForm.elements.contentType.value,
    cadenceMinutes: Number(feedForm.elements.cadenceMinutes.value),
    topicOverride: topicOverride || null,
    allowedWindow: allowedStartTime && allowedEndTime ? { startTime: allowedStartTime, endTime: allowedEndTime } : null,
  };
}

async function saveFeed(event) {
  event.preventDefault();
  setFeedStatus("Saving...");

  const feedId = feedForm.elements.feedId.value;
  const payload = buildFeedPayload();
  const requestPath = feedId ? "/api/feeds/update" : "/api/feeds/create";

  try {
    const data = await fetchJson(requestPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedId ? { id: feedId, ...payload } : payload),
    });

    setPrettyJson(feedsOutput, data);
    setFeedStatus(feedId ? "Feed updated." : "Feed created.", "success");
    resetFeedForm();
    await Promise.all([loadFeeds(), loadChannelOperations()]);
  } catch (error) {
    setFeedStatus(`Feed save failed: ${error.message}`, "error");
  }
}

async function setFeedEnabledState(feedId, enabled) {
  try {
    const data = await fetchJson("/api/feeds/set-enabled", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: feedId,
        enabled,
      }),
    });

    setPrettyJson(feedsOutput, data);
    await Promise.all([loadFeeds(), loadChannelOperations()]);
  } catch (error) {
    feedsOutput.textContent = `Feed toggle failed.\n${error.message}`;
  }
}

async function deleteFeed(feedId) {
  try {
    const data = await fetchJson("/api/feeds/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: feedId,
      }),
    });

    setPrettyJson(feedsOutput, data);
    if (feedForm.elements.feedId.value === feedId) {
      resetFeedForm();
    }
    await Promise.all([loadFeeds(), loadChannelOperations()]);
  } catch (error) {
    feedsOutput.textContent = `Feed delete failed.\n${error.message}`;
  }
}

async function applyChannelOperation(channelId, operation, durationMs) {
  const requestPath =
    operation === "silence"
      ? "/api/channel-operations/silence"
      : operation === "cooldown"
        ? "/api/channel-operations/cooldown"
        : operation === "skip-next"
          ? "/api/channel-operations/skip-next"
          : operation === "clear-skip-next"
            ? "/api/channel-operations/clear-skip-next"
            : operation === "trigger-now"
              ? "/api/channel-operations/trigger-now"
              : "/api/channel-operations/resume";
  const payload = durationMs ? { channelId, durationMs } : { channelId };

  channelOperationsOutput.textContent = JSON.stringify(
    {
      requestPath,
      ...payload,
    },
    null,
    2,
  );

  try {
    const data = await fetchJson(requestPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setPrettyJson(channelOperationsOutput, data);
    await loadChannelOperations();
  } catch (error) {
    channelOperationsOutput.textContent = `Channel operation failed.\n${error.message}`;
  }
}

async function reloadAll() {
  await Promise.all([
    loadHealth(),
    loadSettings(),
    loadMetrics(),
    loadChannelOperations(),
    loadChannelPresets(),
    loadDailyTriviaChallenge(),
    loadFeeds(),
  ]);
}

function configureAutoRefresh() {
  window.localStorage.setItem(autoRefreshStorageKey, String(autoRefreshEnabledInput.checked));

  if (autoRefreshTimer) {
    window.clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }

  if (autoRefreshEnabledInput.checked) {
    autoRefreshTimer = window.setInterval(() => {
      void reloadAll();
    }, autoRefreshIntervalMs);
  }
}

apiConfigForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  window.localStorage.setItem(apiBaseUrlStorageKey, getApiBaseUrl());
  setStatusMessage("Reconnected to API.");
  await reloadAll();
});

settingsForm.addEventListener("submit", saveSettings);
manualPushForm.addEventListener("submit", submitManualPush);
dailyTriviaForm.addEventListener("submit", saveDailyTriviaChallenge);
feedForm.addEventListener("submit", saveFeed);
manualPushForm.elements.channelPreset.addEventListener("change", () => syncManualPushPresetSelection(true));
resetSettingsButton.addEventListener("click", resetSettingsForm);
resetFeedFormButton.addEventListener("click", resetFeedForm);
refreshAllButton.addEventListener("click", () => void reloadAll());
refreshHealthButton.addEventListener("click", loadHealth);
refreshSettingsButton.addEventListener("click", loadSettings);
refreshMetricsButton.addEventListener("click", loadMetrics);
refreshChannelOperationsButton.addEventListener("click", loadChannelOperations);
refreshFeedsButton.addEventListener("click", loadFeeds);
channelOperationsFilter.addEventListener("change", renderChannelOperations);
channelOperationsSort.addEventListener("change", renderChannelOperations);
autoRefreshEnabledInput.addEventListener("change", configureAutoRefresh);

configureAutoRefresh();
void reloadAll();
