import { motion } from "motion/react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, IMAGES } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function ContactUs() {
  return (
    <>
      <PageHeader
        badge="Contact Us"
        title="Talk to a counselor — call, WhatsApp or visit us"
        description="Our Gopalganj office is open six days a week. Walk in, call, or drop an enquiry — we respond within one working day."
        image={IMAGES.campusHeritage}
      />

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Contact info */}
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="space-y-5 lg:col-span-5">
          <div
            data-testid="contact-address-card"
            className="rounded-2xl border-l-4 border-gold bg-navy p-6 text-white"
          >
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
              <MapPin className="size-5 text-gold" /> Visit our office
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {CONTACT.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
              <Phone className="size-5 text-gold" /> Call or WhatsApp
            </h2>
            <div className="mt-3 space-y-2">
              <a
                href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`}
                data-testid="contact-phone-1-link"
                className="block text-sm font-bold text-primary transition-colors hover:text-gold"
              >
                {CONTACT.phone1} (Call)
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                data-testid="contact-whatsapp-number-link"
                className="block text-sm font-bold text-primary transition-colors hover:text-gold"
              >
                {CONTACT.whatsappNumber} (WhatsApp)
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                data-testid="contact-whatsapp-btn"
                className="press mt-3 inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#15803D]"
              >
                <MessageCircle className="size-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold">
                <Mail className="size-5 text-gold" /> Email
              </h2>
              <a
                href={`mailto:${CONTACT.email}`}
                data-testid="contact-email-link"
                className="mt-2 block break-all text-sm font-semibold text-primary transition-colors hover:text-gold"
              >
                {CONTACT.email}
              </a>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)]">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold">
                <Clock className="size-5 text-gold" /> Working hours
              </h2>
              <p className="mt-2 text-sm font-semibold">{CONTACT.hours}</p>
              <p className="mt-1 text-xs text-muted-foreground">Sunday: closed</p>
            </div>
          </div>
        </motion.div>

        {/* Enquiry form */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-7">
          <div
            data-testid="contact-form-card"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(4,25,78,0.08)] md:p-8"
          >
            <h2 className="font-heading text-xl font-bold">Send us an enquiry</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us what you're planning — we'll call you back with honest guidance.
            </p>
            <div className="mt-6">
              <LeadCaptureForm source="contact" showMessage submitLabel="Send Enquiry" />
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
