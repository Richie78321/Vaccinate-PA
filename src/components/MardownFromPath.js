import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown/with-html'

const customMarkdownRenderers = {
  image: ({ alt, src, title, }) => <img alt={alt} src={src} title={title} className="img-fluid" />
};

export default function MardownFromPath({ markdownPath }) {
  const [markdownText, setMarkdownText] = useState("");
  
  useEffect(() => {
    fetch(markdownPath)
        .then((resp) => resp.text())
        .then((markdownText) => setMarkdownText(markdownText))
        .catch((err) => console.error(err));
  });

  return (
    <ReactMarkdown
      linkTarget="_blank"
      source={markdownText}
      renderers={customMarkdownRenderers}
      allowDangerousHtml={true} />
  )
}
