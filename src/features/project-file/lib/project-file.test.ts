import { describe, expect, it } from 'vitest';

import { createDefaultSetup } from '@/entities/swing-project';
import { TEST_DATA } from '@calculation/door-kit/__fixtures__/data';

import { parseProjectFile, serializeProject } from './project-file';

describe('swing project file', () => {
  it('round-trips a project', () => {
    const project = { name: 'Дверь 1', setup: createDefaultSetup(TEST_DATA) };
    const parsed = parseProjectFile(serializeProject(project, new Date('2026-01-01')));
    expect(parsed).toEqual({ project });
  });

  it('reports invalid json', () => {
    expect(parseProjectFile('{')).toEqual({ error: 'Файл не является JSON' });
  });

  it('rejects files of other calculations', () => {
    const result = parseProjectFile(
      JSON.stringify({ format: 'transom-project', version: 1 })
    );
    expect('error' in result).toBe(true);
  });
});
