import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Home from "@/pages/Home";
import AboutUs from "@/pages/AboutUs";
import Courses from "@/pages/Courses";
import Colleges from "@/pages/Colleges";
import CareerCounseling from "@/pages/CareerCounseling";
import BiharStudentCreditCard from "@/pages/BiharStudentCreditCard";
import EducationLoan from "@/pages/EducationLoan";
import Scholarships from "@/pages/Scholarships";
import ContactUs from "@/pages/ContactUs";
import ApplyNow from "@/pages/ApplyNow";
import AdminDashboard from "@/pages/AdminDashboard";
import SEO from "@/components/SEO";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  const seo = {
    "/": {
      title: "Career Vision Education | Career Counseling & Admission Guidance",
      description: "Career Vision Education offers career counseling, college admission guidance, scholarships and education support to students across India."
    },
    "/about": {
      title: "About Career Vision Education | Career Guidance & Admission Support",
      description: "Learn about Career Vision Education and our mission to help students choose the right course, college and career path."
    },
    "/courses": {
      title: "Courses & Career Options | Career Vision Education",
      description: "Explore courses and career options with expert guidance from Career Vision Education."
    },
    "/colleges": {
      title: "Colleges & Admission Guidance | Career Vision Education",
      description: "Find the right college and get expert admission guidance from Career Vision Education."
    },
    "/counseling": {
      title: "Career Counseling | Career Vision Education",
      description: "Get free 1-on-1 career counseling to choose the right course, college and career path."
    },
    "/bihar-credit-card": {
      title: "Bihar Student Credit Card | Career Vision Education",
      description: "Get guidance for Bihar Student Credit Card education loan eligibility, documents and application support."
    },
    "/education-loan": {
      title: "Education Loan Assistance | Career Vision Education",
      description: "Get education loan guidance and support for funding your higher education."
    },
    "/scholarships": {
      title: "Scholarships | Career Vision Education",
      description: "Explore scholarship opportunities and get guidance for higher education funding."
    },
    "/contact": {
      title: "Contact Career Vision Education | Get Career Guidance",
      description: "Contact Career Vision Education for career counseling, college admission and education support."
    }
  };

  const currentSEO = seo[pathname as keyof typeof seo] || seo["/"];

  return (
    <div className="flex min-h-screen flex-col">
      <SEO title={currentSEO.title} description={currentSEO.description} />
      <Navbar />
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/counseling" element={<CareerCounseling />} />
          <Route path="/bihar-credit-card" element={<BiharStudentCreditCard />} />
          <Route path="/education-loan" element={<EducationLoan />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/apply" element={<ApplyNow />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      {/* The floating chat CTA is for students, not for the private admin area. */}
      {!isAdmin && <WhatsAppButton />}
      <Toaster />
    </div>
  );
}
