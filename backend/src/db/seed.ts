import { db } from "./index";
import { games, suggestions, users, type NewGame } from "./schema";

const date = (s: string) => new Date(s);

// Несколько изображений на игру (галерея). Внешние ссылки Unsplash.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80`;

const sampleGames: NewGame[] = [
  {
    title: "Stellar Blade",
    genre: "action",
    platform: "PS5 Pro",
    criticScore: 81,
    personalScore: "5+/5",
    completedAt: date("2026-03-02"),
    description:
      "Стильный экшен-слэшер от Shift Up с динамичными боями, эффектной героиней Ив и постапокалиптическим миром. Боевая система награждает за точные парирования и уклонения, а дизайн уровней умело сочетает линейные арены с полуоткрытыми зонами для исследования. Один из самых красивых эксклюзивов поколения.",
    images: [
      img("1542751371-adc38448a05e"),
      img("1538481199705-c710c4e965fc"),
      img("1511512578047-dfb367046420"),
    ],
  },
  {
    title: "Elden Ring",
    genre: "soulslike",
    platform: "PC",
    criticScore: 96,
    personalScore: "5/5",
    completedAt: date("2025-11-20"),
    description:
      "Magnum opus FromSoftware: огромный открытый мир Междуземья, созданный совместно с Джорджем Мартином. Беспощадная, но честная боевая система, десятки запоминающихся боссов и невероятная свобода в прокачке билдов. Маления остаётся одним из самых сложных испытаний в истории жанра.",
    images: [img("1538481199705-c710c4e965fc"), img("1550745165-9bc0b252726f")],
  },
  {
    title: "The Witcher 3: Wild Hunt",
    genre: "rpg",
    platform: "PC",
    criticScore: 93,
    personalScore: "5/5",
    completedAt: date("2025-08-14"),
    description:
      "Эталонная RPG с открытым миром. История Геральта из Ривии, ищущего Цири, наполнена морально неоднозначными выборами и лучшими побочными квестами в индустрии. Дополнения Hearts of Stone и Blood and Wine — обязательны к прохождению.",
    images: [img("1511512578047-dfb367046420"), img("1542751371-adc38448a05e")],
  },
  {
    title: "God of War Ragnarök",
    genre: "adventure",
    platform: "PS5",
    criticScore: 94,
    personalScore: "5/5",
    completedAt: date("2025-06-01"),
    description:
      "Кратос и Атрей завершают скандинавскую сагу. Кинематографичная постановка, проработанные персонажи и отполированная боевая система. Девять миров, скрытые боссы и эмоциональная история отца и сына.",
    images: [img("1552820728-8b83bb6b773f")],
  },
  {
    title: "Resident Evil 4 Remake",
    genre: "horror",
    platform: "PS5",
    criticScore: 93,
    personalScore: "5/5",
    completedAt: date("2025-04-10"),
    description:
      "Переосмысление классики survival horror. Леон Кеннеди спасает дочь президента в деревне, полной заражённых. Напряжённый геймплей, отличный ган-плей и атмосфера, бережно перенесённая из оригинала 2005 года.",
    images: [img("1509198397868-475647b2a1e5")],
  },
  {
    title: "DOOM Eternal",
    genre: "shooter",
    platform: "PC",
    criticScore: 88,
    personalScore: "5/5",
    completedAt: date("2025-02-22"),
    description:
      "Скоростной шутер, превращающий бой в кровавый балет. Постоянное движение, жонглирование оружием и глори-киллы под драйвовый саундтрек Мика Гордона. Чистый адреналин.",
    images: [img("1550745165-9bc0b252726f")],
  },
  {
    title: "Hollow Knight",
    genre: "platformer",
    platform: "Switch",
    criticScore: 90,
    personalScore: "5+/5",
    completedAt: date("2024-12-05"),
    description:
      "Шедевр-метроидвания от Team Cherry. Огромный взаимосвязанный мир Халлоунеста, точное управление, атмосферный визуал и музыка. Сложные боссы и глубокий лор, который раскрывается постепенно.",
    images: [img("1493711662062-fa541adb3fc8")],
  },
  {
    title: "Forza Horizon 5",
    genre: "racing",
    platform: "Xbox Series X",
    criticScore: 92,
    personalScore: "4/5",
    completedAt: date("2024-10-18"),
    description:
      "Аркадные гонки в открытом мире Мексики. Сотни автомобилей, потрясающая графика и смена сезонов. Идеальная игра, чтобы расслабиться и просто получать удовольствие от вождения.",
    images: [img("1503376780353-7e6692767b70")],
  },
];

const sampleSuggestions = [
  { title: "The Legend of Zelda: Breath of the Wild", votes: 1 },
  { title: "Divinity: Original Sin 2", votes: 1 },
  { title: "Red Dead Redemption 2", votes: 1 },
  { title: "The Last of Us", votes: 1 },
  { title: "Super Mario Odyssey", votes: 0 },
  { title: "The Legend of Zelda: Tears of the Kingdom", votes: 0 },
  { title: "The Last of Us Remastered", votes: 0 },
  { title: "Elden Ring", votes: 0 },
  { title: "BioShock Infinite", votes: 0 },
];

console.log("🌱 Заполняю БД...");

await db.delete(games);
await db.delete(suggestions);
await db.delete(users);

await db.insert(games).values(sampleGames);
await db.insert(suggestions).values(sampleSuggestions);

const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";
await db.insert(users).values({
  username: process.env.ADMIN_USERNAME ?? "admin",
  passwordHash: await Bun.password.hash(adminPassword),
});

console.log(
  `✅ Игр: ${sampleGames.length}, кандидатов: ${sampleSuggestions.length}, админ: admin/${adminPassword}`,
);
process.exit(0);
