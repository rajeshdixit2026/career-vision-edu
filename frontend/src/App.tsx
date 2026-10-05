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

  return (
    <div className="flex min-h-screen flex-col">
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
