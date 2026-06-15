import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// ── Color contrast helper (WCAG relative luminance formula) ──────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16) / 255;
  const g = parseInt(hex.slice(3,5), 16) / 255;
  const b = parseInt(hex.slice(5,7), 16) / 255;
  const linearize = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}
function contrastRatio(hex1, hex2) {
  const L1 = hexToRgb(hex1);
  const L2 = hexToRgb(hex2);
  const lighter = Math.max(L1, L2);
  const darker  = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── PALETTE INTEGRITY TESTS ──────────────────────────────────────────────────
describe('Design System — Colour Palette', () => {
  const palette = {
    brandRed:     '#A41F13',
    surfaceWhite: '#FAF5F1',
    surfaceGray:  '#E0DBD8',
    textDark:     '#292F36',
    accentTaupe:  '#8F7A6E',
  };

  it('brand-red on surface-white passes WCAG AA (min 4.5:1)', () => {
    const ratio = contrastRatio(palette.brandRed, palette.surfaceWhite);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('text-dark on surface-white passes WCAG AAA (min 7:1)', () => {
    const ratio = contrastRatio(palette.textDark, palette.surfaceWhite);
    expect(ratio).toBeGreaterThanOrEqual(7);
  });

  it('text-dark on surface-gray passes WCAG AA (min 4.5:1)', () => {
    const ratio = contrastRatio(palette.textDark, palette.surfaceGray);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('accent-taupe on surface-white is BELOW AA body text threshold — correct for hint/muted use only', () => {
    // This test intentionally asserts that taupe FAILS AA body text (below 4.5)
    // so we remember NOT to use it for paragraph text.
    const ratio = contrastRatio(palette.accentTaupe, palette.surfaceWhite);
    expect(ratio).toBeLessThan(4.5); // expected behavior, not a bug
  });

  it('no dark palette hex values remain in Tailwind config', async () => {
    const fs = await import('fs');
    const config = fs.readFileSync('./tailwind.config.js', 'utf-8');
    // Old dark tokens that must be gone
    const forbidden = ['#0a0a0a', '#C8963E', '#E8C99A', '#8A8070', 'glass-bg', 'glass-border', 'primary-gold'];
    forbidden.forEach(token => {
      expect(config).not.toContain(token);
    });
  });

  it('no dark palette hex values remain in global CSS', async () => {
    const fs = await import('fs');
    const css = fs.readFileSync('./src/index.css', 'utf-8');
    const forbidden = ['#0a0a0a', '#C8963E', 'rgba(255,255,255,0.05)', 'backdrop-filter'];
    forbidden.forEach(token => {
      expect(css).not.toContain(token);
    });
  });
});

// ── COMPONENT SMOKE TESTS ─────────────────────────────────────────────────
describe('Layout components — bright palette smoke tests', () => {
  it('Navbar renders without dark background classes', () => {
    const { container } = render(<Navbar />);
    // Assert no Tailwind dark-mode or near-black classes on the nav element
    const header = container.querySelector('header');
    const className = header ? header.className : '';
    expect(className).not.toMatch(/bg-\[#0a0a0a\]/);
    expect(className).not.toMatch(/bg-gray-900/);
    expect(className).not.toMatch(/bg-black/);
  });

  it('Navbar has a visible brand-red element (logo or active link)', () => {
    const { container } = render(<Navbar />);
    const redElements = container.querySelectorAll('[class*="red"], [class*="A41F13"], [class*="brand-red"]');
    expect(redElements.length).toBeGreaterThan(0);
  });
});
