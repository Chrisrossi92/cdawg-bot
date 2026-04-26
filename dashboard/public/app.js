const apiConfigForm = document.querySelector("#api-config-form");
const apiBaseUrlInput = document.querySelector("#api-base-url");
const autoRefreshEnabledInput = document.querySelector("#auto-refresh-enabled");
const refreshAllButton = document.querySelector("#refresh-all");
const automationMasterBadge = document.querySelector("#automation-master-badge");
const automationMasterButton = document.querySelector("#automation-master-button");
const automationMasterDetail = document.querySelector("#automation-master-detail");
const automationMasterBanner = document.querySelector("#automation-master-banner");
const discordMetadataWarning = document.querySelector("#discord-metadata-warning");

const healthCards = document.querySelector("#health-cards");
const healthOutput = document.querySelector("#health-output");
const settingsOutput = document.querySelector("#settings-output");
const manualPushOutput = document.querySelector("#manual-push-output");
const channelOperationsOutput = document.querySelector("#channel-operations-output");
const dogOutput = document.querySelector("#dog-output");
const dailyTriviaOutput = document.querySelector("#daily-trivia-output");
const historyReviewOutput = document.querySelector("#history-review-output");
const feedsOutput = document.querySelector("#feeds-output");
const roleAccessPanelsOutput = document.querySelector("#role-access-panels-output");
const roleFollowupsOutput = document.querySelector("#role-followups-output");
const metricsOutput = document.querySelector("#metrics-output");
const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");
const manualPushForm = document.querySelector("#manual-push-form");
const manualPushStatus = document.querySelector("#manual-push-status");
const dailyTriviaForm = document.querySelector("#daily-trivia-form");
const dailyTriviaStatus = document.querySelector("#daily-trivia-status");
const dailyTriviaSummary = document.querySelector("#daily-trivia-summary");
const dogSummary = document.querySelector("#dog-summary");
const feedForm = document.querySelector("#feed-form");
const feedStatus = document.querySelector("#feed-status");
const roleAccessPanelForm = document.querySelector("#role-access-panel-form");
const roleAccessPanelStatus = document.querySelector("#role-access-panel-status");
const roleFollowupForm = document.querySelector("#role-followup-form");
const roleFollowupStatus = document.querySelector("#role-followup-status");
const historyReviewStatus = document.querySelector("#history-review-status");
const manualPushChannelMeta = document.querySelector("#manual-push-channel-meta");
const historyReviewCard = document.querySelector("#history-review-card");
const channelOperationsGrid = document.querySelector("#channel-operations-grid");
const channelOperationsFilter = document.querySelector("#channel-operations-filter");
const channelOperationsSort = document.querySelector("#channel-operations-sort");
const feedsList = document.querySelector("#feeds-list");
const roleAccessPanelsList = document.querySelector("#role-access-panels-list");
const roleAccessPreview = document.querySelector("#role-access-preview");
const roleFollowupsList = document.querySelector("#role-followups-list");
const roleFollowupPreview = document.querySelector("#role-followup-preview");
const followupInsertChannelButton = document.querySelector("[data-followup-insert-channel]");
const followupInsertRoleButton = document.querySelector("[data-followup-insert-role]");
const controlTabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const controlTabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));

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
const refreshRoleAccessPanelsButton = document.querySelector("#refresh-role-access-panels");
const refreshRoleFollowupsButton = document.querySelector("#refresh-role-followups");
const refreshHistoryReviewButton = document.querySelector("#refresh-history-review");
const rerollHistoryReviewButton = document.querySelector("#reroll-history-review");
const pushHistoryPreviewButton = document.querySelector("#push-history-preview");
const resetSettingsButton = document.querySelector("#reset-settings");
const resetFeedFormButton = document.querySelector("#reset-feed-form");
const resetRoleAccessPanelFormButton = document.querySelector("#reset-role-access-panel-form");
const postRoleAccessPanelFormButton = document.querySelector("#post-role-access-panel-form");
const resetRoleFollowupFormButton = document.querySelector("#reset-role-followup-form");
const deleteRoleFollowupFormButton = document.querySelector("#delete-role-followup-form");

const apiBaseUrlStorageKey = "cdawg-dashboard-api-base-url";
const autoRefreshStorageKey = "cdawg-dashboard-auto-refresh-enabled";
const autoRefreshIntervalMs = 15000;

let lastSettingsSnapshot = null;
let autoRefreshTimer = null;
let channelPresets = [];
let guildRoles = [];
let guildChannels = [];
let channelAutomationStatuses = [];
let automationMaster = { globalAutomationEnabled: true, status: "on" };
let dogState = null;
let dogSystemEnabled = false;
let dailyTriviaChallenge = null;
let historyReview = null;
let feeds = [];
let roleAccessPanels = [];
let roleFollowups = [];
let activeControlTab = "overview";

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

function setRoleAccessPanelStatus(message, kind = "neutral") {
  roleAccessPanelStatus.textContent = message;
  roleAccessPanelStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setRoleFollowupStatus(message, kind = "neutral") {
  roleFollowupStatus.textContent = message;
  roleFollowupStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setDailyTriviaStatus(message, kind = "neutral") {
  dailyTriviaStatus.textContent = message;
  dailyTriviaStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setHistoryReviewStatus(message, kind = "neutral") {
  historyReviewStatus.textContent = message;
  historyReviewStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function applyAutomationMasterState(nextState) {
  if (!nextState || typeof nextState.globalAutomationEnabled !== "boolean") {
    return;
  }

  automationMaster = {
    globalAutomationEnabled: nextState.globalAutomationEnabled,
    status: nextState.status === "off" ? "off" : "on",
  };
}

function renderAutomationMaster() {
  const enabled = automationMaster.globalAutomationEnabled;

  automationMasterBadge.textContent = `Automation Master: ${enabled ? "ON" : "OFF"}`;
  automationMasterBadge.className = `status-badge ${enabled ? "active" : "blocked"} automation-master-badge`;
  automationMasterButton.textContent = enabled ? "Turn Master OFF" : "Turn Master ON";
  automationMasterButton.className = enabled ? "secondary" : "";
  automationMasterDetail.textContent = enabled
    ? "Automatic posting is allowed globally. Channel-level controls still apply."
    : "All automatic posting is disabled globally. Manual triggers remain available for testing.";

  automationMasterBanner.hidden = enabled;
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

function getRoleLabel(roleId) {
  const role = guildRoles.find((entry) => entry.id === roleId);
  return role ? role.name : roleId || "not set";
}

function getChannelLabel(channelId) {
  const channel = guildChannels.find((entry) => entry.id === channelId);
  return channel ? `#${channel.name}` : channelId || "not set";
}

function getDetailedRoleLabel(roleId) {
  const role = guildRoles.find((entry) => entry.id === roleId);
  return role ? `${role.name} (${role.id})` : roleId || "not set";
}

function getDetailedChannelLabel(channelId, emptyLabel = "choose when posting") {
  if (!channelId) {
    return emptyLabel;
  }

  const channel = guildChannels.find((entry) => entry.id === channelId);
  return channel ? `#${channel.name} (${channel.id})` : channelId;
}

function renderDiscordMetadataOptions() {
  for (const select of document.querySelectorAll("[data-discord-role-select]")) {
    const previousValue = select.value;
    select.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = guildRoles.length > 0 ? "Select role..." : "Paste role ID below";
    select.append(placeholder);

    for (const role of guildRoles) {
      const option = document.createElement("option");
      option.value = role.id;
      option.textContent = role.name;
      select.append(option);
    }

    select.value = guildRoles.some((role) => role.id === previousValue) ? previousValue : "";
  }

  for (const select of document.querySelectorAll("[data-discord-channel-select]")) {
    const previousValue = select.value;
    select.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = guildChannels.length > 0 ? "Select channel..." : "Paste channel ID below";
    select.append(placeholder);

    for (const channel of guildChannels) {
      const option = document.createElement("option");
      option.value = channel.id;
      option.textContent = `#${channel.name}`;
      select.append(option);
    }

    select.value = guildChannels.some((channel) => channel.id === previousValue) ? previousValue : "";
  }

  syncDiscordMetadataSelections();
}

function syncDiscordMetadataSelections() {
  for (const select of document.querySelectorAll("[data-discord-role-select], [data-discord-channel-select]")) {
    const targetInput = getDiscordMetadataTargetInput(select);
    const currentValue = targetInput?.value?.trim() ?? "";

    if ([...select.options].some((option) => option.value === currentValue)) {
      select.value = currentValue;
    } else {
      select.value = "";
    }
  }
}

function getDiscordMetadataTargetInput(select) {
  const targetInputName = select.dataset.targetInput;

  if (!targetInputName || !select.form) {
    return null;
  }

  const targetInput = select.form.querySelector(`[name="${targetInputName}"]`);
  return targetInput instanceof HTMLInputElement ? targetInput : null;
}

function updateDiscordMetadataSelection(select) {
  const targetInput = getDiscordMetadataTargetInput(select);

  console.debug("[discord-metadata] select changed", {
    selectName: select.name,
    selectedValue: select.value,
    targetInputName: select.dataset.targetInput,
    targetInputFound: Boolean(targetInput),
    formId: select.form?.id ?? null,
  });

  if (!targetInput) {
    return;
  }

  targetInput.value = select.value;
  console.debug("[discord-metadata] raw input updated", {
    inputName: targetInput.name,
    inputValue: targetInput.value,
  });

  if (select.form === roleAccessPanelForm) {
    syncDiscordMetadataSelections();
    renderRoleAccessPreview();
    console.debug("[discord-metadata] access preview rendered");
    return;
  }

  if (select.form === roleFollowupForm) {
    syncDiscordMetadataSelections();
    renderRoleFollowupPreview();
    console.debug("[discord-metadata] follow-up preview rendered");
  }
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
  wrapper.className = `health-card ${statusClass ? `health-card-${statusClass}` : ""}`.trim();

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
  if (channelStatus.blockedReason === "global-disabled") {
    return "Automation master is off for all channels";
  }

  if (channelStatus.blockedReason === "disabled") {
    return "Automation is off for this channel";
  }

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
  if (channelStatus.blockedReason === "global-disabled") {
    return "Master Off";
  }

  if (channelStatus.blockedReason === "disabled") {
    return "Automation Off";
  }

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
  if (channelStatus.blockedReason === "global-disabled") {
    return 0;
  }

  if (channelStatus.blockedReason === "disabled") {
    return 1;
  }

  if (channelStatus.blockedReason === "silenced") {
    return 2;
  }

  if (channelStatus.blockedReason === "cooldown") {
    return 3;
  }

  if (channelStatus.blockedReason === "skip-next") {
    return 4;
  }

  return 5;
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

function getDogHealthLabel(value) {
  if (value <= 30) {
    return "low";
  }

  if (value >= 75) {
    return "high";
  }

  return "ok";
}

function findPresetForChannel(channelId) {
  return channelPresets.find((preset) => preset.channelId === channelId) ?? null;
}

function getFeedBlockedLabel(feed) {
  if (feed.blockedReason === "global-disabled") {
    return "global-disabled";
  }

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
  if (challenge.blockedReason === "global-disabled") {
    return "global-disabled";
  }

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

function createChannelInlineActionButton(label, handler, options = {}) {
  const button = createChannelActionButton(label, (event) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
  }, options.disabled);

  if (options.variant === "secondary") {
    button.classList.add("secondary");
  }

  if (options.variant === "ghost") {
    button.classList.add("ghost");
  }

  return button;
}

function setActiveControlTab(tabName) {
  activeControlTab = tabName;

  for (const button of controlTabButtons) {
    const isActive = button.dataset.tabTarget === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  }

  for (const panel of controlTabPanels) {
    panel.hidden = panel.dataset.tabPanel !== tabName;
  }
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
    const row = document.createElement("details");
    const summary = document.createElement("summary");
    const summaryMain = document.createElement("div");
    const summaryIdentity = document.createElement("div");
    const summaryTitleBlock = document.createElement("div");
    const title = document.createElement("h3");
    const blockedSummary = document.createElement("p");
    const summaryActions = document.createElement("div");
    const toggleAutomationButton = document.createElement("button");
    const expandButton = document.createElement("button");
    const expanded = document.createElement("div");
    const expandedMeta = document.createElement("div");
    const expandedActions = document.createElement("div");
    const expandedPrimaryActions = document.createElement("div");
    const expandedSecondaryActions = document.createElement("div");
    const meta = document.createElement("p");
    const badges = document.createElement("div");
    const nextEligible = document.createElement("p");
    const blockedUntil = document.createElement("p");
    const lastSend = document.createElement("p");

    row.className = "channel-row";
    row.classList.add(channelStatus.blockedReason ? `state-${channelStatus.blockedReason}` : "state-active");
    summary.className = "channel-row-summary";
    summaryMain.className = "channel-row-summary-main";
    summaryIdentity.className = "channel-row-identity";
    summaryTitleBlock.className = "channel-row-title-block";
    title.textContent = channelStatus.label;
    badges.className = "channel-operation-badges";
    badges.append(
      createStatusBadge(getChannelStatusLabel(channelStatus), channelStatus.blockedReason ? "blocked" : "active"),
      createStatusBadge(
        channelStatus.globalAutomationEnabled ? "master on" : "master off",
        channelStatus.globalAutomationEnabled ? "neutral" : "blocked",
      ),
      createStatusBadge(
        channelStatus.channelAutomationEnabled ? "channel on" : "channel off",
        channelStatus.channelAutomationEnabled ? "neutral" : "blocked",
      ),
      createStatusBadge(channelStatus.defaultTopic ?? "no-topic", "neutral"),
    );
    if (channelStatus.skipNextSendPending) {
      badges.append(createStatusBadge("skip-next pending", "blocked"));
    }
    nextEligible.className = "channel-row-summary-detail channel-operation-detail-strong";
    nextEligible.textContent = `Next eligible: ${formatTimestamp(channelStatus.nextEligibleSendAt)}`;
    blockedSummary.className = `channel-row-summary-detail${channelStatus.blockedReason ? " blocked" : ""}`;
    blockedSummary.textContent = channelStatus.blockedReason ? getChannelOperationStatusText(channelStatus) : "Active";
    summaryActions.className = "channel-row-summary-actions";
    toggleAutomationButton.type = "button";
    toggleAutomationButton.className = "ghost";
    toggleAutomationButton.textContent = channelStatus.channelAutomationEnabled ? "Channel: ON" : "Channel: OFF";
    toggleAutomationButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void applyChannelAutomationEnabled(channelStatus.channelId, !channelStatus.channelAutomationEnabled);
    });
    const triggerNowButton = createChannelInlineActionButton(
      "Trigger Next Now",
      () => void applyChannelOperation(channelStatus.channelId, "trigger-now"),
    );
    triggerNowButton.classList.add("primary-action");
    const skipNextButton = createChannelInlineActionButton("Skip Next", () => void applyChannelOperation(channelStatus.channelId, "skip-next"), {
        variant: "secondary",
      });
    const silenceOneHourButton = createChannelInlineActionButton(
      "Silence 1 Hour",
      () => void applyChannelOperation(channelStatus.channelId, "silence", 60 * 60 * 1000),
      {
        variant: "secondary",
      },
    );
    summaryActions.append(toggleAutomationButton, triggerNowButton, skipNextButton, silenceOneHourButton);
    expandButton.type = "button";
    expandButton.className = "channel-row-expand";
    expandButton.textContent = "More";
    expandButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      row.open = !row.open;
      expandButton.textContent = row.open ? "Less" : "More";
    });
    row.addEventListener("toggle", () => {
      expandButton.textContent = row.open ? "Less" : "More";
    });
    summaryActions.append(expandButton);

    expanded.className = "channel-row-expanded";
    expandedMeta.className = "channel-row-expanded-meta";
    expandedActions.className = "channel-row-expanded-actions";
    expandedPrimaryActions.className = "channel-operation-action-group";
    expandedSecondaryActions.className = "channel-operation-action-group secondary";
    meta.className = "channel-operation-meta";
    meta.textContent = `Channel ID: ${channelStatus.channelId}${channelStatus.defaultTopic ? ` • Topic: ${channelStatus.defaultTopic}` : ""} • Mode: ${channelStatus.automationMode}${channelStatus.globalAutomationEnabled ? "" : " • Master OFF"}${channelStatus.channelAutomationEnabled ? "" : " • Channel automation OFF"}`;
    blockedUntil.className = "channel-operation-detail";
    blockedUntil.textContent = `Blocked until: ${formatTimestamp(channelStatus.blockedUntil)} (${formatRelativeTime(channelStatus.blockedUntil)})`;
    lastSend.className = "channel-operation-detail";
    lastSend.textContent = `Last automated send: ${formatTimestamp(channelStatus.lastAutomatedSendAt)} (${formatRelativeTime(channelStatus.lastAutomatedSendAt)})`;

    expandedPrimaryActions.append(
      createChannelActionButton("Silence 6 Hours", () => void applyChannelOperation(channelStatus.channelId, "silence", 6 * 60 * 60 * 1000)),
      createChannelActionButton("Cool Down 30 Minutes", () => void applyChannelOperation(channelStatus.channelId, "cooldown", 30 * 60 * 1000)),
    );
    expandedSecondaryActions.append(
      createChannelActionButton("Clear Skip", () => void applyChannelOperation(channelStatus.channelId, "clear-skip-next")),
      createChannelActionButton("Resume", () => void applyChannelOperation(channelStatus.channelId, "resume")),
    );

    summaryTitleBlock.append(title, badges);
    summaryIdentity.append(summaryTitleBlock, nextEligible, blockedSummary);
    summaryMain.append(summaryIdentity, summaryActions);
    summary.append(summaryMain);
    expandedMeta.append(meta, lastSend, blockedUntil);
    expandedActions.append(expandedPrimaryActions, expandedSecondaryActions);
    expanded.append(expandedMeta, expandedActions);
    row.append(summary, expanded);
    channelOperationsGrid.append(row);
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

function getRoleAccessPanelFormValue() {
  const title = roleAccessPanelForm.elements.title.value.trim();
  const id = roleAccessPanelForm.elements.id.value.trim() || slugifyPanelId(title);

  return {
    id,
    active: roleAccessPanelForm.elements.active.value === "true",
    title,
    body: roleAccessPanelForm.elements.body.value.trim(),
    buttonLabel: roleAccessPanelForm.elements.buttonLabel.value.trim(),
    roleId: roleAccessPanelForm.elements.roleId.value.trim(),
    targetChannelId: roleAccessPanelForm.elements.targetChannelId.value.trim() || null,
    successMessage: roleAccessPanelForm.elements.successMessage.value.trim() || null,
    alreadyHasRoleMessage: roleAccessPanelForm.elements.alreadyHasRoleMessage.value.trim() || null,
  };
}

function slugifyPanelId(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return slug || "new-access";
}

function validateRoleAccessPanelPayload(payload) {
  const requiredFields = ["id", "title", "body", "buttonLabel", "roleId"];
  const missingField = requiredFields.find((field) => !payload[field]);

  if (missingField) {
    const fieldLabels = {
      id: "internal ID",
      title: "name",
      body: "message",
      buttonLabel: "button label",
      roleId: "role to assign",
    };
    return `Missing required field: ${fieldLabels[missingField] ?? missingField}.`;
  }

  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(payload.id)) {
    return "Panel ID must use lowercase letters, numbers, dashes, or underscores.";
  }

  return null;
}

function renderRoleAccessPreview() {
  const panel = getRoleAccessPanelFormValue();
  const title = panel.title || "Access message name";
  const body = panel.body || "Your Discord message will appear here.";
  const buttonLabel = panel.buttonLabel || "Request Access";

  roleAccessPreview.replaceChildren();

  const previewHeader = document.createElement("div");
  const embed = document.createElement("div");
  const embedTitle = document.createElement("h4");
  const embedBody = document.createElement("p");
  const previewButton = document.createElement("button");
  const context = document.createElement("div");
  const roleContext = document.createElement("p");
  const channelContext = document.createElement("p");
  const statusContext = document.createElement("p");

  previewHeader.className = "discord-panel-preview-header";
  previewHeader.textContent = "Discord preview";
  embed.className = "discord-panel-preview-embed";
  embedTitle.textContent = title;
  embedBody.textContent = body;
  previewButton.type = "button";
  previewButton.disabled = true;
  previewButton.textContent = buttonLabel;
  context.className = "discord-panel-preview-context";
  roleContext.textContent = `Role to assign: ${getDetailedRoleLabel(panel.roleId)}`;
  channelContext.textContent = `Post to channel: ${getDetailedChannelLabel(panel.targetChannelId)}`;
  statusContext.textContent = `Status: ${panel.active ? "active" : "inactive"}`;
  context.append(roleContext, channelContext, statusContext);

  embed.append(embedTitle, embedBody);
  roleAccessPreview.append(previewHeader, embed, previewButton, context);
}

function resetRoleAccessPanelForm() {
  roleAccessPanelForm.reset();
  roleAccessPanelForm.elements.title.value = "New Access";
  roleAccessPanelForm.elements.body.value = "Click the button below to get access.";
  roleAccessPanelForm.elements.buttonLabel.value = "Request Access";
  roleAccessPanelForm.elements.id.value = "";
  roleAccessPanelForm.elements.active.value = "true";
  setRoleAccessPanelStatus("New message ready.");
  syncDiscordMetadataSelections();
  renderRoleAccessPreview();
}

function populateRoleAccessPanelForm(panel) {
  roleAccessPanelForm.elements.id.value = panel.id;
  roleAccessPanelForm.elements.active.value = String(panel.active !== false);
  roleAccessPanelForm.elements.title.value = panel.title;
  roleAccessPanelForm.elements.body.value = panel.body;
  roleAccessPanelForm.elements.buttonLabel.value = panel.buttonLabel;
  roleAccessPanelForm.elements.roleId.value = panel.roleId;
  roleAccessPanelForm.elements.targetChannelId.value = panel.targetChannelId ?? "";
  roleAccessPanelForm.elements.successMessage.value = panel.successMessage ?? "";
  roleAccessPanelForm.elements.alreadyHasRoleMessage.value = panel.alreadyHasRoleMessage ?? "";
  setRoleAccessPanelStatus(`Editing ${panel.title}.`);
  syncDiscordMetadataSelections();
  renderRoleAccessPreview();
}

function renderRoleAccessPanels() {
  roleAccessPanelsList.replaceChildren();

  if (roleAccessPanels.length === 0) {
    const emptyState = document.createElement("section");
    const emptyTitle = document.createElement("h3");
    const emptyCopy = document.createElement("p");

    emptyState.className = "channel-operation-card role-access-empty-callout";
    emptyTitle.textContent = "Start with the access";
    emptyCopy.className = "channel-operation-detail";
    emptyCopy.textContent = "Start by naming what this message gives access to (e.g. Windrose, Valheim, etc.)";
    emptyState.append(emptyTitle, emptyCopy);
    roleAccessPanelsList.append(emptyState);
    return;
  }

  for (const panel of roleAccessPanels) {
    const row = document.createElement("section");
    const main = document.createElement("div");
    const title = document.createElement("h3");
    const badges = document.createElement("div");
    const roleDetail = document.createElement("p");
    const channelDetail = document.createElement("p");
    const postedDetail = document.createElement("p");
    const actions = document.createElement("div");

    row.className = "channel-operation-card compact role-access-panel-card";
    main.className = "channel-operation-main";
    title.textContent = panel.title;
    badges.className = "channel-operation-badges";
    badges.append(
      createStatusBadge(panel.active ? "active" : "inactive", panel.active ? "active" : "neutral"),
    );
    roleDetail.className = "channel-operation-detail channel-operation-detail-strong";
    roleDetail.textContent = `Role: ${getRoleLabel(panel.roleId)}`;
    channelDetail.className = "channel-operation-detail";
    channelDetail.textContent = `Channel: ${getChannelLabel(panel.targetChannelId) || "choose when posting"}`;
    postedDetail.className = "channel-operation-detail";
    postedDetail.textContent = `Last posted: ${formatTimestamp(panel.lastPostedAt)} (${formatRelativeTime(panel.lastPostedAt)})`;
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Edit", () => populateRoleAccessPanelForm(panel)),
      createChannelActionButton("Post to Discord", () => void postRoleAccessPanel(panel.id)),
      createChannelActionButton("Delete", () => void deleteRoleAccessPanel(panel.id)),
    );

    main.append(title, badges, roleDetail, channelDetail, postedDetail);
    row.append(main, actions);
    roleAccessPanelsList.append(row);
  }
}

function getRoleFollowupFormValue() {
  const roleId = roleFollowupForm.elements.roleId.value.trim();
  const id = roleFollowupForm.elements.id.value.trim() || slugifyPanelId(`followup-${roleId}`);

  return {
    id,
    roleId,
    channelId: roleFollowupForm.elements.channelId.value.trim(),
    message: roleFollowupForm.elements.message.value.trim(),
    enabled: roleFollowupForm.elements.enabled.value === "true",
  };
}

function validateRoleFollowupPayload(payload) {
  if (!payload.roleId) {
    return "Role ID is required.";
  }

  if (!payload.channelId) {
    return "Channel ID is required.";
  }

  if (!payload.message) {
    return "Message is required.";
  }

  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(payload.id)) {
    return "Internal ID must use lowercase letters, numbers, dashes, or underscores.";
  }

  return null;
}

function renderRoleFollowupPreview() {
  const followup = getRoleFollowupFormValue();

  roleFollowupPreview.replaceChildren();

  const header = document.createElement("div");
  const flow = document.createElement("div");
  const trigger = document.createElement("p");
  const action = document.createElement("p");
  const message = document.createElement("div");
  const messageText = document.createElement("p");
  const context = document.createElement("div");
  const status = document.createElement("p");

  header.className = "discord-panel-preview-header";
  header.textContent = "Follow-up preview";
  flow.className = "role-followup-preview-flow";
  trigger.textContent = `User gets role: ${getDetailedRoleLabel(followup.roleId)}`;
  action.textContent = `Cdawg posts in channel: ${getDetailedChannelLabel(followup.channelId, "not set")}`;
  message.className = "discord-panel-preview-embed";
  messageText.textContent = followup.message
    ? formatFollowupPreviewMessage(followup.message, followup)
    : "Your follow-up message will appear here.";
  context.className = "discord-panel-preview-context";
  status.textContent = `Status: ${followup.enabled ? "on" : "off"}`;

  flow.append(trigger, action);
  message.append(messageText);
  context.append(status);
  roleFollowupPreview.append(header, flow, message, context);
  updateFollowupQuickInsertState();
}

function formatFollowupPreviewMessage(value, followup = getRoleFollowupFormValue()) {
  return value
    .replace(/\{user\}|<@\{userId\}>/g, "@user")
    .replace(/\{username\}/g, "username")
    .replace(/\{role\}/g, followup.roleId ? `@${getRoleLabel(followup.roleId)}` : "@selected-role")
    .replace(/\{channel\}/g, followup.channelId ? getChannelLabel(followup.channelId) : "#selected-channel")
    .replace(/<#(\d{17,20})>/g, (_match, channelId) => getChannelLabel(channelId))
    .replace(/<@&(\d{17,20})>/g, (_match, roleId) => `@${getRoleLabel(roleId)}`);
}

function updateFollowupQuickInsertState() {
  const followup = getRoleFollowupFormValue();

  if (followupInsertChannelButton) {
    followupInsertChannelButton.disabled = !followup.channelId;
  }

  if (followupInsertRoleButton) {
    followupInsertRoleButton.disabled = !followup.roleId;
  }
}

function insertIntoFollowupMessage(text) {
  const textarea = roleFollowupForm.elements.message;
  const currentValue = textarea.value;
  const selectionStart = typeof textarea.selectionStart === "number" ? textarea.selectionStart : currentValue.length;
  const selectionEnd = typeof textarea.selectionEnd === "number" ? textarea.selectionEnd : currentValue.length;
  const nextValue = `${currentValue.slice(0, selectionStart)}${text}${currentValue.slice(selectionEnd)}`;
  const nextCursor = selectionStart + text.length;

  textarea.value = nextValue;
  textarea.focus();
  textarea.setSelectionRange(nextCursor, nextCursor);
  renderRoleFollowupPreview();
}

function handleFollowupQuickInsert(button) {
  const followup = getRoleFollowupFormValue();

  if (button.dataset.followupInsertChannel !== undefined) {
    if (!followup.channelId) {
      return;
    }

    insertIntoFollowupMessage(`<#${followup.channelId}>`);
    return;
  }

  if (button.dataset.followupInsertRole !== undefined) {
    if (!followup.roleId) {
      return;
    }

    insertIntoFollowupMessage(`<@&${followup.roleId}>`);
    return;
  }

  insertIntoFollowupMessage(button.dataset.followupInsert ?? "");
}

function resetRoleFollowupForm() {
  roleFollowupForm.reset();
  roleFollowupForm.elements.enabled.value = "true";
  setRoleFollowupStatus("New follow-up ready.");
  syncDiscordMetadataSelections();
  renderRoleFollowupPreview();
}

function populateRoleFollowupForm(followup) {
  roleFollowupForm.elements.id.value = followup.id;
  roleFollowupForm.elements.roleId.value = followup.roleId;
  roleFollowupForm.elements.channelId.value = followup.channelId;
  roleFollowupForm.elements.message.value = followup.message;
  roleFollowupForm.elements.enabled.value = String(followup.enabled !== false);
  setRoleFollowupStatus(`Editing follow-up for role ${followup.roleId}.`);
  syncDiscordMetadataSelections();
  renderRoleFollowupPreview();
}

function renderRoleFollowups() {
  roleFollowupsList.replaceChildren();

  if (roleFollowups.length === 0) {
    const emptyState = document.createElement("section");
    const emptyTitle = document.createElement("h3");
    const emptyCopy = document.createElement("p");

    emptyState.className = "channel-operation-card role-access-empty-callout";
    emptyTitle.textContent = "Create a role follow-up";
    emptyCopy.className = "channel-operation-detail";
    emptyCopy.textContent = "Start by choosing the Discord role that should trigger an automatic message.";
    emptyState.append(emptyTitle, emptyCopy);
    roleFollowupsList.append(emptyState);
    return;
  }

  for (const followup of roleFollowups) {
    const row = document.createElement("section");
    const main = document.createElement("div");
    const title = document.createElement("h3");
    const badges = document.createElement("div");
    const roleDetail = document.createElement("p");
    const channelDetail = document.createElement("p");
    const messagePreview = document.createElement("p");
    const actions = document.createElement("div");

    row.className = "channel-operation-card compact role-followup-card";
    main.className = "channel-operation-main";
    title.textContent = getRoleLabel(followup.roleId);
    badges.className = "channel-operation-badges";
    badges.append(createStatusBadge(followup.enabled ? "enabled" : "inactive", followup.enabled ? "active" : "neutral"));
    roleDetail.className = "channel-operation-detail channel-operation-detail-strong";
    roleDetail.textContent = `Role: ${getDetailedRoleLabel(followup.roleId)}`;
    channelDetail.className = "channel-operation-detail";
    channelDetail.textContent = `Channel: ${getDetailedChannelLabel(followup.channelId, "not set")}`;
    messagePreview.className = "channel-operation-detail";
    messagePreview.textContent = followup.message.length > 140 ? `${followup.message.slice(0, 140)}...` : followup.message;
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Edit", () => populateRoleFollowupForm(followup)),
      createChannelActionButton("Delete", () => void deleteRoleFollowup(followup.id)),
    );

    main.append(title, badges, roleDetail, channelDetail, messagePreview);
    row.append(main, actions);
    roleFollowupsList.append(row);
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
    ? `Session: ${dailyTriviaChallenge.latestSession.active ? "active" : "closed"} • Answers: ${dailyTriviaChallenge.latestSession.answerCount} • Correct recorded: ${dailyTriviaChallenge.latestSession.hasCorrectAnswer ? "yes" : "no"}${dailyTriviaChallenge.latestSession.winnerUserId ? ` • Winner: <@${dailyTriviaChallenge.latestSession.winnerUserId}>` : ""}${dailyTriviaChallenge.latestSession.dailyWinnerBonusXp > 0 ? ` • Bonus: ${dailyTriviaChallenge.latestSession.dailyWinnerBonusAwarded === true ? `+${dailyTriviaChallenge.latestSession.dailyWinnerBonusXp} XP awarded` : dailyTriviaChallenge.latestSession.dailyWinnerBonusAwarded === false ? `${dailyTriviaChallenge.latestSession.dailyWinnerBonusXp} XP blocked` : `${dailyTriviaChallenge.latestSession.dailyWinnerBonusXp} XP pending`}` : ""}`
    : "Session: none yet";
  meta.className = "channel-operation-meta";
  meta.textContent = `Channel ${dailyTriviaChallenge.channelId}${dailyTriviaChallenge.topicOverride ? ` • Topic override ${dailyTriviaChallenge.topicOverride}` : ` • Topic ${dailyTriviaChallenge.presetTopic ?? "none"}`}${dailyTriviaChallenge.allowedWindow ? ` • Window ${dailyTriviaChallenge.allowedWindow.startTime}-${dailyTriviaChallenge.allowedWindow.endTime}` : ""}${dailyTriviaChallenge.latestSession?.category ? ` • Category ${dailyTriviaChallenge.latestSession.category}` : ""}${dailyTriviaChallenge.latestSession?.difficulty ? ` • Difficulty ${dailyTriviaChallenge.latestSession.difficulty}` : ""}${dailyTriviaChallenge.triviaEligibility && !dailyTriviaChallenge.triviaEligibility.ok ? ` • ${dailyTriviaChallenge.triviaEligibility.error}` : ""}`;

  main.append(title, badges, primaryDetail, blockedDetail, secondaryDetail, sessionDetail, meta);
  row.append(main);
  dailyTriviaSummary.append(row);
  applyDailyTriviaToForm(dailyTriviaChallenge);
}

function renderHistoryEventSection(titleText, event, isRecentlyUsed, emptyCopy) {
  const section = document.createElement("section");
  section.className = "history-review-event-block";

  const title = document.createElement("h4");
  title.textContent = titleText;
  section.append(title);

  if (!event) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = emptyCopy;
    section.append(emptyState);
    return section;
  }

  const badges = document.createElement("div");
  badges.className = "channel-operation-badges";
  badges.append(
    createStatusBadge(`year ${event.year < 0 ? `${Math.abs(event.year)} bce` : event.year}`, "neutral"),
    createStatusBadge(isRecentlyUsed ? "recently used" : "fresh", isRecentlyUsed ? "blocked" : "active"),
  );

  const eventTitle = document.createElement("p");
  eventTitle.className = "history-review-title";
  eventTitle.textContent = event.title;

  const summary = document.createElement("p");
  summary.className = "channel-operation-detail";
  summary.textContent = event.summary;

  const impact = document.createElement("p");
  impact.className = "channel-operation-detail";
  impact.textContent = `Why it matters: ${event.impact}`;

  const link = document.createElement("a");
  link.className = "history-review-link";
  link.href = event.link;
  link.target = "_blank";
  link.rel = "noreferrer noopener";
  link.textContent = "Open source link";

  section.append(badges, eventTitle, summary, impact, link);
  return section;
}

function renderHistoryReview() {
  historyReviewCard.replaceChildren();

  if (!historyReview) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "History review is unavailable.";
    historyReviewCard.append(emptyState);
    return;
  }

  const card = document.createElement("section");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const meta = document.createElement("p");
  const badges = document.createElement("div");

  card.className = "channel-operation-card compact";
  header.className = "channel-operation-main";
  title.textContent = `${historyReview.channelLabel} • This Day in History`;
  meta.className = "channel-operation-meta";
  meta.textContent = `Date key ${historyReview.dateKey} • ${historyReview.dateLabel} • Pool size ${historyReview.totalEventsForDate} • Channel ${historyReview.channelId}`;
  badges.className = "channel-operation-badges";
  badges.append(
    createStatusBadge(`date ${historyReview.dateKey}`, "neutral"),
    createStatusBadge(`pool ${historyReview.totalEventsForDate}`, "neutral"),
    createStatusBadge(
      historyReview.previewEventRecentlyUsed ? "preview is recent" : "preview is fresh",
      historyReview.previewEventRecentlyUsed ? "blocked" : "active",
    ),
  );

  header.append(title, badges, meta);
  card.append(
    header,
    renderHistoryEventSection(
      "Previewed Event",
      historyReview.previewEvent,
      historyReview.previewEventRecentlyUsed,
      "No history event is available for today.",
    ),
    renderHistoryEventSection(
      "Last Posted",
      historyReview.lastPostedEvent,
      historyReview.lastPostedEventRecentlyUsed,
      "No history event has been posted in this runtime yet.",
    ),
  );
  historyReviewCard.append(card);
}

function renderDogSummary() {
  dogSummary.replaceChildren();

  if (!dogSystemEnabled) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "Dog system is disabled.";
    dogSummary.append(emptyState);
    return;
  }

  if (!dogState) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "Dog state is unavailable.";
    dogSummary.append(emptyState);
    return;
  }

  const row = document.createElement("section");
  const main = document.createElement("div");
  const title = document.createElement("h3");
  const badges = document.createElement("div");
  const primaryDetail = document.createElement("p");
  const secondaryDetail = document.createElement("p");
  const meta = document.createElement("p");

  row.className = "channel-operation-card compact";
  main.className = "channel-operation-main";
  title.textContent = "Cdawg Dog";
  badges.className = "channel-operation-badges";
  badges.append(
    createStatusBadge(`hunger ${dogState.hunger}`, getDogHealthLabel(dogState.hunger) === "low" ? "blocked" : "neutral"),
    createStatusBadge(`mood ${dogState.mood}`, getDogHealthLabel(dogState.mood) === "low" ? "blocked" : "neutral"),
    createStatusBadge(`energy ${dogState.energy}`, getDogHealthLabel(dogState.energy) === "low" ? "blocked" : "neutral"),
  );
  primaryDetail.className = "channel-operation-detail channel-operation-detail-strong";
  primaryDetail.textContent = `Updated: ${formatTimestamp(dogState.updatedAt)} (${formatRelativeTime(dogState.updatedAt)})`;
  secondaryDetail.className = "channel-operation-detail";
  secondaryDetail.textContent =
    dogState.recentInteractions.length > 0
      ? `Recent: ${dogState.recentInteractions[0].action} by ${dogState.recentInteractions[0].userId} at ${formatTimestamp(dogState.recentInteractions[0].timestamp)}`
      : "Recent: no dog interactions yet";
  meta.className = "channel-operation-meta";
  meta.textContent = dogState.recentInteractions.length > 0
    ? dogState.recentInteractions
        .slice(0, 4)
        .map((interaction) => `${interaction.action} • ${interaction.userId} • ${formatTimestamp(interaction.timestamp)} • ${interaction.xpAwarded ? `+${interaction.xpAmount} XP` : "XP blocked"}`)
        .join(" | ")
    : "Use /dog feed, /dog play, or /dog walk to interact.";

  main.append(title, badges, primaryDetail, secondaryDetail, meta);
  row.append(main);
  dogSummary.append(row);
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
    applyAutomationMasterState(data.automationMaster);
    applySettingsToForm(data.settings);
    renderAutomationMaster();
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

async function loadGuildMetadata() {
  try {
    const data = await fetchJson("/api/discord/guild-metadata");
    guildRoles = Array.isArray(data.roles) ? data.roles : [];
    guildChannels = Array.isArray(data.channels) ? data.channels : [];
    discordMetadataWarning.hidden = true;
    renderDiscordMetadataOptions();
    renderRoleAccessPreview();
    renderRoleAccessPanels();
    renderRoleFollowupPreview();
    renderRoleFollowups();
  } catch (error) {
    guildRoles = [];
    guildChannels = [];
    discordMetadataWarning.hidden = false;
    renderDiscordMetadataOptions();
  }
}

async function loadFeeds() {
  try {
    const data = await fetchJson("/api/feeds");
    applyAutomationMasterState(data.automationMaster);
    feeds = Array.isArray(data.feeds) ? data.feeds : [];
    renderAutomationMaster();
    renderFeeds();
    setPrettyJson(feedsOutput, data);
  } catch (error) {
    feeds = [];
    renderFeeds();
    feedsOutput.textContent = `Failed to load feeds.\n${error.message}`;
  }
}

async function loadRoleAccessPanels() {
  try {
    const data = await fetchJson("/api/role-access-panels");
    roleAccessPanels = Array.isArray(data.roleAccessPanels) ? data.roleAccessPanels : [];
    renderRoleAccessPanels();
    setPrettyJson(roleAccessPanelsOutput, data);
  } catch (error) {
    roleAccessPanels = [];
    renderRoleAccessPanels();
    roleAccessPanelsOutput.textContent = `Failed to load role access panels.\n${error.message}`;
    setRoleAccessPanelStatus(`Role access load failed: ${error.message}`, "error");
  }
}

async function loadRoleFollowups() {
  try {
    const data = await fetchJson("/api/role-followups");
    roleFollowups = Array.isArray(data.roleFollowups) ? data.roleFollowups : [];
    renderRoleFollowups();
    setPrettyJson(roleFollowupsOutput, data);
  } catch (error) {
    roleFollowups = [];
    renderRoleFollowups();
    roleFollowupsOutput.textContent = `Failed to load role follow-ups.\n${error.message}`;
    setRoleFollowupStatus(`Follow-up load failed: ${error.message}`, "error");
  }
}

async function loadDailyTriviaChallenge() {
  try {
    const data = await fetchJson("/api/daily-trivia");
    applyAutomationMasterState(data.automationMaster);
    dailyTriviaChallenge = data.dailyTriviaChallenge ?? null;
    renderAutomationMaster();
    renderDailyTriviaChallenge();
    setPrettyJson(dailyTriviaOutput, data);
  } catch (error) {
    dailyTriviaChallenge = null;
    renderDailyTriviaChallenge();
    dailyTriviaOutput.textContent = `Failed to load daily trivia.\n${error.message}`;
    setDailyTriviaStatus(`Daily trivia load failed: ${error.message}`, "error");
  }
}

async function loadHistoryReview() {
  try {
    const data = await fetchJson("/api/history-review");
    applyAutomationMasterState(data.automationMaster);
    historyReview = data.historyReview ?? null;
    renderAutomationMaster();
    renderHistoryReview();
    setPrettyJson(historyReviewOutput, data);
  } catch (error) {
    historyReview = null;
    renderHistoryReview();
    historyReviewOutput.textContent = `Failed to load history review.\n${error.message}`;
    setHistoryReviewStatus(`History review load failed: ${error.message}`, "error");
  }
}

async function loadDogState() {
  try {
    const data = await fetchJson("/api/dog");
    dogSystemEnabled = data.enabled === true;
    dogState = dogSystemEnabled ? data.dog ?? null : null;
    renderDogSummary();
    setPrettyJson(dogOutput, data);
  } catch (error) {
    dogSystemEnabled = false;
    dogState = null;
    renderDogSummary();
    dogOutput.textContent = `Failed to load dog state.\n${error.message}`;
  }
}

async function loadChannelOperations() {
  try {
    const data = await fetchJson("/api/channel-automation-status");
    applyAutomationMasterState(data.automationMaster);
    channelAutomationStatuses = Array.isArray(data.channelAutomationStatuses) ? data.channelAutomationStatuses : [];
    renderAutomationMaster();
    renderChannelOperations();
    setPrettyJson(channelOperationsOutput, data);
  } catch (error) {
    channelAutomationStatuses = [];
    renderChannelOperations();
    channelOperationsOutput.textContent = `Failed to load channel automation status.\n${error.message}`;
  }
}

async function rerollHistoryReview() {
  setHistoryReviewStatus("Rerolling...");

  try {
    const data = await fetchJson("/api/history-review/reroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: historyReview?.channelId ?? channelPresets.find((preset) => preset.defaultTopic === "history")?.channelId ?? "",
      }),
    });

    applyAutomationMasterState(data.automationMaster);
    historyReview = data.historyReview ?? null;
    renderAutomationMaster();
    renderHistoryReview();
    setPrettyJson(historyReviewOutput, data);
    setHistoryReviewStatus("Preview rerolled.", "success");
  } catch (error) {
    setHistoryReviewStatus(`Reroll failed: ${error.message}`, "error");
  }
}

async function pushHistoryReviewPreview() {
  if (!historyReview?.previewEvent) {
    setHistoryReviewStatus("No previewed history event is available to push.", "error");
    return;
  }

  setHistoryReviewStatus("Pushing preview...");

  try {
    const data = await fetchJson("/api/history-review/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: historyReview.channelId,
        eventId: historyReview.previewEvent.id,
      }),
    });

    applyAutomationMasterState(data.automationMaster);
    historyReview = data.historyReview ?? null;
    renderAutomationMaster();
    renderHistoryReview();
    setPrettyJson(historyReviewOutput, data);
    setHistoryReviewStatus("History preview pushed.", "success");
  } catch (error) {
    setHistoryReviewStatus(`Push failed: ${error.message}`, "error");
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
    applyAutomationMasterState(data.automationMaster);
    applySettingsToForm(data.settings);
    renderAutomationMaster();
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

async function saveRoleAccessPanel(event) {
  event.preventDefault();

  const payload = getRoleAccessPanelFormValue();
  const validationError = validateRoleAccessPanelPayload(payload);

  if (validationError) {
    setRoleAccessPanelStatus(validationError, "error");
    return;
  }

  setRoleAccessPanelStatus("Saving...");

  try {
    const data = await fetchJson("/api/role-access-panels/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    roleAccessPanels = Array.isArray(data.roleAccessPanels) ? data.roleAccessPanels : [];
    renderRoleAccessPanels();
    populateRoleAccessPanelForm(data.panel);
    setPrettyJson(roleAccessPanelsOutput, data);
    setRoleAccessPanelStatus("Draft saved.", "success");
  } catch (error) {
    setRoleAccessPanelStatus(`Save failed: ${error.message}`, "error");
  }
}

async function postRoleAccessPanel(panelId) {
  const panel = roleAccessPanels.find((entry) => entry.id === panelId);
  const formPanel = getRoleAccessPanelFormValue();
  const channelId = formPanel.id === panelId ? formPanel.targetChannelId : panel?.targetChannelId ?? null;

  setRoleAccessPanelStatus(`Posting ${panelId}...`);

  try {
    const data = await fetchJson("/api/role-access-panels/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: panelId,
        channelId,
      }),
    });

    roleAccessPanels = Array.isArray(data.roleAccessPanels) ? data.roleAccessPanels : [];
    renderRoleAccessPanels();
    setPrettyJson(roleAccessPanelsOutput, data);
    setRoleAccessPanelStatus(`Posted ${panelId} to ${data.result.channelId}.`, "success");
  } catch (error) {
    setRoleAccessPanelStatus(`Post failed: ${error.message}`, "error");
  }
}

async function postCurrentRoleAccessPanel() {
  const panelId = roleAccessPanelForm.elements.id.value.trim();

  if (!panelId) {
    setRoleAccessPanelStatus("Save or set the internal ID in Advanced before posting.", "error");
    return;
  }

  await postRoleAccessPanel(panelId);
}

async function deleteRoleAccessPanel(panelId) {
  if (!window.confirm(`Delete role access panel "${panelId}"?`)) {
    return;
  }

  setRoleAccessPanelStatus(`Deleting ${panelId}...`);

  try {
    const data = await fetchJson("/api/role-access-panels/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: panelId,
      }),
    });

    roleAccessPanels = Array.isArray(data.roleAccessPanels) ? data.roleAccessPanels : [];
    renderRoleAccessPanels();
    setPrettyJson(roleAccessPanelsOutput, data);
    if (roleAccessPanelForm.elements.id.value.trim() === panelId) {
      resetRoleAccessPanelForm();
    }
    setRoleAccessPanelStatus(`Deleted ${panelId}.`, "success");
  } catch (error) {
    setRoleAccessPanelStatus(`Delete failed: ${error.message}`, "error");
  }
}

async function saveRoleFollowup(event) {
  event.preventDefault();

  const payload = getRoleFollowupFormValue();
  const validationError = validateRoleFollowupPayload(payload);

  if (validationError) {
    setRoleFollowupStatus(validationError, "error");
    return;
  }

  setRoleFollowupStatus("Saving...");

  try {
    const data = await fetchJson("/api/role-followups/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    roleFollowups = Array.isArray(data.roleFollowups) ? data.roleFollowups : [];
    renderRoleFollowups();
    populateRoleFollowupForm(data.followup);
    setPrettyJson(roleFollowupsOutput, data);
    setRoleFollowupStatus("Follow-up saved.", "success");
  } catch (error) {
    setRoleFollowupStatus(`Save failed: ${error.message}`, "error");
  }
}

async function deleteRoleFollowup(followupId) {
  if (!window.confirm(`Delete role follow-up "${followupId}"?`)) {
    return;
  }

  setRoleFollowupStatus(`Deleting ${followupId}...`);

  try {
    const data = await fetchJson("/api/role-followups/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: followupId,
      }),
    });

    roleFollowups = Array.isArray(data.roleFollowups) ? data.roleFollowups : [];
    renderRoleFollowups();
    setPrettyJson(roleFollowupsOutput, data);
    if (roleFollowupForm.elements.id.value.trim() === followupId) {
      resetRoleFollowupForm();
    }
    setRoleFollowupStatus(`Deleted ${followupId}.`, "success");
  } catch (error) {
    setRoleFollowupStatus(`Delete failed: ${error.message}`, "error");
  }
}

async function deleteCurrentRoleFollowup() {
  const followupId = roleFollowupForm.elements.id.value.trim();

  if (!followupId) {
    setRoleFollowupStatus("Choose an existing follow-up before deleting.", "error");
    return;
  }

  await deleteRoleFollowup(followupId);
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

async function applyChannelAutomationEnabled(channelId, automationEnabled) {
  channelOperationsOutput.textContent = JSON.stringify(
    {
      requestPath: "/api/channel-operations/set-enabled",
      channelId,
      automationEnabled,
    },
    null,
    2,
  );

  try {
    const data = await fetchJson("/api/channel-operations/set-enabled", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId,
        automationEnabled,
      }),
    });

    setPrettyJson(channelOperationsOutput, data);
    await loadChannelOperations();
  } catch (error) {
    channelOperationsOutput.textContent = `Channel automation toggle failed.\n${error.message}`;
  }
}

async function toggleAutomationMaster() {
  automationMasterDetail.textContent = "Updating automation master...";

  try {
    const data = await fetchJson("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        globalAutomationEnabled: !automationMaster.globalAutomationEnabled,
      }),
    });

    lastSettingsSnapshot = data.settings;
    applyAutomationMasterState(data.automationMaster);
    applySettingsToForm(data.settings);
    renderAutomationMaster();
    setPrettyJson(settingsOutput, data);
    await Promise.all([loadChannelOperations(), loadFeeds(), loadDailyTriviaChallenge()]);
  } catch (error) {
    automationMasterDetail.textContent = `Automation master update failed: ${error.message}`;
  }
}

async function reloadAll() {
  await Promise.all([
    loadHealth(),
    loadSettings(),
    loadMetrics(),
    loadChannelOperations(),
    loadChannelPresets(),
    loadGuildMetadata(),
    loadHistoryReview(),
    loadDogState(),
    loadDailyTriviaChallenge(),
    loadFeeds(),
    loadRoleAccessPanels(),
    loadRoleFollowups(),
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

for (const button of controlTabButtons) {
  button.addEventListener("click", () => setActiveControlTab(button.dataset.tabTarget || "overview"));
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
roleAccessPanelForm.addEventListener("submit", saveRoleAccessPanel);
roleAccessPanelForm.addEventListener("input", (event) => {
  if (event.target?.matches?.("[data-discord-role-select], [data-discord-channel-select]")) {
    updateDiscordMetadataSelection(event.target);
    return;
  }

  syncDiscordMetadataSelections();
  renderRoleAccessPreview();
});
roleFollowupForm.addEventListener("submit", saveRoleFollowup);
roleFollowupForm.addEventListener("input", (event) => {
  if (event.target?.matches?.("[data-discord-role-select], [data-discord-channel-select]")) {
    updateDiscordMetadataSelection(event.target);
    return;
  }

  syncDiscordMetadataSelections();
  renderRoleFollowupPreview();
});
for (const button of document.querySelectorAll("[data-followup-insert], [data-followup-insert-channel], [data-followup-insert-role]")) {
  button.addEventListener("click", () => handleFollowupQuickInsert(button));
}
for (const select of document.querySelectorAll("[data-discord-role-select], [data-discord-channel-select]")) {
  select.addEventListener("change", () => updateDiscordMetadataSelection(select));
}
manualPushForm.elements.channelPreset.addEventListener("change", () => syncManualPushPresetSelection(true));
resetSettingsButton.addEventListener("click", resetSettingsForm);
resetFeedFormButton.addEventListener("click", resetFeedForm);
resetRoleAccessPanelFormButton.addEventListener("click", resetRoleAccessPanelForm);
postRoleAccessPanelFormButton.addEventListener("click", () => void postCurrentRoleAccessPanel());
resetRoleFollowupFormButton.addEventListener("click", resetRoleFollowupForm);
deleteRoleFollowupFormButton.addEventListener("click", () => void deleteCurrentRoleFollowup());
refreshAllButton.addEventListener("click", () => void reloadAll());
automationMasterButton.addEventListener("click", () => void toggleAutomationMaster());
refreshHealthButton.addEventListener("click", loadHealth);
refreshSettingsButton.addEventListener("click", loadSettings);
refreshMetricsButton.addEventListener("click", loadMetrics);
refreshChannelOperationsButton.addEventListener("click", loadChannelOperations);
refreshFeedsButton.addEventListener("click", loadFeeds);
refreshRoleAccessPanelsButton.addEventListener("click", loadRoleAccessPanels);
refreshRoleFollowupsButton.addEventListener("click", loadRoleFollowups);
refreshHistoryReviewButton.addEventListener("click", () => void loadHistoryReview());
rerollHistoryReviewButton.addEventListener("click", () => void rerollHistoryReview());
pushHistoryPreviewButton.addEventListener("click", () => void pushHistoryReviewPreview());
channelOperationsFilter.addEventListener("change", renderChannelOperations);
channelOperationsSort.addEventListener("change", renderChannelOperations);
autoRefreshEnabledInput.addEventListener("change", configureAutoRefresh);

configureAutoRefresh();
setActiveControlTab(activeControlTab);
renderAutomationMaster();
renderRoleAccessPreview();
renderRoleFollowupPreview();
void reloadAll();
