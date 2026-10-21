import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { jakarta } from "@/lib/fonts";
import { getNotificationFeed } from "@/lib/notifications";
import { PageHeader } from "@/components/app/PageHeader";
import { NotificationFeed } from "@/components/app/NotificationFeed";
import { NotificationPrompt } from "@/components/app/NotificationPrompt";

export const metadata = { title: "Notifications | Tritorc" };

export default async function NotificationsPage() {
  const items = await getNotificationFeed();
  return (
    <div className={jakarta.className}>
      <PageHeader
        title="Notifications"
        subtitle="Events, case studies and articles from Tritorc."
        back={{ href: "/" }}
      />
      <div className="px-5 pb-6">
        <NotificationPrompt />
        <Link
          href="/events"
          className="press mb-4 flex items-center justify-between rounded-[24px] bg-brand-dark p-4 text-white"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <CalendarDays size={18} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold">Events &amp; exhibitions</span>
              <span className="block text-[12.5px] text-white/65">Upcoming shows and past events</span>
            </span>
          </span>
          <ChevronRight size={18} className="text-white/70" />
        </Link>
        <NotificationFeed items={items} />
      </div>
    </div>
  );
}
