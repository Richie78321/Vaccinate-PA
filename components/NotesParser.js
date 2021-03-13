import React from "react";
import Linkify from "react-linkify";

const linkDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

export default function NotesParser({ notes }) {
  notes = notes.split("\\n").join("\n");
  const notesNewlineSplit = notes.split("\n");

  return (
    <Linkify componentDecorator={linkDecorator}>
      {notesNewlineSplit.map((paragraph, index) => (
        <span key={index}>
          {paragraph}
          <br />
        </span>
      ))}
    </Linkify>
  );
}
