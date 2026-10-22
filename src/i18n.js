import i18n from "i18next";
import {
  initReactI18next,
} from "react-i18next";

i18n.use(
  initReactI18next
).init({
  resources: {
    en: {
      translation: {
        dashboard:
          "Dashboard",
      },
    },

    hi: {
      translation: {
        dashboard:
          "डैशबोर्ड",
      },
    },

    pa: {
      translation: {
        dashboard:
          "ਡੈਸ਼ਬੋਰਡ",
      },
    },
  },

  lng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;