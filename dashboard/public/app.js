const apiConfigForm = document.querySelector("#api-config-form");
const apiBaseUrlInput = document.querySelector("#api-base-url");
const resetApiUrlButton = document.querySelector("#reset-api-url");
const autoRefreshEnabledInput = document.querySelector("#auto-refresh-enabled");
const refreshAllButton = document.querySelector("#refresh-all");
const automationMasterBadge = document.querySelector("#automation-master-badge");
const automationMasterButton = document.querySelector("#automation-master-button");
const automationMasterDetail = document.querySelector("#automation-master-detail");
const automationMasterBanner = document.querySelector("#automation-master-banner");
const discordMetadataWarning = document.querySelector("#discord-metadata-warning");
const opsApiStatus = document.querySelector("#ops-api-status");
const opsBotStatus = document.querySelector("#ops-bot-status");
const opsUptime = document.querySelector("#ops-uptime");
const opsApiStatusCard = document.querySelector("#ops-api-status-card");
const opsBotStatusCard = document.querySelector("#ops-bot-status-card");
const opsUptimeCard = document.querySelector("#ops-uptime-card");
const opsAutomationMasterBadge = document.querySelector("#ops-automation-master-badge");
const opsActiveChannels = document.querySelector("#ops-active-channels");
const opsDisabledChannels = document.querySelector("#ops-disabled-channels");
const opsSilencedChannels = document.querySelector("#ops-silenced-channels");
const opsCooldownChannels = document.querySelector("#ops-cooldown-channels");
const opsSkipNextChannels = document.querySelector("#ops-skip-next-channels");
const opsNextAutomation = document.querySelector("#ops-next-automation");
const opsActiveChannelsCard = document.querySelector("#ops-active-channels-card");
const opsDisabledChannelsCard = document.querySelector("#ops-disabled-channels-card");
const opsSilencedChannelsCard = document.querySelector("#ops-silenced-channels-card");
const opsCooldownChannelsCard = document.querySelector("#ops-cooldown-channels-card");
const opsSkipNextChannelsCard = document.querySelector("#ops-skip-next-channels-card");
const opsTotalPanels = document.querySelector("#ops-total-panels");
const opsPanelsMissingChannel = document.querySelector("#ops-panels-missing-channel");
const opsPanelsMissingRole = document.querySelector("#ops-panels-missing-role");
const opsTotalFollowups = document.querySelector("#ops-total-followups");
const opsDisabledFollowups = document.querySelector("#ops-disabled-followups");
const opsFollowupsMissingChannel = document.querySelector("#ops-followups-missing-channel");
const opsFollowupsMissingRole = document.querySelector("#ops-followups-missing-role");
const opsTotalPanelsCard = document.querySelector("#ops-total-panels-card");
const opsPanelsMissingChannelCard = document.querySelector("#ops-panels-missing-channel-card");
const opsPanelsMissingRoleCard = document.querySelector("#ops-panels-missing-role-card");
const opsTotalFollowupsCard = document.querySelector("#ops-total-followups-card");
const opsDisabledFollowupsCard = document.querySelector("#ops-disabled-followups-card");
const opsFollowupsMissingChannelCard = document.querySelector("#ops-followups-missing-channel-card");
const opsFollowupsMissingRoleCard = document.querySelector("#ops-followups-missing-role-card");
const opsRefreshDashboardButton = document.querySelector("#ops-refresh-dashboard");
const opsJumpChannelsButton = document.querySelector("#ops-jump-channels");
const opsJumpAccessButton = document.querySelector("#ops-jump-access");
const opsJumpFollowupsButton = document.querySelector("#ops-jump-followups");

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
const automationActivityOutput = document.querySelector("#automation-activity-output");
const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");
const settingsSummaryAutomation = document.querySelector("#settings-summary-automation");
const settingsSummaryPassive = document.querySelector("#settings-summary-passive");
const settingsSummaryProvider = document.querySelector("#settings-summary-provider");
const settingsSummaryApiUrl = document.querySelector("#settings-summary-api-url");
const settingsAutomationMasterState = document.querySelector("#settings-automation-master-state");
const settingsAutomationMasterCopy = document.querySelector("#settings-automation-master-copy");
const settingsApiUrlDetail = document.querySelector("#settings-api-url-detail");
const settingsAutoRefreshDetail = document.querySelector("#settings-auto-refresh-detail");
const composerForm = document.querySelector("#composer-form");
const composerStatus = document.querySelector("#composer-status");
const composerOutput = document.querySelector("#composer-output");
const composerPreview = document.querySelector("#composer-preview");
const composerCharacterCount = document.querySelector("#composer-character-count");
const composerTemplatesList = document.querySelector("#composer-templates-list");
const composerTemplateStatus = document.querySelector("#composer-template-status");
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
const roleAccessMetadataWarning = document.querySelector("#role-access-metadata-warning");
const roleFollowupForm = document.querySelector("#role-followup-form");
const roleFollowupStatus = document.querySelector("#role-followup-status");
const roleFollowupMetadataWarning = document.querySelector("#role-followup-metadata-warning");
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
const automationActivityList = document.querySelector("#automation-activity-list");
const automationErrorsList = document.querySelector("#automation-errors-list");

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
const saveComposerDraftButton = document.querySelector("#save-composer-draft");
const clearComposerButton = document.querySelector("#clear-composer");
const undoComposerRewriteButton = document.querySelector("#undo-composer-rewrite");
const saveComposerTemplateButton = document.querySelector("#save-composer-template");

const apiBaseUrlStorageKey = "cdawg-dashboard-api-base-url";
const autoRefreshStorageKey = "cdawg-dashboard-auto-refresh-enabled";
const composerDraftStorageKey = "cdawg-dashboard-composer-draft";
const autoRefreshIntervalMs = 15000;

let lastSettingsSnapshot = null;
let lastHealthSnapshot = null;
let lastMetricsSnapshot = null;
let autoRefreshTimer = null;
let channelPresets = [];
let guildRoles = [];
let guildChannels = [];
let guildMetadataLoaded = false;
let channelAutomationStatuses = [];
let automationActivityItems = [];
let automationMaster = { globalAutomationEnabled: true, status: "on" };
let dogState = null;
let dogSystemEnabled = false;
let dailyTriviaChallenge = null;
let historyReview = null;
let feeds = [];
let roleAccessPanels = [];
let roleFollowups = [];
let composerTemplates = [];
let activeControlTab = "overview";
let composerDraftBeforeRewrite = null;

const savedApiBaseUrl = window.localStorage.getItem(apiBaseUrlStorageKey);
const savedAutoRefresh = window.localStorage.getItem(autoRefreshStorageKey);

apiBaseUrlInput.value = savedApiBaseUrl || getDefaultApiBaseUrl();

if (savedAutoRefresh === "true") {
  autoRefreshEnabledInput.checked = true;
}

function isLocalDashboardHost() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function getDefaultApiBaseUrl() {
  if (isLocalDashboardHost()) {
    return "http://127.0.0.1:8787";
  }

  return window.location.origin;
}

function normalizeApiBaseUrl(value) {
  const trimmedValue = value
    .trim()
    .replace(/\/+$/, "")
    .replace(/(?:\/api)+$/i, "");

  if (!trimmedValue) {
    return getDefaultApiBaseUrl();
  }

  return trimmedValue;
}

function getApiBaseUrl() {
  return normalizeApiBaseUrl(apiBaseUrlInput.value);
}

function resetApiBaseUrl() {
  window.localStorage.removeItem(apiBaseUrlStorageKey);
  apiBaseUrlInput.value = getDefaultApiBaseUrl();
}

function setPrettyJson(target, value) {
  target.textContent = JSON.stringify(value, null, 2);
}

function setStatusMessage(message, kind = "neutral") {
  settingsStatus.textContent = message;
  settingsStatus.className = `form-status ${kind}`;
  settingsStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setManualPushStatus(message, kind = "neutral") {
  manualPushStatus.textContent = message;
  manualPushStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setComposerStatus(message, kind = "neutral") {
  composerStatus.textContent = message;
  composerStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setComposerTemplateStatus(message, kind = "neutral") {
  composerTemplateStatus.textContent = message;
  composerTemplateStatus.style.color =
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
  renderSettingsSummary();
  renderOpsSnapshot();
}

function getActiveProviderSummary() {
  const usageCounts = lastMetricsSnapshot?.contentProviders?.usageCounts;

  if (!usageCounts || typeof usageCounts !== "object") {
    return "Not reported by current metrics";
  }

  const [topEntry] = sortCounterEntries(usageCounts);
  if (!topEntry || topEntry[1] <= 0) {
    return "No provider usage recorded";
  }

  const [rawLabel, count] = topEntry;
  const [contentType, providerName] = rawLabel.includes(":") ? rawLabel.split(":", 2) : ["content", rawLabel];

  return `${providerName} for ${contentType} (${count})`;
}

function renderSettingsSummary() {
  const masterEnabled = automationMaster.globalAutomationEnabled === true;
  const passiveEnabled = lastSettingsSnapshot?.passiveChat?.enabled === true;
  const providerLoggingEnabled = lastSettingsSnapshot?.contentProviders?.debugLogging === true;
  const apiBaseUrl = getApiBaseUrl();

  settingsSummaryAutomation.textContent = masterEnabled
    ? "ON - scheduled/passive automation may run"
    : "OFF - scheduled/passive automation blocked";
  settingsSummaryAutomation.className = masterEnabled ? "settings-summary-value ok" : "settings-summary-value blocked";

  settingsSummaryPassive.textContent = passiveEnabled ? "ON - passive chat may be considered" : "OFF - passive chat disabled";
  settingsSummaryPassive.className = passiveEnabled ? "settings-summary-value ok" : "settings-summary-value neutral";

  settingsSummaryProvider.textContent = getActiveProviderSummary();
  settingsSummaryProvider.className = "settings-summary-value neutral";

  settingsSummaryApiUrl.textContent = apiBaseUrl;
  settingsSummaryApiUrl.className = "settings-summary-value neutral";

  settingsAutomationMasterState.textContent = masterEnabled ? "Master ON" : "Master OFF";
  settingsAutomationMasterState.className = `status-badge ${masterEnabled ? "active" : "blocked"}`;
  settingsAutomationMasterCopy.textContent = masterEnabled
    ? "Scheduled and passive automation may run when channel-level gates allow it."
    : "Scheduled and passive automation are blocked globally. Manual dashboard actions remain available.";

  settingsApiUrlDetail.textContent = apiBaseUrl;
  settingsAutoRefreshDetail.textContent = autoRefreshEnabledInput.checked ? "On" : "Off";

  if (providerLoggingEnabled) {
    settingsSummaryProvider.title = "Provider debug logging is enabled.";
  } else {
    settingsSummaryProvider.title = "Provider debug logging is disabled.";
  }
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
  renderComposerPreview();
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
    return;
  }

  if (select.form === composerForm) {
    syncDiscordMetadataSelections();
    renderComposerPreview();
    console.debug("[discord-metadata] composer preview rendered");
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

function getComposerFormValue() {
  return {
    channelId: composerForm.elements.channelId.value.trim(),
    roleId: composerForm.elements.roleId.value.trim(),
    templateId: composerForm.elements.templateId.value.trim(),
    templateName: composerForm.elements.templateName.value.trim(),
    message: composerForm.elements.message.value,
  };
}

function getComposerTemplatePayload() {
  const composer = getComposerFormValue();

  return {
    ...(composer.templateId ? { id: composer.templateId } : {}),
    name: composer.templateName,
    channelId: composer.channelId || null,
    roleId: composer.roleId || null,
    message: composer.message.trim(),
  };
}

function updateComposerCharacterCount() {
  const messageLength = composerForm.elements.message.value.length;
  composerCharacterCount.textContent = `${messageLength} / 2000 characters`;
  composerCharacterCount.style.color = messageLength > 2000 ? "#b42318" : "#74859a";
}

function getComposerPreviewTokenLabel(token) {
  if (token === "{user}") {
    return "@user";
  }

  const channelMatch = token.match(/^<#(\d{17,20})>$/);

  if (channelMatch) {
    return getChannelLabel(channelMatch[1]);
  }

  const roleMatch = token.match(/^<@&(\d{17,20})>$/);

  if (roleMatch) {
    return `@${getRoleLabel(roleMatch[1])}`;
  }

  return token;
}

function appendComposerPreviewText(target, value) {
  const tokenPattern = /(\{user\}|<#\d{17,20}>|<@&\d{17,20}>)/g;
  const parts = value.split(tokenPattern).filter((part) => part.length > 0);

  for (const part of parts) {
    if (/^(\{user\}|<#\d{17,20}>|<@&\d{17,20}>)$/.test(part)) {
      const mention = document.createElement("span");
      mention.className = "composer-preview-mention";
      mention.textContent = getComposerPreviewTokenLabel(part);
      target.append(mention);
    } else {
      target.append(document.createTextNode(part));
    }
  }
}

function renderComposerPreview() {
  const composer = getComposerFormValue();
  const message = composer.message.trim() || "Your message preview will appear here.";

  composerPreview.replaceChildren();

  const header = document.createElement("div");
  const previewMessage = document.createElement("div");
  const author = document.createElement("div");
  const body = document.createElement("p");
  const context = document.createElement("div");
  const channelContext = document.createElement("p");
  const roleContext = document.createElement("p");

  header.className = "discord-panel-preview-header";
  header.textContent = "Discord preview";
  previewMessage.className = "composer-preview-message";
  author.className = "composer-preview-author";
  author.textContent = "Cdawg Bot";
  body.className = "composer-preview-body";
  appendComposerPreviewText(body, message);
  context.className = "discord-panel-preview-context";
  channelContext.textContent = `Post to channel: ${getDetailedChannelLabel(composer.channelId, "not set")}`;
  roleContext.textContent = `Selected role insert: ${getDetailedRoleLabel(composer.roleId)}`;

  previewMessage.append(author, body);
  context.append(channelContext, roleContext);
  composerPreview.append(header, previewMessage, context);
  updateComposerCharacterCount();
  updateComposerQuickInsertState();
}

function updateComposerQuickInsertState() {
  const composer = getComposerFormValue();

  for (const button of document.querySelectorAll("[data-composer-insert-channel]")) {
    button.disabled = !composer.channelId;
  }

  for (const button of document.querySelectorAll("[data-composer-insert-role]")) {
    button.disabled = !composer.roleId;
  }

  for (const button of document.querySelectorAll("[data-composer-assist]")) {
    button.disabled = !composer.channelId || !composer.message.trim();
  }

  undoComposerRewriteButton.disabled = !composerDraftBeforeRewrite;
}

function insertIntoComposerMessage(text) {
  const textarea = composerForm.elements.message;
  const currentValue = textarea.value;
  const selectionStart = typeof textarea.selectionStart === "number" ? textarea.selectionStart : currentValue.length;
  const selectionEnd = typeof textarea.selectionEnd === "number" ? textarea.selectionEnd : currentValue.length;
  const nextValue = `${currentValue.slice(0, selectionStart)}${text}${currentValue.slice(selectionEnd)}`;
  const nextCursor = selectionStart + text.length;

  textarea.value = nextValue.slice(0, 2000);
  textarea.focus();
  textarea.setSelectionRange(Math.min(nextCursor, textarea.value.length), Math.min(nextCursor, textarea.value.length));
  renderComposerPreview();
}

function handleComposerQuickInsert(button) {
  const composer = getComposerFormValue();

  if (button.dataset.composerInsertChannel !== undefined) {
    if (!composer.channelId) {
      return;
    }

    insertIntoComposerMessage(`<#${composer.channelId}>`);
    return;
  }

  if (button.dataset.composerInsertRole !== undefined) {
    if (!composer.roleId) {
      return;
    }

    insertIntoComposerMessage(`<@&${composer.roleId}>`);
    return;
  }

  insertIntoComposerMessage(button.dataset.composerInsert ?? "");
}

function saveComposerDraft() {
  const draft = getComposerFormValue();
  window.localStorage.setItem(composerDraftStorageKey, JSON.stringify(draft));
  setComposerStatus("Draft saved locally.", "success");
}

function loadComposerDraft() {
  const rawDraft = window.localStorage.getItem(composerDraftStorageKey);

  if (!rawDraft) {
    renderComposerPreview();
    return;
  }

  try {
    const draft = JSON.parse(rawDraft);

    if (draft && typeof draft === "object") {
      composerForm.elements.channelId.value = typeof draft.channelId === "string" ? draft.channelId : "";
      composerForm.elements.roleId.value = typeof draft.roleId === "string" ? draft.roleId : "";
      composerForm.elements.message.value = typeof draft.message === "string" ? draft.message.slice(0, 2000) : "";
      syncDiscordMetadataSelections();
      renderComposerPreview();
      setComposerStatus("Local draft loaded.");
      return;
    }
  } catch (error) {
    console.warn("[composer] failed to load draft:", error);
  }

  renderComposerPreview();
}

function clearComposer() {
  composerForm.reset();
  composerDraftBeforeRewrite = null;
  window.localStorage.removeItem(composerDraftStorageKey);
  composerOutput.textContent = "No composer request yet.";
  setComposerStatus("Composer cleared.");
  syncDiscordMetadataSelections();
  renderComposerPreview();
}

function setComposerMessage(value) {
  composerForm.elements.message.value = value.slice(0, 2000);
  renderComposerPreview();
}

async function assistComposer(mode) {
  const composer = getComposerFormValue();
  const payload = {
    channelId: composer.channelId,
    message: composer.message.trim(),
    mode,
  };
  const validationError = validateComposerPayload(payload);

  if (validationError) {
    setComposerStatus(validationError, "error");
    return;
  }

  composerDraftBeforeRewrite = composer.message;
  setComposerStatus("Rewriting...");
  setPrettyJson(composerOutput, payload);
  renderComposerPreview();

  try {
    const data = await fetchJson("/api/composer/assist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setPrettyJson(composerOutput, data);
    setComposerMessage(data.message ?? composer.message);
    setComposerStatus("Rewrite applied.", "success");
  } catch (error) {
    composerDraftBeforeRewrite = null;
    composerOutput.textContent = `Composer rewrite failed.\n${error.message}`;
    setComposerStatus(`Rewrite failed: ${error.message}`, "error");
    renderComposerPreview();
  }
}

function undoComposerRewrite() {
  if (!composerDraftBeforeRewrite) {
    return;
  }

  setComposerMessage(composerDraftBeforeRewrite);
  composerDraftBeforeRewrite = null;
  setComposerStatus("Rewrite undone.");
  renderComposerPreview();
}

function renderComposerTemplates() {
  composerTemplatesList.replaceChildren();

  if (composerTemplates.length === 0) {
    const emptyState = document.createElement("section");
    const emptyTitle = document.createElement("h3");
    const emptyCopy = document.createElement("p");

    emptyState.className = "channel-operation-card role-access-empty-callout";
    emptyTitle.textContent = "No saved templates";
    emptyCopy.className = "channel-operation-detail";
    emptyCopy.textContent = "Save the current Composer draft as a named template to reuse it later.";
    emptyState.append(emptyTitle, emptyCopy);
    composerTemplatesList.append(emptyState);
    return;
  }

  for (const template of composerTemplates) {
    const row = document.createElement("section");
    const main = document.createElement("div");
    const title = document.createElement("h3");
    const channelDetail = document.createElement("p");
    const roleDetail = document.createElement("p");
    const updatedDetail = document.createElement("p");
    const actions = document.createElement("div");

    row.className = "channel-operation-card compact";
    main.className = "channel-operation-main";
    title.textContent = template.name;
    channelDetail.className = "channel-operation-detail channel-operation-detail-strong";
    channelDetail.textContent = `Channel: ${getChannelLabel(template.channelId) || "not set"}`;
    roleDetail.className = "channel-operation-detail";
    roleDetail.textContent = `Role insert: ${template.roleId ? `@${getRoleLabel(template.roleId)}` : "not set"}`;
    updatedDetail.className = "channel-operation-detail";
    updatedDetail.textContent = `Updated: ${formatTimestamp(template.updatedAt)} (${formatRelativeTime(template.updatedAt)})`;
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Load", () => loadComposerTemplate(template)),
      createChannelActionButton("Delete", () => void deleteComposerTemplate(template.id)),
    );

    main.append(title, channelDetail, roleDetail, updatedDetail);
    row.append(main, actions);
    composerTemplatesList.append(row);
  }
}

function loadComposerTemplate(template) {
  composerForm.elements.templateId.value = template.id;
  composerForm.elements.templateName.value = template.name;
  composerForm.elements.channelId.value = template.channelId ?? "";
  composerForm.elements.roleId.value = template.roleId ?? "";
  composerForm.elements.message.value = template.message;
  composerDraftBeforeRewrite = null;
  syncDiscordMetadataSelections();
  renderComposerPreview();
  setComposerTemplateStatus(`Loaded ${template.name}.`, "success");
}

async function saveComposerTemplate() {
  const payload = getComposerTemplatePayload();
  const validationError = validateComposerTemplatePayload(payload);

  if (validationError) {
    setComposerTemplateStatus(validationError, "error");
    return;
  }

  setComposerTemplateStatus("Saving...");

  try {
    const data = await fetchJson("/api/composer/templates/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    composerTemplates = Array.isArray(data.templates) ? data.templates : [];
    composerForm.elements.templateId.value = data.template?.id ?? "";
    composerForm.elements.templateName.value = data.template?.name ?? payload.name;
    renderComposerTemplates();
    setComposerTemplateStatus("Template saved.", "success");
  } catch (error) {
    setComposerTemplateStatus(`Save failed: ${error.message}`, "error");
  }
}

async function deleteComposerTemplate(templateId) {
  const template = composerTemplates.find((entry) => entry.id === templateId);

  if (!window.confirm(`Delete composer template "${template?.name ?? templateId}"?`)) {
    return;
  }

  setComposerTemplateStatus("Deleting...");

  try {
    const data = await fetchJson("/api/composer/templates/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: templateId,
      }),
    });

    composerTemplates = Array.isArray(data.templates) ? data.templates : [];

    if (composerForm.elements.templateId.value === templateId) {
      composerForm.elements.templateId.value = "";
      composerForm.elements.templateName.value = "";
    }

    renderComposerTemplates();
    setComposerTemplateStatus("Template deleted.", "success");
  } catch (error) {
    setComposerTemplateStatus(`Delete failed: ${error.message}`, "error");
  }
}

function validateComposerPayload(payload) {
  if (!payload.channelId) {
    return "Choose a Discord channel.";
  }

  if (!payload.message.trim()) {
    return "Message is required.";
  }

  if (payload.message.trim().length > 2000) {
    return "Message must be 2000 characters or fewer.";
  }

  return null;
}

function validateComposerTemplatePayload(payload) {
  if (!payload.name) {
    return "Template name is required.";
  }

  if (!payload.message.trim()) {
    return "Message is required.";
  }

  if (payload.message.trim().length > 2000) {
    return "Message must be 2000 characters or fewer.";
  }

  return null;
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

function setOpsCardState(card, tone) {
  if (!card) {
    return;
  }

  card.className = `ops-status-card ${tone}`;
}

function setOpsValue(target, value) {
  if (!target) {
    return;
  }

  target.textContent = String(value);
}

function getHealthUptimeSeconds(health) {
  if (!health || typeof health !== "object") {
    return null;
  }

  if (typeof health.uptimeSeconds === "number") {
    return health.uptimeSeconds;
  }

  if (typeof health.uptimeMs === "number") {
    return Math.floor(health.uptimeMs / 1000);
  }

  if (typeof health.uptime === "number") {
    return health.uptime > 100000 ? Math.floor(health.uptime / 1000) : health.uptime;
  }

  return null;
}

function formatUptime(health) {
  const uptimeSeconds = getHealthUptimeSeconds(health);

  if (!uptimeSeconds || uptimeSeconds < 0) {
    return "Unavailable";
  }

  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const parts = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}m`);
  }

  return parts.join(" ");
}

function getCountTone(count) {
  return count > 0 ? "warning" : "ok";
}

function metadataHasRole(roleId) {
  return guildRoles.some((role) => role.id === roleId);
}

function metadataHasChannel(channelId) {
  return guildChannels.some((channel) => channel.id === channelId);
}

function getMissingMetadataWarnings(roleId, channelId) {
  if (!guildMetadataLoaded) {
    return [];
  }

  const warnings = [];

  if (roleId && !metadataHasRole(roleId)) {
    warnings.push(`Selected role ${roleId} was not found in Discord metadata.`);
  }

  if (channelId && !metadataHasChannel(channelId)) {
    warnings.push(`Selected channel ${channelId} was not found in Discord metadata.`);
  }

  return warnings;
}

function hasMissingRole(roleId) {
  return !roleId || (guildMetadataLoaded && !metadataHasRole(roleId));
}

function hasMissingChannel(channelId) {
  return !channelId || (guildMetadataLoaded && !metadataHasChannel(channelId));
}

function renderOpsSnapshot() {
  const hasHealthSnapshot = Boolean(lastHealthSnapshot);
  const apiOnline = lastHealthSnapshot?.ok === true;
  const botReady = lastHealthSnapshot?.botReady === true;
  const uptime = formatUptime(lastHealthSnapshot);

  setOpsValue(opsApiStatus, hasHealthSnapshot ? (apiOnline ? "Online" : "Offline") : "Loading");
  setOpsCardState(opsApiStatusCard, hasHealthSnapshot ? (apiOnline ? "ok" : "bad") : "neutral");
  setOpsValue(opsBotStatus, hasHealthSnapshot ? (botReady ? "Ready" : "Not Ready") : "Loading");
  setOpsCardState(opsBotStatusCard, hasHealthSnapshot ? (botReady ? "ok" : "bad") : "neutral");
  setOpsValue(opsUptime, uptime);
  setOpsCardState(opsUptimeCard, uptime === "Unavailable" ? "neutral" : "ok");

  const masterEnabled = automationMaster.globalAutomationEnabled === true;
  opsAutomationMasterBadge.textContent = `master ${masterEnabled ? "on" : "off"}`;
  opsAutomationMasterBadge.className = `status-badge ${masterEnabled ? "active" : "blocked"}`;

  const activeCount = channelAutomationStatuses.filter((status) => !status.blockedReason).length;
  const disabledCount = channelAutomationStatuses.filter((status) => status.blockedReason === "disabled").length;
  const silencedCount = channelAutomationStatuses.filter((status) => status.blockedReason === "silenced").length;
  const cooldownCount = channelAutomationStatuses.filter((status) => status.blockedReason === "cooldown").length;
  const skipNextCount = channelAutomationStatuses.filter(
    (status) => status.blockedReason === "skip-next" || status.skipNextSendPending === true,
  ).length;

  setOpsValue(opsActiveChannels, activeCount);
  setOpsCardState(opsActiveChannelsCard, activeCount > 0 ? "ok" : "neutral");
  setOpsValue(opsDisabledChannels, disabledCount);
  setOpsCardState(opsDisabledChannelsCard, getCountTone(disabledCount));
  setOpsValue(opsSilencedChannels, silencedCount);
  setOpsCardState(opsSilencedChannelsCard, getCountTone(silencedCount));
  setOpsValue(opsCooldownChannels, cooldownCount);
  setOpsCardState(opsCooldownChannelsCard, getCountTone(cooldownCount));
  setOpsValue(opsSkipNextChannels, skipNextCount);
  setOpsCardState(opsSkipNextChannelsCard, getCountTone(skipNextCount));
  renderNextAutomationSnapshot();

  const panelsMissingChannelCount = roleAccessPanels.filter((panel) => hasMissingChannel(panel.targetChannelId)).length;
  const panelsMissingRoleCount = roleAccessPanels.filter((panel) => hasMissingRole(panel.roleId)).length;
  const disabledFollowupsCount = roleFollowups.filter((followup) => followup.enabled === false).length;
  const followupsMissingChannelCount = roleFollowups.filter((followup) => hasMissingChannel(followup.channelId)).length;
  const followupsMissingRoleCount = roleFollowups.filter((followup) => hasMissingRole(followup.roleId)).length;

  setOpsValue(opsTotalPanels, roleAccessPanels.length);
  setOpsCardState(opsTotalPanelsCard, roleAccessPanels.length > 0 ? "ok" : "neutral");
  setOpsValue(opsPanelsMissingChannel, panelsMissingChannelCount);
  setOpsCardState(opsPanelsMissingChannelCard, getCountTone(panelsMissingChannelCount));
  setOpsValue(opsPanelsMissingRole, panelsMissingRoleCount);
  setOpsCardState(opsPanelsMissingRoleCard, getCountTone(panelsMissingRoleCount));
  setOpsValue(opsTotalFollowups, roleFollowups.length);
  setOpsCardState(opsTotalFollowupsCard, roleFollowups.length > 0 ? "ok" : "neutral");
  setOpsValue(opsDisabledFollowups, disabledFollowupsCount);
  setOpsCardState(opsDisabledFollowupsCard, getCountTone(disabledFollowupsCount));
  setOpsValue(opsFollowupsMissingChannel, followupsMissingChannelCount);
  setOpsCardState(opsFollowupsMissingChannelCard, getCountTone(followupsMissingChannelCount));
  setOpsValue(opsFollowupsMissingRole, followupsMissingRoleCount);
  setOpsCardState(opsFollowupsMissingRoleCard, getCountTone(followupsMissingRoleCount));
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

function getBlockedReasonLabel(blockedReason) {
  if (blockedReason === "global-disabled") {
    return "Global automation OFF";
  }

  if (blockedReason === "disabled") {
    return "Channel disabled";
  }

  if (blockedReason === "silenced") {
    return "Channel silenced";
  }

  if (blockedReason === "cooldown") {
    return "Cooldown active";
  }

  if (blockedReason === "skip-next") {
    return "Skip-next pending";
  }

  return "No block";
}

function getAutomationModeLabel(automationMode) {
  if (!automationMode || automationMode === "none") {
    return "No automation configured";
  }

  return automationMode
    .split("+")
    .map((entry) => (entry === "scheduler" ? "scheduled" : entry))
    .join(" + ");
}

function createChannelStateItem(label, value, tone = "neutral") {
  const item = document.createElement("div");
  const itemLabel = document.createElement("span");
  const itemValue = document.createElement("strong");

  item.className = `channel-state-item ${tone}`;
  itemLabel.textContent = label;
  itemValue.textContent = value;
  item.append(itemLabel, itemValue);
  return item;
}

function createAutomationDetailLine(label, value, tone = "neutral") {
  const line = document.createElement("p");
  const name = document.createElement("span");
  const detail = document.createElement("strong");

  line.className = `automation-detail-line ${tone}`;
  name.textContent = label;
  detail.textContent = value;
  line.append(name, detail);
  return line;
}

function getNextAutomationCandidate() {
  const candidates = channelAutomationStatuses
    .filter((status) => typeof status.nextEligibleSendAt === "number" && Number.isFinite(status.nextEligibleSendAt))
    .sort(
      (left, right) =>
        left.nextEligibleSendAt - right.nextEligibleSendAt ||
        (left.label ?? left.channelId).localeCompare(right.label ?? right.channelId),
    );

  return candidates[0] ?? null;
}

function renderNextAutomationSnapshot() {
  if (!opsNextAutomation) {
    return;
  }

  opsNextAutomation.replaceChildren();

  const nextAutomation = getNextAutomationCandidate();

  if (!nextAutomation) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";

    if (automationMaster.globalAutomationEnabled === false) {
      emptyState.textContent = "Global automation is OFF, so no next automated run is currently eligible.";
    } else if (channelAutomationStatuses.length === 0) {
      emptyState.textContent = "No channel automation status is available yet.";
    } else {
      emptyState.textContent = "No next automated run is available in the current API payload.";
    }

    opsNextAutomation.append(emptyState);
    return;
  }

  const channel = document.createElement("strong");
  const details = document.createElement("div");
  const badges = document.createElement("div");

  channel.className = "ops-next-channel";
  channel.textContent = nextAutomation.label ?? nextAutomation.channelId;
  details.className = "ops-next-details";
  badges.className = "channel-operation-badges";
  badges.append(
    createStatusBadge(getBlockedReasonLabel(nextAutomation.blockedReason), nextAutomation.blockedReason ? "blocked" : "active"),
    createStatusBadge(getAutomationModeLabel(nextAutomation.automationMode), "neutral"),
  );

  details.append(
    createAutomationDetailLine("Next eligible", `${formatTimestamp(nextAutomation.nextEligibleSendAt)} (${formatRelativeTime(nextAutomation.nextEligibleSendAt)})`, "strong"),
    createAutomationDetailLine("Mode", getAutomationModeLabel(nextAutomation.automationMode)),
    createAutomationDetailLine("Content/provider", "Not included in current API payload"),
  );

  if (nextAutomation.blockedReason) {
    details.append(createAutomationDetailLine("Blocked by", getChannelOperationStatusText(nextAutomation), "blocked"));
  }

  opsNextAutomation.append(channel, badges, details);
}

function getActivityChannelLabel(item) {
  if (item.channelName) {
    return `#${item.channelName}`;
  }

  return getChannelLabel(item.channelId);
}

function getActivityTone(item) {
  if (item.status === "success") {
    return "active";
  }

  if (item.status === "failure" || item.status === "blocked") {
    return "blocked";
  }

  return "neutral";
}

function createAutomationActivityItem(item) {
  const row = document.createElement("article");
  const main = document.createElement("div");
  const meta = document.createElement("div");
  const message = document.createElement("p");
  const badges = document.createElement("div");

  row.className = `automation-activity-item status-${item.status}`;
  main.className = "automation-activity-main";
  meta.className = "automation-activity-meta";
  message.className = "automation-activity-message";
  badges.className = "channel-operation-badges";

  meta.append(
    createAutomationDetailLine("When", formatTimestamp(item.timestamp)),
    createAutomationDetailLine("Channel", getActivityChannelLabel(item)),
    createAutomationDetailLine("Source", item.source ?? "unknown"),
  );
  message.textContent = item.message || "No details available.";
  badges.append(createStatusBadge(item.status, getActivityTone(item)));

  if (item.contentType) {
    badges.append(createStatusBadge(item.contentType, "neutral"));
  }

  if (item.errorCode) {
    badges.append(createStatusBadge(item.errorCode, "blocked"));
  }

  if (item.blockedReason) {
    badges.append(createStatusBadge(item.blockedReason, "blocked"));
  }

  main.append(badges, message);
  row.append(main, meta);
  return row;
}

function renderAutomationActivity() {
  automationActivityList.replaceChildren();
  automationErrorsList.replaceChildren();

  if (automationActivityItems.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No recent automation activity available.";
    automationActivityList.append(emptyState);
  } else {
    for (const item of automationActivityItems.slice(0, 8)) {
      automationActivityList.append(createAutomationActivityItem(item));
    }
  }

  const errorItems = automationActivityItems.filter((item) => item.status === "failure" || item.status === "blocked");

  if (errorItems.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No recent automation errors found.";
    automationErrorsList.append(emptyState);
    return;
  }

  for (const item of errorItems.slice(0, 6)) {
    automationErrorsList.append(createAutomationActivityItem(item));
  }
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
    const stateGrid = document.createElement("div");
    const automationDetails = document.createElement("div");
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
    nextEligible.textContent = `Next automation: ${formatTimestamp(channelStatus.nextEligibleSendAt)} (${formatRelativeTime(channelStatus.nextEligibleSendAt)})`;
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
    meta.textContent = `Channel ID: ${channelStatus.channelId}${channelStatus.defaultTopic ? ` • Topic: ${channelStatus.defaultTopic}` : ""}`;
    stateGrid.className = "channel-state-grid";
    stateGrid.append(
      createChannelStateItem(
        "Global automation",
        channelStatus.globalAutomationEnabled ? "ON" : "OFF",
        channelStatus.globalAutomationEnabled ? "ok" : "bad",
      ),
      createChannelStateItem(
        "Channel automation",
        channelStatus.channelAutomationEnabled ? "ON" : "OFF",
        channelStatus.channelAutomationEnabled ? "ok" : "bad",
      ),
      createChannelStateItem(
        "Silence",
        channelStatus.blockedReason === "silenced" ? `Active until ${formatTimestamp(channelStatus.blockedUntil)}` : "Clear",
        channelStatus.blockedReason === "silenced" ? "bad" : "ok",
      ),
      createChannelStateItem(
        "Cooldown",
        channelStatus.blockedReason === "cooldown" ? `Active until ${formatTimestamp(channelStatus.blockedUntil)}` : "Clear",
        channelStatus.blockedReason === "cooldown" ? "warning" : "ok",
      ),
      createChannelStateItem(
        "Skip-next",
        channelStatus.skipNextSendPending ? "Pending" : "Clear",
        channelStatus.skipNextSendPending ? "warning" : "ok",
      ),
    );
    automationDetails.className = "automation-detail-list";
    automationDetails.append(
      createAutomationDetailLine("Blocked reason", getBlockedReasonLabel(channelStatus.blockedReason), channelStatus.blockedReason ? "blocked" : "ok"),
      createAutomationDetailLine("Automation mode", getAutomationModeLabel(channelStatus.automationMode)),
      createAutomationDetailLine("Next eligible", `${formatTimestamp(channelStatus.nextEligibleSendAt)} (${formatRelativeTime(channelStatus.nextEligibleSendAt)})`, "strong"),
      createAutomationDetailLine("Passive eligible", `${formatTimestamp(channelStatus.passiveEligibleAt)} (${formatRelativeTime(channelStatus.passiveEligibleAt)})`),
      createAutomationDetailLine("Scheduled eligible", `${formatTimestamp(channelStatus.scheduledEligibleAt)} (${formatRelativeTime(channelStatus.scheduledEligibleAt)})`),
      createAutomationDetailLine("Next content/provider", "Not included in current API payload"),
    );
    blockedUntil.className = "channel-operation-detail";
    blockedUntil.textContent = `Blocked until: ${formatTimestamp(channelStatus.blockedUntil)} (${formatRelativeTime(channelStatus.blockedUntil)})`;
    lastSend.className = "channel-operation-detail";
    lastSend.textContent = `Last automated send time: ${formatTimestamp(channelStatus.lastAutomatedSendAt)} (${formatRelativeTime(channelStatus.lastAutomatedSendAt)})`;

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
    expandedMeta.append(meta, stateGrid, automationDetails, lastSend, blockedUntil);
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
  if (!payload.title) {
    return "Panel name is required.";
  }

  if (!payload.body) {
    return "Panel message is required.";
  }

  if (!payload.buttonLabel) {
    return "Button label is required.";
  }

  if (!payload.roleId) {
    return "Choose or enter the role this panel should assign.";
  }

  if (!payload.targetChannelId) {
    return "Choose or enter the channel where this panel should be posted.";
  }

  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(payload.id)) {
    return "Internal ID must use lowercase letters, numbers, dashes, or underscores.";
  }

  return null;
}

function getRoleAccessReadiness(panel) {
  if (!panel.title || !panel.body || !panel.buttonLabel) {
    return {
      label: "Incomplete",
      tone: "blocked",
      detail: "Name, message, and button label are required before posting.",
    };
  }

  if (!panel.roleId) {
    return {
      label: "Missing Role",
      tone: "blocked",
      detail: "Choose or enter the role this panel should assign.",
    };
  }

  if (!panel.targetChannelId) {
    return {
      label: "Missing Channel",
      tone: "blocked",
      detail: "Choose or enter the channel where this panel should be posted.",
    };
  }

  if (guildMetadataLoaded && !metadataHasChannel(panel.targetChannelId)) {
    return {
      label: "Bot Cannot Post",
      tone: "blocked",
      detail: "The selected channel is not available in the sendable Discord channel list.",
    };
  }

  if (guildMetadataLoaded && !metadataHasRole(panel.roleId)) {
    return {
      label: "Missing Role",
      tone: "blocked",
      detail: "The selected role was not found in Discord metadata.",
    };
  }

  return {
    label: "Ready to Post",
    tone: "active",
    detail: panel.active ? "Panel can be saved and posted." : "Panel can be posted, but its button will be inactive.",
  };
}

function formatRoleAccessPreviewMessage(value, panel) {
  return value
    .replace(/\{user\}/g, "@ExampleUser")
    .replace(/\{role\}/g, panel.roleId ? `@${getRoleLabel(panel.roleId)}` : "@ExampleRole")
    .replace(/\{channel\}/g, panel.targetChannelId ? getChannelLabel(panel.targetChannelId) : "#example-channel");
}

function renderRoleAccessPreview() {
  const panel = getRoleAccessPanelFormValue();
  const title = panel.title || "Access message name";
  const body = panel.body || "Your Discord message will appear here.";
  const buttonLabel = panel.buttonLabel || "Request Access";
  const readiness = getRoleAccessReadiness(panel);
  const metadataWarnings = getMissingMetadataWarnings(panel.roleId, panel.targetChannelId);

  roleAccessPreview.replaceChildren();
  roleAccessMetadataWarning.hidden = metadataWarnings.length === 0;
  roleAccessMetadataWarning.textContent = metadataWarnings.join(" ");

  const previewHeader = document.createElement("div");
  const previewHeaderTitle = document.createElement("span");
  const readinessBadge = createStatusBadge(readiness.label, readiness.tone);
  const embed = document.createElement("div");
  const embedTitle = document.createElement("h4");
  const embedBody = document.createElement("p");
  const previewButton = document.createElement("button");
  const context = document.createElement("div");
  const roleContext = document.createElement("p");
  const channelContext = document.createElement("p");
  const statusContext = document.createElement("p");
  const readinessContext = document.createElement("p");
  const customIdContext = document.createElement("p");

  previewHeader.className = "discord-panel-preview-header";
  previewHeaderTitle.textContent = "Discord preview";
  previewHeader.append(previewHeaderTitle, readinessBadge);
  embed.className = "discord-panel-preview-embed";
  embedTitle.textContent = title;
  embedBody.textContent = formatRoleAccessPreviewMessage(body, panel);
  previewButton.type = "button";
  previewButton.disabled = true;
  previewButton.textContent = buttonLabel;
  context.className = "discord-panel-preview-context";
  roleContext.textContent = `Role to assign: ${getDetailedRoleLabel(panel.roleId)}`;
  channelContext.textContent = `Post to channel: ${getDetailedChannelLabel(panel.targetChannelId, "not set")}`;
  statusContext.textContent = `Button state: ${panel.active ? "active" : "inactive"}`;
  readinessContext.textContent = `Post readiness: ${readiness.detail}`;
  customIdContext.textContent = `Button custom ID: role-access-panel:${panel.id || "panel-id"}`;
  context.append(roleContext, channelContext, statusContext, readinessContext, customIdContext);

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
    const readinessDetail = document.createElement("p");
    const metadataWarning = document.createElement("p");
    const postedDetail = document.createElement("p");
    const actions = document.createElement("div");
    const readiness = getRoleAccessReadiness(panel);
    const metadataWarnings = getMissingMetadataWarnings(panel.roleId, panel.targetChannelId);

    row.className = "channel-operation-card compact role-access-panel-card";
    main.className = "channel-operation-main";
    title.textContent = panel.title;
    badges.className = "channel-operation-badges";
    badges.append(
      createStatusBadge(panel.active ? "active" : "inactive", panel.active ? "active" : "neutral"),
      createStatusBadge(readiness.label, readiness.tone),
    );
    if (metadataWarnings.length > 0) {
      badges.append(createStatusBadge("metadata warning", "blocked"));
    }
    roleDetail.className = "channel-operation-detail channel-operation-detail-strong";
    roleDetail.textContent = `Role: ${getDetailedRoleLabel(panel.roleId)}`;
    channelDetail.className = "channel-operation-detail";
    channelDetail.textContent = `Channel: ${getDetailedChannelLabel(panel.targetChannelId, "not set")}`;
    readinessDetail.className = "channel-operation-detail";
    readinessDetail.textContent = readiness.detail;
    metadataWarning.className = "channel-operation-detail role-followup-warning";
    metadataWarning.textContent = metadataWarnings.join(" ");
    metadataWarning.hidden = metadataWarnings.length === 0;
    postedDetail.className = "channel-operation-detail";
    postedDetail.textContent = `Last posted: ${formatTimestamp(panel.lastPostedAt)} (${formatRelativeTime(panel.lastPostedAt)})`;
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Edit Draft", () => populateRoleAccessPanelForm(panel)),
      createChannelActionButton("Post to Discord", () => void postRoleAccessPanel(panel.id)),
      createChannelActionButton("Delete", () => void deleteRoleAccessPanel(panel.id)),
    );

    main.append(title, badges, roleDetail, channelDetail, readinessDetail, metadataWarning, postedDetail);
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
    return "Choose or enter the role that triggers this follow-up.";
  }

  if (!payload.channelId) {
    return "Choose or enter the channel where Cdawg should post this follow-up.";
  }

  if (!payload.message) {
    return "Message is required.";
  }

  const messageTextWithoutTokens = payload.message
    .replace(/\{user\}|\{username\}|\{role\}|\{channel\}/g, "")
    .replace(/<[@#][!&]?\d{17,20}>/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

  if (!messageTextWithoutTokens) {
    return "Message needs readable text beyond tokens or mentions.";
  }

  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(payload.id)) {
    return "Internal ID must use lowercase letters, numbers, dashes, or underscores.";
  }

  return null;
}

function renderRoleFollowupPreview() {
  const followup = getRoleFollowupFormValue();
  const metadataWarnings = getMissingMetadataWarnings(followup.roleId, followup.channelId);

  roleFollowupPreview.replaceChildren();
  roleFollowupMetadataWarning.hidden = metadataWarnings.length === 0;
  roleFollowupMetadataWarning.textContent = metadataWarnings.join(" ");

  const header = document.createElement("div");
  const headerTitle = document.createElement("span");
  const statusBadge = createStatusBadge(followup.enabled ? "active" : "inactive", followup.enabled ? "active" : "neutral");
  const flow = document.createElement("div");
  const trigger = document.createElement("p");
  const action = document.createElement("p");
  const message = document.createElement("div");
  const previewNote = document.createElement("p");
  const messageText = document.createElement("p");
  const context = document.createElement("div");
  const status = document.createElement("p");

  header.className = "discord-panel-preview-header";
  headerTitle.textContent = "Follow-up preview";
  flow.className = "role-followup-preview-flow";
  trigger.textContent = `User gets role: ${getDetailedRoleLabel(followup.roleId)}`;
  action.textContent = `Cdawg posts in channel: ${getDetailedChannelLabel(followup.channelId, "not set")}`;
  message.className = "discord-panel-preview-embed";
  previewNote.className = "role-followup-preview-note";
  previewNote.textContent = "Preview only. Discord sends the configured message when the role is added.";
  messageText.textContent = followup.message
    ? formatFollowupPreviewMessage(followup.message, followup)
    : "Your follow-up message will appear here.";
  context.className = "discord-panel-preview-context";
  status.textContent = `Saved state: ${followup.enabled ? "will send when triggered" : "saved but will not send"}`;

  header.append(headerTitle, statusBadge);
  flow.append(trigger, action);
  message.append(previewNote, messageText);
  context.append(status);
  roleFollowupPreview.append(header, flow, message, context);
  updateFollowupQuickInsertState();
}

function formatFollowupPreviewMessage(value, followup = getRoleFollowupFormValue()) {
  return value
    .replace(/\{user\}|<@\{userId\}>/g, "@ExampleUser")
    .replace(/\{username\}/g, "ExampleUser")
    .replace(/\{role\}/g, "@ExampleRole")
    .replace(/\{channel\}/g, "#example-channel")
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
    const metadataWarning = document.createElement("p");
    const messagePreview = document.createElement("p");
    const actions = document.createElement("div");
    const metadataWarnings = getMissingMetadataWarnings(followup.roleId, followup.channelId);

    row.className = "channel-operation-card compact role-followup-card";
    main.className = "channel-operation-main";
    title.textContent = getRoleLabel(followup.roleId);
    badges.className = "channel-operation-badges";
    badges.append(createStatusBadge(followup.enabled ? "active" : "inactive", followup.enabled ? "active" : "neutral"));
    if (metadataWarnings.length > 0) {
      badges.append(createStatusBadge("metadata warning", "blocked"));
    }
    roleDetail.className = "channel-operation-detail channel-operation-detail-strong";
    roleDetail.textContent = `Role: ${getDetailedRoleLabel(followup.roleId)}`;
    channelDetail.className = "channel-operation-detail";
    channelDetail.textContent = `Channel: ${getDetailedChannelLabel(followup.channelId, "not set")}`;
    metadataWarning.className = "channel-operation-detail role-followup-warning";
    metadataWarning.textContent = metadataWarnings.join(" ");
    metadataWarning.hidden = metadataWarnings.length === 0;
    messagePreview.className = "channel-operation-detail";
    messagePreview.textContent = followup.message.length > 140 ? `${followup.message.slice(0, 140)}...` : followup.message;
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Edit", () => populateRoleFollowupForm(followup)),
      createChannelActionButton("Delete", () => void deleteRoleFollowup(followup.id)),
    );

    main.append(title, badges, roleDetail, channelDetail, metadataWarning, messagePreview);
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
  renderSettingsSummary();
  setStatusMessage("Form reset to current runtime settings.");
}

async function loadHealth() {
  try {
    const data = await fetchJson("/health");
    lastHealthSnapshot = data;
    renderHealthCards(data);
    renderOpsSnapshot();
    setPrettyJson(healthOutput, data);
  } catch (error) {
    lastHealthSnapshot = { ok: false, botReady: false };
    healthCards.replaceChildren(createHealthCard("Health", "Unavailable", "bad"));
    renderOpsSnapshot();
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
    lastMetricsSnapshot = metrics;

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
    renderSettingsSummary();
    setPrettyJson(metricsOutput, data);
  } catch (error) {
    lastMetricsSnapshot = null;
    renderSettingsSummary();
    metricsOutput.textContent = `Failed to load metrics.\n${error.message}`;
  }
}

async function loadAutomationActivity() {
  try {
    const data = await fetchJson("/api/automation-activity?limit=50");
    automationActivityItems = Array.isArray(data.items) ? data.items : [];
    renderAutomationActivity();
    setPrettyJson(automationActivityOutput, data);
  } catch (error) {
    automationActivityItems = [];
    renderAutomationActivity();
    automationActivityOutput.textContent = `Failed to load automation activity.\n${error.message}`;
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
    guildMetadataLoaded = true;
    discordMetadataWarning.hidden = true;
    renderDiscordMetadataOptions();
    renderRoleAccessPreview();
    renderRoleAccessPanels();
    renderRoleFollowupPreview();
    renderRoleFollowups();
    renderComposerTemplates();
    renderOpsSnapshot();
  } catch (error) {
    guildRoles = [];
    guildChannels = [];
    guildMetadataLoaded = false;
    discordMetadataWarning.hidden = false;
    renderDiscordMetadataOptions();
    renderOpsSnapshot();
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
    renderOpsSnapshot();
    setPrettyJson(roleAccessPanelsOutput, data);
  } catch (error) {
    roleAccessPanels = [];
    renderRoleAccessPanels();
    renderOpsSnapshot();
    roleAccessPanelsOutput.textContent = `Failed to load role access panels.\n${error.message}`;
    setRoleAccessPanelStatus(`Role access load failed: ${error.message}`, "error");
  }
}

async function loadRoleFollowups() {
  try {
    const data = await fetchJson("/api/role-followups");
    roleFollowups = Array.isArray(data.roleFollowups) ? data.roleFollowups : [];
    renderRoleFollowups();
    renderOpsSnapshot();
    setPrettyJson(roleFollowupsOutput, data);
  } catch (error) {
    roleFollowups = [];
    renderRoleFollowups();
    renderOpsSnapshot();
    roleFollowupsOutput.textContent = `Failed to load role follow-ups.\n${error.message}`;
    setRoleFollowupStatus(`Follow-up load failed: ${error.message}`, "error");
  }
}

async function loadComposerTemplates() {
  try {
    const data = await fetchJson("/api/composer/templates");
    composerTemplates = Array.isArray(data.templates) ? data.templates : [];
    renderComposerTemplates();
  } catch (error) {
    composerTemplates = [];
    renderComposerTemplates();
    setComposerTemplateStatus(`Template load failed: ${error.message}`, "error");
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
    renderOpsSnapshot();
    setPrettyJson(channelOperationsOutput, data);
  } catch (error) {
    channelAutomationStatuses = [];
    renderChannelOperations();
    renderOpsSnapshot();
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

async function submitComposer(event) {
  event.preventDefault();

  const composer = getComposerFormValue();
  const payload = {
    channelId: composer.channelId,
    message: composer.message.trim(),
  };
  const validationError = validateComposerPayload(payload);

  if (validationError) {
    setComposerStatus(validationError, "error");
    return;
  }

  setComposerStatus("Posting...");
  setPrettyJson(composerOutput, payload);

  try {
    const data = await fetchJson("/api/composer/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setPrettyJson(composerOutput, data);
    setComposerStatus(`Posted to ${getChannelLabel(data.channelId)}.`, "success");
    await loadHealth();
  } catch (error) {
    composerOutput.textContent = `Composer post failed.\n${error.message}`;
    setComposerStatus(`Post failed: ${error.message}`, "error");
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
  const payload = getRoleAccessPanelFormValue();
  const validationError = validateRoleAccessPanelPayload(payload);

  if (validationError) {
    setRoleAccessPanelStatus(validationError, "error");
    return;
  }

  const panelId = roleAccessPanelForm.elements.id.value.trim();

  if (!panelId) {
    setRoleAccessPanelStatus("Save the draft first so the panel has a stable internal ID before posting.", "error");
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
    loadAutomationActivity(),
    loadChannelOperations(),
    loadChannelPresets(),
    loadGuildMetadata(),
    loadHistoryReview(),
    loadDogState(),
    loadDailyTriviaChallenge(),
    loadFeeds(),
    loadRoleAccessPanels(),
    loadRoleFollowups(),
    loadComposerTemplates(),
  ]);
}

function configureAutoRefresh() {
  window.localStorage.setItem(autoRefreshStorageKey, String(autoRefreshEnabledInput.checked));
  renderSettingsSummary();

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
  apiBaseUrlInput.value = getApiBaseUrl();
  window.localStorage.setItem(apiBaseUrlStorageKey, apiBaseUrlInput.value);
  renderSettingsSummary();
  setStatusMessage("Reconnected to API.");
  await reloadAll();
});

resetApiUrlButton.addEventListener("click", async () => {
  resetApiBaseUrl();
  renderSettingsSummary();
  setStatusMessage("API URL reset to automatic default.");
  await reloadAll();
});

settingsForm.addEventListener("submit", saveSettings);
composerForm.addEventListener("submit", submitComposer);
composerForm.addEventListener("input", (event) => {
  if (event.target?.matches?.("[data-discord-role-select], [data-discord-channel-select]")) {
    updateDiscordMetadataSelection(event.target);
    return;
  }

  if (event.target === composerForm.elements.message) {
    composerDraftBeforeRewrite = null;
  }

  syncDiscordMetadataSelections();
  renderComposerPreview();
});
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
for (const button of document.querySelectorAll("[data-composer-insert], [data-composer-insert-channel], [data-composer-insert-role]")) {
  button.addEventListener("click", () => handleComposerQuickInsert(button));
}
for (const button of document.querySelectorAll("[data-composer-assist]")) {
  button.addEventListener("click", () => void assistComposer(button.dataset.composerAssist));
}
for (const select of document.querySelectorAll("[data-discord-role-select], [data-discord-channel-select]")) {
  select.addEventListener("change", () => updateDiscordMetadataSelection(select));
}
manualPushForm.elements.channelPreset.addEventListener("change", () => syncManualPushPresetSelection(true));
saveComposerDraftButton.addEventListener("click", saveComposerDraft);
clearComposerButton.addEventListener("click", clearComposer);
undoComposerRewriteButton.addEventListener("click", undoComposerRewrite);
saveComposerTemplateButton.addEventListener("click", () => void saveComposerTemplate());
resetSettingsButton.addEventListener("click", resetSettingsForm);
resetFeedFormButton.addEventListener("click", resetFeedForm);
resetRoleAccessPanelFormButton.addEventListener("click", resetRoleAccessPanelForm);
postRoleAccessPanelFormButton.addEventListener("click", () => void postCurrentRoleAccessPanel());
resetRoleFollowupFormButton.addEventListener("click", resetRoleFollowupForm);
deleteRoleFollowupFormButton.addEventListener("click", () => void deleteCurrentRoleFollowup());
refreshAllButton.addEventListener("click", () => void reloadAll());
automationMasterButton.addEventListener("click", () => void toggleAutomationMaster());
opsRefreshDashboardButton.addEventListener("click", () => void reloadAll());
opsJumpChannelsButton.addEventListener("click", () => setActiveControlTab("channels"));
opsJumpAccessButton.addEventListener("click", () => setActiveControlTab("access"));
opsJumpFollowupsButton.addEventListener("click", () => setActiveControlTab("followups"));
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
renderOpsSnapshot();
renderAutomationActivity();
loadComposerDraft();
renderRoleAccessPreview();
renderRoleFollowupPreview();
void reloadAll();
