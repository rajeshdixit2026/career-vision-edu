"""Seed the Career Vision catalog.

Run:  cd /app/backend && python seed.py
Idempotent — wipes and repopulates `courses` / `colleges`, then rebuilds indexes.
Course streams and names follow the owner-supplied programme list.
"""

import asyncio

from lib.db import db, ensure_indexes
from models.catalog import College, Course

UG = "Undergraduate"
PG = "Postgraduate"
DIP = "Diploma"

ENGG = "Engineering & Technology"
MGMT = "Management"
CSIT = "Computer/IT"
COMM = "Commerce"
SCI = "Science"
AGRI = "Agriculture"
MED = "Medical/Healthcare"
LAW = "Law"
ARTS = "Arts/Humanities"
HOSP = "Hospitality"
DSGN = "Design/Media"
ARCH = "Architecture"
EDU = "Education"
VOC = "Diploma/Vocational"


def c(
    cid: str,
    name: str,
    category: str,
    level: str,
    duration: str,
    eligibility: str,
    fee_range: str,
    description: str,
    outcomes: list[str],
    popular: bool = False,
) -> dict:
    return dict(
        id=cid,
        name=name,
        category=category,
        level=level,
        duration=duration,
        eligibility=eligibility,
        fee_range=fee_range,
        description=description,
        career_outcomes=outcomes,
        popular=popular,
    )


PCM = "10+2 with Physics, Chemistry & Maths (PCM)"
PCB = "10+2 with Physics, Chemistry & Biology (PCB)"
ANY12 = "10+2 in any stream"

COURSES: list[dict] = [
    # ── Engineering & Technology ─────────────────────────────────────────────
    c("course-btech-cse", "B.Tech Computer Science & Engineering (CSE)", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹3 – 6 Lakh (total)", "The most in-demand engineering branch, covering programming, data structures, databases, cloud and software engineering with internships.", ["Software Engineer", "Full-Stack Developer", "Product Companies", "M.Tech / GATE"], True),
    c("course-btech-it", "B.Tech Information Technology (IT)", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹3 – 5.5 Lakh (total)", "Applied computing degree focused on networks, systems administration, enterprise software and IT infrastructure.", ["IT Analyst", "Network Engineer", "Software Developer", "Cloud Support"], True),
    c("course-btech-aiml", "B.Tech Artificial Intelligence & Machine Learning", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹3.5 – 7 Lakh (total)", "New-age specialisation in machine learning, deep learning, computer vision and NLP with capstone AI projects.", ["ML Engineer", "AI Developer", "Data Scientist", "Research Roles"], True),
    c("course-btech-ds", "B.Tech Data Science", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹3.5 – 7 Lakh (total)", "Statistics-and-code heavy programme covering big data, visualisation, predictive modelling and data engineering.", ["Data Scientist", "Data Engineer", "Business Analyst", "BI Developer"], True),
    c("course-btech-mech", "B.Tech Mechanical Engineering", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹2.5 – 5 Lakh (total)", "Core branch covering thermodynamics, manufacturing, design and CAD/CAM with strong PSU and core-industry demand.", ["Design Engineer", "Production Engineer", "PSU Jobs", "GATE / M.Tech"], False),
    c("course-btech-civil", "B.Tech Civil Engineering", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹2.5 – 4.5 Lakh (total)", "Infrastructure-focused branch covering structures, surveying, geotechnics and construction management.", ["Site Engineer", "Structural Designer", "Govt / PWD Jobs", "SSC JE"], False),
    c("course-btech-ee", "B.Tech Electrical Engineering", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹2.5 – 5 Lakh (total)", "Power systems, machines, control and electrical design — a core branch with heavy PSU recruitment.", ["Electrical Engineer", "Power Sector / PSU", "Maintenance Engineer"], False),
    c("course-btech-ece", "B.Tech Electronics & Communication (ECE)", ENGG, UG, "4 Years", f"{PCM} — min 45%", "₹2.8 – 5.5 Lakh (total)", "Electronics, VLSI, embedded systems and communication networks, with crossover into software roles.", ["Embedded Engineer", "VLSI Design", "Telecom", "Software Roles"], False),
    c("course-btech-biotech", "B.Tech Biotechnology", ENGG, UG, "4 Years", "10+2 with PCM or PCB — min 45%", "₹2.5 – 5 Lakh (total)", "Engineering applied to biology: bioprocessing, genetic engineering, bioinformatics and pharma manufacturing.", ["Biotech Industry", "Pharma R&D", "Lab Analyst", "M.Tech / M.Sc"], False),
    c("course-mtech", "M.Tech (Master of Technology)", ENGG, PG, "2 Years", "B.Tech / BE in a relevant branch", "₹1 – 2.5 Lakh (total)", "Specialisation-level engineering qualification for research, academia and senior technical roles.", ["Senior Engineer", "R&D Roles", "Assistant Professor"], False),
    # ── Management ───────────────────────────────────────────────────────────
    c("course-bba", "BBA (Bachelor of Business Administration)", MGMT, UG, "3 Years", f"{ANY12} — min 45%", "₹1.5 – 3.5 Lakh (total)", "Foundational management degree covering marketing, finance, HR, operations and business analytics.", ["Management Trainee", "MBA", "Entrepreneurship"], True),
    c("course-bba-finance", "BBA Finance", MGMT, UG, "3 Years", f"{ANY12} — min 45%", "₹1.8 – 4 Lakh (total)", "Finance-specialised BBA covering corporate finance, investment analysis, banking and financial modelling.", ["Financial Analyst", "Banking & NBFC", "MBA Finance", "CFA Prep"], False),
    c("course-bba-dm", "BBA Digital Marketing", MGMT, UG, "3 Years", f"{ANY12} — min 45%", "₹1.8 – 4 Lakh (total)", "Modern marketing degree covering SEO, performance ads, social media, analytics and content strategy.", ["Digital Marketer", "Performance Ads", "Social Media Manager", "Agency Roles"], False),
    c("course-bba-ib", "BBA International Business", MGMT, UG, "3 Years", f"{ANY12} — min 45%", "₹1.8 – 4 Lakh (total)", "Global-trade focused BBA covering export-import, forex, international marketing and cross-border logistics.", ["Export-Import Executive", "Logistics", "MBA (IB)"], False),
    c("course-bba-hm", "BBA Hotel Management", MGMT, UG, "3 Years", f"{ANY12} — min 45%", "₹1.8 – 4 Lakh (total)", "Business-oriented hospitality degree blending management fundamentals with hotel operations training.", ["Hotel Management Trainee", "Resorts & Chains", "Event Management"], False),
    c("course-mba", "MBA (Master of Business Administration)", MGMT, PG, "2 Years", "Graduation in any stream (CAT / MAT / CMAT accepted)", "₹2 – 8 Lakh (total)", "Flagship management qualification with placements across banking, consulting, FMCG and tech companies.", ["Manager", "Business Analyst", "HR / Marketing Leadership"], True),
    # ── Computer / IT ────────────────────────────────────────────────────────
    c("course-bca", "BCA (Bachelor of Computer Applications)", CSIT, UG, "3 Years", "10+2 any stream (Maths / Computer preferred)", "₹1.5 – 3 Lakh (total)", "Hands-on computing degree covering programming, databases, web development and software engineering.", ["Software Developer", "Web Developer", "MCA", "IT Support & QA"], True),
    c("course-bca-aiml", "BCA Artificial Intelligence & Machine Learning", CSIT, UG, "3 Years", "10+2 any stream (Maths preferred)", "₹2 – 4 Lakh (total)", "BCA with an AI-ML specialisation: Python, machine learning, neural networks and applied AI projects.", ["ML Developer", "AI Associate", "Data Analyst", "MCA (AI)"], True),
    c("course-bca-ds", "BCA Data Science", CSIT, UG, "3 Years", "10+2 any stream (Maths preferred)", "₹2 – 4 Lakh (total)", "Data-focused BCA covering Python, SQL, statistics, visualisation and business intelligence tooling.", ["Data Analyst", "BI Analyst", "Reporting Specialist"], False),
    c("course-bsc-it", "B.Sc Information Technology (IT)", CSIT, UG, "3 Years", "10+2 with Maths / Computer Science", "₹1 – 2.2 Lakh (total)", "Science-track IT degree covering programming, networking, operating systems and web technologies.", ["IT Executive", "Support Engineer", "M.Sc IT / MCA"], False),
    c("course-bsc-cs", "B.Sc Computer Science", CSIT, UG, "3 Years", "10+2 with Maths / Computer Science", "₹1 – 2.2 Lakh (total)", "Computing degree strong in algorithms, mathematics and systems fundamentals.", ["Developer", "IT Analyst", "M.Sc / MCA"], False),
    c("course-mca", "MCA (Master of Computer Applications)", CSIT, PG, "2 Years", "BCA / B.Sc CS or graduation with Mathematics", "₹1.2 – 2.8 Lakh (total)", "Advanced computing masters with specialisations in AI-ML, full-stack development and data engineering.", ["Software Engineer", "Data Analyst", "System Architect"], False),
    # ── Commerce ─────────────────────────────────────────────────────────────
    c("course-bcom", "B.Com (Bachelor of Commerce)", COMM, UG, "3 Years", "10+2 Commerce preferred — min 45%", "₹0.6 – 1.5 Lakh (total)", "Core commerce degree covering accounting, business law, economics and taxation.", ["Accountant", "Banking Exams", "M.Com / MBA"], True),
    c("course-bcom-hons", "B.Com (Hons)", COMM, UG, "3 Years", "10+2 Commerce — min 50%", "₹0.8 – 1.8 Lakh (total)", "Honours commerce degree with deeper specialisation in accounting, auditing and financial management.", ["Accountant", "CA / CS Preparation", "Banking & Finance"], True),
    c("course-bcom-finance", "B.Com Finance", COMM, UG, "3 Years", "10+2 Commerce — min 45%", "₹1 – 2.2 Lakh (total)", "Finance-oriented commerce degree covering capital markets, financial analysis and corporate finance.", ["Financial Analyst", "Banking & Insurance", "MBA Finance"], False),
    c("course-ca", "CA (Chartered Accountancy)", COMM, "Professional", "4 – 5 Years", "10+2 any stream (CA Foundation route)", "₹1 – 2.5 Lakh (total, ICAI + coaching)", "India's premier accounting qualification via ICAI — Foundation, Intermediate, articleship and Final.", ["Chartered Accountant", "Audit & Taxation", "CFO Track", "Own Practice"], True),
    c("course-cs", "CS (Company Secretary)", COMM, "Professional", "3 – 4 Years", "10+2 any stream (CSEET route)", "₹0.8 – 1.8 Lakh (total, ICSI + coaching)", "ICSI qualification in corporate law, governance and compliance for company secretarial roles.", ["Company Secretary", "Legal & Compliance", "Corporate Governance"], False),
    c("course-cma", "CMA (Cost & Management Accountancy)", COMM, "Professional", "3 – 4 Years", "10+2 any stream (CMA Foundation route)", "₹0.8 – 1.8 Lakh (total, ICMAI + coaching)", "ICMAI qualification specialising in cost accounting, budgeting and management control systems.", ["Cost Accountant", "Finance Manager", "Industry Costing Roles"], False),
    # ── Science ──────────────────────────────────────────────────────────────
    c("course-bsc-physics", "B.Sc Physics", SCI, UG, "3 Years", f"{PCM}", "₹0.6 – 1.6 Lakh (total)", "Pure-science degree in mechanics, electromagnetism, quantum and modern physics with lab work.", ["M.Sc / Research", "Teaching", "Technical Analyst", "Govt Science Exams"], False),
    c("course-bsc-chem", "B.Sc Chemistry", SCI, UG, "3 Years", "10+2 with Chemistry (PCM / PCB)", "₹0.6 – 1.6 Lakh (total)", "Organic, inorganic, physical and analytical chemistry with extensive laboratory practice.", ["Lab Chemist", "Pharma / FMCG QC", "M.Sc", "Teaching"], False),
    c("course-bsc-maths", "B.Sc Mathematics", SCI, UG, "3 Years", "10+2 with Mathematics", "₹0.6 – 1.6 Lakh (total)", "Rigorous mathematics degree in algebra, calculus, statistics and numerical methods.", ["Data / Actuarial Roles", "Banking Exams", "M.Sc", "Teaching"], False),
    c("course-bsc-biotech", "B.Sc Biotechnology", SCI, UG, "3 Years", f"{PCB}", "₹1 – 2.4 Lakh (total)", "Applied life-science degree covering molecular biology, genetics, microbiology and bioprocessing.", ["Biotech Labs", "Pharma Industry", "M.Sc Biotech", "Research"], False),
    c("course-bsc-micro", "B.Sc Microbiology", SCI, UG, "3 Years", f"{PCB}", "₹1 – 2.4 Lakh (total)", "Study of microorganisms with applications in healthcare, food safety, pharma and diagnostics.", ["Microbiologist", "Diagnostics Lab", "Food & Pharma QC", "M.Sc"], False),
    # ── Agriculture ──────────────────────────────────────────────────────────
    c("course-bsc-agri", "B.Sc Agriculture", AGRI, UG, "4 Years", "10+2 with PCB / PCM / Agriculture", "₹1.2 – 2.8 Lakh (total)", "Applied agriculture science covering agronomy, soil science, horticulture and agri-business.", ["Agriculture Officer", "IBPS SO (Agri)", "Agri-business", "M.Sc Agri"], True),
    c("course-bsc-horti", "B.Sc Horticulture", AGRI, UG, "4 Years", "10+2 with PCB / PCM / Agriculture", "₹1 – 2.2 Lakh (total)", "Specialised degree in fruit, vegetable, flower and plantation crop production technology.", ["Horticulture Officer", "Landscape Industry", "Agri-startups"], False),
    c("course-bsc-forestry", "B.Sc Forestry", AGRI, UG, "4 Years", "10+2 with PCB / PCM / Agriculture", "₹1 – 2.2 Lakh (total)", "Forest management, silviculture, wildlife and agroforestry with field-based training.", ["Forest Officer", "Range Officer", "Environment NGOs", "M.Sc Forestry"], False),
    c("course-bfsc", "B.Sc Fisheries Science", AGRI, UG, "4 Years", f"{PCB}", "₹1 – 2.2 Lakh (total)", "Aquaculture, fish biology, fish processing and fishery resource management.", ["Fisheries Officer", "Aquaculture Business", "Seafood Industry"], False),
    # ── Medical / Healthcare ─────────────────────────────────────────────────
    c("course-mbbs", "MBBS", MED, UG, "5.5 Years (incl. internship)", f"{PCB} with NEET-UG qualification", "₹5 Lakh – 1 Crore (total, varies by college)", "India's primary medical degree — admission strictly through NEET-UG and state/central counselling.", ["Doctor (MO)", "MD / MS", "Own Clinic", "Govt Health Services"], True),
    c("course-bds", "BDS (Bachelor of Dental Surgery)", MED, UG, "5 Years (incl. internship)", f"{PCB} with NEET-UG qualification", "₹3 – 25 Lakh (total)", "Dental surgery degree with clinical rotations and registration as a dental practitioner.", ["Dentist", "MDS", "Own Dental Clinic"], False),
    c("course-bams", "BAMS (Ayurvedic Medicine & Surgery)", MED, UG, "5.5 Years", f"{PCB} with NEET-UG qualification", "₹2 – 6 Lakh (total)", "AYUSH-recognised ayurvedic medicine degree with internship and doctor registration pathway.", ["Ayurvedic Doctor", "Wellness Industry", "Govt AYUSH Dispensaries"], False),
    c("course-bhms", "BHMS (Homoeopathic Medicine & Surgery)", MED, UG, "5.5 Years", f"{PCB} with NEET-UG qualification", "₹2 – 5 Lakh (total)", "Homoeopathy degree under AYUSH with clinical training and practitioner registration.", ["Homoeopathic Doctor", "Own Practice", "Govt AYUSH Roles"], False),
    c("course-bpharm", "B.Pharm (Bachelor of Pharmacy)", MED, UG, "4 Years", "10+2 with PCB / PCM", "₹1.5 – 4 Lakh (total)", "Pharmaceutical science degree with lab practice, drug regulation studies and industry internships.", ["Pharmacist", "Pharma Companies", "Drug Inspector Prep"], True),
    c("course-bsc-nursing", "B.Sc Nursing", MED, UG, "4 Years", f"{PCB} — min 45%", "₹2 – 5 Lakh (total)", "Clinical nursing degree with hospital rotations, registered-nurse licensing and overseas mobility.", ["Staff Nurse (Govt/Private)", "Abroad Placements", "M.Sc Nursing"], True),
    c("course-bpt", "BPT (Bachelor of Physiotherapy)", MED, UG, "4.5 Years", f"{PCB}", "₹2 – 4 Lakh (total)", "Rehabilitation science with clinical postings in ortho, neuro and sports physiotherapy.", ["Physiotherapist", "Sports Rehab", "Own Clinic"], False),
    c("course-bmlt", "BMLT (Medical Laboratory Technology)", MED, UG, "3 – 4 Years", f"{PCB}", "₹1.2 – 3 Lakh (total)", "Diagnostic lab science covering pathology, biochemistry, microbiology and blood banking.", ["Lab Technologist", "Diagnostic Centres", "Hospital Labs"], True),
    c("course-bsc-radiology", "B.Sc Radiology & Imaging Technology", MED, UG, "3 – 4 Years", f"{PCB}", "₹1.5 – 3.5 Lakh (total)", "Medical imaging training in X-ray, CT, MRI and ultrasound technology.", ["Radiology Technologist", "Imaging Centres", "Hospital Roles"], False),
    c("course-bsc-optometry", "B.Sc Optometry", MED, UG, "3 – 4 Years", f"{PCB}", "₹1.5 – 3.5 Lakh (total)", "Eye-care science covering vision testing, contact lenses and ophthalmic diagnostics.", ["Optometrist", "Eye Hospitals", "Optical Retail", "Own Practice"], False),
    # ── Law ──────────────────────────────────────────────────────────────────
    c("course-ba-llb", "BA LL.B (Integrated)", LAW, UG, "5 Years", "10+2 any stream — min 45% (CLAT preferred)", "₹2 – 5 Lakh (total)", "Integrated arts-and-law honours programme with moot courts, internships and bar-council recognition.", ["Advocate", "Judicial Services", "Corporate Counsel"], True),
    c("course-bba-llb", "BBA LL.B (Integrated)", LAW, UG, "5 Years", "10+2 any stream — min 45%", "₹2.5 – 6 Lakh (total)", "Business-and-law integrated degree aimed at corporate, commercial and compliance practice.", ["Corporate Lawyer", "Legal Advisor", "Compliance Roles"], False),
    c("course-bcom-llb", "B.Com LL.B (Integrated)", LAW, UG, "5 Years", "10+2 Commerce preferred — min 45%", "₹2.5 – 5.5 Lakh (total)", "Commerce-and-law integrated degree strong in taxation, company law and financial regulation.", ["Tax Lawyer", "Company Secretary Track", "Corporate Legal"], False),
    c("course-llb", "LL.B (3-Year)", LAW, UG, "3 Years", "Graduation in any stream", "₹1.2 – 3 Lakh (total)", "Classic three-year law degree for graduates entering litigation or corporate legal practice.", ["Advocate", "Legal Advisor", "Judicial Exams"], False),
    # ── Arts / Humanities ────────────────────────────────────────────────────
    c("course-ba", "BA (Bachelor of Arts)", ARTS, UG, "3 Years", ANY12, "₹0.4 – 1.2 Lakh (total)", "Flexible humanities degree with subject combinations across languages, social sciences and history.", ["Govt Exams (UPSC/SSC)", "Teaching", "MA", "Media & NGOs"], False),
    c("course-ba-psychology", "BA (Hons) Psychology", ARTS, UG, "3 Years", ANY12, "₹0.9 – 2 Lakh (total)", "Psychology honours with labs, psychometric testing practice and counselling exposure.", ["Counsellor", "HR Roles", "MA Psychology", "Clinical Track"], True),
    c("course-ba-economics", "BA (Hons) Economics", ARTS, UG, "3 Years", "10+2 any stream (Maths preferred)", "₹0.9 – 2.2 Lakh (total)", "Analytical economics degree covering micro, macro, econometrics and development economics.", ["Economic Analyst", "Banking & Policy", "MA Economics", "RBI / UPSC"], False),
    c("course-ba-polsci", "BA (Hons) Political Science", ARTS, UG, "3 Years", ANY12, "₹0.5 – 1.4 Lakh (total)", "Political theory, Indian government, international relations and public administration.", ["UPSC / State PCS", "Policy Research", "MA", "Journalism"], False),
    c("course-ba-english", "BA (Hons) English", ARTS, UG, "3 Years", ANY12, "₹0.5 – 1.4 Lakh (total)", "English literature and language studies with criticism, linguistics and communication skills.", ["Teaching", "Content Writer", "Editing & Publishing", "MA English"], False),
    c("course-ba-sociology", "BA (Hons) Sociology", ARTS, UG, "3 Years", ANY12, "₹0.5 – 1.4 Lakh (total)", "Study of society, social institutions, research methods and contemporary social issues.", ["Social Worker", "NGO / CSR", "UPSC", "MA Sociology"], False),
    c("course-ba-history", "BA (Hons) History", ARTS, UG, "3 Years", ANY12, "₹0.5 – 1.4 Lakh (total)", "Ancient, medieval and modern history with historiography and archival methods.", ["UPSC / State PCS", "Teaching", "Archaeology & Museums", "MA History"], False),
    # ── Hospitality ──────────────────────────────────────────────────────────
    c("course-bhm", "BHM (Bachelor of Hotel Management)", HOSP, UG, "4 Years", ANY12, "₹2 – 4 Lakh (total)", "Hospitality degree with kitchen labs, front-office training and industry internships.", ["Hotels & Resorts", "Airlines & Cruise", "Event Management"], True),
    c("course-dip-hotel", "Diploma in Hotel Management", HOSP, DIP, "1 – 2 Years", "10th / 10+2 pass", "₹0.6 – 1.5 Lakh (total)", "Short practical hospitality programme covering food production, service and housekeeping.", ["Hotel Operations", "Restaurant Supervisor", "Cruise Lines"], False),
    c("course-bttm", "BTTM (Travel & Tourism Management)", HOSP, UG, "3 Years", ANY12, "₹1.2 – 2.8 Lakh (total)", "Tourism business degree covering travel operations, ticketing, destinations and tour management.", ["Travel Consultant", "Tour Operator", "Airlines Ground Staff"], False),
    # ── Design / Media ───────────────────────────────────────────────────────
    c("course-bdes", "B.Des (Bachelor of Design)", DSGN, UG, "4 Years", "10+2 any stream (design aptitude test)", "₹3 – 8 Lakh (total)", "Professional design degree with studio practice across product, UI/UX and communication design.", ["UI/UX Designer", "Product Designer", "Design Studios", "M.Des"], True),
    c("course-fashion-design", "B.Sc / B.Des Fashion Design", DSGN, UG, "3 – 4 Years", ANY12, "₹1.8 – 5 Lakh (total)", "Garment construction, textiles, illustration, draping and fashion collection development.", ["Fashion Designer", "Apparel Industry", "Stylist", "Own Label"], False),
    c("course-graphic-design", "B.Des / B.Sc Graphic Design", DSGN, UG, "3 – 4 Years", ANY12, "₹1.8 – 4.5 Lakh (total)", "Visual communication, typography, branding and digital design-tool mastery.", ["Graphic Designer", "Brand Studios", "Freelance", "Art Director"], False),
    c("course-animation", "B.Sc Animation & VFX", DSGN, UG, "3 Years", ANY12, "₹1.8 – 4.5 Lakh (total)", "2D/3D animation, modelling, rigging, compositing and visual-effects pipelines.", ["Animator", "VFX Artist", "Game Studios", "Film & OTT"], False),
    c("course-bjmc", "BJMC (Journalism & Mass Communication)", DSGN, UG, "3 Years", ANY12, "₹1 – 2.2 Lakh (total)", "Media degree spanning reporting, broadcast production, PR and digital content.", ["Journalist", "PR Executive", "Content & Social Media", "Anchor"], True),
    # ── Architecture ─────────────────────────────────────────────────────────
    c("course-barch", "B.Arch (Bachelor of Architecture)", ARCH, UG, "5 Years", f"{PCM} with NATA / JEE Main Paper-2", "₹2.5 – 5 Lakh (total)", "Council-approved architecture degree combining design studios, construction technology and practical training.", ["Architect", "Urban Planner", "Design Consultant", "M.Arch"], True),
    c("course-interior-design", "B.Des / B.Sc Interior Design", ARCH, UG, "3 – 4 Years", ANY12, "₹1.5 – 4 Lakh (total)", "Spatial design, furniture, lighting, materials and 3D visualisation for interiors.", ["Interior Designer", "Design Firms", "Own Studio", "Site Consultant"], False),
    # ── Education ────────────────────────────────────────────────────────────
    c("course-ba-bed", "Integrated BA-B.Ed", EDU, UG, "4 Years", "10+2 any stream — min 50%", "₹1 – 2.4 Lakh (total)", "NCTE four-year integrated degree producing graduate-plus-trained-teacher in one programme.", ["School Teacher (TGT)", "CTET / TET", "Govt Teaching Exams"], True),
    c("course-bsc-bed", "Integrated B.Sc-B.Ed", EDU, UG, "4 Years", "10+2 Science — min 50%", "₹1.2 – 2.6 Lakh (total)", "Integrated science-and-education degree for science and maths school teaching.", ["Science Teacher (TGT/PGT)", "CTET / TET", "Govt Teaching Exams"], False),
    c("course-bed", "B.Ed (Bachelor of Education)", EDU, PG, "2 Years", "Graduation with min 50%", "₹0.6 – 1.5 Lakh (total)", "NCTE-recognised teacher-training degree with school teaching practice.", ["TGT / PGT Teacher", "CTET / TET Prep", "Edu-trainer"], False),
    c("course-deled", "D.El.Ed (Elementary Education)", EDU, DIP, "2 Years", "10+2 with min 50%", "₹0.5 – 1.2 Lakh (total)", "Elementary teacher preparation diploma for primary-school teaching careers.", ["Primary Teacher", "Govt Teacher Exams"], False),
    # ── Diploma / Vocational ─────────────────────────────────────────────────
    c("course-polytechnic", "Diploma in Engineering (Polytechnic)", VOC, DIP, "3 Years", "10th pass from any recognised board", "₹0.6 – 1.5 Lakh (total)", "Job-oriented technical diploma with direct lateral-entry pathway into the 2nd year of B.Tech.", ["Junior Engineer", "Lateral Entry to B.Tech", "Supervisor Roles"], True),
    c("course-dip-paramedical", "Diploma in Paramedical Sciences", VOC, DIP, "2 – 3 Years", "10+2 with PCB (some courses 10th pass)", "₹0.6 – 1.8 Lakh (total)", "Short healthcare-support qualifications across OT, dialysis, radiology and emergency care.", ["OT / Dialysis Technician", "Hospital Support Roles", "B.Sc Lateral Entry"], True),
    c("course-dip-computer", "Diploma in Computer / IT Applications", VOC, DIP, "1 – 3 Years", "10th / 10+2 pass", "₹0.3 – 1.2 Lakh (total)", "Practical computing diploma covering office tools, programming basics, networking and web skills.", ["IT Support", "Data Entry / Operator", "Junior Developer", "BCA Pathway"], False),
    c("course-dmlt", "DMLT (Medical Lab Technology Diploma)", VOC, DIP, "2 Years", "10+2 with PCB", "₹0.6 – 1.6 Lakh (total)", "Diagnostic laboratory diploma in pathology, haematology and clinical biochemistry testing.", ["Lab Technician", "Diagnostic Centres", "BMLT Lateral Entry"], True),
    c("course-dpharma", "D.Pharma (Diploma in Pharmacy)", VOC, DIP, "2 Years", "10+2 with PCB / PCM", "₹0.8 – 1.8 Lakh (total)", "Quick-entry pharmacy diploma leading to registration as a licensed pharmacist.", ["Registered Pharmacist", "Medical Store", "Lateral B.Pharm"], True),
    c("course-anm", "ANM (Auxiliary Nursing & Midwifery)", VOC, DIP, "2 Years", "10+2 any stream — min 40%", "₹0.8 – 1.6 Lakh (total)", "Entry-level nursing diploma focused on maternal and community health services.", ["Auxiliary Nurse", "Health Worker (Govt)", "Clinic Roles"], False),
    c("course-gnm", "GNM (General Nursing & Midwifery)", VOC, DIP, "3 Years + 6 Months Internship", "10+2 any stream (PCB preferred)", "₹1.2 – 2.5 Lakh (total)", "Diploma in general nursing and midwifery with intensive hospital-based clinical training.", ["Registered Nurse", "Hospital Nursing Roles", "Community Health"], True),
]

COLLEGES: list[dict] = [
    dict(id="col-galgotias", name="Galgotias University", city="Greater Noida", state="Uttar Pradesh", type="Private", streams=[ENGG, CSIT, MGMT, LAW], rating=4.3, fee_range="₹1.6 – 3.2 Lakh / year", description="NAAC A+ campus near Delhi with strong placement support across engineering, management and law programmes.", featured=True),
    dict(id="col-amity-noida", name="Amity University", city="Noida", state="Uttar Pradesh", type="Private", streams=[ENGG, MGMT, LAW, MED], rating=4.5, fee_range="₹2.8 – 4.5 Lakh / year", description="One of India's most recognised private universities with 400+ programmes and a global alumni network.", featured=True),
    dict(id="col-sharda", name="Sharda University", city="Greater Noida", state="Uttar Pradesh", type="Private", streams=[ENGG, MGMT, MED, CSIT], rating=4.2, fee_range="₹1.8 – 3.6 Lakh / year", description="Multi-disciplinary university with 270+ programmes, an on-campus hospital and students from 95+ countries.", featured=True),
    dict(id="col-srm-sonepat", name="SRM University Delhi-NCR", city="Sonepat", state="Haryana", type="Private", streams=[ENGG, CSIT, MGMT, MED], rating=4.3, fee_range="₹2 – 3.5 Lakh / year", description="SRM's Delhi-NCR campus with modern labs, industry tie-ups and a dedicated placement cell.", featured=True),
    dict(id="col-lpu", name="Lovely Professional University", city="Phagwara", state="Punjab", type="Private", streams=[ENGG, MGMT, CSIT, DSGN], rating=4.4, fee_range="₹1.2 – 3.2 Lakh / year", description="India's largest private university with 600+ programmes, top-class sports facilities and massive placement drives.", featured=True),
    dict(id="col-cu-mohali", name="Chandigarh University", city="Mohali", state="Punjab", type="Private", streams=[ENGG, CSIT, MGMT, MED], rating=4.4, fee_range="₹1.5 – 3 Lakh / year", description="NAAC A+ university known for engineering excellence, record recruitment numbers and innovation labs.", featured=True),
    dict(id="col-upes", name="UPES Dehradun", city="Dehradun", state="Uttarakhand", type="Private", streams=[ENGG, MGMT, LAW, DSGN], rating=4.3, fee_range="₹2.5 – 4.5 Lakh / year", description="Domain-focused university with specialised programmes in energy, design, law and applied engineering.", featured=False),
    dict(id="col-graphic-era", name="Graphic Era University", city="Dehradun", state="Uttarakhand", type="Private (Deemed)", streams=[ENGG, CSIT, MGMT, MED], rating=4.2, fee_range="₹1.4 – 2.8 Lakh / year", description="Deemed university with consistent placement records and strong computer science departments.", featured=False),
    dict(id="col-manipal-jaipur", name="Manipal University Jaipur", city="Jaipur", state="Rajasthan", type="Private", streams=[ENGG, CSIT, MGMT, DSGN], rating=4.4, fee_range="₹2 – 4 Lakh / year", description="Modern Manipal campus with emerging-tech programmes, creative studios and strong industry mentorship.", featured=False),
    dict(id="col-sgt", name="SGT University", city="Gurugram", state="Haryana", type="Private", streams=[MED, LAW, VOC, SCI], rating=4.1, fee_range="₹1.8 – 4 Lakh / year", description="Health-sciences focused university with a teaching hospital, nursing labs and pharmacy practice wings.", featured=False),
    dict(id="col-christ", name="Christ University", city="Bengaluru", state="Karnataka", type="Private (Deemed)", streams=[MGMT, LAW, ARTS, CSIT], rating=4.6, fee_range="₹1.8 – 3.5 Lakh / year", description="Premier deemed university celebrated for academic rigour, discipline and holistic campus life.", featured=False),
    dict(id="col-jain", name="Jain University", city="Bengaluru", state="Karnataka", type="Private (Deemed)", streams=[MGMT, CSIT, ENGG, DSGN], rating=4.3, fee_range="₹2 – 4 Lakh / year", description="Deemed-to-be university with an entrepreneurial culture, sports scholars and industry-curated programmes.", featured=False),
    dict(id="col-parul", name="Parul University", city="Vadodara", state="Gujarat", type="Private", streams=[ENGG, MED, MGMT, VOC], rating=4.2, fee_range="₹1 – 2.4 Lakh / year", description="Fast-growing multi-faculty university with 250+ programmes and students from 60+ countries.", featured=False),
    dict(id="col-sandip", name="Sandip University", city="Nashik", state="Maharashtra", type="Private", streams=[ENGG, CSIT, LAW, EDU], rating=4.0, fee_range="₹1 – 2.2 Lakh / year", description="250-acre campus university offering affordable professional programmes with hands-on industry training.", featured=False),
    dict(id="col-shobhit", name="Shobhit University", city="Meerut", state="Uttar Pradesh", type="Private (Deemed)", streams=[AGRI, CSIT, EDU, SCI], rating=4.0, fee_range="₹0.9 – 2 Lakh / year", description="Deemed university with recognised regular programmes across agriculture, pharmacy and education.", featured=False),
    dict(id="col-mangalayatan", name="Mangalayatan University", city="Aligarh", state="Uttar Pradesh", type="Private", streams=[ENGG, MGMT, LAW, EDU], rating=3.9, fee_range="₹0.9 – 2 Lakh / year", description="Peaceful residential campus with professional courses, hostel facilities and scholarship options.", featured=False),
    dict(id="col-niu", name="Noida International University", city="Greater Noida", state="Uttar Pradesh", type="Private", streams=[ENGG, LAW, MGMT, MED], rating=3.9, fee_range="₹1 – 2.2 Lakh / year", description="UGC-recognised university in the Delhi-NCR education hub with moot courts and simulation labs.", featured=False),
    dict(id="col-tmu", name="Teerthanker Mahaveer University", city="Moradabad", state="Uttar Pradesh", type="Private", streams=[MED, VOC, ENGG, EDU], rating=4.0, fee_range="₹1 – 2.3 Lakh / year", description="Known for nursing, paramedical and teacher-education programmes with hospital-linked training.", featured=False),
    dict(id="col-amity-patna", name="Amity University Patna", city="Patna", state="Bihar", type="Private", streams=[MGMT, CSIT, LAW, DSGN], rating=4.0, fee_range="₹1.2 – 2.5 Lakh / year", description="Amity's Bihar campus bringing the group's academic standards closer to home for Bihar students.", featured=False),
    dict(id="col-patna-univ", name="Patna University", city="Patna", state="Bihar", type="Government", streams=[MGMT, LAW, ARTS, EDU], rating=4.0, fee_range="₹0.3 – 0.8 Lakh / year", description="One of India's oldest universities (est. 1917) offering highly affordable, recognised degree programmes.", featured=False),
    dict(id="col-bits-pilani", name="BITS Pilani", city="Pilani", state="Rajasthan", type="Private (Deemed)", streams=[ENGG, CSIT, SCI, MGMT], rating=4.8, fee_range="₹5 – 6.5 Lakh / year", description="India's most prestigious private engineering institute, admission through BITSAT, with outstanding placement records.", featured=True),
    dict(id="col-mahe-manipal", name="Manipal Academy of Higher Education (MAHE)", city="Manipal", state="Karnataka", type="Private (Deemed)", streams=[MED, ENGG, MGMT, DSGN], rating=4.7, fee_range="₹4 – 8 Lakh / year", description="Institution of Eminence renowned for medicine, nursing, engineering and allied health sciences.", featured=True),
    dict(id="col-vit-vellore", name="VIT Vellore", city="Vellore", state="Tamil Nadu", type="Private (Deemed)", streams=[ENGG, CSIT, MGMT, LAW], rating=4.6, fee_range="₹2 – 4.5 Lakh / year", description="Top-ranked private engineering university, admission via VITEEE, with very strong campus recruitment.", featured=True),
    dict(id="col-srm-chennai", name="SRM Institute of Science & Technology", city="Chennai", state="Tamil Nadu", type="Private (Deemed)", streams=[ENGG, MED, MGMT, LAW], rating=4.5, fee_range="₹2.5 – 5 Lakh / year", description="Flagship SRM campus at Kattankulathur with world-class labs and large multinational recruitment drives.", featured=True),
    dict(id="col-shiv-nadar", name="Shiv Nadar University", city="Greater Noida", state="Uttar Pradesh", type="Private", streams=[ENGG, ARTS, MGMT, CSIT], rating=4.5, fee_range="₹4 – 6 Lakh / year", description="Research-intensive liberal-tech university with small class sizes and generous merit scholarships.", featured=False),
    dict(id="col-op-jindal", name="O.P. Jindal Global University", city="Sonipat", state="Haryana", type="Private", streams=[LAW, MGMT, ARTS], rating=4.6, fee_range="₹5 – 8 Lakh / year", description="India's leading private law university (JGLS), globally ranked, with international faculty and exchange programmes.", featured=True),
    dict(id="col-ashoka", name="Ashoka University", city="Sonipat", state="Haryana", type="Private", streams=[ARTS, MGMT, CSIT], rating=4.6, fee_range="₹7 – 10 Lakh / year", description="India's premier liberal-arts university with need-blind admission and substantial financial aid.", featured=False),
    dict(id="col-amrita", name="Amrita Vishwa Vidyapeetham", city="Coimbatore", state="Tamil Nadu", type="Private (Deemed)", streams=[ENGG, MED, MGMT, SCI], rating=4.5, fee_range="₹2.5 – 5 Lakh / year", description="NAAC A++ multi-campus university strong across engineering, medicine and allied health sciences.", featured=False),
    dict(id="col-thapar", name="Thapar Institute of Engineering & Technology", city="Patiala", state="Punjab", type="Private (Deemed)", streams=[ENGG, CSIT, MGMT], rating=4.5, fee_range="₹3.5 – 4.5 Lakh / year", description="Long-established engineering institute with excellent core-branch teaching and placement support.", featured=False),
    dict(id="col-symbiosis", name="Symbiosis International University", city="Pune", state="Maharashtra", type="Private (Deemed)", streams=[MGMT, LAW, CSIT, DSGN], rating=4.6, fee_range="₹3.5 – 7 Lakh / year", description="Renowned for management and law programmes, admission via SET/SNAP, with strong corporate placements.", featured=True),
    dict(id="col-kiit", name="KIIT University", city="Bhubaneswar", state="Odisha", type="Private (Deemed)", streams=[ENGG, MED, MGMT, LAW], rating=4.4, fee_range="₹2 – 4 Lakh / year", description="Large modern campus with KIITEE-based admission and consistently high recruiter participation.", featured=False),
    dict(id="col-chitkara", name="Chitkara University", city="Rajpura", state="Punjab", type="Private", streams=[ENGG, CSIT, MGMT, MED], rating=4.3, fee_range="₹1.8 – 3.2 Lakh / year", description="Industry-partnered university known for placement-focused engineering and healthcare programmes.", featured=False),
    dict(id="col-shoolini", name="Shoolini University", city="Solan", state="Himachal Pradesh", type="Private", streams=[MED, ENGG, MGMT, AGRI], rating=4.2, fee_range="₹1.8 – 3.5 Lakh / year", description="Research-ranked private university in the Himalayan foothills, strong in pharmacy and biotechnology.", featured=False),
    dict(id="col-nmims", name="NMIMS", city="Mumbai", state="Maharashtra", type="Private (Deemed)", streams=[MGMT, ENGG, MED, LAW], rating=4.5, fee_range="₹3 – 7 Lakh / year", description="Top Mumbai deemed university, especially respected for its business school and pharmacy faculty.", featured=False),
    dict(id="col-alliance", name="Alliance University", city="Bengaluru", state="Karnataka", type="Private", streams=[MGMT, ENGG, LAW, ARTS], rating=4.2, fee_range="₹2.5 – 5 Lakh / year", description="Bengaluru business-focused university with AACSB-track management programmes and corporate mentoring.", featured=False),
    dict(id="col-bennett", name="Bennett University", city="Greater Noida", state="Uttar Pradesh", type="Private", streams=[ENGG, CSIT, MGMT, LAW], rating=4.4, fee_range="₹3.5 – 5 Lakh / year", description="Times Group university with modern CS specialisations, strong faculty and industry-linked projects.", featured=False),
    dict(id="col-niit-univ", name="NIIT University", city="Neemrana", state="Rajasthan", type="Private", streams=[CSIT, ENGG, MGMT], rating=4.2, fee_range="₹3 – 4.5 Lakh / year", description="Industry-linked technology university with mandatory internships built into every programme.", featured=False),
    dict(id="col-sastra", name="SASTRA Deemed University", city="Thanjavur", state="Tamil Nadu", type="Private (Deemed)", streams=[ENGG, MGMT, LAW, CSIT], rating=4.3, fee_range="₹1.5 – 3 Lakh / year", description="Affordable, academically rigorous deemed university with excellent core engineering outcomes.", featured=False),
    dict(id="col-kalinga", name="Kalinga University", city="Raipur", state="Chhattisgarh", type="Private", streams=[ENGG, MGMT, CSIT, EDU], rating=3.9, fee_range="₹0.8 – 1.8 Lakh / year", description="Budget-friendly private university in central India with a wide range of professional programmes.", featured=False),
    dict(id="col-manav-rachna", name="Manav Rachna International Institute", city="Faridabad", state="Haryana", type="Private (Deemed)", streams=[ENGG, CSIT, MGMT, MED], rating=4.1, fee_range="₹1.8 – 3.5 Lakh / year", description="Delhi-NCR deemed institute with strong industry tie-ups and sports-scholarship opportunities.", featured=False),
    dict(id="col-bml-munjal", name="BML Munjal University", city="Gurugram", state="Haryana", type="Private", streams=[ENGG, MGMT, LAW, CSIT], rating=4.2, fee_range="₹3 – 4.5 Lakh / year", description="Hero Group university with an Imperial College academic partnership and small-batch teaching.", featured=False),
    dict(id="col-pes", name="PES University", city="Bengaluru", state="Karnataka", type="Private", streams=[ENGG, CSIT, MGMT], rating=4.4, fee_range="₹3.5 – 5 Lakh / year", description="Highly regarded Bengaluru engineering university with excellent CS placements in product companies.", featured=False),
    dict(id="col-reva", name="REVA University", city="Bengaluru", state="Karnataka", type="Private", streams=[ENGG, CSIT, MGMT, LAW], rating=4.1, fee_range="₹2 – 3.5 Lakh / year", description="Large green campus in north Bengaluru offering a broad spread of professional degrees.", featured=False),
    dict(id="col-presidency-blr", name="Presidency University", city="Bengaluru", state="Karnataka", type="Private", streams=[ENGG, MGMT, CSIT, LAW], rating=4.0, fee_range="₹2 – 3.5 Lakh / year", description="Bengaluru university with industry-aligned curricula and an active placement cell.", featured=False),
    dict(id="col-jaypee-juit", name="Jaypee University of Information Technology", city="Waknaghat", state="Himachal Pradesh", type="Private", streams=[ENGG, CSIT], rating=4.2, fee_range="₹2 – 3.2 Lakh / year", description="Focused IT and engineering university on a scenic hill campus with solid core-CS teaching.", featured=False),
    dict(id="col-geu-hill", name="Graphic Era Hill University", city="Dehradun", state="Uttarakhand", type="Private", streams=[ENGG, CSIT, MGMT, MED], rating=4.0, fee_range="₹1.2 – 2.4 Lakh / year", description="Graphic Era's hill-state university with affordable professional programmes across Uttarakhand campuses.", featured=False),
    dict(id="col-quantum", name="Quantum University", city="Roorkee", state="Uttarakhand", type="Private", streams=[ENGG, CSIT, MGMT, VOC], rating=3.9, fee_range="₹1 – 2.2 Lakh / year", description="Skill-first university near Roorkee with practical training and placement assistance.", featured=False),
    dict(id="col-tulas", name="Tula's Institute", city="Dehradun", state="Uttarakhand", type="Private", streams=[ENGG, CSIT, MGMT], rating=3.9, fee_range="₹1 – 2 Lakh / year", description="Dehradun institute known for disciplined campus life, hostels and placement-oriented training.", featured=False),
    dict(id="col-ims-unison", name="IMS Unison University", city="Dehradun", state="Uttarakhand", type="Private", streams=[MGMT, LAW, DSGN, CSIT], rating=4.0, fee_range="₹1.2 – 2.6 Lakh / year", description="Established Dehradun university respected for management, law and mass-communication programmes.", featured=False),
    dict(id="col-kr-mangalam", name="K.R. Mangalam University", city="Gurugram", state="Haryana", type="Private", streams=[ENGG, MGMT, LAW, MED], rating=4.0, fee_range="₹1.8 – 3.2 Lakh / year", description="Gurugram university with a wide programme mix and growing recruiter base in Delhi-NCR.", featured=False),
    dict(id="col-geeta", name="Geeta University", city="Panipat", state="Haryana", type="Private", streams=[ENGG, CSIT, MGMT, MED], rating=3.9, fee_range="₹1 – 2.2 Lakh / year", description="Affordable Haryana university offering engineering, pharmacy and management with hostel facilities.", featured=False),
    dict(id="col-mmu", name="Maharishi Markandeshwar University", city="Ambala", state="Haryana", type="Private (Deemed)", streams=[MED, VOC, ENGG, SCI], rating=4.1, fee_range="₹1.5 – 4 Lakh / year", description="Health-sciences deemed university with its own medical college, dental wing and teaching hospital.", featured=False),
    dict(id="col-jecrc", name="JECRC University", city="Jaipur", state="Rajasthan", type="Private", streams=[ENGG, CSIT, MGMT, LAW], rating=4.1, fee_range="₹1.5 – 3 Lakh / year", description="Jaipur university with a strong startup-and-innovation culture and active placement drives.", featured=False),
    dict(id="col-poornima", name="Poornima University", city="Jaipur", state="Rajasthan", type="Private", streams=[ENGG, CSIT, MGMT, DSGN], rating=4.0, fee_range="₹1.2 – 2.6 Lakh / year", description="Jaipur institution focused on employability training, design and applied engineering.", featured=False),
    dict(id="col-mody", name="Mody University", city="Lakshmangarh", state="Rajasthan", type="Private", streams=[ENGG, CSIT, MGMT, MED], rating=4.0, fee_range="₹1.5 – 3 Lakh / year", description="Residential university with a dedicated girls' campus, strong safety and mentoring culture.", featured=False),
    dict(id="col-ganpat", name="Ganpat University", city="Mehsana", state="Gujarat", type="Private", streams=[ENGG, MED, MGMT, CSIT], rating=4.1, fee_range="₹1.2 – 2.8 Lakh / year", description="Gujarat university with respected pharmacy and engineering faculties and industry internships.", featured=False),
    dict(id="col-pp-savani", name="P.P. Savani University", city="Surat", state="Gujarat", type="Private", streams=[ENGG, CSIT, MGMT, MED], rating=3.9, fee_range="₹1 – 2.4 Lakh / year", description="Modern Surat campus offering engineering, health sciences and management programmes.", featured=False),
    dict(id="col-gnsu", name="Gopal Narayan Singh University", city="Sasaram", state="Bihar", type="Private", streams=[MED, VOC, SCI, ENGG], rating=4.0, fee_range="₹1.2 – 4 Lakh / year", description="Bihar's well-known private health-sciences university with nursing, pharmacy and medical programmes close to home.", featured=True),
]


async def main() -> None:
    for collection, rows in (("courses", COURSES), ("colleges", COLLEGES)):
        model = Course if collection == "courses" else College
        docs = [model(**row).model_dump() for row in rows]
        await db[collection].delete_many({})
        await db[collection].insert_many(docs)
        print(f"seeded {len(docs)} {collection}")
    await ensure_indexes()
    print("indexes ensured")


if __name__ == "__main__":
    asyncio.run(main())
