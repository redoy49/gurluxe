// Product colors are usually a plain string, but some documents store a
// legacy { name, code } object instead. Normalize either shape to a
// renderable label plus a CSS-safe swatch value.
export function normalizeColor(color) {
  if (color && typeof color === "object") {
    return { label: color.name ?? "", swatch: color.code ?? color.name };
  }

  return { label: color ?? "", swatch: color };
}
