import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { resolveImageUrl } from "@/utils/image";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/ui/Modal";

const dismissedAtKey = (id) => `peronline_announcement_at_${id}`;

/** interval 0 = tampil lagi setiap reload / login */
function shouldShowAnnouncement(row) {
  const minutes = Math.max(0, Number(row.repeat_interval_minutes) || 0);
  if (minutes <= 0) return true;

  const raw = localStorage.getItem(dismissedAtKey(row.id));
  if (!raw) return true;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return true;
  return Date.now() - dismissedAt >= minutes * 60 * 1000;
}

export default function AnnouncementModal() {
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const audience = !user ? "buyer" : user.role === "seller" ? "seller" : user.role === "admin" ? "all" : "buyer";
    api
      .get(`${API_ENDPOINTS.ANNOUNCEMENTS.ACTIVE}?audience=${audience}`)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const next = rows.find((row) => shouldShowAnnouncement(row));
        if (next) {
          setItem(next);
          setOpen(true);
        } else {
          setItem(null);
          setOpen(false);
        }
      })
      .catch(() => {});
  }, [user]);

  const onClose = () => {
    if (item) {
      const minutes = Math.max(0, Number(item.repeat_interval_minutes) || 0);
      if (minutes > 0) {
        localStorage.setItem(dismissedAtKey(item.id), String(Date.now()));
      }
    }
    setOpen(false);
  };

  if (!item) return null;

  return (
    <Modal open={open} onClose={onClose} title={item.title}>
      <div className="space-y-3">
        {item.image ? (
          <img src={resolveImageUrl(item.image)} alt="" className="max-h-48 w-full rounded-xl object-cover" />
        ) : null}
        {item.body ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{item.body}</p> : null}
        {item.link_url ? (
          item.link_url.startsWith("http") ? (
            <a href={item.link_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600">
              Buka tautan
            </a>
          ) : (
            <Link to={item.link_url} onClick={onClose} className="text-sm font-bold text-blue-600">
              Lihat detail
            </Link>
          )
        ) : null}
      </div>
    </Modal>
  );
}
