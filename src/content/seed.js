// Default content. It shows on the site until you save your own version in the admin.
// In /admin, each section has an "Import default content" button so you can edit these.
const img = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const SEED = {
  settings: {
    name: "Smart Lead Systems",
    tagline: "Best-in-Class Digital Growth Agency",
    url: "https://smartlead.ng",
    email: "hello@smartlead.ng",
    whatsapp: "+2349078581006",
    location: "Lagos, Nigeria",
    siteDescription: "Smart Lead Systems is a Nigerian digital growth agency for businesses in every sector in Nigeria, the UK and the US: Meta and Google Ads with a lower cost per lead, CRM and lead follow-up systems, website and mobile app development, graphics, video editing, AI automation and social media management.",
    heroEyebrow: "FULL-STACK DIGITAL GROWTH AGENCY · FOR EVERY BUSINESS",
    heroLine1: "Build better.",
    heroLine2: "Get seen.",
    heroLine3: "Grow smarter.",
    heroText: "Smart Lead Systems runs Meta and Google Ads, builds CRM and lead follow-up systems, develops websites and apps, and produces the creative and automation behind them, so any business can stop piecing digital work together and start getting real leads.",
    heroCta: "Start a conversation",
    approachTitle: "Not seven separate vendors.",
    approachAccent: "One capable team.",
    approachText1: "Most growing businesses don't need more people to manage. They need the right digital pieces to work together: ads that bring leads, a website that converts them and a CRM that follows up.",
    approachText2: "We run the ads, build the website and CRM, shape the creative, edit the content and automate repetitive work, with one goal: making your business easier to discover, trust and buy from.",
    pricingTitle: "Clear pricing, built around your goals.",
    pricingNote: "Prices are starting points. Your final quote depends on scope, timeline and the channels involved.",
    ctaEyebrow: "READY WHEN YOU ARE",
    ctaTitle: "Bring us the business problem.",
    ctaAccent: "Let's build the solution.",
    ctaText: "From more leads at a lower cost to a full website and CRM, Smart Lead Systems is built for businesses that want capable execution without hiring six different people.",
    waMessage: "Hi Smart Lead Systems, I'd like to talk about a project for my business. Can you help?",
    waMessageThanks: "Hi Smart Lead Systems, I just sent a message through your website and wanted to follow up.",
    footerText: "Digital growth services for every kind of business: Meta and Google Ads, CRM systems, websites, creative and automation.",
    contactTitle: "Tell us what you're trying to",
    contactAccent: "build or grow.",
    thanksTitle: "Thank you. We've got your message.",
    thanksText: "One of our team will reach out to you within the next 24 hours. If it's urgent, message us on WhatsApp.",
    leadNotifyEmail: "",
    submitText: "Send message",
    formNote: "One of our team will reply within 24 hours.",
    unqualTitle: "Thanks for reaching out.",
    unqualText: "Based on your answers, we may not be the right fit for this project right now. We've saved your details and will get back to you if that changes. In the meantime, our guides may help.",
    unqualButtonText: "Read our guides",
    unqualButtonLink: "/blog",
    notifyUnqualified: true,
    trackWithoutConsent: false,
    contactText: "Send a message and tell us what you need. We'll help you work out the right next step.",
    instagram: "", linkedin: "", x: "", facebook: "", tiktok: "", youtube: "",
    gaId: "", metaPixelId: "", tiktokPixelId: "", ogImage: "", logoUrl: ""
  },
  services: [
    { id: "meta-ads", waMessage: "Hi Smart Lead Systems, I'd like help running Meta and Google ads that bring in more leads at a lower cost per lead. Can we talk?", title: "Meta & Google Ads Management", accent: "GROW", order: 1, image: img("photo-1460925895917-afdab827c52f"), gallery: [],
      description: "We build and manage Facebook, Instagram and Google ads that bring in leads and sales at a cost that makes sense. We set up proper tracking and the Conversions API, test creatives and audiences, cut wasted spend, and connect every lead to a CRM so nothing is missed.",
      capabilities: ["Campaign strategy & funnel planning", "Facebook & Instagram Ads", "Google Search & Display Ads", "Lead generation & WhatsApp ads", "Cost-per-lead optimisation", "Creative & audience testing", "Meta Pixel & Conversions API setup", "Retargeting", "CRM & lead follow-up setup", "Weekly reporting & scaling"],
      details: `## Meta ads built around your cost per lead
Most businesses lose money on ads not because the platform fails, but because the offer is unclear, tracking is broken, or leads are never followed up. We fix all three.

## What we do
- **Offer and funnel first:** we shape the offer, the landing page or lead form, and the follow-up before spending on traffic.
- **Tracking done properly:** Meta Pixel, the Conversions API and Google and TikTok tracking, so the ad platforms learn from real leads instead of junk clicks.
- **Creative testing:** we test hooks, images, video and copy in a structured way and keep what lowers your cost per lead.
- **Audience and budget control:** we cut wasted spend, exclude poor-fit audiences and scale only what works.
- **Qualified leads only:** qualifying questions on the lead form stop poor-fit enquiries from being counted as leads.
- **CRM and follow-up:** every lead lands in a CRM with instant WhatsApp or email follow-up, so you reply while they are still interested.

## Who it works for
Education and training, real estate, healthcare and clinics, restaurants, beauty and fashion, construction and home services, professional services, logistics, retail and e-commerce, fintech, events, non-profits and more. If your customers search or scroll, we can reach them.

## How we report
We report cost per lead, cost per qualified lead, lead-to-customer rate and return on ad spend in plain language, every week.` },
    { id: "crm-systems", waMessage: "Hi Smart Lead Systems, I'd like a CRM and lead follow-up system for my business so I stop losing enquiries. Can you help?", title: "CRM & Lead Management", accent: "ORGANISE", order: 2, image: img("photo-1551288049-bebda4e38f71"), gallery: [],
      description: "We build CRM systems that capture every lead, follow up instantly and show you what is working: pipelines, WhatsApp and email automation, reminders and reporting, so no enquiry is lost and your team always knows the next step.",
      capabilities: ["Custom CRM pipelines", "Lead capture from ads, website and WhatsApp", "Instant WhatsApp & email follow-up", "Lead scoring & qualification", "Task reminders & team assignment", "Sales dashboards & reporting", "Integration with Meta, Google & forms", "Data clean-up & migration"],
      details: `## A CRM that fits how your business sells
A CRM is only useful if your team actually uses it. We build simple pipelines around your real sales process, whether that is enquiries, bookings, quotes or enrolments.

## What you get
- **Every lead in one place:** from Meta and Google ads, your website, WhatsApp and calls.
- **Instant follow-up:** automatic WhatsApp and email replies the moment a lead comes in.
- **Clear next steps:** reminders, assignments and stages so nothing goes cold.
- **Honest numbers:** which ads, pages and posts bring leads that actually become customers.` },
    { id: "web-development", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your website development service. Can you tell me how to get started?", title: "Website Development", accent: "BUILD", order: 3, image: img("photo-1559028012-481c04fa702d"), gallery: [],
      description: "We design and develop fast, modern websites, landing pages and online stores for any kind of business, built to explain your offer clearly, rank on Google and turn visitors into leads and customers.",
      capabilities: ["Business websites", "E-commerce stores", "Landing pages for ads", "Custom web applications", "CMS & admin dashboards", "SEO & AEO-ready structure", "Forms, CRM & lead capture", "Payment & third-party integrations"] },
    { id: "app-development", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your mobile app development service. Can you tell me how to get started?", title: "App / Mobile Development", accent: "BUILD", order: 4, image: img("photo-1551650975-87deedd944c3"), gallery: [],
      description: "We turn useful ideas into polished mobile and web apps with clean user experiences and reliable foundations: booking, ordering, payments, member areas and customer dashboards for any industry.",
      capabilities: ["Product discovery", "Mobile UI/UX", "iOS & Android", "Booking & ordering apps", "API integration", "Authentication & payments", "Dashboards", "Production-ready foundations"] },
    { id: "graphics-design", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your graphics design service. Can you tell me how to get started?", title: "Graphics Design", accent: "CREATE", order: 5, image: img("photo-1558655146-d09347e92766"), gallery: [],
      description: "We create digital-first graphics that make any business look established, consistent and ready to compete: ad creatives, social posts, brand assets and promotional designs.",
      capabilities: ["Social media graphics", "Ad creatives", "Brand identity assets", "Campaign visuals", "Product graphics", "Carousels", "Promotional designs", "Marketing collateral"] },
    { id: "video-editing", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your video editing service. Can you tell me how to get started?", title: "Video Editing", accent: "MOVE", order: 6, image: img("photo-1492619375914-88005aa9e8fb"), gallery: [],
      description: "We edit short-form and marketing videos for attention, clarity and action across social platforms and paid campaigns, from Reels and TikToks to video ads.",
      capabilities: ["Short-form video", "Reels & TikTok", "Video ads for Meta & TikTok", "Captions & subtitles", "Motion graphics", "Talking-head edits", "Content repurposing", "Platform-ready exports"] },
    { id: "ai-automation", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your AI automation service. Can you tell me how to get started?", title: "AI Automation", accent: "AUTOMATE", order: 7, image: img("photo-1677442136019-21780ecad995"), gallery: [],
      description: "We design practical AI-powered workflows that reduce repetitive work, answer and qualify leads faster, and help teams do more with less manual effort.",
      capabilities: ["AI chat & WhatsApp assistants", "Lead qualification workflows", "Content workflows", "Data processing", "CRM automation", "Notifications & reminders", "Internal tools", "Workflow design"] },
    { id: "social-media", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your social media management service. Can you tell me how to get started?", title: "Social Media Management", accent: "STAY SEEN", order: 8, image: img("photo-1611162617474-5b21e879e113"), gallery: [],
      description: "We build consistent social content systems that keep your brand visible, useful and recognisable on every platform, without posting just for the sake of posting.",
      capabilities: ["Content strategy", "Content calendars", "Publishing", "Community management", "Platform optimisation", "Analytics", "Creative direction", "Growth experiments"] }
  ],
  projects: [
    { id: "nexora", title: "Nexora Logistics", category: "App Development", service: "app-development", order: 1, link: "", image: img("photo-1586528116493-da8b2e5f2e3a"), summary: "A production-style logistics mobile experience focused on shipment visibility, clear status information and operational simplicity." },
    { id: "growth-system", title: "Growth Campaign System", category: "Meta & Google Ads", service: "meta-ads", order: 2, link: "", image: img("photo-1551288049-bebda4e38f71"), summary: "A creative-led acquisition concept built around offer clarity, testing, retargeting and measurable lead generation." },
    { id: "commerce-web", title: "E-commerce Experience", category: "Web Development", service: "web-development", order: 3, link: "", image: img("photo-1556742049-0cfed4f6a45d"), summary: "A premium storefront direction designed around product discovery, trust, mobile usability and conversion." },
    { id: "brand-creative", title: "Digital Brand Creative", category: "Graphics Design", service: "graphics-design", order: 4, link: "", image: img("photo-1545235617-9465d2a55698"), summary: "A reusable creative direction for an online-first business across social posts, campaigns and promotional graphics." },
    { id: "content-system", title: "Short-form Content System", category: "Video Editing", service: "video-editing", order: 5, link: "", image: img("photo-1536240478700-b869070f9279"), summary: "A content editing direction for turning raw footage into clear, platform-ready short-form marketing content." }
  ],
  posts: [
    {
      id: "first-post", published: true, title: "Why good businesses still struggle to grow online", slug: "why-good-businesses-still-struggle-to-grow-online",
      excerpt: "A strong product is only the beginning. Growth gets easier when your website, creative and acquisition work as one system.",
      category: "Growth", date: "2026-10-01", author: "Smart Lead Systems", coverImage: img("photo-1552664730-d307ca884978"), metaTitle: "", metaDescription: "",
      content: "A business can have a good product and still stay invisible. The gap is often not quality; it is distribution, positioning and consistency.\n\n## Your website builds trust\n\nYour website should make the business credible. Visitors decide in seconds whether you look like a real, reliable company.\n\n## Your creative explains the offer\n\nYour creative should make the offer easy to understand. If people need to work out what you sell, most will leave.\n\n## Your ads put the offer in front of the right people\n\nPaid acquisition should send the right audience to the right page. When these pieces work together, marketing becomes a system instead of a collection of disconnected activities.\n\n## The Smart Lead approach\n\nThat is the thinking behind Smart Lead Systems: build the digital foundation, make the brand look the part, get the offer seen and keep improving the system."
    }
  ],
  pricing: [
    { id: "website-launch", waMessage: "Hi Smart Lead Systems, I'm interested in the Website Launch package. Can we talk about getting started?", order: 1, visible: true, highlight: false, title: "Website Launch", price: "From $500", period: "one-time project", description: "A fast, conversion-focused website or online store for a new or growing brand.", features: ["Custom design (not a template)", "Mobile-first and fast", "SEO and analytics set up", "Lead capture or checkout", "Launch support"], cta: "Get a quote" },
    { id: "growth-retainer", waMessage: "Hi Smart Lead Systems, I'm interested in the Growth Retainer package. Can we talk about getting started?", order: 2, visible: true, highlight: true, title: "Growth Retainer", price: "From $750", period: "per month", description: "Ongoing ads, creative and reporting to keep leads and sales coming in.", features: ["Meta and Google Ads management", "Ad creatives and short video", "Tracking and monthly reporting", "Monthly strategy call", "Continuous testing"], cta: "Start growing" },
    { id: "full-stack-partner", waMessage: "Hi Smart Lead Systems, I'm interested in the Full-Stack Partner package. Can we talk about getting started?", order: 3, visible: true, highlight: false, title: "Full-Stack Partner", price: "Custom", period: "tailored to your business", description: "Development, growth, creative and automation handled by one team.", features: ["Website or app plus ongoing growth", "Social media management", "AI automation for lead handling", "Priority turnaround", "Dedicated point of contact"], cta: "Talk to us" }
  ],
  testimonials: [],
  clients: [],
  founders: [
    { id: "samuel", order: 1, name: "Ngene Samuel", role: "Founder, Smart Lead Systems", photo: "", photoAlt: "", linkedin: "", x: "", instagram: "", bio: "I started Smart Lead Systems from Lagos with a simple idea: businesses should be able to get serious digital work without assembling a different team for every task.\n\nBuild useful things. Make them look right. Get them in front of people. That is the thinking behind the agency, which brings website and app development, Meta and Google Ads, graphics, video, AI automation and social media into one practical growth partner.\n\nThe goal isn't to make digital complicated. It is to make it work harder for the business." }
  ],
  faqs: [
    { id: "what-do-you-do", order: 1, question: "What does Smart Lead Systems do?", answer: "Smart Lead Systems is a full-stack digital growth agency based in Lagos, Nigeria. We run Meta and Google Ads, build CRM and lead follow-up systems, develop websites and mobile apps, design graphics, edit video, build AI automations and manage social media, so you work with one team instead of several vendors." },
    { id: "who-for", order: 2, question: "Which industries and businesses do you work with?", answer: "We work with businesses in every sector, including education and training, real estate, healthcare and wellness, restaurants and hospitality, e-commerce and retail, fintech and finance, professional services, construction and home services, beauty and fashion, logistics, technology, automotive, travel and events, non-profits and churches, agriculture and manufacturing, and coaches and creators. We serve clients in Nigeria, the UK and the US." },
    { id: "meta-cost", order: 3, question: "How do you lower the cost per lead on Meta ads?", answer: "We fix the offer and landing page first, set up the Meta Pixel and Conversions API so Meta learns from real leads, test creatives and audiences in a structured way, cut spend on what does not convert, and add qualifying questions so poor-fit enquiries are not counted as leads. We then follow up every lead quickly through a CRM." },
    { id: "crm", order: 4, question: "Do you build CRM systems?", answer: "Yes. We build CRM pipelines that capture leads from ads, your website and WhatsApp, follow up instantly by WhatsApp or email, assign tasks to your team and report which sources produce paying customers." },
    { id: "capi", order: 5, question: "What is the Meta Conversions API and do you set it up?", answer: "The Conversions API sends lead and sale events from your server straight to Meta, alongside the browser pixel. It makes tracking more reliable and helps Meta optimise your ads. Yes, we set up the Pixel, the Conversions API, and the equivalent for TikTok." },
    { id: "cost", order: 6, question: "How much does a website or ad management cost?", answer: "It depends on scope. Our pricing page lists starting points, and we confirm a fixed quote after understanding your goals, the pages or features you need and the channels involved." },
    { id: "timeline", order: 7, question: "How long does a project take?", answer: "Timelines depend on scope. We agree a clear schedule in your quote so you know what to expect before work begins." },
    { id: "location", order: 8, question: "Where are you based, and do you work with clients abroad?", answer: "We are based in Lagos, Nigeria, and we work with clients in Nigeria, the UK and the US, online and on WhatsApp." },
    { id: "start", order: 9, question: "How do we get started?", answer: "Send us a message through the contact form or WhatsApp with what you want to build or grow. We'll reply with the right next step." }
  ],
  process: [
    { id: "p1", order: 1, title: "Understand", description: "We start with the business, the offer, the audience and what you actually need to achieve." },
    { id: "p2", order: 2, title: "Build", description: "We design and develop the right digital assets instead of forcing your problem into a template." },
    { id: "p3", order: 3, title: "Launch", description: "We put the work into the real world: publishing, deploying, advertising and connecting the pieces." },
    { id: "p4", order: 4, title: "Improve", description: "We learn from what happens next and keep improving the creative, experience and system." }
  ],
  industries: [
    { id: "education", order: 1, title: "Education & training", description: "Schools, colleges, tutors, online courses and training academies that want more enrolments.", points: ["Enrolment and lead-generation campaigns", "Course and school websites", "Parent and student follow-up"] },
    { id: "real-estate", order: 2, title: "Real estate & property", description: "Agents, developers and property managers looking for qualified buyers, tenants and investors.", points: ["Listing and showcase websites", "Lead ads with qualifying questions", "CRM follow-up for viewings"] },
    { id: "healthcare", order: 3, title: "Healthcare & wellness", description: "Clinics, dentists, pharmacies, gyms and wellness brands that need more bookings.", points: ["Appointment-booking websites", "Local and Meta ad campaigns", "Trust-building content"] },
    { id: "restaurants", order: 4, title: "Restaurants, food & hospitality", description: "Restaurants, cafes, caterers, hotels and food brands that want more orders and bookings.", points: ["Menu and ordering websites", "Offer and promotion ads", "Short-form food video"] },
    { id: "ecommerce", order: 5, title: "E-commerce & retail", description: "Online stores and shops that need traffic that turns into orders.", points: ["Fast, conversion-focused stores", "Sales and retargeting ads", "Product creative and video"] },
    { id: "fintech", order: 6, title: "Fintech & finance", description: "Fintech startups, lenders, insurers and advisers who need to look credible and acquire customers.", points: ["Trust-first websites and apps", "Acquisition campaigns and tracking", "Onboarding automation"] },
    { id: "professional-services", order: 7, title: "Professional services", description: "Lawyers, accountants, consultants and agencies that win clients on reputation and trust.", points: ["Authority websites", "Lead generation for high-value clients", "Thought-leadership content"] },
    { id: "construction", order: 8, title: "Construction & home services", description: "Roofing, plumbing, electrical, cleaning, solar and renovation businesses that live on enquiries.", points: ["Local lead-generation ads", "Quote-request websites", "Missed-lead follow-up"] },
    { id: "beauty-fashion", order: 9, title: "Beauty, fashion & lifestyle", description: "Salons, spas, boutiques, designers and lifestyle brands built on visuals.", points: ["Booking and shop websites", "Instagram and TikTok content", "Lookbook and product creative"] },
    { id: "logistics", order: 10, title: "Logistics & transport", description: "Delivery, freight, travel and transport companies that need steady business customers.", points: ["Quote and tracking websites", "B2B lead generation", "Operations dashboards"] },
    { id: "technology", order: 11, title: "Technology & SaaS", description: "Software, apps and IT companies that need sign-ups, demos and trials.", points: ["Product websites and landing pages", "Sign-up and demo campaigns", "Product videos and automation"] },
    { id: "automotive", order: 12, title: "Automotive", description: "Dealers, mechanics, car hire and auto-parts businesses.", points: ["Inventory and booking websites", "Local lead ads", "Video walkarounds"] },
    { id: "travel-events", order: 13, title: "Travel, tourism & events", description: "Travel agents, tour operators, venues and event organisers.", points: ["Booking-focused websites", "Seasonal campaigns", "Event promotion creative"] },
    { id: "nonprofit", order: 14, title: "Non-profits, churches & communities", description: "Organisations that need to reach supporters, volunteers and donors.", points: ["Donation and event websites", "Awareness campaigns", "Social media management"] },
    { id: "agriculture-manufacturing", order: 15, title: "Agriculture & manufacturing", description: "Producers, factories and suppliers selling to businesses and distributors.", points: ["Catalogue websites", "Buyer lead generation", "Brand and product videos"] },
    { id: "creators-coaches", order: 16, title: "Creators, coaches & consultants", description: "Personal brands selling programmes, courses, events or services.", points: ["Personal brand websites", "Webinar and programme ads", "Content editing and funnels"] }
  ],
  formfields: [
    { id: "name", key: "name", label: "Name", type: "text", required: true, placeholder: "", options: [], disqualify: [], order: 1, visible: true },
    { id: "email", key: "email", label: "Email", type: "email", required: true, placeholder: "", options: [], disqualify: [], order: 2, visible: true },
    { id: "phone", key: "phone", label: "Phone / WhatsApp (optional)", type: "phone", required: false, placeholder: "", options: [], disqualify: [], order: 3, visible: true },
    { id: "company", key: "company", label: "Company / brand (optional)", type: "text", required: false, placeholder: "", options: [], disqualify: [], order: 4, visible: true },
    { id: "service", key: "service", label: "What do you need?", type: "select", required: false, placeholder: "Select a service", options: [], disqualify: [], order: 5, visible: true },
    { id: "plan", key: "plan", label: "Which package are you interested in?", type: "select", required: false, placeholder: "Select a package", options: [], disqualify: [], order: 6, visible: true },
    { id: "budget", key: "budget", label: "What is your monthly budget?", type: "select", required: false, placeholder: "Select a range", options: ["Under $300", "$300 - $750", "$750 - $2,000", "$2,000+"], disqualify: [], order: 7, visible: false },
    { id: "message", key: "message", label: "Message", type: "textarea", required: true, placeholder: "Tell us about your business and what you're trying to achieve.", options: [], disqualify: [], order: 8, visible: true }
  ],
  pages: [
    { id: "privacy", title: "Privacy Policy", content: "_Last updated: October 2026_\n\nSmart Lead Systems (\"we\", \"us\") respects your privacy. This policy explains what information we collect through smartlead.ng and how we use it.\n\n## Information we collect\n\n- **Contact details you send us**: name, email, phone/WhatsApp number, the service you are interested in and your message, when you use our contact form, email or WhatsApp.\n- **Usage data**: if you accept cookies, we use analytics and advertising tools (such as Google Analytics and the Meta Pixel) to understand how the site is used and to measure our ads.\n\n## How we use it\n\nWe use your details to reply to your enquiry, prepare quotes, provide our services and improve the website. We do not sell your personal information.\n\n## Who we share it with\n\nWe use trusted providers to run the site and process data, such as Google Firebase, Netlify, Google and Meta. They process data on our behalf under their own privacy terms.\n\n## Cookies\n\nAnalytics and advertising cookies are only loaded after you accept them in the cookie banner. You can change your choice by clearing your browser storage for this site.\n\n## Your rights\n\nDepending on where you live (for example under UK GDPR or the Nigeria Data Protection Act), you may ask to access, correct or delete your personal data. Email us at hello@smartlead.ng and we will respond.\n\n## Contact\n\nSmart Lead Systems, Lagos, Nigeria. Email: hello@smartlead.ng" },
    { id: "terms", title: "Terms of Service", content: "_Last updated: October 2026_\n\nBy using smartlead.ng you agree to these terms.\n\n## Use of this website\n\nThe content on this website is provided for general information about Smart Lead Systems and our services. You may not misuse the site or attempt to disrupt it.\n\n## Our services\n\nProject scope, pricing, timelines and deliverables are agreed in writing (a quote, proposal or contract) before work begins. Prices shown on this website are starting points only and are not a binding offer.\n\n## Intellectual property\n\nThe text, design and code of this website belong to Smart Lead Systems unless stated otherwise. Ownership of work we create for clients is set out in each client agreement.\n\n## Liability\n\nWe work to keep information accurate, but we provide the website as-is and are not liable for losses from relying on it. Results from marketing and advertising depend on many factors and are not guaranteed.\n\n## Changes\n\nWe may update these terms from time to time. Continued use of the site means you accept the updated terms.\n\n## Contact\n\nQuestions? Email hello@smartlead.ng." }
  ]
};
