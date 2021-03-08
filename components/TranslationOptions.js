import { IoIosGlobe } from "react-icons/io";
import { useState, useCallback } from "react";

export default function TranslationOptions() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const onClickCallback = useCallback(() => setMenuExpanded(true), [
    setMenuExpanded,
  ]);

  if (!menuExpanded) {
    return (
      <a href="#" onClick={onClickCallback} className="ml-2">
        <span className="align-middle">Translate</span>
        <IoIosGlobe size="1.25em" style={{ marginLeft: "2px" }} />
      </a>
    );
  } else {
    return (
      <span className="align-middle ml-2">
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
      </span>
    );  
  }
}
