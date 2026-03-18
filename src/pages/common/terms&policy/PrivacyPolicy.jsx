import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="text-gray-200 min-h-screen font-inter">
       
            <section className="py-20 px-6 md:px-12 text-center bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black">
                <h1 className="text-4xl md:text-5xl font-bold text-white my-8">
                    Privacy Policy
                </h1>
                <p className="md:mx-5 mx-2 text-gray-400 lg:text-lg text-md">
                    At WebBeetles, we care about your growth — and your privacy. <br />
                    When you choose to learn with us, you trust us with your personal information. This Privacy Policy explains how we handle that trust: how we collect, use, protect, and respect your data while you use our learning platform.
                </p>
            </section>

            <section className="px-6 md:px-16 lg:px-28 py-16 space-y-14 bg-black">
                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        1. What We Collect — and Why
                    </h2>
                    <p className="text-gray-300 mb-3">
                        We collect personal and non-personal information to provide and
                        improve our learning experience.
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>Personal details such as name and email address</li>
                        <li>Account login and profile data</li>
                        <li>Payment and billing details (processed securely)</li>
                        <li>Course progress and activity data</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        2. How We Use Your Information
                    </h2>
                    <p className="text-gray-300 mb-3">
                        Your data helps us deliver courses, provide customer support, and
                        enhance our services.
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>To personalize your learning experience</li>
                        <li>To send important notifications or updates</li>
                        <li>To process transactions and secure user data</li>
                        <li>To analyze user engagement and improve our content</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        3. How We Protect Your Information
                    </h2>
                    <p className="text-gray-300 mb-3">
                        We take your privacy seriously.
                        All personal data is stored securely using encryption, protected servers, and regular system monitoring. Only authorized personnel can access it, and only when needed for legitimate reasons.
                    </p>
                    <p className="text-gray-300">
                        Despite our best efforts, no digital platform is completely risk-free. That’s why we also encourage you to keep your password strong and private.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        4. Data Security
                    </h2>
                    <p className="text-gray-300 mb-2">
                        We may share limited information only when necessary, such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>With trusted service partners (like payment processors or hosting providers) who help us run the platform.</li>
                        <li>With legal authorities, if required by law.</li>
                        <li>During business transfers (like mergers or acquisitions), with proper safeguards.</li>
                    </ul>
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mt-4">
                        <p className="text-gray-200 font-semibold">
                            We never sell or rent your personal data to third parties.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        5. Your Control Over Your Data
                    </h2>
                    <p className="text-gray-300 mb-3">
                        You have full control of your personal information. You can:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>Update or delete your account anytime.</li>
                        <li>Request a copy of your stored data.</li>
                        <li>Unsubscribe from promotional messages.</li>
                        <li>Contact us to delete your information permanently.</li>
                    </ul>
                    <p className="text-gray-400">
                        To exercise these rights, please email us at{" "}  <span className="text-purple-400">privacy@webbeetles.com{" "}</span>— we’ll take care of it promptly.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        6. Cookies & Tracking
                    </h2>
                    <p className="text-gray-300">
                        We use cookies and similar technologies to enhance user experience,
                        analyze traffic, and remember your preferences. You can adjust
                        cookie settings through your browser anytime.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        7. For Young Learners
                    </h2>
                    <p className="text-gray-300">
                        Our platform is built for users aged 16 and above. <br />
                        If you are under 16, please use WebBeetles under the supervision of a parent or guardian. If we discover that a child’s data has been collected accidentally, we’ll delete it immediately.

                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        8. Updates to This Policy
                    </h2>
                    <p className="text-gray-300">
                        We may update this Privacy Policy periodically. The latest version
                        will always be available on this page with an updated revision date.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                        9. Talk to Us
                    </h2>
                    <p className="text-gray-300">
                        If you have questions about this Privacy Policy, please reach out to
                        us via our{" "}
                        <a href="/contact"
                            className="text-purple-500 hover:text-purple-400">
                            Contact Page
                        </a>.
                    </p>
                </div>
            </section>

            {/* Footer */}
            {/* <footer className="bg-gray-800 py-8 px-6 md:px-12 text-center text-gray-500 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} WebBeetles. All rights reserved.</p>
      </footer> */}
        </div>
    );
};

export default PrivacyPolicy;