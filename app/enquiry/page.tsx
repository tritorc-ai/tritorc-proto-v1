import { Mail, Phone } from "lucide-react";
import { CONTACT } from "@/lib/mock/appContent";
import { PageHeader } from "@/components/app/PageHeader";
import { EnquiryForm } from "@/components/app/EnquiryForm";

export default async function EnquiryPage(props: PageProps<"/enquiry">) {
  const sp = await props.searchParams;
  const about = typeof sp.about === "string" ? sp.about : undefined;

  return (
    <div>
      <PageHeader title="Enquiry" subtitle="Tell us what you need — our team will get back to you." />
      <div className="space-y-6 px-5">
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            className="press flex flex-col gap-2 rounded-[22px] bg-white p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Mail size={18} />
            </span>
            <span className="text-[14px] font-semibold text-brand-dark">Email</span>
            <span className="break-all text-[12.5px] text-brand-text-secondary">{CONTACT.email}</span>
          </a>
          <a href={CONTACT.phoneIndiaHref} className="press flex flex-col gap-2 rounded-[22px] bg-white p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Phone size={18} />
            </span>
            <span className="text-[14px] font-semibold text-brand-dark">Call</span>
            <span className="text-[12.5px] text-brand-text-secondary">{CONTACT.phoneIndia}</span>
          </a>
        </div>
        <EnquiryForm defaultInterest={about} />
      </div>
    </div>
  );
}
