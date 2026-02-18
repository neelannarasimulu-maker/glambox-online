import siteData from "@/content/site.json";
import hairData from "@/content/popups/hair.json";
import nailsData from "@/content/popups/nails.json";
import wellnessData from "@/content/popups/wellness.json";
import foodData from "@/content/popups/food.json";
import { PopupKeySchema, PopupSchema, SiteSchema, type PopupConfig, type SiteConfig } from "./schemas";

const popupMap = {
  hair: hairData,
  nails: nailsData,
  wellness: wellnessData,
  food: foodData
};

export function getSiteConfig(): SiteConfig {
  const parsed = SiteSchema.safeParse(siteData);
  if (!parsed.success) {
    throw new Error(`Invalid site.json: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function getPopupConfig(popupKey: string): PopupConfig {
  const keyResult = PopupKeySchema.safeParse(popupKey);
  if (!keyResult.success) {
    throw new Error(`Invalid popup key: ${keyResult.error.message}`);
  }
  const parsed = PopupSchema.safeParse(popupMap[keyResult.data]);
  if (!parsed.success) {
    throw new Error(`Invalid popup config: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function getPopupKeys() {
  return Object.keys(popupMap) as Array<keyof typeof popupMap>;
}
