import type { RuntimeMeta, GcaMeta } from '../types.js';

export function metaFromGca(meta: GcaMeta): RuntimeMeta {
  return {
    ...meta,
    endDate: new Date(meta.endDate),
    createdAt: new Date(meta.createdAt),
  };
}
export function metaToGca(meta: RuntimeMeta): GcaMeta {
  return {
    ...meta,
    endDate: meta.endDate.toISOString(),
    createdAt: meta.createdAt.toISOString(),
  };
}
