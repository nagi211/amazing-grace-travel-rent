// Lightweight per-route <title>/description/canonical management for this
// single-page app. No react-helmet dependency needed for just two public
// routes — each page calls this once with its own values so they don't all
// inherit whatever index.html's static tags happen to say (which, before
// this, meant /pricing silently told Google its canonical page was the
// homepage).
import { useEffect } from "react";

const SITE_URL = "https://www.amazinggrace.events";

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function usePageMeta({ title, description, path }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta("description", description);

    if (path) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", `${SITE_URL}${path}`);
    }
  }, [title, description, path]);
}
