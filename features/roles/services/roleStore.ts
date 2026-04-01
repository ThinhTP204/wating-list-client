export interface SystemRole {
  id: string;
  key: string;
  name: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
}

export interface RoleOption {
  value: string;
  label: string;
}

const STORAGE_KEY = "wokki.system.roles";

const DEFAULT_ROLES: SystemRole[] = [
  {
    id: "role-staff",
    key: "staff",
    name: "Nhân viên",
    description: "Role mặc định cho toàn bộ nhân sự.",
    isSystem: true,
    createdAt: new Date("2026-01-01").toISOString(),
  },
];

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function notifyRoleChange(): void {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new CustomEvent("roles:updated"));
}

export function normalizeRoleName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 30);
}

export function loadRoles(): SystemRole[] {
  if (!canUseStorage()) {
    return DEFAULT_ROLES;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_ROLES;
  }

  try {
    const parsed = JSON.parse(raw) as SystemRole[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_ROLES;
    }

    return parsed;
  } catch {
    return DEFAULT_ROLES;
  }
}

export function saveRoles(roles: SystemRole[]): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
  notifyRoleChange();
}

export function createRole(name: string, description: string): SystemRole {
  const key = normalizeRoleName(name);
  const trimmedName = name.trim();

  if (!key || !trimmedName) {
    throw new Error("Tên role không hợp lệ");
  }

  const current = loadRoles();
  if (current.some((role) => role.key === key)) {
    throw new Error("Role đã tồn tại");
  }

  const created: SystemRole = {
    id: `role-${Date.now()}`,
    key,
    name: trimmedName,
    description: description.trim() || "Role tùy chỉnh",
    isSystem: false,
    createdAt: new Date().toISOString(),
  };

  saveRoles([...current, created]);
  return created;
}

export function updateRole(
  roleId: string,
  payload: Pick<SystemRole, "name" | "description">
): void {
  const current = loadRoles();
  const target = current.find((role) => role.id === roleId);
  if (!target) {
    throw new Error("Không tìm thấy role");
  }

  const nextName = payload.name.trim();
  const nextDescription = payload.description.trim();
  const nextKey = normalizeRoleName(nextName);
  if (!nextName || !nextKey) {
    throw new Error("Tên role không hợp lệ");
  }

  const duplicated = current.some((role) => role.id !== roleId && role.key === nextKey);
  if (duplicated) {
    throw new Error("Role đã tồn tại");
  }

  const updated = current.map((role) =>
    role.id === roleId
      ? {
          ...role,
          key: nextKey,
          name: nextName,
          description: nextDescription || "Role tùy chỉnh",
        }
      : role
  );

  saveRoles(updated);
}

export function deleteRole(roleId: string): void {
  const current = loadRoles();
  const target = current.find((role) => role.id === roleId);
  if (!target) {
    return;
  }

  if (target.isSystem) {
    throw new Error("Không thể xóa role hệ thống");
  }

  const next = current.filter((role) => role.id !== roleId);
  saveRoles(next.length > 0 ? next : DEFAULT_ROLES);
}

export function toRoleOptions(roles: SystemRole[]): RoleOption[] {
  return roles.map((role) => ({ value: role.key, label: role.name }));
}

export function resolveRoleLabel(roleValue: string, roles: SystemRole[]): string {
  return roles.find((role) => role.key === roleValue)?.name ?? roleValue;
}

export function subscribeRoles(callback: () => void): () => void {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener("roles:updated", onCustom);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("roles:updated", onCustom);
  };
}
