// ============================================================
//  Footer.jsx — InterviewIQ
//  Social links: Instagram, Gmail, Facebook, Twitter/X,
//                LinkedIn, GitHub, YouTube
//  Usage: drop <Footer /> at the bottom of any page
// ============================================================

import { Link } from "react-router-dom";

// ── SVG Social Icons ─────────────────────────────────────
// All icons are inline SVG — no icon library needed.
// Each is 20x20, stroke-based, clean and consistent.

const Icons = {
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Gmail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  ),
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Twitter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  YouTube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  ),
};

// ── Social links config — update hrefs to your real URLs ──
const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/yourhandle",
    Icon: Icons.Instagram,
    hoverColor: "hover:text-pink-500",
  },
  {
    name: "Gmail",
    href: "mailto:boorsunikhil2001@gmail.com",
    Icon: Icons.Gmail,
    hoverColor: "hover:text-red-500",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/yourpage",
    Icon: Icons.Facebook,
    hoverColor: "hover:text-blue-600",
  },
  {
    name: "Twitter / X",
    href: "https://twitter.com/yourhandle",
    Icon: Icons.Twitter,
    hoverColor: "hover:text-sky-400",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nikhil-boorsu-787a02311/",
    Icon: Icons.LinkedIn,
    hoverColor: "hover:text-blue-500",
  },
  {
    name: "GitHub",
    href: "https://github.com/boorsunikhil",
    Icon: Icons.GitHub,
    hoverColor: "hover:text-base-content",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@yourchannel",
    Icon: Icons.YouTube,
    hoverColor: "hover:text-red-600",
  },
];

// ── Footer nav links ──
const footerLinks = [
  { label: "About", to: "/aboutUs" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "History", to: "/history" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];

// ── Logo (same as Navbar) ──
function FooterLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="11" r="3" fill="white" />
          <circle cx="29" cy="17" r="2.5" fill="white" opacity=".8" />
          <circle cx="29" cy="26" r="2.5" fill="white" opacity=".8" />
          <circle cx="20" cy="30" r="3" fill="white" />
          <circle cx="11" cy="26" r="2.5" fill="white" opacity=".8" />
          <circle cx="11" cy="17" r="2.5" fill="white" opacity=".8" />
          <circle cx="20" cy="20" r="3" fill="white" />
          <line x1="20" y1="14" x2="20" y2="17" stroke="white" strokeWidth="1.8" />
          <line x1="27" y1="18.5" x2="23" y2="19" stroke="white" strokeWidth="1.8" />
          <line x1="27" y1="24.5" x2="23" y2="21" stroke="white" strokeWidth="1.8" />
          <line x1="20" y1="27" x2="20" y2="23" stroke="white" strokeWidth="1.8" />
          <line x1="13" y1="24.5" x2="17" y2="21" stroke="white" strokeWidth="1.8" />
          <line x1="13" y1="18.5" x2="17" y2="19" stroke="white" strokeWidth="1.8" />
        </svg>
      </div>
      <span
        className="text-lg font-extrabold tracking-tight"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        Interview<span className="text-primary">IQ</span>
      </span>
    </div>
  );
}

// ── Main Footer Component ──────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-100 border-t border-base-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Top row — logo + tagline on left, nav links on right */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">

          {/* Left — brand */}
          <div className="max-w-xs">
            <FooterLogo />
            <p className="text-sm text-base-content/50 mt-3 leading-relaxed">
              AI-powered interview preparation platform. Practice technical,
              HR, and coding interviews with real-time feedback.
            </p>
          </div>

          {/* Right — nav links in two columns */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-3">
                Product
              </p>
              <ul className="space-y-2">
                {footerLinks.slice(0, 3).map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-base-content/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-3">
                Legal
              </p>
              <ul className="space-y-2">
                {footerLinks.slice(3).map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-base-content/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-0" />

        {/* Bottom row — copyright left, social icons right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">

          {/* Copyright */}
          <p className="text-xs text-base-content/40 font-mono">
            © {currentYear} InterviewIQ. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-1">
            {socialLinks.map(({ name, href, Icon, hoverColor }) => (
              <a
                key={name}
                href={href}
                target={href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center
                  text-base-content/40 ${hoverColor}
                  hover:bg-base-200 transition-all duration-200
                `}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}