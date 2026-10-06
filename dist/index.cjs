"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AsyncSolverV2: () => RecaptchaV2Solver,
  AsyncSolverV3: () => RecaptchaV3Solver,
  CapSolverError: () => CapSolverError,
  ELEMENT_TRANSLATIONS: () => ELEMENT_TRANSLATIONS,
  OBJECT_TRANSLATIONS: () => OBJECT_TRANSLATIONS,
  RecaptchaBox: () => RecaptchaBox,
  RecaptchaError: () => RecaptchaError,
  RecaptchaNotFoundError: () => RecaptchaNotFoundError,
  RecaptchaRateLimitError: () => RecaptchaRateLimitError,
  RecaptchaSolveError: () => RecaptchaSolveError,
  RecaptchaTimeoutError: () => RecaptchaTimeoutError,
  RecaptchaV2Solver: () => RecaptchaV2Solver,
  RecaptchaV3Solver: () => RecaptchaV3Solver,
  SolverV2: () => RecaptchaV2Solver,
  SolverV3: () => RecaptchaV3Solver,
  convertMp3ToFlac: () => convertMp3ToFlac,
  getTranslationsPattern: () => getTranslationsPattern,
  recaptchav2: () => recaptchav2_exports,
  recaptchav3: () => recaptchav3_exports,
  transcribeWithGoogle: () => transcribeWithGoogle
});
module.exports = __toCommonJS(index_exports);

// src/errors.ts
var CapSolverError = class extends Error {
  constructor(message = "The CapSolver API returned an error.") {
    super(message);
    this.name = "CapSolverError";
  }
};
var RecaptchaError = class extends Error {
  constructor(message = "A reCAPTCHA error occurred.") {
    super(message);
    this.name = "RecaptchaError";
  }
};
var RecaptchaNotFoundError = class extends RecaptchaError {
  constructor(message = "The reCAPTCHA was not found.") {
    super(message);
    this.name = "RecaptchaNotFoundError";
  }
};
var RecaptchaSolveError = class extends RecaptchaError {
  constructor(message = "The reCAPTCHA could not be solved.") {
    super(message);
    this.name = "RecaptchaSolveError";
  }
};
var RecaptchaRateLimitError = class extends RecaptchaSolveError {
  constructor(message = "The reCAPTCHA rate limit has been exceeded.") {
    super(message);
    this.name = "RecaptchaRateLimitError";
  }
};
var RecaptchaTimeoutError = class extends RecaptchaSolveError {
  constructor(message = "The reCAPTCHA solve timeout has been exceeded.") {
    super(message);
    this.name = "RecaptchaTimeoutError";
  }
};

// src/recaptchav2/index.ts
var recaptchav2_exports = {};
__export(recaptchav2_exports, {
  AsyncSolver: () => RecaptchaV2Solver,
  ELEMENT_TRANSLATIONS: () => ELEMENT_TRANSLATIONS,
  OBJECT_TRANSLATIONS: () => OBJECT_TRANSLATIONS,
  ORIGINAL_LANGUAGE_AUDIO: () => ORIGINAL_LANGUAGE_AUDIO,
  RecaptchaBox: () => RecaptchaBox,
  RecaptchaV2Solver: () => RecaptchaV2Solver,
  Solver: () => RecaptchaV2Solver,
  convertMp3ToFlac: () => convertMp3ToFlac,
  getTranslationsPattern: () => getTranslationsPattern,
  transcribeWithGoogle: () => transcribeWithGoogle
});

// src/recaptchav2/translations.ts
var ELEMENT_TRANSLATIONS = {
  im_not_a_robot: [
    "I'm not a robot",
    "\u042F \u043D\u0435 \u0440\u043E\u0431\u043E\u0442",
    "\u8FDB\u884C\u4EBA\u673A\u8EAB\u4EFD\u9A8C\u8BC1",
    "No soy un robot",
    "Je ne suis pas un robot",
    "Ich bin kein Roboter",
    "Ik ben geen robot",
    "Non sono un robot",
    "N\xE3o sou um rob\xF4"
  ],
  get_an_audio_challenge: [
    "Get an audio challenge",
    "\u041F\u0440\u043E\u0439\u0442\u0438 \u0430\u0443\u0434\u0438\u043E\u0442\u0435\u0441\u0442",
    "\u6539\u7528\u97F3\u9891\u9A8C\u8BC1",
    "Obtener una pista sonora",
    "G\xE9n\xE9rer un test audio",
    "Audio-Captcha abrufen",
    "Een audio-uitdaging ophalen",
    "Verifica audio",
    "Receber um desafio de \xE1udio"
  ],
  get_a_visual_challenge: [
    "Get a visual challenge",
    "\u041F\u0440\u043E\u0439\u0442\u0438 \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u0441\u0442",
    "\u6539\u7528\u56FE\u7247\u9A8C\u8BC1",
    "Obtener una pista visual",
    "G\xE9n\xE9rer un test visuel",
    "Visuelles Captcha abrufen",
    "Een visuele uitdaging ophalen",
    "Verifica visiva",
    "Receber um desafio visual"
  ],
  get_a_new_challenge: [
    "Get a new challenge",
    "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
    "\u6362\u4E00\u4E2A\u65B0\u7684\u9A8C\u8BC1\u7801",
    "Obtener una pista nueva",
    "G\xE9n\xE9rer un nouveau test",
    "Neues Captcha abrufen",
    "Een nieuwe uitdaging ophalen",
    "Nuova verifica",
    "Receber outro desafio"
  ],
  alternatively_download_audio_as_mp3: [
    "Alternatively, download audio as MP3",
    "\u0421\u043A\u0430\u0447\u0430\u0442\u044C MP3-\u0444\u0430\u0439\u043B",
    "\u6216\u8005\u4EE5 MP3 \u683C\u5F0F\u4E0B\u8F7D\u97F3\u9891",
    "Tambi\xE9n puedes descargar el audio en formato MP3",
    "Ou t\xE9l\xE9chargez le fichier audio au format MP3",
    "Audio als MP3 herunterladen",
    "Of download het geluid als MP3-bestand",
    "In alternativa, scarica l'audio come MP3",
    "Como alternativa, fa\xE7a o download do \xE1udio como MP3"
  ],
  enter_what_you_hear: [
    "Enter what you hear",
    "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0440\u043E\u0437\u0432\u0443\u0447\u0430\u0432\u0448\u0438\u0435 \u0441\u043B\u043E\u0432\u0430",
    "\u8BF7\u8F93\u5165\u60A8\u542C\u5230\u7684\u5185\u5BB9",
    "Escribe lo que escuches",
    "Saisissez ce que vous entendez",
    "Geben Sie ein, was Sie h\xF6ren",
    "Geef op wat je hoort",
    "Inserisci quello che senti",
    "Digite o que voc\xEA ouve"
  ],
  skip: [
    "Skip",
    "\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",
    "\u8DF3\u8FC7",
    "Saltar",
    "Ignorer",
    "\xDCberspringen",
    "Overslaan",
    "Salta",
    "Pular"
  ],
  next: [
    "Next",
    "\u0414\u0430\u043B\u0435\u0435",
    "\u4E0B\u4E00\u4E2A",
    "Siguiente",
    "Suivant",
    "Weiter",
    "Volgende",
    "Avanti",
    "Avan\xE7ar"
  ],
  verify: [
    "Verify",
    "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C",
    "\u9A8C\u8BC1",
    "Verificar",
    "Valider",
    "Best\xE4tigen",
    "Verifi\xEBren",
    "Verifica",
    "Verificar"
  ],
  try_again_later: [
    "Try again later",
    "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u043F\u043E\u0437\u0436\u0435",
    "\u7A0D\u540E\u91CD\u8BD5",
    "Int\xE9ntalo de nuevo m\xE1s tarde",
    "R\xE9essayez plus tard",
    "Sp\xE4ter noch einmal versuchen",
    "Probeer het later opnieuw",
    "Riprova pi\xF9 tardi",
    "Tente novamente mais tarde"
  ],
  multiple_correct_solutions_required: [
    "Multiple correct solutions required - please solve more",
    "\u0412\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0434\u0430\u043D\u0438\u0439",
    "\u9700\u8981\u63D0\u4F9B\u591A\u4E2A\u6B63\u786E\u7B54\u6848 - \u8BF7\u56DE\u7B54\u66F4\u591A\u95EE\u9898",
    "Debes resolver m\xE1s captchas",
    "Veuillez effectuer d'autres tests (vous devez fournir plusieurs solutions correctes)",
    "Es sind mehrere richtige L\xF6sungen erforderlich. Bitte weitere Aufgaben l\xF6sen",
    "Er zijn meerdere juiste oplossingen vereist - geef meer oplossingen op",
    "\xC8 necessario fornire pi\xF9 soluzioni corrette. Risolvi altri captcha",
    "S\xE3o necess\xE1rias v\xE1rias solu\xE7\xF5es corretas. Solucione mais"
  ],
  press_play_to_listen: [
    "Press PLAY to listen",
    '\u0427\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0441\u043B\u0443\u0448\u0430\u0442\u044C, \u043D\u0430\u0436\u043C\u0438\u0442\u0435 "\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0441\u0442\u0438"',
    "\u6309\u201C\u64AD\u653E\u201D\u53EF\u542C\u8BED\u97F3\u5185\u5BB9",
    "Pulsa REPRODUCIR para escuchar el audio",
    "Appuyez sur LECTURE pour \xE9couter",
    "W\xE4hlen Sie WIEDERGABE aus, um die Wiedergabe zu starten",
    "Druk op AFSPELEN om te luisteren",
    "Premi RIPRODUCI per ascoltare",
    "Pressione REPRODUZIR para ouvir"
  ],
  please_try_again: [
    "Please try again",
    "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443",
    "\u8BF7\u91CD\u8BD5",
    "Int\xE9ntalo de nuevo",
    "Veuillez r\xE9essayer",
    "Versuche es bitte erneut",
    "Probeer het opnieuw",
    "Riprova",
    "Tente novamente"
  ],
  please_also_check_the_new_images: [
    "Please also check the new images",
    "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0442\u0430\u043A\u0436\u0435 \u043D\u043E\u0432\u044B\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
    "\u53E6\u5916\uFF0C\u60A8\u8FD8\u9700\u67E5\u770B\u65B0\u663E\u793A\u7684\u56FE\u7247",
    "Comprueba tambi\xE9n las im\xE1genes nuevas",
    "Veuillez \xE9galement v\xE9rifier les nouvelles images",
    "Sehen Sie sich auch die neuen Bilder an",
    "Controleer ook de nieuwe afbeeldingen",
    "Controlla anche le nuove immagini",
    "Verifique tamb\xE9m as novas imagens"
  ],
  please_select_all_matching_images: [
    "Please select all matching images",
    "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0441\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
    "\u8BF7\u9009\u62E9\u6240\u6709\u76F8\u7B26\u7684\u56FE\u7247",
    "Selecciona todas las im\xE1genes que coincidan",
    "Veuillez s\xE9lectionner toutes les images correspondantes",
    "W\xE4hlen Sie alle passenden Bilder aus",
    "Selecteer alle overeenkomende afbeeldingen",
    "Seleziona tutte le immagini corrispondenti",
    "Selecione todas as imagens correspondentes"
  ]
};
var OBJECT_TRANSLATIONS = {
  taxis: ["taxis", "\u0442\u0430\u043A\u0441\u0438", "\u51FA\u79DF\u8F66", "Taxis", "taxi's", "taxi", "t\xE1xis"],
  bus: [
    "bus",
    "buses",
    "\u0430\u0432\u0442\u043E\u0431\u0443\u0441",
    "\u0430\u0432\u0442\u043E\u0431\u0443\u0441\u044B",
    "\u516C\u4EA4\u8F66",
    "autobuses",
    "autob\xFAs",
    "Bus",
    "Bussen",
    "bussen",
    "autobus",
    "\xF4nibus"
  ],
  motorcycles: [
    "motorcycles",
    "\u043C\u043E\u0442\u043E\u0446\u0438\u043A\u043B\u044B",
    "\u6469\u6258\u8F66",
    "motocicletas",
    "motos",
    "Motorr\xE4dern",
    "motorfietsen",
    "motoren",
    "motocicli"
  ],
  tractors: [
    "tractors",
    "\u0442\u0440\u0430\u043A\u0442\u043E\u0440\u0430",
    "\u62D6\u62C9\u673A",
    "tractores",
    "tracteurs",
    "Traktoren",
    "tractoren",
    "trattori",
    "tratores"
  ],
  chimneys: [
    "chimneys",
    "\u0434\u044B\u043C\u043E\u0432\u044B\u0435 \u0442\u0440\u0443\u0431\u044B",
    "\u70DF\u56F1",
    "chimeneas",
    "chemin\xE9es",
    "Schornsteinen",
    "schoorstenen",
    "camini",
    "chamin\xE9s"
  ],
  crosswalks: [
    "crosswalks",
    "\u043F\u0435\u0448\u0435\u0445\u043E\u0434\u043D\u044B\u0435 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u044B",
    "\u4EBA\u884C\u6A2A\u9053",
    "\u8FC7\u8857\u4EBA\u884C\u9053",
    "pasos de peatones",
    "passages pour pi\xE9tons",
    "Fu\xDFg\xE4nger\xFCberwegen",
    "oversteekplaatsen",
    "zebrapaden",
    "strisce pedonali",
    "faixas de pedestres",
    "faixas de pedestre"
  ],
  traffic_lights: [
    "traffic lights",
    "\u0441\u0432\u0435\u0442\u043E\u0444\u043E\u0440\u044B",
    "\u7EA2\u7EFF\u706F",
    "sem\xE1foros",
    "feux de circulation",
    "Ampeln",
    "verkeerslichten",
    "semafori"
  ],
  bicycles: [
    "bicycles",
    "\u0432\u0435\u043B\u043E\u0441\u0438\u043F\u0435\u0434\u044B",
    "\u81EA\u884C\u8F66",
    "bicicletas",
    "v\xE9los",
    "Fahrr\xE4dern",
    "fietsen",
    "biciclette"
  ],
  parking_meters: [
    "parking meters",
    "\u043F\u0430\u0440\u043A\u043E\u0432\u043E\u0447\u043D\u044B\u0435 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u044B",
    "\u505C\u8F66\u8BA1\u65F6\u5668",
    "parqu\xEDmetros",
    "parcm\xE8tres",
    "Parkometern",
    "parkeermeters",
    "parchimetri"
  ],
  cars: [
    "cars",
    "\u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u0438",
    "\u5C0F\u8F7F\u8F66",
    "coches",
    "voitures",
    "Pkws",
    "auto's",
    "auto",
    "carros"
  ],
  bridges: [
    "bridges",
    "\u043C\u043E\u0441\u0442\u0430\u043C\u0438",
    "\u6865",
    "puentes",
    "ponts",
    "Br\xFCcken",
    "bruggen",
    "ponti",
    "pontes"
  ],
  boats: ["boats", "\u043B\u043E\u0434\u043A\u0438", "\u8239", "barcos", "bateaux", "Boote", "boten", "barche"],
  palm_trees: [
    "palm trees",
    "\u043F\u0430\u043B\u044C\u043C\u044B",
    "\u68D5\u6988\u6811",
    "palmeras",
    "palmiers",
    "Palmen",
    "palmbomen",
    "palme",
    "palmeiras"
  ],
  mountains_or_hills: [
    "mountains or hills",
    "mountain",
    "\u0433\u043E\u0440\u044B \u0438\u043B\u0438 \u0445\u043E\u043B\u043C\u044B",
    "monta\xF1as o colinas",
    "montagnes ou collines",
    "Berge oder H\xFCgel",
    "bergen of heuvels",
    "montagne o colline",
    "montanhas ou colinas"
  ],
  fire_hydrant: [
    "a fire hydrant",
    "fire hydrants",
    "\u0433\u0438\u0434\u0440\u0430\u043D\u0442\u0430\u043C\u0438",
    "\u043F\u043E\u0436\u0430\u0440\u043D\u044B\u0435 \u0433\u0438\u0434\u0440\u0430\u043D\u0442\u044B",
    "\u6D88\u9632\u6813",
    "bocas de incendios",
    "una boca de incendios",
    "borne d'incendie",
    "bouches d'incendie",
    "Hydranten",
    "Feuerhydranten",
    "een brandkraan",
    "brandkranen",
    "idrante",
    "idranti",
    "um hidrante",
    "hidrantes"
  ],
  stairs: [
    "stairs",
    "\u043B\u0435\u0441\u0442\u043D\u0438\u0446\u044B",
    "\u697C\u68AF",
    "escaleras",
    "escaliers",
    "Treppen(stufen)",
    "trappen",
    "scale",
    "escadas"
  ]
};
var ORIGINAL_LANGUAGE_AUDIO = ["de", "es", "fr", "it", "nl", "pt"];
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getTranslationsPattern(translations) {
  const escaped = translations.map(escapeRegex).join("|");
  return new RegExp(`^(${escaped}).?$`);
}

// src/recaptchav2/recaptcha-box.ts
var RecaptchaBox = class _RecaptchaBox {
  anchorFrame;
  bframeFrame;
  constructor(anchorFrame, bframeFrame) {
    this.anchorFrame = anchorFrame;
    this.bframeFrame = bframeFrame;
  }
  /**
   * Get the reCAPTCHA anchor and bframe frame pairs.
   */
  static getRecaptchaFramePairs(frames) {
    const anchorFrames = frames.filter(
      (frame) => /\/recaptcha\/(api2|enterprise)\/anchor/.test(frame.url())
    );
    const bframeFrames = frames.filter(
      (frame) => /\/recaptcha\/(api2|enterprise)\/bframe/.test(frame.url())
    );
    const framePairs = [];
    for (const anchorFrame of anchorFrames) {
      const frameId = anchorFrame.name().slice(2);
      for (const bframeFrame of bframeFrames) {
        if (!bframeFrame.name().includes(frameId)) {
          continue;
        }
        framePairs.push([anchorFrame, bframeFrame]);
      }
    }
    if (framePairs.length === 0) {
      throw new RecaptchaNotFoundError();
    }
    return framePairs;
  }
  /**
   * Create a reCAPTCHA box using a list of frames.
   */
  static async fromFrames(frames) {
    const framePairs = _RecaptchaBox.getRecaptchaFramePairs(frames);
    for (const [anchorFrame, bframeFrame] of framePairs) {
      const box = new _RecaptchaBox(anchorFrame, bframeFrame);
      if (!box.framesAreAttached()) {
        continue;
      }
      const [checkboxVisible, audioVisible, imageVisible] = await Promise.all([
        box.checkbox.isVisible().catch(() => false),
        box.audioChallengeButton.isVisible().catch(() => false),
        box.imageChallengeButton.isVisible().catch(() => false)
      ]);
      if (checkboxVisible) {
        const checked = await box.checkbox.isChecked().catch(() => false);
        if (!checked) {
          return box;
        }
      }
      if (audioVisible) {
        const enabled = await box.audioChallengeButton.isEnabled().catch(() => false);
        if (enabled) {
          return box;
        }
      }
      if (imageVisible) {
        const enabled = await box.imageChallengeButton.isEnabled().catch(() => false);
        if (enabled) {
          return box;
        }
      }
    }
    throw new RecaptchaNotFoundError("No unchecked reCAPTCHA boxes were found.");
  }
  get checkbox() {
    return this.anchorFrame.getByRole("checkbox", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.im_not_a_robot)
    });
  }
  get audioChallengeButton() {
    return this.bframeFrame.getByRole("button", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.get_an_audio_challenge)
    });
  }
  get imageChallengeButton() {
    return this.bframeFrame.getByRole("button", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.get_a_visual_challenge)
    });
  }
  get newChallengeButton() {
    return this.bframeFrame.getByRole("button", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.get_a_new_challenge)
    });
  }
  get audioDownloadButton() {
    return this.bframeFrame.getByRole("link", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.alternatively_download_audio_as_mp3)
    });
  }
  get audioChallengeTextbox() {
    return this.bframeFrame.getByRole("textbox", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.enter_what_you_hear)
    });
  }
  get skipButton() {
    return this.bframeFrame.getByRole("button", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.skip)
    });
  }
  get nextButton() {
    return this.bframeFrame.getByRole("button", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.next)
    });
  }
  get verifyButton() {
    return this.bframeFrame.getByRole("button", {
      name: getTranslationsPattern(ELEMENT_TRANSLATIONS.verify)
    });
  }
  get tileSelector() {
    return this.bframeFrame.locator(".rc-imageselect-tile");
  }
  get imageChallenge() {
    return this.bframeFrame.locator(".rc-imageselect-challenge");
  }
  framesAreAttached() {
    return !this.framesAreDetached();
  }
  framesAreDetached() {
    return this.anchorFrame.isDetached() || this.bframeFrame.isDetached();
  }
  async rateLimitIsVisible() {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame.getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.try_again_later)).isVisible().catch(() => false);
  }
  async solveFailureIsVisible() {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame.getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.multiple_correct_solutions_required)).isVisible().catch(() => false);
  }
  async imageChallengeIsVisible() {
    if (this.framesAreDetached()) return false;
    const button = this.skipButton.or(this.nextButton).or(this.verifyButton);
    return button.isEnabled().catch(() => false);
  }
  async audioChallengeIsVisible() {
    if (this.framesAreDetached()) return false;
    const textVisible = await this.bframeFrame.getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.press_play_to_listen)).isVisible().catch(() => false);
    if (!textVisible) return false;
    const btnVisible = await this.newChallengeButton.isVisible().catch(() => false);
    if (!btnVisible) return false;
    return this.newChallengeButton.isEnabled().catch(() => false);
  }
  async anyChallengeIsVisible() {
    const [imageVisible, audioVisible] = await Promise.all([
      this.imageChallengeIsVisible(),
      this.audioChallengeIsVisible()
    ]);
    return imageVisible || audioVisible;
  }
  async tryAgainIsVisible() {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame.getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.please_try_again)).isVisible().catch(() => false);
  }
  async checkNewImagesIsVisible() {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame.getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.please_also_check_the_new_images)).isVisible().catch(() => false);
  }
  async selectAllMatchingIsVisible() {
    if (this.framesAreDetached()) return false;
    return this.bframeFrame.getByText(getTranslationsPattern(ELEMENT_TRANSLATIONS.please_select_all_matching_images)).isVisible().catch(() => false);
  }
  async challengeIsSolved() {
    if (this.framesAreDetached()) return false;
    const visible = await this.checkbox.isVisible().catch(() => false);
    if (!visible) return false;
    return this.checkbox.isChecked().catch(() => false);
  }
};

// src/recaptchav2/audio.ts
var import_child_process = require("child_process");
var DEFAULT_GOOGLE_KEY = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";
async function convertMp3ToFlac(mp3Buffer, ffmpegPath = "ffmpeg") {
  return new Promise((resolve, reject) => {
    const proc = (0, import_child_process.spawn)(ffmpegPath, [
      "-y",
      "-i",
      "pipe:0",
      "-ar",
      "16000",
      "-ac",
      "1",
      "-f",
      "flac",
      "pipe:1"
    ]);
    const chunks = [];
    const errors = [];
    proc.stdout.on("data", (data) => {
      chunks.push(data);
    });
    proc.stderr.on("data", (data) => {
      errors.push(data);
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
      } else {
        const errMsg = Buffer.concat(errors).toString("utf-8");
        reject(new Error(`FFmpeg exited with code ${code}: ${errMsg}`));
      }
    });
    proc.on("error", (err) => {
      reject(err);
    });
    proc.stdin.write(mp3Buffer);
    proc.stdin.end();
  });
}
async function transcribeWithGoogle(flacBuffer, language = "en-US", apiKey = DEFAULT_GOOGLE_KEY) {
  const url = `https://www.google.com/speech-api/v2/recognize?client=chromium&lang=${encodeURIComponent(
    language
  )}&key=${apiKey}&pFilter=0`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "audio/x-flac; rate=16000",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    },
    body: flacBuffer
  });
  if (!res.ok && res.status !== 200) {
    return null;
  }
  const responseText = await res.text();
  for (const line of responseText.split("\n")) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      if (Array.isArray(data.result) && data.result.length > 0) {
        const alternatives = data.result[0].alternative;
        if (Array.isArray(alternatives) && alternatives.length > 0) {
          const transcript = alternatives[0].transcript;
          if (typeof transcript === "string" && transcript.length > 0) {
            return transcript;
          }
        }
      }
    } catch {
    }
  }
  return null;
}

// src/recaptchav2/solver.ts
var OBJECT_ID_MAP = {
  "/m/0pg52": OBJECT_TRANSLATIONS.taxis,
  "/m/01bjv": OBJECT_TRANSLATIONS.bus,
  "/m/04_sv": OBJECT_TRANSLATIONS.motorcycles,
  "/m/013xlm": OBJECT_TRANSLATIONS.tractors,
  "/m/01jk_4": OBJECT_TRANSLATIONS.chimneys,
  "/m/014xcs": OBJECT_TRANSLATIONS.crosswalks,
  "/m/015qff": OBJECT_TRANSLATIONS.traffic_lights,
  "/m/0199g": OBJECT_TRANSLATIONS.bicycles,
  "/m/015qbp": OBJECT_TRANSLATIONS.parking_meters,
  "/m/0k4j": OBJECT_TRANSLATIONS.cars,
  "/m/015kr": OBJECT_TRANSLATIONS.bridges,
  "/m/019jd": OBJECT_TRANSLATIONS.boats,
  "/m/0cdl1": OBJECT_TRANSLATIONS.palm_trees,
  "/m/09d_r": OBJECT_TRANSLATIONS.mountains_or_hills,
  "/m/01pns0": OBJECT_TRANSLATIONS.fire_hydrant,
  "/m/01lynh": OBJECT_TRANSLATIONS.stairs
};
var RecaptchaV2Solver = class {
  page;
  attempts;
  capsolverApiKey;
  ffmpegPath;
  customTranscriber;
  humanTyping;
  typingDelay;
  token = null;
  payloadResponse = null;
  constructor(page, options = {}) {
    this.page = page;
    this.attempts = options.attempts ?? 5;
    this.capsolverApiKey = options.capsolverApiKey ?? process.env.CAPSOLVER_API_KEY;
    this.ffmpegPath = options.ffmpegPath ?? "ffmpeg";
    this.customTranscriber = options.transcribeAudio;
    this.humanTyping = options.humanTyping ?? true;
    this.typingDelay = options.typingDelay ?? [60, 160];
    this.page.on("response", this.handleResponse);
  }
  close() {
    try {
      this.page.off("response", this.handleResponse);
    } catch {
    }
  }
  [Symbol.asyncDispose]() {
    this.close();
  }
  handleResponse = async (response) => {
    const url = response.url();
    if (/\/recaptcha\/(api2|enterprise)\/payload/.test(url) && this.payloadResponse === null) {
      this.payloadResponse = response;
    } else if (/\/recaptcha\/(api2|enterprise)\/userverify/.test(url)) {
      try {
        const text = await response.text();
        const tokenMatch = /"uvresp","(.*?)"/.exec(text);
        if (tokenMatch && tokenMatch[1]) {
          this.token = tokenMatch[1];
        }
      } catch {
      }
    }
  };
  async getTaskObject(recaptchaBox) {
    const taskTexts = await recaptchaBox.bframeFrame.locator("div").allInnerTexts();
    if (taskTexts.length === 0) return null;
    const lines = taskTexts[0].split("\n");
    if (lines.length < 2) return null;
    const objectName = lines[1].trim();
    for (const [id, translations] of Object.entries(OBJECT_ID_MAP)) {
      if (translations.includes(objectName)) {
        return id;
      }
    }
    return null;
  }
  async getCapsolverResponse(recaptchaBox, imageData) {
    const imageBase64 = imageData.toString("base64");
    const taskObject = await this.getTaskObject(recaptchaBox);
    if (taskObject === null) {
      return null;
    }
    const payload = {
      clientKey: this.capsolverApiKey,
      task: {
        type: "ReCaptchaV2Classification",
        image: imageBase64,
        question: taskObject
      }
    };
    const response = await this.page.request.post("https://api.capsolver.com/createTask", {
      data: payload
    });
    let responseJson;
    try {
      responseJson = await response.json();
    } catch {
      throw new CapSolverError();
    }
    if (responseJson.errorId !== 0) {
      throw new CapSolverError(responseJson.errorDescription);
    }
    return responseJson;
  }
  async solveTiles(recaptchaBox, indexes) {
    const changingTiles = /* @__PURE__ */ new Map();
    const styleScript = `(element) => {
      element.style = "";
      element.className = "rc-imageselect-tile";
    }`;
    for (const index of indexes) {
      const tile = recaptchaBox.tileSelector.nth(index);
      await tile.click();
      const className = await tile.getAttribute("class");
      if (!className || !className.includes("rc-imageselect-dynamic-selected")) {
        continue;
      }
      const src = await tile.locator("img").getAttribute("src");
      if (src) {
        changingTiles.set(index, src);
        await tile.evaluate(styleScript);
      }
    }
    const startTime = Date.now();
    while (changingTiles.size > 0 && Date.now() - startTime < 6e4) {
      for (const [index, oldUrl] of Array.from(changingTiles.entries())) {
        const tile = recaptchaBox.tileSelector.nth(index);
        const imageUrl = await tile.locator("img").getAttribute("src");
        if (oldUrl === imageUrl || !imageUrl) {
          continue;
        }
        changingTiles.set(index, imageUrl);
        const response = await this.page.request.get(imageUrl);
        const body = await response.body();
        const capsolverResponse = await this.getCapsolverResponse(recaptchaBox, body);
        if (!capsolverResponse || !capsolverResponse.solution?.hasObject) {
          changingTiles.delete(index);
          continue;
        }
        await tile.click();
        await tile.evaluate(styleScript);
      }
      await this.page.waitForTimeout(250);
    }
  }
  async transcribeAudio(audioUrl, language = "en-US") {
    const response = await this.page.request.get(audioUrl);
    const mp3Buffer = await response.body();
    if (this.customTranscriber) {
      return this.customTranscriber(mp3Buffer, language);
    }
    try {
      const flacBuffer = await convertMp3ToFlac(mp3Buffer, this.ffmpegPath);
      return await transcribeWithGoogle(flacBuffer, language);
    } catch {
      return null;
    }
  }
  async clickCheckbox(recaptchaBox) {
    await recaptchaBox.checkbox.click();
    while (recaptchaBox.framesAreAttached() && this.token === null) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }
      if (await recaptchaBox.anyChallengeIsVisible()) {
        return;
      }
      await this.page.waitForTimeout(250);
    }
  }
  async getAudioUrl(recaptchaBox) {
    while (true) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }
      if (await recaptchaBox.audioChallengeIsVisible()) {
        const href = await recaptchaBox.audioDownloadButton.getAttribute("href");
        if (href) {
          return href;
        }
      }
      await this.page.waitForTimeout(250);
    }
  }
  async submitAudioText(recaptchaBox, text) {
    if (this.humanTyping) {
      await recaptchaBox.audioChallengeTextbox.click();
      await this.page.waitForTimeout(Math.floor(Math.random() * 200) + 150);
      const [minDelay, maxDelay] = this.typingDelay;
      for (const char of text) {
        if (typeof recaptchaBox.audioChallengeTextbox.pressSequentially === "function") {
          await recaptchaBox.audioChallengeTextbox.pressSequentially(char);
        } else {
          await recaptchaBox.audioChallengeTextbox.type(char);
        }
        const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
        await this.page.waitForTimeout(delay);
      }
      await this.page.waitForTimeout(Math.floor(Math.random() * 300) + 200);
    } else {
      await recaptchaBox.audioChallengeTextbox.fill(text);
    }
    const [userverifyResp] = await Promise.all([
      this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/userverify/),
      recaptchaBox.verifyButton.click()
    ]);
    await userverifyResp.finished();
    while (recaptchaBox.framesAreAttached()) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }
      if (!await recaptchaBox.audioChallengeIsVisible() || await recaptchaBox.solveFailureIsVisible() || await recaptchaBox.challengeIsSolved()) {
        return;
      }
      await this.page.waitForTimeout(250);
    }
  }
  async submitTileAnswers(recaptchaBox) {
    await recaptchaBox.verifyButton.click();
    while (recaptchaBox.framesAreAttached()) {
      if (await recaptchaBox.rateLimitIsVisible()) {
        throw new RecaptchaRateLimitError();
      }
      if (await recaptchaBox.challengeIsSolved() || await recaptchaBox.tryAgainIsVisible()) {
        return;
      }
      if (await recaptchaBox.checkNewImagesIsVisible() || await recaptchaBox.selectAllMatchingIsVisible()) {
        await Promise.all([
          this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/payload/),
          recaptchaBox.newChallengeButton.click()
        ]);
        return;
      }
      await this.page.waitForTimeout(250);
    }
  }
  async solveImageChallenge(recaptchaBox) {
    while (recaptchaBox.framesAreAttached()) {
      if (!this.payloadResponse) {
        const image = recaptchaBox.imageChallenge.locator("img").first();
        const imageUrl = await image.getAttribute("src");
        if (imageUrl) {
          this.payloadResponse = await this.page.request.get(imageUrl);
        }
      }
      if (!this.payloadResponse) {
        await this.page.waitForTimeout(250);
        continue;
      }
      const capsolverResponse = await this.getCapsolverResponse(
        recaptchaBox,
        await this.payloadResponse.body()
      );
      if (!capsolverResponse || !capsolverResponse.solution?.objects?.length) {
        this.payloadResponse = null;
        await Promise.all([
          this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/reload/),
          recaptchaBox.newChallengeButton.click()
        ]);
        while (this.payloadResponse === null) {
          if (await recaptchaBox.rateLimitIsVisible()) {
            throw new RecaptchaRateLimitError();
          }
          await this.page.waitForTimeout(250);
        }
        continue;
      }
      await this.solveTiles(recaptchaBox, capsolverResponse.solution.objects);
      this.payloadResponse = null;
      const button = recaptchaBox.skipButton.or(recaptchaBox.nextButton);
      if (await button.isHidden()) {
        await this.submitTileAnswers(recaptchaBox);
        return;
      }
      await Promise.all([
        this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/payload/),
        button.click()
      ]);
    }
  }
  async solveAudioChallenge(recaptchaBox) {
    const parsedUrl = new URL(recaptchaBox.anchorFrame.url());
    let language = parsedUrl.searchParams.get("hl") || "en-US";
    if (!ORIGINAL_LANGUAGE_AUDIO.includes(language)) {
      language = "en-US";
    }
    let text = null;
    while (true) {
      const url = await this.getAudioUrl(recaptchaBox);
      text = await this.transcribeAudio(url, language);
      if (text !== null) {
        break;
      }
      await Promise.all([
        this.page.waitForResponse(/\/recaptcha\/(api2|enterprise)\/reload/),
        recaptchaBox.newChallengeButton.click()
      ]);
      while (url === await this.getAudioUrl(recaptchaBox)) {
        await this.page.waitForTimeout(250);
      }
    }
    await this.submitAudioText(recaptchaBox, text);
  }
  async recaptchaIsVisible() {
    try {
      await RecaptchaBox.fromFrames(this.page.frames());
      return true;
    } catch (err) {
      if (err instanceof RecaptchaNotFoundError) {
        return false;
      }
      throw err;
    }
  }
  async solveRecaptcha(options = {}) {
    const imageChallenge = options.imageChallenge ?? false;
    let attempts = options.attempts ?? this.attempts;
    const wait = options.wait ?? false;
    const rawTimeout = options.waitTimeout ?? 30;
    const waitTimeoutMs = rawTimeout <= 1e3 ? rawTimeout * 1e3 : rawTimeout;
    if (imageChallenge && !this.capsolverApiKey) {
      throw new CapSolverError(
        "You must provide a CapSolver API key to solve image challenges."
      );
    }
    this.token = null;
    let recaptchaBox;
    if (wait) {
      const startTime = Date.now();
      while (true) {
        try {
          recaptchaBox = await RecaptchaBox.fromFrames(this.page.frames());
          break;
        } catch (err) {
          if (err instanceof RecaptchaNotFoundError) {
            if (Date.now() - startTime >= waitTimeoutMs) {
              throw err;
            }
            await this.page.waitForTimeout(250);
            continue;
          }
          throw err;
        }
      }
    } else {
      recaptchaBox = await RecaptchaBox.fromFrames(this.page.frames());
    }
    if (await recaptchaBox.rateLimitIsVisible()) {
      throw new RecaptchaRateLimitError();
    }
    if (await recaptchaBox.checkbox.isVisible()) {
      const clickTimestamp = Date.now();
      await this.clickCheckbox(recaptchaBox);
      if (this.token !== null) {
        return this.token;
      }
      if (recaptchaBox.framesAreDetached() || !await recaptchaBox.anyChallengeIsVisible() || await recaptchaBox.challengeIsSolved()) {
        while (this.token === null) {
          await this.page.waitForTimeout(250);
        }
        return this.token;
      }
      const elapsed = Date.now() - clickTimestamp;
      const timeToWait = Math.max(1e3 - elapsed, 0);
      if (timeToWait > 0) {
        await this.page.waitForTimeout(timeToWait);
      }
    }
    while (!await recaptchaBox.anyChallengeIsVisible()) {
      await this.page.waitForTimeout(250);
    }
    if (imageChallenge && await recaptchaBox.imageChallengeButton.isVisible()) {
      await recaptchaBox.imageChallengeButton.click();
    } else if (!imageChallenge && await recaptchaBox.audioChallengeButton.isVisible()) {
      await recaptchaBox.audioChallengeButton.click();
    }
    if (imageChallenge) {
      const image = recaptchaBox.imageChallenge.locator("img").first();
      const imageUrl = await image.getAttribute("src");
      if (imageUrl) {
        this.payloadResponse = await this.page.request.get(imageUrl);
      }
    }
    while (attempts > 0) {
      this.token = null;
      if (imageChallenge) {
        await this.solveImageChallenge(recaptchaBox);
      } else {
        await this.solveAudioChallenge(recaptchaBox);
      }
      if (recaptchaBox.framesAreDetached() || !await recaptchaBox.anyChallengeIsVisible() || await recaptchaBox.challengeIsSolved()) {
        while (this.token === null) {
          await this.page.waitForTimeout(250);
        }
        return this.token;
      }
      attempts -= 1;
    }
    throw new RecaptchaSolveError();
  }
};

// src/recaptchav3/index.ts
var recaptchav3_exports = {};
__export(recaptchav3_exports, {
  AsyncSolver: () => RecaptchaV3Solver,
  RecaptchaV3Solver: () => RecaptchaV3Solver,
  Solver: () => RecaptchaV3Solver
});

// src/recaptchav3/solver.ts
var RecaptchaV3Solver = class {
  page;
  defaultTimeoutMs;
  token = null;
  constructor(page, options = {}) {
    this.page = page;
    const timeout = options.timeout ?? 30;
    this.defaultTimeoutMs = timeout <= 1e3 ? timeout * 1e3 : timeout;
    this.page.on("response", this.handleResponse);
  }
  close() {
    try {
      this.page.off("response", this.handleResponse);
    } catch {
    }
  }
  [Symbol.asyncDispose]() {
    this.close();
  }
  handleResponse = async (response) => {
    const url = response.url();
    if (!/\/recaptcha\/(api2|enterprise)\/reload/.test(url)) {
      return;
    }
    try {
      const text = await response.text();
      const match = /"rresp","(.*?)"/.exec(text);
      if (match && match[1]) {
        this.token = match[1];
      }
    } catch {
    }
  };
  /**
   * Wait for the reCAPTCHA v3 to be solved and return the `g-recaptcha-response` token.
   *
   * @param timeout The solve timeout in seconds (or ms if > 1000). Defaults to constructor timeout.
   * @returns The `g-recaptcha-response` token.
   * @throws RecaptchaTimeoutError If the solve timeout has been exceeded.
   */
  async solveRecaptcha(timeout) {
    this.token = null;
    const timeoutMs = timeout !== void 0 ? timeout <= 1e3 ? timeout * 1e3 : timeout : this.defaultTimeoutMs;
    const startTime = Date.now();
    while (this.token === null) {
      if (Date.now() - startTime >= timeoutMs) {
        throw new RecaptchaTimeoutError();
      }
      await this.page.waitForTimeout(250);
    }
    return this.token;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AsyncSolverV2,
  AsyncSolverV3,
  CapSolverError,
  ELEMENT_TRANSLATIONS,
  OBJECT_TRANSLATIONS,
  RecaptchaBox,
  RecaptchaError,
  RecaptchaNotFoundError,
  RecaptchaRateLimitError,
  RecaptchaSolveError,
  RecaptchaTimeoutError,
  RecaptchaV2Solver,
  RecaptchaV3Solver,
  SolverV2,
  SolverV3,
  convertMp3ToFlac,
  getTranslationsPattern,
  recaptchav2,
  recaptchav3,
  transcribeWithGoogle
});
