export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return basePath || "/";
  return `${basePath}${normalized}`;
}
