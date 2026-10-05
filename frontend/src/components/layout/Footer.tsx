import { Link } from "react-router-dom";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { SiInstagram } from "@icons-pack/react-simple-icons";
import { CONTACT, FOOTER_NAV, SITE_NAME } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const quickLinks = FOOTER_NAV.slice(0, 5);
  const supportLinks = FOOTER_NAV.slice(5);

  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gold text-navy">
              <GraduationCap className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-base font-bold">Career Vision</span>
              <span className="block text-[9px] font-semibold tracking-[0.22em] text-gold">
                EDUCATION SERVICES
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            Trusted career counseling and admission guidance across India — the right course, the right
            college, the right future.
          </p>
          <a
            href="https://www.instagram.com/careervisioneducationservices/"
            target="_blank"
            rel="noreferrer"
            aria-label="Career Vision Education Services on Instagram"
            data-testid="footer-instagram-link"
            className="mt-4 inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold hover:text-navy"
          >
            <SiInstagram className="size-4" />
          </a>
        </div>

        <nav aria-label="Quick links">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-sm text-white/65 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Student support">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Student Support</h3>
          <ul className="mt-4 space-y-2.5">
            {supportLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-sm text-white/65 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/apply"
                data-testid="footer-link-apply-now"
                className="text-sm font-semibold text-gold transition-colors hover:text-white"
              >
                Apply Now →
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                {CONTACT.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`}
                data-testid="footer-phone-1-link"
                className="flex gap-2.5 transition-colors hover:text-gold"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" /> {CONTACT.phone1}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone2.replace(/\s/g, "")}`}
                data-testid="footer-phone-2-link"
                className="flex gap-2.5 transition-colors hover:text-gold"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" /> {CONTACT.phone2}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                data-testid="footer-email-link"
                className="flex gap-2.5 transition-colors hover:text-gold"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" /> {CONTACT.email}
              </a>
            </li>
            <li className="text-white/50">{CONTACT.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p>Career counseling & admission guidance across India</p>
        </div>
      </div>
    </footer>
  );
}
