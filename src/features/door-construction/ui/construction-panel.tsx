import { useDoorData } from '@/entities/door-catalog';
import { useSwingProjectStore } from '@/entities/swing-project';
import { ChoiceCard } from '@/shared/ui/choice-card';
import { NumberField } from '@/shared/ui/number-field';
import { FieldRow, PanelSection } from '@/shared/ui/panel-section';
import { Switch } from '@/shared/ui/switch';

import { FRAME_VARIANTS, OPEN_SIDES } from '../model/consts';

import { OpenSideGlyph } from './open-side-glyph';

import { getFrameOptions, getLeafOptions, type DoorSetup } from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

type ConstructionPanelProps = { setup: DoorSetup; result: SwingResult };

/** Каталог конструкции: проём, открывание, тип короба, короб и полотно */
export function ConstructionPanel({ setup, result }: ConstructionPanelProps) {
  const data = useDoorData();
  const patch = useSwingProjectStore.use.patch();
  const setOpening = useSwingProjectStore.use.setOpening();
  const frames = getFrameOptions(data, setup.kind, setup.openSide);
  const leaves = getLeafOptions(data, setup.openSide);
  const widthIssue = result.sizeIssues.find((i) => i.field === 'width');
  const heightIssue = result.sizeIssues.find((i) => i.field === 'height');

  return (
    <div className="calc:flex calc:flex-col calc:divide-y">
      <PanelSection title="Проём">
        <FieldRow label="Ширина">
          <NumberField
            value={setup.opening.width}
            suffix="мм"
            aria-invalid={Boolean(widthIssue)}
            onCommit={(width) => {
              setOpening({ width: Math.max(0, Math.round(width)) });
            }}
          />
        </FieldRow>
        <FieldRow label="Высота">
          <NumberField
            value={setup.opening.height}
            suffix="мм"
            aria-invalid={Boolean(heightIssue)}
            onCommit={(height) => {
              setOpening({ height: Math.max(0, Math.round(height)) });
            }}
          />
        </FieldRow>
        <FieldRow label="Глубина">
          <NumberField
            value={setup.opening.depth}
            suffix="мм"
            onCommit={(depth) => {
              setOpening({ depth: Math.max(0, Math.round(depth)) });
            }}
          />
        </FieldRow>
        <FieldRow label="Зазор до пола">
          <NumberField
            value={setup.opening.floorGap}
            suffix="мм"
            onCommit={(floorGap) => {
              setOpening({ floorGap: Math.max(0, Math.round(floorGap)) });
            }}
          />
        </FieldRow>
        {result.limits ? (
          <p className="calc:text-xs calc:text-muted-foreground calc:tabular-nums">
            Полотно: ширина {result.limits.minW}–{result.limits.maxW}, высота{' '}
            {result.limits.minH}–{result.limits.maxH} мм
          </p>
        ) : null}
      </PanelSection>

      <PanelSection title="Открывание">
        <div className="calc:grid calc:grid-cols-2 calc:gap-1.5">
          {OPEN_SIDES.map((side) => (
            <ChoiceCard
              key={side.id}
              isSelected={setup.openSide === side.id}
              title={side.title}
              hint={side.hint}
              media={<OpenSideGlyph side={side.id} />}
              onClick={() => {
                patch({ openSide: side.id }, data);
              }}
            />
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Конструкция короба">
        <div className="calc:flex calc:flex-col calc:gap-1.5">
          {FRAME_VARIANTS.map((variant) => (
            <ChoiceCard
              key={variant.id}
              isSelected={setup.frameVariant === variant.id}
              title={variant.title}
              hint={variant.hint}
              onClick={() => {
                patch({ frameVariant: variant.id }, data);
              }}
            />
          ))}
        </div>
      </PanelSection>

      {setup.frameVariant === 'noFrame' ? null : (
        <PanelSection title="Короб">
          <div className="calc:flex calc:flex-col calc:gap-1.5">
            {frames.map((frame) => (
              <ChoiceCard
                key={frame.id}
                isSelected={setup.frame === frame.id}
                disabled={frame.disabled}
                title={frame.name}
                hint={frame.hint ?? frame.id}
                onClick={() => {
                  patch({ frame: frame.id }, data);
                }}
              />
            ))}
          </div>
        </PanelSection>
      )}

      <PanelSection
        title="Полотно"
        actions={
          <label className="calc:flex calc:items-center calc:gap-1.5 calc:text-xs calc:text-muted-foreground">
            без полотна
            <Switch
              size="sm"
              checked={setup.isNoDoor}
              onCheckedChange={(isNoDoor) => {
                patch({ isNoDoor }, data);
              }}
            />
          </label>
        }
      >
        <div className="calc:flex calc:flex-col calc:gap-1.5">
          {leaves.map((leaf) => (
            <ChoiceCard
              key={leaf.id}
              isSelected={setup.door === leaf.id}
              disabled={leaf.disabled}
              title={leaf.name}
              hint={
                leaf.hint ??
                (setup.isNoDoor && setup.door === leaf.id
                  ? 'короб под это полотно'
                  : leaf.id)
              }
              onClick={() => {
                patch({ door: leaf.id }, data);
              }}
            />
          ))}
        </div>
      </PanelSection>
    </div>
  );
}
