export function parseSnapshotOptions(atValue, colsValue) {
  if (atValue === "") throw new Error("--at requires a value");
  if (colsValue === "") throw new Error("--cols requires a value");
  const at = atValue == null ? 0.85 : Number(atValue);
  const cols = colsValue == null ? 4 : Number(colsValue);
  if (!Number.isFinite(at) || at < 0 || at > 1) throw new Error(`--at must be a finite number from 0 to 1 (got ${atValue})`);
  if (!Number.isInteger(cols) || cols <= 0) throw new Error(`--cols must be a positive integer (got ${colsValue})`);
  return { at, cols };
}
