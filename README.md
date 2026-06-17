# WebBeetles - AI-Integrated Multi-Role Online Course Marketplace

**Tech Stack:** [React 19](https://react.dev/) · [Vite](https://vitejs.dev/) · [Supabase](https://supabase.com/) · [Tailwind CSS 4](https://tailwindcss.com/) · [Google Gemini](https://deepmind.google/technologies/gemini/) · [Razorpay](https://razorpay.com/) · [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) · [MIT License](https://opensource.org/licenses/MIT)

**WebBeetles** is a market-ready, high-performance Learning Management System (LMS) revolutionized by cutting-edge artificial intelligence. Built with a modern tech stack focusing on scalability, enterprise-grade security, and a premium user interface, it offers fully tailored portals for Students, Instructors, and Administrators. By natively integrating **Google Gemini AI**, **tiered subscriptions**, **real-time WebSocket notifications**, and a **dynamic, rule-driven checkout engine**, WebBeetles delivers an unparalleled, next-generation, production-ready educational marketplace experience.

🔗 **Live Deployment:** [webbeetles.vercel.app](https://webbeetles.vercel.app/)

---

## 🚀 Key Features & Capabilities

### 🤖 AI-Integrated Experience (Powered by Google Gemini)

- **Intelligent Support Chatbot (`Chatbot.jsx`):** An advanced, context-aware support bot driven by the **Google Gemini 2.5 Flash API**. It provides automated, real-time assistance directly within the student dashboard.
  * **Direct API Integration:** The chatbot connects directly to the `generativelanguage.googleapis.com` REST endpoint, utilizing the Gemini 2.5 Flash model for fast, low-latency responses.
  * **Contextual Memory:** It dynamically maintains a rolling conversation history (injecting the last 5 interactions into the AI prompt) to ensure complete contextual awareness and seamless human-like follow-ups.
  * **Custom System Prompts:** Operates under a highly customized system instruction prompt, forcing the AI to adopt the persona of the "WebBeetles Assistant." It is strictly instructed to maintain a professional, empathetic tone, prioritize platform-specific course queries, and gracefully handle out-of-scope or technical questions.
  * **Freemium Access Model:** The chatbot is currently offered **free to all public users** (Guest and Student) as part of the platform's open beta. It is wired to the subscription engine so that once paid usage limits are introduced, **Pro/Premium subscribers retain unrestricted access** while free-tier usage can be rate-limited or gated — without any structural changes to the chat UI.
  * **Premium UI/UX:** Features a modern, backdrop-blurred sliding drawer built with Tailwind CSS, complete with responsive typing indicators (bouncing dots animation), auto-scrolling message views, and robust error handling.
- **Smart Automation:** Reduces support overhead by autonomously handling common student queries, simulating a 24/7 human-like teaching assistant.

### 💎 Subscription & Billing Engine

- **Tiered Membership Plans:** Three subscription tiers — **Free**, **Pro**, and **Premium** — each unlocking a progressively richer set of platform benefits.
  * **Free:** Standard catalog access, course purchases at full price, and free-tier access to the AI chatbot.
  * **Pro:** Discounted course pricing, priority AI chatbot access, and reduced platform fees at checkout.
  * **Premium:** Maximum course discounts, full platform fee waiver, and unrestricted AI chatbot usage.
- **Recurring Billing via Razorpay:** Subscriptions are processed as **recurring payments through Razorpay's subscription/billing APIs**, with renewal, upgrade, and downgrade flows handled end-to-end.
- **Server-Verified Activation:** Subscription activation and renewal events are cryptographically verified through Supabase Edge Functions (mirroring the existing course-purchase verification pattern), ensuring tier upgrades are never applied client-side without backend confirmation.
- **Plan-Aware UI:** Pricing displays, course cards, and the checkout flow all read the user's active subscription tier in real time to surface the correct discount before purchase.

### 🔔 Real-Time Notification System

- **Custom WebSocket Server:** A dedicated WebSocket layer pushes live, bidirectional updates to connected clients the moment an event occurs — no polling, no refresh required.
- **Event-Driven Updates:** Students and instructors receive instant notifications for events such as course approval/rejection, new enrollments, payment confirmations, subscription renewals, new reviews, and chatbot/system alerts.
- **Persistent Connection Handling:** The client maintains a live socket connection per authenticated session, with automatic reconnection logic to gracefully recover from dropped connections or network interruptions.
- **Role-Aware Delivery:** Notifications are scoped and routed by role (Student / Instructor / Administrator), so each portal only receives events relevant to that user.
- **In-App Notification UI:** A dedicated notification center surfaces unread counts, recent activity, and read/unread state, synced live across the session.

### 🛒 Dynamic Checkout & Cart Engine

- **Full Shopping Cart System (`CartItemCard.jsx`, `PaymentSummaryCard.jsx`):** Add, remove, and review multiple courses before checkout, with persistent cart state across the session.
- **Dynamic Platform Fee Calculation:** A configurable platform fee is computed live on the cart total, with the fee rate adjustable from the Administrator's `Charges.jsx` control panel and automatically waived for qualifying subscription tiers.
- **Coupon Code Engine:** Supports promotional and one-time coupon codes applied directly at checkout, validated and calculated in real time against the cart subtotal.
- **Subscription-Based Discounts:** Active Pro/Premium subscribers automatically receive their tier-based discount applied to eligible courses in the cart.
- **Stacked Pricing Logic:** Platform fees, coupon discounts, and subscription discounts are **all applied together** in a single transparent price breakdown — the cart UI itemizes each adjustment (subtotal → subscription discount → coupon discount → platform fee → final payable amount) so users see exactly how their final price was calculated.
- **Trust & Conversion Components:** Trust badges and security messaging (`TrustBadage.jsx`, `SecurityTrust.jsx`) reduce checkout friction, alongside contextual action headers and support modals.

### 👤 Student Portal

- **Course Discovery & Enrollment:** Dynamic course catalog with advanced filtering, category-based exploration, and personalized recommendations.
- **Interactive Learning Environment:** Seamless video playback, comprehensive resource management, and rich text lessons (`CourseContent.jsx`, `CourseDetails.jsx`).
- **Optimized Checkout & Cart System:** Full cart-to-payment flow backed by the dynamic pricing engine described above.
- **Personalized Dashboard:** Track learning progress, historical orders, subscription status, live notifications, and comprehensive performance statistics (`StudentDashboardStats.jsx`).
- **Premium Certifications with Live Verification:** Generates highly detailed, printable PDF certificates upon course completion, featuring authentic vector gold stamps, scaled typography, and a **scannable QR code that links to a working, publicly accessible verification page** (`CertificateModal.jsx`). Anyone — employers, recruiters, or institutions — can scan the QR code or visit the verification link to confirm a certificate's authenticity, issue date, and recipient against the live database in real time, making every issued certificate independently auditable.

### 👨‍🏫 Instructor Portal

- **Course Management Suite:** Comprehensive tools for creating, updating, structuring, and publishing courses directly from the web dashboard.
- **Enhanced Dashboard Analytics:** Modernized interface (`InstructorDashboardHeader.jsx`) providing high-level summaries, live notification feeds, and quick action navigation.
- **Profile & Credentialing:** Detailed instructor onboarding with professional verification and portfolio management.
- **Performance & Revenue Tracking:** Real-time financial statistics and enrollment tracking managed through a global Redux store (`instructorSlice.js`), updated live via the WebSocket notification layer as enrollments and reviews come in.

### 🛠️ Administrator Control Center

- **Universal Oversight & Analytics:** Extensive charts and data tables detailing platform growth, user engagement, subscription distribution, and revenue (`Analytics.jsx`).
- **Course Moderation Workflow:** Dedicated approval pipelines (`ApproveCourses.jsx`) ensuring only high-quality content reaches the marketplace, with instant approval/rejection notifications pushed to instructors.
- **Financial & Platform Settings:** Granular control over commission/platform fee rates, coupon management, subscription tier configuration, payment gateway configurations (`Charges.jsx`), and system maintenance toggles (`Settings.jsx`).
- **User Management:** Full CRUD capabilities for student and instructor accounts, including subscription oversight and review management (`InstructorReviews.jsx`).

### 💳 Backend & Infrastructure

- **Secure Payments:** Deep integration with **Razorpay** for both one-time course purchases and recurring subscription billing.
- **Serverless Verification:** Utilizes Deno-based Supabase Edge Functions (`verify-payment/index.ts`) for cryptographic signature verification on both course payments and subscription transactions, preventing tampering and securely updating PostgreSQL order/subscription states.
- **Real-Time Layer:** A custom WebSocket server handles live event broadcasting for notifications across all three portals, decoupled from the request/response payment and data flows.
- **Certificate Verification Endpoint:** A publicly accessible verification route resolves certificate IDs against the database, enabling third-party authenticity checks via QR code or direct link.

---

## 🛠️ Technology Stack

### Frontend Architecture

- **Core Framework:** React 19 optimized with Vite
- **Styling & UI:** Tailwind CSS 4, Chakra UI (for consistent design tokens)
- **Animations & Micro-interactions:** GSAP, Framer Motion, Lottie-React, Swiper.js
- **State Management:** Redux Toolkit, Zustand, TanStack React Query
- **Forms & Validation:** React Hook Form
- **Icons & Notifications:** Lucide React, React-Toastify, SweetAlert2, Notistack
- **Real-Time Client:** Native WebSocket client with reconnection handling

### AI & Backend Services

- **Artificial Intelligence:** Google Gemini API (for advanced chatbot and natural language processing)
- **Backend-as-a-Service (BaaS):** Supabase (Authentication, PostgreSQL Database, Object Storage)
- **Serverless Compute:** Supabase Edge Functions (Deno)
- **Real-Time Notifications:** Custom WebSocket server
- **Payment Gateway:** Razorpay (one-time payments + recurring subscription billing)
- **Email Delivery:** EmailJS Integration

---

## 🏗️ System Architecture

```
graph TD
    User((User)) -->|Browser| Frontend[React Single Page Application]

    subgraph Client_Side
        Frontend -->|Auth & DB Queries| SupabaseSDK[Supabase JS Client]
        Frontend -->|Payment & Subscription Intent| EdgeFunctions[Supabase Edge Functions]
        Frontend -->|Prompt/Context| GeminiAPI[Google Gemini API]
        Frontend <-->|Live Events| WSClient[WebSocket Client]
    end

    subgraph Cloud_Infrastructure
        SupabaseSDK -->|REST/Realtime| SupabaseREST[PostgreSQL + PostgREST]
        EdgeFunctions -->|Execute Order/Subscription| RazorpayAPI[Razorpay API]
        EdgeFunctions -->|Update Status| SupabaseDB[(PostgreSQL)]
        GeminiAPI -->|AI Response| Frontend
        WSClient <-->|Bidirectional| WSServer[Custom WebSocket Server]
        WSServer -->|Broadcast Events| SupabaseDB
    end

    Admin((Admin)) -->|Manage| Frontend
    Instructor((Instructor)) -->|Upload| Frontend
    Verifier((Third-Party Verifier)) -->|Scan QR / Visit Link| CertVerify[Certificate Verification Endpoint]
    CertVerify -->|Lookup| SupabaseDB
```

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase Account & Project
- Razorpay Account (with Subscriptions enabled for recurring billing)
- Google Gemini API Key
- A deployable target for the custom WebSocket server (e.g. a small Node process alongside your Supabase/Vercel setup)

### Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/SubhradeepNathGit/WebBeetles.git
```

2. **Install dependencies:**

```bash
npm install
```

3. **Environment Configuration:** Create a `.env` file in the root directory and add the necessary configuration keys:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payments (Razorpay) — one-time + recurring subscriptions
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_CREATE_ORDER_URL=your_edge_function_url
VITE_CREATE_SUBSCRIPTION_URL=your_subscription_edge_function_url

# AI Integration
VITE_GEMINI_API_KEY=your_google_gemini_api_key

# Real-Time Notifications
VITE_WEBSOCKET_URL=your_websocket_server_url

# Email Service
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

4. **Start the development server:**

```bash
npm run dev
```

5. **(Optional) Start the WebSocket server** for local real-time notification testing, pointing `VITE_WEBSOCKET_URL` at its local address.

---

## 🛡️ Role-Based Access Control (RBAC)

WebBeetles implements strict data segregation and routing based on user roles:

- **Guest:** Browse the public catalog, view course details, access static pages, and use the free-tier AI chatbot.
- **Student:** Access personalized dashboards, manage subscriptions, interact with the AI Chatbot, receive real-time notifications, purchase courses through the dynamic cart, and view enrolled video content. Can verify and share earned certificates.
- **Instructor:** Access dedicated management tools to build courses, track revenue, receive live notifications on enrollments/reviews/approvals, and monitor student progress.
- **Administrator:** Full, unrestricted access to system analytics, financial controls (platform fees, coupons, subscription tiers), and content moderation pipelines.

---

## 🎓 Certificate Verification

Every certificate issued by WebBeetles includes a unique, scannable QR code and a direct verification link. Scanning the code or visiting the link resolves against the live database to confirm:

- Recipient name and course title
- Issue date and certificate ID
- Authenticity status (valid / revoked)

This makes every WebBeetles certificate independently verifiable by third parties without requiring platform login.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/SubhradeepNathGit/WebBeetles/blob/main/LICENSE) file for details.