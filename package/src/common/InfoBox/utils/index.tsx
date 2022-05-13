import React from "react";

const isValidWebUrl = (url: string) => {
  const regEx =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  return regEx.test(url);
};

export const URLize = (s?: string) => {
  if (!s) return;
  const urlStart = s.search(/https?:\/\//);
  if (urlStart < 0) return s;
  const urlSubstring = s.substring(urlStart);
  const url = urlSubstring.split(" ")[0];
  if (!isValidWebUrl(url)) return s;
  return (
    <>
      {s.substring(0, urlStart - 1)}
      &nbsp;
      <a href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
      &nbsp;
      {urlSubstring.split(" ").slice(1).join(" ")}
    </>
  );
};
