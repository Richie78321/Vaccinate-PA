import Layout from "./Layout";
import TranslationOptions from "../components/TranslationOptions";

export default function TranslationLayout({ children, ...otherProps }) {
  return (
    <Layout {...otherProps}>
      {/* Page Translations */}
      <div className="mt-3 text-center text-sm-right mr-sm-4">
        <TranslationOptions />
      </div>
      {children}
    </Layout>
  )
}
