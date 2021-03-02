import Layout from "./Layout";
import { FaAngleDoubleDown } from "react-icons/fa";

export default function TranslationLayout({ children, ...otherProps }) {
  return (
    <Layout {...otherProps}>
      {/* Page Translations */}
      <div className="mt-3 text-center text-sm-right mr-sm-4">
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
        <a href="#google_translate_element" className="ml-1">
          <FaAngleDoubleDown />
        </a>
      </div>
      {children}
    </Layout>
  )
}
