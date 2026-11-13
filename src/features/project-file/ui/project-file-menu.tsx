import { Download, FilePlus2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useDoorData } from '@/entities/door-catalog';
import { clearDraft, useSwingProjectStore } from '@/entities/swing-project';
import { Button } from '@/shared/ui/button';

import { parseProjectFile, serializeProject } from '../lib/project-file';

/** Сохранение проекта в JSON, загрузка и новый проект */
export function ProjectFileMenu() {
  const inputRef = useRef<HTMLInputElement>(null);
  const data = useDoorData();
  const project = useSwingProjectStore((state) => state.project);
  const hydrate = useSwingProjectStore.use.hydrate();
  const init = useSwingProjectStore.use.init();

  const download = () => {
    if (!project) {
      return;
    }
    const blob = new Blob([serializeProject(project)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `swing-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (file: File) => {
    const result = parseProjectFile(await file.text());
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    hydrate(result.project, data);
    toast.success(`Проект загружен: ${result.project.name}`);
  };

  return (
    <div className="calc:flex calc:items-center calc:gap-0.5">
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Новый проект"
        title="Новый проект"
        onClick={() => {
          clearDraft();
          init(data, null);
        }}
      >
        <FilePlus2 />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Сохранить JSON"
        title="Сохранить JSON"
        onClick={download}
      >
        <Download />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Открыть JSON"
        title="Открыть JSON"
        onClick={() => inputRef.current?.click()}
      >
        <Upload />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="calc:hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void upload(file);
          }
          event.target.value = '';
        }}
      />
    </div>
  );
}
