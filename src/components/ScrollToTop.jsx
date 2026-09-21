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
    // A hash means someone followed a "/#section" link (e.g. from the
    // Pricing page back to a homepage section) -- that's a real full-page
    // navigation (plain <a>, not <Link>) that needs to land on that
    // section, not the top. Only force-reset when there's no target to
    // honor.
    if (hash) return;
    // The site sets scroll-behavior: smooth globally for same-page anchor
    // links, which would otherwise make this animate slowly from wherever
    // the previous page was scrolled to. Force an instant jump instead.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
