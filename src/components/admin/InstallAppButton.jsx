import { useEffect, useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isMobileDevice() {
  return /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

// Chrome/Edge/Android fire `beforeinstallprompt` when the manifest + service
// worker meet install criteria — we capture it and trigger it from our own
// button instead of relying on the browser's own install UI. iOS Safari
// never fires this event (Apple doesn't support it), so there it just shows
// instructions for the manual Add to Home Screen flow instead.
export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => isStandalone());

  useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  // This is purely a "get the app on your phone" feature — desktop admins
  // just use the browser directly, so don't clutter their sidebar with it.
  if (!isMobileDevice()) return null;

  if (installed) {
    return (
      <p className="admin-notify-note">
        <CheckCircle2 size={14} /> App installed
      </p>
    );
  }

  if (deferredPrompt) {
    return (
      <button type="button" className="admin-notify-btn" onClick={handleInstall}>
        <Download size={16} /> Install App
      </button>
    );
  }

  if (isIos()) {
    return (
      <p className="admin-notify-note">
        <Download size={14} /> On iPhone: tap Share, then "Add to Home Screen" to install.
      </p>
    );
  }

  // Chrome/Edge/Android only fire beforeinstallprompt once their own
  // engagement heuristics are satisfied (not guaranteed on a first visit,
  // and suppressed for a while after a prior dismissal) — show a manual
  // fallback instead of rendering nothing while we wait for it.
  return (
    <p className="admin-notify-note">
      <Download size={14} /> Use your browser's menu → "Install app" or "Add to Home Screen" to install.
    </p>
  );
}
