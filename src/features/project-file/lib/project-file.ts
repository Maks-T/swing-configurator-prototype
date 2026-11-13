import { z } from 'zod/v4';

import type { SwingProject } from '@calculation/swing';

export const PROJECT_FILE_FORMAT = 'swing-project';
export const PROJECT_FILE_VERSION = 1;

const Insert = z.object({ sku: z.string(), borderSku: z.string().optional() });

const Setup = z.object({
  kind: z.literal('swing'),
  opening: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
    depth: z.number().min(0),
    floorGap: z.number().min(0),
  }),
  openSide: z.enum(['right-outside', 'left-outside', 'right-inside', 'left-inside']),
  frameVariant: z.enum(['withJumper', 'noJumper', 'noFrame']),
  frame: z.string(),
  door: z.string(),
  isNoDoor: z.boolean(),
  hingeSku: z.string(),
  isHingeIncut: z.boolean(),
  frameCoverSku: z.string(),
  doorCoverSku: z.string(),
  inserts: z.object({ front: Insert.optional(), back: Insert.optional() }),
  handle: z.object({
    handleSku: z.string().nullable(),
    lockType: z.string().optional(),
    lockSku: z.string().optional(),
    larvaType: z.string().optional(),
    larvaSide: z.string().optional(),
  }),
  margin: z.number(),
  discount: z.number().min(0).max(100),
});

export const ProjectFile = z.object({
  format: z.literal(PROJECT_FILE_FORMAT),
  version: z.literal(PROJECT_FILE_VERSION),
  savedAt: z.string(),
  project: z.object({ name: z.string(), setup: Setup }),
});

export type ProjectFile = z.infer<typeof ProjectFile>;

/** Проект → JSON файла (с форматом и версией для миграций) */
export function serializeProject(project: SwingProject, now = new Date()): string {
  return JSON.stringify(
    {
      format: PROJECT_FILE_FORMAT,
      version: PROJECT_FILE_VERSION,
      savedAt: now.toISOString(),
      project,
    },
    null,
    2
  );
}

/** JSON файла → проект; ошибки формата возвращаются текстом */
export function parseProjectFile(
  text: string
): { project: SwingProject } | { error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { error: 'Файл не является JSON' };
  }
  const parsed = ProjectFile.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: `Неверный формат: ${issue ? `${issue.path.join('.')} ${issue.message}` : 'неизвестная ошибка'}`,
    };
  }
  return { project: parsed.data.project as SwingProject };
}
