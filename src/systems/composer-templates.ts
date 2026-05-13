import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ComposerTemplate = {
  id: string;
  name: string;
  channelId: string | null;
  roleId: string | null;
  message: string;
  createdAt: number;
  updatedAt: number;
};

type ComposerTemplateStore = {
  templates: ComposerTemplate[];
};

type ComposerTemplateInput = Pick<ComposerTemplate, "name" | "channelId" | "roleId" | "message"> &
  Partial<Pick<ComposerTemplate, "id" | "createdAt" | "updatedAt">>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "composer-templates.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeRequiredString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeNullableString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function createTemplateId() {
  return `template_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeTemplate(value: unknown): ComposerTemplate | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeRequiredString(value.id);
  const name = sanitizeRequiredString(value.name);
  const message = sanitizeRequiredString(value.message);
  const createdAt = sanitizeTimestamp(value.createdAt);
  const updatedAt = sanitizeTimestamp(value.updatedAt);

  if (!id || !name || !message || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    name,
    channelId: sanitizeNullableString(value.channelId),
    roleId: sanitizeNullableString(value.roleId),
    message,
    createdAt,
    updatedAt,
  };
}

function sanitizeStore(value: unknown): ComposerTemplateStore {
  if (!isRecord(value) || !Array.isArray(value.templates)) {
    return {
      templates: [],
    };
  }

  return {
    templates: value.templates
      .map((template) => sanitizeTemplate(template))
      .filter((template): template is ComposerTemplate => Boolean(template)),
  };
}

function saveTemplateStore(store: ComposerTemplateStore) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(store, null, 2));
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[composer-templates] could not save templates to ${DATA_FILE}.`, error);
  }
}

function loadTemplateStore(): ComposerTemplateStore {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    return sanitizeStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[composer-templates] could not load templates from ${DATA_FILE}.`, error);
    }

    return {
      templates: [],
    };
  }
}

let activeTemplateStore = loadTemplateStore();

export function listComposerTemplates() {
  return activeTemplateStore.templates;
}

export function upsertComposerTemplate(template: ComposerTemplateInput) {
  const now = Date.now();
  const id = template.id?.trim() || createTemplateId();
  const currentTemplate = activeTemplateStore.templates.find((entry) => entry.id === id);
  const nextTemplate: ComposerTemplate = {
    id,
    name: template.name.trim(),
    channelId: template.channelId?.trim() || null,
    roleId: template.roleId?.trim() || null,
    message: template.message.trim(),
    createdAt: currentTemplate?.createdAt ?? template.createdAt ?? now,
    updatedAt: now,
  };

  activeTemplateStore = {
    templates: currentTemplate
      ? activeTemplateStore.templates.map((entry) => (entry.id === id ? nextTemplate : entry))
      : [...activeTemplateStore.templates, nextTemplate],
  };
  saveTemplateStore(activeTemplateStore);
  return nextTemplate;
}

export function deleteComposerTemplate(id: string) {
  const currentTemplate = activeTemplateStore.templates.find((entry) => entry.id === id);

  if (!currentTemplate) {
    return false;
  }

  activeTemplateStore = {
    templates: activeTemplateStore.templates.filter((entry) => entry.id !== id),
  };
  saveTemplateStore(activeTemplateStore);
  return true;
}

