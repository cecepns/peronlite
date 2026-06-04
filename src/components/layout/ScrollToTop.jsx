import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const APP_MAIN_SCROLL_ID = "app-main-scroll";

/** Reset scroll ke atas — window (buyer/mobile) + container utama (seller/admin desktop). */
export function scrollAppToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.getElementById(APP_MAIN_SCROLL_ID);
  if (root) root.scrollTop = 0;
}

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollAppToTop();
    const frame = requestAnimationFrame(scrollAppToTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
