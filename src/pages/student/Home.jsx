import React from "react";
import Banner from "../../components/student/home/Banner";
import LogoCarousel from "../../components/student/home/Trust";
import WhyChooseUsSection from "../../components/student/home/WhychooseUs";
import CoursesSection from "../../components/student/home/OurCourses";
import HowItWorksSection from "../../components/student/common/Steps";
import StaticSection from "../../components/student/home/AnimatedLines";
import PreFooterCTA from "../../components/student/common/Prefooter";
import CategoriesSection from "../../components/student/home/Categories";
import TestimonialSection from "../../components/student/common/Testimonial";
import PricingSection from "../../components/student/home/Pricing";
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
