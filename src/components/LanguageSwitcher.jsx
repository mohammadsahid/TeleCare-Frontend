import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div>
      <button
        onClick={() =>
          i18n.changeLanguage("en")
        }
      >
        English
      </button>

      <button
        onClick={() =>
          i18n.changeLanguage("hi")
        }
      >
        हिन्दी
      </button>

      <button
        onClick={() =>
          i18n.changeLanguage("pa")
        }
      >
        ਪੰਜਾਬੀ
      </button>
    </div>
  );
}

export default LanguageSwitcher;