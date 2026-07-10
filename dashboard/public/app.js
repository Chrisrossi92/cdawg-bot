const apiConfigForm = document.querySelector("#api-config-form");
const apiBaseUrlInput = document.querySelector("#api-base-url");
const apiTokenInput = document.querySelector("#api-token");
const resetApiUrlButton = document.querySelector("#reset-api-url");
const autoRefreshEnabledInput = document.querySelector("#auto-refresh-enabled");
const refreshAllButton = document.querySelector("#refresh-all");
const automationMasterBadge = document.querySelector("#automation-master-badge");
const automationMasterButton = document.querySelector("#automation-master-button");
const automationMasterDetail = document.querySelector("#automation-master-detail");
const automationMasterBanner = document.querySelector("#automation-master-banner");
const discordMetadataWarning = document.querySelector("#discord-metadata-warning");
const opportunityContextBanner = document.querySelector("#opportunity-context-banner");
const opportunityContextTitle = document.querySelector("#opportunity-context-title");
const opportunityContextDetail = document.querySelector("#opportunity-context-detail");
const opportunityContextDismiss = document.querySelector("#opportunity-context-dismiss");
const palworldLaunchStatusBadge = document.querySelector("#palworld-launch-status-badge");
const palworldLaunchChannel = document.querySelector("#palworld-launch-channel");
const palworldActivity = document.querySelector("#palworld-activity");
const palworldActivityDetail = document.querySelector("#palworld-activity-detail");
const palworldAutomation = document.querySelector("#palworld-automation");
const palworldAutomationDetail = document.querySelector("#palworld-automation-detail");
const palworldLastPost = document.querySelector("#palworld-last-post");
const palworldLastPostDetail = document.querySelector("#palworld-last-post-detail");
const palworldNextPost = document.querySelector("#palworld-next-post");
const palworldNextPostDetail = document.querySelector("#palworld-next-post-detail");
const palworldOutcomes = document.querySelector("#palworld-outcomes");
const palworldWarnings = document.querySelector("#palworld-warnings");
const palworldPostInfoButton = document.querySelector("#palworld-post-info");
const palworldPostPromptButton = document.querySelector("#palworld-post-prompt");
const palworldPauseAutomationButton = document.querySelector("#palworld-pause-automation");
const palworldResumeAutomationButton = document.querySelector("#palworld-resume-automation");
const palworldActionStatus = document.querySelector("#palworld-action-status");
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
const opsSetupEmpty = document.querySelector("#ops-setup-empty");
const opsTotalPanelsCard = document.querySelector("#ops-total-panels-card");
const opsPanelsMissingChannelCard = document.querySelector("#ops-panels-missing-channel-card");
const opsPanelsMissingRoleCard = document.querySelector("#ops-panels-missing-role-card");
const opsTotalFollowupsCard = document.querySelector("#ops-total-followups-card");
const opsDisabledFollowupsCard = document.querySelector("#ops-disabled-followups-card");
const opsFollowupsMissingChannelCard = document.querySelector("#ops-followups-missing-channel-card");
const opsFollowupsMissingRoleCard = document.querySelector("#ops-followups-missing-role-card");
const communityTotalPanels = document.querySelector("#community-total-panels");
const communityTotalFollowups = document.querySelector("#community-total-followups");
const communityMissingRole = document.querySelector("#community-missing-role");
const communityMissingChannel = document.querySelector("#community-missing-channel");
const communityTotalPanelsCard = document.querySelector("#community-total-panels-card");
const communityTotalFollowupsCard = document.querySelector("#community-total-followups-card");
const communityMissingRoleCard = document.querySelector("#community-missing-role-card");
const communityMissingChannelCard = document.querySelector("#community-missing-channel-card");
const communityNewMembersList = document.querySelector("#community-new-members-list");
const communityFollowupList = document.querySelector("#community-followup-list");
const communityActivityWindow = document.querySelector("#community-activity-window");
const communityActivitySummary = document.querySelector("#community-activity-summary");
const communityActiveChannels = document.querySelector("#community-active-channels");
const communityRecognitionSummary = document.querySelector("#community-recognition-summary");
const welcomeSummaryStatus = document.querySelector("#welcome-summary-status");
const welcomeSummaryChannel = document.querySelector("#welcome-summary-channel");
const editWelcomeMessageButton = document.querySelector("#edit-welcome-message");
const welcomeForm = document.querySelector("#welcome-form");
const welcomePreview = document.querySelector("#welcome-preview");
const welcomeStatus = document.querySelector("#welcome-status");
const welcomeCharacterCount = document.querySelector("#welcome-character-count");
const cancelWelcomeEditButton = document.querySelector("#cancel-welcome-edit");
const channelIntelligenceFilter = document.querySelector("#channel-intelligence-filter");
const channelIntelligenceSummary = document.querySelector("#channel-intelligence-summary");
const channelIntelligenceList = document.querySelector("#channel-intelligence-list");
const channelActionDrawer = document.querySelector("#channel-action-drawer");
const channelActionDrawerHealth = document.querySelector("#channel-action-drawer-health");
const channelActionDrawerTitle = document.querySelector("#channel-action-drawer-title");
const channelActionDrawerSummary = document.querySelector("#channel-action-drawer-summary");
const channelActionDrawerBody = document.querySelector("#channel-action-drawer-body");
const channelActionDrawerClose = document.querySelector("#channel-action-drawer-close");
const engagementWindowFilter = document.querySelector("#engagement-window-filter");
const engagementStatusFilter = document.querySelector("#engagement-status-filter");
const engagementEmptyState = document.querySelector("#engagement-empty-state");
const engagementTotal1h = document.querySelector("#engagement-total-1h");
const engagementTotal24h = document.querySelector("#engagement-total-24h");
const engagementTotal7d = document.querySelector("#engagement-total-7d");
const engagementActiveChannels = document.querySelector("#engagement-active-channels");
const engagementQuietChannels = document.querySelector("#engagement-quiet-channels");
const engagementHumanBot = document.querySelector("#engagement-human-bot");
const engagementTotal1hCard = document.querySelector("#engagement-total-1h-card");
const engagementTotal24hCard = document.querySelector("#engagement-total-24h-card");
const engagementTotal7dCard = document.querySelector("#engagement-total-7d-card");
const engagementActiveChannelsCard = document.querySelector("#engagement-active-channels-card");
const engagementQuietChannelsCard = document.querySelector("#engagement-quiet-channels-card");
const engagementHumanBotCard = document.querySelector("#engagement-human-bot-card");
const engagementTopChannels = document.querySelector("#engagement-top-channels");
const engagementTopUsers = document.querySelector("#engagement-top-users");
const engagementRecentActivity = document.querySelector("#engagement-recent-activity");
const engagementQuietList = document.querySelector("#engagement-quiet-list");
const contentOutcomesSourceFilter = document.querySelector("#content-outcomes-source-filter");
const contentOutcomesList = document.querySelector("#content-outcomes-list");
const opsRefreshDashboardButton = document.querySelector("#ops-refresh-dashboard");
const opsJumpChannelsButton = document.querySelector("#ops-jump-channels");
const opsJumpAccessButton = document.querySelector("#ops-jump-access");
const opsJumpFollowupsButton = document.querySelector("#ops-jump-followups");
const taskManageAutomationButton = document.querySelector("#task-manage-automation");
const taskPostNowButton = document.querySelector("#task-post-now");
const taskCommunityButton = document.querySelector("#task-community");
const taskRecentProblemsButton = document.querySelector("#task-recent-problems");
const taskSettingsButton = document.querySelector("#task-settings");
const communityOpenChannelSetupButton = document.querySelector("#community-open-channel-setup");
const settingsOpenChannelSetupButton = document.querySelector("#settings-open-channel-setup");
const missionRefreshDashboardButton = document.querySelector("#mission-refresh-dashboard");
const dailyBriefingHealth = document.querySelector("#daily-briefing-health");
const dailyBriefingGreeting = document.querySelector("#daily-briefing-greeting");
const dailyBriefingSummary = document.querySelector("#daily-briefing-summary");
const dailyBriefingGeneratedAt = document.querySelector("#daily-briefing-generated-at");
const dailyBriefingEmpty = document.querySelector("#daily-briefing-empty");
const dailyBriefingContent = document.querySelector("#daily-briefing-content");
const dailyBriefingHighlights = document.querySelector("#daily-briefing-highlights");
const dailyBriefingConcerns = document.querySelector("#daily-briefing-concerns");
const dailyBriefingRecommendations = document.querySelector("#daily-briefing-recommendations");
const dailyBriefingMetrics = document.querySelector("#daily-briefing-metrics");
const missionBriefingStatus = document.querySelector("#mission-briefing-status");
const missionBriefingTitle = document.querySelector("#mission-briefing-title");
const missionBriefingSummary = document.querySelector("#mission-briefing-summary");
const missionSystemHealth = document.querySelector("#mission-system-health");
const missionAutomationSummary = document.querySelector("#mission-automation-summary");
const missionOpportunityCount = document.querySelector("#mission-opportunity-count");
const missionProblemCount = document.querySelector("#mission-problem-count");
const missionProfileCount = document.querySelector("#mission-profile-count");
const missionProfileCompleteCount = document.querySelector("#mission-profile-complete-count");
const missionProfileIncompleteCount = document.querySelector("#mission-profile-incomplete-count");
const missionProfileMissingRoleCount = document.querySelector("#mission-profile-missing-role-count");
const missionNextActivity = document.querySelector("#mission-next-activity");
const missionActionCount = document.querySelector("#mission-action-count");
const missionActionList = document.querySelector("#mission-action-list");
const missionBackendOpportunityCount = document.querySelector("#mission-backend-opportunity-count");
const missionOpportunitiesList = document.querySelector("#mission-opportunities-list");
const opportunityActionDrawer = document.querySelector("#opportunity-action-drawer");
const opportunityActionDrawerPriority = document.querySelector("#opportunity-action-drawer-priority");
const opportunityActionDrawerTitle = document.querySelector("#opportunity-action-drawer-title");
const opportunityActionDrawerSummary = document.querySelector("#opportunity-action-drawer-summary");
const opportunityActionDrawerBody = document.querySelector("#opportunity-action-drawer-body");
const opportunityActionDrawerClose = document.querySelector("#opportunity-action-drawer-close");
const missionFoundCount = document.querySelector("#mission-found-count");
const missionFoundList = document.querySelector("#mission-found-list");
const missionChannelProfilesCount = document.querySelector("#mission-channel-profiles-count");
const missionChannelProfilesList = document.querySelector("#mission-channel-profiles-list");
const missionOpenChannelSetupButton = document.querySelector("#mission-open-channel-setup");
const channelSetupAssistant = document.querySelector("#channel-setup-assistant");
const channelSetupStatus = document.querySelector("#channel-setup-status");
const channelSetupForm = document.querySelector("#channel-setup-form");
const channelSetupChannel = document.querySelector("#channel-setup-channel");
const channelSetupChannelDetail = document.querySelector("#channel-setup-channel-detail");
const channelSetupPurpose = document.querySelector("#channel-setup-purpose");
const channelSetupAccessMode = document.querySelector("#channel-setup-access-mode");
const channelSetupAudience = document.querySelector("#channel-setup-audience");
const channelSetupTone = document.querySelector("#channel-setup-tone");
const channelSetupRoleField = document.querySelector("#channel-setup-role-field");
const channelSetupRole = document.querySelector("#channel-setup-role");
const channelSetupRoleDetail = document.querySelector("#channel-setup-role-detail");
const channelSetupContentTypes = Array.from(document.querySelectorAll("[name='preferredContentTypes']"));
const channelSetupTopic = document.querySelector("#channel-setup-topic");
const channelSetupNotes = document.querySelector("#channel-setup-notes");
const channelSetupSaveProfileButton = document.querySelector("#channel-setup-save-profile");
const channelSetupDeleteProfileButton = document.querySelector("#channel-setup-delete-profile");
const channelSetupPlan = document.querySelector("#channel-setup-plan");
const channelSetupOpenRolePanelButton = document.querySelector("#channel-setup-open-role-panel");
const channelSetupOpenFollowupsButton = document.querySelector("#channel-setup-open-followups");
const channelSetupOpenFeedsButton = document.querySelector("#channel-setup-open-feeds");
const channelSetupOpenGenerateButton = document.querySelector("#channel-setup-open-generate");
const channelSetupResetButton = document.querySelector("#channel-setup-reset");

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
const settingsPanel = document.querySelector("[data-tab-panel='settings']");
const settingsSummaryGrid = document.querySelector(".settings-summary-grid");
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
const composerDiscoveryNote = document.querySelector("#composer-discovery-note");
const composerTemplatesList = document.querySelector("#composer-templates-list");
const composerTemplateStatus = document.querySelector("#composer-template-status");
const manualPushForm = document.querySelector("#manual-push-form");
const manualPushStatus = document.querySelector("#manual-push-status");
const createPostScheduledPostsList = document.querySelector("#create-post-scheduled-posts-list");
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
const contentStudioModeButtons = Array.from(document.querySelectorAll(".content-studio-choice-area [data-content-studio-mode-target]"));
const contentStudioPanels = Array.from(document.querySelectorAll("[data-content-studio-panel]"));
const contentDiscoveryReviewPanel = document.querySelector("#content-discovery-review-panel");
const contentSourceLibrary = document.querySelector("#content-source-library");
const contentSourceLibraryProfileSelect = document.querySelector("#content-source-library-profile");
const contentSourceLibraryRecommendations = document.querySelector("#content-source-library-recommendations");
const contentSourceLibraryCategories = document.querySelector("#content-source-library-categories");
const contentSourceLibraryList = document.querySelector("#content-source-library-list");
const rssDiscoverySourcesList = document.querySelector("#rss-discovery-sources-list");
const advancedSourceSetup = document.querySelector(".advanced-source-setup");
const rssDiscoverySourceForm = document.querySelector("#rss-discovery-source-form");
const addRssDiscoverySourceButton = document.querySelector("#add-rss-discovery-source");
const addManualRssDiscoverySourceButton = document.querySelector("#add-manual-rss-discovery-source");
const refreshEnabledRssDiscoverySourcesButton = document.querySelector("#refresh-enabled-rss-discovery-sources");
const cancelRssDiscoverySourceButton = document.querySelector("#cancel-rss-discovery-source");
const deleteRssDiscoverySourceButton = document.querySelector("#delete-rss-discovery-source");
const rssDiscoverySourceStatus = document.querySelector("#rss-discovery-source-status");

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
const refreshEngagementButton = document.querySelector("#refresh-engagement");
const refreshHistoryReviewButton = document.querySelector("#refresh-history-review");
const rerollHistoryReviewButton = document.querySelector("#reroll-history-review");
const pushHistoryPreviewButton = document.querySelector("#push-history-preview");
const createFeedButton = document.querySelector("#create-feed");
const createFeedFromPostButton = document.querySelector("#create-feed-from-post");
const createFeedInlineButton = document.querySelector("#create-feed-inline");
const configureDailyTriviaButton = document.querySelector("#configure-daily-trivia");
const configureDailyTriviaInlineButton = document.querySelector("#configure-daily-trivia-inline");
const createRoleAccessPanelButton = document.querySelector("#create-role-access-panel");
const createRoleFollowupButton = document.querySelector("#create-role-followup");
const resetSettingsButton = document.querySelector("#reset-settings");
const resetFeedFormButton = document.querySelector("#reset-feed-form");
const resetDailyTriviaFormButton = document.querySelector("#reset-daily-trivia-form");
const resetRoleAccessPanelFormButton = document.querySelector("#reset-role-access-panel-form");
const postRoleAccessPanelFormButton = document.querySelector("#post-role-access-panel-form");
const resetRoleFollowupFormButton = document.querySelector("#reset-role-followup-form");
const deleteRoleFollowupFormButton = document.querySelector("#delete-role-followup-form");
const saveComposerDraftButton = document.querySelector("#save-composer-draft");
const clearComposerButton = document.querySelector("#clear-composer");
const undoComposerRewriteButton = document.querySelector("#undo-composer-rewrite");
const saveComposerTemplateButton = document.querySelector("#save-composer-template");

const apiBaseUrlStorageKey = "cdawg-dashboard-api-base-url";
const apiTokenStorageKey = "cdawg-dashboard-api-token";
const autoRefreshStorageKey = "cdawg-dashboard-auto-refresh-enabled";
const composerDraftStorageKey = "cdawg-dashboard-composer-draft";
const mockDiscoveryStorageKey = "cdawg-dashboard-show-mock-discovery";
const autoRefreshIntervalMs = 15000;
const palworldServerInfoReminder =
  "**Palworld 1.0 launch reminder**\n\nIf you're joining us, check the server info channel before logging in so you have the current connection details, rules, and launch-week notes. Drop questions here and I will help keep everyone pointed in the right direction.";
const palworldJoiningPrompt =
  "**Palworld launch check-in**\n\nWhich server are you joining for 1.0, and what are you working on first: base building, exploration, boss prep, breeding, or helping new players get settled?";

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
let welcomeSettings = null;
let welcomePreviewMessage = "";
let welcomeLoadError = null;
let composerTemplates = [];
let channelProfiles = [];
let channelIntelligence = null;
let channelIntelligenceLoadError = null;
let engagementSummary = null;
let engagementSummaryLoadError = null;
let contentOutcomes = [];
let contentOutcomesLoadError = null;
let backendOpportunities = [];
let backendOpportunitiesLoadError = null;
let dailyBriefing = null;
let dailyBriefingLoadError = null;
let activeChannelActionChannelId = null;
let activeOpportunityId = null;
let activeOpportunityContext = null;
let discoverySources = [];
let discoverySourcesLoadError = null;
let discoveryItems = [];
let discoveryItemsLoadError = null;
let activeControlTab = "overview";
let activeContentStudioMode = "write";
let activeContentSourceLibraryCategory = "Recommended";
let activeDiscoveryQueueFilter = "new";
let selectedDiscoveryCardId = null;
let activePreparedDiscoveryItemId = null;
let composerDraftBeforeRewrite = null;

const channelSetupPurposeProfiles = {
  genealogy: {
    label: "Genealogy",
    contentTypes: ["history", "fact", "prompt"],
    starter: "What family story, record, or research mystery are you working on this week?",
  },
  gaming: {
    label: "Gaming",
    contentTypes: ["joke", "prompt", "trivia"],
    starter: "What are you playing right now, and what should the group try next?",
  },
  sports: {
    label: "Sports",
    contentTypes: ["prompt", "trivia", "fact"],
    starter: "What matchup, player, or sports story should everyone be watching this week?",
  },
  news: {
    label: "News",
    contentTypes: ["fact", "prompt"],
    starter: "What story is worth discussing today, and what context would help people understand it?",
  },
  science: {
    label: "Science",
    contentTypes: ["fact", "trivia", "prompt"],
    starter: "What discovery, mission, or science question should the community explore today?",
  },
  history: {
    label: "History",
    contentTypes: ["history", "fact", "prompt"],
    starter: "What moment in history still feels relevant to this community today?",
  },
  memes: {
    label: "Memes",
    contentTypes: ["joke", "wyr", "prompt"],
    starter: "Drop the meme that best describes your week so far.",
  },
  "general-chat": {
    label: "General Chat",
    contentTypes: ["wyr", "prompt", "joke"],
    starter: "What is one small win or random thought from your day?",
  },
  custom: {
    label: "Custom",
    contentTypes: ["prompt"],
    starter: "What should this channel help people talk about first?",
  },
};

const channelSetupAccessLabels = {
  everyone: "Everyone can see it",
  "opt-in": "People opt in with a role",
  private: "Private/admin managed",
  announcement: "Announcement-only",
  unsure: "Not sure yet",
};

const channelSetupAudienceLabels = {
  everyone: "Everyone",
  members: "Members",
  "role-members": "Role members",
  admins: "Admins",
  custom: "Custom",
};

const channelSetupToneLabels = {
  friendly: "Friendly",
  informational: "Informational",
  playful: "Playful",
  serious: "Serious",
  supportive: "Supportive",
  custom: "Custom",
};

const allowedChannelSetupTopics = new Set(["general", "palworld", "history", "genealogy", "science", "pokemon", "harry-potter", "true-crime", "music", "valheim"]);
const contentSourceCatalogCategories = ["History", "Genealogy", "Gaming", "Sports", "Technology", "Science", "Movies", "Music", "News", "Finance"];
const contentSourceLibraryCatalog = [
  {
    name: "Library of Congress Blog",
    description: "Primary-source stories, collections, and historical context from the Library of Congress.",
    rssUrl: "https://blogs.loc.gov/loc/feed/",
    category: "History",
    sourceBadge: "Institution",
    healthStatus: "Working",
  },
  {
    name: "The Legal Genealogist",
    description: "Genealogy research context, record interpretation, and family history methodology.",
    rssUrl: "https://www.legalgenealogist.com/feed/",
    category: "Genealogy",
    sourceBadge: "Research",
    healthStatus: "Working",
  },
  {
    name: "PC Gamer",
    description: "PC gaming news, reviews, hardware, and culture coverage for community discussion.",
    rssUrl: "https://www.pcgamer.com/rss/",
    category: "Gaming",
    sourceBadge: "Gaming",
    healthStatus: "Working",
  },
  {
    name: "ESPN Top Headlines",
    description: "Sports headlines and storylines that can seed matchup and player conversations.",
    rssUrl: "https://www.espn.com/espn/rss/news",
    category: "Sports",
    sourceBadge: "Sports",
    healthStatus: "Working",
  },
  {
    name: "Ars Technica",
    description: "Technology news and analysis with enough depth for informed community prompts.",
    rssUrl: "https://feeds.arstechnica.com/arstechnica/index",
    category: "Technology",
    sourceBadge: "Tech",
    healthStatus: "Working",
  },
  {
    name: "NASA News",
    description: "Science and space updates from NASA for factual posts and conversation starters.",
    rssUrl: "https://www.nasa.gov/news-release/feed/",
    category: "Science",
    sourceBadge: "Science",
    healthStatus: "Working",
  },
  {
    name: "RogerEbert.com",
    description: "Movie reviews and film essays for watchlist, review, and discussion prompts.",
    rssUrl: "https://www.rogerebert.com/feed",
    category: "Movies",
    sourceBadge: "Film",
    healthStatus: "Working",
  },
  {
    name: "Pitchfork News",
    description: "Music news, releases, and artist updates for entertainment-focused channels.",
    rssUrl: "https://pitchfork.com/feed/feed-news/rss",
    category: "Music",
    sourceBadge: "Music",
    healthStatus: "Working",
  },
  {
    name: "BBC News",
    description: "Broad news headlines for discussion prompts that still require review before use.",
    rssUrl: "https://feeds.bbci.co.uk/news/rss.xml",
    category: "News",
    sourceBadge: "News",
    healthStatus: "Working",
  },
  {
    name: "CNBC Finance",
    description: "Finance headlines and market stories for money and business discussion channels.",
    rssUrl: "https://www.cnbc.com/id/10000664/device/rss/rss.html",
    category: "Finance",
    sourceBadge: "Finance",
    healthStatus: "Working",
  },
];

const contentSourceCategoryRecommendationsByPurpose = {
  genealogy: ["Genealogy", "History", "News"],
  history: ["History", "Genealogy", "Science"],
  science: ["Science", "Technology", "News"],
  gaming: ["Gaming", "Technology", "Movies"],
  sports: ["Sports", "News", "Finance"],
  news: ["News", "Technology", "Finance"],
  memes: ["Gaming", "Movies", "Music"],
  "general-chat": ["News", "Music", "Movies"],
  custom: ["News", "Technology", "Science"],
};

const savedApiBaseUrl = window.localStorage.getItem(apiBaseUrlStorageKey);
const savedApiToken = window.localStorage.getItem(apiTokenStorageKey);
const savedAutoRefresh = window.localStorage.getItem(autoRefreshStorageKey);

apiBaseUrlInput.value = savedApiBaseUrl || getDefaultApiBaseUrl();
apiTokenInput.value = savedApiToken || "";

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

function getApiToken() {
  return apiTokenInput.value.trim();
}

function resetApiBaseUrl() {
  window.localStorage.removeItem(apiBaseUrlStorageKey);
  window.localStorage.removeItem(apiTokenStorageKey);
  apiBaseUrlInput.value = getDefaultApiBaseUrl();
  apiTokenInput.value = "";
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

function setWelcomeStatus(message, kind = "neutral") {
  if (!welcomeStatus) {
    return;
  }

  welcomeStatus.textContent = message;
  welcomeStatus.style.color =
    kind === "error" ? "#b42318" : kind === "success" ? "#137333" : "#5b6b7d";
}

function setActivePreparedDiscoveryItem(itemId) {
  activePreparedDiscoveryItemId = itemId || null;
  if (composerDiscoveryNote) {
    composerDiscoveryNote.hidden = !activePreparedDiscoveryItemId;
  }
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

  automationMasterBadge.textContent = `Automatic Posting: ${enabled ? "ON" : "OFF"}`;
  automationMasterBadge.className = `status-badge ${enabled ? "active" : "blocked"} automation-master-badge`;
  automationMasterButton.textContent = enabled ? "Turn Automatic Posting OFF" : "Turn Automatic Posting ON";
  automationMasterButton.className = enabled ? "secondary" : "";
  automationMasterDetail.textContent = enabled
    ? "Automatic posting is allowed globally. Channel-level controls still apply."
    : "Scheduled posts and background chat replies are disabled globally. Manual posting actions remain available.";

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
    ? "ON - scheduled posts and background chat replies may run"
    : "OFF - scheduled posts and background chat replies blocked";
  settingsSummaryAutomation.className = masterEnabled ? "settings-summary-value ok" : "settings-summary-value blocked";

  settingsSummaryPassive.textContent = passiveEnabled ? "ON - automatic chat replies may be considered" : "OFF - automatic chat replies disabled";
  settingsSummaryPassive.className = passiveEnabled ? "settings-summary-value ok" : "settings-summary-value neutral";

  settingsSummaryProvider.textContent = getActiveProviderSummary();
  settingsSummaryProvider.className = "settings-summary-value neutral";

  settingsSummaryApiUrl.textContent = apiBaseUrl;
  settingsSummaryApiUrl.className = "settings-summary-value neutral";

  settingsAutomationMasterState.textContent = masterEnabled ? "Automatic Posting ON" : "Automatic Posting OFF";
  settingsAutomationMasterState.className = `status-badge ${masterEnabled ? "active" : "blocked"}`;
  settingsAutomationMasterCopy.textContent = masterEnabled
    ? "Scheduled posts and background chat replies may run when channel-level controls allow them."
    : "Scheduled posts and background chat replies are blocked globally. Manual dashboard actions remain available.";

  settingsApiUrlDetail.textContent = apiBaseUrl;
  settingsAutoRefreshDetail.textContent = autoRefreshEnabledInput.checked ? "On" : "Off";

  if (providerLoggingEnabled) {
    settingsSummaryProvider.title = "Diagnostics logging is enabled.";
  } else {
    settingsSummaryProvider.title = "Diagnostics logging is disabled.";
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
    option.textContent = "No saved channels available";
    targetSelect.append(option);
  }

  const hasPreviousValue = channelPresets.some((preset) => preset.channelId === previousValue);
  targetSelect.value = hasPreviousValue ? previousValue : channelPresets[0]?.channelId ?? "";
}

function getRoleLabel(roleId) {
  const role = guildRoles.find((entry) => entry.id === roleId);
  return role ? role.name : roleId ? "Role not found" : "not set";
}

function getChannelLabel(channelId) {
  const channel = guildChannels.find((entry) => entry.id === channelId);
  return channel ? `#${channel.name}` : channelId ? "Channel not found" : "not set";
}

function getDetailedRoleLabel(roleId) {
  const role = guildRoles.find((entry) => entry.id === roleId);
  return role ? role.name : roleId ? "Role not found" : "not set";
}

function getDetailedChannelLabel(channelId, emptyLabel = "choose when posting") {
  if (!channelId) {
    return emptyLabel;
  }

  const channel = guildChannels.find((entry) => entry.id === channelId);
  return channel ? `#${channel.name}` : "Channel not found";
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
  renderWelcomePreview();
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
    return;
  }

  if (select.form === welcomeForm) {
    syncDiscordMetadataSelections();
    renderWelcomePreview();
    console.debug("[discord-metadata] welcome preview rendered");
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
    manualPushChannelMeta.textContent = "Choose where this post will appear.";
    return;
  }

  manualPushChannelMeta.textContent = `Destination: ${selectedPreset.label ?? getChannelLabel(selectedPreset.channelId)}`;

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

function getWelcomeFormValue() {
  const manualChannelId = welcomeForm.elements.manualWelcomeChannelId.value.trim();
  return {
    enabled: welcomeForm.elements.enabled.value === "true",
    welcomeChannelId: manualChannelId || welcomeForm.elements.welcomeChannelId.value.trim(),
    messageTemplate: welcomeForm.elements.messageTemplate.value,
  };
}

function renderWelcomeTemplate(template, settings = welcomeSettings) {
  const nextSettings = settings || {};
  const replyChannelMention = nextSettings.replyChannelMention || "#rules";
  const replyChannelLabel = String(replyChannelMention).replace(/<#(\d{17,20})>/g, (_match, channelId) => getChannelLabel(channelId));
  return String(template || "")
    .replace(/\{member\}/g, "@NewMember")
    .replace(/\{server\}/g, nextSettings.serverLabel || "this Discord")
    .replace(/\{games\}/g, Array.isArray(nextSettings.availableGames) ? nextSettings.availableGames.join(" and ") : "the current games")
    .replace(/\{replyChannel\}/g, replyChannelLabel);
}

function updateWelcomeCharacterCount() {
  if (!welcomeCharacterCount || !welcomeForm) {
    return;
  }

  const messageLength = welcomeForm.elements.messageTemplate.value.length;
  welcomeCharacterCount.textContent = `${messageLength} / 2000 characters`;
  welcomeCharacterCount.style.color = messageLength > 2000 ? "#b42318" : "#74859a";
}

function renderWelcomePreview() {
  if (!welcomePreview || !welcomeForm) {
    return;
  }

  const formValue = getWelcomeFormValue();
  const message = renderWelcomeTemplate(formValue.messageTemplate || "Your welcome preview will appear here.");
  const destination = getDetailedChannelLabel(formValue.welcomeChannelId, "choose a destination channel");
  const header = document.createElement("div");
  const previewMessage = document.createElement("div");
  const author = document.createElement("div");
  const body = document.createElement("p");
  const context = document.createElement("div");
  const destinationContext = document.createElement("p");
  const statusContext = document.createElement("p");

  welcomePreview.replaceChildren();
  header.className = "discord-panel-preview-header";
  header.textContent = "Preview";
  previewMessage.className = "composer-preview-message";
  author.className = "composer-preview-author";
  author.textContent = "Cdawg Bot";
  body.className = "composer-preview-body";
  body.textContent = message;
  context.className = "discord-panel-preview-context";
  destinationContext.textContent = `Destination channel: ${destination}`;
  statusContext.textContent = `Status: ${formValue.enabled ? "On" : "Off"}`;
  previewMessage.append(author, body);
  context.append(destinationContext, statusContext);
  welcomePreview.append(header, previewMessage, context);
  updateWelcomeCharacterCount();
}

function applyWelcomeSettingsToForm() {
  if (!welcomeForm || !welcomeSettings) {
    return;
  }

  welcomeForm.elements.enabled.value = String(welcomeSettings.enabled);
  welcomeForm.elements.welcomeChannelId.value = welcomeSettings.welcomeChannelId || "";
  welcomeForm.elements.manualWelcomeChannelId.value = "";
  welcomeForm.elements.messageTemplate.value = welcomeSettings.messageTemplate || "";
  syncDiscordMetadataSelections();
  renderWelcomePreview();
}

function renderWelcomeSummary() {
  if (!welcomeSummaryStatus || !welcomeSummaryChannel) {
    return;
  }

  if (welcomeLoadError) {
    welcomeSummaryStatus.textContent = "Unavailable";
    welcomeSummaryStatus.className = "status-badge blocked";
    welcomeSummaryChannel.textContent = welcomeLoadError;
    return;
  }

  if (!welcomeSettings) {
    welcomeSummaryStatus.textContent = "Loading";
    welcomeSummaryStatus.className = "status-badge neutral";
    welcomeSummaryChannel.textContent = "Checking destination...";
    return;
  }

  welcomeSummaryStatus.textContent = welcomeSettings.enabled ? "On" : "Off";
  welcomeSummaryStatus.className = `status-badge ${welcomeSettings.enabled ? "active" : "neutral"}`;
  welcomeSummaryChannel.textContent = `Destination channel: ${getDetailedChannelLabel(welcomeSettings.welcomeChannelId, "not set")}`;
}

function openWelcomeEditor() {
  if (!welcomeForm) {
    return;
  }

  applyWelcomeSettingsToForm();
  welcomeForm.hidden = false;
  setWelcomeStatus("Review changes before saving.");
  window.requestAnimationFrame(() => {
    welcomeForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function closeWelcomeEditor() {
  if (!welcomeForm) {
    return;
  }

  applyWelcomeSettingsToForm();
  welcomeForm.hidden = true;
  setWelcomeStatus("");
}

function insertIntoWelcomeMessage(text) {
  const textarea = welcomeForm.elements.messageTemplate;
  const currentValue = textarea.value;
  const selectionStart = typeof textarea.selectionStart === "number" ? textarea.selectionStart : currentValue.length;
  const selectionEnd = typeof textarea.selectionEnd === "number" ? textarea.selectionEnd : currentValue.length;
  const nextValue = `${currentValue.slice(0, selectionStart)}${text}${currentValue.slice(selectionEnd)}`;
  const nextCursor = selectionStart + text.length;

  textarea.value = nextValue.slice(0, 2000);
  textarea.focus();
  textarea.setSelectionRange(Math.min(nextCursor, textarea.value.length), Math.min(nextCursor, textarea.value.length));
  renderWelcomePreview();
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
  setActivePreparedDiscoveryItem(null);
  window.localStorage.removeItem(composerDraftStorageKey);
  composerOutput.textContent = "No message request yet.";
  setComposerStatus("Message cleared.");
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
    composerOutput.textContent = `Message rewrite failed.\n${error.message}`;
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
    emptyTitle.textContent = "No saved messages";
    emptyCopy.className = "channel-operation-detail";
    emptyCopy.textContent = "Save the current message draft as a named template to reuse it later.";
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
    setComposerTemplateStatus("Saved message saved.", "success");
  } catch (error) {
    setComposerTemplateStatus(`Save failed: ${error.message}`, "error");
  }
}

async function deleteComposerTemplate(templateId) {
  const template = composerTemplates.find((entry) => entry.id === templateId);

  if (!window.confirm(`Delete saved message template "${template?.name ?? templateId}"?`)) {
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
    setComposerTemplateStatus("Saved message deleted.", "success");
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
    return "Saved message name is required.";
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
    warnings.push("The selected role was not found in the current Discord role list.");
  }

  if (channelId && !metadataHasChannel(channelId)) {
    warnings.push("The selected channel was not found in the current Discord channel list.");
  }

  return warnings;
}

function hasMissingRole(roleId) {
  return !roleId || (guildMetadataLoaded && !metadataHasRole(roleId));
}

function hasMissingChannel(channelId) {
  return !channelId || (guildMetadataLoaded && !metadataHasChannel(channelId));
}

function renderCommunityHealth() {
  const panelsMissingRoleCount = roleAccessPanels.filter((panel) => hasMissingRole(panel.roleId)).length;
  const panelsMissingChannelCount = roleAccessPanels.filter((panel) => hasMissingChannel(panel.targetChannelId)).length;
  const followupsMissingRoleCount = roleFollowups.filter((followup) => hasMissingRole(followup.roleId)).length;
  const followupsMissingChannelCount = roleFollowups.filter((followup) => hasMissingChannel(followup.channelId)).length;
  const missingRoleCount = panelsMissingRoleCount + followupsMissingRoleCount;
  const missingChannelCount = panelsMissingChannelCount + followupsMissingChannelCount;

  setOpsValue(communityTotalPanels, roleAccessPanels.length);
  setOpsCardState(communityTotalPanelsCard, roleAccessPanels.length > 0 ? "ok" : "neutral");
  setOpsValue(communityTotalFollowups, roleFollowups.length);
  setOpsCardState(communityTotalFollowupsCard, roleFollowups.length > 0 ? "ok" : "neutral");
  setOpsValue(communityMissingRole, missingRoleCount);
  setOpsCardState(communityMissingRoleCard, getCountTone(missingRoleCount));
  setOpsValue(communityMissingChannel, missingChannelCount);
  setOpsCardState(communityMissingChannelCard, getCountTone(missingChannelCount));
  renderCommunityFollowupNeeds();
  renderCommunityRecognition();
}

function createCommunityOwnerItem(titleText, detailText, options = {}) {
  const item = document.createElement("article");
  const copy = document.createElement("div");
  const title = document.createElement("h3");
  const detail = document.createElement("p");

  item.className = `community-owner-item ${options.tone ?? "neutral"}`;
  copy.className = "community-owner-item-copy";
  title.textContent = titleText;
  detail.className = "channel-operation-detail";
  detail.textContent = detailText;
  copy.append(title, detail);
  item.append(copy);

  if (options.badge) {
    item.append(createStatusBadge(options.badge, options.badgeTone ?? options.tone ?? "neutral"));
  }

  if (options.actionLabel && options.onAction) {
    const action = document.createElement("button");
    action.type = "button";
    action.className = "secondary";
    action.textContent = options.actionLabel;
    action.addEventListener("click", options.onAction);
    item.append(action);
  }

  return item;
}

function renderCommunityFollowupNeeds() {
  if (!communityFollowupList) {
    return;
  }

  const items = [];
  const panelsMissingRole = roleAccessPanels.filter((panel) => hasMissingRole(panel.roleId));
  const panelsMissingChannel = roleAccessPanels.filter((panel) => hasMissingChannel(panel.targetChannelId));
  const inactivePanels = roleAccessPanels.filter((panel) => panel.active === false);
  const followupsMissingRole = roleFollowups.filter((followup) => hasMissingRole(followup.roleId));
  const followupsMissingChannel = roleFollowups.filter((followup) => hasMissingChannel(followup.channelId));
  const disabledFollowups = roleFollowups.filter((followup) => followup.enabled === false);

  if (!guildMetadataLoaded) {
    items.push(createCommunityOwnerItem(
      "Role and channel list is unavailable",
      "The dashboard can still show saved setup, but it cannot confirm whether roles and channels exist right now.",
      { tone: "neutral", badge: "check connection", actionLabel: "Refresh", onAction: () => void loadGuildMetadata() },
    ));
  }

  if (panelsMissingRole.length > 0 || panelsMissingChannel.length > 0) {
    items.push(createCommunityOwnerItem(
      "A role selection needs setup",
      "At least one role selection is missing the role or channel it needs before members can rely on it.",
      { tone: "blocked", badge: "needs action", actionLabel: "Review access setup", onAction: () => navigateMissionAction(createMissionNavigation("access", "community-role-signup-buttons")) },
    ));
  }

  if (followupsMissingRole.length > 0 || followupsMissingChannel.length > 0) {
    items.push(createCommunityOwnerItem(
      "An access follow-up needs setup",
      "At least one follow-up message is missing the role or channel it needs before it can send correctly.",
      { tone: "blocked", badge: "needs action", actionLabel: "Edit follow-up message", onAction: () => navigateMissionAction(createMissionNavigation("access", "community-role-followups")) },
    ));
  }

  if (inactivePanels.length > 0) {
    items.push(createCommunityOwnerItem(
      "A role selection is saved but inactive",
      "Members can only use active role selection buttons.",
      { tone: "neutral", badge: "review", actionLabel: "Review access setup", onAction: () => navigateMissionAction(createMissionNavigation("access", "community-role-signup-buttons")) },
    ));
  }

  if (disabledFollowups.length > 0) {
    items.push(createCommunityOwnerItem(
      "An access follow-up is turned off",
      "The follow-up is saved, but it will not post when someone receives the role.",
      { tone: "neutral", badge: "review", actionLabel: "Edit follow-up message", onAction: () => navigateMissionAction(createMissionNavigation("access", "community-role-followups")) },
    ));
  }

  communityFollowupList.replaceChildren();
  if (items.length === 0) {
    communityFollowupList.append(createCommunityOwnerItem(
      "No follow-up needs found",
      "Saved role selections and access follow-ups do not show setup problems in the currently loaded data.",
      { tone: "active", badge: "clear" },
    ));
    return;
  }

  communityFollowupList.append(...items);
}

function getCommunityActivityWindowKey() {
  return communityActivityWindow?.value || "last24h";
}

function getCommunityActivityStatus(row) {
  if (row.status === "active") {
    return "Conversation is active";
  }

  if (row.status === "quiet") {
    return "Quiet today";
  }

  if (row.status === "dormant") {
    return "Quiet recently";
  }

  return "Activity not clear yet";
}

function renderCommunityActivity() {
  if (!communityActivitySummary || !communityActiveChannels) {
    return;
  }

  const windowKey = getCommunityActivityWindowKey();
  const rows = getEngagementRows(windowKey)
    .filter((row) => Number(row.messageCount) > 0 || row.lastKnownActivityAt)
    .sort((left, right) => (right.messageCount - left.messageCount) || ((right.lastKnownActivityAt ?? 0) - (left.lastKnownActivityAt ?? 0)));
  const totalMessages = rows.reduce((total, row) => total + (Number(row.messageCount) || 0), 0);
  const activeCount = rows.filter((row) => row.status === "active").length;

  communityActivitySummary.replaceChildren();
  communityActiveChannels.replaceChildren();

  if (engagementSummaryLoadError) {
    communityActivitySummary.append(createCommunityOwnerItem(
      "Community activity is unavailable",
      engagementSummaryLoadError,
      { tone: "blocked", badge: "unavailable" },
    ));
    return;
  }

  if (rows.length === 0) {
    communityActivitySummary.append(createCommunityOwnerItem(
      "No recent activity has been recorded",
      "Recent Discord activity will appear here after the bot is connected and messages are observed.",
      { tone: "neutral", badge: "waiting" },
    ));
    return;
  }

  communityActivitySummary.append(createCommunityOwnerItem(
    activeCount > 0 ? "Conversation is active" : "Community is quiet right now",
    `${totalMessages} message${totalMessages === 1 ? "" : "s"} across ${rows.length} channel${rows.length === 1 ? "" : "s"} in the selected window.`,
    { tone: activeCount > 0 ? "active" : "neutral", badge: activeCount > 0 ? "active" : "quiet" },
  ));

  for (const row of rows.slice(0, 6)) {
    communityActiveChannels.append(createCommunityOwnerItem(
      `#${getEngagementChannelName(row.channelId, row.channelName)}`,
      `${getCommunityActivityStatus(row)}. ${row.messageCount} message${row.messageCount === 1 ? "" : "s"}; about ${row.approxActiveUsers} active participant${row.approxActiveUsers === 1 ? "" : "s"}.`,
      { tone: row.status === "active" ? "active" : "neutral", badge: getCommunityActivityStatus(row) },
    ));
  }
}

function renderCommunityRecognition() {
  if (!communityRecognitionSummary) {
    return;
  }

  communityRecognitionSummary.replaceChildren();

  if (dailyTriviaChallenge?.latestSession?.winnerUserId) {
    communityRecognitionSummary.append(createCommunityOwnerItem(
      "Daily Trivia has a recent winner",
      "A winner was recorded in the latest trivia session. Use the Daily Trivia controls for the full session state.",
      { tone: "active", badge: "recognition", actionLabel: "Review Daily Trivia", onAction: () => navigateMissionAction(createMissionNavigation("channels", "automation-daily-trivia")) },
    ));
  } else if (dailyTriviaChallenge?.enabled === true) {
    communityRecognitionSummary.append(createCommunityOwnerItem(
      "Daily Trivia is ready for recognition",
      "Trivia can recognize participation when members answer challenges.",
      { tone: "active", badge: "enabled", actionLabel: "Review Daily Trivia", onAction: () => navigateMissionAction(createMissionNavigation("channels", "automation-daily-trivia")) },
    ));
  }

  if (dogSystemEnabled && dogState) {
    communityRecognitionSummary.append(createCommunityOwnerItem(
      "Community game is tracking participation",
      "The community game can award XP when members interact with it.",
      { tone: "active", badge: "XP available", actionLabel: "Review Community Game", onAction: () => navigateMissionAction(createMissionNavigation("channels", "automation-community-game")) },
    ));
  }

  if (communityRecognitionSummary.children.length === 0) {
    communityRecognitionSummary.append(createCommunityOwnerItem(
      "Recognition data is limited",
      "The dashboard does not currently have a member leaderboard feed. XP leaderboard and admin changes remain available through Discord commands.",
      { tone: "neutral", badge: "limited data" },
    ));
  }
}

function getEngagementWindowKey() {
  return engagementWindowFilter?.value || "last24h";
}

function getEngagementWindowLabel(windowKey = getEngagementWindowKey()) {
  if (windowKey === "last1h") {
    return "1h";
  }

  if (windowKey === "last7d") {
    return "7d";
  }

  return "24h";
}

function getEngagementWindowItems(windowKey = getEngagementWindowKey()) {
  const windows = engagementSummary?.windows;
  const items = windows?.[windowKey];
  return Array.isArray(items) ? items : [];
}

function getTotalMessagesForEngagementWindow(windowKey) {
  return getEngagementWindowItems(windowKey).reduce((total, item) => total + (Number(item.messageCount) || 0), 0);
}

function getEngagementStatus(summary, windowKey = getEngagementWindowKey()) {
  const messageCount = Number(summary?.messageCount) || 0;
  const activeUsers = Number(summary?.approxActiveUsers) || 0;

  if (messageCount >= 10 || activeUsers >= 3) {
    return "active";
  }

  if (messageCount > 0) {
    return "quiet";
  }

  const last7dSummary = getEngagementWindowItems("last7d").find((item) => item.channelId === summary?.channelId);
  if (windowKey !== "last7d" && (Number(last7dSummary?.messageCount) || 0) > 0) {
    return "dormant";
  }

  return "unknown";
}

function getEngagementChannelName(channelId, fallbackName) {
  if (fallbackName) {
    return fallbackName;
  }

  const intelligenceChannel = (channelIntelligence?.channels ?? []).find((channel) => channel.channelId === channelId);
  if (intelligenceChannel?.channelName) {
    return intelligenceChannel.channelName;
  }

  const metadataChannel = guildChannels.find((channel) => channel.id === channelId);
  return metadataChannel?.name ?? "channel name unavailable";
}

function getKnownEngagementChannelIds() {
  const channelIds = new Set();

  for (const windowItems of Object.values(engagementSummary?.windows ?? {})) {
    if (!Array.isArray(windowItems)) {
      continue;
    }

    for (const item of windowItems) {
      if (item.channelId) {
        channelIds.add(item.channelId);
      }
    }
  }

  for (const channel of channelIntelligence?.channels ?? []) {
    if (channel.channelId) {
      channelIds.add(channel.channelId);
    }
  }

  for (const channel of guildChannels) {
    if (channel.id) {
      channelIds.add(channel.id);
    }
  }

  return [...channelIds];
}

function getEngagementRows(windowKey = getEngagementWindowKey()) {
  const selectedWindowByChannel = new Map(getEngagementWindowItems(windowKey).map((item) => [item.channelId, item]));
  const last7dByChannel = new Map(getEngagementWindowItems("last7d").map((item) => [item.channelId, item]));

  return getKnownEngagementChannelIds().map((channelId) => {
    const selectedSummary = selectedWindowByChannel.get(channelId) ?? null;
    const last7dSummary = last7dByChannel.get(channelId) ?? null;
    const baseSummary = selectedSummary ?? {
      channelId,
      channelName: last7dSummary?.channelName ?? null,
      messageCount: 0,
      approxActiveUsers: 0,
      botMessageCount: 0,
      attachmentOrEmbedCount: 0,
      lastActivityAt: null,
    };

    return {
      ...baseSummary,
      channelName: getEngagementChannelName(channelId, baseSummary.channelName ?? last7dSummary?.channelName),
      humanMessageCount: Math.max(0, (Number(baseSummary.messageCount) || 0) - (Number(baseSummary.botMessageCount) || 0)),
      status: getEngagementStatus(baseSummary, windowKey),
      last7dMessageCount: Number(last7dSummary?.messageCount) || 0,
      lastKnownActivityAt: Math.max(Number(baseSummary.lastActivityAt) || 0, Number(last7dSummary?.lastActivityAt) || 0) || null,
    };
  });
}

function getFilteredEngagementRows() {
  const statusFilter = engagementStatusFilter?.value ?? "all";
  const rows = getEngagementRows();

  if (statusFilter === "all") {
    return rows;
  }

  return rows.filter((row) => row.status === statusFilter);
}

function renderEngagementChannelList(target, rows, metricLabel, getMetricValue, emptyCopy) {
  if (!target) {
    return;
  }

  target.replaceChildren();

  if (rows.length === 0) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty compact-empty";
    empty.textContent = emptyCopy;
    target.append(empty);
    return;
  }

  for (const row of rows.slice(0, 8)) {
    const item = document.createElement("article");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const meta = document.createElement("span");
    const value = document.createElement("span");

    item.className = "engagement-channel-row";
    item.dataset.engagementChannelId = row.channelId;
    copy.className = "engagement-channel-row-copy";
    value.className = "engagement-channel-row-value";
    title.textContent = `#${row.channelName}`;
    meta.textContent = `${row.status} • ${formatRelativeTime(row.lastKnownActivityAt)}`;
    value.textContent = `${getMetricValue(row)} ${metricLabel}`;
    copy.append(title, meta);
    item.append(copy, value);
    target.append(item);
  }
}

function getContentOutcomeTone(label) {
  if (label === "sparked") {
    return "active";
  }

  if (label === "no response") {
    return "blocked";
  }

  return "neutral";
}

function getContentOutcomeSourceLabel(source) {
  const labels = {
    scheduler: "Scheduled post",
    feed: "Automatic content source",
    dailyTrivia: "Daily Trivia",
    passiveChat: "Chat reply",
    manualPush: "Post Now",
    composer: "Written post",
    historyPush: "History post",
    unknown: "Unknown",
  };

  return labels[source] ?? "Unknown";
}

function getContentOutcomeActivityLabel(activity = {}) {
  const humanMessages = Number(activity.humanMessages60m ?? activity.messages60m ?? 0);
  const activeUsers = Number(activity.approxActiveUsers60m ?? 0);

  if (humanMessages >= 3 || activeUsers >= 2) {
    return "Started conversation";
  }

  if (humanMessages > 0) {
    return "Received replies";
  }

  return "No follow-up activity yet";
}

function getFilteredContentOutcomes() {
  const sourceFilter = contentOutcomesSourceFilter?.value ?? "all";

  if (sourceFilter === "all") {
    return contentOutcomes;
  }

  return contentOutcomes.filter((item) => item.source === sourceFilter);
}

function createContentOutcomeCard(item) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const titleBlock = document.createElement("div");
  const title = document.createElement("strong");
  const meta = document.createElement("p");
  const badges = document.createElement("div");
  const stats = document.createElement("dl");
  const activity = item.activity ?? {};
  const channelName = item.channelName ? `#${item.channelName}` : getChannelLabel(item.channelId) || "channel unavailable";

  card.className = "content-outcome-card";
  header.className = "content-outcome-card-header";
  titleBlock.className = "content-outcome-title";
  badges.className = "channel-operation-badges";
  stats.className = "content-outcome-stats";

  title.textContent = item.label || `${getContentOutcomeSourceLabel(item.source)} post`;
  meta.textContent = `${channelName} • ${formatTimestamp(item.postedAt)} (${formatRelativeTime(item.postedAt)})`;
  badges.append(
    createStatusBadge(getContentOutcomeActivityLabel(activity), getContentOutcomeTone(activity.outcomeLabel)),
    createStatusBadge(getContentOutcomeSourceLabel(item.source), "neutral"),
    createStatusBadge(item.contentType || "content", "neutral"),
  );

  for (const [term, value] of [
    ["Replies in first 15 min", activity.messages15m ?? 0],
    ["Follow-up messages", activity.humanMessages60m ?? activity.messages60m ?? 0],
    ["Participants", activity.approxActiveUsers60m ?? 0],
    ["Bot follow-ups", activity.botMessages60m ?? 0],
  ]) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = String(value);
    stats.append(dt, dd);
  }

  titleBlock.append(title, meta);
  header.append(titleBlock, badges);
  card.append(header, stats);
  return card;
}

function getPalworldPreset() {
  return channelPresets.find((preset) => preset.defaultTopic === "palworld") ??
    channelPresets.find((preset) => /palworld/i.test(preset.label ?? ""));
}

function getPalworldChannelId() {
  return getPalworldPreset()?.channelId ?? null;
}

function getPalworldChannelLabel() {
  const preset = getPalworldPreset();
  return preset?.label ?? "Palworld channel";
}

function getPalworldAutomationStatus() {
  const channelId = getPalworldChannelId();
  return channelId ? channelAutomationStatuses.find((status) => status.channelId === channelId) ?? null : null;
}

function getPalworldEngagementWindow(windowKey) {
  const channelId = getPalworldChannelId();
  if (!channelId) {
    return null;
  }

  return engagementSummary?.windows?.[windowKey]?.find((entry) => entry.channelId === channelId) ?? null;
}

function getPalworldOutcomes() {
  const channelId = getPalworldChannelId();
  return channelId ? contentOutcomes.filter((item) => item.channelId === channelId) : [];
}

function getPalworldIntelligence() {
  const channelId = getPalworldChannelId();
  return channelId ? getChannelIntelligenceById(channelId) : null;
}

function setPalworldStatus(message, kind = "neutral") {
  if (!palworldActionStatus) {
    return;
  }

  palworldActionStatus.textContent = message;
  palworldActionStatus.className = `form-status ${kind}`;
}

function renderPalworldLaunchMetric(target, detailTarget, value, detail) {
  if (target) {
    target.textContent = value;
  }

  if (detailTarget) {
    detailTarget.textContent = detail;
  }
}

function createPalworldListItem(titleText, detailText, tone = "neutral") {
  const item = document.createElement("article");
  const title = document.createElement("strong");
  const detail = document.createElement("span");

  item.className = `palworld-list-item ${tone}`;
  title.textContent = titleText;
  detail.textContent = detailText;
  item.append(title, detail);
  return item;
}

function renderPalworldLaunchControl() {
  if (!palworldLaunchStatusBadge) {
    return;
  }

  const channelId = getPalworldChannelId();
  const channelLabel = getPalworldChannelLabel();
  const automationStatus = getPalworldAutomationStatus();
  const last24h = getPalworldEngagementWindow("last24h");
  const last7d = getPalworldEngagementWindow("last7d");
  const outcomes = getPalworldOutcomes();
  const lastOutcome = outcomes[0] ?? null;
  const intelligence = getPalworldIntelligence();
  const warningItems = [
    ...(intelligence?.detectedGaps ?? []),
    ...(channelId && !automationStatus ? ["Automation status has not loaded for the Palworld channel."] : []),
    ...(automationStatus?.blockedReason ? [`Automation is ${getBlockedReasonLabel(automationStatus.blockedReason).toLowerCase()}.`] : []),
  ].filter((item, index, list) => item && list.indexOf(item) === index);

  palworldLaunchChannel.textContent = channelId ? channelLabel : "Palworld channel not configured";
  palworldLaunchStatusBadge.textContent = !channelId
    ? "setup needed"
    : automationStatus?.blockedReason
      ? "review"
      : warningItems.length > 0
        ? "warnings"
        : "ready";
  palworldLaunchStatusBadge.className = `status-badge ${!channelId || automationStatus?.blockedReason ? "blocked" : warningItems.length > 0 ? "neutral" : "active"}`;

  renderPalworldLaunchMetric(
    palworldActivity,
    palworldActivityDetail,
    last24h ? `${last24h.messageCount} messages` : "No 24h activity",
    last24h
      ? `${last24h.approxActiveUsers} active users in 24h; ${last7d?.messageCount ?? 0} messages in 7d.`
      : engagementSummaryLoadError
        ? `Engagement unavailable: ${engagementSummaryLoadError}`
        : "No Palworld activity has been recorded in the loaded 24h window.",
  );

  renderPalworldLaunchMetric(
    palworldAutomation,
    palworldAutomationDetail,
    automationStatus ? getBlockedReasonLabel(automationStatus.blockedReason) : "Unknown",
    automationStatus
      ? `${getAutomationModeLabel(automationStatus.automationMode)}. ${getChannelOperationStatusText(automationStatus)}.`
      : "No automation status has loaded for the Palworld channel.",
  );

  renderPalworldLaunchMetric(
    palworldLastPost,
    palworldLastPostDetail,
    lastOutcome ? formatRelativeTime(lastOutcome.postedAt) : "None tracked",
    lastOutcome
      ? `${lastOutcome.label ?? getContentOutcomeSourceLabel(lastOutcome.source)} - ${lastOutcome.activity?.outcomeLabel ?? "unknown"} response.`
      : "No tracked Palworld bot or dashboard post is available yet.",
  );

  renderPalworldLaunchMetric(
    palworldNextPost,
    palworldNextPostDetail,
    automationStatus?.nextEligibleSendAt ? formatRelativeTime(automationStatus.nextEligibleSendAt) : "None loaded",
    automationStatus?.nextEligibleSendAt
      ? `${formatTimestamp(automationStatus.nextEligibleSendAt)} via ${getAutomationModeLabel(automationStatus.automationMode)}.`
      : "No next scheduled Palworld post is available from the loaded automation state.",
  );

  palworldOutcomes.replaceChildren();
  if (contentOutcomesLoadError) {
    palworldOutcomes.append(createPalworldListItem("Outcomes unavailable", contentOutcomesLoadError, "blocked"));
  } else if (outcomes.length === 0) {
    palworldOutcomes.append(createPalworldListItem("No tracked Palworld posts yet", "Post from this panel or Create & Post to start outcome tracking."));
  } else {
    for (const outcome of outcomes.slice(0, 3)) {
      palworldOutcomes.append(createPalworldListItem(
        outcome.label ?? getContentOutcomeSourceLabel(outcome.source),
        `${formatRelativeTime(outcome.postedAt)} - ${outcome.activity?.humanMessages60m ?? 0} human messages in 60m`,
        getContentOutcomeTone(outcome.activity?.outcomeLabel),
      ));
    }
  }

  palworldWarnings.replaceChildren();
  if (!channelId) {
    palworldWarnings.append(createPalworldListItem("Palworld channel missing", "No dashboard preset with default topic palworld was found.", "blocked"));
  } else if (channelIntelligenceLoadError) {
    palworldWarnings.append(createPalworldListItem("Readiness unavailable", channelIntelligenceLoadError, "blocked"));
  } else if (warningItems.length === 0) {
    palworldWarnings.append(createPalworldListItem("No readiness warnings", "Current loaded signals do not show Palworld setup gaps.", "active"));
  } else {
    for (const warning of warningItems.slice(0, 4)) {
      palworldWarnings.append(createPalworldListItem("Review", warning, "blocked"));
    }
  }

  const actionButtons = [palworldPostInfoButton, palworldPostPromptButton, palworldPauseAutomationButton, palworldResumeAutomationButton];
  for (const button of actionButtons) {
    if (button) {
      button.disabled = !channelId;
    }
  }
}

function renderContentOutcomes() {
  if (!contentOutcomesList) {
    return;
  }

  contentOutcomesList.replaceChildren();

  if (contentOutcomesLoadError) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty";
    empty.textContent = `Recent post results are unavailable. ${contentOutcomesLoadError}`;
    contentOutcomesList.append(empty);
    return;
  }

  if (!Array.isArray(contentOutcomes) || contentOutcomes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty";
    empty.textContent = "No recent posts have been tracked yet. Results will appear after confirmed bot or dashboard posts.";
    contentOutcomesList.append(empty);
    return;
  }

  const items = getFilteredContentOutcomes();

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty";
    empty.textContent = "No recent posts match the selected filter.";
    contentOutcomesList.append(empty);
    return;
  }

  for (const item of items.slice(0, 20)) {
    contentOutcomesList.append(createContentOutcomeCard(item));
  }
}

function getOpportunityTone(priority) {
  if (priority === "critical" || priority === "high") {
    return "blocked";
  }

  if (priority === "medium") {
    return "active";
  }

  return "neutral";
}

function getOpportunityById(id) {
  return (backendOpportunities ?? []).find((opportunity) => opportunity.id === id) ?? null;
}

function setOpportunityHash(opportunityId) {
  const nextHash = `opportunity=${encodeURIComponent(opportunityId)}`;

  if (window.location.hash.slice(1) !== nextHash) {
    window.history.replaceState(null, "", `#${nextHash}`);
  }
}

function getOpportunityIdFromHash() {
  const hash = window.location.hash.slice(1);
  const match = hash.match(/^opportunity=(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function clearOpportunityHash() {
  if (window.location.hash.startsWith("#opportunity=")) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

function getOpportunityChannelIds(opportunity) {
  return Array.isArray(opportunity?.affectedChannels)
    ? opportunity.affectedChannels.map((channel) => channel.id).filter(Boolean)
    : [];
}

function getOpportunityPrimaryChannel(opportunity) {
  const channelId = getOpportunityChannelIds(opportunity)[0];

  if (!channelId) {
    return null;
  }

  const intelligenceChannel = getChannelIntelligenceById(channelId);
  const affectedChannel = opportunity.affectedChannels.find((channel) => channel.id === channelId);

  return intelligenceChannel ?? {
    channelId,
    channelName: affectedChannel?.name ?? channelId,
    channelType: "unknown",
    roleWorkflows: {
      relevantRoleIds: [],
    },
  };
}

function buildOpportunityContext(opportunity, targetSection) {
  const primaryChannel = getOpportunityPrimaryChannel(opportunity);
  return {
    opportunityId: opportunity.id,
    title: opportunity.title ?? "Opportunity",
    targetSection,
    reason: opportunity.suggestedAction ?? "Review this opportunity.",
    channelId: primaryChannel?.channelId ?? getOpportunityChannelIds(opportunity)[0] ?? null,
    channelName: primaryChannel?.channelName ?? opportunity.affectedChannels?.[0]?.name ?? null,
    source: opportunity.category === "Successful Content Pattern" || opportunity.category === "Failed Content Pattern"
      ? String(opportunity.title ?? "").split(" ")[0] || null
      : null,
  };
}

function writeOpportunityContextToUrl(context) {
  const url = new URL(window.location.href);
  url.searchParams.set("opportunityId", context.opportunityId);
  if (context.channelId) {
    url.searchParams.set("opportunityChannelId", context.channelId);
  } else {
    url.searchParams.delete("opportunityChannelId");
  }
  url.searchParams.set("opportunityTarget", context.targetSection);
  url.searchParams.set("opportunityReason", context.reason);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${window.location.hash}`);
}

function clearOpportunityContextUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("opportunityId");
  url.searchParams.delete("opportunityChannelId");
  url.searchParams.delete("opportunityTarget");
  url.searchParams.delete("opportunityReason");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${window.location.hash}`);
}

function renderOpportunityContextBanner() {
  if (!opportunityContextBanner || !opportunityContextTitle || !opportunityContextDetail) {
    return;
  }

  if (!activeOpportunityContext) {
    opportunityContextBanner.hidden = true;
    return;
  }

  opportunityContextBanner.hidden = false;
  opportunityContextTitle.textContent = `Opened from Recommended Next Step: ${activeOpportunityContext.title}`;
  opportunityContextDetail.textContent = [
    activeOpportunityContext.reason,
    activeOpportunityContext.channelName
      ? `Affected channel: #${activeOpportunityContext.channelName}`
      : activeOpportunityContext.channelId
        ? "Affected channel: name not loaded"
        : null,
    `Target: ${activeOpportunityContext.targetSection}`,
  ].filter(Boolean).join(" • ");
}

function setOpportunityContext(opportunity, targetSection) {
  activeOpportunityContext = buildOpportunityContext(opportunity, targetSection);
  writeOpportunityContextToUrl(activeOpportunityContext);
  renderOpportunityContextBanner();
}

function dismissOpportunityContext() {
  activeOpportunityContext = null;
  clearOpportunityContextUrl();
  renderOpportunityContextBanner();
}

function restoreOpportunityContextFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const opportunityId = params.get("opportunityId");

  if (!opportunityId) {
    renderOpportunityContextBanner();
    return;
  }

  const opportunity = getOpportunityById(opportunityId);
  activeOpportunityContext = {
    opportunityId,
    title: opportunity?.title ?? "Opportunity",
    targetSection: params.get("opportunityTarget") ?? "dashboard",
    reason: params.get("opportunityReason") ?? opportunity?.suggestedAction ?? "Review this opportunity.",
    channelId: params.get("opportunityChannelId"),
    channelName: opportunity?.affectedChannels?.find((channel) => channel.id === params.get("opportunityChannelId"))?.name ?? null,
    source: null,
  };
  renderOpportunityContextBanner();
}

function getOpportunityWhyDetected(opportunity) {
  const category = opportunity.category;

  if (category === "Dormant Channel") {
    return "A channel had stored engagement history but no recent activity in the current 24-hour signal.";
  }

  if (category === "Untended Channel") {
    return "The channel is missing profile, topic, and configured content workflow signals.";
  }

  if (category === "High Potential Channel") {
    return "Recent engagement exists, but little or no automation/content support is configured.";
  }

  if (category === "Successful Content Pattern") {
    return "Tracked posts from this source have repeated above-average human response outcomes.";
  }

  if (category === "Failed Content Pattern") {
    return "Tracked posts from this source have repeated weak human response outcomes.";
  }

  if (category === "Automation Failure Risk") {
    return "Recent automation activity includes recurring blocked or failed events.";
  }

  if (category === "Quick Wins") {
    return "Channel understanding found a setup gap that can be reviewed in an existing dashboard workflow.";
  }

  return "The dashboard matched this item from available operational signals.";
}

function getOpportunityCheckNext(opportunity) {
  const category = opportunity.category;

  if (category === "Successful Content Pattern" || category === "Failed Content Pattern") {
    return [
      "Review recent posted content outcomes for the source.",
      "Compare channels and response counts before changing cadence or content type.",
      "Use recent activity to confirm whether the channel was generally active at the time.",
    ];
  }

  if (category === "Automation Failure Risk") {
    return [
      "Open Automation controls and review the affected channel.",
      "Check recent automation activity for blocked reasons or failures.",
      "Confirm global and channel-level posting controls before changing anything.",
    ];
  }

  if (category === "Dormant Channel" || category === "High Potential Channel") {
    return [
      "Review channel understanding for setup gaps.",
      "Check recent activity for channel activity and active-user counts.",
      "Review Recent Posts before deciding what content pattern to reuse.",
    ];
  }

  return [
    "Review channel understanding for the affected channel.",
    "Check whether a profile, topic, feed, or role workflow already exists.",
    "Use existing setup controls only after confirming the recommendation still applies.",
  ];
}

function getOwnerFriendlyOpportunityTitle(opportunity) {
  const category = opportunity?.category;
  const title = String(opportunity?.title ?? "").trim();
  const primaryChannel = getOpportunityPrimaryChannel(opportunity);
  const channelName = primaryChannel?.channelName ? `#${primaryChannel.channelName}` : "this channel";

  if (category === "Automation Failure Risk") {
    return "Review recent posting problems";
  }

  if (category === "Dormant Channel") {
    return `Check why ${channelName} has gone quiet`;
  }

  if (category === "Untended Channel" || category === "Quick Wins") {
    return `Tell the bot what ${channelName} is used for`;
  }

  if (category === "High Potential Channel") {
    return `Help the bot support ${channelName}`;
  }

  if (category === "Successful Content Pattern") {
    return "Reuse a post type that worked";
  }

  if (category === "Failed Content Pattern") {
    return "Review a post type that is not working";
  }

  return title
    .replace(/\bOpportunity\b/gi, "Suggested improvement")
    .replace(/\bQuick Win\b/gi, "Takes about 30 seconds")
    .replace(/\bChannel Profile\b/gi, "Channel setup")
    .replace(/\bChannel Intelligence\b/gi, "Channel understanding")
    .replace(/\bEngagement Score\b/gi, "Conversation activity")
    || "Review the recommended next step";
}

function getOwnerFriendlyOpportunityDescription(opportunity) {
  const description = String(opportunity?.description ?? opportunity?.suggestedAction ?? "").trim();

  if (!description) {
    return "The dashboard found a useful next step from the information it already has.";
  }

  return description
    .replace(/\bopportunity engine\b/gi, "dashboard")
    .replace(/\bOpportunity\b/gi, "suggested improvement")
    .replace(/\bQuick Win\b/gi, "short task")
    .replace(/\bChannel Profile\b/gi, "channel setup")
    .replace(/\bChannel Intelligence\b/gi, "channel understanding")
    .replace(/\bEngagement Score\b/gi, "conversation activity");
}

function getOwnerFriendlyOpportunityCategory(category) {
  const categoryLabels = {
    "Dormant Channel": "Quiet channel",
    "Untended Channel": "Channel setup gap",
    "High Potential Channel": "Active channel support",
    "Successful Content Pattern": "Post type that worked",
    "Failed Content Pattern": "Post type to review",
    "Automation Failure Risk": "Posting problem",
    "Quick Wins": "Takes about 30 seconds",
  };

  return categoryLabels[category] ?? "Suggested improvement";
}

function getRecommendationEffort(opportunity) {
  if (opportunity?.category === "Quick Wins" || opportunity?.category === "Untended Channel") {
    return "Takes about 30 seconds";
  }

  if (opportunity?.category === "Automation Failure Risk") {
    return "Takes about 1 minute";
  }

  return "Takes a few minutes";
}

function createExplainDetails(items) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const list = document.createElement("dl");

  details.className = "explain-details";
  summary.textContent = "Why?";
  list.className = "explain-details-list";

  for (const item of items) {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = item.term;
    description.textContent = item.description;
    list.append(term, description);
  }

  details.append(summary, list);
  return details;
}

function navigateOpportunityToSection(section, opportunity) {
  const primaryChannel = getOpportunityPrimaryChannel(opportunity);

  setOpportunityContext(opportunity, section);
  closeOpportunityActionDrawer();

  if (section === "channel-intelligence") {
    setActiveControlTab("access");
    window.requestAnimationFrame(() => {
      document.querySelector("#community-channel-summary")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (primaryChannel?.channelId) {
        highlightOpportunityTarget(`[data-channel-intelligence-id="${primaryChannel.channelId}"]`);
      }
    });
    return;
  }

  if (section === "engagement") {
    setActiveControlTab("engagement");
    window.requestAnimationFrame(() => {
      document.querySelector("[data-tab-panel='engagement']")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (primaryChannel?.channelId) {
        highlightOpportunityTarget(`[data-engagement-channel-id="${primaryChannel.channelId}"]`);
      }
    });
    return;
  }

  if (section === "content-outcomes") {
    setActiveControlTab("push");
    setActiveContentStudioMode("outcomes");
    if (contentOutcomesSourceFilter) {
      const sourceOption = Array.from(contentOutcomesSourceFilter.options).find((option) =>
        String(opportunity.title ?? "").toLowerCase().startsWith(option.value.toLowerCase()) ||
        String(opportunity.title ?? "").toLowerCase().startsWith(option.textContent.toLowerCase()),
      );
      if (sourceOption && sourceOption.value !== "all") {
        contentOutcomesSourceFilter.value = sourceOption.value;
        renderContentOutcomes();
      }
    }
    window.requestAnimationFrame(() => {
      document.querySelector(".content-outcomes-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      highlightOpportunityTarget(".content-outcomes-panel");
    });
    return;
  }

  if (section === "automation") {
    setActiveControlTab("channels");
    if (channelOperationsFilter) {
      channelOperationsFilter.value = "all";
    }
    renderChannelOperations();
    if (primaryChannel?.channelId) {
      highlightManagedChannel(primaryChannel.channelId, `[data-channel-operation-id="${primaryChannel.channelId}"]`);
    }
    return;
  }

  if (section === "profiles") {
    if (primaryChannel?.channelId) {
      openChannelProfileSetupFromDrawer(primaryChannel);
      return;
    }

    navigateMissionAction(createMissionNavigation("overview", "channel-setup-assistant"));
    return;
  }

  if (section === "feeds") {
    if (primaryChannel?.channelId) {
      openFeedConfigFromDrawer(primaryChannel);
      return;
    }

    navigateMissionAction(createMissionNavigation("channels", "automation-scheduled-posts"));
    return;
  }

  if (section === "manual-content") {
    if (primaryChannel?.channelId) {
      openManualContentFromDrawer(primaryChannel);
      return;
    }

    navigateMissionAction(createMissionNavigation("push", "post-now-generated-content"));
    return;
  }

  if (section === "composer") {
    if (primaryChannel?.channelId) {
      openComposerFromDrawer(primaryChannel);
      return;
    }

    navigateMissionAction(createMissionNavigation("push", "post-now-message"));
  }
}

function createOpportunityNavigationActions(opportunity) {
  const actions = document.createElement("div");
  const category = opportunity.category;
  const primaryChannel = getOpportunityPrimaryChannel(opportunity);
  const addButton = (label, section, helperCopy) => {
    const button = createDrawerActionButton(label, () => navigateOpportunityToSection(section, opportunity));
    actions.append(button);
    if (helperCopy) {
      button.title = helperCopy;
    }
  };

  actions.className = "channel-action-buttons";
  addButton("Channel Understanding", "channel-intelligence");
  addButton("Recent Activity", "engagement", "Recent activity cannot currently preselect this exact recommendation.");

  if (category === "Successful Content Pattern" || category === "Failed Content Pattern") {
    addButton("Recent Posts", "content-outcomes", "Filtering remains manual in the Recent Posts panel.");
  }

  if (category === "Automation Failure Risk" || category === "Quick Wins" || category === "Untended Channel") {
    addButton("Automation Controls", "automation");
  }

  if (category === "Untended Channel" || category === "Quick Wins" || category === "High Potential Channel") {
    addButton("Channel Setup", "profiles");
    addButton("Scheduled Posts", "feeds");
  }

  if (category === "Dormant Channel" || category === "High Potential Channel") {
    addButton("Manual Content", "manual-content", primaryChannel ? "" : "No affected channel is available to preselect.");
    addButton("Composer", "composer", primaryChannel ? "" : "No affected channel is available to preselect.");
  }

  return actions;
}

function openOpportunityActionDrawer(opportunityId, options = {}) {
  const opportunity = getOpportunityById(opportunityId);

  if (!opportunity || !opportunityActionDrawer || !opportunityActionDrawerBody) {
    return;
  }

  activeOpportunityId = opportunityId;
  closeChannelActionDrawer({ preserveHash: true });
  opportunityActionDrawer.hidden = false;
  opportunityActionDrawerPriority.textContent = opportunity.priority ?? "low";
  opportunityActionDrawerPriority.className = `status-badge ${getOpportunityTone(opportunity.priority)}`;
  opportunityActionDrawerTitle.textContent = getOwnerFriendlyOpportunityTitle(opportunity);
  opportunityActionDrawerSummary.textContent = "Recommended next step";
  opportunityActionDrawerBody.replaceChildren();

  const ownerFriendlyAffectedChannels = Array.isArray(opportunity.affectedChannels) && opportunity.affectedChannels.length > 0
    ? opportunity.affectedChannels.map((channel) => channel.name ? `#${channel.name}` : "A channel without a loaded name")
    : ["No specific channel was attached to this recommendation."];
  const summary = document.createElement("dl");
  summary.className = "channel-action-summary-grid";
  for (const [term, value] of [
    ["Type", getOwnerFriendlyOpportunityCategory(opportunity.category)],
    ["Urgency", opportunity.priority ?? "low"],
    ["Confidence", opportunity.confidence ?? "low"],
    ["Affected Channels", ownerFriendlyAffectedChannels.join(", ")],
  ]) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    summary.append(dt, dd);
  }

  const description = document.createElement("p");
  description.className = "channel-operation-detail";
  description.textContent = getOwnerFriendlyOpportunityDescription(opportunity);

  const suggestedAction = document.createElement("p");
  suggestedAction.className = "channel-action-recommendation";
  suggestedAction.textContent = opportunity.suggestedAction ?? "Review this suggested improvement.";

  const helperCopy = document.createElement("p");
  helperCopy.className = "channel-action-fallback";
  helperCopy.textContent = getOpportunityPrimaryChannel(opportunity)
    ? "Navigation buttons open existing dashboard sections and may preselect or highlight the affected channel when that workflow supports it."
    : "This opportunity does not include a preselectable channel or source. Navigation buttons open the relevant dashboard section for manual review.";

  opportunityActionDrawerBody.append(
    createDrawerSection("Recommended Next Step Summary", summary),
    createDrawerSection("Description", description),
    createDrawerSection("Suggested Improvement", suggestedAction),
    createDrawerSection("Supporting Signals", createDrawerList(Array.isArray(opportunity.supportingSignals) ? opportunity.supportingSignals : [], "No supporting signals were provided.")),
    createDrawerSection("Why This Was Detected", createDrawerList([getOpportunityWhyDetected(opportunity)], "No detection rationale is available.")),
    createDrawerSection("What To Check Next", createDrawerList(getOpportunityCheckNext(opportunity), "No next checks are available.")),
    createDrawerSection("Navigation", createOpportunityNavigationActions(opportunity)),
    helperCopy,
  );

  if (!options.skipHash) {
    setOpportunityHash(opportunityId);
  }

  window.requestAnimationFrame(() => {
    opportunityActionDrawer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function closeOpportunityActionDrawer(options = {}) {
  activeOpportunityId = null;
  if (opportunityActionDrawer) {
    opportunityActionDrawer.hidden = true;
  }
  if (!options.preserveHash) {
    clearOpportunityHash();
  }
}

function handleDashboardHashChange() {
  const opportunityId = getOpportunityIdFromHash();
  if (opportunityId) {
    if (getOpportunityById(opportunityId)) {
      openOpportunityActionDrawer(opportunityId, { skipHash: true });
    } else {
      setActiveControlTab("overview");
    }
    return;
  }

  const channelId = getDrawerChannelIdFromHash();
  if (channelId && getChannelIntelligenceById(channelId)) {
    openChannelActionDrawer(channelId, { skipHash: true });
    return;
  }

  if (channelId) {
    setActiveControlTab("access");
    return;
  }

  applyLegacyTabHash();
}

function applyLegacyTabHash() {
  const hash = window.location.hash.slice(1).toLowerCase();
  if (hash.startsWith("community-")) {
    setActiveControlTab("access");
    return;
  }

  const contentPostSectionMode = getContentStudioModeForSection(hash);
  if (contentPostSectionMode) {
    setActiveControlTab("push");
    setActiveContentStudioMode(contentPostSectionMode);
    window.requestAnimationFrame(() => {
      document.querySelector(`#${hash}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return;
  }

  if (hash === "content-outcomes") {
    setActiveControlTab("push");
    setActiveContentStudioMode("outcomes");
    window.requestAnimationFrame(() => {
      document.querySelector(".content-outcomes-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return;
  }

  const tabByHash = {
    dashboard: "overview",
    home: "overview",
    overview: "overview",
    community: "access",
    access: "access",
    "content-studio": "push",
    "create-post": "push",
    "create-and-post": "push",
    push: "push",
    automation: "channels",
    channels: "channels",
    engagement: "engagement",
    settings: "settings",
  };
  const tab = tabByHash[hash];

  if (tab) {
    setActiveControlTab(tab);
  }
}

function createBackendOpportunityCard(opportunity) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const titleBlock = document.createElement("div");
  const title = document.createElement("strong");
  const description = document.createElement("p");
  const badges = document.createElement("div");
  const channels = document.createElement("p");
  const suggestedAction = document.createElement("p");
  const signals = document.createElement("ul");

  card.className = `mission-opportunity-card priority-${String(opportunity.priority).replace(/\s+/g, "-")}`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open opportunity details for ${opportunity.title ?? "opportunity"}`);
  header.className = "mission-opportunity-card-header";
  titleBlock.className = "mission-opportunity-title";
  badges.className = "channel-operation-badges";
  channels.className = "mission-opportunity-meta";
  suggestedAction.className = "mission-opportunity-action";
  signals.className = "mission-opportunity-signals";

  title.textContent = opportunity.title ?? "Opportunity";
  description.textContent = opportunity.description ?? "";
  badges.append(
    createStatusBadge(opportunity.priority ?? "low", getOpportunityTone(opportunity.priority)),
    createStatusBadge(opportunity.confidence ?? "low confidence", opportunity.confidence === "high" ? "active" : "neutral"),
    createStatusBadge(opportunity.category ?? "opportunity", "neutral"),
  );
  channels.textContent = `Channels: ${
    Array.isArray(opportunity.affectedChannels) && opportunity.affectedChannels.length > 0
      ? opportunity.affectedChannels.map((channel) => channel.name ? `#${channel.name}` : channel.id).join(", ")
      : "none"
  }`;
  suggestedAction.textContent = `Suggested action: ${opportunity.suggestedAction ?? "Review this opportunity."}`;

  for (const signal of Array.isArray(opportunity.supportingSignals) ? opportunity.supportingSignals.slice(0, 4) : []) {
    const item = document.createElement("li");
    item.textContent = signal;
    signals.append(item);
  }

  titleBlock.append(title, description);
  header.append(titleBlock, badges);
  card.append(header, channels, suggestedAction);
  if (signals.children.length > 0) {
    card.append(signals);
  }
  card.addEventListener("click", () => openOpportunityActionDrawer(opportunity.id));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOpportunityActionDrawer(opportunity.id);
    }
  });
  return card;
}

function createRecommendedNextStepCard(opportunity) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const copy = document.createElement("div");
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const badges = document.createElement("div");
  const action = document.createElement("button");

  card.className = `mission-opportunity-card recommended-next-step priority-${String(opportunity.priority).replace(/\s+/g, "-")}`;
  header.className = "mission-opportunity-card-header";
  copy.className = "mission-opportunity-title";
  badges.className = "channel-operation-badges";
  title.textContent = getOwnerFriendlyOpportunityTitle(opportunity);
  description.textContent = getOwnerFriendlyOpportunityDescription(opportunity);
  action.type = "button";
  action.textContent = "Review Next Step";
  action.addEventListener("click", () => openOpportunityActionDrawer(opportunity.id));

  badges.append(
    createStatusBadge(getRecommendationEffort(opportunity), "active"),
    createStatusBadge(opportunity.priority === "critical" || opportunity.priority === "high" ? "needs attention" : "suggested improvement", getOpportunityTone(opportunity.priority)),
  );

  copy.append(title, description);
  header.append(copy, badges);
  card.append(
    header,
    action,
    createExplainDetails([
      {
        term: "Why am I seeing this?",
        description: getOpportunityWhyDetected(opportunity),
      },
      {
        term: "Why does it matter?",
        description: opportunity.suggestedAction ?? "This is a practical way to improve the current setup.",
      },
      {
        term: "What happens when I click the action?",
        description: "You will see the supporting details and links into existing dashboard screens. Nothing posts automatically.",
      },
    ]),
  );

  return card;
}

function renderBackendOpportunities() {
  if (!missionOpportunitiesList) {
    return;
  }

  missionOpportunitiesList.replaceChildren();

  if (backendOpportunitiesLoadError) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty";
    empty.textContent = `Recommended next step is unavailable. ${backendOpportunitiesLoadError}`;
    missionOpportunitiesList.append(empty);
    if (missionBackendOpportunityCount) {
      missionBackendOpportunityCount.textContent = "unavailable";
      missionBackendOpportunityCount.className = "status-badge blocked";
    }
    return;
  }

  const items = Array.isArray(backendOpportunities) ? backendOpportunities : [];

  if (missionBackendOpportunityCount) {
    missionBackendOpportunityCount.textContent = items.length > 0 ? "1 recommendation" : "none";
    missionBackendOpportunityCount.className = `status-badge ${items.length > 0 ? "active" : "neutral"}`;
  }

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty";
    empty.textContent = "No recommended next step is available from the currently loaded data.";
    missionOpportunitiesList.append(empty);
    return;
  }

  missionOpportunitiesList.append(createRecommendedNextStepCard(items[0]));

  if (activeOpportunityId) {
    openOpportunityActionDrawer(activeOpportunityId, { skipHash: true });
  }
}

function renderEngagementDashboard() {
  const total1h = getTotalMessagesForEngagementWindow("last1h");
  const total24h = getTotalMessagesForEngagementWindow("last24h");
  const total7d = getTotalMessagesForEngagementWindow("last7d");
  const selectedRows = getFilteredEngagementRows();
  const all24hRows = getEngagementRows("last24h");
  const active24hCount = all24hRows.filter((row) => row.status === "active").length;
  const quietDormantCount = getEngagementRows().filter((row) => row.status === "quiet" || row.status === "dormant").length;
  const selectedWindowItems = getEngagementWindowItems();
  const selectedBotMessages = selectedWindowItems.reduce((total, item) => total + (Number(item.botMessageCount) || 0), 0);
  const selectedMessages = selectedWindowItems.reduce((total, item) => total + (Number(item.messageCount) || 0), 0);
  const selectedHumanMessages = Math.max(0, selectedMessages - selectedBotMessages);
  const hasSummaryShape = Boolean(engagementSummary?.windows && typeof engagementSummary.windows === "object");
  const hasAnyEngagementData = total1h + total24h + total7d > 0;

  setOpsValue(engagementTotal1h, total1h);
  setOpsValue(engagementTotal24h, total24h);
  setOpsValue(engagementTotal7d, total7d);
  setOpsValue(engagementActiveChannels, active24hCount);
  setOpsValue(engagementQuietChannels, quietDormantCount);
  setOpsValue(engagementHumanBot, `${selectedHumanMessages} / ${selectedBotMessages}`);
  setOpsCardState(engagementTotal1hCard, total1h > 0 ? "ok" : "neutral");
  setOpsCardState(engagementTotal24hCard, total24h > 0 ? "ok" : "neutral");
  setOpsCardState(engagementTotal7dCard, total7d > 0 ? "ok" : "neutral");
  setOpsCardState(engagementActiveChannelsCard, active24hCount > 0 ? "ok" : "neutral");
  setOpsCardState(engagementQuietChannelsCard, quietDormantCount > 0 ? "warning" : "neutral");
  setOpsCardState(engagementHumanBotCard, selectedMessages > 0 ? "ok" : "neutral");

  if (engagementEmptyState) {
    engagementEmptyState.hidden = false;

    if (engagementSummaryLoadError) {
      engagementEmptyState.textContent = `Engagement summary is unavailable. ${engagementSummaryLoadError}`;
    } else if (!hasSummaryShape) {
      engagementEmptyState.textContent = "Engagement recording is unavailable or the API did not return an engagement summary.";
    } else if (!hasAnyEngagementData && lastHealthSnapshot && lastHealthSnapshot.botReady !== true) {
      engagementEmptyState.textContent = "Bot is not connected, so new Discord engagement activity is not being recorded right now.";
    } else if (!hasAnyEngagementData) {
      engagementEmptyState.textContent = "No engagement activity has been recorded yet. Send Discord messages after the bot is connected, then refresh.";
    } else if (selectedRows.length === 0) {
      engagementEmptyState.textContent = "No channels match the selected engagement filters.";
    } else {
      engagementEmptyState.hidden = true;
    }
  }

  const byMessages = selectedRows
    .filter((row) => row.messageCount > 0)
    .sort((left, right) => right.messageCount - left.messageCount || left.channelName.localeCompare(right.channelName));
  const byUsers = selectedRows
    .filter((row) => row.approxActiveUsers > 0)
    .sort((left, right) => right.approxActiveUsers - left.approxActiveUsers || right.messageCount - left.messageCount);
  const byRecent = selectedRows
    .filter((row) => row.lastKnownActivityAt)
    .sort((left, right) => (right.lastKnownActivityAt ?? 0) - (left.lastKnownActivityAt ?? 0));
  const quietRows = selectedRows
    .filter((row) => row.status === "quiet" || row.status === "dormant")
    .sort((left, right) => (right.lastKnownActivityAt ?? 0) - (left.lastKnownActivityAt ?? 0));
  const windowLabel = getEngagementWindowLabel();

  renderEngagementChannelList(engagementTopChannels, byMessages, `msgs ${windowLabel}`, (row) => row.messageCount, "No message activity in the selected window.");
  renderEngagementChannelList(engagementTopUsers, byUsers, `users ${windowLabel}`, (row) => row.approxActiveUsers, "No unique-user signal in the selected window.");
  renderEngagementChannelList(engagementRecentActivity, byRecent, "last seen", (row) => formatTimestamp(row.lastKnownActivityAt), "No recent activity timestamp is available.");
  renderEngagementChannelList(engagementQuietList, quietRows, `msgs ${windowLabel}`, (row) => row.messageCount, "No quiet or dormant channels match the selected filters.");
  renderCommunityActivity();
  renderContentOutcomes();
}

function getChannelIntelligenceTone(healthLabel) {
  if (healthLabel === "healthy") {
    return "active";
  }

  if (healthLabel === "attention") {
    return "blocked";
  }

  return "neutral";
}

function getChannelIntelligenceFilteredItems() {
  const channels = Array.isArray(channelIntelligence?.channels) ? channelIntelligence.channels : [];
  const filterValue = channelIntelligenceFilter?.value ?? "all";

  if (filterValue === "all") {
    return channels;
  }

  return channels.filter((channel) => channel.healthLabel === filterValue);
}

function renderChannelIntelligenceSummary() {
  if (!channelIntelligenceSummary) {
    return;
  }

  channelIntelligenceSummary.replaceChildren();

  const summary = channelIntelligence?.summary;
  const countItems = [
    ["attention", "Attention"],
    ["needs setup", "Needs Setup"],
    ["inactive", "Inactive"],
    ["healthy", "Healthy"],
    ["unknown", "Unknown"],
  ];

  for (const [key, label] of countItems) {
    const item = document.createElement("button");
    const value = document.createElement("strong");
    const text = document.createElement("span");

    item.type = "button";
    item.className = `channel-intelligence-count ${getChannelIntelligenceTone(key)}`;
    value.textContent = String(summary?.[key] ?? 0);
    text.textContent = label;
    item.append(value, text);
    item.addEventListener("click", () => {
      if (channelIntelligenceFilter) {
        channelIntelligenceFilter.value = key;
      }
      renderChannelIntelligence();
    });
    channelIntelligenceSummary.append(item);
  }
}

function getChannelIntelligenceDetailLines(channel) {
  const details = [
    ["Profile", channel.profile.status === "saved" ? `${channel.profile.purpose ?? "saved"} / ${channel.profile.tone ?? "tone unset"}` : "missing"],
    ["Topic", channel.topic.topic ? `${channel.topic.topic} (${channel.topic.status})` : "missing"],
    ["Automation", `${channel.automation.mode} / ${channel.automation.status}`],
    ["Feeds", `${channel.feeds.enabled} enabled / ${channel.feeds.total} total`],
    ["Daily Trivia", channel.dailyTrivia.relevant ? (channel.dailyTrivia.enabled ? "target, enabled" : "target, disabled") : "not target"],
    ["Role Workflows", `${channel.roleWorkflows.panels} panels / ${channel.roleWorkflows.followups} follow-ups`],
    ["Engagement", channel.engagement ? `${channel.engagement.engagementLabel} / ${channel.engagement.last24hMessages} msgs 24h` : "unknown"],
    ["Recent Problems", `${channel.recentActivity.blockedOrFailureCount} since ${formatTimestamp(channel.recentActivity.since)}`],
  ];

  return details;
}

function getChannelIntelligenceById(channelId) {
  return (channelIntelligence?.channels ?? []).find((channel) => channel.channelId === channelId) ?? null;
}

function getChannelHealthReason(channel) {
  if (channel.healthLabel === "attention") {
    if (channel.recentActivity.blockedOrFailureCount > 0) {
      return `${channel.recentActivity.blockedOrFailureCount} recent blocked or failed automation event${channel.recentActivity.blockedOrFailureCount === 1 ? "" : "s"} were found.`;
    }

    if (channel.automation.blockedReason) {
      return `Automation is currently blocked by ${channel.automation.blockedReason}.`;
    }
  }

  if (channel.healthLabel === "needs setup") {
    if (channel.profile.status === "missing") {
      return "No saved channel profile exists yet, so CDawg does not know the channel purpose, tone, or preferred content.";
    }

    if (channel.topic.status === "missing") {
      return "The channel has a saved profile but no topic mapping or profile topic override.";
    }
  }

  if (channel.healthLabel === "inactive") {
    return "No enabled feed, daily trivia target, automation mode, or recent automation activity was found from the available operational data.";
  }

  if (channel.healthLabel === "healthy") {
    return "Existing setup has no operational readiness issue from the current data sources.";
  }

  return "CDawg does not have enough metadata to make a confident readiness call for this channel.";
}

function getChannelDetectedGaps(channel) {
  const gaps = [];

  if (channel.profile.status === "missing") {
    gaps.push("Missing saved channel profile.");
  }

  if (channel.topic.status === "missing") {
    gaps.push("Missing topic mapping or profile topic override.");
  }

  if (channel.automation.blockedReason) {
    gaps.push(`Automation blocked by ${channel.automation.blockedReason}.`);
  }

  if (channel.feeds.enabled === 0 && !channel.dailyTrivia.relevant && channel.automation.mode === "none") {
    gaps.push("No active content automation found.");
  }

  if (channel.profile.status === "saved" && channel.roleWorkflows.relevantRoleIds.length > 0 && channel.roleWorkflows.panels === 0) {
    gaps.push("Relevant role exists but no matching role signup panel was found.");
  }

  if (channel.profile.status === "saved" && channel.roleWorkflows.relevantRoleIds.length > 0 && channel.roleWorkflows.followups === 0) {
    gaps.push("Relevant role exists but no matching role follow-up message was found.");
  }

  if (channel.recentActivity.blockedOrFailureCount > 0) {
    gaps.push("Recent automation problems need review.");
  }

  return gaps;
}

function getChannelExistingFeatures(channel) {
  const features = [];

  if (channel.profile.status === "saved") {
    features.push(`Profile saved: ${channel.profile.purpose ?? "purpose set"} / ${channel.profile.tone ?? "tone unset"}.`);
  }

  if (channel.topic.topic) {
    features.push(`Topic available: ${channel.topic.topic} (${channel.topic.status}).`);
  }

  if (channel.automation.mode !== "none") {
    features.push(`Automation mode: ${channel.automation.mode}.`);
  }

  if (channel.feeds.total > 0) {
    features.push(`${channel.feeds.enabled} enabled feed${channel.feeds.enabled === 1 ? "" : "s"} / ${channel.feeds.total} total.`);
  }

  if (channel.dailyTrivia.relevant) {
    features.push(`Daily trivia target: ${channel.dailyTrivia.enabled ? "enabled" : "disabled"}.`);
  }

  if (channel.roleWorkflows.panels > 0) {
    features.push(`${channel.roleWorkflows.panels} relevant role signup panel${channel.roleWorkflows.panels === 1 ? "" : "s"}.`);
  }

  if (channel.roleWorkflows.followups > 0) {
    features.push(`${channel.roleWorkflows.followups} relevant role follow-up${channel.roleWorkflows.followups === 1 ? "" : "s"}.`);
  }

  if (channel.recentActivity.count > 0) {
    features.push(`${channel.recentActivity.count} recent automation event${channel.recentActivity.count === 1 ? "" : "s"} in the activity window.`);
  }

  if (channel.engagement && channel.engagement.engagementLabel !== "unknown") {
    features.push(`Engagement signal: ${channel.engagement.last24hMessages} messages in 24h, ${channel.engagement.last7dMessages} in 7d, approximately ${channel.engagement.approxActiveUsers24h} active users in 24h.`);
  }

  return features;
}

function getEngagementTone(label) {
  if (label === "active") {
    return "active";
  }

  if (label === "dormant") {
    return "blocked";
  }

  return "neutral";
}

function createEngagementSnapshot(channel) {
  const snapshot = channel.engagement;

  if (!snapshot) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty compact-empty";
    empty.textContent = "Engagement summary is unavailable for this channel.";
    return empty;
  }

  const grid = document.createElement("dl");
  grid.className = "channel-action-summary-grid";
  const details = [
    ["Signal", snapshot.engagementLabel],
    ["Messages 24h", snapshot.last24hMessages],
    ["Messages 7d", snapshot.last7dMessages],
    ["Approx users 24h", snapshot.approxActiveUsers24h],
    ["Last activity", `${formatTimestamp(snapshot.lastActivityAt)} (${formatRelativeTime(snapshot.lastActivityAt)})`],
  ];

  for (const [term, value] of details) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = String(value);
    grid.append(dt, dd);
  }

  return grid;
}

function createDrawerSection(titleText, content) {
  const section = document.createElement("section");
  const title = document.createElement("h4");
  title.textContent = titleText;
  section.className = "channel-action-section";
  section.append(title, content);
  return section;
}

function createDrawerList(items, emptyCopy) {
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty compact-empty";
    empty.textContent = emptyCopy;
    return empty;
  }

  const list = document.createElement("ul");
  list.className = "channel-action-list";

  for (const item of items) {
    const entry = document.createElement("li");
    entry.textContent = item;
    list.append(entry);
  }

  return list;
}

function getRecentActivityForDrawer(channelId) {
  return automationActivityItems.filter((item) => item.channelId === channelId).slice(0, 5);
}

function createDrawerActivityList(channelId) {
  const items = getRecentActivityForDrawer(channelId);

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "channel-operation-empty compact-empty";
    empty.textContent = automationActivityItems.length === 0
      ? "Recent automation activity has not loaded yet, or no events have been recorded."
      : "No recent automation activity is loaded for this channel.";
    return empty;
  }

  const list = document.createElement("div");
  list.className = "channel-action-activity-list";

  for (const item of items) {
    list.append(createAutomationActivityItem(item));
  }

  return list;
}

function setDrawerHash(channelId) {
  const nextHash = `channel-intelligence=${encodeURIComponent(channelId)}`;

  if (window.location.hash.slice(1) !== nextHash) {
    window.history.replaceState(null, "", `#${nextHash}`);
  }
}

function getDrawerChannelIdFromHash() {
  const hash = window.location.hash.slice(1);
  const match = hash.match(/^channel-intelligence=(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function clearDrawerHash() {
  if (window.location.hash.startsWith("#channel-intelligence=")) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

function ensureChannelSetupChannelOption(channel) {
  if (!channelSetupChannel || !channel?.channelId) {
    return false;
  }

  if (!Array.from(channelSetupChannel.options).some((option) => option.value === channel.channelId)) {
    const option = document.createElement("option");
    option.value = channel.channelId;
    option.textContent = `#${channel.channelName} (${channel.channelType})`;
    channelSetupChannel.append(option);
  }

  return true;
}

function openChannelProfileSetupFromDrawer(channel) {
  closeChannelActionDrawer();
  openChannelSetupAssistant();
  ensureChannelSetupChannelOption(channel);

  if (channelSetupChannel) {
    channelSetupChannel.value = channel.channelId;
    applySavedChannelProfileToAssistant(channel.channelId);
    renderChannelSetupAssistant();
  }

  setActiveControlTab("overview");
  window.requestAnimationFrame(() => {
    document.querySelector("#channel-setup-assistant")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function highlightManagedChannel(channelId, selector) {
  window.requestAnimationFrame(() => {
    const target = document.querySelector(selector);

    if (!target) {
      return;
    }

    target.classList.add("is-channel-action-target");
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(() => target.classList.remove("is-channel-action-target"), 2200);
  });
}

function highlightOpportunityTarget(selector) {
  window.requestAnimationFrame(() => {
    const target = document.querySelector(selector);

    if (!target) {
      return;
    }

    target.classList.add("is-opportunity-context-target");
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(() => target.classList.remove("is-opportunity-context-target"), 2600);
  });
}

function openAutomationControlsFromDrawer(channel) {
  closeChannelActionDrawer();
  setActiveControlTab("channels");
  if (channelOperationsFilter) {
    channelOperationsFilter.value = "all";
  }
  renderChannelOperations();
  highlightManagedChannel(channel.channelId, `[data-channel-operation-id="${channel.channelId}"]`);
}

function openFeedConfigFromDrawer(channel) {
  closeChannelActionDrawer();
  navigateMissionAction(createMissionNavigation("channels", "automation-scheduled-posts"));

  const existingFeed = feeds.find((feed) => feed.channelId === channel.channelId);

  if (existingFeed) {
    populateFeedForm(existingFeed);
    return;
  }

  resetFeedForm();
  setPresetOrManualChannel(feedForm, channel.channelId);
  showFeedForm();
  setFeedStatus(`Draft prepared for ${channel.channelName}. Review before saving.`);
  window.requestAnimationFrame(() => {
    feedForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function openDailyTriviaFromDrawer(channel) {
  const preset = findPresetForChannel(channel.channelId);

  closeChannelActionDrawer();
  navigateMissionAction(createMissionNavigation("channels", "automation-daily-trivia"));
  configureDailyTrivia();

  if (preset) {
    dailyTriviaForm.elements.channelPreset.value = preset.channelId;
    setDailyTriviaStatus(`Daily trivia form targeted to ${channel.channelName}. Review before saving.`);
  } else {
    setDailyTriviaStatus("This channel is not in the dashboard channel preset list, so Daily Trivia cannot preselect it yet.", "error");
  }
}

function openRolePanelFromDrawer(channel) {
  closeChannelActionDrawer();
  navigateMissionAction(createMissionNavigation("access", "community-role-signup-buttons"));

  const panel = roleAccessPanels.find(
    (entry) => entry.targetChannelId === channel.channelId || channel.roleWorkflows.relevantRoleIds.includes(entry.roleId),
  );

  if (panel) {
    populateRoleAccessPanelForm(panel);
    return;
  }

  createRoleAccessPanelDraft();
  setRoleAccessPanelStatus("No matching role signup button exists yet. Blank draft opened; review before saving.");
}

function openRoleFollowupsFromDrawer(channel) {
  closeChannelActionDrawer();
  navigateMissionAction(createMissionNavigation("access", "community-role-followups"));

  const followup = roleFollowups.find(
    (entry) => entry.channelId === channel.channelId || channel.roleWorkflows.relevantRoleIds.includes(entry.roleId),
  );

  if (followup) {
    populateRoleFollowupForm(followup);
    return;
  }

  createRoleFollowupDraft();
  roleFollowupForm.elements.channelId.value = channel.channelId;
  const firstRoleId = channel.roleWorkflows.relevantRoleIds[0];
  if (firstRoleId) {
    roleFollowupForm.elements.roleId.value = firstRoleId;
  }
  syncDiscordMetadataSelections();
  renderRoleFollowupPreview();
  setRoleFollowupStatus("No matching role follow-up exists yet. Draft opened; review before saving.");
}

function openManualContentFromDrawer(channel) {
  const preset = findPresetForChannel(channel.channelId);

  closeChannelActionDrawer();
  navigateMissionAction(createMissionNavigation("push", "post-now-generated-content"));

  if (preset) {
    manualPushForm.elements.channelPreset.value = preset.channelId;
    syncManualPushPresetSelection(true);
    setManualPushStatus(`Manual content form targeted to ${channel.channelName}. Review before sending.`);
  } else {
    setManualPushStatus("This channel is not in the dashboard channel preset list, so manual generated content cannot preselect it yet.", "error");
  }
}

function openComposerFromDrawer(channel) {
  closeChannelActionDrawer();
  navigateMissionAction(createMissionNavigation("push", "post-now-message"));

  if (Array.from(composerForm.elements.channelId.options).some((option) => option.value === channel.channelId)) {
    composerForm.elements.channelId.value = channel.channelId;
    syncDiscordMetadataSelections();
    setComposerStatus(`Composer targeted to ${channel.channelName}. Review before posting.`);
  } else {
    setComposerStatus("This channel is not available in the composer channel list, so it cannot be preselected yet.", "error");
  }
}

function createDrawerActionButton(label, handler, options = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = options.secondary === false ? "" : "secondary";
  button.textContent = label;
  button.disabled = options.disabled === true;
  if (options.title) {
    button.title = options.title;
  }
  button.addEventListener("click", handler);
  return button;
}

function createDrawerActions(channel) {
  const actions = document.createElement("div");
  const hasPreset = Boolean(findPresetForChannel(channel.channelId));
  actions.className = "channel-action-buttons";

  actions.append(
    createDrawerActionButton("Go to Profile Setup", () => openChannelProfileSetupFromDrawer(channel)),
    createDrawerActionButton("Manage Automation", () => openAutomationControlsFromDrawer(channel)),
    createDrawerActionButton("Manage Feeds", () => openFeedConfigFromDrawer(channel)),
    createDrawerActionButton("Daily Trivia", () => openDailyTriviaFromDrawer(channel), {
      disabled: !hasPreset,
      title: hasPreset ? "" : "Daily Trivia currently uses dashboard channel presets only.",
    }),
    createDrawerActionButton("Role Panels", () => openRolePanelFromDrawer(channel)),
    createDrawerActionButton("Role Follow-Ups", () => openRoleFollowupsFromDrawer(channel)),
    createDrawerActionButton("Manual Content", () => openManualContentFromDrawer(channel), {
      disabled: !hasPreset,
      title: hasPreset ? "" : "Manual generated content currently uses dashboard channel presets only.",
    }),
    createDrawerActionButton("Composer", () => openComposerFromDrawer(channel), {
      disabled: !Array.from(composerForm.elements.channelId.options).some((option) => option.value === channel.channelId),
      title: "Composer can preselect channels available in loaded Discord metadata.",
    }),
  );

  return actions;
}

function getActionTarget(action) {
  return action?.targetDashboardSection ?? action?.target ?? "none";
}

function runDrawerAction(channel, action) {
  const target = getActionTarget(action);

  if (target === "profile" || target === "topic") {
    openChannelProfileSetupFromDrawer(channel);
    return;
  }

  if (target === "automation") {
    openAutomationControlsFromDrawer(channel);
    return;
  }

  if (target === "feeds") {
    openFeedConfigFromDrawer(channel);
    return;
  }

  if (target === "daily-trivia") {
    openDailyTriviaFromDrawer(channel);
    return;
  }

  if (target === "role-workflows") {
    openRolePanelFromDrawer(channel);
    return;
  }

  if (target === "activity") {
    closeChannelActionDrawer();
    navigateMissionAction(createMissionNavigation("overview", "home-recent-activity"));
    return;
  }

  if (target === "manual-content") {
    openManualContentFromDrawer(channel);
    return;
  }

  if (target === "composer") {
    openComposerFromDrawer(channel);
    return;
  }

  openChannelProfileSetupFromDrawer(channel);
}

function createDrawerRecommendedActions(channel) {
  const actions = Array.isArray(channel.recommendedActions) && channel.recommendedActions.length > 0
    ? channel.recommendedActions
    : [
        {
          id: "fallback-next-action",
          label: channel.recommendedNextAction.label,
          targetDashboardSection: channel.recommendedNextAction.target,
          priority: channel.recommendedNextAction.target === "none" ? "low" : "medium",
          reason: channel.recommendedNextAction.reason,
        },
      ];
  const list = document.createElement("div");
  list.className = "channel-action-recommended-actions";

  for (const action of actions) {
    const row = document.createElement("article");
    const copy = document.createElement("div");
    const title = document.createElement("div");
    const label = document.createElement("strong");
    const priority = createStatusBadge(action.priority ?? "medium", action.priority === "high" ? "blocked" : action.priority === "low" ? "neutral" : "active");
    const reason = document.createElement("p");
    const button = document.createElement("button");

    row.className = "channel-action-recommended-action";
    copy.className = "channel-action-recommended-copy";
    title.className = "channel-action-recommended-title";
    label.textContent = action.label ?? "Review channel";
    reason.textContent = action.reason ?? "Review this existing dashboard workflow.";
    button.type = "button";
    button.className = "secondary";
    button.textContent = "Open";
    button.addEventListener("click", () => runDrawerAction(channel, action));

    title.append(label, priority);
    copy.append(title, reason);
    row.append(copy, button);
    list.append(row);
  }

  return list;
}

function openChannelActionDrawer(channelId, options = {}) {
  const channel = getChannelIntelligenceById(channelId);

  if (!channel || !channelActionDrawer || !channelActionDrawerBody) {
    return;
  }

  activeChannelActionChannelId = channelId;
  closeOpportunityActionDrawer({ preserveHash: true });
  channelActionDrawer.hidden = false;
  channelActionDrawerHealth.textContent = channel.healthLabel;
  channelActionDrawerHealth.className = `status-badge ${getChannelIntelligenceTone(channel.healthLabel)}`;
  channelActionDrawerTitle.textContent = `#${channel.channelName}`;
  channelActionDrawerSummary.textContent = `${channel.channelType} • ${channel.channelId}`;
  channelActionDrawerBody.replaceChildren();

  const summary = document.createElement("dl");
  summary.className = "channel-action-summary-grid";
  for (const [term, value] of getChannelIntelligenceDetailLines(channel)) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    summary.append(dt, dd);
  }

  const healthReasons = Array.isArray(channel.healthReasons) && channel.healthReasons.length > 0
    ? channel.healthReasons
    : [getChannelHealthReason(channel)];
  const detectedGaps = Array.isArray(channel.detectedGaps)
    ? channel.detectedGaps
    : getChannelDetectedGaps(channel);
  const configuredFeatures = Array.isArray(channel.configuredFeatures)
    ? channel.configuredFeatures
    : getChannelExistingFeatures(channel);
  const managementLimitations = Array.isArray(channel.managementLimitations)
    ? channel.managementLimitations
    : [];

  const recommendation = document.createElement("div");
  recommendation.className = "channel-action-recommendation";
  const recommendationTitle = document.createElement("strong");
  const recommendationReason = document.createElement("p");
  recommendationTitle.textContent = channel.recommendedNextAction.label;
  recommendationReason.textContent = channel.recommendedNextAction.reason;
  recommendation.append(recommendationTitle, recommendationReason);

  const trustMeta = createMissionTrustMeta([
    { label: "Source", value: channel.trust?.sources?.join(", ") },
    { label: "Confidence", value: channel.trust?.confidence ?? "medium" },
    { label: "Freshness", value: channel.trust?.freshness ?? `generated ${formatRelativeTime(channelIntelligence?.generatedAt)}` },
  ]);

  const fallback = document.createElement("p");
  fallback.className = "channel-action-fallback";
  fallback.textContent = (channel.manageable === true || findPresetForChannel(channel.channelId) || guildChannels.some((entry) => entry.id === channel.channelId))
    ? "Actions below route to existing dashboard controls. Review any prepared forms before saving or posting."
    : "Some controls cannot preselect this channel because the current dashboard only manages certain workflows through channel presets or loaded sendable channel metadata.";

  channelActionDrawerBody.append(
    createDrawerSection("Channel Summary", summary),
    createDrawerSection("Why This Health Label", createDrawerList(healthReasons, "No health reason was provided.")),
    createDrawerSection("Recommended Next Action", recommendation),
    createDrawerSection("Recommended Actions", createDrawerRecommendedActions(channel)),
    createDrawerSection("Detected Gaps", createDrawerList(detectedGaps, "No operational readiness gaps detected from the available data.")),
    createDrawerSection("Configured Features", createDrawerList(configuredFeatures, "No configured features detected for this channel yet.")),
    createDrawerSection("Engagement Snapshot", createEngagementSnapshot(channel)),
    createDrawerSection("Recent Relevant Activity", createDrawerActivityList(channel.channelId)),
    createDrawerSection("Management Limitations", createDrawerList(managementLimitations, "No management limitations reported for this channel.")),
    createDrawerSection("Source / Trust", trustMeta),
    createDrawerSection("Navigation", createDrawerActions(channel)),
    fallback,
  );

  if (!options.skipHash) {
    setDrawerHash(channelId);
  }

  window.requestAnimationFrame(() => {
    channelActionDrawer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function closeChannelActionDrawer(options = {}) {
  activeChannelActionChannelId = null;
  if (channelActionDrawer) {
    channelActionDrawer.hidden = true;
  }
  if (!options.preserveHash) {
    clearDrawerHash();
  }
}

function createChannelIntelligenceCard(channel) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const heading = document.createElement("div");
  const title = document.createElement("h3");
  const subtitle = document.createElement("p");
  const badges = document.createElement("div");
  const details = document.createElement("dl");
  const recommendation = document.createElement("div");
  const recommendationTitle = document.createElement("strong");
  const recommendationReason = document.createElement("p");
  const trustMeta = createMissionTrustMeta([
    { label: "Source", value: channel.trust?.sources?.slice(0, 4).join(", ") },
    { label: "Confidence", value: channel.trust?.confidence ?? "medium" },
    { label: "Freshness", value: channel.trust?.freshness ?? `generated ${formatRelativeTime(channelIntelligence?.generatedAt)}` },
  ]);
  const actionButton = document.createElement("button");

  card.className = `channel-intelligence-card health-${String(channel.healthLabel).replace(/\s+/g, "-")}`;
  card.dataset.channelIntelligenceId = channel.channelId;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open action details for ${channel.channelName}`);
  header.className = "channel-intelligence-card-header";
  heading.className = "channel-intelligence-heading";
  badges.className = "channel-operation-badges";
  details.className = "channel-intelligence-details";
  recommendation.className = "channel-intelligence-recommendation";

  title.textContent = channel.channelName;
  subtitle.textContent = `${channel.channelType} • ${channel.channelId}`;
  badges.append(
    createStatusBadge(channel.healthLabel, getChannelIntelligenceTone(channel.healthLabel)),
    createStatusBadge(channel.engagement?.engagementLabel ?? "engagement unknown", getEngagementTone(channel.engagement?.engagementLabel)),
    createStatusBadge(channel.recommendedNextAction.target, "neutral"),
  );

  for (const [term, value] of getChannelIntelligenceDetailLines(channel)) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    details.append(dt, dd);
  }

  recommendationTitle.textContent = channel.recommendedNextAction.label;
  recommendationReason.textContent = channel.recommendedNextAction.reason;
  recommendation.append(recommendationTitle, recommendationReason);

  actionButton.type = "button";
  actionButton.className = "secondary";
  actionButton.textContent = "Open Action Drawer";
  actionButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openChannelActionDrawer(channel.channelId);
  });
  card.addEventListener("click", () => openChannelActionDrawer(channel.channelId));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openChannelActionDrawer(channel.channelId);
    }
  });

  heading.append(title, subtitle);
  header.append(heading, badges);
  card.append(header, details, recommendation, trustMeta, actionButton);
  return card;
}

function renderChannelIntelligence() {
  if (!channelIntelligenceList) {
    return;
  }

  renderChannelIntelligenceSummary();
  channelIntelligenceList.replaceChildren();

  if (channelIntelligenceLoadError) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = `Channel intelligence is unavailable. ${channelIntelligenceLoadError}`;
    channelIntelligenceList.append(emptyState);
    return;
  }

  if (channelIntelligence && channelIntelligence.metadataAvailable === false) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "Discord channel metadata is unavailable, so CDawg cannot derive channel intelligence yet. Start the bot API with Discord access and refresh.";
    channelIntelligenceList.append(emptyState);
    return;
  }

  const channels = getChannelIntelligenceFilteredItems();

  if (channels.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = channelIntelligence
      ? "No channels match the selected health filter."
      : "Channel intelligence has not loaded yet.";
    channelIntelligenceList.append(emptyState);
    return;
  }

  for (const channel of channels) {
    channelIntelligenceList.append(createChannelIntelligenceCard(channel));
  }

  if (activeChannelActionChannelId) {
    openChannelActionDrawer(activeChannelActionChannelId, { skipHash: true });
  }
}

function getProviderFailureCount() {
  const failures = lastMetricsSnapshot?.contentProviders?.apiFailureCounts;

  if (!failures || typeof failures !== "object") {
    return 0;
  }

  return Object.values(failures).reduce((total, value) => total + (typeof value === "number" ? value : 0), 0);
}

function createMissionNavigation(tab, section) {
  return {
    tab,
    section,
  };
}

function createChannelProfileMissionNavigation(channelId) {
  return {
    tab: "overview",
    section: "channel-setup-assistant",
    channelSetupChannelId: channelId,
  };
}

function isChannelProfileRoleRecommended(profile) {
  return profile.accessMode === "opt-in" || profile.accessMode === "private";
}

function getChannelProfileLabel(profile) {
  return getChannelLabel(profile.channelId);
}

function formatChannelProfileList(profiles, getLabel = getChannelProfileLabel) {
  const labels = profiles.slice(0, 3).map(getLabel);
  const remainingCount = profiles.length - labels.length;

  return remainingCount > 0 ? `${labels.join(", ")} and ${remainingCount} more` : labels.join(", ");
}

function getRoleAccessPanelForProfile(profile) {
  if (!profile.suggestedRoleId) {
    return null;
  }

  return roleAccessPanels.find((panel) => panel.roleId === profile.suggestedRoleId) ?? null;
}

function getRoleFollowupForProfile(profile) {
  if (!profile.suggestedRoleId) {
    return null;
  }

  return roleFollowups.find((followup) => followup.roleId === profile.suggestedRoleId) ?? null;
}

function getFeedsForProfile(profile) {
  return feeds.filter((feed) => feed.channelId === profile.channelId);
}

function getAutomationStatusForProfile(profile) {
  return channelAutomationStatuses.find((status) => status.channelId === profile.channelId) ?? null;
}

function getEnabledPreferredFeedsForProfile(profile) {
  const preferredContentTypes = Array.isArray(profile.preferredContentTypes) ? profile.preferredContentTypes : [];

  return getFeedsForProfile(profile).filter((feed) => feed.enabled !== false && preferredContentTypes.includes(feed.contentType));
}

function getChannelProfileAutomationIssue(status) {
  if (!status) {
    return "Automation status is not available for this channel yet.";
  }

  if (status.blockedReason === "disabled") {
    return "Automatic posting is turned off for this channel.";
  }

  if (status.blockedReason === "silenced") {
    return "Automatic posting is currently paused for this channel.";
  }

  if (status.blockedReason === "cooldown") {
    return "Automatic posting is delayed by cooldown.";
  }

  if (status.blockedReason === "skip-next" || status.skipNextSendPending === true) {
    return "This channel is set to skip the next scheduled post.";
  }

  return null;
}

function createCompletenessPart(label, complete, missingPiece, navigation, actionLabel) {
  return {
    label,
    complete,
    missingPiece,
    navigation,
    actionLabel,
  };
}

function buildChannelSetupCompleteness(profile) {
  const roleRecommended = isChannelProfileRoleRecommended(profile);
  const hasSuggestedRole = Boolean(profile.suggestedRoleId);
  const suggestedRoleMissing = hasSuggestedRole && guildMetadataLoaded && !metadataHasRole(profile.suggestedRoleId);
  const rolePanel = getRoleAccessPanelForProfile(profile);
  const roleFollowup = getRoleFollowupForProfile(profile);
  const preferredContentTypes = Array.isArray(profile.preferredContentTypes) ? profile.preferredContentTypes : [];
  const enabledPreferredFeeds = getEnabledPreferredFeedsForProfile(profile);
  const automationStatus = getAutomationStatusForProfile(profile);
  const automationIssue = getChannelProfileAutomationIssue(automationStatus);
  const profileNavigation = createChannelProfileMissionNavigation(profile.channelId);

  const parts = [
    createCompletenessPart(
      "Role Setup",
      !roleRecommended || (hasSuggestedRole && !suggestedRoleMissing),
      !roleRecommended
        ? null
        : !hasSuggestedRole
          ? "Choose an existing role for opt-in or private access."
          : "Choose a role that still exists in Discord metadata.",
      profileNavigation,
      "Review Profile",
    ),
    createCompletenessPart(
      "Follow-Up Setup",
      !roleRecommended || Boolean(roleFollowup),
      roleRecommended ? "Add a role follow-up message for the suggested role." : null,
      createMissionNavigation("access", "community-role-followups"),
      "Open Follow-Ups",
    ),
    createCompletenessPart(
      "Content Setup",
      preferredContentTypes.length > 0 && enabledPreferredFeeds.length > 0,
      preferredContentTypes.length === 0
        ? "Choose preferred content types for this channel profile."
        : "Add an enabled scheduled post that matches this profile's preferred content types.",
      preferredContentTypes.length === 0 ? profileNavigation : createMissionNavigation("channels", "automation-scheduled-posts"),
      preferredContentTypes.length === 0 ? "Review Profile" : "Open Scheduled Posts",
    ),
    createCompletenessPart(
      "Automation Setup",
      !automationIssue,
      automationIssue,
      createMissionNavigation("channels", "automation-channel-controls"),
      "Open Automation",
    ),
  ];

  if (roleRecommended && hasSuggestedRole && !suggestedRoleMissing && !rolePanel) {
    parts[0] = {
      ...parts[0],
      complete: false,
      missingPiece: parts[0].missingPiece ?? "Add a role signup button for the suggested role.",
      navigation: createMissionNavigation("access", "community-role-signup-buttons"),
      actionLabel: "Open Community",
    };
  }

  const completeCount = parts.filter((part) => part.complete).length;
  const missingPieces = parts.filter((part) => !part.complete && part.missingPiece).map((part) => part.missingPiece);
  const nextPart = parts.find((part) => !part.complete);

  return {
    score: Math.round((completeCount / parts.length) * 100),
    parts,
    missingPieces,
    recommendedNextStep: nextPart
      ? {
          label: nextPart.missingPiece,
          actionLabel: nextPart.actionLabel,
          navigation: nextPart.navigation,
        }
      : {
          label: "Channel setup is complete from the currently loaded profile data.",
          actionLabel: "Review Profile",
          navigation: profileNavigation,
        },
  };
}

function buildChannelSetupProfileFromState(state) {
  return {
    channelId: state.channelId,
    channelName: getChannelLabel(state.channelId),
    purpose: state.purposeKey,
    audience: state.audience,
    accessMode: state.accessMode,
    tone: state.tone,
    preferredContentTypes: state.preferredContentTypes,
    topicOverride: state.topicOverride,
    suggestedRoleId: state.roleId || null,
    signupPanelId: null,
    followupId: null,
    notes: state.notes,
  };
}

function getChannelProfilePurposeLabel(profile) {
  return channelSetupPurposeProfiles[profile.purpose]?.label ?? profile.purpose ?? "Custom";
}

function getChannelProfileAccessLabel(profile) {
  return channelSetupAccessLabels[profile.accessMode] ?? profile.accessMode ?? "Not set";
}

function getChannelProfileToneLabel(profile) {
  return channelSetupToneLabels[profile.tone] ?? profile.tone ?? "Not set";
}

function getChannelProfileCommandItems() {
  return channelProfiles
    .map((profile) => ({
      profile,
      completeness: buildChannelSetupCompleteness(profile),
    }))
    .sort((left, right) => {
      const leftComplete = left.completeness.score >= 100;
      const rightComplete = right.completeness.score >= 100;

      if (leftComplete !== rightComplete) {
        return leftComplete ? 1 : -1;
      }

      return left.completeness.score - right.completeness.score || getChannelProfileLabel(left.profile).localeCompare(getChannelProfileLabel(right.profile));
    });
}

function buildChannelProfileMissionOpportunities() {
  const opportunities = [];
  const roleBasedProfiles = channelProfiles.filter(isChannelProfileRoleRecommended);
  const profilesWithoutSuggestedRole = roleBasedProfiles.filter((profile) => !profile.suggestedRoleId);
  const profilesWithMissingRole = roleBasedProfiles.filter(
    (profile) => profile.suggestedRoleId && guildMetadataLoaded && !metadataHasRole(profile.suggestedRoleId),
  );
  const profilesWithoutSignupPanel = roleBasedProfiles.filter(
    (profile) => profile.suggestedRoleId && !profilesWithMissingRole.includes(profile) && !getRoleAccessPanelForProfile(profile),
  );
  const profilesWithoutFollowup = roleBasedProfiles.filter(
    (profile) => profile.suggestedRoleId && !profilesWithMissingRole.includes(profile) && !getRoleFollowupForProfile(profile),
  );
  const profilesWithoutPreferredFeed = channelProfiles.filter((profile) => {
    const preferredContentTypes = Array.isArray(profile.preferredContentTypes) ? profile.preferredContentTypes : [];

    if (preferredContentTypes.length === 0) {
      return false;
    }

    return !getFeedsForProfile(profile).some((feed) => feed.enabled !== false && preferredContentTypes.includes(feed.contentType));
  });
  const profilesWithBlockedAutomation = channelProfiles
    .map((profile) => ({
      profile,
      status: getAutomationStatusForProfile(profile),
    }))
    .filter(({ status }) => status?.blockedReason === "disabled" || status?.blockedReason === "silenced" || status?.skipNextSendPending === true);
  const profilesWithUnsureAccess = channelProfiles.filter((profile) => profile.accessMode === "unsure");
  const incompleteProfiles = channelProfiles
    .map((profile) => ({
      profile,
      completeness: buildChannelSetupCompleteness(profile),
    }))
    .filter(({ completeness }) => completeness.score < 100)
    .sort((left, right) => left.completeness.score - right.completeness.score || getChannelProfileLabel(left.profile).localeCompare(getChannelProfileLabel(right.profile)));

  if (profilesWithoutSuggestedRole.length > 0) {
    opportunities.push({
      name: "Channel profiles missing roles",
      detail: `${formatChannelProfileList(profilesWithoutSuggestedRole)} ${profilesWithoutSuggestedRole.length === 1 ? "is" : "are"} marked for opt-in or private access but do not have a suggested role.`,
      severity: "action needed",
      source: "/api/channel-profiles + saved profile access mode",
      actionLabel: "Review Profile",
      navigation: createChannelProfileMissionNavigation(profilesWithoutSuggestedRole[0].channelId),
    });
  }

  if (profilesWithMissingRole.length > 0) {
    opportunities.push({
      name: "Channel profiles reference missing roles",
      detail: `${formatChannelProfileList(profilesWithMissingRole, (profile) => `${getChannelProfileLabel(profile)} -> ${profile.suggestedRoleId}`)} ${profilesWithMissingRole.length === 1 ? "references" : "reference"} a role not found in Discord metadata.`,
      severity: "action needed",
      source: "/api/channel-profiles + /api/discord/guild-metadata",
      actionLabel: "Review Profile",
      navigation: createChannelProfileMissionNavigation(profilesWithMissingRole[0].channelId),
    });
  }

  if (profilesWithoutSignupPanel.length > 0) {
    opportunities.push({
      name: "Profile roles need signup buttons",
      detail: `${formatChannelProfileList(profilesWithoutSignupPanel)} ${profilesWithoutSignupPanel.length === 1 ? "has" : "have"} a suggested role but no saved role signup button for that role.`,
      severity: "warning",
      source: "/api/channel-profiles + /api/role-access-panels",
      actionLabel: "Open Community",
      navigation: createMissionNavigation("access", "community-role-signup-buttons"),
    });
  }

  if (profilesWithoutFollowup.length > 0) {
    opportunities.push({
      name: "Profile roles need follow-ups",
      detail: `${formatChannelProfileList(profilesWithoutFollowup)} ${profilesWithoutFollowup.length === 1 ? "has" : "have"} a suggested role but no saved follow-up message for that role.`,
      severity: "warning",
      source: "/api/channel-profiles + /api/role-followups",
      actionLabel: "Open Follow-Ups",
      navigation: createMissionNavigation("access", "community-role-followups"),
    });
  }

  if (profilesWithoutPreferredFeed.length > 0) {
    opportunities.push({
      name: "Profile content preferences need feeds",
      detail: `${formatChannelProfileList(profilesWithoutPreferredFeed)} ${profilesWithoutPreferredFeed.length === 1 ? "has" : "have"} preferred content types but no enabled scheduled post for those types.`,
      severity: "warning",
      source: "/api/channel-profiles + /api/feeds",
      actionLabel: "Open Scheduled Posts",
      navigation: createMissionNavigation("channels", "automation-scheduled-posts"),
    });
  }

  if (profilesWithBlockedAutomation.length > 0) {
    opportunities.push({
      name: "Profile channels have automation paused",
      detail: `${formatChannelProfileList(profilesWithBlockedAutomation.map(({ profile }) => profile))} ${profilesWithBlockedAutomation.length === 1 ? "is" : "are"} saved in channel profiles but currently disabled, paused, or set to skip the next post.`,
      severity: "warning",
      source: "/api/channel-profiles + /api/channel-automation-status",
      actionLabel: "Open Automation",
      navigation: createMissionNavigation("channels", "automation-channel-controls"),
    });
  }

  if (profilesWithUnsureAccess.length > 0) {
    opportunities.push({
      name: "Channel profiles need access decisions",
      detail: `${formatChannelProfileList(profilesWithUnsureAccess)} ${profilesWithUnsureAccess.length === 1 ? "still has" : "still have"} access marked as not sure yet.`,
      severity: "warning",
      source: "/api/channel-profiles",
      actionLabel: "Review Profile",
      navigation: createChannelProfileMissionNavigation(profilesWithUnsureAccess[0].channelId),
    });
  }

  if (incompleteProfiles.length > 0) {
    const { profile, completeness } = incompleteProfiles[0];
    opportunities.push({
      name: "Channel setup incomplete",
      detail: `${getChannelProfileLabel(profile)} is ${completeness.score}% complete. Next step: ${completeness.recommendedNextStep.label}`,
      severity: completeness.score < 50 ? "action needed" : "warning",
      source: "/api/channel-profiles + role panels + follow-ups + feeds + automation status",
      actionLabel: completeness.recommendedNextStep.actionLabel,
      navigation: completeness.recommendedNextStep.navigation,
    });
  }

  return opportunities;
}

function buildMissionOpportunities() {
  const opportunities = [];
  const recentProblems = automationActivityItems.filter((item) => item.status === "failure" || item.status === "blocked");
  const panelsMissingRole = roleAccessPanels.filter((panel) => hasMissingRole(panel.roleId));
  const panelsMissingChannel = roleAccessPanels.filter((panel) => hasMissingChannel(panel.targetChannelId));
  const inactivePanels = roleAccessPanels.filter((panel) => panel.active === false);
  const followupsMissingRole = roleFollowups.filter((followup) => hasMissingRole(followup.roleId));
  const followupsMissingChannel = roleFollowups.filter((followup) => hasMissingChannel(followup.channelId));
  const disabledFollowups = roleFollowups.filter((followup) => followup.enabled === false);
  const disabledChannels = channelAutomationStatuses.filter((status) => status.blockedReason === "disabled");
  const pausedChannels = channelAutomationStatuses.filter((status) => status.blockedReason === "silenced");
  const delayedChannels = channelAutomationStatuses.filter((status) => status.blockedReason === "cooldown");
  const skipNextChannels = channelAutomationStatuses.filter(
    (status) => status.blockedReason === "skip-next" || status.skipNextSendPending === true,
  );
  const blockedFeeds = feeds.filter((feed) => Boolean(feed.blockedReason));
  const feedWarnings = feeds.flatMap((feed) => (feed.overlapWarnings ?? []).map((warning) => ({ feed, warning })));
  const providerFailureCount = getProviderFailureCount();

  if (lastHealthSnapshot && lastHealthSnapshot.ok !== true) {
    opportunities.push({
      name: "API unavailable",
      detail: "The dashboard could not confirm that the API is online.",
      severity: "action needed",
      source: "/health",
      actionLabel: "Open Settings",
      navigation: createMissionNavigation("settings"),
    });
  }

  if (lastHealthSnapshot && lastHealthSnapshot.botReady !== true) {
    opportunities.push({
      name: "Bot not ready",
      detail: "Discord connection is not reporting ready.",
      severity: "action needed",
      source: "/health",
      actionLabel: "Open Settings",
      navigation: createMissionNavigation("settings"),
    });
  }

  if (!guildMetadataLoaded) {
    opportunities.push({
      name: "Discord metadata unavailable",
      detail: "Role and channel validation is limited until Discord metadata loads.",
      severity: "warning",
      source: "/api/discord/guild-metadata",
      actionLabel: "Refresh Dashboard",
      navigation: createMissionNavigation("overview"),
    });
  }

  if (automationMaster.globalAutomationEnabled === false) {
    opportunities.push({
      name: "Automatic posting is off",
      detail: "Scheduled posts and background chat replies are blocked globally.",
      severity: "action needed",
      source: "/api/settings",
      actionLabel: "Open Settings",
      navigation: createMissionNavigation("settings"),
    });
  }

  if (panelsMissingRole.length > 0) {
    opportunities.push({
      name: "Role signup buttons missing roles",
      detail: `${panelsMissingRole.length} role signup button${panelsMissingRole.length === 1 ? "" : "s"} need a valid Discord role.`,
      severity: "action needed",
      source: "/api/role-access-panels + /api/discord/guild-metadata",
      actionLabel: "Open Community",
      navigation: createMissionNavigation("access", "community-role-signup-buttons"),
    });
  }

  if (panelsMissingChannel.length > 0) {
    opportunities.push({
      name: "Role signup buttons missing channels",
      detail: `${panelsMissingChannel.length} role signup button${panelsMissingChannel.length === 1 ? "" : "s"} need a valid destination channel.`,
      severity: "action needed",
      source: "/api/role-access-panels + /api/discord/guild-metadata",
      actionLabel: "Open Community",
      navigation: createMissionNavigation("access", "community-role-signup-buttons"),
    });
  }

  if (followupsMissingRole.length > 0) {
    opportunities.push({
      name: "Follow-ups missing roles",
      detail: `${followupsMissingRole.length} follow-up${followupsMissingRole.length === 1 ? "" : "s"} need a valid trigger role.`,
      severity: "action needed",
      source: "/api/role-followups + /api/discord/guild-metadata",
      actionLabel: "Open Follow-Ups",
      navigation: createMissionNavigation("access", "community-role-followups"),
    });
  }

  if (followupsMissingChannel.length > 0) {
    opportunities.push({
      name: "Follow-ups missing channels",
      detail: `${followupsMissingChannel.length} follow-up${followupsMissingChannel.length === 1 ? "" : "s"} need a valid destination channel.`,
      severity: "action needed",
      source: "/api/role-followups + /api/discord/guild-metadata",
      actionLabel: "Open Follow-Ups",
      navigation: createMissionNavigation("access", "community-role-followups"),
    });
  }

  if (recentProblems.length > 0) {
    opportunities.push({
      name: "Recent automation problems",
      detail: `${recentProblems.length} recent automation event${recentProblems.length === 1 ? "" : "s"} need review.`,
      severity: "action needed",
      source: "/api/automation-activity",
      actionLabel: "View Problems",
      navigation: createMissionNavigation("overview", "home-recent-activity"),
    });
  }

  if (blockedFeeds.some((feed) => feed.blockedReason === "trivia-ineligible")) {
    opportunities.push({
      name: "Trivia feed ineligible",
      detail: "At least one trivia feed cannot use its current channel/topic setup.",
      severity: "action needed",
      source: "/api/feeds",
      actionLabel: "Open Scheduled Posts",
      navigation: createMissionNavigation("channels", "automation-scheduled-posts"),
    });
  }

  if (providerFailureCount > 0) {
    opportunities.push({
      name: "Provider failures recorded",
      detail: `${providerFailureCount} provider API failure${providerFailureCount === 1 ? "" : "s"} are recorded in metrics.`,
      severity: "warning",
      source: "/api/metrics",
      actionLabel: "Open Settings",
      navigation: createMissionNavigation("settings"),
    });
  }

  if (disabledChannels.length > 0) {
    opportunities.push({
      name: "Channel automation disabled",
      detail: `${disabledChannels.length} channel${disabledChannels.length === 1 ? "" : "s"} have automatic posting turned off.`,
      severity: "warning",
      source: "/api/channel-automation-status",
      actionLabel: "Open Automation",
      navigation: createMissionNavigation("channels", "automation-channel-controls"),
    });
  }

  if (pausedChannels.length > 0) {
    opportunities.push({
      name: "Channels paused",
      detail: `${pausedChannels.length} channel${pausedChannels.length === 1 ? "" : "s"} are paused.`,
      severity: "warning",
      source: "/api/channel-automation-status",
      actionLabel: "Open Automation",
      navigation: createMissionNavigation("channels", "automation-channel-controls"),
    });
  }

  if (delayedChannels.length > 0) {
    opportunities.push({
      name: "Channels delayed",
      detail: `${delayedChannels.length} channel${delayedChannels.length === 1 ? "" : "s"} are waiting on cooldown.`,
      severity: "warning",
      source: "/api/channel-automation-status",
      actionLabel: "Open Automation",
      navigation: createMissionNavigation("channels", "automation-channel-controls"),
    });
  }

  if (skipNextChannels.length > 0) {
    opportunities.push({
      name: "Skip-next pending",
      detail: `${skipNextChannels.length} channel${skipNextChannels.length === 1 ? "" : "s"} will skip the next scheduled post.`,
      severity: "warning",
      source: "/api/channel-automation-status",
      actionLabel: "Open Automation",
      navigation: createMissionNavigation("channels", "automation-channel-controls"),
    });
  }

  if (blockedFeeds.filter((feed) => feed.blockedReason !== "trivia-ineligible").length > 0) {
    opportunities.push({
      name: "Scheduled posts blocked",
      detail: `${blockedFeeds.length} feed${blockedFeeds.length === 1 ? "" : "s"} are blocked by automation, timing, or channel state.`,
      severity: "warning",
      source: "/api/feeds",
      actionLabel: "Open Scheduled Posts",
      navigation: createMissionNavigation("channels", "automation-scheduled-posts"),
    });
  }

  if (feedWarnings.length > 0) {
    opportunities.push({
      name: "Feed schedule warnings",
      detail: `${feedWarnings.length} feed warning${feedWarnings.length === 1 ? "" : "s"} found for cadence or overlap.`,
      severity: "warning",
      source: "/api/feeds",
      actionLabel: "Open Scheduled Posts",
      navigation: createMissionNavigation("channels", "automation-scheduled-posts"),
    });
  }

  if (dailyTriviaChallenge?.blockedReason) {
    opportunities.push({
      name: "Daily trivia blocked",
      detail: `Daily trivia is blocked by ${getBlockedReasonLabel(dailyTriviaChallenge.blockedReason)}.`,
      severity: dailyTriviaChallenge.blockedReason === "trivia-ineligible" ? "action needed" : "warning",
      source: "/api/daily-trivia",
      actionLabel: "Open Daily Trivia",
      navigation: createMissionNavigation("channels", "automation-daily-trivia"),
    });
  }

  if (dailyTriviaChallenge && dailyTriviaChallenge.enabled === false) {
    opportunities.push({
      name: "Daily trivia disabled",
      detail: "Daily trivia is configured but turned off.",
      severity: "warning",
      source: "/api/daily-trivia",
      actionLabel: "Open Daily Trivia",
      navigation: createMissionNavigation("channels", "automation-daily-trivia"),
    });
  }

  if (disabledFollowups.length > 0) {
    opportunities.push({
      name: "Follow-ups disabled",
      detail: `${disabledFollowups.length} role follow-up${disabledFollowups.length === 1 ? "" : "s"} are saved but inactive.`,
      severity: "warning",
      source: "/api/role-followups",
      actionLabel: "Open Follow-Ups",
      navigation: createMissionNavigation("access", "community-role-followups"),
    });
  }

  if (inactivePanels.length > 0) {
    opportunities.push({
      name: "Role signup buttons inactive",
      detail: `${inactivePanels.length} role signup button${inactivePanels.length === 1 ? "" : "s"} are saved but inactive.`,
      severity: "warning",
      source: "/api/role-access-panels",
      actionLabel: "Open Community",
      navigation: createMissionNavigation("access", "community-role-signup-buttons"),
    });
  }

  opportunities.push(...buildChannelProfileMissionOpportunities());

  return opportunities;
}

function getMissionBriefingTitle(opportunities, recentProblems) {
  if (lastHealthSnapshot?.ok !== true || lastHealthSnapshot?.botReady !== true) {
    return "CDawg needs a systems check.";
  }

  if (opportunities.some((item) => item.severity === "action needed")) {
    return "CDawg found items that need attention.";
  }

  if (recentProblems.length > 0) {
    return "CDawg spotted recent automation problems.";
  }

  if (opportunities.length > 0) {
    return "CDawg has a few recommendations ready.";
  }

  return "Everything is running normally.";
}

function getMissionBriefingSummary(opportunities, recentProblems, nextAutomation) {
  const actionCount = opportunities.filter((item) => item.severity === "action needed").length;
  const warningCount = opportunities.filter((item) => item.severity === "warning").length;
  const nextText = nextAutomation
    ? `Next scheduled activity is ${nextAutomation.label ?? nextAutomation.channelId} ${formatRelativeTime(nextAutomation.nextEligibleSendAt)}.`
    : "No next scheduled activity is currently available.";

  if (actionCount > 0 || warningCount > 0) {
    return `${actionCount} action-needed and ${warningCount} warning-level item${actionCount + warningCount === 1 ? "" : "s"} are in the queue. ${nextText}`;
  }

  if (recentProblems.length > 0) {
    return `${recentProblems.length} recent problem${recentProblems.length === 1 ? "" : "s"} need review. ${nextText}`;
  }

  return `System health is clear from the currently loaded dashboard data. ${nextText}`;
}

function getMissionSeverityTone(severity) {
  if (severity === "action needed") {
    return "blocked";
  }

  if (severity === "warning") {
    return "neutral";
  }

  return "active";
}

function getMissionStatusTone(opportunities) {
  if (lastHealthSnapshot?.ok !== true || lastHealthSnapshot?.botReady !== true) {
    return "blocked";
  }

  if (opportunities.some((item) => item.severity === "action needed")) {
    return "blocked";
  }

  if (opportunities.length > 0) {
    return "neutral";
  }

  return "active";
}

function navigateMissionAction(navigation) {
  if (!navigation) {
    return;
  }

  if (navigation.channelSetupChannelId) {
    openChannelSetupAssistant();
    if (channelSetupChannel) {
      channelSetupChannel.value = navigation.channelSetupChannelId;
      applySavedChannelProfileToAssistant(navigation.channelSetupChannelId);
      renderChannelSetupAssistant();
    }
  }

  setActiveControlTab(navigation.tab || "overview");

  if (navigation.section) {
    setContentStudioModeForSection(navigation.section);
    window.requestAnimationFrame(() => {
      document.querySelector(`#${navigation.section}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
}

function getContentStudioModeForSection(sectionId) {
  if (sectionId === "content-discovery-review") {
    return "discovery";
  }

  if (sectionId === "create-post-scheduled-posts") {
    return "scheduled";
  }

  if (sectionId === "recent-posts") {
    return "outcomes";
  }

  if (sectionId === "create-post-advanced") {
    return "advanced";
  }

  if (sectionId === "post-now-generated-content") {
    return "generate";
  }

  if (sectionId === "post-now-message") {
    return "write";
  }

  if (sectionId === "post-now-saved-messages") {
    return "saved";
  }

  if (sectionId === "post-now-history") {
    return "history";
  }

  return null;
}

function setContentStudioModeForSection(sectionId) {
  const mode = getContentStudioModeForSection(sectionId);

  if (mode) {
    setActiveContentStudioMode(mode);
  }
}

function setActiveContentStudioMode(mode) {
  const validModes = new Set(["discovery", "generate", "write", "saved", "history", "scheduled", "outcomes", "advanced"]);
  const nextMode = validModes.has(mode) ? mode : "write";
  activeContentStudioMode = nextMode;

  for (const button of contentStudioModeButtons) {
    const isActive = button.dataset.contentStudioModeTarget === nextMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  const pushPanel = document.querySelector("[data-tab-panel='push']");
  if (pushPanel) {
    pushPanel.dataset.contentStudioMode = nextMode;
  }

  if (nextMode === "discovery") {
    renderContentDiscoveryReview();
  }
}

function createMissionTrustMeta(items) {
  const meta = document.createElement("div");
  meta.className = "mission-trust-meta";

  for (const item of items.filter((entry) => entry?.value)) {
    const pill = document.createElement("span");
    pill.textContent = `${item.label}: ${item.value}`;
    meta.append(pill);
  }

  return meta;
}

function createMissionActionCard(opportunity) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const badge = createStatusBadge(opportunity.severity, getMissionSeverityTone(opportunity.severity));
  const detail = document.createElement("p");
  const trustMeta = createMissionTrustMeta([
    { label: "Source", value: opportunity.source },
    { label: "Confidence", value: opportunity.confidence ?? "deterministic check" },
    { label: "Freshness", value: opportunity.freshness ?? "current dashboard refresh" },
  ]);
  const action = document.createElement("button");

  card.className = `mission-action-card mission-severity-${opportunity.severity.replace(/\s+/g, "-")}`;
  header.className = "mission-action-card-header";
  title.textContent = getOwnerFriendlyActionTitle(opportunity);
  detail.textContent = getOwnerFriendlyActionDetail(opportunity);
  action.type = "button";
  action.className = "secondary";
  action.textContent = opportunity.actionLabel;
  action.addEventListener("click", () => navigateMissionAction(opportunity.navigation));

  header.append(title, badge);
  card.append(
    header,
    detail,
    trustMeta,
    action,
    createExplainDetails([
      {
        term: "Why am I seeing this?",
        description: getOwnerFriendlyActionWhy(opportunity),
      },
      {
        term: "Why does it matter?",
        description: "Fixing it helps the bot post in the right places, avoid broken setup, and keep member workflows understandable.",
      },
      {
        term: "What happens when I click the action?",
        description: "The dashboard opens the existing screen for review. Nothing is posted automatically from this card.",
      },
    ]),
  );
  return card;
}

function getOwnerFriendlyActionTitle(opportunity) {
  const name = String(opportunity?.name ?? "");

  if (name === "Channel setup incomplete") {
    return "Tell the bot what this channel is used for";
  }

  if (name.includes("automation") || name.includes("Automation") || name.includes("paused") || name.includes("disabled")) {
    return name
      .replace("Channel automation disabled", "Automation is turned off for some channels")
      .replace("Profile channels have automation paused", "Automation is paused for a channel setup")
      .replace("Automatic posting is off", "Automation is paused");
  }

  return name
    .replace(/\bChannel profiles\b/gi, "Channel setups")
    .replace(/\bprofiles\b/gi, "channel setups")
    .replace(/\bProfile\b/g, "Channel setup")
    .replace(/\bDiscord metadata\b/g, "Role and channel list")
    .replace(/\bFeed\b/g, "Scheduled post")
    .replace(/\bfeed\b/g, "scheduled post")
    .replace(/\bProvider failures recorded\b/g, "A content provider had trouble");
}

function getOwnerFriendlyActionDetail(opportunity) {
  return String(opportunity?.detail ?? "")
    .replace(/\bDiscord metadata\b/gi, "the role and channel list")
    .replace(/\bprofile\b/gi, "channel setup")
    .replace(/\bprofiles\b/gi, "channel setups")
    .replace(/\bfeed\b/gi, "scheduled post")
    .replace(/\bfeeds\b/gi, "scheduled posts")
    .replace(/\bprovider API\b/gi, "content provider")
    .replace(/\bautomation\b/gi, "automation");
}

function getOwnerFriendlyActionWhy(opportunity) {
  if (opportunity?.name === "Channel setup incomplete") {
    return "The bot has a saved channel setup, but it is missing details that help it choose the right content and workflows.";
  }

  if (String(opportunity?.name ?? "").toLowerCase().includes("role")) {
    return "A member access workflow references a role that needs review before members can rely on it.";
  }

  if (String(opportunity?.name ?? "").toLowerCase().includes("channel")) {
    return "A saved workflow references a channel or channel setup that needs review before the bot can use it confidently.";
  }

  if (String(opportunity?.name ?? "").toLowerCase().includes("automation")) {
    return "The bot can see automation that is paused, blocked, or recently failed.";
  }

  return "The dashboard found this from the currently loaded settings, activity, and setup data.";
}

function appendCompressedCardList(container, items, createCard, options) {
  const visibleLimit = options.visibleLimit ?? 3;
  const visibleItems = items.slice(0, visibleLimit);
  const overflowItems = items.slice(visibleLimit);

  for (const item of visibleItems) {
    container.append(createCard(item));
  }

  if (overflowItems.length === 0) {
    return;
  }

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const overflowList = document.createElement("div");

  details.className = "mission-overflow-details";
  summary.textContent = options.summaryLabel(items.length);
  overflowList.className = options.listClassName ?? "mission-overflow-list";

  for (const item of overflowItems) {
    overflowList.append(createCard(item));
  }

  details.append(summary, overflowList);
  container.append(details);
}

function getEnabledUpcomingFeeds() {
  return feeds
    .filter((feed) => feed.enabled !== false)
    .filter((feed) => typeof (feed.nextRunAt ?? feed.nextEligibleAt) === "number")
    .sort((left, right) => {
      const leftTime = left.nextRunAt ?? left.nextEligibleAt ?? Number.POSITIVE_INFINITY;
      const rightTime = right.nextRunAt ?? right.nextEligibleAt ?? Number.POSITIVE_INFINITY;
      return leftTime - rightTime || (left.channelLabel ?? left.channelId).localeCompare(right.channelLabel ?? right.channelId);
    });
}

function getContentTypeUsageCounts() {
  const usageCounts = lastMetricsSnapshot?.contentProviders?.usageCounts;
  const contentTypes = ["history", "trivia", "fact", "prompt", "joke", "wyr"];
  const totals = Object.fromEntries(contentTypes.map((contentType) => [contentType, 0]));

  if (!usageCounts || typeof usageCounts !== "object") {
    return totals;
  }

  for (const [rawKey, value] of Object.entries(usageCounts)) {
    if (typeof value !== "number") {
      continue;
    }

    const [contentType] = rawKey.split(":", 1);
    if (contentType in totals) {
      totals[contentType] += value;
    }
  }

  return totals;
}

function getUnderusedContentTypes() {
  const usageTotals = getContentTypeUsageCounts();
  const entries = Object.entries(usageTotals);
  const hasAnyUsage = entries.some(([, count]) => count > 0);

  if (!hasAnyUsage) {
    return [];
  }

  return entries
    .sort((left, right) => left[1] - right[1] || left[0].localeCompare(right[0]))
    .slice(0, 3);
}

function getDailyTriviaStatusSummary() {
  if (!dailyTriviaChallenge) {
    return {
      badge: createStatusBadge("not configured", "neutral"),
      detail: "Daily trivia is not configured yet.",
      meta: "Set a channel and daily time when you want to use it.",
    };
  }

  const latestSession = dailyTriviaChallenge.latestSession;
  const statusLabel = dailyTriviaChallenge.enabled === false
    ? "disabled"
    : dailyTriviaChallenge.blockedReason
      ? "blocked"
      : latestSession?.active
        ? "active now"
        : "upcoming";
  const detail = latestSession
    ? `Latest session: ${latestSession.answerCount} answer${latestSession.answerCount === 1 ? "" : "s"}, ${latestSession.correctAnswerCount} correct.`
    : dailyTriviaChallenge.nextRunAt
      ? `Next run: ${formatTimestamp(dailyTriviaChallenge.nextRunAt)} (${formatRelativeTime(dailyTriviaChallenge.nextRunAt)}).`
      : "Daily trivia is configured, but no next run is currently reported.";
  const winner = latestSession?.winnerUserId ? " Winner recorded." : "";

  return {
    badge: createStatusBadge(statusLabel, dailyTriviaChallenge.blockedReason ? "blocked" : dailyTriviaChallenge.enabled === false ? "neutral" : "active"),
    detail,
    meta: `${dailyTriviaChallenge.channelLabel ?? dailyTriviaChallenge.channelId ?? "No channel"}${winner}`,
  };
}

function createDiscoveryReviewAction(label, navigation) {
  return {
    id: "review",
    label,
    navigation,
  };
}

function createSuggestedChannel(channelId, fallbackLabel = "Not tied to one channel", suggestedChannelName = null) {
  const resolvedLabel = channelId ? getChannelLabel(channelId) : fallbackLabel;

  return {
    id: channelId || null,
    label: channelId && suggestedChannelName && resolvedLabel === channelId ? suggestedChannelName : resolvedLabel,
  };
}

function getDiscoveryMatchLabel(score) {
  if (score >= 90) {
    return "Excellent match";
  }

  if (score >= 75) {
    return "Strong match";
  }

  if (score >= 55) {
    return "Good match";
  }

  if (score >= 40) {
    return "Possible match";
  }

  return "No strong match";
}

function getDiscoveryScoreLabel(score) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return null;
  }

  return getDiscoveryMatchLabel(score);
}

function getDiscoveryWorkflowState(item) {
  return typeof item?.workflowState === "string" && item.workflowState ? item.workflowState : "new";
}

function getDiscoveryWorkflowStateTone(state) {
  if (state === "dismissed") {
    return "blocked";
  }

  if (["reviewed", "saved", "prepared", "posted"].includes(state)) {
    return "active";
  }

  return "neutral";
}

const discoveryQueueFilters = [
  { id: "new", label: "New", empty: "No new discoveries." },
  { id: "saved", label: "Saved", empty: "No saved discoveries yet." },
  { id: "reviewed", label: "Reviewed", empty: "No reviewed discoveries." },
  { id: "prepared", label: "Prepared", empty: "No prepared discoveries." },
  { id: "posted", label: "Posted", empty: "No posted discoveries." },
  { id: "dismissed", label: "Dismissed", empty: "No dismissed discoveries." },
  { id: "all", label: "All", empty: "No discovery cards are available from the current dashboard state." },
];

function formatDiscoveryReason(reason) {
  if (typeof reason !== "string") {
    return "";
  }

  try {
    return reason
      .replace(/<#(\d{17,20})>/g, (_match, channelId) => getChannelLabel(channelId))
      .replace(/<@&(\d{17,20})>/g, (_match, roleId) => `@${getRoleLabel(roleId)}`);
  } catch (error) {
    console.warn(`[discovery] reason formatting failed: ${error.message}`);
    return reason;
  }
}

function createDiscoveryCardId(source, key) {
  const normalizedSource = String(source || "discovery").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const normalizedKey = String(key || "card").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${normalizedSource}:${normalizedKey || "card"}`;
}

const SHOW_MOCK_DISCOVERY_CARDS = window.localStorage.getItem(mockDiscoveryStorageKey) === "true";

function createDiscoveryCardNavigation() {
  return createMissionNavigation("push", "content-discovery-review");
}

function getDiscoverySourceLabel(card) {
  return card?.sourceName || card?.source || "Discovery";
}

function isSafeDiscoveryUrl(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function getSameOriginDiscoveryThumbnailUrl(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  try {
    const url = new URL(value, window.location.href);
    return url.origin === window.location.origin ? url.href : null;
  } catch {
    return null;
  }
}

function getDiscoveryThumbnailLabel(card) {
  if (card?.thumbnailKind === "video") {
    return "Video Preview";
  }

  if (card?.thumbnailKind === "discussion") {
    return "Discussion Preview";
  }

  if (card?.thumbnailKind === "news") {
    return "Headline Preview";
  }

  if (card?.thumbnailKind === "history") {
    return "History Preview";
  }

  return card?.isMock ? "Demo Preview" : "Preview";
}

function createDiscoveryThumbnail(card, options = {}) {
  if (!card?.thumbnailUrl && !card?.thumbnailKind && !card?.isMock && !options.alwaysShow) {
    return null;
  }

  const media = document.createElement("div");
  media.className = options.large ? "content-discovery-thumbnail" : "mission-discovery-thumbnail";

  if (card.thumbnailKind) {
    media.dataset.thumbnailKind = card.thumbnailKind;
  }

  const thumbnailUrl = getSameOriginDiscoveryThumbnailUrl(card.thumbnailUrl);

  if (thumbnailUrl) {
    const image = document.createElement("img");
    image.src = thumbnailUrl;
    image.alt = "";
    image.loading = "lazy";
    media.append(image);
  } else {
    const label = document.createElement("span");
    label.textContent = getDiscoveryThumbnailLabel(card);
    media.append(label);
  }

  return media;
}

function buildMockContentDiscoveryCards() {
  return [
    {
      id: createDiscoveryCardId("mock-youtube", "gaming-highlight"),
      source: "YouTube",
      sourceName: "Mock YouTube",
      title: "Gaming highlight clip worth turning into a question",
      description: "Demo card for a future YouTube discovery source. No video lookup or external request is made.",
      thumbnailUrl: null,
      thumbnailKind: "video",
      sourceUrl: null,
      isMock: true,
      demoLabel: "Demo Preview",
      suggestedChannel: createSuggestedChannel(null, "Gaming channel preview"),
      suggestedReason: "Demo Preview: a short highlight could become a low-risk discussion prompt for a gaming channel.",
      suggestedContentType: "prompt",
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    },
    {
      id: createDiscoveryCardId("mock-reddit", "community-discussion"),
      source: "Reddit",
      sourceName: "Mock Reddit",
      title: "Community discussion thread with question potential",
      description: "Demo card for a future Reddit discovery source. It is local mock data only.",
      thumbnailUrl: null,
      thumbnailKind: "discussion",
      sourceUrl: null,
      isMock: true,
      demoLabel: "Demo Preview",
      suggestedChannel: createSuggestedChannel(null, "Community chat preview"),
      suggestedReason: "Demo Preview: a discussion-style find could be reshaped into a server question without posting automatically.",
      suggestedContentType: "prompt",
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    },
    {
      id: createDiscoveryCardId("mock-rss", "news-headline"),
      source: "News/RSS",
      sourceName: "Mock RSS Feed",
      title: "Headline that could become a short context post",
      description: "Demo card for a future RSS/news discovery source. There is no feed fetch behind this card.",
      thumbnailUrl: null,
      thumbnailKind: "news",
      sourceUrl: null,
      isMock: true,
      demoLabel: "Demo Preview",
      suggestedChannel: createSuggestedChannel(null, "Announcements preview"),
      suggestedReason: "Demo Preview: a timely headline could be reviewed and rewritten before any manual post.",
      suggestedContentType: "fact",
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    },
    {
      id: createDiscoveryCardId("mock-history", "genealogy-visual"),
      source: "Local/Generated",
      sourceName: "Mock Genealogy Visual",
      title: "Historic record image idea for a genealogy prompt",
      description: "Demo card for a future local/generated discovery source with visual context.",
      thumbnailUrl: null,
      thumbnailKind: "history",
      sourceUrl: null,
      isMock: true,
      demoLabel: "Demo Preview",
      suggestedChannel: createSuggestedChannel(null, "Genealogy channel preview"),
      suggestedReason: "Demo Preview: a visual history item could anchor a research conversation after review.",
      suggestedContentType: "history",
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    },
  ];
}

function mapPersistedDiscoveryItemToCard(item) {
  const sourceType = typeof item.sourceType === "string" ? item.sourceType : "local";
  const sourceName = typeof item.sourceName === "string" && item.sourceName.trim() ? item.sourceName.trim() : sourceType;
  const suggestedChannelId = typeof item.suggestedChannelId === "string" && item.suggestedChannelId.trim() ? item.suggestedChannelId.trim() : null;
  const suggestedChannelName = typeof item.suggestedChannelName === "string" && item.suggestedChannelName.trim() ? item.suggestedChannelName.trim() : null;

  return {
    id: `persisted:${item.id}`,
    source: sourceType,
    sourceName,
    title: typeof item.title === "string" ? item.title : "Untitled discovery item",
    description: typeof item.description === "string" ? item.description : "",
    thumbnailUrl: getSameOriginDiscoveryThumbnailUrl(item.thumbnailUrl),
    thumbnailKind: typeof item.thumbnailKind === "string" && item.thumbnailKind.trim() ? item.thumbnailKind.trim() : sourceType,
    sourceUrl: isSafeDiscoveryUrl(item.sourceUrl) ? item.sourceUrl : null,
    isMock: item.isMock === true,
    demoLabel: item.isMock === true ? "Demo Preview" : null,
    suggestedChannel: createSuggestedChannel(suggestedChannelId, suggestedChannelName || "Choose when reviewing", suggestedChannelName),
    suggestedReason: typeof item.suggestedReason === "string" ? item.suggestedReason : "Loaded from persisted discovery items.",
    suggestedContentType: typeof item.suggestedContentType === "string" ? item.suggestedContentType : "prompt",
    actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    score: typeof item.score === "number" && Number.isFinite(item.score) ? item.score : 0,
    discoveredAt: typeof item.discoveredAt === "number" && Number.isFinite(item.discoveredAt) ? item.discoveredAt : 0,
    workflowItemId: typeof item.id === "string" ? item.id : null,
    workflowState: getDiscoveryWorkflowState(item),
    workflowNote: typeof item.workflowNote === "string" ? item.workflowNote : null,
    preparedMessage: typeof item.preparedMessage === "string" ? item.preparedMessage : null,
  };
}

function buildPersistedDiscoveryCards() {
  return discoveryItems
    .map(mapPersistedDiscoveryItemToCard)
    .sort((left, right) => right.score - left.score || right.discoveredAt - left.discoveredAt || left.title.localeCompare(right.title));
}

function getMissionDiscoveryCards() {
  return buildContentDiscoveryCards().filter((item) => item.workflowState !== "dismissed");
}

function getDiscoveryQueueCounts(cards) {
  const counts = {
    new: 0,
    saved: 0,
    reviewed: 0,
    prepared: 0,
    posted: 0,
    dismissed: 0,
    all: cards.length,
  };

  for (const card of cards) {
    if (!card.workflowItemId) {
      continue;
    }

    const state = getDiscoveryWorkflowState(card);
    if (Object.hasOwn(counts, state)) {
      counts[state] += 1;
    }
  }

  return counts;
}

function openDiscoveryQueueFilter(filterId) {
  activeDiscoveryQueueFilter = discoveryQueueFilters.some((filter) => filter.id === filterId) ? filterId : "new";
  selectedDiscoveryCardId = null;
  setActiveControlTab("push");
  setActiveContentStudioMode("discovery");
  window.requestAnimationFrame(() => {
    document.querySelector("#content-discovery-review")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function getDiscoveryTopRecommendation(cards) {
  const statePriority = {
    new: 2,
    saved: 2,
    reviewed: 1,
    prepared: 1,
  };

  return [...cards]
    .filter((card) => {
      const state = getDiscoveryWorkflowState(card);
      return state !== "dismissed" && state !== "posted";
    })
    .sort((left, right) => {
      const leftScore = typeof left.score === "number" && Number.isFinite(left.score) ? left.score : 0;
      const rightScore = typeof right.score === "number" && Number.isFinite(right.score) ? right.score : 0;
      const scoreSort = rightScore - leftScore;

      if (scoreSort !== 0) {
        return scoreSort;
      }

      return (statePriority[getDiscoveryWorkflowState(right)] ?? 0) - (statePriority[getDiscoveryWorkflowState(left)] ?? 0);
    })[0] ?? null;
}

function getDiscoveryNextActionText(cards, counts) {
  if (counts.prepared > 0) {
    return `You have ${counts.prepared} prepared draft${counts.prepared === 1 ? "" : "s"} ready to review.`;
  }

  const highScoreNewItems = cards.filter((card) => {
    const state = getDiscoveryWorkflowState(card);
    return (state === "new" || state === "saved") && typeof card.score === "number" && card.score >= 90;
  }).length;

  if (highScoreNewItems > 0) {
    return `Review ${highScoreNewItems} excellent match${highScoreNewItems === 1 ? "" : "es"}.`;
  }

  if (counts.saved > 0) {
    return "Continue reviewing saved discoveries.";
  }

  if (counts.new > 0) {
    return "Review new discoveries when you have a moment.";
  }

  return "No discovery follow-up is waiting right now.";
}

function createDiscoveryInboxSummary(cards) {
  const summary = document.createElement("section");
  const countsRow = document.createElement("div");
  const nextAction = document.createElement("p");
  const topRecommendation = getDiscoveryTopRecommendation(cards);
  const counts = getDiscoveryQueueCounts(cards);
  const countItems = [
    { id: "new", label: "New" },
    { id: "saved", label: "Saved" },
    { id: "prepared", label: "Prepared" },
    { id: "posted", label: "Posted" },
    { id: "dismissed", label: "Dismissed" },
  ];

  summary.className = "discovery-inbox-summary";
  countsRow.className = "discovery-inbox-counts";
  nextAction.className = "discovery-inbox-next-action";
  nextAction.textContent = getDiscoveryNextActionText(cards, counts);

  for (const item of countItems) {
    const button = document.createElement("button");
    const value = document.createElement("strong");
    const label = document.createElement("span");

    button.type = "button";
    button.className = "discovery-inbox-count";
    value.textContent = String(counts[item.id] ?? 0);
    label.textContent = item.label;
    button.append(value, label);
    button.addEventListener("click", () => openDiscoveryQueueFilter(item.id));
    countsRow.append(button);
  }

  summary.append(countsRow);

  if (topRecommendation) {
    const top = document.createElement("div");
    const copy = document.createElement("div");
    const eyebrow = document.createElement("span");
    const title = document.createElement("h4");
    const meta = document.createElement("p");
    const review = document.createElement("button");
    const scoreLabel = getDiscoveryScoreLabel(topRecommendation.score);

    top.className = "discovery-inbox-top";
    copy.className = "discovery-inbox-top-copy";
    eyebrow.className = "status-badge active";
    eyebrow.textContent = "Top recommendation";
    title.textContent = topRecommendation.title;
    meta.textContent = [
      topRecommendation.suggestedChannel?.label || "Choose when reviewing",
      scoreLabel,
    ].filter(Boolean).join(" · ");
    review.type = "button";
    review.textContent = "Review";
    review.addEventListener("click", () => openDiscoveryCardReview(topRecommendation.id));

    copy.append(eyebrow, title, meta);
    top.append(copy, review);
    summary.append(top);
  }

  summary.append(nextAction);
  return summary;
}

function getFilteredDiscoveryQueueCards(cards) {
  if (activeDiscoveryQueueFilter === "all") {
    return cards;
  }

  return cards.filter((card) => card.workflowItemId && getDiscoveryWorkflowState(card) === activeDiscoveryQueueFilter);
}

function buildContentDiscoveryCards() {
  const cards = [...buildPersistedDiscoveryCards()];
  const historyEvent = historyReview?.previewEvent;
  const upcomingFeeds = getEnabledUpcomingFeeds().slice(0, 3);
  const underusedContentTypes = getUnderusedContentTypes();

  if (historyEvent) {
    cards.push({
      id: createDiscoveryCardId("Today in History", historyEvent.id ?? historyEvent.title),
      source: "Today in History",
      title: historyEvent.title,
      description: historyEvent.summary,
      thumbnailUrl: null,
      thumbnailKind: null,
      sourceUrl: null,
      sourceName: "Today in History",
      isMock: false,
      suggestedChannel: createSuggestedChannel(historyReview?.channelId ?? null, historyReview?.channelLabel ?? "History channel"),
      suggestedReason: `Today matches ${historyReview?.dateLabel ?? historyReview?.dateKey ?? "the current date"} and the preview pool has ${historyReview?.totalEventsForDate ?? 0} item${historyReview?.totalEventsForDate === 1 ? "" : "s"}.`,
      suggestedContentType: "history",
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    });
  }

  const dailyTrivia = getDailyTriviaStatusSummary();

  if (dailyTriviaChallenge) {
    cards.push({
      id: createDiscoveryCardId("Daily Trivia", dailyTriviaChallenge.channelId ?? dailyTriviaChallenge.channelLabel ?? "ready"),
      source: "Daily Trivia",
      title: dailyTriviaChallenge.latestSession?.active ? "Daily Trivia is active now" : "Daily Trivia is ready",
      description: dailyTrivia.detail,
      thumbnailUrl: null,
      thumbnailKind: null,
      sourceUrl: null,
      sourceName: "Daily Trivia",
      isMock: false,
      suggestedChannel: createSuggestedChannel(dailyTriviaChallenge.channelId, dailyTriviaChallenge.channelLabel ?? dailyTriviaChallenge.channelId),
      suggestedReason: dailyTriviaChallenge.blockedReason
        ? `Review the current ${getBlockedReasonLabel(dailyTriviaChallenge.blockedReason)} block before the next trivia run.`
        : "Daily trivia is already configured and has status worth reviewing from Automation.",
      suggestedContentType: "trivia",
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    });
  }

  if (upcomingFeeds.length > 0) {
    const nextFeed = upcomingFeeds[0];
    cards.push({
      id: createDiscoveryCardId("Upcoming Scheduled Posts", upcomingFeeds.map((feed) => feed.id ?? feed.channelId).join("-")),
      source: "Upcoming Scheduled Posts",
      title: `${upcomingFeeds.length} scheduled post${upcomingFeeds.length === 1 ? "" : "s"} coming up`,
      description: upcomingFeeds
        .map((feed) => `${feed.contentType} in ${feed.channelLabel ?? getChannelLabel(feed.channelId)} every ${feed.cadenceMinutes}m`)
        .join(" | "),
      thumbnailUrl: null,
      thumbnailKind: null,
      sourceUrl: null,
      sourceName: "Upcoming Scheduled Posts",
      isMock: false,
      suggestedChannel: createSuggestedChannel(nextFeed.channelId, nextFeed.channelLabel ?? nextFeed.channelId),
      suggestedReason: `Next eligible post is ${formatTimestamp(nextFeed.nextRunAt ?? nextFeed.nextEligibleAt)} (${formatRelativeTime(nextFeed.nextRunAt ?? nextFeed.nextEligibleAt)}).`,
      suggestedContentType: nextFeed.contentType,
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    });
  }

  if (composerTemplates.length > 0) {
    const firstTemplateWithChannel = composerTemplates.find((template) => template.channelId);
    cards.push({
      id: createDiscoveryCardId("Saved Messages", composerTemplates.map((template) => template.id ?? template.name).join("-")),
      source: "Saved Messages",
      title: `${composerTemplates.length} saved message${composerTemplates.length === 1 ? "" : "s"} ready`,
      description: `Saved drafts: ${composerTemplates.slice(0, 3).map((template) => template.name).join(", ")}${composerTemplates.length > 3 ? ", ..." : ""}`,
      thumbnailUrl: null,
      thumbnailKind: null,
      sourceUrl: null,
      sourceName: "Saved Messages",
      isMock: false,
      suggestedChannel: createSuggestedChannel(firstTemplateWithChannel?.channelId ?? null, firstTemplateWithChannel?.channelId ? undefined : "Choose when reviewing"),
      suggestedReason: "Saved messages are reusable approved copy and can be reviewed in Create & Post before any post action.",
      suggestedContentType: "saved-message",
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    });
  }

  if (underusedContentTypes.length > 0) {
    const [contentType, count] = underusedContentTypes[0];
    const matchingProfile = channelProfiles.find((profile) => Array.isArray(profile.preferredContentTypes) && profile.preferredContentTypes.includes(contentType));

    cards.push({
      id: createDiscoveryCardId("Underused Content Types", contentType),
      source: "Underused Content Types",
      title: `Try more ${contentType}`,
      description: `Lightly used content types: ${underusedContentTypes.map(([entryContentType, entryCount]) => `${entryContentType} (${entryCount})`).join(", ")}.`,
      thumbnailUrl: null,
      thumbnailKind: null,
      sourceUrl: null,
      sourceName: "Underused Content Types",
      isMock: false,
      suggestedChannel: createSuggestedChannel(matchingProfile?.channelId ?? null, matchingProfile ? undefined : "Choose when generating"),
      suggestedReason: matchingProfile
        ? `${getChannelLabel(matchingProfile.channelId)} lists ${contentType} as a preferred content type, and provider metrics show it has only ${count} recorded use${count === 1 ? "" : "s"}.`
        : `Provider metrics show ${contentType} has only ${count} recorded use${count === 1 ? "" : "s"}.`,
      suggestedContentType: contentType,
      actions: [createDiscoveryReviewAction("Review", createDiscoveryCardNavigation())],
    });
  }

  if (SHOW_MOCK_DISCOVERY_CARDS) {
    cards.push(...buildMockContentDiscoveryCards());
  }

  return cards;
}

function createDiscoveryWorkflowMenu(item) {
  const workflowState = getDiscoveryWorkflowState(item);

  if (!item.workflowItemId) {
    return null;
  }

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const menu = document.createElement("div");
  const saveButton = createChannelActionButton("Save for later", () => void updateDiscoveryItemWorkflowState(item, "saved"));
  const reviewedButton = createChannelActionButton("Mark reviewed", () => void updateDiscoveryItemWorkflowState(item, "reviewed"));
  const dismissButton = createChannelActionButton("Dismiss", () => void updateDiscoveryItemWorkflowState(item, "dismissed"));
  const newButton = workflowState !== "new"
    ? createChannelActionButton("Move back to review", () => void updateDiscoveryItemWorkflowState(item, "new"))
    : null;

  details.className = "discovery-workflow-menu";
  summary.textContent = "More actions";
  summary.setAttribute("aria-label", "Discovery workflow actions");
  menu.className = "discovery-workflow-menu-items";
  menu.append(saveButton, reviewedButton, dismissButton);
  if (newButton) {
    menu.append(newButton);
  }
  details.append(summary, menu);
  return details;
}

function getDiscoveryConfidenceLabel(item) {
  if (item?.isMock) {
    return "Example suggestion";
  }

  if (item?.workflowItemId) {
    return item.safetyStatus === "needs-review" ? "Needs owner review" : "Saved suggestion";
  }

  return "Current dashboard suggestion";
}

function getDiscoveryFreshnessLabel(item) {
  const timestamp = item?.publishedAt ?? item?.discoveredAt ?? item?.workflowUpdatedAt;

  if (typeof timestamp === "number" && Number.isFinite(timestamp) && timestamp > 0) {
    return `${formatTimestamp(timestamp)} (${formatRelativeTime(timestamp)})`;
  }

  if (item?.sourceName === "Today in History") {
    return historyReview?.dateLabel ?? historyReview?.dateKey ?? "today's preview";
  }

  if (item?.sourceName === "Daily Trivia") {
    return "current automation status";
  }

  if (item?.sourceName === "Upcoming Scheduled Posts") {
    return "current feed schedule";
  }

  if (item?.sourceName === "Saved Messages") {
    return "current saved templates";
  }

  if (item?.sourceName === "Underused Content Types") {
    return "current metrics snapshot";
  }

  return null;
}

function createContentDiscoveryCard(item) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const heading = document.createElement("div");
  const badges = document.createElement("div");
  const sourceBadge = createStatusBadge(getDiscoverySourceLabel(item), "active");
  const contentTypeBadge = createStatusBadge(item.suggestedContentType, "neutral");
  const scoreLabel = getDiscoveryScoreLabel(item.score);
  const scoreBadge = scoreLabel ? createStatusBadge(scoreLabel, "neutral") : null;
  const workflowState = getDiscoveryWorkflowState(item);
  const stateBadge = item.workflowItemId ? createStatusBadge(workflowState, getDiscoveryWorkflowStateTone(workflowState)) : null;
  const demoBadge = item.isMock ? createStatusBadge(item.demoLabel || "Demo Preview", "neutral") : null;
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const thumbnail = createDiscoveryThumbnail(item);
  const context = document.createElement("dl");
  const channelTerm = document.createElement("dt");
  const channelDetail = document.createElement("dd");
  const reasonTerm = document.createElement("dt");
  const reasonDetail = document.createElement("dd");
  const sourceTerm = document.createElement("dt");
  const sourceDetail = document.createElement("dd");
  const confidenceTerm = document.createElement("dt");
  const confidenceDetail = document.createElement("dd");
  const freshnessTerm = document.createElement("dt");
  const freshnessDetail = document.createElement("dd");
  const actions = document.createElement("div");
  const reviewAction = item.actions.find((entry) => entry.id === "review") ?? item.actions[0];
  const action = document.createElement("button");
  const workflowMenu = createDiscoveryWorkflowMenu(item);

  card.className = "mission-found-card mission-discovery-card";
  card.classList.toggle("is-mock", Boolean(item.isMock));
  header.className = "mission-discovery-card-header";
  heading.className = "mission-discovery-card-heading";
  badges.className = "mission-discovery-badges";
  context.className = "mission-discovery-context";
  actions.className = "mission-discovery-actions";
  title.textContent = item.title;
  description.textContent = item.description;
  channelTerm.textContent = "Suggested channel";
  channelDetail.textContent = item.suggestedChannel.label;
  reasonTerm.textContent = "Why CDawg suggested it";
  reasonDetail.textContent = formatDiscoveryReason(item.suggestedReason);
  reasonDetail.className = "mission-discovery-reason";
  sourceTerm.textContent = "Source";
  sourceDetail.textContent = getDiscoverySourceLabel(item);
  confidenceTerm.textContent = "Confidence";
  confidenceDetail.textContent = getDiscoveryConfidenceLabel(item);
  freshnessTerm.textContent = "Freshness";
  freshnessDetail.textContent = getDiscoveryFreshnessLabel(item) ?? "current dashboard refresh";
  action.type = "button";
  action.className = "secondary";
  action.textContent = "Preview";
  action.addEventListener("click", () => openDiscoveryCardReview(item.id));

  heading.append(title, description);
  badges.append(sourceBadge);
  if (scoreBadge) {
    badges.append(scoreBadge);
  }
  if (stateBadge) {
    badges.append(stateBadge);
  }
  if (demoBadge) {
    badges.append(demoBadge);
  }
  header.append(heading, badges);
  if (thumbnail) {
    card.append(thumbnail);
  }
  context.append(
    channelTerm,
    channelDetail,
    sourceTerm,
    sourceDetail,
    confidenceTerm,
    confidenceDetail,
    freshnessTerm,
    freshnessDetail,
    reasonTerm,
    reasonDetail,
  );
  actions.append(contentTypeBadge, action);
  if (workflowMenu) {
    actions.append(workflowMenu);
  }
  card.append(header, context, actions);
  return card;
}

function openDiscoveryCardReview(cardId) {
  selectedDiscoveryCardId = cardId || null;
  setActiveControlTab("push");
  setActiveContentStudioMode("discovery");
  window.requestAnimationFrame(() => {
    document.querySelector("#content-discovery-review")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function createDiscoveryReviewListCard(item) {
  const card = createContentDiscoveryCard(item);
  const action = card.querySelector("button");

  if (action) {
    action.textContent = "Preview";
  }

  return card;
}

function createDiscoveryQueueFilters(cards) {
  const filters = document.createElement("div");
  const counts = getDiscoveryQueueCounts(cards);

  filters.className = "content-discovery-filter-chips";

  for (const filter of discoveryQueueFilters) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary";
    button.textContent = `${filter.label} (${counts[filter.id] ?? 0})`;
    button.classList.toggle("is-active", activeDiscoveryQueueFilter === filter.id);
    button.setAttribute("aria-pressed", String(activeDiscoveryQueueFilter === filter.id));
    button.addEventListener("click", () => {
      activeDiscoveryQueueFilter = filter.id;
      selectedDiscoveryCardId = null;
      renderContentDiscoveryReview();
    });
    filters.append(button);
  }

  return filters;
}

function getDiscoveryGeneratedContentType(card) {
  const supportedTypes = new Set(["history", "joke", "prompt", "fact", "trivia"]);
  return supportedTypes.has(card?.suggestedContentType) ? card.suggestedContentType : "prompt";
}

function buildDiscoveryMessageDraft(card) {
  const demoPrefix = card.isMock ? ["Demo Preview mock card. Review and rewrite before using."] : [];
  return [
    ...demoPrefix,
    `Found from ${getDiscoverySourceLabel(card)}: ${card.title}`,
    card.description,
    `Suggested for ${card.suggestedChannel?.label ?? "a channel"} because ${card.suggestedReason}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function updateDiscoveryItemWorkflowState(card, state, options = {}) {
  if (!card?.workflowItemId) {
    return;
  }

  try {
    await updateDiscoveryItemWorkflowStateById(card.workflowItemId, state, options);
    await loadDiscoveryItems();
  } catch (error) {
    console.warn(`[discovery] state update failed: ${error.message}`);
  }
}

async function updateDiscoveryItemWorkflowStateById(itemId, state, options = {}) {
  if (!itemId) {
    return null;
  }

  return fetchJson("/api/discovery/items/state", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemId,
      state,
      ...(options.preparedMessage ? { preparedMessage: options.preparedMessage } : {}),
      ...(options.note ? { note: options.note } : {}),
    }),
  });
}

async function prepareDiscoveryMessage(card) {
  if (!card) {
    return;
  }

  const draft = buildDiscoveryMessageDraft(card);

  if (card.suggestedChannel?.id) {
    composerForm.elements.channelId.value = card.suggestedChannel.id;
    syncDiscordMetadataSelections();
  }

  setComposerMessage(draft);
  setComposerStatus("Discovery draft prepared. Review before posting.");
  if (card.workflowItemId) {
    await updateDiscoveryItemWorkflowState(card, "prepared", {
      preparedMessage: draft,
    });
    setActivePreparedDiscoveryItem(card.workflowItemId);
  } else {
    setActivePreparedDiscoveryItem(null);
  }
  setActiveContentStudioMode("write");
}

function prepareDiscoveryGeneration(card) {
  if (!card) {
    return;
  }

  const suggestedType = getDiscoveryGeneratedContentType(card);
  manualPushForm.elements.contentType.value = suggestedType;

  if (card.suggestedChannel?.id && channelPresets.some((preset) => preset.channelId === card.suggestedChannel.id)) {
    manualPushForm.elements.channelPreset.value = card.suggestedChannel.id;
    syncManualPushPresetSelection(false);
  }

  manualPushForm.elements.topicOverride.value = card.title || "";
  setManualPushStatus("Discovery idea prepared. Review before sending.");
  setActiveContentStudioMode("generate");
}

function createContentDiscoveryReviewDetail(card) {
  const wrapper = document.createElement("article");
  const header = document.createElement("div");
  const heading = document.createElement("div");
  const badges = document.createElement("div");
  const sourceBadge = createStatusBadge(getDiscoverySourceLabel(card), "active");
  const contentTypeBadge = createStatusBadge(card.suggestedContentType, "neutral");
  const scoreLabel = getDiscoveryScoreLabel(card.score);
  const scoreBadge = scoreLabel ? createStatusBadge(scoreLabel, "neutral") : null;
  const workflowState = getDiscoveryWorkflowState(card);
  const stateBadge = card.workflowItemId ? createStatusBadge(workflowState, getDiscoveryWorkflowStateTone(workflowState)) : null;
  const demoBadge = card.isMock ? createStatusBadge(card.demoLabel || "Demo Preview", "neutral") : null;
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const body = document.createElement("div");
  const media = createDiscoveryThumbnail(card, { large: true, alwaysShow: true });
  const details = document.createElement("dl");
  const channelTerm = document.createElement("dt");
  const channelDetail = document.createElement("dd");
  const reasonTerm = document.createElement("dt");
  const reasonDetail = document.createElement("dd");
  const sourceTerm = document.createElement("dt");
  const sourceDetail = document.createElement("dd");
  const confidenceTerm = document.createElement("dt");
  const confidenceDetail = document.createElement("dd");
  const freshnessTerm = document.createElement("dt");
  const freshnessDetail = document.createElement("dd");
  const scoreTerm = document.createElement("dt");
  const scoreDetail = document.createElement("dd");
  const typeTerm = document.createElement("dt");
  const typeDetail = document.createElement("dd");
  const preparedDraft = document.createElement("div");
  const preparedDraftTitle = document.createElement("h4");
  const preparedDraftPreview = document.createElement("p");
  const actions = document.createElement("div");
  const prepareButton = document.createElement("button");
  const generateButton = document.createElement("button");
  const backButton = document.createElement("button");
  const workflowMenu = createDiscoveryWorkflowMenu(card);

  wrapper.className = "content-discovery-review-card";
  wrapper.classList.toggle("is-mock", Boolean(card.isMock));
  header.className = "content-discovery-review-header";
  heading.className = "content-discovery-review-heading";
  badges.className = "content-discovery-review-badges";
  body.className = "content-discovery-review-layout";
  details.className = "mission-discovery-context content-discovery-review-context";
  preparedDraft.className = "content-discovery-prepared-draft";
  actions.className = "content-discovery-review-actions";

  title.textContent = card.title;
  description.textContent = card.description;
  channelTerm.textContent = "Suggested channel";
  channelDetail.textContent = card.suggestedChannel?.label ?? "Choose when preparing";
  reasonTerm.textContent = "Why CDawg suggested it";
  reasonDetail.textContent = formatDiscoveryReason(card.suggestedReason);
  sourceTerm.textContent = "Source";
  sourceDetail.textContent = getDiscoverySourceLabel(card);
  confidenceTerm.textContent = "Confidence";
  confidenceDetail.textContent = getDiscoveryConfidenceLabel(card);
  freshnessTerm.textContent = "Freshness";
  freshnessDetail.textContent = getDiscoveryFreshnessLabel(card) ?? "current dashboard refresh";
  scoreTerm.textContent = "Review detail";
  scoreDetail.textContent = scoreLabel || "No extra ranking detail";
  typeTerm.textContent = "Suggested content type";
  typeDetail.textContent = card.suggestedContentType;
  preparedDraftTitle.textContent = "Prepared Draft";
  preparedDraftPreview.textContent = card.preparedMessage || "";

  prepareButton.type = "button";
  prepareButton.textContent = "Use as Draft";
  prepareButton.addEventListener("click", () => void prepareDiscoveryMessage(card));

  generateButton.type = "button";
  generateButton.className = "secondary";
  generateButton.textContent = "Use as Post Now Draft";
  generateButton.addEventListener("click", () => prepareDiscoveryGeneration(card));

  if (isSafeDiscoveryUrl(card.sourceUrl) && !card.isMock) {
    const sourceButton = document.createElement("button");
    sourceButton.type = "button";
    sourceButton.className = "secondary";
    sourceButton.textContent = "Open Source";
    sourceButton.addEventListener("click", () => {
      window.open(card.sourceUrl, "_blank", "noopener,noreferrer");
    });
    actions.append(sourceButton);
  }

  backButton.type = "button";
  backButton.className = "secondary";
  backButton.textContent = "Back to Ideas";
  backButton.addEventListener("click", () => {
    selectedDiscoveryCardId = null;
    setActiveControlTab("push");
    setActiveContentStudioMode("discovery");
    renderContentDiscoveryReview();
    window.requestAnimationFrame(() => {
      document.querySelector("#content-discovery-review")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  badges.append(sourceBadge, contentTypeBadge);
  if (scoreBadge) {
    badges.append(scoreBadge);
  }
  if (stateBadge) {
    badges.append(stateBadge);
  }
  if (demoBadge) {
    badges.append(demoBadge);
  }
  heading.append(title, description);
  header.append(heading, badges);
  details.append(
    channelTerm,
    channelDetail,
    sourceTerm,
    sourceDetail,
    confidenceTerm,
    confidenceDetail,
    freshnessTerm,
    freshnessDetail,
    reasonTerm,
    reasonDetail,
    scoreTerm,
    scoreDetail,
    typeTerm,
    typeDetail,
  );
  actions.prepend(prepareButton, generateButton);
  if (card.workflowItemId) {
    actions.append(createChannelActionButton("Dismiss", () => void updateDiscoveryItemWorkflowState(card, "dismissed")));
  }
  if (workflowMenu) {
    actions.append(workflowMenu);
  }
  actions.append(backButton);
  body.append(media, details);
  wrapper.append(header, body);
  if (card.preparedMessage) {
    preparedDraft.append(preparedDraftTitle, preparedDraftPreview);
    wrapper.append(preparedDraft);
  }
  wrapper.append(actions);
  return wrapper;
}

function renderContentDiscoveryReview() {
  if (!contentDiscoveryReviewPanel) {
    return;
  }

  const discoveryCards = buildContentDiscoveryCards();
  const selectedCard = discoveryCards.find((card) => card.id === selectedDiscoveryCardId) ?? null;
  contentDiscoveryReviewPanel.replaceChildren();

  if (selectedCard) {
    contentDiscoveryReviewPanel.append(createContentDiscoveryReviewDetail(selectedCard));
    return;
  }

  const intro = document.createElement("p");
  intro.className = "content-discovery-review-intro";
  intro.textContent = "These are suggestions for review. Preview one, turn it into a draft, or dismiss it. Nothing posts automatically.";
  contentDiscoveryReviewPanel.append(intro);
  contentDiscoveryReviewPanel.append(createDiscoveryQueueFilters(discoveryCards));

  if (discoveryItemsLoadError) {
    const warning = document.createElement("p");
    warning.className = "channel-operation-empty";
    warning.textContent = `Persisted discovery items failed to load. Showing local suggestions only. ${discoveryItemsLoadError}`;
    contentDiscoveryReviewPanel.append(warning);
  }

  const filteredCards = getFilteredDiscoveryQueueCards(discoveryCards);

  if (filteredCards.length === 0) {
    const emptyState = document.createElement("p");
    const activeFilter = discoveryQueueFilters.find((filter) => filter.id === activeDiscoveryQueueFilter);
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = activeFilter?.empty ?? "No discoveries in this queue.";
    contentDiscoveryReviewPanel.append(emptyState);
    return;
  }

  const list = document.createElement("div");
  list.className = "content-discovery-review-list";

  for (const card of filteredCards) {
    list.append(createDiscoveryReviewListCard(card));
  }

  contentDiscoveryReviewPanel.append(list);
}

function setRssDiscoverySourceStatus(message, kind = "neutral") {
  if (!rssDiscoverySourceStatus) {
    return;
  }

  rssDiscoverySourceStatus.textContent = message;
  rssDiscoverySourceStatus.className = `form-status ${kind}`;
}

function getRssDiscoverySources() {
  return discoverySources.filter((source) => source?.type === "rss");
}

function getDiscoverySourceChannelLabel(channelId) {
  const channel = guildChannels.find((entry) => entry.id === channelId);
  return channel ? `#${channel.name}` : channelId;
}

function normalizeSourceTag(value) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

function getSelectedContentSourceProfile() {
  const channelId = contentSourceLibraryProfileSelect?.value || "";
  return channelId ? channelProfiles.find((profile) => profile.channelId === channelId) ?? null : null;
}

function getRecommendedContentSourceCategories(profile = getSelectedContentSourceProfile()) {
  return contentSourceCategoryRecommendationsByPurpose[profile?.purpose] ?? contentSourceCategoryRecommendationsByPurpose.custom;
}

function isBlockedSourceError(errorMessage = "") {
  return /\b(?:403|forbidden|blocked|access denied)\b/i.test(errorMessage);
}

function getSourceHealthTone(healthStatus) {
  if (healthStatus === "Working") {
    return "active";
  }

  if (healthStatus === "Blocked" || healthStatus === "Last failed") {
    return "blocked";
  }

  return "neutral";
}

function getSavedDiscoverySourceHealth(source) {
  if (source.lastError) {
    return isBlockedSourceError(source.lastError) ? "Blocked" : "Last failed";
  }

  if (source.lastRefreshAt) {
    return "Working";
  }

  return "Untested";
}

function getRefreshErrorMessage(errorMessage = "") {
  return isBlockedSourceError(errorMessage)
    ? "This source blocked the refresh. Try another source or use manual RSS."
    : errorMessage;
}

function getContentSourceLibraryItems() {
  if (activeContentSourceLibraryCategory === "Recommended") {
    const recommendedCategories = new Set(getRecommendedContentSourceCategories());
    return contentSourceLibraryCatalog.filter((source) => recommendedCategories.has(source.category));
  }

  return contentSourceLibraryCatalog.filter((source) => source.category === activeContentSourceLibraryCategory);
}

function renderContentSourceLibraryProfileOptions() {
  if (!contentSourceLibraryProfileSelect) {
    return;
  }

  const selectedValue = contentSourceLibraryProfileSelect.value;
  contentSourceLibraryProfileSelect.replaceChildren();

  const anyOption = document.createElement("option");
  anyOption.value = "";
  anyOption.textContent = "Any channel profile";
  contentSourceLibraryProfileSelect.append(anyOption);

  for (const profile of channelProfiles) {
    const option = document.createElement("option");
    option.value = profile.channelId;
    option.textContent = `${getChannelProfileLabel(profile)} - ${getChannelProfilePurposeLabel(profile)}`;
    contentSourceLibraryProfileSelect.append(option);
  }

  if ([...contentSourceLibraryProfileSelect.options].some((option) => option.value === selectedValue)) {
    contentSourceLibraryProfileSelect.value = selectedValue;
  }
}

function renderContentSourceLibraryRecommendations() {
  if (!contentSourceLibraryRecommendations) {
    return;
  }

  const profile = getSelectedContentSourceProfile();
  const recommendedCategories = getRecommendedContentSourceCategories(profile);
  const lead = document.createElement("span");
  lead.textContent = profile
    ? `Recommended for ${getChannelProfileLabel(profile)}:`
    : "Recommended categories:";

  contentSourceLibraryRecommendations.replaceChildren(
    lead,
    ...recommendedCategories.map((category) => createStatusBadge(category, "neutral")),
  );
}

function renderContentSourceLibraryCategories() {
  if (!contentSourceLibraryCategories) {
    return;
  }

  contentSourceLibraryCategories.replaceChildren();

  for (const category of ["Recommended", ...contentSourceCatalogCategories]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary";
    button.textContent = category;
    button.classList.toggle("is-active", activeContentSourceLibraryCategory === category);
    button.setAttribute("aria-pressed", String(activeContentSourceLibraryCategory === category));
    button.addEventListener("click", () => {
      activeContentSourceLibraryCategory = category;
      renderContentSourceLibrary();
    });
    contentSourceLibraryCategories.append(button);
  }
}

function getContentSourcePayload(source) {
  const profile = getSelectedContentSourceProfile();
  const tags = [
    normalizeSourceTag(source.category),
    normalizeSourceTag(source.sourceBadge),
  ].filter(Boolean);

  return {
    type: "rss",
    enabled: true,
    name: source.name,
    url: source.rssUrl,
    defaultTags: [...new Set(tags)],
    preferredChannelIds: profile?.channelId ? [profile.channelId] : [],
    lastRefreshAt: null,
    lastError: null,
  };
}

function createContentSourceLibraryCard(source) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const heading = document.createElement("div");
  const title = document.createElement("h4");
  const category = createStatusBadge(source.category, "neutral");
  const sourceBadge = createStatusBadge(source.sourceBadge, "active");
  const healthBadge = createStatusBadge(source.healthStatus || "Untested", getSourceHealthTone(source.healthStatus || "Untested"));
  const description = document.createElement("p");
  const url = document.createElement("small");
  const actions = document.createElement("div");
  const selectButton = createChannelActionButton("Select Source", () => void saveContentSourceFromLibrary(source));

  card.className = "content-source-card";
  header.className = "content-source-card-header";
  heading.className = "content-source-card-heading";
  actions.className = "channel-operation-actions";
  title.textContent = source.name;
  description.textContent = source.description;
  url.textContent = source.rssUrl;

  heading.append(title, description);
  header.append(heading, category, sourceBadge, healthBadge);
  actions.append(selectButton);
  card.append(header, url, actions);
  return card;
}

function renderContentSourceLibrary() {
  if (!contentSourceLibraryList) {
    return;
  }

  renderContentSourceLibraryProfileOptions();
  renderContentSourceLibraryRecommendations();
  renderContentSourceLibraryCategories();
  contentSourceLibraryList.replaceChildren();

  for (const source of getContentSourceLibraryItems()) {
    contentSourceLibraryList.append(createContentSourceLibraryCard(source));
  }
}

function showContentSourceLibrary() {
  if (!contentSourceLibrary) {
    return;
  }

  contentSourceLibrary.hidden = false;
  renderContentSourceLibrary();
  setRssDiscoverySourceStatus("Choose a catalog source to save it. Refresh remains manual.");
}

function renderDiscoverySourceChannelOptions(selectedChannelIds = []) {
  if (!rssDiscoverySourceForm) {
    return;
  }

  const select = rssDiscoverySourceForm.elements.preferredChannelIds;
  const selectedValues = new Set(selectedChannelIds);
  select.replaceChildren();

  if (guildChannels.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No channel metadata loaded";
    option.disabled = true;
    select.append(option);
    return;
  }

  for (const channel of guildChannels) {
    const option = document.createElement("option");
    option.value = channel.id;
    option.textContent = `#${channel.name}`;
    option.selected = selectedValues.has(channel.id);
    select.append(option);
  }
}

function resetRssDiscoverySourceForm() {
  if (!rssDiscoverySourceForm) {
    return;
  }

  rssDiscoverySourceForm.reset();
  rssDiscoverySourceForm.elements.id.value = "";
  rssDiscoverySourceForm.hidden = true;
  if (deleteRssDiscoverySourceButton) {
    deleteRssDiscoverySourceButton.hidden = true;
  }
  renderDiscoverySourceChannelOptions();
}

function showRssDiscoverySourceForm(source = null) {
  if (!rssDiscoverySourceForm) {
    return;
  }

  if (advancedSourceSetup) {
    advancedSourceSetup.open = true;
  }
  rssDiscoverySourceForm.hidden = false;
  rssDiscoverySourceForm.elements.id.value = source?.id ?? "";
  rssDiscoverySourceForm.elements.name.value = source?.name ?? "";
  rssDiscoverySourceForm.elements.url.value = source?.url ?? "";
  rssDiscoverySourceForm.elements.enabled.value = String(source?.enabled !== false);
  rssDiscoverySourceForm.elements.defaultTags.value = Array.isArray(source?.defaultTags) ? source.defaultTags.join(", ") : "";
  renderDiscoverySourceChannelOptions(Array.isArray(source?.preferredChannelIds) ? source.preferredChannelIds : []);
  if (deleteRssDiscoverySourceButton) {
    deleteRssDiscoverySourceButton.hidden = !source?.id;
  }
  setRssDiscoverySourceStatus(source ? "Editing RSS source. Use manual refresh when ready." : "New RSS source. Save it, then refresh manually when ready.");
}

function getRssDiscoverySourceFormPayload() {
  const form = rssDiscoverySourceForm;
  const name = form.elements.name.value.trim();
  const url = form.elements.url.value.trim();
  const selectedChannelIds = Array.from(form.elements.preferredChannelIds.selectedOptions)
    .map((option) => option.value)
    .filter(Boolean);
  const defaultTags = form.elements.defaultTags.value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  if (!name) {
    return {
      ok: false,
      error: "Name is required.",
    };
  }

  if (!isSafeDiscoveryUrl(url)) {
    return {
      ok: false,
      error: "RSS URL must be a valid https URL.",
    };
  }

  if (defaultTags.some((tag) => !/^[a-z0-9][a-z0-9_-]{0,39}$/.test(tag))) {
    return {
      ok: false,
      error: "Tags must use lowercase letters, numbers, dashes, or underscores.",
    };
  }

  return {
    ok: true,
    value: {
      ...(form.elements.id.value ? { id: form.elements.id.value } : {}),
      type: "rss",
      enabled: form.elements.enabled.value === "true",
      name,
      url,
      defaultTags: [...new Set(defaultTags)],
      preferredChannelIds: [...new Set(selectedChannelIds)],
      lastRefreshAt: null,
      lastError: null,
    },
  };
}

async function saveRssDiscoverySourcePayload(payload) {
  const data = await fetchJson("/api/discovery/sources/upsert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  discoverySources = Array.isArray(data.sources) ? data.sources : [];
  discoverySourcesLoadError = null;
  renderDiscoverySources();
  return data;
}

async function saveContentSourceFromLibrary(source) {
  setRssDiscoverySourceStatus(`Saving ${source.name} from the source library...`);

  try {
    await saveRssDiscoverySourcePayload(getContentSourcePayload(source));
    setRssDiscoverySourceStatus(`${source.name} saved as an RSS source. Refresh manually when ready.`, "success");
  } catch (error) {
    setRssDiscoverySourceStatus(`Source library save failed: ${error.message}`, "error");
  }
}

function createDiscoverySourceCard(source) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const badge = createStatusBadge(source.enabled === false ? "Disabled" : "Enabled", source.enabled === false ? "neutral" : "active");
  const healthStatus = getSavedDiscoverySourceHealth(source);
  const healthBadge = createStatusBadge(healthStatus, getSourceHealthTone(healthStatus));
  const url = document.createElement("p");
  const meta = document.createElement("p");
  const status = document.createElement("p");
  const actions = document.createElement("div");

  card.className = "channel-operation-card compact discovery-source-card";
  header.className = "channel-operation-card-header";
  actions.className = "channel-operation-actions";
  title.textContent = source.name;
  url.textContent = source.url || "No URL set";
  meta.textContent = [
    `Tags: ${Array.isArray(source.defaultTags) && source.defaultTags.length > 0 ? source.defaultTags.join(", ") : "none"}`,
    `Preferred channels: ${Array.isArray(source.preferredChannelIds) && source.preferredChannelIds.length > 0 ? source.preferredChannelIds.map(getDiscoverySourceChannelLabel).join(", ") : "none"}`,
  ].join(" | ");
  status.textContent = [
    source.lastRefreshAt ? `Last refresh: ${formatTimestamp(source.lastRefreshAt)} (${formatRelativeTime(source.lastRefreshAt)})` : "Not refreshed yet",
    source.lastError ? `Last error: ${getRefreshErrorMessage(source.lastError)}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  actions.append(
    createChannelActionButton("Refresh Source", () => void refreshRssDiscoverySources(source.id), source.enabled === false),
    createChannelActionButton("Edit", () => showRssDiscoverySourceForm(source)),
    createChannelActionButton("Delete", () => void deleteRssDiscoverySource(source.id)),
  );
  header.append(title, badge, healthBadge);
  card.append(header, url, meta, status, actions);
  return card;
}

function renderDiscoverySources() {
  if (!rssDiscoverySourcesList) {
    return;
  }

  rssDiscoverySourcesList.replaceChildren();

  if (discoverySourcesLoadError) {
    const error = document.createElement("p");
    error.className = "channel-operation-empty";
    error.textContent = `Discovery sources failed to load. ${discoverySourcesLoadError}`;
    rssDiscoverySourcesList.append(error);
    return;
  }

  const rssSources = getRssDiscoverySources();

  if (rssSources.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No RSS sources configured yet.";
    rssDiscoverySourcesList.append(emptyState);
    return;
  }

  for (const source of rssSources) {
    rssDiscoverySourcesList.append(createDiscoverySourceCard(source));
  }
}

function getDiscoveryRefreshSummary(data) {
  const results = Array.isArray(data.results) ? data.results : [];

  if (results.length === 0) {
    return "No RSS sources were refreshed.";
  }

  const succeeded = results.filter((result) => result.ok).length;
  const itemCount = results.reduce((total, result) => total + (Number.isFinite(result.itemCount) ? result.itemCount : 0), 0);
  const failedResults = results.filter((result) => !result.ok);
  const failureSummary = failedResults.length > 0
    ? ` ${failedResults.length} failed: ${failedResults.map((result) => getRefreshErrorMessage(result.error || result.sourceId)).join("; ")}`
    : "";

  return `Manual refresh complete: ${succeeded}/${results.length} source${results.length === 1 ? "" : "s"} refreshed, ${itemCount} discovery item${itemCount === 1 ? "" : "s"} loaded.${failureSummary}`;
}

async function refreshRssDiscoverySources(sourceId = null) {
  setRssDiscoverySourceStatus(sourceId ? "Refreshing RSS source manually..." : "Refreshing enabled RSS sources manually...");

  try {
    const data = await fetchJson("/api/discovery/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sourceId ? { sourceId } : {}),
    });
    await Promise.all([loadDiscoverySources(), loadDiscoveryItems()]);
    setRssDiscoverySourceStatus(getDiscoveryRefreshSummary(data), data.ok === false ? "error" : "success");
  } catch (error) {
    await Promise.all([loadDiscoverySources(), loadDiscoveryItems()]);
    setRssDiscoverySourceStatus(`Manual RSS refresh failed: ${getRefreshErrorMessage(error.message)}`, "error");
  }
}

async function submitRssDiscoverySource(event) {
  event.preventDefault();
  const payload = getRssDiscoverySourceFormPayload();

  if (!payload.ok) {
    setRssDiscoverySourceStatus(payload.error, "error");
    return;
  }

  try {
    const data = await saveRssDiscoverySourcePayload(payload.value);
    showRssDiscoverySourceForm(data.source);
    setRssDiscoverySourceStatus("RSS source saved. Refresh manually when ready.", "success");
  } catch (error) {
    setRssDiscoverySourceStatus(`RSS source save failed: ${error.message}`, "error");
  }
}

async function deleteRssDiscoverySource(sourceId = rssDiscoverySourceForm?.elements.id.value) {
  if (!sourceId) {
    setRssDiscoverySourceStatus("Choose an RSS source before deleting.", "error");
    return;
  }

  try {
    const data = await fetchJson("/api/discovery/sources/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: sourceId }),
    });
    discoverySources = Array.isArray(data.sources) ? data.sources : discoverySources.filter((source) => source.id !== sourceId);
    discoverySourcesLoadError = null;
    renderDiscoverySources();
    resetRssDiscoverySourceForm();
    setRssDiscoverySourceStatus("RSS source deleted.", "success");
  } catch (error) {
    setRssDiscoverySourceStatus(`RSS source delete failed: ${error.message}`, "error");
  }
}

function renderMissionFoundItems() {
  if (!missionFoundList) {
    return;
  }

  const discoveryCards = getMissionDiscoveryCards();

  if (missionFoundCount) {
    missionFoundCount.textContent = `${discoveryCards.length} find${discoveryCards.length === 1 ? "" : "s"}`;
    missionFoundCount.className = `status-badge ${discoveryCards.length > 0 ? "active" : "neutral"}`;
  }
  missionFoundList.replaceChildren();
  missionFoundList.append(createDiscoveryInboxSummary(buildContentDiscoveryCards()));

  if (discoveryCards.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "mission-found-empty channel-operation-empty";
    emptyState.textContent = discoveryItemsLoadError
      ? `Persisted discovery items failed to load, so no saved discovery finds can be shown. ${discoveryItemsLoadError}`
      : "No real content finds are available yet. Add RSS discovery sources, create scheduled posts, save message templates, or configure Daily Trivia to give Mission Control real opportunities to surface.";
    missionFoundList.append(emptyState);
    if (activeContentStudioMode === "discovery") {
      renderContentDiscoveryReview();
    }
    return;
  }

  appendCompressedCardList(missionFoundList, discoveryCards, createContentDiscoveryCard, {
    visibleLimit: 3,
    summaryLabel: (count) => `View all ${count} finds`,
  });

  if (discoveryItemsLoadError) {
    const warning = document.createElement("p");
    warning.className = "mission-found-empty channel-operation-empty";
    warning.textContent = `Persisted discovery items failed to load. Showing local suggestions only. ${discoveryItemsLoadError}`;
    missionFoundList.append(warning);
  }

  if (activeContentStudioMode === "discovery") {
    renderContentDiscoveryReview();
  }
}

function createMissionProfileCard(item) {
  const { profile, completeness } = item;
  const card = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const badges = document.createElement("div");
  const meta = document.createElement("dl");
  const contentTypes = document.createElement("p");
  const nextStep = document.createElement("p");
  const actions = document.createElement("div");
  const reviewButton = document.createElement("button");
  const improveButton = document.createElement("button");

  card.className = "mission-profile-card";
  if (completeness.score >= 100) {
    card.classList.add("is-complete");
  }

  header.className = "mission-profile-card-header";
  badges.className = "channel-operation-badges";
  meta.className = "mission-profile-meta";
  contentTypes.className = "mission-profile-content-types";
  nextStep.className = "mission-profile-next-step";
  actions.className = "mission-profile-actions";

  title.textContent = getChannelProfileLabel(profile);
  badges.append(
    createStatusBadge(`${completeness.score}% complete`, completeness.score >= 100 ? "active" : completeness.score < 50 ? "blocked" : "neutral"),
    createStatusBadge(`${completeness.missingPieces.length} missing`, completeness.missingPieces.length > 0 ? "neutral" : "active"),
  );

  meta.append(
    createChannelSetupDetail("Purpose", getChannelProfilePurposeLabel(profile)),
    createChannelSetupDetail("Access", getChannelProfileAccessLabel(profile)),
    createChannelSetupDetail("Tone", getChannelProfileToneLabel(profile)),
  );

  contentTypes.textContent = `Preferred content: ${Array.isArray(profile.preferredContentTypes) && profile.preferredContentTypes.length > 0 ? profile.preferredContentTypes.join(", ") : "not set"}`;
  nextStep.textContent = `Next step: ${completeness.recommendedNextStep.label}`;

  reviewButton.type = "button";
  reviewButton.className = "secondary";
  reviewButton.textContent = "Review Setup";
  reviewButton.addEventListener("click", () => navigateMissionAction(createChannelProfileMissionNavigation(profile.channelId)));

  improveButton.type = "button";
  improveButton.className = "secondary";
  improveButton.textContent = "Improve Setup";
  improveButton.addEventListener("click", () => navigateMissionAction(createChannelProfileMissionNavigation(profile.channelId)));

  actions.append(reviewButton, improveButton);
  header.append(title, badges);
  card.append(header, meta, contentTypes, nextStep, actions);
  return card;
}

function renderMissionChannelProfiles() {
  if (!missionChannelProfilesList) {
    return;
  }

  const items = getChannelProfileCommandItems();
  const completeCount = items.filter((item) => item.completeness.score >= 100).length;
  const incompleteCount = items.length - completeCount;

  if (missionChannelProfilesCount) {
    missionChannelProfilesCount.textContent = `${items.length} profile${items.length === 1 ? "" : "s"}`;
    missionChannelProfilesCount.className = `status-badge ${items.length > 0 ? "active" : "neutral"}`;
  }

  if (missionProfileCompleteCount) {
    missionProfileCompleteCount.textContent = String(completeCount);
  }

  if (missionProfileIncompleteCount) {
    missionProfileIncompleteCount.textContent = String(incompleteCount);
  }

  missionChannelProfilesList.replaceChildren();

  if (items.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "CDawg does not understand any channels yet. Set up your first channel.";
    missionChannelProfilesList.append(emptyState);
    return;
  }

  for (const item of items) {
    missionChannelProfilesList.append(createMissionProfileCard(item));
  }
}

function isChannelSetupRoleRecommended(accessMode) {
  return accessMode === "opt-in" || accessMode === "private";
}

function renderChannelSetupMetadataOptions() {
  if (!channelSetupChannel || !channelSetupRole) {
    return;
  }

  const previousChannelId = channelSetupChannel.value;
  const previousRoleId = channelSetupRole.value;

  channelSetupChannel.replaceChildren();
  const channelPlaceholder = document.createElement("option");
  channelPlaceholder.value = "";
  channelPlaceholder.textContent = guildChannels.length > 0 ? "Choose channel..." : "No Discord channels loaded";
  channelSetupChannel.append(channelPlaceholder);

  for (const channel of guildChannels) {
    const option = document.createElement("option");
    option.value = channel.id;
    option.textContent = `#${channel.name}`;
    channelSetupChannel.append(option);
  }

  channelSetupChannel.value = guildChannels.some((channel) => channel.id === previousChannelId) ? previousChannelId : "";

  channelSetupRole.replaceChildren();
  const rolePlaceholder = document.createElement("option");
  rolePlaceholder.value = "";
  rolePlaceholder.textContent = guildRoles.length > 0 ? "Choose role..." : "No Discord roles loaded";
  channelSetupRole.append(rolePlaceholder);

  for (const role of guildRoles) {
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    channelSetupRole.append(option);
  }

  if (previousRoleId && !guildRoles.some((role) => role.id === previousRoleId)) {
    ensureChannelSetupRoleOption(previousRoleId);
  }

  channelSetupRole.value = previousRoleId && Array.from(channelSetupRole.options).some((option) => option.value === previousRoleId) ? previousRoleId : "";
  renderChannelSetupAssistant();
}

function getSavedChannelProfile(channelId) {
  return channelId ? channelProfiles.find((profile) => profile.channelId === channelId) ?? null : null;
}

function setChannelSetupPreferredContentTypes(contentTypes) {
  const selectedTypes = new Set(contentTypes);

  for (const input of channelSetupContentTypes) {
    input.checked = selectedTypes.has(input.value);
  }
}

function getChannelSetupPreferredContentTypes() {
  return channelSetupContentTypes.filter((input) => input.checked).map((input) => input.value);
}

function applyChannelSetupPurposeDefaults() {
  const purposeKey = channelSetupPurpose?.value ?? "genealogy";
  const purposeProfile = channelSetupPurposeProfiles[purposeKey] ?? channelSetupPurposeProfiles.custom;

  setChannelSetupPreferredContentTypes(purposeProfile.contentTypes);

  if (channelSetupTopic) {
    channelSetupTopic.value = getChannelSetupPurposeTopic({ purposeKey });
  }
}

function ensureChannelSetupRoleOption(roleId) {
  if (!roleId || !channelSetupRole || Array.from(channelSetupRole.options).some((option) => option.value === roleId)) {
    return;
  }

  const option = document.createElement("option");
  option.value = roleId;
  option.textContent = `Saved role ${roleId}`;
  channelSetupRole.append(option);
}

function applySavedChannelProfileToAssistant(channelId) {
  const profile = getSavedChannelProfile(channelId);

  if (!profile) {
    setChannelSetupAssistantStatus(channelId ? "new profile draft" : "draft", "neutral");
    return;
  }

  if (channelSetupPurpose) {
    channelSetupPurpose.value = profile.purpose || "genealogy";
  }

  if (channelSetupAudience) {
    channelSetupAudience.value = profile.audience || "everyone";
  }

  if (channelSetupAccessMode) {
    channelSetupAccessMode.value = profile.accessMode || "everyone";
  }

  if (channelSetupTone) {
    channelSetupTone.value = profile.tone || "friendly";
  }

  ensureChannelSetupRoleOption(profile.suggestedRoleId);

  if (channelSetupRole) {
    channelSetupRole.value = profile.suggestedRoleId || "";
  }

  setChannelSetupPreferredContentTypes(Array.isArray(profile.preferredContentTypes) ? profile.preferredContentTypes : []);

  if (channelSetupTopic) {
    channelSetupTopic.value = profile.topicOverride || "";
  }

  if (channelSetupNotes) {
    channelSetupNotes.value = profile.notes || "";
  }

  setChannelSetupAssistantStatus("saved profile loaded", "active");
}

function handleChannelSetupChannelChange() {
  applySavedChannelProfileToAssistant(channelSetupChannel?.value ?? "");
  renderChannelSetupAssistant();
}

function handleChannelSetupPurposeChange() {
  applyChannelSetupPurposeDefaults();
  renderChannelSetupAssistant();
}

function getChannelSetupState() {
  const accessMode = channelSetupAccessMode?.value ?? "everyone";
  const roleRecommended = isChannelSetupRoleRecommended(accessMode);
  const channelId = channelSetupChannel?.value ?? "";
  const roleId = roleRecommended ? channelSetupRole?.value ?? "" : "";
  const purposeKey = channelSetupPurpose?.value ?? "genealogy";
  const purposeProfile = channelSetupPurposeProfiles[purposeKey] ?? channelSetupPurposeProfiles.custom;
  const preferredContentTypes = getChannelSetupPreferredContentTypes();
  const savedProfile = getSavedChannelProfile(channelId);

  return {
    audience: channelSetupAudience?.value ?? "everyone",
    audienceLabel: channelSetupAudienceLabels[channelSetupAudience?.value] ?? "Everyone",
    accessMode,
    accessLabel: channelSetupAccessLabels[accessMode] ?? "Not sure yet",
    channel: guildChannels.find((entry) => entry.id === channelId) ?? null,
    channelId,
    savedProfile,
    purposeKey,
    purposeProfile,
    preferredContentTypes: preferredContentTypes.length > 0 ? preferredContentTypes : purposeProfile.contentTypes,
    role: guildRoles.find((entry) => entry.id === roleId) ?? null,
    roleId,
    roleRecommended,
    tone: channelSetupTone?.value ?? "friendly",
    toneLabel: channelSetupToneLabels[channelSetupTone?.value] ?? "Friendly",
    topicOverride: channelSetupTopic?.value.trim() || null,
    notes: channelSetupNotes?.value.trim() || null,
  };
}

function getChannelSetupPanelForRole(roleId) {
  return roleId ? roleAccessPanels.find((panel) => panel.roleId === roleId) ?? null : null;
}

function getChannelSetupFollowupForRole(roleId) {
  return roleId ? roleFollowups.find((followup) => followup.roleId === roleId) ?? null : null;
}

function getChannelSetupFeeds(channelId) {
  return channelId ? feeds.filter((feed) => feed.channelId === channelId) : [];
}

function getChannelSetupAutomationStatus(channelId) {
  return channelId ? channelAutomationStatuses.find((status) => status.channelId === channelId) ?? null : null;
}

function getChannelSetupFollowupDraft(state) {
  const channelLabel = state.channel ? `#${state.channel.name}` : "the channel";
  const roleLabel = state.role ? state.role.name : "this role";

  if (state.roleRecommended) {
    return `{user} welcome in. You now have access to ${channelLabel} with the ${roleLabel} role. Start by introducing yourself or sharing what brought you here.`;
  }

  return `Welcome to ${channelLabel}. This space is for ${state.purposeProfile.label.toLowerCase()} conversation, updates, and community prompts.`;
}

function getChannelSetupPurposeTopic(state) {
  const topicByPurpose = {
    genealogy: "genealogy",
    gaming: "gaming",
    sports: "sports",
    news: "news",
    history: "history",
    memes: "memes",
    "general-chat": "general",
    custom: "general",
  };

  return topicByPurpose[state.purposeKey] ?? "general";
}

function getChannelSetupFollowupMessage(state) {
  const drafts = {
    genealogy: "Welcome {user} to {channel}! Tell us what family line, mystery, or ancestor you're researching.",
    gaming: "Welcome {user} to {channel}! Drop your favorite game, build, server, or question to get the conversation going.",
    sports: "Welcome {user} to {channel}! Tell us your team, hot take, or game you're watching next.",
    news: "Welcome {user} to {channel}! Share what topics you're following or drop a headline worth discussing.",
    history: "Welcome {user} to {channel}! Share a time period, event, or mystery you want to explore.",
    memes: "Welcome {user} to {channel}! Drop a meme, reaction, or cursed thought to break the ice.",
    "general-chat": "Welcome {user} to {channel}! Jump in and tell everyone what you're into.",
    custom: "Welcome {user} to {channel}! Introduce yourself and help get the conversation started.",
  };

  return drafts[state.purposeKey] ?? drafts.custom;
}

function getChannelSetupDisplayName(state) {
  const rawName = state.channel?.name || "Channel";
  const words = rawName
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "Channel";
  }

  return words.map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join(" ");
}

function setChannelSetupAssistantStatus(message, tone = "neutral") {
  if (!channelSetupStatus) {
    return;
  }

  channelSetupStatus.textContent = message;
  channelSetupStatus.className = `status-badge ${tone}`;
  channelSetupStatus.title = message;
}

function confirmOverwriteDraft(formName, isDirty) {
  if (!isDirty) {
    return true;
  }

  return window.confirm(`${formName} already has draft content. Overwrite it with the Channel Setup Assistant draft?`);
}

function isRoleAccessPanelFormDirty() {
  const value = getRoleAccessPanelFormValue();
  return Boolean(
    value.id ||
      value.title !== "New Button Message" ||
      value.body !== "Click the button below to get the role." ||
      value.buttonLabel !== "Get Role" ||
      value.roleId ||
      value.targetChannelId ||
      value.successMessage ||
      value.alreadyHasRoleMessage ||
      value.active !== true,
  );
}

function isRoleFollowupFormDirty() {
  const value = getRoleFollowupFormValue();
  return Boolean(value.id || value.roleId || value.channelId || value.message || value.enabled !== true);
}

function isFeedFormDirty() {
  const defaultPreset = channelPresets[0]?.channelId ?? "";
  return Boolean(
    feedForm.elements.feedId.value ||
      feedForm.elements.enabled.value !== "true" ||
      feedForm.elements.channelId.value ||
      feedForm.elements.contentType.value !== "prompt" ||
      feedForm.elements.cadenceMinutes.value !== "60" ||
      feedForm.elements.topicOverride.value ||
      feedForm.elements.allowedStartTime.value ||
      feedForm.elements.allowedEndTime.value ||
      feedForm.elements.channelPreset.value !== defaultPreset,
  );
}

function isManualPushFormDirty() {
  const defaultPreset = channelPresets[0]?.channelId ?? "";
  return Boolean(
    manualPushForm.elements.channelPreset.value !== defaultPreset ||
      manualPushForm.elements.contentType.value !== "history" ||
      manualPushForm.elements.topicOverride.value,
  );
}

function getSignupChannelCandidateId() {
  const existingTargetChannelId = roleAccessPanels.find((panel) => panel.targetChannelId && metadataHasChannel(panel.targetChannelId))?.targetChannelId;

  if (existingTargetChannelId) {
    return existingTargetChannelId;
  }

  const signupChannel = guildChannels.find((channel) => /role|access|signup|start|welcome|rules/i.test(channel.name));
  return signupChannel?.id ?? "";
}

function setPresetOrManualChannel(form, channelId) {
  const preset = findPresetForChannel(channelId);

  if (preset && form.elements.channelPreset) {
    form.elements.channelPreset.value = preset.channelId;
    if (form.elements.channelId) {
      form.elements.channelId.value = "";
    }
    return true;
  }

  if (form.elements.channelId) {
    form.elements.channelPreset.value = "";
    form.elements.channelId.value = channelId;
    return true;
  }

  return false;
}

function getChannelSetupRequiredState(options = {}) {
  const state = getChannelSetupState();

  if (!state.channelId || !state.channel) {
    setChannelSetupAssistantStatus("Choose a channel first.", "blocked");
    return null;
  }

  if (options.requireRole && !state.roleId) {
    setChannelSetupAssistantStatus("Choose an existing Discord role before prefilling this draft.", "blocked");
    return null;
  }

  if (options.requireRole && !state.role) {
    setChannelSetupAssistantStatus("The selected role is not available in loaded Discord metadata.", "blocked");
    return null;
  }

  return state;
}

function prefillRoleAccessPanelFromChannelSetup() {
  const state = getChannelSetupRequiredState({ requireRole: true });

  if (!state || !state.roleRecommended) {
    setChannelSetupAssistantStatus("Choose opt-in or private access with an existing role before prefilling a role signup button.", "blocked");
    return;
  }

  if (!confirmOverwriteDraft("Role Signup Button", isRoleAccessPanelFormDirty())) {
    setChannelSetupAssistantStatus("Role signup draft was not overwritten.", "neutral");
    return;
  }

  const displayName = getChannelSetupDisplayName(state);
  const currentTargetChannelId = roleAccessPanelForm.elements.targetChannelId.value.trim();
  const targetChannelId = getSignupChannelCandidateId() || currentTargetChannelId;

  resetRoleAccessPanelForm();
  roleAccessPanelForm.elements.title.value = `${displayName} Access`;
  roleAccessPanelForm.elements.body.value = `Click below to get access to #${state.channel.name}.`;
  roleAccessPanelForm.elements.buttonLabel.value = `Join ${displayName}`;
  roleAccessPanelForm.elements.roleId.value = state.roleId;
  roleAccessPanelForm.elements.targetChannelId.value = targetChannelId;
  roleAccessPanelForm.elements.id.value = "";
  syncDiscordMetadataSelections();
  renderRoleAccessPreview();
  showRoleAccessPanelBuilder();
  setRoleAccessPanelStatus("Draft filled from Channel Setup Assistant. Review and save when ready.");
  setChannelSetupAssistantStatus("role signup draft filled", "active");
  navigateMissionAction(createMissionNavigation("access", "community-role-signup-buttons"));
}

function prefillRoleFollowupFromChannelSetup() {
  const state = getChannelSetupRequiredState({ requireRole: true });

  if (!state) {
    return;
  }

  if (!confirmOverwriteDraft("Role Follow-Up", isRoleFollowupFormDirty())) {
    setChannelSetupAssistantStatus("Follow-up draft was not overwritten.", "neutral");
    return;
  }

  resetRoleFollowupForm();
  roleFollowupForm.elements.id.value = "";
  roleFollowupForm.elements.roleId.value = state.roleId;
  roleFollowupForm.elements.channelId.value = state.channelId;
  roleFollowupForm.elements.enabled.value = "true";
  roleFollowupForm.elements.message.value = getChannelSetupFollowupMessage(state);
  syncDiscordMetadataSelections();
  renderRoleFollowupPreview();
  showRoleFollowupBuilder();
  setRoleFollowupStatus("Draft filled from Channel Setup Assistant. Review and save when ready.");
  setChannelSetupAssistantStatus("follow-up draft filled", "active");
  navigateMissionAction(createMissionNavigation("access", "community-role-followups"));
}

function prefillFeedFromChannelSetup() {
  const state = getChannelSetupRequiredState();

  if (!state) {
    return;
  }

  if (!confirmOverwriteDraft("Scheduled Post", isFeedFormDirty())) {
    setChannelSetupAssistantStatus("Scheduled post draft was not overwritten.", "neutral");
    return;
  }

  resetFeedForm();
  feedForm.elements.feedId.value = "";
  feedForm.elements.enabled.value = "false";
  setPresetOrManualChannel(feedForm, state.channelId);
  feedForm.elements.contentType.value = state.purposeProfile.contentTypes[0] ?? "prompt";
  feedForm.elements.topicOverride.value = getChannelSetupPurposeTopic(state);
  setFeedStatus("Draft filled from Channel Setup Assistant. Review and save when ready.");
  setChannelSetupAssistantStatus("scheduled post draft filled", "active");
  showFeedForm();
  navigateMissionAction(createMissionNavigation("channels", "automation-scheduled-posts"));
}

function prefillManualPushFromChannelSetup() {
  const state = getChannelSetupRequiredState();

  if (!state) {
    return;
  }

  const preset = findPresetForChannel(state.channelId);

  if (!preset) {
    setChannelSetupAssistantStatus("Generate Content can only prefill saved channel presets. Open Create & Post and choose the channel manually.", "blocked");
    navigateMissionAction(createMissionNavigation("push", "post-now-generated-content"));
    return;
  }

  if (!confirmOverwriteDraft("Generate Content", isManualPushFormDirty())) {
    setChannelSetupAssistantStatus("Generate Content draft was not overwritten.", "neutral");
    return;
  }

  manualPushForm.elements.channelPreset.value = preset.channelId;
  manualPushForm.elements.contentType.value = state.purposeProfile.contentTypes[0] ?? "prompt";
  manualPushForm.elements.topicOverride.value = getChannelSetupPurposeTopic(state);
  syncManualPushPresetSelection(false);
  setManualPushStatus("Draft filled from Channel Setup Assistant. Review and send only when ready.");
  setChannelSetupAssistantStatus("generate content draft filled", "active");
  navigateMissionAction(createMissionNavigation("push", "post-now-generated-content"));
}

function buildChannelProfilePayload() {
  const state = getChannelSetupState();
  const rolePanel = getChannelSetupPanelForRole(state.roleId);
  const roleFollowup = getChannelSetupFollowupForRole(state.roleId);

  return {
    channelId: state.channelId,
    purpose: state.purposeKey,
    audience: state.audience,
    accessMode: state.accessMode,
    tone: state.tone,
    preferredContentTypes: state.preferredContentTypes,
    topicOverride: state.topicOverride,
    suggestedRoleId: state.roleId || null,
    signupPanelId: rolePanel?.id ?? null,
    followupId: roleFollowup?.id ?? null,
    notes: state.notes,
  };
}

function validateChannelProfilePayload(payload) {
  if (!payload.channelId) {
    return "Choose a channel before saving a profile.";
  }

  if (!Array.isArray(payload.preferredContentTypes) || payload.preferredContentTypes.length === 0) {
    return "Choose at least one preferred content type.";
  }

  if (payload.topicOverride && !allowedChannelSetupTopics.has(payload.topicOverride)) {
    return "Choose a valid topic override or leave it blank.";
  }

  if (payload.notes && payload.notes.length > 1000) {
    return "Notes must be 1000 characters or fewer.";
  }

  return null;
}

async function saveChannelSetupProfile() {
  const payload = buildChannelProfilePayload();
  const validationError = validateChannelProfilePayload(payload);

  if (validationError) {
    setChannelSetupAssistantStatus(validationError, "blocked");
    return;
  }

  setChannelSetupAssistantStatus("saving profile...", "neutral");

  try {
    const data = await fetchJson("/api/channel-profiles/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    channelProfiles = Array.isArray(data.channelProfiles) ? data.channelProfiles : [];
    applySavedChannelProfileToAssistant(payload.channelId);
    renderChannelSetupAssistant();
    renderMissionControl();
    await loadChannelIntelligence();
    setChannelSetupAssistantStatus("channel profile saved", "active");
  } catch (error) {
    setChannelSetupAssistantStatus(`Profile save failed: ${error.message}`, "blocked");
  }
}

async function deleteChannelSetupProfile() {
  const state = getChannelSetupState();

  if (!state.channelId || !state.savedProfile) {
    setChannelSetupAssistantStatus("Choose a saved channel profile before deleting.", "blocked");
    return;
  }

  const channelLabel = state.channel ? `#${state.channel.name}` : state.channelId;

  if (!window.confirm(`Delete CDawg's saved memory for ${channelLabel}? This does not change Discord.`)) {
    return;
  }

  setChannelSetupAssistantStatus("deleting profile...", "neutral");

  try {
    const data = await fetchJson("/api/channel-profiles/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: state.channelId,
      }),
    });

    channelProfiles = Array.isArray(data.channelProfiles) ? data.channelProfiles : [];
    resetChannelSetupAssistant({ preserveChannel: true });
    renderMissionControl();
    await loadChannelIntelligence();
    setChannelSetupAssistantStatus("channel profile deleted", "active");
  } catch (error) {
    setChannelSetupAssistantStatus(`Profile delete failed: ${error.message}`, "blocked");
  }
}

function createChannelSetupDetail(label, value) {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value;
  wrapper.append(term, description);
  return wrapper;
}

function createChannelSetupStep(label, detail, complete, warning = false) {
  const item = document.createElement("li");
  const badge = createStatusBadge(complete ? "complete" : warning ? "warning" : "next", complete ? "active" : warning ? "blocked" : "neutral");
  const text = document.createElement("span");

  text.textContent = `${label}: ${detail}`;
  item.append(badge, text);
  return item;
}

function createChannelSetupCompletenessSection(completeness) {
  const section = document.createElement("section");
  const title = document.createElement("h4");
  const score = document.createElement("p");
  const parts = document.createElement("ul");
  const missingTitle = document.createElement("h4");
  const missing = document.createElement("p");
  const nextTitle = document.createElement("h4");
  const next = document.createElement("p");

  section.className = "channel-setup-plan-section";
  parts.className = "channel-setup-steps";

  title.textContent = "Setup Completeness";
  score.textContent = `${completeness.score}% complete`;

  for (const part of completeness.parts) {
    parts.append(createChannelSetupStep(part.label, part.complete ? "Ready." : part.missingPiece, part.complete, !part.complete));
  }

  missingTitle.textContent = "Missing Pieces";
  missing.textContent = completeness.missingPieces.length > 0 ? completeness.missingPieces.join(" ") : "No missing pieces found from the currently loaded dashboard data.";
  nextTitle.textContent = "Recommended Next Step";
  next.textContent = completeness.recommendedNextStep.label;

  section.append(title, score, parts, missingTitle, missing, nextTitle, next);
  return section;
}

function getChannelSetupAutomationWarning(status) {
  if (!status) {
    return null;
  }

  if (status.blockedReason === "disabled") {
    return "Channel automation is disabled for this channel.";
  }

  if (status.blockedReason === "silenced") {
    return "Channel automation is currently paused.";
  }

  if (status.blockedReason === "cooldown") {
    return "Channel automation is delayed by cooldown.";
  }

  if (status.blockedReason === "skip-next" || status.skipNextSendPending === true) {
    return "This channel has a skip-next automation flag pending.";
  }

  return null;
}

function renderChannelSetupAssistant() {
  if (!channelSetupPlan) {
    return;
  }

  const state = getChannelSetupState();
  const rolePanel = getChannelSetupPanelForRole(state.roleId);
  const roleFollowup = getChannelSetupFollowupForRole(state.roleId);
  const channelFeeds = getChannelSetupFeeds(state.channelId);
  const automationStatus = getChannelSetupAutomationStatus(state.channelId);
  const automationWarning = getChannelSetupAutomationWarning(automationStatus);
  const roleMissing = state.roleRecommended && !state.roleId;
  const contentTypes = state.preferredContentTypes;
  const completeness = state.channelId ? buildChannelSetupCompleteness(buildChannelSetupProfileFromState(state)) : null;

  if (channelSetupStatus) {
    channelSetupStatus.textContent = state.savedProfile ? "saved profile" : state.channelId ? "plan ready" : "draft";
    channelSetupStatus.className = `status-badge ${state.channelId ? "active" : "neutral"}`;
  }

  if (channelSetupChannelDetail) {
    channelSetupChannelDetail.textContent = state.channel
      ? `#${state.channel.name} - ${state.channel.type}${state.channel.parentId ? ` - Parent ${state.channel.parentId}` : ""}`
      : "Choose an existing Discord channel.";
  }

  if (channelSetupRoleField) {
    channelSetupRoleField.hidden = !state.roleRecommended;
  }

  if (channelSetupRoleDetail) {
    channelSetupRoleDetail.textContent = roleMissing
      ? "Create or choose a Discord role before making this opt-in."
      : state.role
        ? `${state.role.name} (${state.role.id})`
        : "Role is optional for this access mode.";
  }

  if (channelSetupDeleteProfileButton) {
    channelSetupDeleteProfileButton.hidden = !state.savedProfile;
  }

  channelSetupPlan.replaceChildren();

  const header = document.createElement("div");
  const title = document.createElement("h4");
  const badgeRow = document.createElement("div");
  const summary = document.createElement("dl");
  const contentBlock = document.createElement("section");
  const contentTitle = document.createElement("h4");
  const contentCopy = document.createElement("p");
  const stepsBlock = document.createElement("section");
  const stepsTitle = document.createElement("h4");
  const steps = document.createElement("ul");
  const followupBlock = document.createElement("section");
  const followupTitle = document.createElement("h4");
  const followupDraft = document.createElement("p");
  const starterTitle = document.createElement("h4");
  const starterDraft = document.createElement("p");

  header.className = "channel-setup-plan-header";
  badgeRow.className = "channel-operation-badges";
  summary.className = "channel-setup-summary";
  contentBlock.className = "channel-setup-plan-section";
  stepsBlock.className = "channel-setup-plan-section";
  steps.className = "channel-setup-steps";
  followupBlock.className = "channel-setup-plan-section";

  title.textContent = "Setup Plan Preview";
  badgeRow.append(
    createStatusBadge(state.purposeProfile.label, "neutral"),
    createStatusBadge(state.accessLabel, state.roleRecommended ? "active" : "neutral"),
  );
  if (automationWarning) {
    badgeRow.append(createStatusBadge("automation warning", "blocked"));
  }

  summary.append(
    createChannelSetupDetail("Channel", state.channel ? `#${state.channel.name}` : "Choose a channel"),
    createChannelSetupDetail("Purpose", state.purposeProfile.label),
    createChannelSetupDetail("Audience", state.audienceLabel),
    createChannelSetupDetail("Access", state.accessLabel),
    createChannelSetupDetail("Tone", state.toneLabel),
    createChannelSetupDetail("Topic", state.topicOverride ?? getChannelSetupPurposeTopic(state)),
    createChannelSetupDetail("Suggested Role", state.roleRecommended ? state.role ? state.role.name : "Choose an existing role" : "No role needed"),
    createChannelSetupDetail("Memory", state.savedProfile ? "Saved profile exists" : "Unsaved profile draft"),
  );

  contentTitle.textContent = "Suggested Content Types";
  contentCopy.textContent = contentTypes.join(", ");

  stepsTitle.textContent = "Recommended Next Steps";
  steps.append(
    createChannelSetupStep("Role", roleMissing ? "Create or choose a Discord role before making this opt-in." : state.roleRecommended ? `Use ${state.role?.name ?? "selected role"}.` : "No role needed for this access mode.", !roleMissing),
    createChannelSetupStep("Role signup button", rolePanel ? `Already exists: ${rolePanel.title}.` : state.roleRecommended ? "Add a role signup button for this role." : "Optional for this access mode.", Boolean(rolePanel) || !state.roleRecommended),
    createChannelSetupStep("Follow-up welcome message", roleFollowup ? `Already exists for ${getRoleLabel(roleFollowup.roleId)}.` : state.roleRecommended ? "Add a follow-up message after the role is granted." : "Optional for this access mode.", Boolean(roleFollowup) || !state.roleRecommended),
    createChannelSetupStep("Scheduled content", channelFeeds.length > 0 ? `${channelFeeds.length} scheduled post${channelFeeds.length === 1 ? "" : "s"} already target this channel.` : `Add scheduled ${contentTypes[0]} or ${contentTypes[1] ?? "prompt"} content.`, channelFeeds.length > 0),
    createChannelSetupStep("One-time post", "Try a one-time post to start the conversation.", false),
  );

  if (automationWarning) {
    steps.append(createChannelSetupStep("Automation state", automationWarning, false, true));
  }

  followupTitle.textContent = "Suggested Follow-Up Message Draft";
  followupDraft.textContent = getChannelSetupFollowupDraft(state);
  starterTitle.textContent = "Suggested First Conversation Starter";
  starterDraft.textContent = state.purposeProfile.starter;

  header.append(title, badgeRow);
  contentBlock.append(contentTitle, contentCopy);
  if (state.notes) {
    const notesTitle = document.createElement("h4");
    const notesCopy = document.createElement("p");
    notesTitle.textContent = "Saved Notes";
    notesCopy.textContent = state.notes;
    contentBlock.append(notesTitle, notesCopy);
  }
  stepsBlock.append(stepsTitle, steps);
  followupBlock.append(followupTitle, followupDraft, starterTitle, starterDraft);
  channelSetupPlan.append(
    header,
    summary,
    ...(completeness ? [createChannelSetupCompletenessSection(completeness)] : []),
    contentBlock,
    stepsBlock,
    followupBlock,
  );
}

function openChannelSetupAssistant() {
  if (!channelSetupAssistant) {
    return;
  }

  moveChannelSetupAssistantToSettings();
  channelSetupAssistant.hidden = false;
  setActiveControlTab("settings");
  renderChannelSetupMetadataOptions();
  window.requestAnimationFrame(() => {
    channelSetupAssistant.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function moveChannelSetupAssistantToSettings() {
  if (!channelSetupAssistant || !settingsPanel) {
    return;
  }

  if (channelSetupAssistant.closest("[data-tab-panel='settings']")) {
    return;
  }

  if (settingsSummaryGrid) {
    settingsSummaryGrid.insertAdjacentElement("afterend", channelSetupAssistant);
    return;
  }

  settingsPanel.prepend(channelSetupAssistant);
}

function resetChannelSetupAssistant(options = {}) {
  const currentChannelId = channelSetupChannel?.value ?? "";

  if (channelSetupChannel && !options.preserveChannel) {
    channelSetupChannel.value = "";
  }

  if (channelSetupPurpose) {
    channelSetupPurpose.value = "genealogy";
  }

  if (channelSetupAccessMode) {
    channelSetupAccessMode.value = "everyone";
  }

  if (channelSetupAudience) {
    channelSetupAudience.value = "everyone";
  }

  if (channelSetupTone) {
    channelSetupTone.value = "friendly";
  }

  if (channelSetupRole) {
    channelSetupRole.value = "";
  }

  setChannelSetupPreferredContentTypes(channelSetupPurposeProfiles.genealogy.contentTypes);

  if (channelSetupTopic) {
    channelSetupTopic.value = "genealogy";
  }

  if (channelSetupNotes) {
    channelSetupNotes.value = "";
  }

  if (options.preserveChannel && channelSetupChannel) {
    channelSetupChannel.value = currentChannelId;
  }

  renderChannelSetupAssistant();
}

function getDailyBriefingGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning Chris";
  }

  if (hour < 17) {
    return "Good Afternoon Chris";
  }

  return "Good Evening Chris";
}

function getDailyBriefingHealthTone(health) {
  if (health === "Excellent" || health === "Good") {
    return "active";
  }

  if (health === "Attention Needed") {
    return "blocked";
  }

  return "neutral";
}

function renderDailyBriefingList(target, items, emptyCopy) {
  if (!target) {
    return;
  }

  target.replaceChildren();

  if (!Array.isArray(items) || items.length === 0) {
    const item = document.createElement("li");
    item.textContent = emptyCopy;
    target.append(item);
    return;
  }

  for (const entry of items) {
    const item = document.createElement("li");
    item.textContent = entry;
    target.append(item);
  }
}

function renderDailyBriefingMetrics(metrics) {
  if (!dailyBriefingMetrics) {
    return;
  }

  dailyBriefingMetrics.replaceChildren();

  for (const [label, value] of [
    ["Active Channels", metrics?.activeChannels ?? 0],
    ["Dormant Channels", metrics?.dormantChannels ?? 0],
    ["Opportunities", metrics?.opportunitiesCount ?? 0],
    ["Successful Outcomes", metrics?.recentSuccessfulOutcomes ?? 0],
    ["Failed Outcomes", metrics?.recentFailedOutcomes ?? 0],
  ]) {
    const item = document.createElement("article");
    const name = document.createElement("span");
    const count = document.createElement("strong");

    item.className = "daily-briefing-metric";
    name.textContent = label;
    count.textContent = String(value);
    item.append(name, count);
    dailyBriefingMetrics.append(item);
  }
}

function renderDailyBriefing() {
  if (!dailyBriefingHealth || !dailyBriefingSummary || !dailyBriefingEmpty || !dailyBriefingContent) {
    return;
  }

  if (dailyBriefingGreeting) {
    dailyBriefingGreeting.textContent = getDailyBriefingGreeting();
  }

  if (dailyBriefingLoadError) {
    dailyBriefingHealth.textContent = "unavailable";
    dailyBriefingHealth.className = "status-badge blocked";
    dailyBriefingSummary.textContent = "Daily briefing could not be generated from the current API response.";
    dailyBriefingEmpty.hidden = false;
    dailyBriefingEmpty.textContent = `Daily briefing unavailable. ${dailyBriefingLoadError}`;
    dailyBriefingContent.hidden = true;
    if (dailyBriefingGeneratedAt) {
      dailyBriefingGeneratedAt.textContent = "not loaded";
    }
    return;
  }

  if (!dailyBriefing) {
    dailyBriefingHealth.textContent = "loading";
    dailyBriefingHealth.className = "status-badge neutral";
    dailyBriefingSummary.textContent = "Building today's deterministic briefing from MyHub signals.";
    dailyBriefingEmpty.hidden = false;
    dailyBriefingEmpty.textContent = "Loading daily briefing...";
    dailyBriefingContent.hidden = true;
    if (dailyBriefingGeneratedAt) {
      dailyBriefingGeneratedAt.textContent = "not loaded";
    }
    return;
  }

  dailyBriefingHealth.textContent = `overall health: ${dailyBriefing.overallHealth}`;
  dailyBriefingHealth.className = `status-badge ${getDailyBriefingHealthTone(dailyBriefing.overallHealth)}`;
  dailyBriefingSummary.textContent = dailyBriefing.summary ?? "No briefing summary is available.";
  dailyBriefingEmpty.hidden = true;
  dailyBriefingContent.hidden = false;
  if (dailyBriefingGeneratedAt) {
    dailyBriefingGeneratedAt.textContent = `generated ${formatRelativeTime(dailyBriefing.generatedAt)}`;
  }

  renderDailyBriefingList(dailyBriefingHighlights, dailyBriefing.highlights, "No highlights are available from the current signals.");
  renderDailyBriefingList(dailyBriefingConcerns, dailyBriefing.concerns, "No concerns were detected from the current signals.");
  renderDailyBriefingList(dailyBriefingRecommendations, dailyBriefing.recommendations, "No recommended actions are available right now.");
  renderDailyBriefingMetrics(dailyBriefing.supportingMetrics);
}

function renderMissionControl() {
  if (!missionActionList) {
    return;
  }

  renderPalworldLaunchControl();

  const opportunities = buildMissionOpportunities();
  const actionNeeded = opportunities.filter((item) => item.severity === "action needed" || item.severity === "warning");
  const recentProblems = automationActivityItems.filter((item) => item.status === "failure" || item.status === "blocked");
  const nextAutomation = getNextAutomationCandidate();
  const activeCount = channelAutomationStatuses.filter((status) => !status.blockedReason).length;
  const blockedCount = channelAutomationStatuses.filter((status) => status.blockedReason || status.skipNextSendPending === true).length;
  const profileCommandItems = getChannelProfileCommandItems();
  const completeProfileCount = profileCommandItems.filter((item) => item.completeness.score >= 100).length;
  const incompleteProfileCount = profileCommandItems.length - completeProfileCount;
  const statusTone = getMissionStatusTone(actionNeeded);

  missionBriefingStatus.textContent =
    statusTone === "active" ? "systems clear" : statusTone === "blocked" ? "attention needed" : "review recommended";
  missionBriefingStatus.className = `status-badge ${statusTone}`;
  missionBriefingTitle.textContent = getMissionBriefingTitle(actionNeeded, recentProblems);
  missionBriefingSummary.textContent = getMissionBriefingSummary(actionNeeded, recentProblems, nextAutomation);
  missionSystemHealth.textContent =
    lastHealthSnapshot?.ok === true
      ? "Online"
      : lastHealthSnapshot
        ? "Needs Check"
        : "Loading";
  missionOpportunityCount.textContent =
    lastHealthSnapshot?.botReady === true
      ? "Ready"
      : lastHealthSnapshot
        ? "Needs Check"
        : "Loading";
  missionAutomationSummary.textContent = automationMaster.globalAutomationEnabled === false
    ? "Paused"
    : `${activeCount} active / ${blockedCount} blocked`;
  missionProblemCount.textContent = actionNeeded.length > 0 ? `${actionNeeded.length} item${actionNeeded.length === 1 ? "" : "s"}` : "None";
  if (missionProfileCount) {
    missionProfileCount.textContent = String(channelProfiles.length);
  }
  if (missionProfileCompleteCount) {
    missionProfileCompleteCount.textContent = String(completeProfileCount);
  }
  if (missionProfileIncompleteCount) {
    missionProfileIncompleteCount.textContent = String(incompleteProfileCount);
  }
  if (missionProfileMissingRoleCount) {
    const profilesMissingRole = channelProfiles.filter(
      (profile) => (profile.accessMode === "opt-in" || profile.accessMode === "private") && !profile.suggestedRoleId,
    );
    missionProfileMissingRoleCount.textContent = String(profilesMissingRole.length);
  }
  missionActionCount.textContent = `${actionNeeded.length} item${actionNeeded.length === 1 ? "" : "s"}`;
  missionActionCount.className = `status-badge ${actionNeeded.length > 0 ? "blocked" : "active"}`;

  missionNextActivity.replaceChildren();
  if (nextAutomation) {
    missionNextActivity.append(
      createAutomationDetailLine("Next scheduled activity", `${nextAutomation.label ?? nextAutomation.channelId} - ${formatTimestamp(nextAutomation.nextEligibleSendAt)} (${formatRelativeTime(nextAutomation.nextEligibleSendAt)})`, nextAutomation.blockedReason ? "blocked" : "ok"),
      createAutomationDetailLine("Posting mode", getAutomationModeLabel(nextAutomation.automationMode)),
    );
  } else {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = automationMaster.globalAutomationEnabled === false
      ? "Automatic Posting is OFF, so no next scheduled activity is eligible."
      : "No next scheduled activity is available from the currently loaded state.";
    missionNextActivity.append(emptyState);
  }

  renderMissionFoundItems();
  renderMissionChannelProfiles();
  renderBackendOpportunities();
  renderHomeRecentActivity();

  missionActionList.replaceChildren();
  if (actionNeeded.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "Nothing needs your attention right now.";
    missionActionList.append(emptyState);
    return;
  }

  appendCompressedCardList(missionActionList, actionNeeded, createMissionActionCard, {
    visibleLimit: 3,
    summaryLabel: (count) => `View all ${count} action items`,
  });
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
  opsAutomationMasterBadge.textContent = `automatic posting ${masterEnabled ? "on" : "off"}`;
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
  const setupWarningCount =
    panelsMissingChannelCount +
    panelsMissingRoleCount +
    disabledFollowupsCount +
    followupsMissingChannelCount +
    followupsMissingRoleCount;

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

  if (opsSetupEmpty) {
    opsSetupEmpty.hidden = setupWarningCount > 0;
  }

  renderCommunityHealth();
  renderMissionControl();
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
    return "Automatic Posting is off for all channels";
  }

  if (channelStatus.blockedReason === "disabled") {
    return "Automatic posts are off for this channel";
  }

  if (channelStatus.blockedReason === "silenced") {
    return `Paused until ${formatTimestamp(channelStatus.blockedUntil)}`;
  }

  if (channelStatus.blockedReason === "cooldown") {
    return `Delayed until ${formatTimestamp(channelStatus.blockedUntil)}`;
  }

  if (channelStatus.blockedReason === "skip-next") {
    return "Skip next scheduled post is pending";
  }

  return "Active";
}

function getBlockedReasonLabel(blockedReason) {
  if (blockedReason === "global-disabled") {
    return "Automatic Posting OFF";
  }

  if (blockedReason === "disabled") {
    return "Channel posts OFF";
  }

  if (blockedReason === "silenced") {
    return "Posts paused";
  }

  if (blockedReason === "cooldown") {
    return "Post delayed";
  }

  if (blockedReason === "skip-next") {
    return "Skip next post pending";
  }

  return "No block";
}

function getAutomationModeLabel(automationMode) {
  if (!automationMode || automationMode === "none") {
    return "No automatic posts configured";
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
      emptyState.textContent = "Automatic Posting is OFF, so no next scheduled post is currently eligible.";
    } else if (channelAutomationStatuses.length === 0) {
      emptyState.textContent = "No channel posting status is available yet.";
    } else {
      emptyState.textContent = "No next scheduled post is available yet.";
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
    createAutomationDetailLine("Posting mode", getAutomationModeLabel(nextAutomation.automationMode)),
    createAutomationDetailLine("Content/source", "Not reported yet"),
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
    createAutomationDetailLine("Freshness", formatRelativeTime(item.timestamp)),
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

function createHomeActivityItem(entry) {
  const row = document.createElement("article");
  const main = document.createElement("div");
  const meta = document.createElement("div");
  const message = document.createElement("p");
  const badges = document.createElement("div");

  row.className = `automation-activity-item status-${entry.tone === "blocked" ? "failure" : "success"}`;
  main.className = "automation-activity-main";
  meta.className = "automation-activity-meta";
  message.className = "automation-activity-message";
  badges.className = "channel-operation-badges";
  message.textContent = entry.message;
  badges.append(createStatusBadge(entry.label, entry.tone));
  meta.append(
    createAutomationDetailLine("When", entry.timestamp ? formatTimestamp(entry.timestamp) : "Recently"),
    createAutomationDetailLine("Freshness", entry.timestamp ? formatRelativeTime(entry.timestamp) : "loaded data"),
    createAutomationDetailLine("Where", entry.channelLabel ?? "Dashboard"),
  );
  main.append(badges, message);
  row.append(main, meta);
  return row;
}

function getAutomationActivityStory(item) {
  const channelLabel = getActivityChannelLabel(item);

  if (item.status === "failure") {
    return `A scheduled post failed${channelLabel ? ` in ${channelLabel}` : ""}.`;
  }

  if (item.status === "blocked") {
    return `A scheduled post was blocked${channelLabel ? ` in ${channelLabel}` : ""}.`;
  }

  if (item.status === "success") {
    return `The bot posted${channelLabel ? ` in ${channelLabel}` : ""}.`;
  }

  return item.message || "The bot recorded activity.";
}

function buildHomeActivityEntries() {
  const entries = [];

  for (const item of automationActivityItems.slice(0, 8)) {
    entries.push({
      timestamp: item.timestamp,
      tone: getActivityTone(item),
      label: item.status === "success" ? "posted" : item.status ?? "activity",
      channelLabel: getActivityChannelLabel(item),
      message: getAutomationActivityStory(item),
    });
  }

  for (const outcome of contentOutcomes.slice(0, 5)) {
    entries.push({
      timestamp: outcome.postedAt,
      tone: getContentOutcomeTone(outcome.activity?.outcomeLabel),
      label: "posted content",
      channelLabel: outcome.channelName ? `#${outcome.channelName}` : undefined,
      message: `A bot post was tracked${outcome.activity?.outcomeLabel ? ` with ${outcome.activity.outcomeLabel} response` : ""}.`,
    });
  }

  const activeEngagementRows = getEngagementRows("last24h")
    .filter((row) => Number(row.messageCount) >= 10 || Number(row.approxActiveUsers) >= 3)
    .slice(0, 3);

  for (const row of activeEngagementRows) {
    entries.push({
      timestamp: row.lastKnownActivityAt,
      tone: "active",
      label: "conversation",
      channelLabel: `#${getEngagementChannelName(row.channelId, row.channelName)}`,
      message: `Conversation activity increased in #${getEngagementChannelName(row.channelId, row.channelName)}.`,
    });
  }

  return entries
    .filter((entry) => entry.message)
    .sort((left, right) => (Number(right.timestamp) || 0) - (Number(left.timestamp) || 0));
}

function renderHomeRecentActivity() {
  if (!automationActivityList) {
    return;
  }

  const entries = buildHomeActivityEntries();
  automationActivityList.replaceChildren();

  if (entries.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "Recent Discord activity will appear here as it happens.";
    automationActivityList.append(emptyState);
    return;
  }

  appendCompressedCardList(automationActivityList, entries, createHomeActivityItem, {
    visibleLimit: 4,
    summaryLabel: () => "View more recent activity",
    listClassName: "mission-overflow-list automation-activity-overflow-list",
  });
}

function renderAutomationActivity() {
  automationActivityList.replaceChildren();
  automationErrorsList.replaceChildren();

  if (automationActivityItems.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No recent activity yet.";
    automationActivityList.append(emptyState);
  } else {
    appendCompressedCardList(automationActivityList, automationActivityItems, createAutomationActivityItem, {
      visibleLimit: 3,
      summaryLabel: () => "View all recent activity",
      listClassName: "mission-overflow-list automation-activity-overflow-list",
    });
  }

  const errorItems = automationActivityItems.filter((item) => item.status === "failure" || item.status === "blocked");

  if (errorItems.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No recent problems found.";
    automationErrorsList.append(emptyState);
    return;
  }

  for (const item of errorItems.slice(0, 6)) {
    automationErrorsList.append(createAutomationActivityItem(item));
  }
}

function getChannelStatusLabel(channelStatus) {
  if (channelStatus.blockedReason === "global-disabled") {
    return "Automatic Posting Off";
  }

  if (channelStatus.blockedReason === "disabled") {
    return "Automatic Posts Off";
  }

  if (channelStatus.blockedReason === "silenced") {
    return "Posts Paused";
  }

  if (channelStatus.blockedReason === "cooldown") {
    return "Post Delayed";
  }

  if (channelStatus.blockedReason === "skip-next") {
    return "Skip Next Post";
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

function jumpToCommunityFollowups() {
  setActiveControlTab("access");
  window.requestAnimationFrame(() => {
    document.querySelector("#community-role-followups")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function renderChannelOperations() {
  channelOperationsGrid.replaceChildren();
  const visibleChannelStatuses = getFilteredAndSortedChannelStatuses();

  if (visibleChannelStatuses.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent =
      channelAutomationStatuses.length === 0 ? "No channel posting status available." : "No channels match the current filter.";
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
    row.dataset.channelOperationId = channelStatus.channelId;
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
        channelStatus.globalAutomationEnabled ? "automatic posting on" : "automatic posting off",
        channelStatus.globalAutomationEnabled ? "neutral" : "blocked",
      ),
      createStatusBadge(
        channelStatus.channelAutomationEnabled ? "channel posts on" : "channel posts off",
        channelStatus.channelAutomationEnabled ? "neutral" : "blocked",
      ),
      createStatusBadge(channelStatus.defaultTopic ?? "no-topic", "neutral"),
    );
    if (channelStatus.skipNextSendPending) {
      badges.append(createStatusBadge("skip next post pending", "blocked"));
    }
    nextEligible.className = "channel-row-summary-detail channel-operation-detail-strong";
    nextEligible.textContent = `Next scheduled item: ${formatTimestamp(channelStatus.nextEligibleSendAt)} (${formatRelativeTime(channelStatus.nextEligibleSendAt)})`;
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
      "Post Next Scheduled Item Now",
      () => void applyChannelOperation(channelStatus.channelId, "trigger-now"),
    );
    triggerNowButton.classList.add("primary-action");
    const skipNextButton = createChannelInlineActionButton("Skip Next Scheduled Post", () => void applyChannelOperation(channelStatus.channelId, "skip-next"), {
        variant: "secondary",
      });
    const silenceOneHourButton = createChannelInlineActionButton(
      "Pause Posts 1 Hour",
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
        "Automatic posting",
        channelStatus.globalAutomationEnabled ? "ON" : "OFF",
        channelStatus.globalAutomationEnabled ? "ok" : "bad",
      ),
      createChannelStateItem(
        "Channel automatic posts",
        channelStatus.channelAutomationEnabled ? "ON" : "OFF",
        channelStatus.channelAutomationEnabled ? "ok" : "bad",
      ),
      createChannelStateItem(
        "Pause posts",
        channelStatus.blockedReason === "silenced" ? `Active until ${formatTimestamp(channelStatus.blockedUntil)}` : "Clear",
        channelStatus.blockedReason === "silenced" ? "bad" : "ok",
      ),
      createChannelStateItem(
        "Delay next post",
        channelStatus.blockedReason === "cooldown" ? `Active until ${formatTimestamp(channelStatus.blockedUntil)}` : "Clear",
        channelStatus.blockedReason === "cooldown" ? "warning" : "ok",
      ),
      createChannelStateItem(
        "Skip next scheduled post",
        channelStatus.skipNextSendPending ? "Pending" : "Clear",
        channelStatus.skipNextSendPending ? "warning" : "ok",
      ),
    );
    automationDetails.className = "automation-detail-list";
    automationDetails.append(
      createAutomationDetailLine("Blocked reason", getBlockedReasonLabel(channelStatus.blockedReason), channelStatus.blockedReason ? "blocked" : "ok"),
      createAutomationDetailLine("Posting mode", getAutomationModeLabel(channelStatus.automationMode)),
      createAutomationDetailLine("Next eligible", `${formatTimestamp(channelStatus.nextEligibleSendAt)} (${formatRelativeTime(channelStatus.nextEligibleSendAt)})`, "strong"),
      createAutomationDetailLine("Passive eligible", `${formatTimestamp(channelStatus.passiveEligibleAt)} (${formatRelativeTime(channelStatus.passiveEligibleAt)})`),
      createAutomationDetailLine("Scheduled eligible", `${formatTimestamp(channelStatus.scheduledEligibleAt)} (${formatRelativeTime(channelStatus.scheduledEligibleAt)})`),
      createAutomationDetailLine("Next content/source", "Not reported yet"),
    );
    blockedUntil.className = "channel-operation-detail";
    blockedUntil.textContent = `Blocked until: ${formatTimestamp(channelStatus.blockedUntil)} (${formatRelativeTime(channelStatus.blockedUntil)})`;
    lastSend.className = "channel-operation-detail";
    lastSend.textContent = `Last automatic post time: ${formatTimestamp(channelStatus.lastAutomatedSendAt)} (${formatRelativeTime(channelStatus.lastAutomatedSendAt)})`;

    expandedPrimaryActions.append(
      createChannelActionButton("Pause Posts 6 Hours", () => void applyChannelOperation(channelStatus.channelId, "silence", 6 * 60 * 60 * 1000)),
      createChannelActionButton("Delay Next Post 30 Minutes", () => void applyChannelOperation(channelStatus.channelId, "cooldown", 30 * 60 * 1000)),
    );
    expandedSecondaryActions.append(
      createChannelActionButton("Don't Skip Next Post", () => void applyChannelOperation(channelStatus.channelId, "clear-skip-next")),
      createChannelActionButton("Resume Posts", () => void applyChannelOperation(channelStatus.channelId, "resume")),
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
  setFeedStatus("Scheduled post form reset.");
}

function showFeedForm() {
  feedForm.hidden = false;
}

function hideFeedForm() {
  feedForm.hidden = true;
}

function createFeedDraft() {
  resetFeedForm();
  showFeedForm();
  setActiveControlTab("channels");
  window.requestAnimationFrame(() => {
    feedForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
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

function showDailyTriviaForm() {
  dailyTriviaForm.hidden = false;
}

function hideDailyTriviaForm() {
  dailyTriviaForm.hidden = true;
}

function configureDailyTrivia() {
  showDailyTriviaForm();
  window.requestAnimationFrame(() => {
    dailyTriviaForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function populateFeedForm(feed) {
  setActiveControlTab("channels");
  showFeedForm();
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
  setFeedStatus("Editing scheduled post.");
  window.requestAnimationFrame(() => {
    feedForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function getScheduledPostStatusLabel(feed) {
  if (!feed.enabled) {
    return "Paused";
  }

  if (feed.blockedReason) {
    return "Needs setup";
  }

  return "Running";
}

function getScheduledPostTone(feed) {
  if (!feed.enabled) {
    return "neutral";
  }

  if (feed.blockedReason) {
    return "blocked";
  }

  return "active";
}

function getScheduledPostCadenceLabel(feed) {
  const minutes = Number(feed.cadenceMinutes);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "Schedule not reported";
  }

  if (minutes < 60) {
    return `About every ${minutes} minutes`;
  }

  const hours = minutes / 60;
  return Number.isInteger(hours)
    ? `About every ${hours} hour${hours === 1 ? "" : "s"}`
    : `About every ${minutes} minutes`;
}

function createScheduledPostCard(feed, { compact = false } = {}) {
  const row = document.createElement("section");
  const main = document.createElement("div");
  const title = document.createElement("h3");
  const badges = document.createElement("div");
  const destination = document.createElement("p");
  const nextPost = document.createElement("p");
  const timing = document.createElement("p");
  const detail = document.createElement("p");
  const actions = document.createElement("div");
  const channelLabel = feed.channelLabel ?? getChannelLabel(feed.channelId) ?? "channel unavailable";

  row.className = `channel-operation-card compact${compact ? " content-scheduled-post-card" : ""}`;
  main.className = "channel-operation-main";
  badges.className = "channel-operation-badges";
  destination.className = "channel-operation-detail channel-operation-detail-strong";
  nextPost.className = "channel-operation-detail";
  timing.className = "channel-operation-detail";
  detail.className = "channel-operation-detail";
  actions.className = "channel-operation-actions";

  title.textContent = `${feed.contentType || "Post"} for ${channelLabel}`;
  badges.append(
    createStatusBadge(getScheduledPostStatusLabel(feed), getScheduledPostTone(feed)),
    createStatusBadge(feed.contentType || "post", "neutral"),
  );
  destination.textContent = `Posts in ${channelLabel}`;
  nextPost.textContent = feed.nextRunAt
    ? `Next post: ${formatTimestamp(feed.nextRunAt)} (${formatRelativeTime(feed.nextRunAt)})`
    : "Next post time is not available yet.";
  timing.textContent = `${getScheduledPostCadenceLabel(feed)}${feed.allowedWindow ? ` during ${feed.allowedWindow.startTime}-${feed.allowedWindow.endTime}` : ""}.`;
  detail.textContent = feed.blockedReason
    ? `Needs attention: ${getFeedBlockedLabel(feed)}${feed.blockedUntil ? ` until ${formatTimestamp(feed.blockedUntil)} (${formatRelativeTime(feed.blockedUntil)})` : ""}.`
    : feed.topicOverride
      ? `Topic: ${feed.topicOverride}.`
      : feed.presetTopic
        ? `Topic: ${feed.presetTopic}.`
        : "No extra topic set.";

  if (feed.overlapWarnings?.length) {
    badges.append(createStatusBadge("Review timing", "blocked"));
  }

  actions.append(
    createChannelActionButton("Edit", () => populateFeedForm(feed)),
    createChannelActionButton(feed.enabled ? "Pause" : "Resume", () => void setFeedEnabledState(feed.id, !feed.enabled)),
    createChannelActionButton("Delete", () => void deleteFeed(feed.id)),
  );

  main.append(title, badges, destination, nextPost, timing, detail);
  row.append(main, actions);
  return row;
}

function renderCreatePostScheduledPosts() {
  if (!createPostScheduledPostsList) {
    return;
  }

  createPostScheduledPostsList.replaceChildren();

  if (feeds.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No scheduled posts are set up yet.";
    createPostScheduledPostsList.append(emptyState);
    return;
  }

  for (const feed of feeds) {
    createPostScheduledPostsList.append(createScheduledPostCard(feed, { compact: true }));
  }
}

function renderFeeds() {
  renderCreatePostScheduledPosts();

  if (!feedsList) {
    return;
  }

  feedsList.replaceChildren();

  if (feeds.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "channel-operation-empty";
    emptyState.textContent = "No scheduled posts configured.";
    feedsList.append(emptyState);
    return;
  }

  for (const feed of feeds) {
    feedsList.append(createScheduledPostCard(feed));
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
      label: "Needs setup",
      tone: "blocked",
      detail: "Name, message, and button label are required before posting.",
    };
  }

  if (!panel.roleId) {
    return {
      label: "Needs role",
      tone: "blocked",
      detail: "Choose or enter the role this panel should assign.",
    };
  }

  if (!panel.targetChannelId) {
    return {
      label: "Needs channel",
      tone: "blocked",
      detail: "Choose or enter the channel where this panel should be posted.",
    };
  }

  if (guildMetadataLoaded && !metadataHasChannel(panel.targetChannelId)) {
    return {
      label: "Needs channel",
      tone: "blocked",
      detail: "The selected channel is not available in the sendable Discord channel list.",
    };
  }

  if (guildMetadataLoaded && !metadataHasRole(panel.roleId)) {
    return {
      label: "Needs role",
      tone: "blocked",
      detail: "The selected role was not found in Discord metadata.",
    };
  }

  return {
    label: "Ready",
    tone: "active",
    detail: panel.active ? "Members can use this role selection after it is posted." : "This setup is saved, but its button is turned off.",
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
  const title = panel.title || "Button message name";
  const body = panel.body || "Your Discord message will appear here.";
  const buttonLabel = panel.buttonLabel || "Get Role";
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
  customIdContext.textContent = "Button tracking: configured";
  context.append(roleContext, channelContext, statusContext, readinessContext, customIdContext);

  embed.append(embedTitle, embedBody);
  roleAccessPreview.append(previewHeader, embed, previewButton, context);
}

function resetRoleAccessPanelForm() {
  roleAccessPanelForm.reset();
  roleAccessPanelForm.elements.title.value = "New Button Message";
  roleAccessPanelForm.elements.body.value = "Click the button below to get the role.";
  roleAccessPanelForm.elements.buttonLabel.value = "Get Role";
  roleAccessPanelForm.elements.id.value = "";
  roleAccessPanelForm.elements.active.value = "true";
  setRoleAccessPanelStatus("New button message ready.");
  syncDiscordMetadataSelections();
  renderRoleAccessPreview();
}

function showRoleAccessPanelBuilder() {
  roleAccessPanelForm.hidden = false;
}

function hideRoleAccessPanelBuilder() {
  roleAccessPanelForm.hidden = true;
}

function createRoleAccessPanelDraft() {
  resetRoleAccessPanelForm();
  showRoleAccessPanelBuilder();
  window.requestAnimationFrame(() => {
    roleAccessPanelForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function populateRoleAccessPanelForm(panel) {
  showRoleAccessPanelBuilder();
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
  window.requestAnimationFrame(() => {
    roleAccessPanelForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function renderRoleAccessPanels() {
  roleAccessPanelsList.replaceChildren();

  if (roleAccessPanels.length === 0) {
    const emptyState = document.createElement("section");
    const emptyTitle = document.createElement("h3");
    const emptyCopy = document.createElement("p");

    emptyState.className = "channel-operation-card role-access-empty-callout";
    emptyTitle.textContent = "Create a role selection";
    emptyCopy.className = "channel-operation-detail";
    emptyCopy.textContent = "Start by naming what this gives members access to, such as a game server or private community.";
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
      createStatusBadge(panel.active ? "available" : "turned off", panel.active ? "active" : "neutral"),
      createStatusBadge(readiness.label, readiness.tone),
    );
    if (metadataWarnings.length > 0) {
      badges.append(createStatusBadge("setup warning", "blocked"));
    }
    roleDetail.className = "channel-operation-detail channel-operation-detail-strong";
    roleDetail.textContent = `Gives access through: ${getDetailedRoleLabel(panel.roleId)}`;
    channelDetail.className = "channel-operation-detail";
    channelDetail.textContent = `Posted in: ${getDetailedChannelLabel(panel.targetChannelId, "not set")}`;
    readinessDetail.className = "channel-operation-detail";
    readinessDetail.textContent = readiness.detail;
    metadataWarning.className = "channel-operation-detail role-followup-warning";
    metadataWarning.textContent = metadataWarnings.join(" ");
    metadataWarning.hidden = metadataWarnings.length === 0;
    postedDetail.className = "channel-operation-detail";
    postedDetail.textContent = panel.lastPostedAt
      ? `Last posted ${formatRelativeTime(panel.lastPostedAt)}.`
      : "Not posted from the dashboard yet.";
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Review access setup", () => populateRoleAccessPanelForm(panel)),
      createChannelActionButton("Post role selection", () => void postRoleAccessPanel(panel.id)),
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
  const statusBadge = createStatusBadge(followup.enabled ? "will send" : "turned off", followup.enabled ? "active" : "neutral");
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
  trigger.textContent = `When someone receives: ${getDetailedRoleLabel(followup.roleId)}`;
  action.textContent = `Cdawg posts in: ${getDetailedChannelLabel(followup.channelId, "not set")}`;
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

function showRoleFollowupBuilder() {
  roleFollowupForm.hidden = false;
}

function hideRoleFollowupBuilder() {
  roleFollowupForm.hidden = true;
}

function createRoleFollowupDraft() {
  resetRoleFollowupForm();
  showRoleFollowupBuilder();
  window.requestAnimationFrame(() => {
    roleFollowupForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function populateRoleFollowupForm(followup) {
  showRoleFollowupBuilder();
  roleFollowupForm.elements.id.value = followup.id;
  roleFollowupForm.elements.roleId.value = followup.roleId;
  roleFollowupForm.elements.channelId.value = followup.channelId;
  roleFollowupForm.elements.message.value = followup.message;
  roleFollowupForm.elements.enabled.value = String(followup.enabled !== false);
  setRoleFollowupStatus(`Editing follow-up for role ${followup.roleId}.`);
  syncDiscordMetadataSelections();
  renderRoleFollowupPreview();
  window.requestAnimationFrame(() => {
    roleFollowupForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function renderRoleFollowups() {
  roleFollowupsList.replaceChildren();

  if (roleFollowups.length === 0) {
    const emptyState = document.createElement("section");
    const emptyTitle = document.createElement("h3");
    const emptyCopy = document.createElement("p");

    emptyState.className = "channel-operation-card role-access-empty-callout";
    emptyTitle.textContent = "Create an access follow-up";
    emptyCopy.className = "channel-operation-detail";
    emptyCopy.textContent = "Start by choosing which access should trigger a welcome or next-step message.";
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
    title.textContent = `${getRoleLabel(followup.roleId)} follow-up`;
    badges.className = "channel-operation-badges";
    badges.append(createStatusBadge(followup.enabled ? "will send" : "turned off", followup.enabled ? "active" : "neutral"));
    if (metadataWarnings.length > 0) {
      badges.append(createStatusBadge("setup warning", "blocked"));
    }
    roleDetail.className = "channel-operation-detail channel-operation-detail-strong";
    roleDetail.textContent = `When someone receives: ${getDetailedRoleLabel(followup.roleId)}`;
    channelDetail.className = "channel-operation-detail";
    channelDetail.textContent = `Cdawg posts in: ${getDetailedChannelLabel(followup.channelId, "not set")}`;
    metadataWarning.className = "channel-operation-detail role-followup-warning";
    metadataWarning.textContent = metadataWarnings.join(" ");
    metadataWarning.hidden = metadataWarnings.length === 0;
    messagePreview.className = "channel-operation-detail";
    messagePreview.textContent = followup.message.length > 140 ? `${followup.message.slice(0, 140)}...` : followup.message;
    actions.className = "channel-operation-actions";
    actions.append(
      createChannelActionButton("Edit follow-up message", () => populateRoleFollowupForm(followup)),
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
    emptyState.textContent = "Daily Trivia is not configured yet.";
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
  title.textContent = `${historyReview.channelLabel ?? getChannelLabel(historyReview.channelId) ?? "History channel"} • This Day in History`;
  meta.className = "channel-operation-meta";
  meta.textContent = `${historyReview.dateLabel} • ${historyReview.totalEventsForDate} available item${historyReview.totalEventsForDate === 1 ? "" : "s"}`;
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
  const headers = new Headers(init?.headers || {});
  const apiToken = getApiToken();

  if (apiToken) {
    headers.set("X-Cdawg-Api-Token", apiToken);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });
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
    renderEngagementDashboard();
    setPrettyJson(healthOutput, data);
  } catch (error) {
    lastHealthSnapshot = { ok: false, botReady: false };
    healthCards.replaceChildren(createHealthCard("Health", "Unavailable", "bad"));
    renderOpsSnapshot();
    renderEngagementDashboard();
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

async function loadWelcomeSettings() {
  try {
    const data = await fetchJson("/api/welcome");
    welcomeSettings = data.settings;
    welcomePreviewMessage = data.preview || "";
    welcomeLoadError = null;
    renderWelcomeSummary();
    if (welcomeForm && !welcomeForm.hidden) {
      applyWelcomeSettingsToForm();
    }
  } catch (error) {
    welcomeSettings = null;
    welcomePreviewMessage = "";
    welcomeLoadError = `Welcome setup could not load. ${error.message}`;
    renderWelcomeSummary();
    setWelcomeStatus(`Welcome setup load failed: ${error.message}`, "error");
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
    renderMissionControl();
    setPrettyJson(metricsOutput, data);
  } catch (error) {
    lastMetricsSnapshot = null;
    renderSettingsSummary();
    renderMissionControl();
    metricsOutput.textContent = `Failed to load metrics.\n${error.message}`;
  }
}

async function loadAutomationActivity() {
  try {
    const data = await fetchJson("/api/automation-activity?limit=50");
    automationActivityItems = Array.isArray(data.items) ? data.items : [];
    renderAutomationActivity();
    renderMissionControl();
    setPrettyJson(automationActivityOutput, data);
  } catch (error) {
    automationActivityItems = [];
    renderAutomationActivity();
    renderMissionControl();
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
    manualPushChannelMeta.textContent = `Saved channel load failed: ${error.message}`;
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
    renderChannelSetupMetadataOptions();
    renderRoleAccessPreview();
    renderRoleAccessPanels();
    renderRoleFollowupPreview();
    renderRoleFollowups();
    renderComposerTemplates();
    renderWelcomeSummary();
    renderWelcomePreview();
    renderDiscoverySourceChannelOptions(rssDiscoverySourceForm?.hidden === false ? Array.from(rssDiscoverySourceForm.elements.preferredChannelIds.selectedOptions).map((option) => option.value) : []);
    renderOpsSnapshot();
  } catch (error) {
    guildRoles = [];
    guildChannels = [];
    guildMetadataLoaded = false;
    discordMetadataWarning.hidden = false;
    renderDiscordMetadataOptions();
    renderChannelSetupMetadataOptions();
    renderWelcomeSummary();
    renderWelcomePreview();
    renderDiscoverySourceChannelOptions();
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
    renderChannelSetupAssistant();
    setPrettyJson(feedsOutput, data);
  } catch (error) {
    feeds = [];
    renderFeeds();
    renderChannelSetupAssistant();
    feedsOutput.textContent = `Failed to load feeds.\n${error.message}`;
  }
}

async function loadRoleAccessPanels() {
  try {
    const data = await fetchJson("/api/role-access-panels");
    roleAccessPanels = Array.isArray(data.roleAccessPanels) ? data.roleAccessPanels : [];
    renderRoleAccessPanels();
    renderChannelSetupAssistant();
    renderOpsSnapshot();
    setPrettyJson(roleAccessPanelsOutput, data);
  } catch (error) {
    roleAccessPanels = [];
    renderRoleAccessPanels();
    renderChannelSetupAssistant();
    renderOpsSnapshot();
    roleAccessPanelsOutput.textContent = `Failed to load role signup buttons.\n${error.message}`;
    setRoleAccessPanelStatus(`Role signup buttons failed to load: ${error.message}`, "error");
  }
}

async function loadRoleFollowups() {
  try {
    const data = await fetchJson("/api/role-followups");
    roleFollowups = Array.isArray(data.roleFollowups) ? data.roleFollowups : [];
    renderRoleFollowups();
    renderChannelSetupAssistant();
    renderOpsSnapshot();
    setPrettyJson(roleFollowupsOutput, data);
  } catch (error) {
    roleFollowups = [];
    renderRoleFollowups();
    renderChannelSetupAssistant();
    renderOpsSnapshot();
    roleFollowupsOutput.textContent = `Failed to load role follow-ups.\n${error.message}`;
    setRoleFollowupStatus(`Follow-up load failed: ${error.message}`, "error");
  }
}

async function loadChannelProfiles() {
  try {
    const data = await fetchJson("/api/channel-profiles");
    channelProfiles = Array.isArray(data.channelProfiles) ? data.channelProfiles : [];
    applySavedChannelProfileToAssistant(channelSetupChannel?.value ?? "");
    renderChannelSetupAssistant();
    renderMissionControl();
    renderContentSourceLibrary();
    renderChannelIntelligence();
  } catch (error) {
    channelProfiles = [];
    renderChannelSetupAssistant();
    renderMissionControl();
    renderContentSourceLibrary();
    renderChannelIntelligence();
    setChannelSetupAssistantStatus(`Channel profiles failed to load: ${error.message}`, "blocked");
  }
}

async function loadDiscoveryItems() {
  try {
    const data = await fetchJson("/api/discovery/items");
    discoveryItems = Array.isArray(data.items) ? data.items : [];
    discoveryItemsLoadError = null;
    renderMissionControl();
    if (activeContentStudioMode === "discovery") {
      renderContentDiscoveryReview();
    }
  } catch (error) {
    discoveryItems = [];
    discoveryItemsLoadError = error.message;
    console.warn(`[discovery] persisted discovery items failed to load: ${error.message}`);
    renderMissionControl();
    if (activeContentStudioMode === "discovery") {
      renderContentDiscoveryReview();
    }
  }
}

async function loadDiscoverySources() {
  try {
    const data = await fetchJson("/api/discovery/sources");
    discoverySources = Array.isArray(data.sources) ? data.sources : [];
    discoverySourcesLoadError = null;
    renderDiscoverySources();
  } catch (error) {
    discoverySources = [];
    discoverySourcesLoadError = error.message;
    console.warn(`[discovery] discovery sources failed to load: ${error.message}`);
    renderDiscoverySources();
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
    setComposerTemplateStatus(`Saved messages failed to load: ${error.message}`, "error");
  }
}

async function loadDailyTriviaChallenge() {
  try {
    const data = await fetchJson("/api/daily-trivia");
    applyAutomationMasterState(data.automationMaster);
    dailyTriviaChallenge = data.dailyTriviaChallenge ?? null;
    renderAutomationMaster();
    renderDailyTriviaChallenge();
    renderCommunityRecognition();
    setPrettyJson(dailyTriviaOutput, data);
  } catch (error) {
    dailyTriviaChallenge = null;
    renderDailyTriviaChallenge();
    renderCommunityRecognition();
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
    renderCommunityRecognition();
    setPrettyJson(dogOutput, data);
  } catch (error) {
    dogSystemEnabled = false;
    dogState = null;
    renderDogSummary();
    renderCommunityRecognition();
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
    renderChannelSetupAssistant();
    renderPalworldLaunchControl();
    renderOpsSnapshot();
    setPrettyJson(channelOperationsOutput, data);
  } catch (error) {
    channelAutomationStatuses = [];
    renderChannelOperations();
    renderChannelSetupAssistant();
    renderPalworldLaunchControl();
    renderOpsSnapshot();
    channelOperationsOutput.textContent = `Failed to load channel automation status.\n${error.message}`;
  }
}

async function loadChannelIntelligence() {
  try {
    const data = await fetchJson("/api/channel-intelligence");
    channelIntelligence = data;
    channelIntelligenceLoadError = null;
    renderChannelIntelligence();
    renderEngagementDashboard();
    renderPalworldLaunchControl();
    const hashChannelId = getDrawerChannelIdFromHash();
    if (hashChannelId && getChannelIntelligenceById(hashChannelId)) {
      openChannelActionDrawer(hashChannelId, { skipHash: true });
    }
  } catch (error) {
    channelIntelligence = null;
    channelIntelligenceLoadError = error.message;
    renderChannelIntelligence();
    renderEngagementDashboard();
    renderPalworldLaunchControl();
  }
}

async function loadEngagementSummary() {
  try {
    const data = await fetchJson("/api/engagement-summary");
    engagementSummary = data;
    engagementSummaryLoadError = null;
    renderEngagementDashboard();
    renderPalworldLaunchControl();
    renderMissionControl();
  } catch (error) {
    engagementSummary = null;
    engagementSummaryLoadError = error.message;
    renderEngagementDashboard();
    renderPalworldLaunchControl();
    renderMissionControl();
  }
}

async function loadContentOutcomes() {
  try {
    const data = await fetchJson("/api/content-outcomes?limit=50");
    contentOutcomes = Array.isArray(data.items) ? data.items : [];
    contentOutcomesLoadError = null;
    renderContentOutcomes();
    renderPalworldLaunchControl();
    renderMissionControl();
  } catch (error) {
    contentOutcomes = [];
    contentOutcomesLoadError = error.message;
    renderContentOutcomes();
    renderPalworldLaunchControl();
    renderMissionControl();
  }
}

async function postPalworldLaunchMessage(kind) {
  const channelId = getPalworldChannelId();
  const message = kind === "server-info" ? palworldServerInfoReminder : palworldJoiningPrompt;

  if (!channelId) {
    setPalworldStatus("Palworld channel is not configured.", "error");
    return;
  }

  const confirmed = window.confirm(`Post this to ${getPalworldChannelLabel()}?\n\n${message}`);

  if (!confirmed) {
    setPalworldStatus("Post canceled.", "neutral");
    return;
  }

  setPalworldStatus("Posting Palworld message...");

  try {
    const data = await fetchJson("/api/composer/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId,
        message,
      }),
    });

    setPalworldStatus(`Posted to ${getChannelLabel(data.channelId)}.`, "success");
    await Promise.all([loadContentOutcomes(), loadHealth()]);
  } catch (error) {
    setPalworldStatus(`Post failed: ${error.message}`, "error");
  }
}

async function setPalworldAutomationPaused(paused) {
  const channelId = getPalworldChannelId();

  if (!channelId) {
    setPalworldStatus("Palworld channel is not configured.", "error");
    return;
  }

  setPalworldStatus(paused ? "Pausing Palworld automation..." : "Resuming Palworld automation...");

  try {
    if (paused) {
      await applyChannelAutomationEnabled(channelId, false);
    } else {
      await applyChannelOperation(channelId, "resume");
    }

    await loadChannelIntelligence();
    setPalworldStatus(paused ? "Palworld automation paused." : "Palworld automation resumed.", "success");
  } catch (error) {
    setPalworldStatus(`Automation update failed: ${error.message}`, "error");
  }
}

async function loadOpportunities() {
  try {
    const data = await fetchJson("/api/opportunities");
    backendOpportunities = Array.isArray(data.opportunities) ? data.opportunities : [];
    backendOpportunitiesLoadError = null;
    renderBackendOpportunities();
    restoreOpportunityContextFromUrl();
    const hashOpportunityId = getOpportunityIdFromHash();
    if (hashOpportunityId && getOpportunityById(hashOpportunityId)) {
      openOpportunityActionDrawer(hashOpportunityId, { skipHash: true });
    }
  } catch (error) {
    backendOpportunities = [];
    backendOpportunitiesLoadError = error.message;
    renderBackendOpportunities();
  }
}

async function loadDailyBriefing() {
  try {
    const data = await fetchJson("/api/daily-briefing");
    dailyBriefing = data;
    dailyBriefingLoadError = null;
    renderDailyBriefing();
  } catch (error) {
    dailyBriefing = null;
    dailyBriefingLoadError = error.message;
    renderDailyBriefing();
  }
}

async function rerollHistoryReview() {
  setHistoryReviewStatus("Picking another item...");

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
    setHistoryReviewStatus("Another item picked.", "success");
  } catch (error) {
    setHistoryReviewStatus(`Pick another item failed: ${error.message}`, "error");
  }
}

async function pushHistoryReviewPreview() {
  if (!historyReview?.previewEvent) {
    setHistoryReviewStatus("No previewed history event is available to send.", "error");
    return;
  }

  const destination = historyReview.channelLabel ?? getChannelLabel(historyReview.channelId) ?? "the selected channel";
  const confirmed = window.confirm(`Post this history item to ${destination}?\n\n${historyReview.previewEvent.title}`);

  if (!confirmed) {
    setHistoryReviewStatus("Post canceled.");
    return;
  }

  setHistoryReviewStatus("Sending preview...");

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
    setHistoryReviewStatus(`Posted to ${destination}.`, "success");
    await loadContentOutcomes();
  } catch (error) {
    setHistoryReviewStatus(`Send failed: ${error.message}`, "error");
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

  const payload = buildManualPushPayload();
  const selectedPreset = getSelectedChannelPreset();

  if (!payload.channelId) {
    setManualPushStatus("Choose where this post should appear.", "error");
    return;
  }

  const destination = selectedPreset?.label ?? getChannelLabel(payload.channelId) ?? "the selected channel";
  const confirmed = window.confirm(`Post a ${payload.contentType} to ${destination}?`);

  if (!confirmed) {
    setManualPushStatus("Post canceled.");
    return;
  }

  setManualPushStatus("Posting...");
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
    setManualPushStatus(`Posted ${data.contentType} to ${getChannelLabel(data.channelId) || destination}.`, "success");
    await Promise.all([loadHealth(), loadContentOutcomes()]);
  } catch (error) {
    manualPushOutput.textContent = `Generated post failed.\n${error.message}`;
    setManualPushStatus(`Send failed: ${error.message}`, "error");
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

  const destination = getChannelLabel(payload.channelId) || "the selected channel";
  const confirmed = window.confirm(`Post this message to ${destination}?\n\n${payload.message}`);

  if (!confirmed) {
    setComposerStatus("Post canceled.");
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
    setComposerStatus(`Posted to ${getChannelLabel(data.channelId) || destination}.`, "success");
    if (activePreparedDiscoveryItemId) {
      try {
        await updateDiscoveryItemWorkflowStateById(activePreparedDiscoveryItemId, "posted", {
          preparedMessage: payload.message,
        });
        setActivePreparedDiscoveryItem(null);
        await loadDiscoveryItems();
      } catch (error) {
        console.warn(`[discovery] posted state update failed: ${error.message}`);
      }
    }
    await Promise.all([loadHealth(), loadContentOutcomes()]);
  } catch (error) {
    composerOutput.textContent = `Message post failed.\n${error.message}`;
    setComposerStatus(`Post failed: ${error.message}`, "error");
  }
}

async function submitWelcomeSettings(event) {
  event.preventDefault();

  const payload = getWelcomeFormValue();

  if (!payload.welcomeChannelId) {
    setWelcomeStatus("Choose a destination channel.", "error");
    return;
  }

  if (!payload.messageTemplate.trim()) {
    setWelcomeStatus("Write a welcome message before saving.", "error");
    return;
  }

  setWelcomeStatus("Saving...");

  try {
    const data = await fetchJson("/api/welcome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enabled: payload.enabled,
        welcomeChannelId: payload.welcomeChannelId,
        messageTemplate: payload.messageTemplate,
      }),
    });

    welcomeSettings = data.settings;
    welcomePreviewMessage = data.preview || "";
    welcomeLoadError = null;
    renderWelcomeSummary();
    applyWelcomeSettingsToForm();
    welcomeForm.hidden = true;
    setWelcomeStatus("Welcome message saved.", "success");
  } catch (error) {
    setWelcomeStatus(`Save failed: ${error.message}`, "error");
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
    await Promise.all([loadChannelOperations(), loadChannelIntelligence()]);
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
    setFeedStatus(feedId ? "Scheduled post updated." : "Scheduled post created.", "success");
    resetFeedForm();
    await Promise.all([loadFeeds(), loadChannelOperations(), loadChannelIntelligence()]);
  } catch (error) {
    setFeedStatus(`Scheduled post save failed: ${error.message}`, "error");
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
    await loadChannelIntelligence();
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
    await loadChannelIntelligence();
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
    await loadChannelIntelligence();
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
    await loadChannelIntelligence();
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
    await Promise.all([loadFeeds(), loadChannelOperations(), loadChannelIntelligence()]);
  } catch (error) {
    feedsOutput.textContent = `Scheduled post toggle failed.\n${error.message}`;
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
    await Promise.all([loadFeeds(), loadChannelOperations(), loadChannelIntelligence()]);
  } catch (error) {
    feedsOutput.textContent = `Scheduled post delete failed.\n${error.message}`;
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
    await Promise.all([loadChannelOperations(), loadChannelIntelligence()]);
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
    await Promise.all([loadChannelOperations(), loadFeeds(), loadDailyTriviaChallenge(), loadChannelIntelligence()]);
  } catch (error) {
    automationMasterDetail.textContent = `Automation master update failed: ${error.message}`;
  }
}

async function reloadAll() {
  await Promise.all([
    loadHealth(),
    loadWelcomeSettings(),
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
    loadChannelProfiles(),
    loadChannelIntelligence(),
    loadEngagementSummary(),
    loadContentOutcomes(),
    loadOpportunities(),
    loadDailyBriefing(),
    loadDiscoverySources(),
    loadDiscoveryItems(),
    loadComposerTemplates(),
  ]);
  renderMissionControl();
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

function jumpToRecentProblems() {
  setActiveControlTab("overview");
  document.querySelector("#home-recent-activity")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

for (const button of controlTabButtons) {
  button.addEventListener("click", () => setActiveControlTab(button.dataset.tabTarget || "overview"));
}

for (const button of contentStudioModeButtons) {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const targetMode = button.dataset.contentStudioModeTarget || "generate";
    if (targetMode === "discovery") {
      selectedDiscoveryCardId = null;
    }
    setActiveContentStudioMode(targetMode);
    const targetSectionByMode = {
      write: "#post-now-message",
      saved: "#post-now-saved-messages",
      generate: "#post-now-generated-content",
      history: "#post-now-history",
      scheduled: "#create-post-scheduled-posts",
      discovery: "#content-discovery-review",
      outcomes: ".content-outcomes-panel",
      advanced: "#create-post-advanced",
    };
    window.requestAnimationFrame(() => {
      document.querySelector(targetSectionByMode[targetMode] || "#post-now-message")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

if (addRssDiscoverySourceButton) {
  addRssDiscoverySourceButton.addEventListener("click", showContentSourceLibrary);
}

if (addManualRssDiscoverySourceButton) {
  addManualRssDiscoverySourceButton.addEventListener("click", () => showRssDiscoverySourceForm());
}

if (contentSourceLibraryProfileSelect) {
  contentSourceLibraryProfileSelect.addEventListener("change", () => {
    activeContentSourceLibraryCategory = "Recommended";
    renderContentSourceLibrary();
  });
}

if (refreshEnabledRssDiscoverySourcesButton) {
  refreshEnabledRssDiscoverySourcesButton.addEventListener("click", () => void refreshRssDiscoverySources());
}

if (cancelRssDiscoverySourceButton) {
  cancelRssDiscoverySourceButton.addEventListener("click", () => {
    resetRssDiscoverySourceForm();
    setRssDiscoverySourceStatus("RSS source edit cancelled.");
  });
}

if (deleteRssDiscoverySourceButton) {
  deleteRssDiscoverySourceButton.addEventListener("click", () => void deleteRssDiscoverySource());
}

if (rssDiscoverySourceForm) {
  rssDiscoverySourceForm.addEventListener("submit", (event) => void submitRssDiscoverySource(event));
}

apiConfigForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  apiBaseUrlInput.value = getApiBaseUrl();
  window.localStorage.setItem(apiBaseUrlStorageKey, apiBaseUrlInput.value);
  const apiToken = getApiToken();
  if (apiToken) {
    window.localStorage.setItem(apiTokenStorageKey, apiToken);
  } else {
    window.localStorage.removeItem(apiTokenStorageKey);
  }
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
welcomeForm?.addEventListener("submit", submitWelcomeSettings);
welcomeForm?.addEventListener("input", (event) => {
  if (event.target?.matches?.("[data-discord-channel-select]")) {
    updateDiscordMetadataSelection(event.target);
    return;
  }

  if (event.target === welcomeForm.elements.manualWelcomeChannelId && event.target.value.trim()) {
    welcomeForm.elements.welcomeChannelId.value = event.target.value.trim();
    syncDiscordMetadataSelections();
  }

  renderWelcomePreview();
});
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
for (const button of document.querySelectorAll("[data-welcome-insert]")) {
  button.addEventListener("click", () => insertIntoWelcomeMessage(button.dataset.welcomeInsert || ""));
}
for (const select of document.querySelectorAll("[data-discord-role-select], [data-discord-channel-select]")) {
  select.addEventListener("change", () => updateDiscordMetadataSelection(select));
}
manualPushForm.elements.channelPreset.addEventListener("change", () => syncManualPushPresetSelection(true));
editWelcomeMessageButton?.addEventListener("click", openWelcomeEditor);
cancelWelcomeEditButton?.addEventListener("click", closeWelcomeEditor);
saveComposerDraftButton.addEventListener("click", saveComposerDraft);
clearComposerButton.addEventListener("click", clearComposer);
undoComposerRewriteButton.addEventListener("click", undoComposerRewrite);
saveComposerTemplateButton.addEventListener("click", () => void saveComposerTemplate());
resetSettingsButton.addEventListener("click", resetSettingsForm);
resetFeedFormButton.addEventListener("click", () => {
  resetFeedForm();
  hideFeedForm();
});
resetDailyTriviaFormButton?.addEventListener("click", () => {
  applyDailyTriviaToForm(dailyTriviaChallenge);
  hideDailyTriviaForm();
  setDailyTriviaStatus("Daily trivia config closed.");
});
resetRoleAccessPanelFormButton.addEventListener("click", () => {
  resetRoleAccessPanelForm();
  hideRoleAccessPanelBuilder();
});
postRoleAccessPanelFormButton.addEventListener("click", () => void postCurrentRoleAccessPanel());
resetRoleFollowupFormButton.addEventListener("click", () => {
  resetRoleFollowupForm();
  hideRoleFollowupBuilder();
});
deleteRoleFollowupFormButton.addEventListener("click", () => void deleteCurrentRoleFollowup());
refreshAllButton.addEventListener("click", () => void reloadAll());
missionRefreshDashboardButton.addEventListener("click", () => void reloadAll());
automationMasterButton.addEventListener("click", () => void toggleAutomationMaster());
opsRefreshDashboardButton.addEventListener("click", () => void reloadAll());
opsJumpChannelsButton.addEventListener("click", () => setActiveControlTab("channels"));
opsJumpAccessButton.addEventListener("click", () => setActiveControlTab("access"));
opsJumpFollowupsButton.addEventListener("click", jumpToCommunityFollowups);
taskManageAutomationButton.addEventListener("click", () => setActiveControlTab("channels"));
taskPostNowButton.addEventListener("click", () => setActiveControlTab("push"));
taskCommunityButton.addEventListener("click", () => setActiveControlTab("access"));
taskRecentProblemsButton.addEventListener("click", jumpToRecentProblems);
taskSettingsButton.addEventListener("click", () => setActiveControlTab("settings"));
communityOpenChannelSetupButton?.addEventListener("click", openChannelSetupAssistant);
settingsOpenChannelSetupButton?.addEventListener("click", openChannelSetupAssistant);
channelActionDrawerClose?.addEventListener("click", () => closeChannelActionDrawer());
opportunityActionDrawerClose?.addEventListener("click", () => closeOpportunityActionDrawer());
opportunityContextDismiss?.addEventListener("click", dismissOpportunityContext);
refreshHealthButton.addEventListener("click", loadHealth);
refreshSettingsButton.addEventListener("click", loadSettings);
refreshMetricsButton.addEventListener("click", loadMetrics);
refreshChannelOperationsButton.addEventListener("click", loadChannelOperations);
refreshFeedsButton.addEventListener("click", loadFeeds);
refreshRoleAccessPanelsButton.addEventListener("click", loadRoleAccessPanels);
refreshRoleFollowupsButton.addEventListener("click", loadRoleFollowups);
refreshEngagementButton?.addEventListener("click", () => void Promise.all([loadEngagementSummary(), loadContentOutcomes()]));
refreshHistoryReviewButton.addEventListener("click", () => void loadHistoryReview());
rerollHistoryReviewButton.addEventListener("click", () => void rerollHistoryReview());
pushHistoryPreviewButton.addEventListener("click", () => void pushHistoryReviewPreview());
createFeedButton?.addEventListener("click", createFeedDraft);
createFeedFromPostButton?.addEventListener("click", createFeedDraft);
createFeedInlineButton?.addEventListener("click", createFeedDraft);
configureDailyTriviaButton?.addEventListener("click", configureDailyTrivia);
configureDailyTriviaInlineButton?.addEventListener("click", configureDailyTrivia);
createRoleAccessPanelButton?.addEventListener("click", createRoleAccessPanelDraft);
createRoleFollowupButton?.addEventListener("click", createRoleFollowupDraft);
channelOperationsFilter.addEventListener("change", renderChannelOperations);
channelOperationsSort.addEventListener("change", renderChannelOperations);
channelIntelligenceFilter?.addEventListener("change", renderChannelIntelligence);
engagementWindowFilter?.addEventListener("change", renderEngagementDashboard);
engagementStatusFilter?.addEventListener("change", renderEngagementDashboard);
communityActivityWindow?.addEventListener("change", renderCommunityActivity);
contentOutcomesSourceFilter?.addEventListener("change", renderContentOutcomes);
for (const button of document.querySelectorAll("[data-community-open-automation]")) {
  button.addEventListener("click", () => navigateMissionAction(createMissionNavigation("channels", button.dataset.communityOpenAutomation)));
}
palworldPostInfoButton?.addEventListener("click", () => void postPalworldLaunchMessage("server-info"));
palworldPostPromptButton?.addEventListener("click", () => void postPalworldLaunchMessage("joining-prompt"));
palworldPauseAutomationButton?.addEventListener("click", () => void setPalworldAutomationPaused(true));
palworldResumeAutomationButton?.addEventListener("click", () => void setPalworldAutomationPaused(false));
autoRefreshEnabledInput.addEventListener("change", configureAutoRefresh);

missionOpenChannelSetupButton?.addEventListener("click", openChannelSetupAssistant);
channelSetupChannel?.addEventListener("change", handleChannelSetupChannelChange);
channelSetupPurpose?.addEventListener("change", handleChannelSetupPurposeChange);
channelSetupAccessMode?.addEventListener("change", renderChannelSetupAssistant);
channelSetupAudience?.addEventListener("change", renderChannelSetupAssistant);
channelSetupTone?.addEventListener("change", renderChannelSetupAssistant);
channelSetupRole?.addEventListener("change", renderChannelSetupAssistant);
for (const input of channelSetupContentTypes) {
  input.addEventListener("change", renderChannelSetupAssistant);
}
channelSetupTopic?.addEventListener("input", renderChannelSetupAssistant);
channelSetupNotes?.addEventListener("input", renderChannelSetupAssistant);
channelSetupSaveProfileButton?.addEventListener("click", () => void saveChannelSetupProfile());
channelSetupDeleteProfileButton?.addEventListener("click", () => void deleteChannelSetupProfile());
channelSetupOpenRolePanelButton?.addEventListener("click", prefillRoleAccessPanelFromChannelSetup);
channelSetupOpenFollowupsButton?.addEventListener("click", prefillRoleFollowupFromChannelSetup);
channelSetupOpenFeedsButton?.addEventListener("click", prefillFeedFromChannelSetup);
channelSetupOpenGenerateButton?.addEventListener("click", prefillManualPushFromChannelSetup);
channelSetupResetButton?.addEventListener("click", resetChannelSetupAssistant);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && channelActionDrawer && !channelActionDrawer.hidden) {
    closeChannelActionDrawer();
    return;
  }

  if (event.key === "Escape" && opportunityActionDrawer && !opportunityActionDrawer.hidden) {
    closeOpportunityActionDrawer();
  }
});

window.addEventListener("hashchange", handleDashboardHashChange);

configureAutoRefresh();
setActiveContentStudioMode(activeContentStudioMode);
setActiveControlTab(activeControlTab);
applyLegacyTabHash();
renderAutomationMaster();
renderDailyBriefing();
renderWelcomeSummary();
renderOpsSnapshot();
renderAutomationActivity();
renderChannelSetupMetadataOptions();
applyChannelSetupPurposeDefaults();
loadComposerDraft();
renderRoleAccessPreview();
renderRoleFollowupPreview();
void reloadAll();
