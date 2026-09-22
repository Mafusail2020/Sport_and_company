// Same 14-entry list as backend/photoSlots.js, duplicated rather than
// shared — this repo already does the same thing for SUBJECT_OPTIONS
// between this content/ folder and backend/validate.js (see
// backend/README.md): the backend validates independently of whatever the
// frontend sends, so the two copies are kept separate on purpose.
export const PHOTO_SLOTS = [
  { key: "hero", label: "Головний екран", defaultFile: "hero-team-celebration.jpg" },
  { key: "about", label: "Про нас", defaultFile: "about-team-table.jpg" },
  { key: "team", label: "Команда", defaultFile: "team-group.jpg" },
  { key: "formats-competitions", label: "Формати — Спортивні змагання", defaultFile: "format-competitions.jpg" },
  { key: "formats-team-games", label: "Формати — Командні ігри", defaultFile: "format-team-games.jpg" },
  { key: "formats-talks", label: "Формати — Лекції та розмови", defaultFile: "format-talks.jpg" },
  { key: "formats-mafia", label: "Формати — Мафія та вечори", defaultFile: "format-mafia.jpg" },
  { key: "formats-corporate", label: "Формати — Корпоративні активності", defaultFile: "format-corporate.jpg" },
  { key: "formats-custom", label: "Формати — Події під запит", defaultFile: "format-custom.jpg" },
  { key: "gallery-large", label: "Галерея — велике фото", defaultFile: "hero-team-celebration.jpg" },
  { key: "gallery-small-1", label: "Галерея — мале фото 1", defaultFile: "hero-team-celebration.jpg" },
  { key: "gallery-small-2", label: "Галерея — мале фото 2", defaultFile: "format-mafia.jpg" },
  { key: "gallery-small-3", label: "Галерея — мале фото 3", defaultFile: "format-talks.jpg" },
  { key: "gallery-small-4", label: "Галерея — мале фото 4", defaultFile: "format-team-games.jpg" },
];
