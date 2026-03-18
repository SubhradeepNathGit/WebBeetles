import React from 'react'
import AboutBanner from '../../components/student/about/aboutBanner'
import OurExpertsSection from '../../components/student/about/exparts'
import StatsVideoSection from '../../components/student/about/stat'
import HowItWorksSection from '../../components/student/common/steps'
import TestimonialSection from '../../components/student/common/testimonial'
import PreFooterCTA from '../../components/student/common/prefooter'

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
