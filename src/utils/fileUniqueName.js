export function fileUniqueName() {
  return `${(new Date()).valueOf()}-${Math.floor(Math.random() * 99999)}`;
}