import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation by default, so
// without this, clicking to /pricing (or back to /) from partway down a page
// lands you at whatever scroll position you were already at. Keyed on
// pathname only (not the full location) so it doesn't fight with same-page
// hash anchors like "/#rentals", which change the hash but not the path.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // The site sets scroll-behavior: smooth globally for same-page anchor
      // links, which would otherwise make this animate slowly from wherever
      // the previous page was scrolled to. Force an instant jump instead.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    // A hash means someone followed a "/#section" link (e.g. from the
    // Pricing page back to a homepage section) -- that's a real full-page
    // navigation (plain <a>, not <Link>), so the target element doesn't
    // exist in the DOM yet at the moment the browser's own "jump to
    // fragment" behavior fires on load -- it only tries once, finds
    // nothing, and gives up, leaving the page at the top. Poll briefly
    // for the element to mount, then scroll to it ourselves.
    const id = hash.slice(1);
    let attempts = 0;
    let timeoutId;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < 20) timeoutId = setTimeout(tryScroll, 50);
    };
    tryScroll();

    return () => clearTimeout(timeoutId);
  }, [pathname, hash]);

  return null;
}
