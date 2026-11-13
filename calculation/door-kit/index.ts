export * from './setup';
export { LegacyData } from './legacy/legacy-data';
export { legacyDataFromImport, type DoorImportData } from './legacy/from-import';
export type { ConfigRow, PriceRow } from './legacy/types';
export { toNumber, round, getEnum } from './legacy/num';
export { calcProfile } from './legacy/profile';
export {
  EstimateBuilder,
  flattenEstimate,
  type EstimateNode,
  type EstimateTotal,
} from './estimate/legacy-estimate';
export {
  calculateSwingSizes,
  checkLeafLimits,
  type DoorSizes,
  type LeafSize,
  type SizeIssue,
} from './sizes';
export { calculateFrame, calculateFrameToDoor } from './frame/frame-bom';
export { getHingeCount, type HingeContext } from './frame/hinges';
export {
  addLeafPrice,
  calculateLeafFrame,
  SUPPORTED_LEAVES,
  type LeafContext,
} from './leaf/leaf-bom';
export {
  resolveInserts,
  addInserts,
  haveGlass,
  haveOpacity,
  type InsertPart,
  type InsertCheck,
} from './decor/inserts';
export {
  addSwingHandle,
  resolveHandleParts,
  getLockTypes,
  getLocks,
  type HandleParts,
} from './hardware/handle';
export * from './catalog/options';
export {
  buildFacadeGeometry,
  hingeCenters,
  type Box,
  type FacadeGeometry,
  type FacadeLeaf,
  type FacadeView,
} from './facade/facade-geometry';
