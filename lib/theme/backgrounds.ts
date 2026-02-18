export type BackgroundKey =
  | "linen"
  | "terracottaGlow"
  | "oliveAurora"
  | "marilynPop"
  | "stoneMarble"
  | "sunsetGold";

import type { CSSProperties } from "react";

type BackgroundRecipe = {
  className: string;
  style?: CSSProperties;
};

export const backgrounds: Record<BackgroundKey, BackgroundRecipe> = {
  linen: {
    className:
      "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(255,244,230,0.9)_0%,rgba(248,242,233,0.9)_45%,rgba(240,226,210,0.85)_100%),linear-gradient(135deg,rgba(255,242,233,0.6)_0%,rgba(247,233,218,0.9)_55%,rgba(235,217,199,0.85)_100%)]"
  },
  terracottaGlow: {
    className:
      "bg-[radial-gradient(90%_90%_at_20%_0%,rgba(245,197,165,0.95)_0%,rgba(240,188,154,0.75)_42%,rgba(237,215,196,0.5)_100%),radial-gradient(70%_80%_at_90%_20%,rgba(205,120,93,0.45)_0%,rgba(205,120,93,0)_60%),linear-gradient(135deg,rgba(250,231,217,0.9)_0%,rgba(240,214,192,0.9)_100%)]"
  },
  oliveAurora: {
    className:
      "bg-[radial-gradient(85%_90%_at_0%_0%,rgba(212,223,196,0.9)_0%,rgba(201,215,184,0.75)_45%,rgba(239,232,216,0.6)_100%),radial-gradient(80%_90%_at_100%_20%,rgba(146,170,135,0.35)_0%,rgba(146,170,135,0)_60%),linear-gradient(140deg,rgba(244,236,222,0.95)_0%,rgba(235,225,205,0.9)_100%)]"
  },
  marilynPop: {
    className:
      "bg-[radial-gradient(70%_80%_at_15%_0%,rgba(255,210,228,0.95)_0%,rgba(255,197,218,0.6)_45%,rgba(245,229,225,0.65)_100%),radial-gradient(60%_80%_at_90%_10%,rgba(232,138,165,0.45)_0%,rgba(232,138,165,0)_60%),linear-gradient(135deg,rgba(252,235,226,0.95)_0%,rgba(247,222,214,0.9)_100%)]"
  },
  stoneMarble: {
    className:
      "bg-[radial-gradient(100%_100%_at_0%_0%,rgba(246,237,225,0.95)_0%,rgba(238,225,210,0.8)_45%,rgba(231,215,197,0.7)_100%),radial-gradient(120%_120%_at_100%_20%,rgba(210,196,180,0.45)_0%,rgba(210,196,180,0)_65%),linear-gradient(140deg,rgba(248,240,231,0.9)_0%,rgba(229,214,196,0.9)_100%)]"
  },
  sunsetGold: {
    className:
      "bg-[radial-gradient(85%_90%_at_0%_0%,rgba(255,226,186,0.95)_0%,rgba(255,200,150,0.7)_50%,rgba(241,220,199,0.6)_100%),radial-gradient(70%_80%_at_90%_15%,rgba(235,145,108,0.45)_0%,rgba(235,145,108,0)_60%),linear-gradient(130deg,rgba(255,236,210,0.95)_0%,rgba(244,214,182,0.9)_100%)]"
  }
};

export const backgroundOverlays: Partial<Record<BackgroundKey, string>> = {
  marilynPop:
    "bg-[linear-gradient(90deg,rgba(43,29,22,0.35)_0%,rgba(43,29,22,0.15)_60%,rgba(43,29,22,0)_100%)]",
  sunsetGold:
    "bg-[linear-gradient(90deg,rgba(43,29,22,0.25)_0%,rgba(43,29,22,0.1)_55%,rgba(43,29,22,0)_100%)]"
};
