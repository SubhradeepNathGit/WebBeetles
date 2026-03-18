import React from 'react'
import AboutBanner from '../../components/student/about/AboutBanner'
import OurExpertsSection from '../../components/student/about/Exparts'
import StatsVideoSection from '../../components/student/about/Stat'
import HowItWorksSection from '../../components/student/common/Steps'
import TestimonialSection from '../../components/student/common/Testimonial'
import PreFooterCTA from '../../components/student/common/Prefooter'

const AboutUs = () => {
  return (
    <> 
    <AboutBanner/>
    <OurExpertsSection/>
    <StatsVideoSection/>
    <HowItWorksSection/>
    <TestimonialSection/>
    <PreFooterCTA/>
      
    </>
  )
}

export default AboutUs
