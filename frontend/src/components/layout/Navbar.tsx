import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, GraduationCap, Mail, Menu, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CONTACT, FOOTER_NAV, PRIMARY_NAV, SITE_NAME, SUPPORT_NAV } from "@/lib/site";

function slug(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50" data-testid="site-header">
      {/* Utility strip — desktop only */}
      <div className="hidden bg-navy-deep text-xs text-white/70 md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p>{CONTACT.hours} · Banjari Road, Gopalganj, Bihar</p>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 transition-colors hover:text-gold"
              data-testid="nav-top-phone-link"
            >
              <Phone className="size-3" /> {CONTACT.phone1}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-gold"
              data-testid="nav-top-email-link"
            >
              <Mail className="size-3" /> {CONTACT.email}
            </a>
          </div>        </div>
      </div>

      {/* Main bar */}
      <nav
        className={`border-b border-white/10 bg-navy/95 backdrop-blur-xl transition-shadow duration-200 ${
          scrolled ? "shadow-[0_8px_30px_-10px_rgba(3,15,51,0.7)]" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo-link">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gold text-navy">
              <GraduationCap className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-base font-bold text-white">Career Vision</span>
              <span className="block text-[9px] font-semibold tracking-[0.22em] text-gold">
                EDUCATION SERVICES
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {PRIMARY_NAV.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${slug(link.label)}`}
                className={({ isActive }) =>
                  `text-[13.5px] font-medium transition-colors duration-150 ${
                    isActive ? "text-gold" : "text-white/85 hover:text-gold"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                data-testid="nav-support-dropdown-btn"
                className="flex items-center gap-1 text-[13.5px] font-medium text-white/85 outline-none transition-colors duration-150 hover:text-gold"
              >
                Student Support <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                {SUPPORT_NAV.map((link) => (
                  <DropdownMenuItem
                    key={link.path}
                    data-testid={`nav-support-item-${slug(link.label)}`}
                    onClick={() => navigate(link.path)}
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/contact"
              data-testid="nav-link-contact-us"
              className={({ isActive }) =>
                `text-[13.5px] font-medium transition-colors duration-150 ${
                  isActive ? "text-gold" : "text-white/85 hover:text-gold"
                }`
              }
            >
              Contact Us
            </NavLink>

            <Link
              to="/apply"
              data-testid="nav-apply-now-btn"
              className={`press rounded-full bg-gold px-4 py-2 text-[13.5px] font-bold text-navy transition-colors duration-150 hover:bg-[#ffdd5c]`}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              data-testid="nav-mobile-menu-btn"
              className="press flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto border-white/10 bg-navy text-white">
              <SheetTitle className="text-white" data-testid="nav-mobile-title">
                <span className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-navy">
                    <GraduationCap className="size-4" />
                  </span>
                  {SITE_NAME}
                </span>
              </SheetTitle>
              <div className="mt-2 flex flex-col gap-1 pb-6">
                {FOOTER_NAV.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    data-testid={`nav-mobile-link-${slug(link.label)}`}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                        isActive ? "bg-white/10 text-gold" : "text-white/85 hover:bg-white/10 hover:text-gold"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to="/apply"
                  data-testid="nav-mobile-apply-btn"
                  className="press mt-3 rounded-full bg-gold px-4 py-2.5 text-center text-sm font-bold text-navy"
                >
                  Apply Now
                </Link>
                <a
                  href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`}
                  className="mt-4 flex items-center gap-2 px-3 text-sm text-white/70"
                  data-testid="nav-mobile-phone-link"
                >
                  <Phone className="size-4 text-gold" /> {CONTACT.phone1}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
