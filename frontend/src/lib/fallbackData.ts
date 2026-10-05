// Small fallback datasets used ONLY when the backend is unreachable, so directory
// grids degrade to a partial page instead of an outage (see TEMPLATE.md §4).
// Categories mirror backend/seed.py stream constants.
import type { College, Course } from "@/lib/types";

export const FALLBACK_COURSES: Course[] = [
  {
    id: "course-btech-cse",
    name: "B.Tech Computer Science & Engineering (CSE)",
    category: "Engineering & Technology",
    level: "Undergraduate",
    duration: "4 Years",
    eligibility: "10+2 with Physics, Chemistry & Maths (PCM) — min 45%",
    fee_range: "₹3 – 6 Lakh (total)",
    description:
      "The most in-demand engineering branch, covering programming, data structures, databases, cloud and software engineering.",
    career_outcomes: ["Software Engineer", "Full-Stack Developer", "Product Companies", "M.Tech / GATE"],
    popular: true,
  },
  {
    id: "course-bca",
    name: "BCA (Bachelor of Computer Applications)",
    category: "Computer/IT",
    level: "Undergraduate",
    duration: "3 Years",
    eligibility: "10+2 any stream (Maths / Computer preferred)",
    fee_range: "₹1.5 – 3 Lakh (total)",
    description:
      "Hands-on computing degree covering programming, databases, web development and software engineering.",
    career_outcomes: ["Software Developer", "Web Developer", "MCA", "IT Support & QA"],
    popular: true,
  },
  {
    id: "course-bba",
    name: "BBA (Bachelor of Business Administration)",
    category: "Management",
    level: "Undergraduate",
    duration: "3 Years",
    eligibility: "10+2 in any stream — min 45%",
    fee_range: "₹1.5 – 3.5 Lakh (total)",
    description:
      "Foundational management degree covering marketing, finance, HR, operations and business analytics.",
    career_outcomes: ["Management Trainee", "MBA", "Entrepreneurship"],
    popular: true,
  },
  {
    id: "course-bsc-nursing",
    name: "B.Sc Nursing",
    category: "Medical/Healthcare",
    level: "Undergraduate",
    duration: "4 Years",
    eligibility: "10+2 with Physics, Chemistry & Biology (PCB) — min 45%",
    fee_range: "₹2 – 5 Lakh (total)",
    description:
      "Clinical nursing degree with hospital rotations, registered-nurse licensing and overseas mobility.",
    career_outcomes: ["Staff Nurse (Govt/Private)", "Abroad Placements", "M.Sc Nursing"],
    popular: true,
  },
  {
    id: "course-ba-llb",
    name: "BA LL.B (Integrated)",
    category: "Law",
    level: "Undergraduate",
    duration: "5 Years",
    eligibility: "10+2 any stream — min 45% (CLAT preferred)",
    fee_range: "₹2 – 5 Lakh (total)",
    description:
      "Integrated arts-and-law honours programme with moot courts, internships and bar-council recognition.",
    career_outcomes: ["Advocate", "Judicial Services", "Corporate Counsel"],
    popular: true,
  },
  {
    id: "course-bsc-agri",
    name: "B.Sc Agriculture",
    category: "Agriculture",
    level: "Undergraduate",
    duration: "4 Years",
    eligibility: "10+2 with PCB / PCM / Agriculture",
    fee_range: "₹1.2 – 2.8 Lakh (total)",
    description:
      "Applied agriculture science covering agronomy, soil science, horticulture and agri-business.",
    career_outcomes: ["Agriculture Officer", "IBPS SO (Agri)", "Agri-business", "M.Sc Agri"],
    popular: true,
  },
];

export const FALLBACK_COLLEGES: College[] = [
  {
    id: "col-bits-pilani",
    name: "BITS Pilani",
    city: "Pilani",
    state: "Rajasthan",
    type: "Private (Deemed)",
    streams: ["Engineering & Technology", "Computer/IT", "Science", "Management"],
    rating: 4.8,
    fee_range: "₹5 – 6.5 Lakh / year",
    description:
      "India's most prestigious private engineering institute, admission through BITSAT, with outstanding placement records.",
    featured: true,
  },
  {
    id: "col-mahe-manipal",
    name: "Manipal Academy of Higher Education (MAHE)",
    city: "Manipal",
    state: "Karnataka",
    type: "Private (Deemed)",
    streams: ["Medical/Healthcare", "Engineering & Technology", "Management", "Design/Media"],
    rating: 4.7,
    fee_range: "₹4 – 8 Lakh / year",
    description:
      "Institution of Eminence renowned for medicine, nursing, engineering and allied health sciences.",
    featured: true,
  },
  {
    id: "col-vit-vellore",
    name: "VIT Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    type: "Private (Deemed)",
    streams: ["Engineering & Technology", "Computer/IT", "Management", "Law"],
    rating: 4.6,
    fee_range: "₹2 – 4.5 Lakh / year",
    description:
      "Top-ranked private engineering university, admission via VITEEE, with very strong campus recruitment.",
    featured: true,
  },
  {
    id: "col-op-jindal",
    name: "O.P. Jindal Global University",
    city: "Sonipat",
    state: "Haryana",
    type: "Private",
    streams: ["Law", "Management", "Arts/Humanities"],
    rating: 4.6,
    fee_range: "₹5 – 8 Lakh / year",
    description:
      "India's leading private law university (JGLS), globally ranked, with international faculty and exchange programmes.",
    featured: true,
  },
  {
    id: "col-lpu",
    name: "Lovely Professional University",
    city: "Phagwara",
    state: "Punjab",
    type: "Private",
    streams: ["Engineering & Technology", "Management", "Computer/IT", "Design/Media"],
    rating: 4.4,
    fee_range: "₹1.2 – 3.2 Lakh / year",
    description:
      "India's largest private university with 600+ programmes, top-class sports facilities and massive placement drives.",
    featured: true,
  },
  {
    id: "col-gnsu",
    name: "Gopal Narayan Singh University",
    city: "Sasaram",
    state: "Bihar",
    type: "Private",
    streams: ["Medical/Healthcare", "Diploma/Vocational", "Science", "Engineering & Technology"],
    rating: 4.0,
    fee_range: "₹1.2 – 4 Lakh / year",
    description:
      "Bihar's well-known private health-sciences university with nursing, pharmacy and medical programmes close to home.",
    featured: true,
  },
];
