import { useEffect } from "react";

/**
 * ثبت سرویس‌کاربر /sw.js — فقط در build نهایی (PROD) تا کش آفلاین با HMR
 * محیط توسعه تداخل نکند. بی‌صداست: هر خطا فقط سکوت می‌شود.
 */
export function PwaRegister() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      /* مرورگرها و حالت‌های خصوصی که این را نمی‌پذیرند */
    });
  }, []);

  return null;
}