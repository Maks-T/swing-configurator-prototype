import { beforeEach, describe, expect, it } from 'vitest';

import { TEST_DATA } from '@calculation/door-kit/__fixtures__/data';

import { useSwingProjectStore } from './store';

describe('swing project store', () => {
  beforeEach(() => {
    useSwingProjectStore.getState().reset();
    useSwingProjectStore.getState().init(TEST_DATA, null);
  });

  it('starts with the legacy default door', () => {
    const setup = useSwingProjectStore.getState().project?.setup;
    expect(setup).toMatchObject({
      frame: 'standart51',
      door: 'technoform40',
      hingeSku: 'hinge3D1',
    });
  });

  it('re-picks a compatible hinge when the frame changes', () => {
    useSwingProjectStore
      .getState()
      .patch({ frame: 'modula51', door: 'modulasg' }, TEST_DATA);
    const setup = useSwingProjectStore.getState().project?.setup;
    expect(TEST_DATA.price(setup?.hingeSku)?.type).toBe('hingeN');
  });

  it('undo and redo restore setups', () => {
    useSwingProjectStore.getState().setOpening({ width: 1000 });
    useSwingProjectStore.getState().undo();
    expect(useSwingProjectStore.getState().project?.setup.opening.width).toBe(900);
    useSwingProjectStore.getState().redo();
    expect(useSwingProjectStore.getState().project?.setup.opening.width).toBe(1000);
  });

  it('drops inserts that the new leaf does not support', () => {
    const glass = TEST_DATA.priceByParam({ type: 'GLASS-SGD' })[0];
    useSwingProjectStore
      .getState()
      .setInsert('front', { sku: glass?.key ?? '' }, TEST_DATA);
    expect(useSwingProjectStore.getState().project?.setup.inserts.front).toBeDefined();
    useSwingProjectStore.getState().patch({ door: 'modulasg' }, TEST_DATA);
    expect(useSwingProjectStore.getState().project?.setup.inserts.front).toBeUndefined();
  });
});
