// Copy pulled verbatim from assets/CONTENT_TRANSCRIPT.md — do not paraphrase.
// Items marked [PLACEHOLDER] / [ASSUMPTION] in the transcript are flagged
// inline below; see docs/design-spec.md for the reasoning behind each.

export const nav = [
  { label: "Навіщо ми", href: "#why-us" },
  { label: "Про нас", href: "#about" },
  { label: "Формати", href: "#formats" },
  { label: "Послуги", href: "#pricing" },
  { label: "Партнери", href: "#partners" },
  { label: "Контакти", href: "#contact" },
];

export const footerNav = [
  { label: "Навіщо ми", href: "#why-us" },
  { label: "Формати", href: "#formats" },
  { label: "Послуги", href: "#pricing" },
  { label: "Партнери", href: "#partners" },
  { label: "Команда", href: "#team" },
  { label: "Контакти", href: "#contact" },
];

export const hero = {
  eyebrow: "КИЇВ · СПОРТИВНА МОЛОДІЖНА ПЛАТФОРМА",
  heading: ["СПОРТ — ", "СТИЛЬ ЖИТТЯ,"],
  headingAccent: "А НЕ ДЕКОРАЦІЯ",
  paragraph:
    "Ми створюємо змагання, командні ігри, лекції та ігрові вечори, де люди рухаються разом і залишаються командою.",
  tags: ["Змагання", "Турніри", "Командні ігри", "Лекції", "Мафія"],
  primaryCta: "Замовити подію →",
  secondaryCta: "Навіщо ми це робимо",
};

export const stats = [
  { number: "15+", label: "проведених подій" },
  { number: "300+", label: "учасників" },
  { number: "10", label: "форматів активностей" },
  { number: "1", label: "спільнота" },
];

export const whyUs = {
  eyebrow: "НАВІЩО МИ ЦЕ РОБИМО",
  heading: "МИ НЕ КЛУБ.",
  headingAccent: "МИ — ПРИВІД ВИЙТИ З ДОМУ",
  paragraph:
    "Спорт для нас — це спосіб знайомитися, тримати форму й почуватися частиною чогось більшого. Ми прибираємо бар'єр «я недостатньо спортивний» і робимо активність доступною для кожного, незалежно від формату участі.",
  cards: [
    {
      number: "01",
      title: "СПІЛЬНОТА ПОНАД РЕЗУЛЬТАТ",
      text: "Ми міряємо успіх не медалями, а кількістю людей, які повернулися вдруге й привели друзів.",
    },
    {
      number: "02",
      title: "ВІДКРИТІСТЬ ДО ВСІХ",
      text: "Наші події працюють для будь-якого рівня підготовки — без осуду й змагання за статус.",
    },
    {
      number: "03",
      title: "РУХ ЯК ЗВИЧКА",
      text: "Регулярність важливіша за інтенсивність, тому ми створюємо активності щотижня, а не раз на сезон.",
    },
  ],
};

export const about = {
  eyebrow: "ХТО МИ",
  heading: "КОМАНДА, ЯКА ЗБИРАЄ ЛЮДЕЙ У РУХ",
  paragraphs: [
    "Sport&Company — спортивна молодіжна платформа, яка діє в межах студентського та молодіжного спортивного розвитку. Ми організовуємо активності, що поєднують фізичну форму, освіту та живе спілкування.",
    "За нами — організатори, тренери, фотографи й волонтери, які самі щотижня грають, бігають і зустрічаються на наших подіях. Ми не продаємо абонемент у зал — ми створюємо привід зібратися.",
  ],
  bullets: [
    "Повний цикл: концепція, локація, суддівство, комунікація",
    "Формати від 10 до 200 учасників",
    "Фото- та відеозвіт після кожної події",
  ],
};

export const formats = {
  eyebrow: "ЩО МИ РОБИМО",
  heading: "НАШІ ФОРМАТИ",
  intro: "Кожен формат можна взяти окремо або зібрати в одну програму під вашу команду.",
  cards: [
    {
      title: "СПОРТИВНІ ЗМАГАННЯ",
      text: "Турніри, забіги та чемпіонати з чіткими правилами, суддівством і нагородженням.",
      photo: "format-competitions.jpg",
      slotKey: "formats-competitions",
      width: 666,
      height: 1000,
      alt: "Учасники перетинають фінішну арку на вуличному забігу",
    },
    {
      title: "КОМАНДНІ ІГРИ",
      text: "Волейбол, футбол, баскетбол та відкриті тренування для змішаних складів.",
      photo: "format-team-games.jpg",
      slotKey: "formats-team-games",
      width: 666,
      height: 1000,
      alt: "Два гравці борються за м'яч у стрибку біля сітки на пляжному волейболі",
    },
    {
      title: "ЛЕКЦІЇ ТА РОЗМОВИ",
      text: "Спікери про здоров'я, лідерство, харчування та спортивну психологію.",
      photo: "format-talks.jpg",
      slotKey: "formats-talks",
      width: 666,
      height: 500,
      alt: "Спікер із мікрофоном виступає перед слухачами",
    },
    {
      title: "МАФІЯ ТА ВЕЧОРИ",
      text: "Ігрові зустрічі для знайомств, коли хочеться спільноти без кросівок.",
      photo: "format-mafia.jpg",
      slotKey: "formats-mafia",
      width: 666,
      height: 1000,
      alt: "Руки тримають фірмові карти Sport&Company для гри в мафію",
    },
    {
      title: "КОРПОРАТИВНІ АКТИВНОСТІ",
      text: "Тімбілдинги та спортивні дні для компаній, ЗВО й студентських організацій.",
      photo: "format-corporate.jpg",
      slotKey: "formats-corporate",
      width: 1000,
      height: 666,
      alt: "Двоє гравців у боротьбі за м'яч під час футзального матчу",
    },
    {
      title: "ПОДІЇ ПІД ЗАПИТ",
      text: "Ви кажете ідею — ми беремо на себе локацію, інвентар, суддівство та комунікацію.",
      photo: "format-custom.jpg",
      slotKey: "formats-custom",
      width: 666,
      height: 500,
      alt: "Тренер та організаторка обговорюють план з командою на майданчику",
    },
  ],
};

export const pricing = {
  eyebrow: "ПОСЛУГИ",
  heading: "ОБЕРИ СВІЙ ФОРМАТ СПІВПРАЦІ",
  intro: "Три пакети: спробувати одну подію, бути з нами постійно або замовити подію під свою команду.",
  packages: [
    {
      id: "start",
      badge: "ПАКЕТ 01",
      name: "START",
      tagline: "для першого знайомства",
      price: "450 грн",
      priceUnit: "/ подія",
      features: [
        "Участь в одній обраній події",
        "Доступ до чату спільноти",
        "Фото з події",
        "Підтримка координатора",
      ],
      button: "Обрати Start",
      variant: "outline",
      dropdownValue: "Пакет Start",
    },
    {
      id: "active",
      badge: "НАЙПОПУЛЯРНІШИЙ",
      name: "ACTIVE",
      tagline: "для регулярної участі",
      price: "1 200 грн",
      priceUnit: "/ місяць",
      features: [
        "4 події на місяць на вибір",
        "Пріоритетна реєстрація",
        "Знижки на додаткові активності",
        "Закриті ігрові вечори",
      ],
      button: "Обрати Active",
      variant: "filled",
      featured: true,
      dropdownValue: "Пакет Active",
    },
    {
      id: "team",
      badge: "ПАКЕТ 03",
      name: "TEAM",
      tagline: "для компаній та організацій",
      price: "за запитом",
      priceUnit: "",
      features: [
        "Подія під ваш запит",
        "Локація, суддівство, інвентар",
        "Фото- та відеозвіт",
        "Брендування та комунікація",
      ],
      button: "Замовити Team",
      variant: "outline",
      dropdownValue: "Пакет Team",
    },
  ],
};

export const faq = [
  {
    question: "Що входить у ціну пакета?",
    answer:
      "Локація, інвентар, робота координатора й суддів, фотозвіт та страхування учасників на час події. Додаткові витрати — тільки якщо ви просите нестандартну локацію або мерч.",
  },
  {
    question: "Скільки діє пакет і чи можна його передати?",
    answer:
      "Start діє на одну подію протягом 60 днів після оплати, Active — календарний місяць. Пакет можна один раз передати іншій людині: напишіть нам ім'я та контакт за 24 години до події.",
  },
  {
    question: "Що буде, якщо подію скасували?",
    answer:
      "Якщо скасовуємо ми — переносимо участь на будь-яку іншу подію або повертаємо повну суму протягом 5 робочих днів. Якщо не можете прийти ви — попередьте за 24 години, і ми перенесемо участь.",
  },
  {
    question: "Чи потрібна спортивна підготовка?",
    answer:
      "Ні. Ми ділимо учасників за рівнем і формуємо змішані команди, тому початківці грають у комфортному темпі. У кожному описі події вказано рівень навантаження.",
  },
];

export const gallery = {
  eyebrow: "АТМОСФЕРА",
  heading: "ЯК ЦЕ ВИГЛЯДАЄ",
  large: {
    photo: "hero-team-celebration.jpg",
    alt: "Команда святкує з піднятими руками після футзального матчу",
    slotKey: "gallery-large",
  },
  small: [
    { photo: "gallery-hands-huddle.jpg", alt: "Крупний план — руки гравців разом у колі", slotKey: "gallery-small-1" },
    { photo: "format-mafia.jpg", alt: "Руки тримають фірмові карти Sport&Company для гри в мафію", slotKey: "gallery-small-2" },
    { photo: "format-talks.jpg", alt: "Спікер із мікрофоном виступає перед слухачами", slotKey: "gallery-small-3" },
    { photo: "format-team-games.jpg", alt: "Гравці у стрибку за м'ячем на пляжному волейболі", slotKey: "gallery-small-4" },
  ],
};

export const partners = {
  eyebrow: "ПАРТНЕРИ",
  heading: ["ТІ, ХТО ГРАЮТЬ З НАМИ", "В ОДНІЙ КОМАНДІ"],
  paragraph:
    "Ми відкриті до співпраці з брендами, спортивними локаціями, кафе, книгарнями, освітніми проєктами та медіа. Формати — від підтримки однієї події до сезонного партнерства.",
  slotCount: 5,
  button: "Стати партнером →",
};

export const team = {
  eyebrow: "КОМАНДА",
  heading: ["НЕ ЛИШЕ ПРИХОДЬ —", "СТВОРЮЙ РАЗОМ З НАМИ"],
  paragraph:
    "Любиш спорт, людей і класні події? У нас завжди є місце для тих, хто хоче робити активності для міста. Досвід не обов'язковий — навчимо на практиці.",
  pills: [
    "Організація подій",
    "SMM і дизайн",
    "Фото та відео",
    "Партнерства",
    "Волонтерство",
    "Координація учасників",
  ],
  button: "Заповнити анкету →",
  photo: "team-group.jpg",
  alt: "Велика група усміхнених друзів на відкритому майданчику",
};

export const contact = {
  eyebrow: "КОНТАКТИ",
  heading: "ЗНАЙДИ НАС ПОЗА ЕКРАНОМ",
  paragraph:
    "Напиши нам, якщо хочеш замовити подію, стати партнером або просто дізнатися, де ми граємо цього тижня. Відповідаємо протягом доби.",
  email: "krutkev00@gmail.com",
  // [PLACEHOLDER] dummy number from the source design — needs a real number before launch
  phone: "+380 00 000 00 00",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/sportcompany_kyiv" },
    { label: "Telegram", href: "https://t.me/sportcompany_kyiv" },
  ],
  location: "Київ, Україна",
  form: {
    title: "ФОРМА ЗВЕРНЕННЯ",
    nameLabel: "ІМ'Я",
    namePlaceholder: "Як до вас звертатися",
    contactLabel: "КОНТАКТ",
    contactPlaceholder: "Email або @telegram",
    subjectLabel: "ТЕМА ЗВЕРНЕННЯ",
    // [ASSUMPTION] only "Пакет Start" is confirmed from the screenshot; this
    // is the reasonable full set inferred from the pricing section + partners CTA.
    subjectOptions: ["Пакет Start", "Пакет Active", "Пакет Team", "Партнерство", "Інше"],
    detailsLabel: "ДЕТАЛІ",
    detailsPlaceholder: "Коротко про вашу ідею, дату або кількість людей",
    submit: "Надіслати запит",
    // [PLACEHOLDER] truncated in the source screenshot after "…"; shipping
    // with the brief's own suggested honest consent copy.
    consent:
      "Натискаючи кнопку, ви погоджуєтесь, що ми зв'яжемось із вами через вказаний контакт щодо вашого звернення. Ми не передаємо ваші дані третім особам.",
  },
};

export const footer = {
  copyrightSuffix: "Sport&Company · Спорт — стиль життя, а не декорація",
};
