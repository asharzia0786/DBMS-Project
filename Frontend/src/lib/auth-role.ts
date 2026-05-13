type RoleCarrier = {
  publicMetadata?: Record<string, unknown>;
  unsafeMetadata?: Record<string, unknown>;
  privateMetadata?: Record<string, unknown>;
};

function normalizeRole(value: unknown): string {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

export function readUserRole(user: RoleCarrier | null | undefined): string {
  if (!user) {
    return '';
  }

  const candidates = [
    user.publicMetadata?.role,
    user.publicMetadata?.userRole,
    user.unsafeMetadata?.role,
    user.unsafeMetadata?.userRole,
    user.privateMetadata?.role,
    user.privateMetadata?.userRole,
  ];

  for (const candidate of candidates) {
    const role = normalizeRole(candidate);
    if (role) {
      return role;
    }
  }

  return '';
}

export function isAdminUser(user: RoleCarrier | null | undefined): boolean {
  return readUserRole(user) === 'ADMIN';
}
