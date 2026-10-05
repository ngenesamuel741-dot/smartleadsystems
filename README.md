# Smart Lead Systems

Full-stack agency website built with React/Vite, Firebase Authentication + Firestore and Cloudinary uploads.

## Public site
Home, Services, Work, Blog, individual posts, Founders and Contact.

## CMS
Open /admin after Firebase setup. Create an Email/Password Firebase user and enable Firestore. The CMS can create, edit and delete blog posts and portfolio projects, including media uploads through a Cloudinary unsigned upload preset.

## Setup
1. npm install
2. Fill the Firebase and Cloudinary placeholders in src/config.js
3. Enable Firebase Authentication (Email/Password)
4. Enable Firestore
5. Create a Cloudinary unsigned upload preset
6. npm run dev

Never commit Firebase Admin service-account private keys or Cloudinary API secrets.

## SEO / AI discovery
The project includes metadata, canonical URLs, JSON-LD, robots.txt, sitemap.xml, llm.txt and txt.llm. Replace smartlead.ng if the production domain differs.
