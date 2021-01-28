import Layout from '../layouts/Layout';
import ReactMarkdown from "react-markdown/with-html";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

const customMarkdownRenderers = {
  image: ({ alt, src, title }) => (
    <img alt={alt} src={src} title={title} className="img-fluid" />
  ),
};

export default function MarkdownPage({ meta, markdownText }) {
  return (
    <Layout title={meta.title}>
      <div className="container-lg mt-4">
        <ReactMarkdown
          linkTarget="_blank"
          source={markdownText}
          renderers={customMarkdownRenderers}
          allowDangerousHtml={true}
        />
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const markdownPath = path.join(process.cwd(), `content/${params.mdfile}.md`)
  const fileContents = fs.readFileSync(markdownPath).toString()
  const { data, content } = matter(fileContents)

  return {
    props: {
      meta: data,
      markdownText: content,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { 
        params: { mdfile: "about-us" }
      },
      { 
        params: { mdfile: "additional-resources" }
      }
    ],
    fallback: false,
  };
}
