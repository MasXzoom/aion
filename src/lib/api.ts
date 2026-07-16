// API middleware — proxies to gateway backend
// ponytail: single gateway URL, config per env if needed

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:8000";
const ADMIN_KEY = process.env.ADMIN_KEY || "sk-admin-master";

interface KeyInfo {
  key: string;
  name: string;
  status: string;
  remain_quota: number;
  total_quota: number;
  unlimited_quota: boolean;
  expired_time: number;
  created_at: string;
  last_used: string | null;
  role: "user" | "admin";
}

// In-memory + JSON file store for keys (synced with gateway)
// ponytail: use SQLite or Redis if >1000 keys
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const KEYS_FILE = path.join(DATA_DIR, "keys.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadKeys(): Record<string, KeyInfo> {
  ensureDataDir();
  if (!fs.existsSync(KEYS_FILE)) return {};
  return JSON.parse(fs.readFileSync(KEYS_FILE, "utf-8"));
}

function saveKeys(keys: Record<string, KeyInfo>) {
  ensureDataDir();
  fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
}

// Seed default admin key if empty
function seedKeys() {
  const keys = loadKeys();
  if (Object.keys(keys).length === 0) {
    keys[ADMIN_KEY] = {
      key: ADMIN_KEY,
      name: "Admin Master",
      status: "active",
      remain_quota: 999999999,
      total_quota: 999999999,
      unlimited_quota: true,
      expired_time: -1,
      created_at: new Date().toISOString(),
      last_used: null,
      role: "admin",
    };
    saveKeys(keys);
  }
  return keys;
}

export function getKeyInfo(apiKey: string): KeyInfo | null {
  const keys = seedKeys();
  return keys[apiKey] || null;
}

export function getAllKeys(): KeyInfo[] {
  const keys = seedKeys();
  return Object.values(keys);
}

export function createKey(info: KeyInfo): KeyInfo {
  const keys = seedKeys();
  keys[info.key] = info;
  saveKeys(keys);
  return info;
}

export function updateKey(apiKey: string, updates: Partial<KeyInfo>): KeyInfo | null {
  const keys = seedKeys();
  if (!keys[apiKey]) return null;
  keys[apiKey] = { ...keys[apiKey], ...updates };
  saveKeys(keys);
  return keys[apiKey];
}

export function deleteKey(apiKey: string): boolean {
  const keys = seedKeys();
  if (!keys[apiKey]) return false;
  delete keys[apiKey];
  saveKeys(keys);
  return true;
}

export function getUsageLogs(apiKey: string): any[] {
  // ponytail: real usage logs from gateway DB. Stub for now.
  const logsFile = path.join(DATA_DIR, `usage_${apiKey.replace(/[^a-zA-Z0-9]/g, "_")}.json`);
  if (!fs.existsSync(logsFile)) return [];
  return JSON.parse(fs.readFileSync(logsFile, "utf-8"));
}

export function logUsage(apiKey: string, entry: any) {
  const logsFile = path.join(DATA_DIR, `usage_${apiKey.replace(/[^a-zA-Z0-9]/g, "_")}.json`);
  const logs = getUsageLogs(apiKey);
  logs.unshift({ ...entry, timestamp: new Date().toISOString() });
  // Keep last 500
  fs.writeFileSync(logsFile, JSON.stringify(logs.slice(0, 500), null, 2));
}

export { GATEWAY_URL, ADMIN_KEY };