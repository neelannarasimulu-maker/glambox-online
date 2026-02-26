import test from "node:test";
import assert from "node:assert/strict";
import { getPopupConfig, getPopupKeys, getSiteConfig } from "@/lib/content";
import { resolveBookingSelection } from "@/modules/bookings/catalog";

test("site config and popup configs load for all registered popup keys", () => {
  const site = getSiteConfig();
  assert.ok(site.brand.name.length > 0);

  const popupKeys = getPopupKeys();
  assert.ok(popupKeys.length > 0);

  for (const key of popupKeys) {
    const popup = getPopupConfig(key);
    assert.equal(popup.popupKey, key);
    assert.ok(popup.pages.services.services.length > 0);
    assert.ok(popup.pages.consultants.consultants.length > 0);
  }
});

test("booking selection resolver maps ids to canonical names", () => {
  const hair = getPopupConfig("hair");
  const service = hair.pages.services.services[0];
  assert.ok(service, "hair popup must contain at least one service");
  const consultantId = service.consultantIds[0];
  assert.ok(consultantId, "service must have at least one consultant mapping");

  const resolved = resolveBookingSelection(hair.popupKey, service.id, consultantId);
  assert.equal(resolved.popupName, hair.name);
  assert.equal(resolved.serviceTitle, service.title);
  assert.equal(resolved.consultantId, consultantId);
});
