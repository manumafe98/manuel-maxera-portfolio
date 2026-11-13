/// <reference lib="dom" />
import type { Locator } from "@playwright/test";

/**
 * The WCAG 2 contrast ratio between the element's text colour (or its
 * placeholder's) and the first opaque background behind it.
 */
export const contrastRatio = (target: Locator, pseudo?: "::placeholder") =>
  target.evaluate((element, pseudoElement) => {
    const rgb = (color: string) =>
      (color.match(/[\d.]+/g) ?? []).map(Number) as number[];
    const luminance = ([r, g, b]: number[]) => {
      const channel = (value: number) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const text = rgb(getComputedStyle(element, pseudoElement).color);
    let node: Element | null = element;
    let background: number[] | null = null;
    while (node && !background) {
      const color = rgb(getComputedStyle(node).backgroundColor);
      if (color.length === 3 || color[3] === 1) background = color;
      node = node.parentElement;
    }
    const [light, dark] = [luminance(text), luminance(background!)].sort(
      (a, b) => b - a,
    );
    return (light + 0.05) / (dark + 0.05);
  }, pseudo);
