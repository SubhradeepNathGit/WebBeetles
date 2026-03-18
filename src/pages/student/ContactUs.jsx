import React from "react";
import ContactBanner from "../../components/student/contact/ContactBanner";
import ContactMap from "../../components/student/contact/ContactMap";
import PreFooterCTA from "../../components/student/common/prefooter";
import ContactDesc from "../../components/student/contact/ContactDesc";
import FAQSection from "../../components/student/common/FAQ";

const ContactUs = () => {
    return (
        <>
            <ContactBanner />
            <ContactDesc />
            <FAQSection />
            <ContactMap />
            <PreFooterCTA />
        </>
    );
}

export default ContactUs;