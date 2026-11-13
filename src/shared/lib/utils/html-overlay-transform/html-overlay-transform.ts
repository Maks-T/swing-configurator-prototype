export type HtmlOverlayTransformAttrs = {
  scaleX: number;
  scaleY: number;
  rotation: number;
};

export type HtmlOverlayTransformOptions = {
  /** Следовать зуму канваса. `false` — scale = 1. @default true */
  zoom?: boolean;
  /** Следовать повороту узла. `false` — rotation = 0. @default true */
  rotate?: boolean;
  /** CSS-размер элемента в px, нужен для clamp min/max */
  baseSizePx?: number;
  minPx?: number;
  maxPx?: number;
};

function clampScale(
  scale: number,
  baseSizePx: number | undefined,
  minPx: number | undefined,
  maxPx: number | undefined
): number {
  if (!baseSizePx || baseSizePx <= 0) {
    return scale;
  }

  let next = scale;

  if (minPx !== undefined) {
    next = Math.max(minPx / baseSizePx, next);
  }

  if (maxPx !== undefined) {
    next = Math.min(maxPx / baseSizePx, next);
  }

  return next;
}

/** Трансформ Html-оверлея поверх Konva: зум, поворот, clamp размера на экране. */
export function htmlOverlayTransform<T extends HtmlOverlayTransformAttrs>(
  attrs: T,
  options: HtmlOverlayTransformOptions = {}
): T {
  const { zoom = true, rotate = true, baseSizePx, minPx, maxPx } = options;
  const raw = zoom ? Math.max(Math.abs(attrs.scaleX), Math.abs(attrs.scaleY)) : 1;
  const scale = clampScale(raw, baseSizePx, minPx, maxPx);

  return {
    ...attrs,
    scaleX: scale,
    scaleY: scale,
    rotation: rotate ? attrs.rotation : 0,
  };
}

export function createHtmlOverlayTransform(options: HtmlOverlayTransformOptions = {}) {
  return <T extends HtmlOverlayTransformAttrs>(attrs: T) =>
    htmlOverlayTransform(attrs, options);
}
