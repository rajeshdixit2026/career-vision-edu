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
  owner: "Rajesh Dixit",
  addressLines: [
    "2nd Floor, Sona Commercial Complex,",
    "Above Mangal Marble, Banjari Road,",
    "Gopalganj, Bihar – 841428",
  ],
  phone1: "+91 84346 99521",
  whatsappNumber: "+91 62013 77781",
  whatsapp: "https://wa.me/916201377781",
  email: "careervisioneducationservices@gmail.com",
  hours: "Mon – Sat · 10:00 AM – 6:00 PM",
  instagram:
    "https://www.instagram.com/careervisioneducationservices?stkn=bDEwZzdtczBscTVt",
  facebook: "https://www.facebook.com/share/1JXkyrPrMP/",
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
      "They guided my D.Pharma to B.Pharma upgrade and got my scholarship processed on time. Very supportive team — visited the Gopalganj office twice, always helpful.",
  },
];

export const COLLEGE_TYPES = ["Government", "Private", "Private (Deemed)"];

export const IMAGES = {
  heroCampus:
    "https://static.prod-images.emergentagent.com/jobs/cb33b598-6800-4a2d-a5d0-3cfd9425c5ce/images/0446d8da0beeab19918e41661bea66b144b0bc6c4336d0e1ce26e8fec9889c9b.jpeg",
  counseling:
    "https://static.prod-images.emergentagent.com/jobs/cb33b598-6800-4a2d-a5d0-3cfd9425c5ce/images/3a49b9d213d2a939b3a4b22514ec061c92741a1403ca467179c6206408f8881f.jpeg",
  campusModern:
    "https://static.prod-images.emergentagent.com/jobs/cb33b598-6800-4a2d-a5d0-3cfd9425c5ce/images/827f0444b4bfd4b5a65b890f11d0e1ae8643297b75a2d5b399e1c64e55d0bc2c.jpeg",
  campusHeritage:
    "https://static.prod-images.emergentagent.com/jobs/cb33b598-6800-4a2d-a5d0-3cfd9425c5ce/images/3a49b9d213d2a939b3a4b22514ec061c92741a1403ca467179c6206408f8881f.jpeg",
  documents:
    "https://static.prod-images.emergentagent.com/jobs/cb33b598-6800-4a2d-a5d0-3cfd9425c5ce/images/2df54f76ae279b0544887100a20d0a37f6efc8755d86b7490a11625b797e439b.jpeg",
  achievement:
    "https://static.prod-images.emergentagent.com/jobs/cb33b598-6800-4a2d-a5d0-3cfd9425c5ce/images/03ff2217d561ec758e11ac354bd1039cc68024d31125a67afa7144036bd0a4a7.jpeg",
};

export const LEAD_STATUSES = ["new", "called", "interested", "admitted", "not_interested"] as const;

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  called: "Called",
  interested: "Interested",
  admitted: "Admitted",
  not_interested: "Not Interested",
};

export const LEAD_STATUS_CLASSES: Record<string, string> = {
  new: "bg-secondary text-secondary-foreground",
  called: "bg-[#DBEAFE] text-[#1E40AF]",
  interested: "bg-gold-soft text-[#78350F]",
  admitted: "bg-[#DCFCE7] text-[#166534]",
  not_interested: "bg-[#F1F5F9] text-[#475569]",
};

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
