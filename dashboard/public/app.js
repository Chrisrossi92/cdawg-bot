const apiConfigForm = document.querySelector("#api-config-form");
const apiBaseUrlInput = document.querySelector("#api-base-url");
const healthOutput = document.querySelector("#health-output");
const settingsOutput = document.querySelector("#settings-output");
const metricsOutput = document.querySelector("#metrics-output");
const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");

const refreshHealthButton = document.querySelector("#refresh-health");
const refreshSettingsButton = document.querySelector("#refresh-settings");
const refreshMetricsButton = document.querySelector("#refresh-metrics");

const apiBaseUrlStorageKey = "cdawg-dashboard-api-base-url";
const savedApiBaseUrl = window.localStorage.getItem(apiBaseUrlStorageKey);

if (savedApiBaseUrl) {
  apiBaseUrlInput.value = savedApiBaseUrl;
}

function getApiBaseUrl() {
  return apiBaseUrlInput.value.replace(/\/+$/, "");
}

function setPrettyJson(target, value) {
  target.textContent = JSON.stringify(value, null, 2);
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

async function loadHealth() {
  try {
    const data = await fetchJson("/health");
    setPrettyJson(healthOutput, data);
  } catch (error) {
    healthOutput.textContent = `Failed to load health.\n${error.message}`;
  }
}

async function loadSettings() {
  try {
    const data = await fetchJson("/api/settings");
    applySettingsToForm(data.settings);
    setPrettyJson(settingsOutput, data);
  } catch (error) {
    settingsOutput.textContent = `Failed to load settings.\n${error.message}`;
  }
}

async function loadMetrics() {
  try {
    const data = await fetchJson("/api/metrics");
    setPrettyJson(metricsOutput, data);
  } catch (error) {
    metricsOutput.textContent = `Failed to load metrics.\n${error.message}`;
  }
}

async function saveSettings(event) {
  event.preventDefault();
  settingsStatus.textContent = "Saving...";

  const payload = {
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

  try {
    const data = await fetchJson("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    settingsStatus.textContent = "Saved.";
    applySettingsToForm(data.settings);
    setPrettyJson(settingsOutput, data);
  } catch (error) {
    settingsStatus.textContent = `Save failed: ${error.message}`;
  }
}

async function reloadAll() {
  await Promise.all([loadHealth(), loadSettings(), loadMetrics()]);
}

apiConfigForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  window.localStorage.setItem(apiBaseUrlStorageKey, getApiBaseUrl());
  await reloadAll();
});

settingsForm.addEventListener("submit", saveSettings);
refreshHealthButton.addEventListener("click", loadHealth);
refreshSettingsButton.addEventListener("click", loadSettings);
refreshMetricsButton.addEventListener("click", loadMetrics);

void reloadAll();
