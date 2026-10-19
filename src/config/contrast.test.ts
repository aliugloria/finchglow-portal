import { describe, expect, it } from "vitest";
import { COMPANIES } from "@/config/companies";

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const AA = 4.5;

describe.each(COMPANIES)("$name theme meets WCAG AA (4.5:1)", ({ theme }) => {
  it("white text on the accent", () =>
    expect(contrast(theme.onAccent, theme.accent)).toBeGreaterThanOrEqual(AA));
  it("white text on the dark accent", () =>
    expect(contrast(theme.onAccent, theme.accentDark)).toBeGreaterThanOrEqual(
      AA,
    ));
  it("dark accent text on the soft tint", () =>
    expect(contrast(theme.accentDark, theme.accentSoft)).toBeGreaterThanOrEqual(
      AA,
    ));
  it("accent used as text on white", () =>
    expect(contrast(theme.accent, "#FFFFFF")).toBeGreaterThanOrEqual(AA));
});

describe("fixed colours", () => {
  it.each([
    ["white on critical red (banner)", "#FFFFFF", "#C8102E"],
    ["critical text on its tint", "#A50D26", "#FDE8EC"],
    ["warning text on its tint", "#7C3A06", "#FEF3C7"],
    ["info text on its tint", "#075985", "#E0F2FE"],
    ["muted text on white", "#475569", "#FFFFFF"],
    ["muted text on page background", "#475569", "#F4F7FB"],
    ["body text on white", "#0B2A45", "#FFFFFF"],
  ])("%s", (_name, fg, bg) =>
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA),
  );
});
