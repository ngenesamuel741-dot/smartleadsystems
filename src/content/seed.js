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
    siteDescription: "Smart Lead Systems is a Nigerian full-stack digital growth agency for e-commerce brands and fintech startups in the UK, US and Nigeria: website development, mobile apps, Meta and Google Ads, graphics, video editing, AI automation and social media management.",
    heroEyebrow: "FULL-STACK DIGITAL GROWTH AGENCY · E-COMMERCE & FINTECH",
    heroLine1: "Build better.",
    heroLine2: "Get seen.",
    heroLine3: "Grow smarter.",
    heroText: "Smart Lead Systems brings development, paid growth and creative execution under one roof, so e-commerce brands and fintech startups can stop piecing digital work together and start moving with a real system.",
    heroCta: "Start a conversation",
    approachTitle: "Not seven separate vendors.",
    approachAccent: "One capable team.",
    approachText1: "Most growing businesses don't need more people to manage. They need the right digital pieces to work together.",
    approachText2: "We build the website, shape the creative, launch the ads, edit the content and automate repetitive work, with the goal of making your business easier to discover, trust and buy from.",
    pricingTitle: "Clear pricing, built around your goals.",
    pricingNote: "Prices are starting points. Your final quote depends on scope, timeline and the channels involved.",
    ctaEyebrow: "READY WHEN YOU ARE",
    ctaTitle: "Bring us the business problem.",
    ctaAccent: "Let's build the solution.",
    ctaText: "From a new website to a full growth push, Smart Lead Systems is built for businesses that want capable execution without hiring six different people.",
    waMessage: "Hi Smart Lead Systems, I'd like to talk about a project for my business. Can you help?",
    waMessageThanks: "Hi Smart Lead Systems, I just sent a message through your website and wanted to follow up.",
    footerText: "Best-in-class digital growth services for e-commerce brands and fintech startups ready to build, reach and grow.",
    contactTitle: "Tell us what you're trying to",
    contactAccent: "build or grow.",
    thanksTitle: "Thank you. We've got your message.",
    thanksText: "One of our team will reach out to you within the next 24 hours. If it's urgent, message us on WhatsApp.",
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
    { id: "web-development", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your website development service. Can you tell me how to get started?", title: "Website Development", accent: "BUILD", order: 1, image: img("photo-1559028012-481c04fa702d"), description: "We design and develop fast, modern websites and online stores that make businesses look credible, explain their offer clearly and turn attention into sales and leads.", capabilities: ["Business websites", "E-commerce stores", "Landing pages", "Custom web applications", "CMS integrations", "Performance & SEO", "Forms & lead capture", "Payment & third-party integrations"] },
    { id: "app-development", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your mobile app development service. Can you tell me how to get started?", title: "App / Mobile Development", accent: "BUILD", order: 2, image: img("photo-1551650975-87deedd944c3"), description: "We turn useful ideas into polished mobile products with clean user experiences, reliable foundations and room to grow, including fintech and customer-facing apps.", capabilities: ["Product discovery", "Mobile UI/UX", "iOS & Android", "API integration", "Authentication", "Dashboards", "Notifications", "Production-ready foundations"] },
    { id: "meta-ads", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your Meta and Google Ads management service. Can you tell me how to get started?", title: "Meta & Google Ads Management", accent: "GROW", order: 3, image: img("photo-1460925895917-afdab827c52f"), description: "We build and manage Facebook, Instagram and Google advertising systems around the offer, creative, audience, tracking and conversion path.", capabilities: ["Campaign strategy", "Facebook & Instagram Ads", "Google Ads", "Creative testing", "Lead generation", "Sales campaigns", "Retargeting", "Pixel & conversion tracking", "Reporting & optimisation"] },
    { id: "graphics-design", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your graphics design service. Can you tell me how to get started?", title: "Graphics Design", accent: "CREATE", order: 4, image: img("photo-1558655146-d09347e92766"), description: "We create digital-first graphics that make online businesses look established, consistent and ready to compete.", capabilities: ["Social media graphics", "Ad creatives", "Brand identity assets", "Campaign visuals", "Product graphics", "Carousels", "Promotional designs", "Marketing collateral"] },
    { id: "video-editing", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your video editing service. Can you tell me how to get started?", title: "Video Editing", accent: "MOVE", order: 5, image: img("photo-1492619375914-88005aa9e8fb"), description: "We edit short-form and marketing videos for attention, clarity and action across social platforms and paid campaigns.", capabilities: ["Short-form video", "Reels & TikTok", "Ad editing", "Captions & subtitles", "Motion graphics", "Talking-head edits", "Content repurposing", "Platform-ready exports"] },
    { id: "ai-automation", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your AI automation service. Can you tell me how to get started?", title: "AI Automation", accent: "AUTOMATE", order: 6, image: img("photo-1677442136019-21780ecad995"), description: "We design practical AI-powered workflows that reduce repetitive work, speed up lead handling and help teams do more with less manual effort.", capabilities: ["AI assistants", "Lead workflows", "Content workflows", "Data processing", "CRM automation", "Notifications", "Internal tools", "Workflow design"] },
    { id: "social-media", waMessage: "Hi Smart Lead Systems, I'd like to sign up for your social media management service. Can you tell me how to get started?", title: "Social Media Management", accent: "STAY SEEN", order: 7, image: img("photo-1611162617474-5b21e879e113"), description: "We build consistent social content systems that keep your brand visible, useful and recognisable without posting just for the sake of posting.", capabilities: ["Content strategy", "Content calendars", "Publishing", "Community management", "Platform optimisation", "Analytics", "Creative direction", "Growth experiments"] }
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
    { id: "what-do-you-do", order: 1, question: "What does Smart Lead Systems do?", answer: "Smart Lead Systems is a full-stack digital growth agency based in Lagos, Nigeria. We build websites and apps, run Meta and Google Ads, design graphics, edit video, build AI automations and manage social media, so you work with one team instead of several vendors." },
    { id: "who-for", order: 2, question: "Who do you work with?", answer: "We focus on e-commerce brands and fintech startups, and we work with businesses in the UK, the US and Nigeria." },
    { id: "cost", order: 3, question: "How much does a website or ad management cost?", answer: "It depends on scope. Our pricing page lists starting points, and we confirm a fixed quote after understanding your goals, pages or features needed and the channels involved." },
    { id: "timeline", order: 4, question: "How long does a project take?", answer: "Timelines depend on scope. We agree a clear schedule in your quote so you know what to expect before work begins." },
    { id: "start", order: 5, question: "How do we get started?", answer: "Send us a message through the contact form or WhatsApp with what you want to build or grow. We'll reply with the right next step." }
  ],
  process: [
    { id: "p1", order: 1, title: "Understand", description: "We start with the business, the offer, the audience and what you actually need to achieve." },
    { id: "p2", order: 2, title: "Build", description: "We design and develop the right digital assets instead of forcing your problem into a template." },
    { id: "p3", order: 3, title: "Launch", description: "We put the work into the real world: publishing, deploying, advertising and connecting the pieces." },
    { id: "p4", order: 4, title: "Improve", description: "We learn from what happens next and keep improving the creative, experience and system." }
  ],
  industries: [
    { id: "ecommerce", order: 1, title: "E-commerce brands", description: "Stores that load fast, build trust and turn ad traffic into orders.", points: ["Conversion-focused storefronts", "Product creative and short video", "Meta and Google Ads for sales", "Retargeting and email/WhatsApp flows"] },
    { id: "fintech", order: 2, title: "Fintech startups", description: "Credible, clear digital experiences for products that handle people's money.", points: ["Trust-first websites and landing pages", "Mobile app and dashboard development", "Acquisition campaigns and tracking", "AI automation for onboarding and support"] }
  ],
  formfields: [
    { id: "name", key: "name", label: "Name", type: "text", required: true, placeholder: "", options: [], disqualify: [], order: 1, visible: true },
    { id: "email", key: "email", label: "Email", type: "email", required: true, placeholder: "", options: [], disqualify: [], order: 2, visible: true },
    { id: "phone", key: "phone", label: "Phone / WhatsApp (optional)", type: "phone", required: false, placeholder: "", options: [], disqualify: [], order: 3, visible: true },
    { id: "company", key: "company", label: "Company / brand (optional)", type: "text", required: false, placeholder: "", options: [], disqualify: [], order: 4, visible: true },
    { id: "service", key: "service", label: "What do you need?", type: "select", required: false, placeholder: "Select a service", options: [], disqualify: [], order: 5, visible: true },
    { id: "budget", key: "budget", label: "What is your monthly budget?", type: "select", required: false, placeholder: "Select a range", options: ["Under $300", "$300 - $750", "$750 - $2,000", "$2,000+"], disqualify: [], order: 6, visible: false },
    { id: "message", key: "message", label: "Message", type: "textarea", required: true, placeholder: "Tell us about your business and what you're trying to achieve.", options: [], disqualify: [], order: 7, visible: true }
  ],
  pages: [
    { id: "privacy", title: "Privacy Policy", content: "_Last updated: October 2026_\n\nSmart Lead Systems (\"we\", \"us\") respects your privacy. This policy explains what information we collect through smartlead.ng and how we use it.\n\n## Information we collect\n\n- **Contact details you send us**: name, email, phone/WhatsApp number, the service you are interested in and your message, when you use our contact form, email or WhatsApp.\n- **Usage data**: if you accept cookies, we use analytics and advertising tools (such as Google Analytics and the Meta Pixel) to understand how the site is used and to measure our ads.\n\n## How we use it\n\nWe use your details to reply to your enquiry, prepare quotes, provide our services and improve the website. We do not sell your personal information.\n\n## Who we share it with\n\nWe use trusted providers to run the site and process data, such as Google Firebase, Netlify, Google and Meta. They process data on our behalf under their own privacy terms.\n\n## Cookies\n\nAnalytics and advertising cookies are only loaded after you accept them in the cookie banner. You can change your choice by clearing your browser storage for this site.\n\n## Your rights\n\nDepending on where you live (for example under UK GDPR or the Nigeria Data Protection Act), you may ask to access, correct or delete your personal data. Email us at hello@smartlead.ng and we will respond.\n\n## Contact\n\nSmart Lead Systems, Lagos, Nigeria. Email: hello@smartlead.ng" },
    { id: "terms", title: "Terms of Service", content: "_Last updated: October 2026_\n\nBy using smartlead.ng you agree to these terms.\n\n## Use of this website\n\nThe content on this website is provided for general information about Smart Lead Systems and our services. You may not misuse the site or attempt to disrupt it.\n\n## Our services\n\nProject scope, pricing, timelines and deliverables are agreed in writing (a quote, proposal or contract) before work begins. Prices shown on this website are starting points only and are not a binding offer.\n\n## Intellectual property\n\nThe text, design and code of this website belong to Smart Lead Systems unless stated otherwise. Ownership of work we create for clients is set out in each client agreement.\n\n## Liability\n\nWe work to keep information accurate, but we provide the website as-is and are not liable for losses from relying on it. Results from marketing and advertising depend on many factors and are not guaranteed.\n\n## Changes\n\nWe may update these terms from time to time. Continued use of the site means you accept the updated terms.\n\n## Contact\n\nQuestions? Email hello@smartlead.ng." }
  ]
};
