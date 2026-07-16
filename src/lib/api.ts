// Aion API layer — proxies to gateway internal API
// Gateway must be running on the same host (or set GATEWAY_URL)

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:8000";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "";

async function gw(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (INTERNAL_SECRET) {
    headers["Authorization"] = `Bearer ${INTERNAL_SECRET}`;
  }
  const res = await fetch(`${GATEWAY_URL}${path}`, { ...options, headers });
  return res.json();
}

export interface KeyInfo {
  key: string;
  name: string;
  status: string;
  remain_quota: number;
  total_quota: number;
  unlimited_quota: boolean | number;
  expired_time: number;
  created_at: string;
  last_used: string | null;
  role: string;
  rate_limit_rpm?: number;
  rate_limit_rpd?: number;
}

export async function loginWithKey(api_key: string) {
  return gw("/internal/login", {
    method: "POST",
    body: JSON.stringify({ api_key }),
  });
}

export async function getMe(api_key: string) {
  return gw("/internal/me", {
    headers: { Authorization: `Bearer ${api_key}` },
  });
}

export async function getUsageLogs(api_key: string) {
  return gw("/internal/me/logs", {
    headers: { Authorization: `Bearer ${api_key}` },
  });
}

// Admin: requires admin JWT cookie or internal secret
export async function getAllKeys(adminKey: string) {
  return gw("/internal/keys", {
    headers: { Authorization: `Bearer ${adminKey}` },
  });
}

export async function createKey(adminKey: string, info: { name: string; quota: number; days: number; unlimited_quota?: boolean }) {
  return gw("/internal/keys", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminKey}` },
    body: JSON.stringify({
      name: info.name,
      quota: info.quota,
      unlimited_quota: info.unlimited_quota || false,
      expired_time: Math.floor(Date.now() / 1000) + info.days * 86400,
    }),
  });
}

export async function updateKey(adminKey: string, fullKey: string, updates: Record<string, any>) {
  return gw(`/internal/keys/${encodeURIComponent(fullKey)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${adminKey}` },
    body: JSON.stringify(updates),
  });
}

export async function deleteKey(adminKey: string, fullKey: string) {
  return gw(`/internal/keys/${encodeURIComponent(fullKey)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminKey}` },
  });
}

export async function getModels() {
  return gw("/internal/models");
}

export { GATEWAY_URL };