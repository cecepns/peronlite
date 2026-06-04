import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAuth } from "@/context/AuthContext";

const POLL_MS = 60_000;
const EVENT_NAME = "admin-pending-update";

const ORDER_ROUTES = {
  pending_premium: "/admin/premium/orders",
  pending_feed: "/admin/feed/orders",
  pending_banner: "/admin/banner/orders"
};

const ORDER_LABELS = {
  pending_premium: "Order Premium",
  pending_feed: "Order Iklan Feed",
  pending_banner: "Order Iklan Banner"
};

function notifyNewPending(navigate, key, count) {
  const route = ORDER_ROUTES[key];
  const label = ORDER_LABELS[key];
  toast(
    (t) => (
      <button
        type="button"
        className="flex w-full flex-col items-start gap-1 text-left"
        onClick={() => {
          toast.dismiss(t.id);
          navigate(route);
        }}
      >
        <span className="font-bold text-slate-900">Permintaan baru: {label}</span>
        <span className="text-sm text-slate-600">{count} menunggu persetujuan — ketuk untuk kelola</span>
      </button>
    ),
    { duration: 10_000, icon: "🔔" }
  );
}

export default function AdminPendingAlerts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const initialRef = useRef(true);

  useEffect(() => {
    if (user?.role !== "admin") return undefined;

    const poll = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.ADMIN.STATS);
        const data = res.data || {};
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));

        const prev = prevRef.current;
        if (prev && !initialRef.current) {
          ["pending_premium", "pending_feed", "pending_banner"].forEach((key) => {
            const next = Number(data[key] || 0);
            const before = Number(prev[key] || 0);
            if (next > before) notifyNewPending(navigate, key, next);
          });
        }

        prevRef.current = data;
        initialRef.current = false;
      } catch {
        /* ignore poll errors */
      }
    };

    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => clearInterval(timer);
  }, [user, navigate]);

  return null;
}

export { EVENT_NAME as ADMIN_PENDING_EVENT };
