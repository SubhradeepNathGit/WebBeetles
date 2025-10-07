import React from "react";
import Banner from "../layout/banner";
import LogoCarousel from "../components/trust";
import WhyChooseUsSection from "../components/whychooseUs";
import CoursesSection from "../components/ourCourses";
import HowItWorksSection from "../components/steps";
import StaticSection from "../components/animatedLines";
import PreFooterCTA from "../components/prefooter";
import CategoriesSection from "../components/categories";
import TestimonialSection from "../components/testimonial";
import PricingSection from "../components/pricing";
import FAQSection from "../components/FAQ";

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
