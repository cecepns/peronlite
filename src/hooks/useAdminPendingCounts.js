import { useEffect, useState } from "react";
import { ADMIN_PENDING_EVENT } from "@/components/admin/AdminPendingAlerts";

export function useAdminPendingCounts() {
  const [counts, setCounts] = useState({
    pending_premium: 0,
    pending_feed: 0,
    pending_banner: 0,
    pending_requests: 0
  });

  useEffect(() => {
    const onUpdate = (e) => {
      const data = e.detail || {};
      setCounts({
        pending_premium: Number(data.pending_premium || 0),
        pending_feed: Number(data.pending_feed || 0),
        pending_banner: Number(data.pending_banner || 0),
        pending_requests: Number(data.pending_requests || 0)
      });
    };
    window.addEventListener(ADMIN_PENDING_EVENT, onUpdate);
    return () => window.removeEventListener(ADMIN_PENDING_EVENT, onUpdate);
  }, []);

  return counts;
}
