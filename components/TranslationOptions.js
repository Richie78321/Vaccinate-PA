export default function TranslationOptions() {
  return (
    <>
      <a
        href="?lang=en#googtrans(en|en)"
        className="notranslate"
        data-lang="en"
      >
        English
      </a>
      {" · "}
      <a
        href="?lang=es#googtrans(en|es)"
        className="notranslate"
        data-lang="es"
      >
        Español
      </a>
      {" · "}
      <a
        href="?lang=zh#googtrans(en|zh-CN)"
        className="notranslate"
        data-lang="zh"
      >
        简体中文
      </a>
    </>
  );
}
