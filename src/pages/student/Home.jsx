import React from "react";
import Banner from "../../components/student/home/banner";
import LogoCarousel from "../../components/student/home/trust";
import WhyChooseUsSection from "../../components/student/home/whychooseUs";
import CoursesSection from "../../components/student/home/ourCourses";
import HowItWorksSection from "../../components/student/common/steps";
import StaticSection from "../../components/student/home/animatedLines";
import PreFooterCTA from "../../components/student/common/prefooter";
import CategoriesSection from "../../components/student/home/categories";
import TestimonialSection from "../../components/student/common/testimonial";
import PricingSection from "../../components/student/home/pricing";
import FAQSection from "../../components/student/common/FAQ";

const Home = () => {
  return (
  <>
  <Banner/>
  <LogoCarousel/>
  <WhyChooseUsSection/>
  <CoursesSection/>
  <HowItWorksSection/>
  <StaticSection/>
  <CategoriesSection/>
  <FAQSection/>
  <PricingSection/>
  <TestimonialSection/>
  <PreFooterCTA/>
  </>
  );
};

export default Home;
