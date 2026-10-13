import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  isPushSupported,
  getExistingSubscription,
  enablePushNotifications,
  disablePushNotifications,
} from "../../lib/pushNotifications";

function isIosNotStandalone() {
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isStandalone =
    window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  return isIos && !isStandalone;
}

export default function NotificationToggle() {
  const { user } = useAdminAuth();
  const [status, setStatus] = useState("checking"); // checking | unsupported | ios-install | off | on | busy | error
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!isPushSupported()) {
      setStatus(isIosNotStandalone() ? "ios-install" : "unsupported");
      return;
    }
    getExistingSubscription().then((sub) => {
      if (!active) return;
      setStatus(sub ? "on" : "off");
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleEnable() {
    setStatus("busy");
    setError("");
    try {
      await enablePushNotifications(user?.id);
      setStatus("on");
    } catch (err) {
      setStatus("off");
      setError(err.message || "Couldn't enable notifications.");
    }
  }

  async function handleDisable() {
    setStatus("busy");
    try {
      await disablePushNotifications();
      setStatus("off");
    } catch {
      setStatus("on");
    }
  }

  if (status === "checking") return null;

  if (status === "unsupported") {
    return (
      <p className="admin-notify-note">
        <BellOff size={14} /> Push notifications aren't supported in this browser.
      </p>
    );
  }

  if (status === "ios-install") {
    return (
      <p className="admin-notify-note">
        <BellOff size={14} /> On iPhone, add this page to your Home Screen first (Share → Add to Home
        Screen), then open it from there to enable notifications.
      </p>
    );
  }

  return (
    <div className="admin-notify-toggle">
      {status === "on" ? (
        <button type="button" className="admin-notify-btn is-on" onClick={handleDisable}>
          <BellRing size={16} /> Notifications On
        </button>
      ) : (
        <button type="button" className="admin-notify-btn" onClick={handleEnable} disabled={status === "busy"}>
          <Bell size={16} /> {status === "busy" ? "Enabling..." : "Enable Notifications"}
        </button>
      )}
      {error && <span className="admin-notify-error">{error}</span>}
    </div>
  );
}
