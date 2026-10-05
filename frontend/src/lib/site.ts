// Site-wide constants: business identity, navigation, and shared copy.
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Building2,
  Compass,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

export const SITE_NAME = "Career Vision Education Services";

export const CONTACT = {
  addressLines: ["615B, 1st Floor, Plot No. 6, District Centre,", "Janakpuri, New Delhi – 110058"],
  phone1: "+91 97113 56677",
  phone2: "+91 96544 93444",
  whatsapp: "https://wa.me/919711356677",
  email: "info@careervisioneducationservices.com",
  hours: "Mon – Sat · 10:00 AM – 6:00 PM",
};

export interface NavLink {
  label: string;
  path: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Colleges", path: "/colleges" },
  { label: "Career Counseling", path: "/counseling" },
];

export const SUPPORT_NAV: NavLink[] = [
  { label: "Bihar Student Credit Card", path: "/bihar-credit-card" },
  { label: "Education Loan", path: "/education-loan" },
  { label: "Scholarships", path: "/scholarships" },
];

export const FOOTER_NAV: NavLink[] = [
  ...PRIMARY_NAV,
  ...SUPPORT_NAV,
  { label: "Contact Us", path: "/contact" },
];

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
}

export const SERVICES: Service[] = [
  {
    icon: Compass,
    title: "Career Counseling",
    description:
      "One-on-one expert counselling that maps the right course and career to your marks, interests and budget.",
    path: "/counseling",
  },
  {
    icon: GraduationCap,
    title: "Admission Guidance",
    description:
      "End-to-end admission support for universities across India — from application and documentation to enrolment.",
    path: "/apply",
  },
  {
    icon: Building2,
    title: "College Selection",
    description:
      "Shortlist from 150+ verified partner colleges with transparent fee, approval and placement data.",
    path: "/colleges",
  },
  {
    icon: Award,
    title: "Scholarship Assistance",
    description:
      "Find and apply for government and university scholarships you actually qualify for — state and national schemes.",
    path: "/scholarships",
  },
  {
    icon: IndianRupee,
    title: "Education Loan Help",
    description:
      "Zero-collateral and credit-card education loan guidance up to ₹4 lakh with partner-bank support.",
    path: "/education-loan",
  },
  {
    icon: ShieldCheck,
    title: "Bihar Student Credit Card",
    description:
      "Complete MNSSBY application support — eligibility check, documents, portal process and disbursement follow-up.",
    path: "/bihar-credit-card",
  },
];

export const HOME_STATS = [
  { value: "12+", label: "Years of Experience" },
  { value: "5,000+", label: "Students Guided" },
  { value: "150+", label: "Partner Colleges" },
  { value: "4.9/5", label: "Counselling Rating" },
];

export const COURSE_CATEGORIES = [
  "Engineering & Technology",
  "Computer Applications",
  "Management & Commerce",
  "Medical & Nursing",
  "Pharmacy",
  "Paramedical & Health",
  "Law",
  "Education",
  "Agriculture",
  "Arts & Media",
];

export const INDIAN_STATES = [
  "Bihar",
  "Jharkhand",
  "Uttar Pradesh",
  "Delhi",
  "Haryana",
  "Uttarakhand",
  "Rajasthan",
  "Punjab",
  "Madhya Pradesh",
  "Maharashtra",
  "West Bengal",
  "Odisha",
  "Gujarat",
  "Karnataka",
  "Assam",
  "Chhattisgarh",
  "Other",
];

export const TESTIMONIALS = [
  {
    name: "Priya Kumari",
    course: "B.Sc Nursing · Patna",
    quote:
      "Career Vision helped me get into a top nursing college with hostel support. They handled my Bihar Student Credit Card application end to end — the 0% interest saved my family real money.",
  },
  {
    name: "Arun Kumar",
    course: "B.Tech CSE · Greater Noida",
    quote:
      "I was confused between six colleges. My counselor compared placements and fees honestly, and I took admission with full confidence. Placed in my 3rd year itself.",
  },
  {
    name: "Neha Sharma",
    course: "MBA · Jaipur",
    quote:
      "From shortlisting universities to education-loan paperwork, everything was handled. Free counselling that actually felt personal, not salesy.",
  },
  {
    name: "Md. Imran",
    course: "B.Pharma · Meerut",
    quote:
      "They guided my D.Pharma to B.Pharma upgrade and got my scholarship processed on time. Very supportive team — visited the Janakpuri office twice, always helpful.",
  },
];

export const COLLEGE_TYPES = ["Government", "Private", "Private (Deemed)"];

export const IMAGES = {
  heroCampus:
    "https://images.unsplash.com/photo-1787151892015-d57558f964c3?crop=entropy&cs=srgb&fm=jpg&q=85",
  counseling:
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?crop=entropy&cs=srgb&fm=jpg&q=85",
  campusModern:
    "https://images.unsplash.com/photo-1562774053-701939374585?crop=entropy&cs=srgb&fm=jpg&q=85",
  campusHeritage:
    "https://images.unsplash.com/photo-1695722099520-564bb36a3a6b?crop=entropy&cs=srgb&fm=jpg&q=85",
  documents:
    "https://images.unsplash.com/photo-1562564055-71e051d33c19?crop=entropy&cs=srgb&fm=jpg&q=85",
};

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
