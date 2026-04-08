const apiConfigForm = document.querySelector("#api-config-form");
const apiBaseUrlInput = document.querySelector("#api-base-url");
const autoRefreshEnabledInput = document.querySelector("#auto-refresh-enabled");
const refreshAllButton = document.querySelector("#refresh-all");

const healthCards = document.querySelector("#health-cards");
const healthOutput = document.querySelector("#health-output");
const settingsOutput = document.querySelector("#settings-output");
const metricsOutput = document.querySelector("#metrics-output");
const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");

const passiveMetricsList = document.querySelector("#passive-metrics-list");
const commandMetricsList = document.querySelector("#command-metrics-list");
const providerUsageList = document.querySelector("#provider-usage-list");
const providerSuccessList = document.querySelector("#provider-success-list");
const providerFallbackList = document.querySelector("#provider-fallback-list");
const providerFailureList = document.querySelector("#provider-failure-list");

const refreshHealthButton = document.querySelector("#refresh-health");
const refreshSettingsButton = document.querySelector("#refresh-settings");
const refreshMetricsButton = document.querySelector("#refresh-metrics");
const resetSettingsButton = document.querySelector("#reset-settings");

const apiBaseUrlStorageKey = "cdawg-dashboard-api-base-url";
const autoRefreshStorageKey = "cdawg-dashboard-auto-refresh-enabled";
const autoRefreshIntervalMs = 15000;

let lastSettingsSnapshot = null;
let autoRefreshTimer = null;

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

async function reloadAll() {
  await Promise.all([loadHealth(), loadSettings(), loadMetrics()]);
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
resetSettingsButton.addEventListener("click", resetSettingsForm);
refreshAllButton.addEventListener("click", () => void reloadAll());
refreshHealthButton.addEventListener("click", loadHealth);
refreshSettingsButton.addEventListener("click", loadSettings);
refreshMetricsButton.addEventListener("click", loadMetrics);
autoRefreshEnabledInput.addEventListener("change", configureAutoRefresh);

configureAutoRefresh();
void reloadAll();
