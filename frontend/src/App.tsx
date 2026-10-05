import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
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
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
