import React from "react";
import TranslationLayout from "../layouts/TranslationLayout";
import ReactMarkdown from "react-markdown/with-html";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

const customMarkdownRenderers = {
  image: ({ alt, src, title }) => (
    <img alt={alt} src={src} title={title} className="img-fluid" />
  ),
  heading: HeadingRenderer,
};

// https://github.com/remarkjs/react-markdown/issues/69
function flatten(text, child) {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

function HeadingRenderer(props) {
  var children = React.Children.toArray(props.children);
  var text = children.reduce(flatten, "");
  var slug = text.toLowerCase().replace(/\W/g, "-");
  return React.createElement("h" + props.level, { id: slug }, props.children);
}

export default function MarkdownPage({ meta, markdownText }) {
  return (
    <TranslationLayout title={meta.title}>
      <div className="container-lg text-break mt-2">
        <ReactMarkdown
          linkTarget="_blank"
          source={markdownText}
          renderers={customMarkdownRenderers}
          allowDangerousHtml={true}
        />
      </div>
    </TranslationLayout>
  );
}

export async function getStaticProps({ params }) {
  const markdownPath = path.join(process.cwd(), `content/${params.mdfile}.md`);
  const fileContents = fs.readFileSync(markdownPath).toString();
  const { data, content } = matter(fileContents);

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
        params: { mdfile: "about-us" },
      },
      {
        params: { mdfile: "additional-resources" },
      },
    ],
    fallback: false,
  };
}
