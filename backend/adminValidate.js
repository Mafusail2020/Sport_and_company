const { PHOTO_SLOT_KEYS } = require("./photoSlots");

const PACKAGE_LIMITS = {
  id: 60,
  badge: 40,
  name: 40,
  tagline: 120,
  price: 40,
  priceUnit: 20,
  button: 60,
  dropdownValue: 80,
  feature: 160,
};

const MAX_PACKAGES = 12;
const MAX_FEATURES = 12;
const VARIANTS = ["outline", "filled"];

// eslint-disable-next-line no-control-regex -- intentional: stripping control chars
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").trim();
}

/**
 * Validates and sanitizes a pricing-packages payload.
 * Returns { ok: true, data } or { ok: false, errors }. An empty array is
 * explicitly valid — that's how the admin removes the pricing section.
 */
function validatePricingPackages(body) {
  const errors = [];
  const packages = body && body.packages;

  if (!Array.isArray(packages)) {
    return { ok: false, errors: ["packages must be an array"] };
  }
  if (packages.length > MAX_PACKAGES) {
    return { ok: false, errors: [`packages must have at most ${MAX_PACKAGES} items`] };
  }

  const data = packages.map((pkg, index) => {
    if (typeof pkg !== "object" || pkg === null) {
      errors.push(`package ${index} must be an object`);
      return null;
    }

    const clean = {
      id: sanitizeText(pkg.id),
      badge: sanitizeText(pkg.badge),
      name: sanitizeText(pkg.name),
      tagline: sanitizeText(pkg.tagline),
      price: sanitizeText(pkg.price),
      priceUnit: sanitizeText(pkg.priceUnit),
      button: sanitizeText(pkg.button),
      dropdownValue: sanitizeText(pkg.dropdownValue),
      variant: sanitizeText(pkg.variant),
      featured: pkg.featured === true,
      features: Array.isArray(pkg.features) ? pkg.features.map(sanitizeText).filter(Boolean) : [],
    };

    if (!clean.id) errors.push(`package ${index}: id is required`);
    if (!clean.name) errors.push(`package ${index}: name is required`);
    if (!VARIANTS.includes(clean.variant)) errors.push(`package ${index}: variant must be one of ${VARIANTS.join(", ")}`);
    if (clean.features.length > MAX_FEATURES) errors.push(`package ${index}: too many features`);

    for (const [field, limit] of Object.entries(PACKAGE_LIMITS)) {
      if (field === "feature") continue;
      if (clean[field] && clean[field].length > limit) {
        errors.push(`package ${index}: ${field} must be at most ${limit} characters`);
      }
    }
    for (const feature of clean.features) {
      if (feature.length > PACKAGE_LIMITS.feature) {
        errors.push(`package ${index}: a feature must be at most ${PACKAGE_LIMITS.feature} characters`);
      }
    }

    return clean;
  });

  const ids = data.filter(Boolean).map((pkg) => pkg.id);
  if (new Set(ids).size !== ids.length) errors.push("package ids must be unique");

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data };
}

function validatePhotoSlotKey(key) {
  return typeof key === "string" && PHOTO_SLOT_KEYS.includes(key);
}

module.exports = { validatePricingPackages, validatePhotoSlotKey };
