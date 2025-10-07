import React from 'react'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'

const ContactDesc = () => {
    return (
        <section className="bg-black text-white pb-25">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr] gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start md:items-center">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </div>
        </section>
    )
}

export default ContactDesc