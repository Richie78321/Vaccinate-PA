import React from "react";
import Linkify from "react-linkify";

const linkDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

export default function NotesParser({ notes }) {
  return <Linkify componentDecorator={linkDecorator}>{notes}</Linkify>;
}
