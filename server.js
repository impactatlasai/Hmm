// server.ts
import "dotenv/config";
import express from "express";
import fs3 from "fs";
import path3 from "path";
import crypto6 from "crypto";
import zlib from "zlib";
import { createServer as createViteServer } from "vite";

// src/data/coursesData.ts
var COURSE_CATEGORIES = [
  {
    slug: "ai-literacy",
    title: "AI Literacy & Foundation",
    tierAccent: "literacy",
    levelLabel: "Entry Level \xB7 6 Programmes (2 Free \xB7 4 Paid)",
    shortDescription: "AI \u0995\u09C0, \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7, Prompt Engineering, \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 productivity \u098F\u09AC\u0982 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u0993 \u09A8\u09C8\u09A4\u09BF\u0995 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09B6\u0995\u09CD\u09A4 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0964",
    bannerOverview: "\u09A8\u09A4\u09C1\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09EC\u099F\u09BF \u0995\u09BE\u09A0\u09BE\u09AE\u09CB\u09AC\u09A6\u09CD\u09A7 Foundation \u0995\u09CB\u09B0\u09CD\u09B8\u2014\u09AF\u09BE\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09E8\u099F\u09BF \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 (FREE) \u098F\u09AC\u0982 \u09EA\u099F\u09BF \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09BF\u0995 \u0995\u09CB\u09B0\u09CD\u09B8 (\u09F3999\u2013\u09F31,499)\u0964",
    feeRange: "FREE \xB7 \u09F3999 \u2013 \u09F31,499",
    homeCourseList: [
      "AI Fundamentals & Digital Literacy (FREE)",
      "AI Governance Fundamentals (FREE)",
      "Generative AI & Prompt Engineering (\u09F3999)",
      "AI for Everyday & Professional Productivity (\u09F3999)",
      "AI Safety, Ethics & Responsible Use (\u09F3999)",
      "AI Tools Literacy & Prompt Engineering (\u09F31,499)"
    ]
  },
  {
    slug: "applied-ai",
    title: "Applied AI",
    tierAccent: "applied",
    levelLabel: "Practical Track \xB7 4 Programmes",
    shortDescription: "Content creation, entrepreneurship, no-code automation \u098F\u09AC\u0982 website development-\u098F AI-\u098F\u09B0 \u09B9\u09BE\u09A4\u09C7-\u0995\u09B2\u09AE\u09C7 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u09AA\u09CD\u09B0\u09DF\u09CB\u0997\u0964",
    bannerOverview: "\u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09EA\u099F\u09BF Applied AI \u0995\u09CB\u09B0\u09CD\u09B8\u2014\u09AF\u09BE\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09A4\u09C8\u09B0\u09BF, \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09DF\u09BF\u0995 \u09AA\u09CD\u09B0\u09DF\u09CB\u0997, \u0985\u099F\u09CB\u09AE\u09C7\u09B6\u09A8 \u0993 \u0993\u09DF\u09C7\u09AC \u09A1\u09C7\u09AD\u09C7\u09B2\u09AA\u09AE\u09C7\u09A8\u09CD\u099F \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09DF (\u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u0995\u09CB\u09B0\u09CD\u09B8 BDT 1,200)\u0964",
    feeRange: "BDT 1,200 per course",
    homeCourseList: [
      "AI-Powered Content Creation (AP-201)",
      "AI for Business & Entrepreneurship (AP-202)",
      "AI Automation & Workflow Design (AP-203)",
      "AI-Powered Website Development (AP-204)"
    ]
  },
  {
    slug: "professional-development",
    title: "Professional Development",
    tierAccent: "professional",
    levelLabel: "Professional Track \xB7 7 Programmes",
    shortDescription: "Workplace productivity, business development, leadership, project, marketing, HR \u0993 financial management-\u098F \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 AI \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u0964",
    bannerOverview: "\u0995\u09B0\u09CD\u09AE\u099C\u09C0\u09AC\u09C0 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0, \u099F\u09BF\u09AE \u09B2\u09BF\u09A1\u09BE\u09B0 \u0993 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09BE\u09B0\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09ED\u099F\u09BF \u09B8\u09CD\u09AC\u09A4\u09A8\u09CD\u09A4\u09CD\u09B0 \u09EA-\u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE (\u09EE\u099F\u09BF \u0995\u09CD\u09B2\u09BE\u09B8, Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F\u09B8\u09B9, \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF BDT 2,500)\u0964",
    feeRange: "BDT 2,500 per course",
    homeCourseList: [
      "AI for Professionals & Workplace Productivity",
      "AI for Business Development",
      "AI Leadership & Strategic Management",
      "AI for Project Management & 3 more tracks"
    ]
  },
  {
    slug: "specialised-programmes",
    title: "Specialised Programmes",
    tierAccent: "specialised",
    levelLabel: "Social Impact & Institutional Advisory",
    shortDescription: "Women's Safety in the AI Era (FREE) \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8, \u0985\u09AB\u09BF\u09B8, \u09AC\u09BF\u09B6\u09CD\u09AC\u09AC\u09BF\u09A6\u09CD\u09AF\u09BE\u09B2\u09DF \u0993 \u098F\u09A8\u099C\u09BF\u0993-\u0997\u09C1\u09B2\u09CB\u09B0 \u099C\u09A8\u09CD\u09AF \u09EE\u099F\u09BF Institutional Training & Advisory Services\u0964",
    bannerOverview: "\u09B8\u09BE\u09AE\u09BE\u099C\u09BF\u0995 \u09B8\u099A\u09C7\u09A4\u09A8\u09A4\u09BE \u0993 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09AC\u09BF\u09B6\u09C7\u09B7\u09BE\u09DF\u09BF\u09A4 \u09B2\u09BE\u09B0\u09CD\u09A8\u09BF\u0982 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE (Section A) \u098F\u09AC\u0982 \u0995\u09B0\u09CD\u09AA\u09CB\u09B0\u09C7\u099F, \u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u0985\u09AB\u09BF\u09B8, \u09AC\u09BF\u09B6\u09CD\u09AC\u09AC\u09BF\u09A6\u09CD\u09AF\u09BE\u09B2\u09DF \u0993 \u098F\u09A8\u099C\u09BF\u0993-\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09AA\u09CD\u09B0\u09B6\u09BF\u0995\u09CD\u09B7\u09A3 \u0993 \u09AA\u09B0\u09BE\u09AE\u09B0\u09CD\u09B6 \u09B8\u09C7\u09AC\u09BE (Section B)\u0964",
    feeRange: "FREE Community Track + Institutional Advisory",
    homeCourseList: [
      "Women's Safety in the AI Era (FREE)",
      "Employees & Executive AI Training",
      "AI Readiness Assessment (3 Pathways)",
      "AI Implementation Roadmap & Governance"
    ]
  }
];
function getCategoryEnrolmentInfo(slug) {
  switch (slug) {
    case "ai-literacy":
      return {
        seatCapacity: 45,
        seatLabel: "Max 45 seats per batch",
        seatDescription: "Interactive mentoring \u0993 feedback \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AC\u09CD\u09AF\u09BE\u099A\u09C7 \u09B8\u09C0\u09AE\u09BF\u09A4 \u0986\u09B8\u09A8\u0964",
        certificateLabel: "Certificate of Participation / Completion"
      };
    case "applied-ai":
      return {
        seatCapacity: 30,
        seatLabel: "Max 30 seats per batch",
        seatDescription: "Hands-on \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B0\u09BF\u09AD\u09BF\u0989 \u0993 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09C7\u09AC\u09B2 \u09AB\u09BF\u09A1\u09AC\u09CD\u09AF\u09BE\u0995\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 \u09AC\u09CD\u09AF\u09BE\u099A\u0964",
        certificateLabel: "Completion Certificate (Applied Project)"
      };
    case "professional-development":
      return {
        seatCapacity: 25,
        seatLabel: "Max 25 seats per cohort",
        seatDescription: "Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B0\u09BF\u09AD\u09BF\u0989 \u0993 \u09AA\u09C7\u09B6\u09BE\u09A6\u09BE\u09B0 \u0995\u09C7\u09B8 \u09A1\u09BF\u09B8\u0995\u09BE\u09B6\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 \u0995\u09CB\u09B9\u09B0\u09CD\u099F\u0964",
        certificateLabel: "Professional Completion Certificate (Non-Accredited)"
      };
    default:
      return void 0;
  }
}
var PD_COMMON_NOTES = [
  "\u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u0995\u09CB\u09B0\u09CD\u09B8 \u09B8\u09CD\u09AC\u09A4\u09A8\u09CD\u09A4\u09CD\u09B0 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE; \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09AD\u09B0\u09CD\u09A4\u09BF \u09B9\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AC\u09C7\u0964",
  "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09AE\u09CB\u099F \u09EE\u099F\u09BF \u09B8\u09C7\u09B6\u09A8 (\u09B2\u09BE\u0987\u09AD \u0985\u09A8\u09B2\u09BE\u0987\u09A8), \u099A\u09C2\u09A1\u09BC\u09BE\u09A8\u09CD\u09A4 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09B8\u09C2\u099A\u09BF \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 \u09B8\u09AE\u09AF\u09BC \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
  "\u09B9\u09BE\u09A4\u09C7-\u0995\u09B2\u09AE\u09C7 \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u0993 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09B8\u0982\u09AF\u09CB\u0997 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u0964",
  "\u09AA\u09CD\u09B0\u09AF\u09CB\u099C\u09CD\u09AF \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u09AB\u09CD\u09B0\u09BF \u0993 \u09AA\u09C7\u0987\u09A1 AI \u099F\u09C1\u09B2 \u09AA\u09CD\u09B0\u09A6\u09B0\u09CD\u09B6\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7; \u09AA\u09C3\u09A5\u0995 \u099F\u09C1\u09B2 \u09B8\u09BE\u09AC\u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u09AB\u09BF \u0995\u09CB\u09B0\u09CD\u09B8 \u09AB\u09BF-\u098F\u09B0 \u0985\u09A8\u09CD\u09A4\u09B0\u09CD\u09AD\u09C1\u0995\u09CD\u09A4 \u09A8\u09AF\u09BC\u0964",
  "\u0995\u09CB\u09B0\u09CD\u09B8 \u09B8\u09AE\u09BE\u09AA\u09CD\u09A4\u09BF \u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09B8\u09CD\u09AC\u09C0\u0995\u09C3\u09A4\u09BF (accreditation), \u099A\u09BE\u0995\u09B0\u09BF\u09B0 \u09A8\u09BF\u09B6\u09CD\u099A\u09AF\u09BC\u09A4\u09BE \u09AC\u09BE \u09A8\u09BF\u09B0\u09CD\u09A6\u09BF\u09B7\u09CD\u099F \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09AF\u09BC\u09BF\u0995 \u09AB\u09B2\u09BE\u09AB\u09B2\u09C7\u09B0 \u0997\u09CD\u09AF\u09BE\u09B0\u09BE\u09A8\u09CD\u099F\u09BF \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09C7 \u09A8\u09BE\u0964"
];
var COURSES = [
  // =========================================================================
  // CATEGORY 1: AI LITERACY & FOUNDATION (6 Courses: FREE, AL-100 .. AL-104)
  // =========================================================================
  {
    code: "FREE",
    slug: "ai-fundamentals-digital-literacy-masterclass",
    title: "AI Fundamentals & Digital Literacy",
    categorySlug: "ai-literacy",
    categoryName: "AI Literacy & Foundation",
    tierAccent: "free",
    tierLabel: "Free Masterclass",
    chipLabel: "AI Literacy & Foundation",
    level: "Beginner",
    hook: "AI \u0995\u09C0, \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7 \u098F\u09AC\u0982 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6\u09C7 \u0993 \u09B8\u099A\u09C7\u09A4\u09A8\u09AD\u09BE\u09AC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09AC\u09C7\u09A8\u2014\u09B6\u09C1\u09B0\u09C1 \u09B9\u09CB\u0995 \u09AA\u09CD\u09B0\u09A4\u09BF \u09AE\u09BE\u09B8\u09C7\u09B0 \u098F\u0987 \u0989\u09A8\u09CD\u09AE\u09C1\u0995\u09CD\u09A4 \u09B8\u09C7\u09B6\u09A8 \u09A6\u09BF\u09AF\u09BC\u09C7 (FREE)\u0964",
    overview: "\u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 Artificial Intelligence \u0995\u09C0, \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7 \u098F\u09AC\u0982 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u099C\u09C0\u09AC\u09A8, \u09B6\u09BF\u0995\u09CD\u09B7\u09BE \u0993 \u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09C3\u09A4 \u09B9\u09AF\u09BC, \u09A4\u09BE \u09B8\u09B9\u099C \u09AD\u09BE\u09B7\u09BE\u09AF\u09BC \u0993 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u0989\u09A6\u09BE\u09B9\u09B0\u09A3\u09B8\u09B9 \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964 \u09AF\u09BE\u09B0\u09BE AI \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u098F\u0995\u09C7\u09AC\u09BE\u09B0\u09C7 \u09A8\u09A4\u09C1\u09A8, \u09A4\u09BE\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u099F\u09BF \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u098F\u09AC\u0982 \u09B8\u09B0\u09CD\u09AC\u09CB\u09A4\u09CD\u09A4\u09AE \u09B6\u09C1\u09B0\u09C1\u09B0 \u0995\u09CB\u09B0\u09CD\u09B8\u0964",
    duration: "Monthly Open Session \xB7 2\u20132.5 Hours",
    fee: "BDT 0",
    feeNote: "Completely Free \xB7 Monthly Open Session",
    isFree: true,
    imageUrl: "/src/assets/images/course_ai_literacy_session_1794924850721.jpg",
    imageAlt: "AI Fundamentals & Digital Literacy interactive community session",
    whoThisCourseIsFor: [
      "AI \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u0995\u09CB\u09A8\u09CB \u09AA\u09C2\u09B0\u09CD\u09AC \u09A7\u09BE\u09B0\u09A3\u09BE \u09A8\u09C7\u0987 \u098F\u09AE\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF",
      "\u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 AI-\u098F\u09B0 \u09AD\u09C2\u09AE\u09BF\u0995\u09BE \u09AC\u09C1\u099D\u09A4\u09C7 \u099A\u09BE\u09A8 \u098F\u09AE\u09A8 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0",
      "\u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 AI \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B6\u0995\u09CD\u09A4 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8 \u098F\u09AE\u09A8 \u09AF\u09C7 \u0995\u09C7\u0989"
    ],
    keyAreas: [
      "Introduction to Artificial Intelligence",
      "How AI Learns from Data & Models",
      "AI in Everyday Life & Public Services",
      "Understanding the AI Ecosystem & Tools"
    ],
    learningOutcomes: [
      "AI-\u098F\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE, \u0987\u09A4\u09BF\u09B9\u09BE\u09B8 \u098F\u09AC\u0982 ML \u0993 Deep Learning-\u098F\u09B0 \u09AE\u09C2\u09B2 \u09AA\u09BE\u09B0\u09CD\u09A5\u0995\u09CD\u09AF \u09B8\u09B9\u099C\u09AD\u09BE\u09AC\u09C7 \u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u099C\u09C0\u09AC\u09A8, \u09B6\u09BF\u0995\u09CD\u09B7\u09BE, \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u0993 \u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 AI-\u098F\u09B0 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "AI \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A4\u09A5\u09CD\u09AF \u09A5\u09C7\u0995\u09C7 \u09B6\u09C7\u0996\u09C7 \u0993 \u0986\u0989\u099F\u09AA\u09C1\u099F \u09A6\u09C7\u09AF\u09BC \u098F\u09AC\u0982 \u098F\u09B0 \u09B8\u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u0993 \u09B8\u09C0\u09AE\u09BE\u09AC\u09A6\u09CD\u09A7\u09A4\u09BE \u0995\u09CB\u09A5\u09BE\u09AF\u09BC \u09A4\u09BE \u099A\u09BF\u09A8\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 AI learning journey \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u09C0\u09AF\u09BC \u09AA\u09B0\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Introduction to Artificial Intelligence \u2014 AI-\u098F\u09B0 \u09AE\u09C2\u09B2 \u09A7\u09BE\u09B0\u09A3\u09BE \u0993 \u0987\u09A4\u09BF\u09B9\u09BE\u09B8",
        topics: [
          "What is Artificial Intelligence?",
          "Evolution and development of AI",
          "AI, Machine Learning and Deep Learning-\u098F\u09B0 \u09AA\u09BE\u09B0\u09CD\u09A5\u0995\u09CD\u09AF",
          "Narrow AI and Generative AI",
          "Everyday examples of AI"
        ]
      },
      {
        code: "Module 2",
        title: "How AI Works \u2014 \u09A4\u09A5\u09CD\u09AF \u09A5\u09C7\u0995\u09C7 \u09B6\u09C7\u0996\u09BE \u098F\u09AC\u0982 \u09B8\u09BF\u09A6\u09CD\u09A7\u09BE\u09A8\u09CD\u09A4 \u09A4\u09C8\u09B0\u09BF\u09B0 \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09BE",
        topics: [
          "AI \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A4\u09A5\u09CD\u09AF \u09A5\u09C7\u0995\u09C7 \u09B6\u09C7\u0996\u09C7",
          "Data, Algorithms and Models-\u098F\u09B0 \u09A7\u09BE\u09B0\u09A3\u09BE",
          "Training and Inference-\u098F\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE",
          "AI \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 prediction \u0993 recommendation \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C7",
          "AI-\u098F\u09B0 \u09B8\u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u0993 \u09B8\u09C0\u09AE\u09BE\u09AC\u09A6\u09CD\u09A7\u09A4\u09BE"
        ]
      },
      {
        code: "Module 3",
        title: "AI in Everyday Life \u2014 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 AI-\u098F\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997",
        topics: [
          "AI in Education, Healthcare and Business",
          "AI in Communication",
          "AI in Government and Public Services",
          "AI in Research and Innovation"
        ]
      },
      {
        code: "Module 4",
        title: "Understanding the AI Ecosystem \u2014 AI tools \u0993 \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995",
        topics: [
          "AI tools and platforms-\u098F\u09B0 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u09BF",
          "Generative AI-\u098F\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE",
          "AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE\u09B0 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF",
          "Human Intelligence and AI-\u098F\u09B0 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995"
        ]
      }
    ],
    practicalSkills: [
      "\u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 AI application \u09B6\u09A8\u09BE\u0995\u09CD\u09A4 \u0995\u09B0\u09BE",
      "\u0995\u09CB\u09A8 \u0995\u09BE\u099C\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE \u09AF\u09BE\u09AF\u09BC \u09A4\u09BE \u09AC\u09CB\u099D\u09BE",
      "AI-generated output-\u098F\u09B0 \u09B8\u09C0\u09AE\u09BE\u09AC\u09A6\u09CD\u09A7\u09A4\u09BE \u099A\u09C7\u09A8\u09BE",
      "\u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0995\u09BE\u099C\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09B8\u09C1\u09AF\u09CB\u0997 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4 \u0995\u09B0\u09BE"
    ],
    outsideScope: [
      "Programming or Python for AI",
      "Machine Learning Model Development",
      "Advanced Prompt Engineering",
      "Professional AI Automation"
    ],
    programmeNotes: [
      "\u09AA\u09CD\u09B0\u09A4\u09BF \u09AE\u09BE\u09B8\u09C7 \u09E7\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0989\u09A8\u09CD\u09AE\u09C1\u0995\u09CD\u09A4 \u09B8\u09C7\u09B6\u09A8 \u0986\u09AF\u09BC\u09CB\u099C\u09A8 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC (\u09B8\u09AE\u09AF\u09BC\u0995\u09BE\u09B2 \u09E8\u2013\u09E8.\u09EB \u0998\u09A3\u09CD\u099F\u09BE, \u09AB\u09BF BDT 0)\u0964",
      "\u0995\u09CB\u09A8\u09CB \u09AC\u09CD\u09AF\u09BE\u0982\u0995 \u0995\u09BE\u09B0\u09CD\u09A1, \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AA\u09BF\u09A8 \u09AC\u09BE \u09AB\u09BF \u099A\u09BE\u0993\u09AF\u09BC\u09BE \u09B9\u09AF\u09BC \u09A8\u09BE; \u0995\u09C7\u09AC\u09B2 \u0986\u09B8\u09A8 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09A4\u09C7 \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09A8 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u0964"
    ],
    prerequisites: "\u0995\u09CB\u09A8\u09CB \u09AA\u09C2\u09B0\u09CD\u09AC \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE \u09AC\u09BE \u0995\u09CB\u09A1\u09BF\u0982 \u099C\u09CD\u099E\u09BE\u09A8 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u09A8\u09C7\u0987\u0964 \u09AF\u09C7 \u0995\u09C7\u0989 \u0985\u0982\u09B6 \u09A8\u09BF\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
    assessment: "\u0989\u09A8\u09CD\u09AE\u09C1\u0995\u09CD\u09A4 \u0985\u0982\u09B6\u0997\u09CD\u09B0\u09B9\u09A3, \u09B2\u09BE\u0987\u09AD \u0995\u09C1\u0987\u099C \u0993 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09CB\u09A4\u09CD\u09A4\u09B0 \u09B8\u09C7\u09B6\u09A8\u09C7 \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u0989\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4\u09BF\u0964",
    certificate: "\u09B8\u09C7\u09B6\u09A8\u09C7 \u09AA\u09C2\u09B0\u09CD\u09A3 \u0985\u0982\u09B6\u0997\u09CD\u09B0\u09B9\u09A3\u09C7\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u09A4\u09C7 Non-accredited Certificate of Participation \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u0964",
    registrationNote: "\u09AA\u09CD\u09B0\u09A4\u09BF \u09AE\u09BE\u09B8\u09C7 \u09E7\u099F\u09BF \u0989\u09A8\u09CD\u09AE\u09C1\u0995\u09CD\u09A4 \u09AE\u09BE\u09B8\u09CD\u099F\u09BE\u09B0\u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 \u0986\u09B8\u09A8 \u09AC\u09C1\u0995 \u0995\u09B0\u09A4\u09C7 \u09AB\u09CD\u09B0\u09BF \u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09CD\u09B0\u09C7\u09B6\u09A8 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
  },
  {
    code: "AL-100",
    slug: "ai-governance-fundamentals",
    title: "AI Governance Fundamentals",
    categorySlug: "ai-literacy",
    categoryName: "AI Literacy & Foundation",
    tierAccent: "free",
    tierLabel: "Free Foundation",
    chipLabel: "AI Literacy & Foundation",
    level: "Beginner",
    hook: "AI \u09A8\u09C0\u09A4\u09BF\u09AE\u09BE\u09B2\u09BE, \u099C\u09AC\u09BE\u09AC\u09A6\u09BF\u09B9\u09BF\u09A4\u09BE, \u099D\u09C1\u0981\u0995\u09BF \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u0993 \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2\u09A4\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB (FREE)\u0964",
    overview: "AI \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2, \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6, \u09B8\u09CD\u09AC\u099A\u09CD\u099B \u0993 \u099C\u09AC\u09BE\u09AC\u09A6\u09BF\u09B9\u09BF\u09AE\u09C2\u09B2\u0995\u09AD\u09BE\u09AC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0993 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09BE \u09AF\u09BE\u09AF\u09BC, \u09A4\u09BE \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964 AI policy, ethics \u098F\u09AC\u0982 governance \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE\u0987 \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u0989\u09A6\u09CD\u09A6\u09C7\u09B6\u09CD\u09AF\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 0",
    feeNote: "Completely Free Foundation Course",
    isFree: true,
    imageUrl: "/src/assets/images/course_ai_governance_leadership_1794924812599.jpg",
    imageAlt: "AI Governance Fundamentals policy and responsibility framework seminar",
    whoThisCourseIsFor: [
      "Policy, administration \u0993 public service-\u098F\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u09AF\u09C1\u0995\u09CD\u09A4 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0",
      "\u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09A8\u09BF\u09AF\u09BC\u09AE \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC \u09AC\u09C1\u099D\u09A4\u09C7 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF",
      "Global South-\u098F\u09B0 \u09AA\u09CD\u09B0\u09C7\u0995\u09CD\u09B7\u09BE\u09AA\u099F\u09C7 AI governance \u099C\u09BE\u09A8\u09A4\u09C7 \u099A\u09BE\u09A8 \u098F\u09AE\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0"
    ],
    keyAreas: [
      "AI Governance & Policy Foundations",
      "Principles of Responsible & Human-Centered AI",
      "Algorithmic Bias & Societal Risks",
      "Global Frameworks (UNESCO, OECD, EU AI Act)"
    ],
    learningOutcomes: [
      "AI governance \u098F\u09AC\u0982 AI ethics-\u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AA\u09BE\u09B0\u09CD\u09A5\u0995\u09CD\u09AF \u0993 \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09AA\u09CD\u09B0\u09BE\u09B8\u0999\u09CD\u0997\u09BF\u0995\u09A4\u09BE \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "Algorithmic bias, privacy risks \u098F\u09AC\u0982 misinformation-\u098F\u09B0 \u09AE\u09A4\u09CB \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 AI \u099D\u09C1\u0981\u0995\u09BF\u0997\u09C1\u09B2\u09CB \u09B6\u09A8\u09BE\u0995\u09CD\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "Human-in-the-loop oversight \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2 \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "UNESCO AI Ethics Recommendation, OECD Principles \u0993 EU AI Act-\u098F\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u09A6\u09BF\u0995\u0997\u09C1\u09B2\u09CB \u09A4\u09C1\u09B2\u09A8\u09BE \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Introduction to AI Governance \u2014 governance-\u098F\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF",
        topics: [
          "What is AI Governance? What is AI Policy?",
          "AI Governance vs AI Ethics",
          "Why AI Governance Matters",
          "AI Governance in the Global Context"
        ]
      },
      {
        code: "Module 2",
        title: "Principles of Responsible AI \u2014 \u09AE\u09C2\u09B2 \u09A8\u09C0\u09A4\u09BF\u09AE\u09BE\u09B2\u09BE",
        topics: [
          "Transparency and Explainability",
          "Accountability",
          "Fairness and Non-discrimination",
          "Human Oversight",
          "Privacy and Data Protection",
          "Safety and Reliability"
        ]
      },
      {
        code: "Module 3",
        title: "AI Risks and Responsibilities \u2014 \u099D\u09C1\u0981\u0995\u09BF \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC",
        topics: [
          "Algorithmic Bias",
          "Misinformation and Disinformation",
          "Privacy Risks",
          "Automated Decision-making Risks",
          "Human Rights and AI",
          "Risks of Uncontrolled AI Deployment"
        ]
      },
      {
        code: "Module 4",
        title: "AI Governance in Practice \u2014 \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997",
        topics: [
          "Responsible AI Use in Organisations",
          "Basic AI Risk Identification",
          "Institutional AI Policies-\u098F\u09B0 \u09A7\u09BE\u09B0\u09A3\u09BE",
          "Roles and Responsibilities",
          "Human-in-the-loop Approach"
        ]
      },
      {
        code: "Module 5",
        title: "Global AI Governance Landscape \u2014 \u0986\u09A8\u09CD\u09A4\u09B0\u09CD\u099C\u09BE\u09A4\u09BF\u0995 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB",
        topics: [
          "UNESCO AI Ethics Recommendation-\u098F\u09B0 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u09BF",
          "OECD AI Principles-\u098F\u09B0 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u09BF",
          "EU AI Act-\u098F\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE",
          "Global AI Governance Cooperation",
          "Global South and AI Governance"
        ]
      }
    ],
    practicalSkills: [
      "\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 AI governance risks \u09B6\u09A8\u09BE\u0995\u09CD\u09A4 \u0995\u09B0\u09BE",
      "Responsible AI principles \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE \u0995\u09B0\u09BE",
      "AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7 accountability-\u098F\u09B0 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC \u09AC\u09CB\u099D\u09BE",
      "\u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AE\u09CC\u09B2\u09BF\u0995 governance considerations \u099A\u09BF\u09B9\u09CD\u09A8\u09BF\u09A4 \u0995\u09B0\u09BE"
    ],
    outsideScope: [
      "Advanced AI Law or Legal Practice",
      "Professional Regulatory Compliance Auditing",
      "Full Institutional AI Policy Development",
      "Technical AI Security Engineering"
    ],
    prerequisites: "\u0995\u09CB\u09A8\u09CB \u0986\u0987\u09A8 \u09AC\u09BE \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09B8\u09BE\u09AF\u09BC\u09C7\u09A8\u09CD\u09B8\u09C7\u09B0 \u09AA\u09C2\u09B0\u09CD\u09AC \u09A1\u09BF\u0997\u09CD\u09B0\u09BF \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u09A8\u09C7\u0987; AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2\u09A4\u09BE \u09A8\u09BF\u09AF\u09BC\u09C7 \u0986\u0997\u09CD\u09B0\u09B9 \u09A5\u09BE\u0995\u09B2\u09C7\u0987 \u09AF\u09A5\u09C7\u09B7\u09CD\u099F\u0964",
    assessment: "\u09AE\u09A1\u09BF\u0989\u09B2\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0995\u09C7\u09B8 \u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3 \u0993 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 AI Governance Risk Checklist \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Certificate of Participation \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u0964",
    registrationNote: "\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 (BDT 0) \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09A8\u09AF\u09CB\u0997\u09CD\u09AF\u0964 \u0986\u09B8\u09A8 \u09AA\u09C2\u09B0\u09CD\u09A3 \u09B9\u0993\u09AF\u09BC\u09BE\u09B0 \u0986\u0997\u09C7\u0987 \u0986\u09AC\u09C7\u09A6\u09A8 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
  },
  {
    code: "AL-101",
    slug: "generative-ai-prompt-engineering",
    title: "Generative AI & Prompt Engineering",
    categorySlug: "ai-literacy",
    categoryName: "AI Literacy & Foundation",
    tierAccent: "literacy",
    tierLabel: "Foundation",
    chipLabel: "AI Literacy & Foundation",
    level: "Beginner to Early Intermediate",
    hook: "Generative AI \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7 \u098F\u09AC\u0982 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0 Prompt \u0995\u09BE\u09A0\u09BE\u09AE\u09CB \u09B2\u09BF\u0996\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AD\u09C1\u09B2 \u0993 \u09AA\u09CD\u09B0\u09BE\u09B8\u0999\u09CD\u0997\u09BF\u0995 \u0986\u0989\u099F\u09AA\u09C1\u099F \u09AA\u09BE\u0993\u09AF\u09BC\u09BE\u09B0 \u0995\u09CC\u09B6\u09B2 (\u09F3999)\u0964",
    overview: "Generative AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0 \u09AB\u09B2\u09BE\u09AB\u09B2 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 prompt \u09A4\u09C8\u09B0\u09BF, \u0989\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8 \u098F\u09AC\u0982 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AF\u09BC, \u09A4\u09BE \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964 \u09AE\u09C2\u09B2 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC \u09A5\u09BE\u0995\u09AC\u09C7 prompt engineering-\u098F\u09B0 fundamentals \u098F\u09AC\u0982 hands-on practice-\u098F\u09B0 \u0993\u09AA\u09B0\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 999",
    feeNote: "Full 4-Week Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_ai_agents_engineering_1794924811129.jpg",
    imageAlt: "Generative AI and structured prompt engineering training lab",
    whoThisCourseIsFor: [
      "Generative AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C7\u099B\u09C7\u09A8 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09AB\u09B2\u09BE\u09AB\u09B2 \u0985\u09B8\u0999\u09CD\u0997\u09A4 \u09AA\u09BE\u099A\u09CD\u099B\u09C7\u09A8 \u098F\u09AE\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0",
      "\u09B2\u09C7\u0996\u09BE, \u0997\u09AC\u09C7\u09B7\u09A3\u09BE \u0993 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u0995\u09BE\u099C\u09C7 AI-\u0995\u09C7 \u0986\u09B0\u0993 \u09A8\u09BF\u09B0\u09CD\u09AD\u09C1\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8 \u098F\u09AE\u09A8 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF"
    ],
    keyAreas: [
      "Generative AI & LLM Architecture Basics",
      "Anatomy of Effective Prompts",
      "Zero-Shot, Few-Shot & Role Prompting",
      "Iterative Refinement & Multimodal Prompting"
    ],
    learningOutcomes: [
      "Generative AI \u0993 Large Language Models \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09A8\u09BE \u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8 \u0995\u09B0\u09C7 \u09A4\u09BE \u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09A8\u09BE\u0995\u09C7 Context, Task, Role \u098F\u09AC\u0982 Output Format \u09AF\u09C1\u0995\u09CD\u09A4 \u09B8\u09CD\u09AA\u09B7\u09CD\u099F \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F\u09C7 \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "Zero-shot, Few-shot \u098F\u09AC\u0982 Step-by-step prompting \u0995\u09CC\u09B6\u09B2 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u0995\u09BE\u099C\u09C7 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F, \u099F\u09C7\u0995\u09CD\u09B8\u099F \u0993 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F\u09C7\u09B0 \u0986\u0989\u099F\u09AA\u09C1\u099F \u09AF\u09BE\u099A\u09BE\u0987 \u0993 \u09AE\u09BE\u09A8\u09CB\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Understanding Generative AI \u2014 \u09AE\u09CC\u09B2\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE",
        topics: [
          "What is Generative AI? How Large Language Models Work",
          "Text, Image, Audio and Video Generation",
          "Understanding AI-generated Content",
          "Capabilities and Limitations of Generative AI"
        ]
      },
      {
        code: "Module 2",
        title: "Introduction to Prompt Engineering \u2014 prompt-\u098F\u09B0 \u0997\u09A0\u09A8",
        topics: [
          "What is a Prompt? How AI Interprets Instructions",
          "Anatomy of an Effective Prompt",
          "Context, Task, Role and Output Format",
          "Common Prompting Mistakes"
        ]
      },
      {
        code: "Module 3",
        title: "Core Prompt Engineering Techniques \u2014 \u09AE\u09C2\u09B2 \u0995\u09CC\u09B6\u09B2",
        topics: [
          "Zero-shot, Few-shot, Role-based and Contextual Prompting",
          "Step-by-step Instruction Design",
          "Structured Output Prompting"
        ]
      },
      {
        code: "Module 4",
        title: "Advanced Prompt Improvement \u2014 \u09AE\u09BE\u09A8 \u0989\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8",
        topics: [
          "Breaking Complex Tasks into Smaller Tasks",
          "Iterative Prompt Refinement",
          "Adding Constraints and Context",
          "Improving Accuracy and Relevance",
          "Evaluating Prompt Performance"
        ]
      },
      {
        code: "Module 5",
        title: "Multimodal Prompting \u2014 \u098F\u0995\u09BE\u09A7\u09BF\u0995 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u0995\u09BE\u099C",
        topics: [
          "Text-based Prompting and Image Prompting Fundamentals",
          "Working with Documents and Files",
          "Voice and Audio Interaction",
          "Understanding Multimodal AI Capabilities"
        ]
      }
    ],
    practicalSkills: [
      "\u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0 prompt \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE",
      "\u0985\u09B8\u09CD\u09AA\u09B7\u09CD\u099F \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09A8\u09BE\u0995\u09C7 \u09AA\u09B0\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 prompt-\u098F \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09BE",
      "AI-generated response \u0989\u09A8\u09CD\u09A8\u09A4 \u0995\u09B0\u09BE",
      "\u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 \u09A7\u09B0\u09A8\u09C7\u09B0 task-\u098F\u09B0 \u099C\u09A8\u09CD\u09AF prompt \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE",
      "AI-\u098F\u09B0 output \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BE \u0993 \u09B8\u0982\u09B6\u09CB\u09A7\u09A8 \u0995\u09B0\u09BE"
    ],
    practicalProject: {
      projectLabel: "Applied Exercise",
      title: "Personal Structured Prompt Portfolio",
      prompt: "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u09A4\u09BE\u0981\u09B0 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE \u09AC\u09BE \u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09EB\u099F\u09BF \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u0995\u09BE\u099C\u09C7\u09B0 \u0993\u09AA\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u0995\u09B0\u09C7 Role, Context, Constraints \u0993 Output Format \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C \u09A4\u09C8\u09B0\u09BF \u0993 \u09AA\u09B0\u09BF\u09AE\u09BE\u09B0\u09CD\u099C\u09A8 \u0995\u09B0\u09AC\u09C7\u09A8\u0964",
      deliverables: [
        "\u09EB\u099F\u09BF \u09A1\u09CB\u09AE\u09C7\u0987\u09A8-\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u099F\u09C7\u09AE\u09AA\u09CD\u09B2\u09C7\u099F",
        "Before-vs-After \u0986\u0989\u099F\u09AA\u09C1\u099F \u09A4\u09C1\u09B2\u09A8\u09BE \u0993 \u09AE\u09BE\u09A8\u09CB\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8 \u09A8\u09CB\u099F",
        "\u09B9\u09CD\u09AF\u09BE\u09B2\u09C1\u09B8\u09BF\u09A8\u09C7\u09B6\u09A8 \u0993 \u09A4\u09CD\u09B0\u09C1\u099F\u09BF \u09AF\u09BE\u099A\u09BE\u0987\u09AF\u09BC\u09C7\u09B0 \u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8"
      ]
    },
    outsideScope: [
      "AI Application Development",
      "API Integration and Programming",
      "Production-level AI Automation",
      "Training or Fine-tuning AI Models"
    ],
    prerequisites: "\u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09AC\u09CD\u09B0\u09BE\u0989\u099C\u09BE\u09B0 \u0993 \u09AC\u09C7\u09B8\u09BF\u0995 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09AC\u09BE \u09B8\u09CD\u09AE\u09BE\u09B0\u09CD\u099F\u09AB\u09CB\u09A8 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u0964",
    assessment: "\u09B8\u09BE\u09AA\u09CD\u09A4\u09BE\u09B9\u09BF\u0995 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8 \u0993 \u09B8\u09AE\u09BE\u09AA\u09A8\u09C0 \u09AA\u09CB\u09B0\u09CD\u099F\u09AB\u09CB\u09B2\u09BF\u0993 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u0995\u09CB\u09B0\u09CD\u09B8 \u0993 \u0985\u09CD\u09AF\u09BE\u09B8\u09BE\u0987\u09A8\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Atlas AI Education \u09A5\u09C7\u0995\u09C7 Non-accredited Certificate of Completion \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09AC\u09CD\u09AF\u09BE\u099A\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0995\u09CB\u09B0\u09CD\u09B8\u0964 \u09AB\u09BF BDT 999 (\u09AF\u09CB\u0997\u09CD\u09AF \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09EB\u09E6% \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE \u09B0\u09AF\u09BC\u09C7\u099B\u09C7)\u0964"
  },
  {
    code: "AL-102",
    slug: "ai-everyday-professional-productivity",
    title: "AI for Everyday & Professional Productivity",
    categorySlug: "ai-literacy",
    categoryName: "AI Literacy & Foundation",
    tierAccent: "literacy",
    tierLabel: "Foundation",
    chipLabel: "AI Literacy & Foundation",
    level: "Beginner to Early Intermediate",
    hook: "\u09AA\u09A1\u09BC\u09BE\u09B6\u09CB\u09A8\u09BE, \u09B2\u09C7\u0996\u09BE\u09B2\u09C7\u0996\u09BF, \u0987\u09AE\u09C7\u0987\u09B2, \u09AE\u09BF\u099F\u09BF\u0982 \u09A8\u09CB\u099F \u0993 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0995\u09BE\u099C\u09C7\u09B0 \u0997\u09A4\u09BF \u09AC\u09BE\u09A1\u09BC\u09BE\u09A4\u09C7 AI-\u09B0 \u0997\u09CB\u099B\u09BE\u09A8\u09CB \u0993 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09BF\u0995 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 (\u09F3999)\u0964",
    overview: "\u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u099C\u09C0\u09AC\u09A8, \u09AA\u09A1\u09BC\u09BE\u09B6\u09CB\u09A8\u09BE \u098F\u09AC\u0982 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u0995\u09BE\u099C\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09B8\u09AE\u09AF\u09BC \u09B8\u09BE\u09B6\u09CD\u09B0\u09AF\u09BC, \u0995\u09BE\u099C\u09C7\u09B0 \u09AE\u09BE\u09A8 \u0989\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8 \u098F\u09AC\u0982 productivity \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09BF\u0995 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 999",
    feeNote: "Full 4-Week Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_everyday_productivity_1794924806999.jpg",
    imageAlt: "Everyday and professional AI productivity tools and workflow",
    whoThisCourseIsFor: [
      "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0, \u099A\u09BE\u0995\u09B0\u09BF\u099C\u09C0\u09AC\u09C0 \u0993 \u0989\u09A6\u09CD\u09AF\u09CB\u0995\u09CD\u09A4\u09BE \u09AF\u09BE\u09B0\u09BE \u09B0\u09C1\u099F\u09BF\u09A8 \u0995\u09BE\u099C\u09C7 \u09B8\u09AE\u09AF\u09BC \u09AC\u09BE\u0981\u099A\u09BE\u09A4\u09C7 \u099A\u09BE\u09A8",
      "Email, report \u0993 presentation \u09A4\u09C8\u09B0\u09BF\u09A4\u09C7 AI-\u098F\u09B0 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u09A8\u09BF\u09A4\u09C7 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF"
    ],
    keyAreas: [
      "Daily Planning & Task Organization",
      "Professional Emails, Reports & Meeting Notes",
      "Document Editing & Slide Outlines",
      "Personal AI Productivity Workflows"
    ],
    learningOutcomes: [
      "\u09A6\u09C8\u09A8\u09BF\u0995 \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE, \u09A8\u09CB\u099F \u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4\u0995\u09B0\u09A3 \u098F\u09AC\u0982 \u0997\u09AC\u09C7\u09B7\u09A3\u09BE \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE\u09AF\u09BC AI-\u0995\u09C7 \u09B8\u09A0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C\u09C7 \u09B2\u09BE\u0997\u09BE\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09AA\u09C7\u09B6\u09BE\u09A6\u09BE\u09B0 \u0987\u09AE\u09C7\u0987\u09B2, \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F, \u09AE\u09BF\u099F\u09BF\u0982 \u098F\u099C\u09C7\u09A8\u09CD\u09A1\u09BE \u0993 \u0995\u09BE\u09B0\u09CD\u09AF\u09AC\u09BF\u09AC\u09B0\u09A3\u09C0 \u09A6\u09CD\u09B0\u09C1\u09A4 \u0993 \u09A8\u09BF\u09B0\u09CD\u09AD\u09C1\u09B2\u09AD\u09BE\u09AC\u09C7 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09AA\u09CD\u09B0\u09C7\u099C\u09C7\u09A8\u09CD\u099F\u09C7\u09B6\u09A8 \u0986\u0989\u099F\u09B2\u09BE\u0987\u09A8 \u0993 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB\u09AC\u09A6\u09CD\u09A7 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09C1\u09AB\u09B0\u09BF\u09A1\u09BF\u0982 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09A8\u09BF\u099C\u09C7\u09B0 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0995\u09BE\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09C1\u09A8\u09B0\u09BE\u09AC\u09C3\u09A4\u09CD\u09A4\u09BF\u09AF\u09CB\u0997\u09CD\u09AF Personal AI Productivity Routine \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI for Daily Productivity \u2014 \u09A6\u09C8\u09A8\u09BF\u0995 \u0995\u09BE\u099C\u09C7\u09B0 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE",
        topics: [
          "Daily Planning with AI and Task Organisation",
          "Personal Learning Assistance",
          "Information Summarisation",
          "Research Assistance"
        ]
      },
      {
        code: "Module 2",
        title: "AI for Professional Communication \u2014 \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997",
        topics: [
          "Professional Email Writing and Professional Message Writing",
          "Report Drafting",
          "Meeting Agenda Preparation",
          "Meeting Notes and Summaries"
        ]
      },
      {
        code: "Module 3",
        title: "AI for Documents and Presentations \u2014 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F \u0993 \u0989\u09AA\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8\u09BE",
        topics: [
          "Document Drafting and Editing",
          "Presentation Outline Creation and Slide Content Development",
          "Proofreading and Content Improvement",
          "Structured Document Preparation"
        ]
      },
      {
        code: "Module 4",
        title: "AI for Information and Data Tasks \u2014 \u09A4\u09A5\u09CD\u09AF \u0993 \u09A1\u09C7\u099F\u09BE",
        topics: [
          "Working with Tables and Structured Information",
          "Basic Spreadsheet Assistance",
          "Summarising Data",
          "Understanding Charts and Reports",
          "Extracting Information from Documents"
        ]
      },
      {
        code: "Module 5",
        title: "Personal Productivity Workflows \u2014 \u09A8\u09BF\u099C\u09B8\u09CD\u09AC workflow",
        topics: [
          "AI-assisted Research Workflow",
          "Planning and Scheduling",
          "Content Organisation",
          "Repetitive Task Assistance",
          "Building a Personal AI Productivity Routine"
        ]
      }
    ],
    practicalSkills: [
      "AI \u09A6\u09BF\u09AF\u09BC\u09C7 professional email \u0993 report \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE",
      "Meeting notes \u098F\u09AC\u0982 summaries \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u0995\u09B0\u09BE",
      "Presentation-\u098F\u09B0 outline \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE",
      "Documents \u0993 information \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE",
      "\u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0995\u09BE\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF AI-assisted workflow \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE"
    ],
    outsideScope: [
      "Advanced Business Process Automation",
      "Programming and Coding",
      "Professional Financial or Legal Advisory",
      "Advanced Data Science",
      "Enterprise Software Implementation"
    ],
    prerequisites: "\u09AC\u09C7\u09B8\u09BF\u0995 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0, \u0987\u09AE\u09C7\u0987\u09B2 \u098F\u09AC\u0982 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F/\u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09A1\u09B6\u09BF\u099F \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09A7\u09BE\u09B0\u09A3\u09BE\u0964",
    assessment: "\u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0985\u09CD\u09AF\u09BE\u09B8\u09BE\u0987\u09A8\u09AE\u09C7\u09A8\u09CD\u099F (\u0987\u09AE\u09C7\u0987\u09B2/\u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F/\u09AA\u09CD\u09B0\u09C7\u099C\u09C7\u09A8\u09CD\u099F\u09C7\u09B6\u09A8 \u0986\u0989\u099F\u09B2\u09BE\u0987\u09A8) \u0993 \u09AA\u09BE\u09B0\u09CD\u09B8\u09CB\u09A8\u09BE\u09B2 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u09BF\u09AD\u09BF\u099F\u09BF \u09B0\u09C1\u099F\u09BF\u09A8 \u09B8\u09BE\u09AC\u09AE\u09BF\u09B6\u09A8\u0964",
    certificate: "\u0995\u09CB\u09B0\u09CD\u09B8 \u0993 \u0985\u09CD\u09AF\u09BE\u09B8\u09BE\u0987\u09A8\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Certificate of Completion \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 999\u0964"
  },
  {
    code: "AL-103",
    slug: "ai-safety-ethics-responsible-use",
    title: "AI Safety, Ethics & Responsible Use",
    categorySlug: "ai-literacy",
    categoryName: "AI Literacy & Foundation",
    tierAccent: "literacy",
    tierLabel: "Foundation",
    chipLabel: "AI Literacy & Foundation",
    level: "Beginner",
    hook: "Privacy, algorithmic bias, misinformation \u0993 deepfake \u09AC\u09C1\u099D\u09C7 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u0993 \u09A8\u09C8\u09A4\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE\u09B0 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF (\u09F3999)\u0964",
    overview: "AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE\u09B0 \u09B8\u09AE\u09AF\u09BC \u0995\u09C0 \u09A7\u09B0\u09A8\u09C7\u09B0 \u099D\u09C1\u0981\u0995\u09BF \u09A4\u09C8\u09B0\u09BF \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7 \u098F\u09AC\u0982 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6, \u09A8\u09C8\u09A4\u09BF\u0995 \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2\u09AD\u09BE\u09AC\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE \u09AF\u09BE\u09AF\u09BC, \u09A4\u09BE \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4, \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u0997\u09A4 \u0993 \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u099C\u09C0\u09AC\u09A8\u09C7 responsible AI practices \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE\u0987 \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 999",
    feeNote: "Full 4-Week Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_ai_safety_ethics_1794924808097.jpg",
    imageAlt: "AI Safety Ethics and Responsible Use verification seminar",
    whoThisCourseIsFor: [
      "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0, \u09B6\u09BF\u0995\u09CD\u09B7\u0995 \u0993 \u0985\u09AD\u09BF\u09AD\u09BE\u09AC\u0995 \u09AF\u09BE\u09B0\u09BE AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u099D\u09C1\u0981\u0995\u09BF \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09B8\u099A\u09C7\u09A4\u09A8 \u09B9\u09A4\u09C7 \u099A\u09BE\u09A8",
      "\u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u09B8\u0982\u09AC\u09C7\u09A6\u09A8\u09B6\u09C0\u09B2 \u09A4\u09A5\u09CD\u09AF \u09A8\u09BF\u09AF\u09BC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7\u09A8 \u098F\u09AE\u09A8 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0"
    ],
    keyAreas: [
      "AI Safety Risks & Harm Awareness",
      "Misinformation, Deepfakes & Fact-Checking",
      "Personal Data & Confidentiality Protection",
      "Ethics, Fairness, Copyright & Academic Integrity"
    ],
    learningOutcomes: [
      "AI-generated misinformation, hallucinations \u098F\u09AC\u0982 deepfake/synthetic media \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u0995\u09CC\u09B6\u09B2 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "AI \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE\u09C7 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09AC\u09BE \u09B8\u0982\u09AC\u09C7\u09A6\u09A8\u09B6\u09C0\u09B2 \u09A4\u09A5\u09CD\u09AF \u09B6\u09C7\u09AF\u09BC\u09BE\u09B0 \u0995\u09B0\u09BE\u09B0 \u099D\u09C1\u0981\u0995\u09BF \u099A\u09BF\u09A8\u09C7 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u09A1\u09C7\u099F\u09BE \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "Algorithmic bias, \u0995\u09AA\u09BF\u09B0\u09BE\u0987\u099F \u098F\u09AC\u0982 \u098F\u0995\u09BE\u09A1\u09C7\u09AE\u09BF\u0995 \u09B8\u09A4\u09A4\u09BE\u09B0 (academic integrity) \u09AE\u09BE\u09A8\u09A6\u09A3\u09CD\u09A1 \u09AC\u099C\u09BE\u09AF\u09BC \u09B0\u09C7\u0996\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09AC\u09BE \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u09B8\u09CD\u09AA\u09B7\u09CD\u099F Responsible AI Safety Guideline \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Understanding AI Safety \u2014 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE",
        topics: [
          "What is AI Safety? What is Responsible AI?",
          "AI-related Risks and Harms",
          "Understanding AI Limitations",
          "Safe AI Usage Practices"
        ]
      },
      {
        code: "Module 2",
        title: "Misinformation and Deepfakes \u2014 \u09AD\u09C1\u09B2 \u09A4\u09A5\u09CD\u09AF \u0993 \u09B8\u09BF\u09A8\u09A5\u09C7\u099F\u09BF\u0995 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE",
        topics: [
          "AI-generated Misinformation",
          "Deepfakes and Synthetic Media",
          "Image, Audio and Video Manipulation",
          "Fact-checking AI-generated Content",
          "Identifying Suspicious Information"
        ]
      },
      {
        code: "Module 3",
        title: "Privacy and Data Protection \u2014 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A4\u09A5\u09CD\u09AF\u09C7\u09B0 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE",
        topics: [
          "Personal Data and AI",
          "Sensitive Information Protection",
          "Risks of Uploading Private Documents",
          "Safe Use of AI Platforms",
          "Basic Data Protection Practices"
        ]
      },
      {
        code: "Module 4",
        title: "Ethics and Fairness \u2014 \u09A8\u09C8\u09A4\u09BF\u0995\u09A4\u09BE \u0993 \u09A8\u09CD\u09AF\u09BE\u09AF\u09CD\u09AF\u09A4\u09BE",
        topics: [
          "Bias and Discrimination",
          "Fairness in AI Systems",
          "Human Rights and AI",
          "Copyright and Intellectual Property Awareness",
          "Academic Integrity and Responsible AI Use"
        ]
      },
      {
        code: "Module 5",
        title: "Responsible AI in Practice \u2014 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997",
        topics: [
          "Verifying AI-generated Information",
          "Human Review and Oversight",
          "Recognising Hallucinations",
          "Responsible AI Use in Education and in the Workplace",
          "Developing Personal AI Safety Guidelines"
        ]
      }
    ],
    practicalSkills: [
      "AI-generated misinformation \u09B6\u09A8\u09BE\u0995\u09CD\u09A4 \u0995\u09B0\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u0995\u09CC\u09B6\u09B2",
      "Deepfake \u0993 manipulated content \u09AF\u09BE\u099A\u09BE\u0987\u09AF\u09BC\u09C7\u09B0 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF",
      "\u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A4\u09A5\u09CD\u09AF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09B0\u09C7\u0996\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0",
      "AI output \u09AF\u09BE\u099A\u09BE\u0987 \u0993 cross-check \u0995\u09B0\u09BE",
      "Responsible AI usage guidelines \u0985\u09A8\u09C1\u09B8\u09B0\u09A3 \u0995\u09B0\u09BE"
    ],
    outsideScope: [
      "Professional Cybersecurity Training",
      "Digital Forensics",
      "Advanced AI Red-teaming",
      "Legal Investigation or Compliance Certification",
      "Technical AI Model Safety Engineering"
    ],
    prerequisites: "\u0995\u09CB\u09A8\u09CB \u0995\u09BE\u09B0\u09BF\u0997\u09B0\u09BF \u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1\u09C7\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u09A8\u09C7\u0987; \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B8\u09BE\u0995\u09CD\u09B7\u09B0\u09A4\u09BE \u09AF\u09A5\u09C7\u09B7\u09CD\u099F\u0964",
    assessment: "\u09AB\u09CD\u09AF\u09BE\u0995\u09CD\u099F-\u099A\u09C7\u0995\u09BF\u0982 \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8 \u0993 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 Responsible AI Checklist \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09B8\u09C7\u09B6\u09A8 \u0993 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Certificate of Completion \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09AC\u09CD\u09AF\u09BE\u099A\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0995\u09CB\u09B0\u09CD\u09B8\u0964 \u09AB\u09BF BDT 999\u0964"
  },
  {
    code: "AL-104",
    slug: "ai-tools-literacy-prompt-engineering",
    title: "AI Tools Literacy & Prompt Engineering",
    categorySlug: "ai-literacy",
    categoryName: "AI Literacy & Foundation",
    tierAccent: "literacy",
    tierLabel: "Foundation \xB7 Advanced Literacy",
    chipLabel: "AI Literacy & Foundation",
    level: "Beginner to Intermediate",
    hook: "\u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u09C0\u09AF\u09BC \u0986\u09A7\u09C1\u09A8\u09BF\u0995 AI tool-\u0997\u09C1\u09B2\u09CB\u09B0 \u09B8\u09AE\u09A8\u09CD\u09AC\u09BF\u09A4 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0, \u09A4\u09C1\u09B2\u09A8\u09BE\u09AE\u09C2\u09B2\u0995 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u098F\u09AC\u0982 \u0985\u09CD\u09AF\u09BE\u09A1\u09AD\u09BE\u09A8\u09CD\u09B8\u09A1 Prompt Engineering \u09A6\u0995\u09CD\u09B7\u09A4\u09BE (\u09F31,499)\u0964",
    overview: "\u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 \u09A7\u09B0\u09A8\u09C7\u09B0 AI tools \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE \u09A4\u09C8\u09B0\u09BF, \u09B8\u09A0\u09BF\u0995 \u0995\u09BE\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0989\u09AA\u09AF\u09C1\u0995\u09CD\u09A4 tool \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u098F\u09AC\u0982 \u098F\u0995\u09BE\u09A7\u09BF\u0995 AI platform-\u098F\u09B0 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09BE\u09B0\u09BF\u09A4\u09BE \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964 \u09B6\u09C1\u09A7\u09C1 prompt \u09B2\u09C7\u0996\u09BE\u09B0 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09C7 AI tools ecosystem \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 hands-on literacy \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE\u0987 \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 1,499",
    feeNote: "Full 4-Week Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_fullstack_engineering_1794924810463.jpg",
    imageAlt: "AI Tools Literacy ecosystem and cross-platform prompting workshop",
    whoThisCourseIsFor: [
      "\u098F\u0995\u09BE\u09A7\u09BF\u0995 AI tool \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7\u09A8 \u09AC\u09BE \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8, \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u0995\u09CB\u09A8\u099F\u09BF \u0995\u09CB\u09A8 \u0995\u09BE\u099C\u09C7 \u0989\u09AA\u09AF\u09C1\u0995\u09CD\u09A4 \u09A4\u09BE \u09A8\u09BF\u09AF\u09BC\u09C7 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u09A8\u09A8 \u098F\u09AE\u09A8 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF",
      "\u09A8\u09BF\u099C\u09C7\u09B0 \u0995\u09BE\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 AI toolkit \u09B8\u09BE\u099C\u09BE\u09A4\u09C7 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0"
    ],
    keyAreas: [
      "AI Tools Ecosystem Classification",
      "Platform Selection & Free vs Paid Assessment",
      "Tool-Specific Prompt Adaptation",
      "Output Verification & Personal AI Toolkit"
    ],
    learningOutcomes: [
      "Text, research, design, presentation \u0993 productivity-\u09B0 \u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 AI \u099F\u09C1\u09B2\u09C7\u09B0 \u09B6\u09CD\u09B0\u09C7\u09A3\u09BF\u09AC\u09BF\u09AD\u09BE\u0997 \u0993 \u09B8\u09C0\u09AE\u09BE\u09AC\u09A6\u09CD\u09A7\u09A4\u09BE \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09A8\u09BF\u09B0\u09CD\u09A6\u09BF\u09B7\u09CD\u099F \u0995\u09BE\u099C\u09C7\u09B0 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF \u0993 \u09AC\u09BE\u099C\u09C7\u099F \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 \u09B8\u09A0\u09BF\u0995 AI \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0993 \u09A4\u09C1\u09B2\u09A8\u09BE\u09AE\u09C2\u09B2\u0995 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u098F\u0995\u0987 \u0995\u09BE\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u09BE\u09A7\u09BF\u0995 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE\u09C7 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u0985\u09CD\u09AF\u09BE\u09A1\u09BE\u09AA\u09CD\u099F \u0995\u09B0\u09C7 \u09AE\u09BE\u09A8\u09B8\u09AE\u09CD\u09AE\u09A4 \u0986\u0989\u099F\u09AA\u09C1\u099F \u09AC\u09C7\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "Source verification \u0993 \u09B9\u09CD\u09AF\u09BE\u09B2\u09C1\u09B8\u09BF\u09A8\u09C7\u09B6\u09A8 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4\u0995\u09B0\u09A3\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0\u09AF\u09CB\u0997\u09CD\u09AF \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 AI toolkit \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Understanding the AI Tools Ecosystem \u2014 tools-\u098F\u09B0 \u09B6\u09CD\u09B0\u09C7\u09A3\u09BF\u09AC\u09BF\u09AD\u09BE\u0997",
        topics: [
          "Categories of AI Tools",
          "Text and Writing, Research and Knowledge, Image and Design, Audio and Video tools",
          "Productivity and Presentation Tools",
          "Coding and Development Assistants"
        ]
      },
      {
        code: "Module 2",
        title: "Selecting the Right AI Tool \u2014 \u09B8\u09A0\u09BF\u0995 tool \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8",
        topics: [
          "Matching Tools with Tasks",
          "Comparing AI Platforms",
          "Understanding Free and Paid Tool Features",
          "Evaluating Tool Capabilities and Recognising Tool Limitations"
        ]
      },
      {
        code: "Module 3",
        title: "Practical AI Tool Applications \u2014 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09BF\u0995 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997",
        topics: [
          "AI for Research and Learning",
          "AI for Writing and Communication",
          "AI for Content and Design",
          "AI for Presentations",
          "AI for Information Analysis and Everyday Work"
        ]
      },
      {
        code: "Module 4",
        title: "Tool-specific Prompt Engineering \u2014 platform \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 prompting",
        topics: [
          "Adapting Prompts to Different Platforms",
          "Text, Image and Research Prompting",
          "Structured Instructions",
          "Improving Output Quality",
          "Comparing Results Across Tools",
          "Tool-specific Prompt Limitations"
        ]
      },
      {
        code: "Module 5",
        title: "Evaluating AI-generated Outputs \u2014 output \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8",
        topics: [
          "Accuracy and Relevance",
          "Source Verification",
          "Output Quality Assessment",
          "Detecting Hallucinations",
          "Comparing Multiple AI Responses",
          "Choosing the Appropriate Tool for a Task"
        ]
      },
      {
        code: "Module 6",
        title: "Building a Personal AI Toolkit \u2014 \u09A8\u09BF\u099C\u09B8\u09CD\u09AC toolkit",
        topics: [
          "Selecting a Personal Set of AI Tools",
          "Creating Task-based Tool Workflows",
          "Organising AI Resources",
          "Responsible Tool Usage",
          "Developing an AI-assisted Learning and Productivity Toolkit"
        ]
      }
    ],
    practicalSkills: [
      "\u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 AI tool \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09BE",
      "\u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 AI platform \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE",
      "\u098F\u0995\u0987 task-\u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 tool-\u098F\u09B0 output \u09A4\u09C1\u09B2\u09A8\u09BE \u0995\u09B0\u09BE",
      "\u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 platform-\u098F prompt adapt \u0995\u09B0\u09BE",
      "AI-generated output \u09AF\u09BE\u099A\u09BE\u0987 \u0993 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u0995\u09B0\u09BE",
      "\u09A8\u09BF\u099C\u09C7\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 AI toolkit \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE"
    ],
    practicalProject: {
      projectLabel: "Capstone Toolkit",
      title: "Multi-Platform Personal AI Toolkit & Comparison Matrix",
      prompt: "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u09A4\u09BE\u0981\u09B0 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0993 \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09EA\u099F\u09BF \u09AE\u09C2\u09B2 \u0995\u09BE\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0989\u09AA\u09AF\u09C1\u0995\u09CD\u09A4 AI \u099F\u09C1\u09B2 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8, \u0995\u09CD\u09B0\u09B8-\u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u099F\u09C7\u09B8\u09CD\u099F \u098F\u09AC\u0982 \u0986\u0989\u099F\u09AA\u09C1\u099F \u09AF\u09BE\u099A\u09BE\u0987\u0995\u09B0\u09A3 \u09AE\u09CD\u09AF\u09BE\u099F\u09CD\u09B0\u09BF\u0995\u09CD\u09B8 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09AC\u09C7\u09A8\u0964",
      deliverables: [
        "Task-to-Tool \u09B8\u09BF\u09B2\u09C7\u0995\u09B6\u09A8 \u09AE\u09CD\u09AF\u09BE\u099F\u09CD\u09B0\u09BF\u0995\u09CD\u09B8",
        "\u0995\u09CD\u09B0\u09B8-\u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u0993 \u0986\u0989\u099F\u09AA\u09C1\u099F \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F",
        "\u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09BF\u0995\u09BE\u09B8\u09B9 Personal AI Toolkit \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F"
      ]
    },
    outsideScope: [
      "Professional AI Software Development",
      "API-based Tool Integration",
      "Advanced No-code or Code-based Automation",
      "AI Model Training and Fine-tuning",
      "Enterprise AI System Deployment"
    ],
    prerequisites: "\u09AC\u09C7\u09B8\u09BF\u0995 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u0993 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u0964 AL-101 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09A7\u09BE\u09B0\u09A3\u09BE \u09A5\u09BE\u0995\u09B2\u09C7 \u09B8\u09B9\u09BE\u09AF\u09BC\u0995, \u09A4\u09AC\u09C7 \u09AC\u09BE\u09A7\u09CD\u09AF\u09A4\u09BE\u09AE\u09C2\u09B2\u0995 \u09A8\u09AF\u09BC\u0964",
    assessment: "\u09AE\u09A1\u09BF\u0989\u09B2\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8 \u098F\u09AC\u0982 \u09B8\u09AE\u09BE\u09AA\u09A8\u09C0 Personal AI Toolkit \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Certificate of Completion \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 1,499\u0964"
  },
  // =========================================================================
  // CATEGORY 2: APPLIED AI (4 Courses: AP-201 .. AP-204, BDT 1,200 Each)
  // =========================================================================
  {
    code: "AP-201",
    slug: "ai-powered-content-creation",
    title: "AI-Powered Content Creation",
    categorySlug: "applied-ai",
    categoryName: "Applied AI",
    tierAccent: "applied",
    tierLabel: "Applied Track",
    chipLabel: "Applied AI",
    level: "Beginner to Intermediate",
    hook: "AI-\u09B0 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE\u09AF\u09BC \u09AC\u09CD\u09B2\u0997, \u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE, \u09AD\u09BF\u09A1\u09BF\u0993 \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F, \u09B8\u09CD\u09B2\u09BE\u0987\u09A1 \u0993 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09A4\u09C8\u09B0\u09BF\u09B0 \u09AA\u09C2\u09B0\u09CD\u09A3\u09BE\u0999\u09CD\u0997 \u0995\u09B0\u09CD\u09AE\u09AA\u09CD\u09B0\u09AC\u09BE\u09B9 (\u09F31,200)\u0964",
    overview: "\u098F\u0987 \u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09B2\u09C7\u0996\u0995, \u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09C7\u099F\u09B0, \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F\u09BF\u0982 \u099F\u09BF\u09AE\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB\u09AC\u09A6\u09CD\u09A7 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u09A8\u09BF\u0982, \u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1 \u09AD\u09AF\u09BC\u09C7\u09B8 \u09A7\u09B0\u09C7 \u09B0\u09C7\u0996\u09C7 \u09B0\u09BE\u0987\u099F\u09BF\u0982, \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u098F\u09B8\u09C7\u099F \u099C\u09C7\u09A8\u09BE\u09B0\u09C7\u09B6\u09A8 \u098F\u09AC\u0982 \u09A8\u09C8\u09A4\u09BF\u0995 \u0993 \u0995\u09AA\u09BF\u09B0\u09BE\u0987\u099F-\u09B8\u099A\u09C7\u09A4\u09A8 \u09AA\u09CD\u09B0\u0995\u09BE\u09B6\u09A8\u09BE \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09BE \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 1,200",
    feeNote: "Full 4-Week Applied Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_digital_creation_1794924807458.jpg",
    imageAlt: "AI-Powered Content Creation visual and editorial workflow",
    whoThisCourseIsFor: [
      "\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09C7\u099F\u09B0, \u09B2\u09C7\u0996\u0995 \u0993 \u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09BE\u09B0",
      "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u0997\u09A4 \u09AC\u09BE \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u0995\u09AE\u09BF\u0989\u09A8\u09BF\u0995\u09C7\u09B6\u09A8 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0"
    ],
    keyAreas: [
      "Editorial Planning & Audience Messaging",
      "Long-Form & Social Copywriting with Brand Voice",
      "AI Visual Design & Presentation Assets",
      "Scriptwriting, Editing & Copyright Hygiene"
    ],
    learningOutcomes: [
      "\u099F\u09BE\u09B0\u09CD\u0997\u09C7\u099F \u0985\u09A1\u09BF\u09AF\u09BC\u09C7\u09A8\u09CD\u09B8 \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 \u09AE\u09BE\u09B8\u09BF\u0995 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09AA\u09BF\u09B2\u09BE\u09B0 \u0993 \u098F\u09A1\u09BF\u099F\u09CB\u09B0\u09BF\u09AF\u09BC\u09BE\u09B2 \u0995\u09CD\u09AF\u09BE\u09B2\u09C7\u09A8\u09CD\u09A1\u09BE\u09B0 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u099A\u09BF\u09A8\u09CD\u09A4\u09BE \u0993 \u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09C7\u09B0 \u09B8\u09CD\u09AC\u0995\u09C0\u09AF\u09BC\u09A4\u09BE \u0985\u0995\u09CD\u09B7\u09C1\u09A3\u09CD\u09A8 \u09B0\u09C7\u0996\u09C7 \u09AC\u09CD\u09B2\u0997, \u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AA\u09CB\u09B8\u09CD\u099F \u0993 \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F \u0996\u09B8\u09A1\u09BC\u09BE \u0993 \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u0987\u09AE\u09C7\u099C \u0993 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u09B2\u09BF\u0996\u09C7 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F-\u09B8\u0999\u09CD\u0997\u09A4 \u0997\u09CD\u09B0\u09BE\u09AB\u09BF\u0995\u09CD\u09B8 \u0993 \u09B8\u09CD\u09B2\u09BE\u0987\u09A1 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u0995\u09AA\u09BF\u09B0\u09BE\u0987\u099F, \u09A4\u09A5\u09CD\u09AF\u09C7\u09B0 \u09B8\u09A4\u09CD\u09AF\u09A4\u09BE \u09AF\u09BE\u099A\u09BE\u0987 \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2 \u09B8\u09BF\u09A8\u09CD\u09A5\u09C7\u099F\u09BF\u0995 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u09AA\u09CD\u09B0\u0995\u09BE\u09B6\u09A8\u09BE\u09B0 \u09AE\u09BE\u09A8\u09A6\u09A3\u09CD\u09A1 \u0985\u09A8\u09C1\u09B8\u09B0\u09A3 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Content Strategy & Audience Mapping with AI",
        topics: [
          "Defining audience personas and content pillars",
          "Researching reader questions and topic gaps",
          "Building structured editorial calendars"
        ]
      },
      {
        code: "Module 2",
        title: "Written Content & Tone Consistency",
        topics: [
          "Drafting articles, newsletters and bilingual Bengali/English copy",
          "Maintaining human editorial voice and eliminating generic AI tone",
          "Fact-checking statistics, citations and claims"
        ]
      },
      {
        code: "Module 3",
        title: "Visual Assets, Slides & Video Script Workflows",
        topics: [
          "Writing effective image generation prompts for illustrations and thumbnails",
          "Structuring short-form and educational video scripts",
          "Creating cohesive presentation decks"
        ]
      },
      {
        code: "Module 4",
        title: "Editorial Review, Copyright & Responsible Publishing",
        topics: [
          "Plagiarism checks, source attribution and intellectual property awareness",
          "Disclosure guidelines for AI-assisted media",
          "Multi-platform repurposing workflow"
        ]
      }
    ],
    practicalSkills: [
      "\u09AE\u09BE\u09B2\u09CD\u099F\u09BF-\u099A\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u0995\u09CD\u09AF\u09BE\u09B2\u09C7\u09A8\u09CD\u09A1\u09BE\u09B0 \u09A1\u09BF\u099C\u09BE\u0987\u09A8",
      "\u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1 \u09AD\u09AF\u09BC\u09C7\u09B8 \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u0995\u09BE\u09B8\u09CD\u099F\u09AE\u09BE\u0987\u099C\u09C7\u09B6\u09A8",
      "\u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u0993 \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F \u099C\u09C7\u09A8\u09BE\u09B0\u09C7\u09B6\u09A8",
      "\u09AB\u09CD\u09AF\u09BE\u0995\u09CD\u099F-\u099A\u09C7\u0995 \u0993 \u0995\u09AA\u09BF\u09B0\u09BE\u0987\u099F \u09B0\u09BF\u09AD\u09BF\u0989"
    ],
    practicalProject: {
      projectLabel: "Applied Project",
      title: "Multi-Format Campaign Content Pack",
      prompt: "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u098F\u0995\u099F\u09BF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09AC\u09BF\u09B7\u09AF\u09BC \u09AC\u09BE \u0989\u09A6\u09CD\u09AF\u09CB\u0997\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09ED-\u09A6\u09BF\u09A8\u09C7\u09B0 \u09AE\u09BE\u09B2\u09CD\u099F\u09BF-\u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u099F \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09AA\u09CD\u09AF\u09BE\u0995 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09AC\u09C7\u09A8 \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u0986\u09B0\u09CD\u099F\u09BF\u0995\u09C7\u09B2, \u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AA\u09CB\u09B8\u09CD\u099F, \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F \u0993 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u09A1\u09BF\u09B0\u09C7\u0995\u09B6\u09A8 \u09A5\u09BE\u0995\u09AC\u09C7\u0964",
      deliverables: [
        "Content Strategy & Audience Brief",
        "\u09E7\u099F\u09BF \u09A6\u09C0\u09B0\u09CD\u0998-\u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u099F \u09AC\u09CD\u09B2\u0997/\u09A8\u09BF\u09AC\u09A8\u09CD\u09A7 \u0993 \u09E9\u099F\u09BF \u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u09AA\u09CB\u09B8\u09CD\u099F",
        "\u09E7\u099F\u09BF \u09E8-\u09AE\u09BF\u09A8\u09BF\u099F\u09C7\u09B0 \u09AD\u09BF\u09A1\u09BF\u0993 \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F \u0993 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u0997\u09BE\u0987\u09A1"
      ]
    },
    outsideScope: [
      "Commercial Ad Media Buying",
      "Full-Scale Graphic Design Certification",
      "Video Production & Motion VFX Engineering"
    ],
    prerequisites: "\u09AC\u09C7\u09B8\u09BF\u0995 \u09B0\u09BE\u0987\u099F\u09BF\u0982 \u0993 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u0964",
    assessment: "\u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09AA\u09CD\u09AF\u09BE\u0995 \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u0993 \u0987\u09A8\u09B8\u09CD\u099F\u09CD\u09B0\u09BE\u0995\u09CD\u099F\u09B0 \u09AB\u09BF\u09A1\u09AC\u09CD\u09AF\u09BE\u0995\u0964",
    certificate: "\u0995\u09CB\u09B0\u09CD\u09B8 \u0993 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 1,200\u0964"
  },
  {
    code: "AP-202",
    slug: "ai-for-business-entrepreneurship",
    title: "AI for Business & Entrepreneurship",
    categorySlug: "applied-ai",
    categoryName: "Applied AI",
    tierAccent: "applied",
    tierLabel: "Applied Track",
    chipLabel: "Applied AI",
    level: "Intermediate",
    hook: "\u0989\u09A6\u09CD\u09AF\u09CB\u0995\u09CD\u09A4\u09BE \u0993 \u0995\u09CD\u09B7\u09C1\u09A6\u09CD\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8, \u0995\u09BE\u09B8\u09CD\u099F\u09AE\u09BE\u09B0 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8, \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F \u09B0\u09BF\u09B8\u09BE\u09B0\u09CD\u099A \u0993 \u0996\u09B0\u099A \u0995\u09AE\u09BE\u09A4\u09C7 AI-\u09B0 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 (\u09F31,200)\u0964",
    overview: "\u09A8\u09A4\u09C1\u09A8 \u0989\u09A6\u09CD\u09AF\u09CB\u0995\u09CD\u09A4\u09BE \u0993 \u0995\u09CD\u09B7\u09C1\u09A6\u09CD\u09B0/\u09AE\u09BE\u099D\u09BE\u09B0\u09BF \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u0995\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u0995\u09B0\u09BE \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F \u09AD\u09CD\u09AF\u09BE\u09B2\u09BF\u09A1\u09C7\u09B6\u09A8, \u09AC\u09BF\u099C\u09A8\u09C7\u09B8 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u09A8\u09BF\u0982, \u0995\u09BE\u09B8\u09CD\u099F\u09AE\u09BE\u09B0 \u09B8\u09BE\u09AA\u09CB\u09B0\u09CD\u099F \u099F\u09C7\u09AE\u09AA\u09CD\u09B2\u09C7\u099F \u098F\u09AC\u0982 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8\u09BE\u09B2 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE \u09AC\u09BE\u09A1\u09BC\u09BE\u09A4\u09C7 AI \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09B8\u09B9\u09BE\u09AF\u09BC\u0995 \u09AD\u09C2\u09AE\u09BF\u0995\u09BE \u09B0\u09BE\u0996\u09C7 \u09A4\u09BE \u09B9\u09BE\u09A4\u09C7-\u0995\u09B2\u09AE\u09C7 \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 1,200",
    feeNote: "Full 4-Week Applied Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_business_transformation_1794924809638.jpg",
    imageAlt: "AI for Business and Entrepreneurship operational planning session",
    whoThisCourseIsFor: [
      "\u0995\u09CD\u09B7\u09C1\u09A6\u09CD\u09B0 \u0993 \u09AE\u09BE\u099D\u09BE\u09B0\u09BF \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u09AE\u09BE\u09B2\u09BF\u0995, \u0989\u09A6\u09CD\u09AF\u09CB\u0995\u09CD\u09A4\u09BE \u0993 \u09B8\u09CD\u099F\u09BE\u09B0\u09CD\u099F\u0986\u09AA \u09AB\u09BE\u0989\u09A8\u09CD\u09A1\u09BE\u09B0",
      "\u09B8\u09CD\u09AC-\u0989\u09A6\u09CD\u09AF\u09CB\u0997\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE \u0993 \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8 \u09B8\u09B9\u099C \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8 \u098F\u09AE\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u0993 \u09AA\u09C7\u09B6\u09BE\u099C\u09C0\u09AC\u09C0"
    ],
    keyAreas: [
      "Market Validation & Competitor Mapping",
      "Business Model & Lean Financial Narratives",
      "Customer Support & Sales Communication SOPs",
      "Small-Team Operational Productivity & Data Privacy"
    ],
    learningOutcomes: [
      "AI \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE\u09AF\u09BC \u09A6\u09CD\u09B0\u09C1\u09A4 \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F \u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1, \u09AA\u09CD\u09B0\u09A4\u09BF\u09AF\u09CB\u0997\u09C0 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3 \u0993 \u0995\u09CD\u09B0\u09C7\u09A4\u09BE\u09B0 \u099A\u09BE\u09B9\u09BF\u09A6\u09BE \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09AF\u09BC\u09BF\u0995 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09BE\u09AC\u09A8\u09BE, \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F \u09A1\u09BF\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0993 \u0995\u09BE\u09B8\u09CD\u099F\u09AE\u09BE\u09B0 FAQ \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u099B\u09CB\u099F \u099F\u09BF\u09AE\u09C7\u09B0 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0987\u09A8\u09AD\u09C7\u09A8\u09CD\u099F\u09B0\u09BF \u09A8\u09CB\u099F, \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982 \u0993 \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8\u09BE\u09B2 SOP \u09B8\u09BE\u099C\u09BE\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u0995\u09CD\u09B0\u09C7\u09A4\u09BE\u09B0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A4\u09A5\u09CD\u09AF\u09C7\u09B0 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE \u0993 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u09A8\u09C8\u09A4\u09BF\u0995 \u09AE\u09BE\u09A8\u09A6\u09A3\u09CD\u09A1 \u09AC\u099C\u09BE\u09AF\u09BC \u09B0\u09C7\u0996\u09C7 AI \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI-Assisted Market Discovery & Business Modelling",
        topics: [
          "Identifying local customer pain points and market gaps",
          "Structuring Lean Canvas and value propositions with AI",
          "Validating AI market assumptions against real-world data"
        ]
      },
      {
        code: "Module 2",
        title: "Product Positioning, Pricing Narratives & Pitching",
        topics: [
          "Writing clear product catalogues and value messaging",
          "Preparing partner and supplier outreach briefs",
          "Developing structured pitch outlines"
        ]
      },
      {
        code: "Module 3",
        title: "Customer Experience & Operations Efficiency",
        topics: [
          "Designing customer support response libraries and FAQ templates",
          "Standardising recurring operational checklists and SOPs",
          "Organising customer feedback to improve service quality"
        ]
      },
      {
        code: "Module 4",
        title: "Budgeting Basics & Responsible Business AI",
        topics: [
          "Drafting expense trackers and cash-flow checklist templates",
          "Protecting customer PII and confidential business records",
          "Evaluating tool ROI before committing to paid subscriptions"
        ]
      }
    ],
    practicalSkills: [
      "Lean Canvas \u0993 Market Research Brief \u09A4\u09C8\u09B0\u09BF",
      "Customer Support SOP \u0993 FAQ \u09AB\u09CD\u09B0\u09C7\u09AE\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995 \u09A4\u09C8\u09B0\u09BF",
      "\u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8\u09BE\u09B2 \u099A\u09C7\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u0993 \u09AC\u09CD\u09AF\u09AF\u09BC \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BE\u09B0 \u09A1\u09BF\u099C\u09BE\u0987\u09A8"
    ],
    practicalProject: {
      projectLabel: "Applied Project",
      title: "Small Business AI Operations & Growth Kit",
      prompt: "\u098F\u0995\u099F\u09BF \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u09AC\u09BE \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09BF\u09A4 \u0995\u09CD\u09B7\u09C1\u09A6\u09CD\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F \u09AC\u09CD\u09B0\u09BF\u09AB, \u0995\u09BE\u09B8\u09CD\u099F\u09AE\u09BE\u09B0 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09B0\u09BF\u09AA\u09CD\u09B2\u09BE\u0987 \u0995\u09BF\u099F \u098F\u09AC\u0982 \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8\u09BE\u09B2 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B6\u09A8 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C1\u09A8\u0964",
      deliverables: [
        "Lean Business & Market Research Brief",
        "Customer Support FAQ & Response Library",
        "Weekly Operations & Expense Review Checklist"
      ]
    },
    outsideScope: [
      "Guaranteed Revenue or Business Funding",
      "Company Legal Registration or Tax Filing Advice",
      "Enterprise ERP Engineering"
    ],
    prerequisites: "\u09AC\u09CD\u09AF\u09AC\u09B8\u09BE \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u09AC\u09BE \u09A8\u09A4\u09C1\u09A8 \u0989\u09A6\u09CD\u09AF\u09CB\u0997 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u0986\u0997\u09CD\u09B0\u09B9 \u0993 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u0964",
    assessment: "Business AI Kit \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09BE\u09AC\u09AE\u09BF\u09B6\u09A8 \u0993 \u09AE\u09C7\u09A8\u09CD\u099F\u09B0 \u09AB\u09BF\u09A1\u09AC\u09CD\u09AF\u09BE\u0995\u0964",
    certificate: "\u0995\u09CB\u09B0\u09CD\u09B8 \u0993 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 1,200\u0964"
  },
  {
    code: "AP-203",
    slug: "ai-automation-workflow-design",
    title: "AI Automation & Workflow Design",
    categorySlug: "applied-ai",
    categoryName: "Applied AI",
    tierAccent: "applied",
    tierLabel: "Applied Track",
    chipLabel: "Applied AI",
    level: "Intermediate",
    hook: "\u09AA\u09C1\u09A8\u09B0\u09BE\u09AC\u09C3\u09A4\u09CD\u09A4\u09BF\u09AE\u09C2\u09B2\u0995 \u09A6\u09BE\u09AA\u09CD\u09A4\u09B0\u09BF\u0995 \u0995\u09BE\u099C\u0997\u09C1\u09B2\u09CB\u0995\u09C7 No-code tool, webhook \u0993 human-in-the-loop AI workflow-\u09A4\u09C7 \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09BE (\u09F31,200)\u0964",
    overview: "\u0995\u09CB\u09A8\u09CB \u099C\u099F\u09BF\u09B2 \u0995\u09CB\u09A1\u09BF\u0982 \u099B\u09BE\u09A1\u09BC\u09BE\u0987 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09AB\u09B0\u09CD\u09AE \u09A1\u09C7\u099F\u09BE, \u0987\u09AE\u09C7\u0987\u09B2, \u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09A1\u09B6\u09BF\u099F \u098F\u09AC\u0982 AI \u09B8\u09BE\u09AE\u09BE\u09B0\u09BF \u09AC\u09BE \u0995\u09CD\u09B2\u09BE\u09B8\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8 \u09A7\u09BE\u09AA\u0997\u09C1\u09B2\u09CB\u0995\u09C7 \u09B8\u0982\u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C7 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u0993 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0 \u0985\u099F\u09CB\u09AE\u09C7\u09B6\u09A8 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE \u09AF\u09BE\u09AF\u09BC, \u09A4\u09BE \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09B9\u09BE\u09A4\u09C7-\u0995\u09B2\u09AE\u09C7 \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 1,200",
    feeNote: "Full 4-Week Applied Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_workflow_automation_1794924807818.jpg",
    imageAlt: "AI Automation and no-code workflow orchestration design diagram",
    whoThisCourseIsFor: [
      "\u09AA\u09CD\u09B0\u09B6\u09BE\u09B8\u09A8\u09BF\u0995, \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8 \u0993 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09A8\u09CD\u09AC\u09AF\u09BC\u0995\u09BE\u09B0\u09C0 \u09AF\u09BE\u09B0\u09BE \u09AE\u09CD\u09AF\u09BE\u09A8\u09C1\u09AF\u09BC\u09BE\u09B2 \u09A1\u09C7\u099F\u09BE \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF \u0995\u09AE\u09BE\u09A4\u09C7 \u099A\u09BE\u09A8",
      "No-code \u0985\u099F\u09CB\u09AE\u09C7\u09B6\u09A8 \u0993 \u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 AI \u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995\u09AB\u09CD\u09B2\u09CB \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u09B6\u09BF\u0996\u09A4\u09C7 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF"
    ],
    keyAreas: [
      "Workflow Mapping & Bottleneck Analysis",
      "Triggers, Actions, Webhooks & JSON Basics",
      "Integrating Forms, Sheets & AI Processing Steps",
      "Error Handling & Human-in-the-Loop Controls"
    ],
    learningOutcomes: [
      "\u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0995\u09BE\u099C\u09C7\u09B0 \u0995\u09CB\u09A8 \u0985\u0982\u09B6 \u0985\u099F\u09CB\u09AE\u09C7\u09B6\u09A8\u09AF\u09CB\u0997\u09CD\u09AF \u098F\u09AC\u0982 \u0995\u09CB\u09A5\u09BE\u09AF\u09BC \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u09B8\u09BF\u09A6\u09CD\u09A7\u09BE\u09A8\u09CD\u09A4 \u099C\u09B0\u09C1\u09B0\u09BF \u09A4\u09BE \u099A\u09BF\u09B9\u09CD\u09A8\u09BF\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "Triggers, actions, filters \u098F\u09AC\u0982 webhooks \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09AE\u09BE\u09B2\u09CD\u099F\u09BF-\u09B8\u09CD\u099F\u09C7\u09AA \u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995\u09AB\u09CD\u09B2\u09CB \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "AI summarization \u0993 classification \u09A7\u09BE\u09AA \u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C7 \u09AB\u09B0\u09CD\u09AE \u0993 \u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09A1\u09B6\u09BF\u099F \u09A1\u09C7\u099F\u09BE \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u0985\u099F\u09CB\u09AE\u09C7\u09B6\u09A8 \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5\u09A4\u09BE, \u09A1\u09C1\u09AA\u09CD\u09B2\u09BF\u0995\u09C7\u099F \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF \u0993 \u09A1\u09C7\u099F\u09BE \u0997\u09CB\u09AA\u09A8\u09C0\u09AF\u09BC\u09A4\u09BE\u09B0 \u099D\u09C1\u0981\u0995\u09BF \u09AE\u09CB\u0995\u09BE\u09AC\u09BF\u09B2\u09BE\u09AF\u09BC \u09B8\u09C7\u09AB\u0997\u09BE\u09B0\u09CD\u09A1 \u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Process Mapping & Automation Readiness",
        topics: [
          "Auditing repetitive office and digital workflows",
          "Identifying triggers, inputs, decisions and outputs",
          "When NOT to automate: privacy and error risk criteria"
        ]
      },
      {
        code: "Module 2",
        title: "No-Code Automation Building Blocks",
        topics: [
          "Connecting forms, spreadsheets, calendars and email",
          "Understanding webhooks and structured JSON payloads simply",
          "Conditional branching and data formatting"
        ]
      },
      {
        code: "Module 3",
        title: "Adding AI Steps & Structured Prompts in Workflows",
        topics: [
          "Designing reliable structured outputs for automation",
          "Routing, tagging and summarising incoming inquiries",
          "Adding human-in-the-loop approval checkpoints"
        ]
      },
      {
        code: "Module 4",
        title: "Testing, Error Handling & Documentation",
        topics: [
          "Handling edge cases, rate limits and fallback alerts",
          "Sanitising sensitive personal information before AI calls",
          "Writing handover documentation for team workflows"
        ]
      }
    ],
    practicalSkills: [
      "Process Flowchart \u0993 Bottleneck \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3",
      "No-code \u0985\u099F\u09CB\u09AE\u09C7\u09B6\u09A8 \u0993 Webhook \u09B8\u0982\u09AF\u09CB\u0997",
      "Structured AI Output \u098F\u09AC\u0982 Human Review \u0997\u09C7\u099F \u09A1\u09BF\u099C\u09BE\u0987\u09A8"
    ],
    practicalProject: {
      projectLabel: "Applied Project",
      title: "Human-Reviewed Inquiry Triage Workflow Blueprint",
      prompt: "\u09AB\u09B0\u09CD\u09AE \u09A5\u09C7\u0995\u09C7 \u09AA\u09CD\u09B0\u09BE\u09AA\u09CD\u09A4 \u09A4\u09A5\u09CD\u09AF \u09B8\u0982\u0997\u09CD\u09B0\u09B9, AI-\u098F\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09B6\u09CD\u09B0\u09C7\u09A3\u09BF\u09AC\u09BF\u09A8\u09CD\u09AF\u09BE\u09B8 \u0993 \u0996\u09B8\u09A1\u09BC\u09BE \u0989\u09A4\u09CD\u09A4\u09B0 \u09A4\u09C8\u09B0\u09BF \u098F\u09AC\u0982 \u09AE\u09BE\u09A8\u09AC \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09A8\u09C7\u09B0 (human-in-the-loop) \u099C\u09A8\u09CD\u09AF \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3\u09C7\u09B0 \u098F\u0995\u099F\u09BF \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995\u09AB\u09CD\u09B2\u09CB \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u0995\u09B0\u09C1\u09A8\u0964",
      deliverables: [
        "Workflow Architecture Diagram \u0993 Field Schema",
        "AI Classification Prompt \u0993 Error-Handling Checklist",
        "\u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B6\u09A8 \u0993 \u09A1\u09C7\u099F\u09BE \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u09B0\u09BF\u09AD\u09BF\u0989 \u09A8\u09CB\u099F"
      ]
    },
    outsideScope: [
      "Custom Enterprise Backend Microservices",
      "Production Kubernetes / Cloud DevOps Engineering",
      "Bypassing Platform Security Policies"
    ],
    prerequisites: "\u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09A1\u09B6\u09BF\u099F \u0993 \u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u09AB\u09B0\u09CD\u09AE \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u0964 \u0995\u09CB\u09A1\u09BF\u0982 \u09AA\u09C2\u09B0\u09CD\u09AC\u09B6\u09B0\u09CD\u09A4 \u09A8\u09AF\u09BC\u0964",
    assessment: "\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995\u09AB\u09CD\u09B2\u09CB \u09AC\u09CD\u09B2\u09C1\u09AA\u09CD\u09B0\u09BF\u09A8\u09CD\u099F \u0993 \u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u099F\u09C7\u09B8\u09CD\u099F \u0995\u09C7\u09B8 \u09B8\u09BE\u09AC\u09AE\u09BF\u09B6\u09A8\u0964",
    certificate: "\u0995\u09CB\u09B0\u09CD\u09B8 \u0993 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 1,200\u0964"
  },
  {
    code: "AP-204",
    slug: "ai-powered-website-development",
    title: "AI-Powered Website Development",
    categorySlug: "applied-ai",
    categoryName: "Applied AI",
    tierAccent: "applied",
    tierLabel: "Applied Track",
    chipLabel: "Applied AI",
    level: "Intermediate",
    hook: "AI-assisted coding \u0993 \u0986\u09A7\u09C1\u09A8\u09BF\u0995 \u0993\u09AF\u09BC\u09C7\u09AC \u099F\u09C7\u0995\u09A8\u09CB\u09B2\u099C\u09BF \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09A8\u09BF\u099C\u09B8\u09CD\u09AC responsive website \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE, \u09A4\u09C8\u09B0\u09BF \u0993 deploy \u0995\u09B0\u09BE (\u09F31,200)\u0964",
    overview: "\u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7 \u09A4\u09BE \u09AC\u09C1\u099D\u09C7 \u098F\u09AC\u0982 AI coding assistant-\u0995\u09C7 \u09B8\u09A0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u0997\u09BE\u0987\u09A1 \u0995\u09B0\u09C7 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09AA\u09B0\u09BF\u099A\u09CD\u099B\u09A8\u09CD\u09A8, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2-\u09B0\u09C7\u09B8\u09AA\u09A8\u09CD\u09B8\u09BF\u09AD \u0993 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09AC\u09BE\u09A8\u09CD\u09A7\u09AC \u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u09A4\u09C8\u09B0\u09BF, \u09AF\u09BE\u099A\u09BE\u0987 \u0993 \u09B2\u09BE\u0987\u09AD \u09AA\u09BE\u09AC\u09B2\u09BF\u09B6 \u0995\u09B0\u09BE \u09AF\u09BE\u09AF\u09BC\u2014\u09A4\u09BE \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u09AE\u09C2\u09B2 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 1,200",
    feeNote: "Full 4-Week Applied Course \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_website_development_1794924809286.jpg",
    imageAlt: "AI-Powered Website Development responsive interface and coding workflow",
    whoThisCourseIsFor: [
      "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0, \u09AB\u09CD\u09B0\u09BF\u09B2\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8\u09BE\u09B0 \u0993 \u0989\u09A6\u09CD\u09AF\u09CB\u0995\u09CD\u09A4\u09BE \u09AF\u09BE\u09B0\u09BE \u09A8\u09BF\u099C\u09C7\u09B0 \u09AC\u09BE \u0989\u09A6\u09CD\u09AF\u09CB\u0997\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8",
      "AI coding assistant \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u0993 \u09B8\u09A0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u0993\u09AF\u09BC\u09C7\u09AC \u09AA\u09C7\u099C \u09A4\u09C8\u09B0\u09BF \u09B6\u09BF\u0996\u09A4\u09C7 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF"
    ],
    keyAreas: [
      "Web Foundations (HTML, CSS & Responsive Layout)",
      "Prompting AI Assistants for Clean UI Components",
      "Debugging, Accessibility & SEO Basics",
      "Static Deployment & Custom Domain Basics"
    ],
    learningOutcomes: [
      "\u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F\u09C7\u09B0 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB (HTML, CSS \u0993 \u09AC\u09C7\u09B8\u09BF\u0995 JavaScript) \u098F\u09AC\u0982 \u09B0\u09C7\u09B8\u09AA\u09A8\u09CD\u09B8\u09BF\u09AD \u09A1\u09BF\u099C\u09BE\u0987\u09A8\u09C7\u09B0 \u09AE\u09C2\u09B2\u09A8\u09C0\u09A4\u09BF \u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "AI \u0995\u09CB\u09A1\u09BF\u0982 \u099F\u09C1\u09B2\u0995\u09C7 \u09B8\u09CD\u09AA\u09B7\u09CD\u099F \u0995\u09A8\u099F\u09C7\u0995\u09CD\u09B8\u099F \u0993 \u09B8\u09CD\u09AA\u09C7\u09B8\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09AE\u09A1\u09C1\u09B2\u09BE\u09B0 \u09B8\u09C7\u0995\u09B6\u09A8 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "AI-\u099C\u09C7\u09A8\u09BE\u09B0\u09C7\u099F\u09C7\u09A1 \u0995\u09CB\u09A1\u09C7 \u09AC\u09BE\u0997 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4, \u0985\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09C7\u09B8\u09BF\u09AC\u09BF\u09B2\u09BF\u099F\u09BF \u0993 \u09AA\u09C7\u099C \u09B8\u09CD\u09AA\u09BF\u09A1 \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09A8\u09BF\u099C\u09B8\u09CD\u09AC \u09A4\u09C8\u09B0\u09BF \u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6\u09C7 \u0995\u09CD\u09B2\u09BE\u0989\u09A1/\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09BF\u0995 \u09B9\u09CB\u09B8\u09CD\u099F\u09BF\u0982\u09AF\u09BC\u09C7 \u09A1\u09BF\u09AA\u09CD\u09B2\u09AF\u09BC \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Module 1",
        title: "Web Fundamentals & Information Architecture",
        topics: [
          "Understanding HTML semantics, CSS layout (Flexbox/Grid) and mobile responsiveness",
          "Planning sitemap, page hierarchy and clear user journeys",
          "Preparing brand copy, colour palette and imagery before prompting code"
        ]
      },
      {
        code: "Module 2",
        title: "Prompting AI for Structured Front-End Components",
        topics: [
          "Breaking pages into reusable navigation, hero, card and footer sections",
          "Writing technical prompts with layout and constraint specifications",
          "Iterating on spacing, typography and responsive breakpoints"
        ]
      },
      {
        code: "Module 3",
        title: "Testing, Debugging & Accessibility Verification",
        topics: [
          "Inspecting browser DevTools for layout and console issues",
          "Checking heading hierarchy, alt text, contrast and keyboard navigation",
          "Spotting security pitfalls like exposed keys or unsafe form handling"
        ]
      },
      {
        code: "Module 4",
        title: "SEO Metadata & Live Website Deployment",
        topics: [
          "Configuring page titles, meta descriptions and Open Graph tags",
          "Deploying static websites cleanly using modern hosting workflows",
          "Ongoing content maintenance and version hygiene"
        ]
      }
    ],
    practicalSkills: [
      "\u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u0993\u09AF\u09BC\u09CD\u09AF\u09BE\u09B0\u09AB\u09CD\u09B0\u09C7\u09AE \u0993 \u09B8\u09C7\u0995\u09B6\u09A8 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u09A8\u09BF\u0982",
      "AI \u0995\u09CB\u09A1\u09BF\u0982 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u0993 \u0995\u09AE\u09CD\u09AA\u09CB\u09A8\u09C7\u09A8\u09CD\u099F \u0987\u099F\u09BE\u09B0\u09C7\u09B6\u09A8",
      "\u09AC\u09CD\u09B0\u09BE\u0989\u099C\u09BE\u09B0 \u0987\u09A8\u09CD\u09B8\u09AA\u09C7\u0995\u09B6\u09A8, \u0985\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09C7\u09B8\u09BF\u09AC\u09BF\u09B2\u09BF\u099F\u09BF \u099A\u09C7\u0995 \u0993 \u09A1\u09BF\u09AA\u09CD\u09B2\u09AF\u09BC\u09AE\u09C7\u09A8\u09CD\u099F"
    ],
    practicalProject: {
      projectLabel: "Applied Project",
      title: "Live Responsive Portfolio or Initiative Website",
      prompt: "\u098F\u0995\u099F\u09BF \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09AA\u09CB\u09B0\u09CD\u099F\u09AB\u09CB\u09B2\u09BF\u0993 \u09AC\u09BE \u0995\u09AE\u09BF\u0989\u09A8\u09BF\u099F\u09BF \u0989\u09A6\u09CD\u09AF\u09CB\u0997\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A8\u09CD\u09AF\u09C2\u09A8\u09A4\u09AE \u09EA \u09B8\u09C7\u0995\u09B6\u09A8\u09AC\u09BF\u09B6\u09BF\u09B7\u09CD\u099F \u09AE\u09CB\u09AC\u09BE\u0987\u09B2-\u09B0\u09C7\u09B8\u09AA\u09A8\u09CD\u09B8\u09BF\u09AD \u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C7 \u09A1\u09BF\u09AA\u09CD\u09B2\u09AF\u09BC \u0993 \u09AD\u09C7\u09B0\u09BF\u09AB\u09BE\u0987 \u0995\u09B0\u09C1\u09A8\u0964",
      deliverables: [
        "Information Architecture & Visual Spec",
        "\u09B0\u09C7\u09B8\u09AA\u09A8\u09CD\u09B8\u09BF\u09AD \u0993\u09DF\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u09B8\u09CB\u09B0\u09CD\u09B8 \u0993 \u09B2\u09BE\u0987\u09AD \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989 \u09B2\u09BF\u0999\u09CD\u0995",
        "Accessibility \u0993 SEO \u099A\u09C7\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F"
      ]
    },
    outsideScope: [
      "Full-Stack Distributed Microservices Engineering",
      "Custom Payment Gateway PCI-DSS Certification",
      "Enterprise Cloud Infrastructure Security Audits"
    ],
    prerequisites: "\u09AC\u09C7\u09B8\u09BF\u0995 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0993 \u0993\u09AF\u09BC\u09C7\u09AC \u09AC\u09CD\u09B0\u09BE\u0989\u099C\u09BE\u09B0 \u099A\u09BE\u09B2\u09BE\u09A8\u09CB\u09B0 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u0964 \u09AA\u09C2\u09B0\u09CD\u09AC \u0995\u09CB\u09A1\u09BF\u0982 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE \u0986\u09AC\u09B6\u09CD\u09AF\u0995 \u09A8\u09AF\u09BC\u0964",
    assessment: "\u09A1\u09BF\u09AA\u09CD\u09B2\u09AF\u09BC\u09C7\u09A1 \u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u0993 \u0995\u09CB\u09A1/\u0985\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09C7\u09B8\u09BF\u09AC\u09BF\u09B2\u09BF\u099F\u09BF \u09B0\u09BF\u09AD\u09BF\u0989\u0964",
    certificate: "\u0995\u09CB\u09B0\u09CD\u09B8 \u0993 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 1,200\u0964"
  },
  // =========================================================================
  // CATEGORY 3: PROFESSIONAL DEVELOPMENT (7 Courses: PD-301 .. PD-307, BDT 2,500)
  // =========================================================================
  {
    code: "PD-301",
    slug: "ai-for-professionals-workplace-productivity",
    title: "AI for Professionals & Workplace Productivity",
    categorySlug: "professional-development",
    categoryName: "Professional Development",
    tierAccent: "professional",
    tierLabel: "Professional Track",
    chipLabel: "Professional Development",
    level: "Intermediate",
    hook: "\u0995\u09B0\u09CD\u09AA\u09CB\u09B0\u09C7\u099F \u0993 \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982, \u09B8\u09AE\u09A8\u09CD\u09AC\u09AF\u09BC, \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3 \u0993 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u0995\u09B0\u09CD\u09AE\u09A6\u0995\u09CD\u09B7\u09A4\u09BE \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF\u09B0 \u09B8\u09AE\u09A8\u09CD\u09AC\u09BF\u09A4 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 (\u09F32,500)\u0964",
    overview: "This programme helps professionals integrate AI into their everyday work to improve productivity, communication, research, documentation and decision-making. Participants will learn to use AI as a practical work assistant while maintaining professional judgement, accuracy and accountability.",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 2,500",
    feeNote: "Full 4-Week Professional Track \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_everyday_productivity_1794924806999.jpg",
    imageAlt: "AI for Professionals and Workplace Productivity executive workshop",
    whoThisCourseIsFor: [
      "Corporate and private-sector professionals",
      "Government and public-sector employees",
      "NGO and development-sector professionals",
      "Administrative and programme officers",
      "Consultants, researchers and independent professionals",
      "Early and mid-career professionals"
    ],
    keyAreas: [
      "Advanced Prompting for Professional Tasks",
      "AI-Powered Communication & Documentation",
      "Research, Knowledge Management & Verification",
      "Spreadsheets, Reporting & Responsible AI at Work"
    ],
    learningOutcomes: [
      "Integrate AI into professional workflows to produce higher-quality briefs, reports, emails, and meeting documentation.",
      "Conduct structured AI-assisted desk research while verifying sources and eliminating hallucinations.",
      "Use AI to organise spreadsheets, interpret trends, and build management-ready reporting narratives.",
      "Apply confidentiality, data privacy, and human-oversight standards through a personal responsible AI workplace framework."
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI in the Modern Professional Workplace",
        topics: [
          "Understanding AI's role in professional environments",
          "Generative AI and workplace applications",
          "Identifying tasks suitable for AI assistance",
          "AI-assisted versus human-led work",
          "Understanding limitations and professional responsibility"
        ]
      },
      {
        code: "Module 2",
        title: "Advanced Prompting for Professional Tasks",
        topics: [
          "Structuring effective professional prompts",
          "Context, role, objective and output specification",
          "Multi-step prompting techniques",
          "Prompt refinement and response evaluation",
          "Building reusable prompt templates for recurring tasks"
        ]
      },
      {
        code: "Module 3",
        title: "AI-Powered Communication & Documentation",
        topics: [
          "Drafting professional emails and correspondence",
          "Preparing reports, proposals and briefing notes",
          "Meeting agendas, minutes and action-point extraction",
          "Executive summaries and document simplification",
          "Professional tone, clarity and audience adaptation"
        ]
      },
      {
        code: "Module 4",
        title: "Research, Information & Knowledge Management",
        topics: [
          "AI-assisted desk research",
          "Information extraction and synthesis",
          "Summarising long reports and documents",
          "Comparing multiple sources and perspectives",
          "Fact-checking and source verification",
          "Building structured knowledge repositories"
        ]
      },
      {
        code: "Module 5",
        title: "AI for Data, Spreadsheets & Reporting",
        topics: [
          "AI-assisted spreadsheet operations",
          "Data cleaning and organisation",
          "Basic data interpretation and trend identification",
          "Generating charts and narrative summaries",
          "Preparing management-ready reports",
          "Understanding the risks of inaccurate AI-generated analysis"
        ]
      },
      {
        code: "Module 6",
        title: "Personal Productivity & Workflow Optimisation",
        topics: [
          "Task prioritisation and planning",
          "AI-assisted scheduling and work organisation",
          "Automating repetitive administrative tasks",
          "Creating personal productivity workflows",
          "Improving time management and task execution"
        ]
      },
      {
        code: "Module 7",
        title: "Responsible AI at Work",
        topics: [
          "Confidentiality and sensitive workplace information",
          "Data privacy and information security",
          "Reviewing AI-generated professional outputs",
          "Bias, hallucinations and reliability",
          "Human oversight and accountability",
          "Developing a personal responsible AI usage framework"
        ]
      }
    ],
    practicalSkills: [
      "Produce professional documents with AI assistance",
      "Research and synthesise complex information",
      "Prepare structured reports and presentations",
      "Work more efficiently with spreadsheets and data",
      "Design repeatable productivity workflows",
      "Evaluate AI-generated outputs before professional use"
    ],
    practicalProject: {
      projectLabel: "Capstone Project",
      title: "AI-Enabled Professional Productivity Portfolio",
      prompt: "Participants compile a workplace-ready productivity portfolio integrating reusable prompt systems, executive documentation, research synthesis, and data security safeguards.",
      deliverables: [
        "A professional prompt library",
        "An AI-assisted report or briefing document",
        "A meeting documentation workflow",
        "A research and information synthesis exercise",
        "A personal AI productivity workflow",
        "A responsible AI usage checklist"
      ]
    },
    outsideScope: [
      "Advanced software engineering",
      "Professional data science and statistical modelling",
      "Enterprise-scale automation implementation",
      "Specialised legal, financial or medical advice"
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: "\u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0, \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09B8\u0982\u09AF\u09CB\u0997 \u0993 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u0985\u09AB\u09BF\u09B8\u09BF\u09AF\u09BC\u09BE\u09B2 \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F/\u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09A1\u09B6\u09BF\u099F \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u0964",
    assessment: "\u09B8\u09BE\u09AA\u09CD\u09A4\u09BE\u09B9\u09BF\u0995 \u0995\u09C7\u09B8 \u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u0993 \u09B8\u09AE\u09BE\u09AA\u09A8\u09C0 Capstone Project \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 2,500 (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u09AF\u09CB\u0997\u09CD\u09AF)\u0964"
  },
  {
    code: "PD-302",
    slug: "ai-for-business-development",
    title: "AI for Business Development",
    categorySlug: "professional-development",
    categoryName: "Professional Development",
    tierAccent: "professional",
    tierLabel: "Professional Track",
    chipLabel: "Professional Development",
    level: "Intermediate",
    hook: "\u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F \u0987\u09A8\u09CD\u099F\u09C7\u09B2\u09BF\u099C\u09C7\u09A8\u09CD\u09B8, \u0995\u09CD\u09B2\u09BE\u09AF\u09BC\u09C7\u09A8\u09CD\u099F \u09AA\u09CD\u09B0\u09CB\u09AA\u09CB\u099C\u09BE\u09B2, \u09AA\u09BE\u09B0\u09CD\u099F\u09A8\u09BE\u09B0\u09B6\u09BF\u09AA \u0993 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8 \u0997\u09CD\u09B0\u09CB\u09A5 \u09AA\u09BE\u0987\u09AA\u09B2\u09BE\u0987\u09A8\u09C7 AI-\u09B0 \u0995\u09CC\u09B6\u09B2\u0997\u09A4 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 (\u09F32,500)\u0964",
    overview: "This programme focuses on using AI to strengthen business development capabilities, identify market opportunities, understand customers, develop partnerships, improve sales processes and support sustainable organisational growth. Participants will learn how AI can support business research, opportunity assessment, strategic planning and relationship management.",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 2,500",
    feeNote: "Full 4-Week Professional Track \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_business_transformation_1794924809638.jpg",
    imageAlt: "AI for Business Development market intelligence and partnership strategy",
    whoThisCourseIsFor: [
      "Business development professionals",
      "Entrepreneurs and business owners",
      "Sales and growth executives",
      "Partnership and relationship managers",
      "Consultants and independent professionals",
      "Startup founders and aspiring entrepreneurs"
    ],
    keyAreas: [
      "Market Intelligence & Opportunity Research",
      "Customer Personas & Value Propositions",
      "Sales Strategy, Lead Qualification & Proposals",
      "Partnerships, SWOT & Ethical Intelligence Verification"
    ],
    learningOutcomes: [
      "Use AI to research industry trends, segment markets, analyse competitors, and validate market intelligence responsibly.",
      "Build detailed customer personas, journey maps, and clear value propositions aligned with buyer pain points.",
      "Design AI-assisted lead qualification frameworks, tailored outreach messages, and structured partnership proposals.",
      "Protect client confidentiality and avoid fabricated intelligence in commercial decision-making."
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI and the Business Development Landscape",
        topics: [
          "Understanding business development functions",
          "AI applications across the business lifecycle",
          "Opportunity identification through AI",
          "AI-assisted business intelligence",
          "Selecting appropriate AI tools for business needs"
        ]
      },
      {
        code: "Module 2",
        title: "Market Intelligence & Opportunity Research",
        topics: [
          "AI-assisted industry research",
          "Identifying market gaps and emerging opportunities",
          "Competitor and sector analysis",
          "Market segmentation",
          "Customer needs and demand assessment",
          "Validating AI-generated market information"
        ]
      },
      {
        code: "Module 3",
        title: "Customer Intelligence & Value Proposition",
        topics: [
          "Customer persona development",
          "Understanding customer pain points",
          "Customer journey mapping",
          "Value proposition development",
          "Product and service positioning",
          "AI-assisted customer feedback analysis"
        ]
      },
      {
        code: "Module 4",
        title: "Sales Strategy & Lead Development",
        topics: [
          "AI-assisted lead research and qualification",
          "Prospect segmentation",
          "Sales communication and outreach",
          "Proposal and pitch development",
          "Sales pipeline planning",
          "Personalised customer engagement"
        ]
      },
      {
        code: "Module 5",
        title: "Partnerships, Networking & Strategic Engagement",
        topics: [
          "Identifying potential partners",
          "Partnership opportunity mapping",
          "Preparing collaboration proposals",
          "Stakeholder mapping",
          "AI-assisted meeting preparation",
          "Relationship management documentation"
        ]
      },
      {
        code: "Module 6",
        title: "Business Growth & Performance Analysis",
        topics: [
          "Growth strategy development",
          "AI-assisted SWOT analysis",
          "Identifying business performance indicators",
          "Sales and customer trend analysis",
          "Preparing business development reports",
          "Evaluating growth opportunities"
        ]
      },
      {
        code: "Module 7",
        title: "Responsible AI for Business Development",
        topics: [
          "Protecting customer and business information",
          "Accuracy in market and competitor research",
          "Avoiding fabricated business intelligence",
          "Ethical customer engagement",
          "Human verification and decision-making",
          "Developing an AI-supported business development plan"
        ]
      }
    ],
    practicalSkills: [
      "Market and competitor research",
      "Customer persona development",
      "Lead research and qualification",
      "Sales communication and proposal writing",
      "Partnership opportunity mapping",
      "Business growth planning",
      "AI-assisted business reporting"
    ],
    practicalProject: {
      projectLabel: "Capstone Project",
      title: "AI-Assisted Business Development Strategy",
      prompt: "Participants construct a complete 90-day business development and partnership blueprint grounded in verified market and customer intelligence.",
      deliverables: [
        "An industry and market research brief",
        "A competitor analysis",
        "Customer personas and target segments",
        "A value proposition",
        "A lead generation and outreach framework",
        "A partnership opportunity map",
        "A 90-day business development action plan"
      ]
    },
    outsideScope: [
      "Guaranteed sales or revenue generation",
      "Professional investment and financial advisory",
      "Legal company registration services",
      "Advanced CRM software implementation",
      "Enterprise sales management certification"
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: "\u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09AF\u09BC\u09BF\u0995 \u0989\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8, \u09B8\u09C7\u09B2\u09B8 \u09AC\u09BE \u0989\u09A6\u09CD\u09AF\u09CB\u0997 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE \u098F\u09AC\u0982 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u0993 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09B8\u0982\u09AF\u09CB\u0997\u0964",
    assessment: "\u09AA\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F \u0993 \u09AA\u09CD\u09B0\u09CB\u09AA\u09CB\u099C\u09BE\u09B2 \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8 \u098F\u09AC\u0982 Capstone Strategy \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 2,500 (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u09AF\u09CB\u0997\u09CD\u09AF)\u0964"
  },
  {
    code: "PD-303",
    slug: "ai-leadership-strategic-management",
    title: "AI Leadership & Strategic Management",
    categorySlug: "professional-development",
    categoryName: "Professional Development",
    tierAccent: "professional",
    tierLabel: "Professional Track",
    chipLabel: "Professional Development",
    level: "Intermediate to Advanced",
    hook: "\u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09C7\u09B0 \u0995\u09CC\u09B6\u09B2\u0997\u09A4 \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE, AI adoption \u09B0\u09CB\u09A1\u09AE\u09CD\u09AF\u09BE\u09AA, \u099F\u09BF\u09AE \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0993 \u099D\u09C1\u0981\u0995\u09BF \u09AC\u09CD\u09AF\u09AC\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8\u09BE \u09A8\u09C7\u09A4\u09C3\u09A4\u09CD\u09AC (\u09F32,500)\u0964",
    overview: "This programme prepares managers, team leaders and emerging executives to understand AI as a strategic organisational capability rather than simply a productivity tool. Participants will explore AI-driven organisational transformation, strategic decision-making, leadership responsibilities, workforce readiness, governance and responsible adoption.",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 2,500",
    feeNote: "Full 4-Week Professional Track \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_ai_governance_leadership_1794924812599.jpg",
    imageAlt: "AI Leadership and Strategic Management executive roundtable",
    whoThisCourseIsFor: [
      "Business owners and executives",
      "Department heads and senior managers",
      "Team leaders and supervisors",
      "Public-sector and institutional leaders",
      "NGO and development-sector managers",
      "Emerging leaders and professionals preparing for management roles"
    ],
    keyAreas: [
      "Organisational AI Readiness & Opportunity Mapping",
      "AI-Assisted SWOT, PESTLE & Scenario Analysis",
      "Workforce Transformation & Change Management",
      "AI Governance, Risk & Investment Prioritisation"
    ],
    learningOutcomes: [
      "Evaluate organisational AI readiness, capability gaps, and operational processes suited for high-value AI adoption.",
      "Apply AI-assisted scenario, SWOT, and PESTLE analysis while preserving senior human judgement in strategic decisions.",
      "Lead workforce reskilling, internal communication, and organisational change management responsibly.",
      "Establish internal AI governance structures, accountability lines, and a phased executive AI roadmap."
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI and the Future of Organisational Leadership",
        topics: [
          "Understanding the changing AI landscape",
          "AI as a strategic organisational capability",
          "AI-driven transformation across sectors",
          "Leadership opportunities and challenges",
          "Understanding the difference between AI adoption and AI transformation"
        ]
      },
      {
        code: "Module 2",
        title: "AI Strategy & Organisational Readiness",
        topics: [
          "Assessing organisational AI readiness",
          "Identifying high-value AI opportunities",
          "Evaluating organisational capabilities",
          "Mapping processes suitable for AI integration",
          "Identifying skills and infrastructure gaps",
          "Prioritising AI adoption opportunities"
        ]
      },
      {
        code: "Module 3",
        title: "AI-Assisted Strategic Decision-Making",
        topics: [
          "Using AI for strategic research",
          "Scenario analysis and strategic options",
          "SWOT and PESTLE analysis with AI assistance",
          "Executive briefing and decision support",
          "Analysing opportunities, risks and uncertainties",
          "Human judgement in strategic decisions"
        ]
      },
      {
        code: "Module 4",
        title: "AI, Workforce Transformation & Change Management",
        topics: [
          "Understanding AI's impact on job roles",
          "Workforce skills assessment",
          "Identifying training and reskilling priorities",
          "Managing organisational change",
          "Building an AI-ready organisational culture",
          "Communicating AI transformation to employees"
        ]
      },
      {
        code: "Module 5",
        title: "AI Governance, Risk & Accountability",
        topics: [
          "Principles of responsible AI adoption",
          "Organisational AI governance structures",
          "Data protection and privacy considerations",
          "AI-related operational and reputational risks",
          "Human oversight and accountability",
          "Developing internal AI usage guidelines"
        ]
      },
      {
        code: "Module 6",
        title: "AI Investment & Implementation Prioritisation",
        topics: [
          "Evaluating AI use cases",
          "Understanding implementation costs and value",
          "Prioritising initiatives by impact and feasibility",
          "Build, buy or partner considerations",
          "Developing implementation milestones",
          "Monitoring performance and organisational value"
        ]
      },
      {
        code: "Module 7",
        title: "Leading an AI-Enabled Organisation",
        topics: [
          "Developing an organisational AI vision",
          "Establishing strategic priorities",
          "Leadership roles and responsibilities",
          "Cross-functional AI coordination",
          "Measuring adoption and performance",
          "Preparing an executive AI action plan"
        ]
      }
    ],
    practicalSkills: [
      "Organisational AI readiness assessment",
      "AI opportunity prioritisation",
      "Strategic scenario analysis",
      "Workforce transformation planning",
      "AI governance framework development",
      "Executive-level AI decision support",
      "AI implementation prioritisation"
    ],
    practicalProject: {
      projectLabel: "Capstone Project",
      title: "Organisational AI Strategy & Leadership Blueprint",
      prompt: "Participants design an executive-grade AI readiness, governance, and phased transformation blueprint tailored to their own department or organisation.",
      deliverables: [
        "An organisational AI readiness overview",
        "A strategic AI opportunity map",
        "A workforce capability gap analysis",
        "An AI governance and risk framework",
        "A prioritised AI implementation roadmap",
        "A leadership action plan with measurable milestones"
      ]
    },
    outsideScope: [
      "Enterprise AI system deployment",
      "Legal or regulatory compliance certification",
      "Detailed financial auditing",
      "Custom AI model development",
      "Guaranteed organisational transformation"
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: "\u099F\u09BF\u09AE \u09B2\u09BF\u09A1\u09BE\u09B0\u09B6\u09BF\u09AA, \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F \u09AC\u09BE \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09B8\u09BF\u09A6\u09CD\u09A7\u09BE\u09A8\u09CD\u09A4 \u0997\u09CD\u09B0\u09B9\u09A3\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE \u0993 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09B8\u0982\u09AF\u09CB\u0997\u0964",
    assessment: "\u09B8\u09CD\u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u099F\u09C7\u099C\u09BF\u0995 \u0995\u09C7\u09B8 \u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u0993 \u09B8\u09AE\u09BE\u09AA\u09A8\u09C0 Leadership Blueprint \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 2,500 (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u09AF\u09CB\u0997\u09CD\u09AF)\u0964"
  },
  {
    code: "PD-304",
    slug: "ai-for-project-management",
    title: "AI for Project Management",
    categorySlug: "professional-development",
    categoryName: "Professional Development",
    tierAccent: "professional",
    tierLabel: "Professional Track",
    chipLabel: "Professional Development",
    level: "Intermediate",
    hook: "\u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u09A8\u09BF\u0982, \u09B0\u09BF\u09B8\u09CD\u0995 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982, WBS, \u09B0\u09BF\u09B8\u09CB\u09B0\u09CD\u09B8 \u09B8\u09AE\u09A8\u09CD\u09AC\u09AF\u09BC \u0993 \u09B8\u09CD\u099F\u09C7\u0995\u09B9\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982\u09AF\u09BC\u09C7 AI-\u09B0 \u09AA\u09C2\u09B0\u09CD\u09A3\u09BE\u0999\u09CD\u0997 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 (\u09F32,500)\u0964",
    overview: "This programme explores how AI can support the complete project management lifecycle, from project planning and resource allocation to risk assessment, progress monitoring, reporting and evaluation. Participants will learn to use AI as a project support tool while maintaining human accountability for project decisions and delivery.",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 2,500",
    feeNote: "Full 4-Week Professional Track \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_workflow_automation_1794924807818.jpg",
    imageAlt: "AI for Project Management WBS scheduling and risk tracking workshop",
    whoThisCourseIsFor: [
      "Project managers and coordinators",
      "Programme officers",
      "NGO and development-sector professionals",
      "Corporate project teams",
      "Operations and administrative managers",
      "Consultants and independent project professionals"
    ],
    keyAreas: [
      "AI-Assisted Concept Notes, Charters & WBS",
      "Scheduling, Milestones & Resource Planning",
      "Budget Narratives & Project Risk Registers",
      "M&E Indicators, Reporting & Stakeholder Comms"
    ],
    learningOutcomes: [
      "Use AI to structure problem analyses, project charters, scopes, and Work Breakdown Structures (WBS) efficiently.",
      "Build milestone schedules, resource dependency checklists, and AI-assisted budget narratives with explicit human validation.",
      "Develop proactive risk registers, scenario mitigations, and M&E indicator frameworks.",
      "Produce clear stakeholder progress reports and action-tracking summaries while protecting project confidentiality."
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI in Modern Project Management",
        topics: [
          "Understanding the project management lifecycle",
          "AI applications in project environments",
          "AI-assisted versus traditional project management",
          "Project management use cases",
          "Selecting suitable AI tools"
        ]
      },
      {
        code: "Module 2",
        title: "AI-Assisted Project Design & Planning",
        topics: [
          "Defining project objectives",
          "Problem analysis and needs assessment",
          "Developing project concepts",
          "Creating project scopes and deliverables",
          "Work Breakdown Structure (WBS)",
          "Preparing project charters and planning documents"
        ]
      },
      {
        code: "Module 3",
        title: "Scheduling, Tasks & Resource Planning",
        topics: [
          "Developing project activity schedules",
          "Task dependencies and sequencing",
          "Milestone identification",
          "Resource allocation support",
          "Timeline and workload planning",
          "AI-assisted project scheduling"
        ]
      },
      {
        code: "Module 4",
        title: "Budgeting & Project Documentation",
        topics: [
          "Structuring project budgets",
          "AI-assisted budget narratives",
          "Resource and cost estimation support",
          "Proposal and concept note preparation",
          "Project documentation",
          "Reviewing financial assumptions and limitations"
        ]
      },
      {
        code: "Module 5",
        title: "Project Risk Management",
        topics: [
          "Identifying project risks",
          "Risk categorisation and prioritisation",
          "Risk registers",
          "Risk response planning",
          "Scenario analysis",
          "Monitoring assumptions and dependencies"
        ]
      },
      {
        code: "Module 6",
        title: "Monitoring, Evaluation & Reporting",
        topics: [
          "Developing project indicators",
          "Monitoring project progress",
          "Data organisation and interpretation",
          "Preparing progress reports",
          "AI-assisted meeting and field report summaries",
          "Learning and evaluation documentation"
        ]
      },
      {
        code: "Module 7",
        title: "Project Communication & Responsible AI",
        topics: [
          "Stakeholder communication",
          "AI-assisted status reports",
          "Meeting minutes and action tracking",
          "Project knowledge management",
          "Data confidentiality and privacy",
          "Human verification and accountability"
        ]
      }
    ],
    practicalSkills: [
      "Project concept development",
      "Work Breakdown Structure preparation",
      "Project scheduling and milestone planning",
      "Risk register development",
      "AI-assisted project documentation",
      "Monitoring and progress reporting",
      "Stakeholder communication"
    ],
    practicalProject: {
      projectLabel: "Capstone Project",
      title: "AI-Assisted Project Management Portfolio",
      prompt: "Participants compile a full lifecycle documentation pack for a real or simulated initiative covering concept, WBS, timeline, risk register, and M&E indicators.",
      deliverables: [
        "A project concept note",
        "A project charter",
        "A Work Breakdown Structure",
        "A project timeline and milestone plan",
        "A risk register",
        "A monitoring indicator framework",
        "A project progress report template"
      ]
    },
    outsideScope: [
      "Professional PMP or PRINCE2 certification",
      "Advanced project management software certification",
      "Professional financial auditing",
      "Complex engineering project planning",
      "Guaranteed project approval or funding"
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: "\u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09AC\u09BE \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE \u09B8\u09AE\u09A8\u09CD\u09AC\u09AF\u09BC\u09C7\u09B0 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09A7\u09BE\u09B0\u09A3\u09BE \u098F\u09AC\u0982 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u0993 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09B8\u0982\u09AF\u09CB\u0997\u0964",
    assessment: "\u09AE\u09A1\u09BF\u0989\u09B2\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B6\u09A8 \u0993 Capstone Portfolio \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 2,500 (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u09AF\u09CB\u0997\u09CD\u09AF)\u0964"
  },
  {
    code: "PD-305",
    slug: "ai-for-marketing-growth-strategy",
    title: "AI for Marketing & Growth Strategy",
    categorySlug: "professional-development",
    categoryName: "Professional Development",
    tierAccent: "professional",
    tierLabel: "Professional Track",
    chipLabel: "Professional Development",
    level: "Intermediate",
    hook: "\u0985\u09A1\u09BF\u09AF\u09BC\u09C7\u09A8\u09CD\u09B8 \u0997\u09AC\u09C7\u09B7\u09A3\u09BE, \u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1 \u09AA\u099C\u09BF\u09B6\u09A8\u09BF\u0982, \u0995\u09CD\u09AF\u09BE\u09AE\u09CD\u09AA\u09C7\u0987\u09A8 \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE \u0993 \u0997\u09CD\u09B0\u09CB\u09A5 \u0985\u09CD\u09AF\u09BE\u09A8\u09BE\u09B2\u09BF\u099F\u09BF\u0995\u09CD\u09B8\u09C7 AI-\u09B0 \u0995\u09CC\u09B6\u09B2\u0997\u09A4 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 (\u09F32,500)\u0964",
    overview: "This programme focuses on using AI to develop data-informed marketing strategies, understand audiences, strengthen brand communication, plan campaigns and evaluate marketing performance. Participants will learn to connect content, customer insights, digital channels and business objectives through structured AI-assisted marketing workflows.",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 2,500",
    feeNote: "Full 4-Week Professional Track \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_digital_creation_1794924807458.jpg",
    imageAlt: "AI for Marketing and Growth Strategy campaign analytics workshop",
    whoThisCourseIsFor: [
      "Marketing professionals",
      "Digital marketing executives",
      "Brand and communication managers",
      "Entrepreneurs and business owners",
      "Content strategists",
      "Growth and customer acquisition professionals"
    ],
    keyAreas: [
      "Market Research & Audience Personas",
      "Brand Positioning & Messaging Frameworks",
      "Content Calendars & Campaign Architecture",
      "Marketing KPIs & Brand-Safe Responsible AI"
    ],
    learningOutcomes: [
      "Conduct structured audience segmentation, buyer pain-point research, and competitor positioning analyses using AI.",
      "Articulate brand value propositions, consistent tone-of-voice rules, and platform-specific messaging pillars.",
      "Build 30-day content calendars, full-funnel campaign workflows, and KPI tracking templates.",
      "Enforce accuracy, intellectual property hygiene, and truthful claims across AI-assisted marketing campaigns."
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI and the Modern Marketing Environment",
        topics: [
          "Understanding AI-driven marketing",
          "AI applications across marketing functions",
          "Marketing automation and generative AI",
          "Customer-centric marketing",
          "Opportunities and limitations of AI marketing tools"
        ]
      },
      {
        code: "Module 2",
        title: "Market Research & Audience Intelligence",
        topics: [
          "AI-assisted market research",
          "Audience segmentation",
          "Customer personas",
          "Customer behaviour and pain-point analysis",
          "Competitor and positioning research",
          "Identifying and validating market insights"
        ]
      },
      {
        code: "Module 3",
        title: "Brand Strategy & Marketing Positioning",
        topics: [
          "Brand identity and positioning",
          "Value proposition development",
          "Brand messaging frameworks",
          "Audience-specific communication",
          "Tone of voice and brand consistency",
          "AI-assisted brand strategy documentation"
        ]
      },
      {
        code: "Module 4",
        title: "AI-Powered Digital Content Strategy",
        topics: [
          "Developing content pillars",
          "Building marketing content calendars",
          "Social media strategy",
          "AI-assisted copywriting",
          "Visual and multimedia content planning",
          "Platform-specific content adaptation"
        ]
      },
      {
        code: "Module 5",
        title: "Campaign Planning & Customer Engagement",
        topics: [
          "Campaign objective setting",
          "Campaign planning and messaging",
          "Customer journey mapping",
          "Email and digital communication",
          "Lead nurturing and engagement",
          "AI-assisted campaign workflow design"
        ]
      },
      {
        code: "Module 6",
        title: "Marketing Analytics & Performance Optimisation",
        topics: [
          "Understanding marketing KPIs",
          "Analysing campaign performance data",
          "Engagement and conversion indicators",
          "AI-assisted reporting",
          "Identifying performance gaps",
          "Improving marketing strategies through evidence"
        ]
      },
      {
        code: "Module 7",
        title: "Responsible AI in Marketing",
        topics: [
          "Accuracy and authenticity in marketing content",
          "Responsible use of generated images and media",
          "Copyright and intellectual property awareness",
          "Customer data protection",
          "Avoiding misleading AI-generated claims",
          "Human review and brand accountability"
        ]
      }
    ],
    practicalSkills: [
      "Market and audience research",
      "Customer persona development",
      "Brand positioning and messaging",
      "Content strategy and calendar development",
      "Campaign planning",
      "Marketing performance reporting",
      "AI-assisted growth strategy development"
    ],
    practicalProject: {
      projectLabel: "Capstone Project",
      title: "AI-Powered Marketing & Growth Strategy",
      prompt: "Participants develop a comprehensive go-to-market strategy integrating audience research, messaging, a 30-day calendar, KPI reporting, and a 90-day growth plan.",
      deliverables: [
        "A market and competitor research brief",
        "Target audience personas",
        "Brand positioning and messaging framework",
        "A 30-day content calendar",
        "A campaign strategy",
        "A marketing KPI dashboard or reporting template",
        "A 90-day growth action plan"
      ]
    },
    outsideScope: [
      "Guaranteed sales, leads or conversions",
      "Paid advertising budget or media buying",
      "Advanced marketing analytics engineering",
      "Professional graphic design certification",
      "Full-service marketing agency execution"
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: "\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F\u09BF\u0982 \u09AC\u09BE \u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1 \u0995\u09AE\u09BF\u0989\u09A8\u09BF\u0995\u09C7\u09B6\u09A8 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE \u0993 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09B8\u0982\u09AF\u09CB\u0997\u0964",
    assessment: "\u0995\u09CD\u09AF\u09BE\u09AE\u09CD\u09AA\u09C7\u0987\u09A8 \u09B8\u09CD\u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u099F\u09C7\u099C\u09BF \u0985\u09CD\u09AF\u09BE\u09B8\u09BE\u0987\u09A8\u09AE\u09C7\u09A8\u09CD\u099F \u0993 Capstone Growth Plan \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 2,500 (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u09AF\u09CB\u0997\u09CD\u09AF)\u0964"
  },
  {
    code: "PD-306",
    slug: "ai-for-human-resource-management",
    title: "AI for Human Resource Management",
    categorySlug: "professional-development",
    categoryName: "Professional Development",
    tierAccent: "professional",
    tierLabel: "Professional Track",
    chipLabel: "Professional Development",
    level: "Intermediate",
    hook: "\u09B0\u09BF\u0995\u09CD\u09B0\u09C1\u099F\u09AE\u09C7\u09A8\u09CD\u099F, \u0985\u09A8\u09AC\u09CB\u09B0\u09CD\u09A1\u09BF\u0982, \u09B2\u09BE\u09B0\u09CD\u09A8\u09BF\u0982 \u0993 \u099F\u09BF\u09AE \u098F\u09A8\u0997\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F\u09C7 \u09AA\u0995\u09CD\u09B7\u09AA\u09BE\u09A4\u09AE\u09C1\u0995\u09CD\u09A4, \u09AE\u09BE\u09A8\u09AC\u09BF\u0995 \u0993 \u09A8\u09C8\u09A4\u09BF\u0995 AI \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 (\u09F32,500)\u0964",
    overview: "This programme explores the responsible application of AI across human resource management, including workforce planning, recruitment support, employee learning, performance documentation and organisational development. The course emphasises fairness, privacy, human judgement and accountability in people-related decisions.",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 2,500",
    feeNote: "Full 4-Week Professional Track \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_research_analytics_1794924809260.jpg",
    imageAlt: "AI for Human Resource Management ethical workforce planning seminar",
    whoThisCourseIsFor: [
      "HR professionals and executives",
      "Recruitment and talent acquisition teams",
      "Learning and development professionals",
      "HR managers and department heads",
      "Organisational development practitioners",
      "Business owners responsible for workforce management"
    ],
    keyAreas: [
      "Workforce Planning, Job Design & Competency Mapping",
      "Structured & Bias-Aware Recruitment Support",
      "Learning, Development & Engagement Analytics",
      "Employee Privacy & Human Oversight in HR"
    ],
    learningOutcomes: [
      "Use AI to draft clear job descriptions, competency matrices, and workforce skills-gap plans.",
      "Streamline recruitment documentation, structured interview guides, and onboarding playbooks without relying on automated rejection.",
      "Design personalised employee L&D plans and summarise engagement feedback surveys systematically.",
      "Prevent algorithmic bias and uphold strict confidentiality and human judgement across all HR workflows."
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI in Human Resource Management",
        topics: [
          "Understanding AI in HR functions",
          "HR technology and generative AI",
          "AI applications across the employee lifecycle",
          "Opportunities and operational limitations",
          "Human-centred HR management"
        ]
      },
      {
        code: "Module 2",
        title: "AI for Workforce Planning & Job Design",
        topics: [
          "Workforce needs assessment",
          "Job description development",
          "Role and competency mapping",
          "Skills gap identification",
          "Workforce capability planning",
          "AI-assisted HR documentation"
        ]
      },
      {
        code: "Module 3",
        title: "AI-Assisted Recruitment & Talent Acquisition",
        topics: [
          "Recruitment workflow design",
          "Vacancy announcement drafting",
          "Interview question development",
          "Candidate communication",
          "Recruitment documentation",
          "Limitations and risks of automated candidate screening"
        ]
      },
      {
        code: "Module 4",
        title: "AI for Learning & Employee Development",
        topics: [
          "Employee learning needs assessment",
          "Training programme design",
          "Personalised learning pathways",
          "Competency development frameworks",
          "AI-assisted learning materials",
          "Training evaluation and feedback"
        ]
      },
      {
        code: "Module 5",
        title: "Performance Management & Employee Engagement",
        topics: [
          "Performance objective development",
          "KPI and performance documentation",
          "Employee feedback analysis",
          "Engagement survey summarisation",
          "Performance review preparation",
          "Human judgement in performance decisions"
        ]
      },
      {
        code: "Module 6",
        title: "HR Operations & Administrative Productivity",
        topics: [
          "HR policy and handbook drafting support",
          "Employee query and FAQ systems",
          "Leave and attendance documentation workflows",
          "HR reporting and data organisation",
          "Employee onboarding support",
          "Repetitive HR task identification"
        ]
      },
      {
        code: "Module 7",
        title: "Ethical, Fair & Responsible AI in HR",
        topics: [
          "Algorithmic bias and discrimination risks",
          "Employee data privacy",
          "Confidentiality and consent",
          "Transparency in AI-assisted HR processes",
          "Human oversight in recruitment and evaluation",
          "Responsible HR AI usage guidelines"
        ]
      }
    ],
    practicalSkills: [
      "Workforce planning support",
      "Job description development",
      "Recruitment communication",
      "Interview framework preparation",
      "Learning needs assessment",
      "Performance documentation",
      "HR reporting and workflow improvement"
    ],
    practicalProject: {
      projectLabel: "Capstone Project",
      title: "AI-Enabled HR Management Framework",
      prompt: "Participants prepare an end-to-end HR documentation and governance framework designed around fairness, transparency, and employee data privacy.",
      deliverables: [
        "A sample workforce needs assessment",
        "A job description and competency framework",
        "A structured recruitment workflow",
        "An employee learning and development plan",
        "A performance review template",
        "An HR operations improvement proposal",
        "A responsible AI in HR checklist"
      ]
    },
    outsideScope: [
      "Automated hiring or candidate rejection decisions",
      "Legal employment advice",
      "Payroll system implementation",
      "Professional psychometric assessment",
      "HR certification or accreditation"
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: "\u098F\u0987\u099A\u0986\u09B0 \u09AC\u09BE \u09AA\u09BF\u09AA\u09B2 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE \u098F\u09AC\u0982 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u0993 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09B8\u0982\u09AF\u09CB\u0997\u0964",
    assessment: "\u098F\u0987\u099A\u0986\u09B0 \u0995\u09C7\u09B8 \u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u0993 Capstone HR Framework \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 2,500 (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u09AF\u09CB\u0997\u09CD\u09AF)\u0964"
  },
  {
    code: "PD-307",
    slug: "ai-for-financial-management",
    title: "AI for Financial Management",
    categorySlug: "professional-development",
    categoryName: "Professional Development",
    tierAccent: "professional",
    tierLabel: "Professional Track",
    chipLabel: "Professional Development",
    level: "Intermediate",
    hook: "\u09AC\u09BE\u099C\u09C7\u099F\u09BF\u0982, \u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09A1\u09B6\u09BF\u099F \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3, \u09AB\u09BF\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8\u09BF\u09AF\u09BC\u09BE\u09B2 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982 \u0993 \u099D\u09C1\u0981\u0995\u09BF \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AD\u09C1\u09B2 AI \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u0993 \u09AF\u09BE\u099A\u09BE\u0987 (\u09F32,500)\u0964",
    overview: "This programme introduces professionals and business managers to the practical use of AI in financial administration, budgeting, financial reporting, spreadsheet analysis and management decision support. The focus is on improving financial information workflows and analytical capabilities\u2014not replacing qualified accountants, auditors or financial advisers.",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 2,500",
    feeNote: "Full 4-Week Professional Track \xB7 Max 50% Scholarship Eligible",
    isFree: false,
    imageUrl: "/src/assets/images/course_data_intelligence_1794924810524.jpg",
    imageAlt: "AI for Financial Management budgeting and spreadsheet analytics session",
    whoThisCourseIsFor: [
      "Finance and accounts professionals",
      "Business owners and entrepreneurs",
      "Finance and administrative managers",
      "NGO and development-sector finance officers",
      "Project finance professionals",
      "Professionals responsible for budgets and financial reporting"
    ],
    keyAreas: [
      "Budgeting Templates, Expense Categorisation & Narratives",
      "Spreadsheet Intelligence & Formula Validation",
      "Budget-vs-Actual & Cash-Flow Management Reporting",
      "Financial Data Security, Auditability & Oversight"
    ],
    learningOutcomes: [
      "Prepare structured organisational budget templates, expense categorisations, and clear management budget narratives with AI.",
      "Use AI to accelerate spreadsheet cleaning, formula interpretation, and anomaly spotting while validating every calculation manually.",
      "Produce clear budget-versus-actual reports, scenario comparisons, and revenue/expense trend briefs.",
      "Safeguard sensitive financial records against privacy leaks and uphold strict human auditability."
    ],
    modules: [
      {
        code: "Module 1",
        title: "AI in Financial Management",
        topics: [
          "Understanding AI in finance functions",
          "AI applications in financial administration",
          "Generative AI for finance-related documentation",
          "AI-assisted financial workflows",
          "Opportunities, limitations and risks"
        ]
      },
      {
        code: "Module 2",
        title: "AI for Budgeting & Financial Planning",
        topics: [
          "Understanding budget structures",
          "Preparing budget templates",
          "AI-assisted budget narratives",
          "Expense categorisation",
          "Budget assumptions and scenario planning",
          "Reviewing estimates and financial assumptions"
        ]
      },
      {
        code: "Module 3",
        title: "Spreadsheet Intelligence & Financial Data",
        topics: [
          "AI-assisted spreadsheet operations",
          "Organising financial data",
          "Data cleaning and validation",
          "Formula assistance and interpretation",
          "Basic financial calculations",
          "Identifying patterns and anomalies for further review"
        ]
      },
      {
        code: "Module 4",
        title: "Financial Reporting & Documentation",
        topics: [
          "Preparing financial summaries",
          "Budget-versus-actual reporting",
          "Expense and expenditure summaries",
          "Financial narrative preparation",
          "Management reporting",
          "Presenting financial information clearly"
        ]
      },
      {
        code: "Module 5",
        title: "AI for Financial Analysis & Decision Support",
        topics: [
          "Understanding basic financial indicators",
          "Revenue and expense trend analysis",
          "Cash flow concepts",
          "Scenario comparison",
          "Financial performance interpretation",
          "Recognising uncertainty in AI-generated analysis"
        ]
      },
      {
        code: "Module 6",
        title: "Financial Operations & Workflow Efficiency",
        topics: [
          "Invoice and receipt information organisation",
          "Expense documentation workflows",
          "Financial record management",
          "Repetitive finance task identification",
          "AI-assisted reporting workflows",
          "Human review and approval processes"
        ]
      },
      {
        code: "Module 7",
        title: "Financial Data Security & Responsible AI",
        topics: [
          "Confidential financial information",
          "Data privacy and access control",
          "Risks of uploading financial records to AI platforms",
          "Accuracy and verification of calculations",
          "Auditability and documentation",
          "Human accountability in financial decisions"
        ]
      }
    ],
    practicalSkills: [
      "Budget template preparation",
      "AI-assisted spreadsheet analysis",
      "Expense categorisation",
      "Budget-versus-actual reporting",
      "Financial summary preparation",
      "Basic financial trend interpretation",
      "Financial workflow improvement"
    ],
    practicalProject: {
      projectLabel: "Capstone Project",
      title: "AI-Assisted Financial Management Portfolio",
      prompt: "Participants construct a complete non-confidential budget and financial reporting workflow with verified spreadsheet formulas and strict data-security controls.",
      deliverables: [
        "A sample organisational budget",
        "An expense categorisation framework",
        "A budget-versus-actual report",
        "A financial performance summary",
        "A basic scenario analysis",
        "A financial reporting template",
        "A responsible AI and financial data handling checklist"
      ]
    },
    outsideScope: [
      "Professional accounting or auditing services",
      "Tax, legal or investment advice",
      "Certified financial modelling",
      "Automated financial approval systems",
      "Regulated financial decision-making"
    ],
    programmeNotes: PD_COMMON_NOTES,
    prerequisites: "\u09AC\u09C7\u09B8\u09BF\u0995 \u09AC\u09BE\u099C\u09C7\u099F\u09BF\u0982 \u09AC\u09BE \u09B8\u09CD\u09AA\u09CD\u09B0\u09C7\u09A1\u09B6\u09BF\u099F (Excel/Sheets) \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE \u098F\u09AC\u0982 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09B8\u0982\u09AF\u09CB\u0997\u0964",
    assessment: "\u09AC\u09BE\u099C\u09C7\u099F \u0993 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982 \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8 \u098F\u09AC\u0982 Capstone Portfolio \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u0964",
    certificate: "\u09B8\u0995\u09B2 \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 Capstone \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Completion Certificate \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \xB7 \u09EE\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8\u0964 \u09AB\u09BF BDT 2,500 (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE\u09AF\u09CB\u0997\u09CD\u09AF)\u0964"
  },
  // =========================================================================
  // CATEGORY 4: SPECIALISED PROGRAMMES (SP-WSAI)
  // =========================================================================
  {
    code: "SP-WSAI",
    slug: "womens-safety-in-the-ai-era",
    title: "Women's Safety in the AI Era",
    categorySlug: "specialised-programmes",
    categoryName: "Specialised Programmes",
    tierAccent: "specialised",
    tierLabel: "Specialised \xB7 Free",
    chipLabel: "Specialised Programme",
    level: "Beginner / Awareness",
    hook: "AI \u09AF\u09C1\u0997\u09C7 \u09A8\u09BE\u09B0\u09C0 \u0993 \u09AE\u09C7\u09AF\u09BC\u09C7\u09A6\u09C7\u09B0 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE: deepfake, synthetic media, privacy \u0993 cyber abuse \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE\u09AF\u09BC \u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 \u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF (FREE)\u0964",
    overview: "\u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u09AC\u09C1\u09A6\u09CD\u09A7\u09BF\u09AE\u09A4\u09CD\u09A4\u09BE \u0993 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF\u09B0 \u09AF\u09C1\u0997\u09C7 \u0985\u09A8\u09B2\u09BE\u0987\u09A8\u09C7 \u09A8\u09BE\u09B0\u09C0 \u0993 \u0995\u09A8\u09CD\u09AF\u09BE\u09B6\u09BF\u09B6\u09C1\u09A6\u09C7\u09B0 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE, \u09A1\u09BF\u09AA\u09AB\u09C7\u0995 \u0993 \u09B8\u09BF\u09A8\u09CD\u09A5\u09C7\u099F\u09BF\u0995 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE\u09B0 \u099D\u09C1\u0981\u0995\u09BF, \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A4\u09A5\u09CD\u09AF\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u098F\u09AC\u0982 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7\u09AE\u09C2\u09B2\u0995 \u0993 \u0986\u0987\u09A8\u09BF/\u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u09AA\u09BE\u0993\u09AF\u09BC\u09BE\u09B0 \u099C\u09CD\u099E\u09BE\u09A8 \u09A8\u09BF\u09AF\u09BC\u09C7 \u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 \u09AC\u09BF\u09B6\u09C7\u09B7\u09BE\u09AF\u09BC\u09BF\u09A4 \u09B8\u099A\u09C7\u09A4\u09A8\u09A4\u09BE\u09AE\u09C2\u09B2\u0995 \u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF\u0964",
    duration: "4 Weeks \xB7 8 Classes Total",
    fee: "BDT 0",
    feeNote: "Free Social-Impact Programme",
    isFree: true,
    imageUrl: "/src/assets/images/course_womens_digital_safety_1794926670102.jpg",
    imageAlt: "Women's Safety in the AI Era digital literacy and online protection programme",
    whoThisCourseIsFor: [
      "\u09AC\u09BF\u09B6\u09CD\u09AC\u09AC\u09BF\u09A6\u09CD\u09AF\u09BE\u09B2\u09AF\u09BC, \u0995\u09B2\u09C7\u099C \u0993 \u09B8\u09CD\u0995\u09C1\u09B2\u09C7\u09B0 \u09A8\u09BE\u09B0\u09C0 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 (\u09E7\u09EE \u09AC\u099B\u09B0\u09C7\u09B0 \u0995\u09AE \u09AC\u09AF\u09BC\u09B8\u09C0\u09A6\u09C7\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u0985\u09AD\u09BF\u09AD\u09BE\u09AC\u0995\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AE\u09A4\u09BF\u09B8\u09B9)",
      "\u0995\u09B0\u09CD\u09AE\u099C\u09C0\u09AC\u09C0 \u09A8\u09BE\u09B0\u09C0, \u0997\u09C3\u09B9\u09BF\u09A3\u09C0, \u0985\u09AD\u09BF\u09AD\u09BE\u09AC\u0995 \u098F\u09AC\u0982 \u09A8\u09BE\u09B0\u09C0 \u0985\u09A7\u09BF\u0995\u09BE\u09B0 \u0993 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09AC\u09BF\u09B7\u09AF\u09BC\u0995 \u09B6\u09BF\u0995\u09CD\u09B7\u0995/\u09AE\u09C7\u09A8\u09CD\u099F\u09B0",
      "\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE\u09C7 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u0989\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4\u09BF \u0993 \u09A1\u09BF\u09AA\u09AB\u09C7\u0995/\u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u09B9\u09AF\u09BC\u09B0\u09BE\u09A8\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u099C\u09BE\u09A8\u09A4\u09C7 \u0986\u0997\u09CD\u09B0\u09B9\u09C0 \u09AF\u09C7 \u0995\u09C7\u0989"
    ],
    keyAreas: [
      "Digital Footprints & AI Threat Awareness",
      "Deepfake, Voice Cloning & Image Manipulation Detection",
      "Account Hardening, Privacy Hygiene & Cyber Harassment Defence",
      "Evidence Preservation, Mental Resilience & Support Channels"
    ],
    learningOutcomes: [
      "AI \u09AF\u09C1\u0997\u09C7 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AB\u09C1\u099F\u09AA\u09CD\u09B0\u09BF\u09A8\u09CD\u099F, \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u099D\u09C1\u0981\u0995\u09BF \u098F\u09AC\u0982 \u09A1\u09BF\u09AA\u09AB\u09C7\u0995 \u09AC\u09BE \u09B8\u09BF\u09A8\u09CD\u09A5\u09C7\u099F\u09BF\u0995 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A4\u09C8\u09B0\u09BF \u0993 \u0985\u09AA\u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B9\u09AF\u09BC \u09A4\u09BE \u09B8\u09CD\u09AA\u09B7\u09CD\u099F\u09AD\u09BE\u09AC\u09C7 \u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE, \u09AE\u09C7\u09B8\u09C7\u099C\u09BF\u0982 \u0985\u09CD\u09AF\u09BE\u09AA \u098F\u09AC\u0982 \u0995\u09CD\u09B2\u09BE\u0989\u09A1 \u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F\u09C7 \u09B6\u0995\u09CD\u09A4\u09BF\u09B6\u09BE\u09B2\u09C0 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE \u0993 \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u09B8\u09C7\u099F\u09BF\u0982\u09B8 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09AC\u09BF\u0995\u09C3\u09A4 \u099B\u09AC\u09BF, \u09AD\u09AF\u09BC\u09C7\u09B8 \u0995\u09CD\u09B2\u09CB\u09A8\u09BF\u0982 \u09AC\u09BE \u09B8\u09A8\u09CD\u09A6\u09C7\u09B9\u099C\u09A8\u0995 \u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u09AC\u09BE\u09B0\u09CD\u09A4\u09BE \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u0995\u09CC\u09B6\u09B2 \u098F\u09AC\u0982 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09AE\u09C7\u0987\u09B2 \u09AC\u09BE \u09B9\u09AF\u09BC\u09B0\u09BE\u09A8\u09BF\u09B0 \u09AE\u09C1\u0996\u09C7 \u0995\u09B0\u09A3\u09C0\u09AF\u09BC \u099C\u09BE\u09A8\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      "\u09A8\u09BF\u09B0\u09BE\u09AA\u09A6\u09AD\u09BE\u09AC\u09C7 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AA\u09CD\u09B0\u09AE\u09BE\u09A3 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3, \u099C\u09B0\u09C1\u09B0\u09BF \u09B9\u09C7\u09B2\u09CD\u09AA\u09B2\u09BE\u0987\u09A8 \u0993 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982 \u099A\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u098F\u09AC\u0982 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    ],
    modules: [
      {
        code: "Week 1",
        title: "Digital Footprints, Privacy & Understanding AI-Era Risks",
        topics: [
          "\u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u0989\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4\u09BF \u0993 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AB\u09C1\u099F\u09AA\u09CD\u09B0\u09BF\u09A8\u09CD\u099F \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A1\u09C7\u099F\u09BE \u0993 AI \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE\u09C7 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09B9\u09AF\u09BC",
          "\u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u0993 \u09AA\u09BE\u09AC\u09B2\u09BF\u0995 \u09AA\u09CD\u09B0\u09CB\u09AB\u09BE\u0987\u09B2\u09C7 \u099B\u09AC\u09BF \u0993 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A4\u09A5\u09CD\u09AF\u09C7\u09B0 \u099D\u09C1\u0981\u0995\u09BF \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8",
          "\u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u0997\u09CB\u09AA\u09A8\u09C0\u09AF\u09BC\u09A4\u09BE, \u0995\u09A8\u09B8\u09C7\u09A8\u09CD\u099F \u0993 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09B8\u09C0\u09AE\u09BE\u09B0\u09C7\u0996\u09BE (digital boundaries)",
          "\u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u0985\u09A1\u09BF\u099F \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8"
        ]
      },
      {
        code: "Week 2",
        title: "Recognising Deepfakes, Image Manipulation & Synthetic Abuse",
        topics: [
          "\u09A1\u09BF\u09AA\u09AB\u09C7\u0995, \u09AB\u09C7\u09B8-\u09B8\u09CB\u09AF\u09BC\u09BE\u09AA\u09BF\u0982 \u0993 \u09AD\u09AF\u09BC\u09C7\u09B8 \u0995\u09CD\u09B2\u09CB\u09A8\u09BF\u0982 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7\u2014\u09B8\u09B9\u099C \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE",
          "\u099B\u09AC\u09BF \u0993 \u09AD\u09BF\u09A1\u09BF\u0993\u09A4\u09C7 AI \u09AC\u09BF\u0995\u09C3\u09A4\u09BF \u09B6\u09A8\u09BE\u0995\u09CD\u09A4 \u0995\u09B0\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09AD\u09BF\u099C\u09CD\u09AF\u09C1\u09AF\u09BC\u09BE\u09B2 \u0993 \u09AE\u09C7\u099F\u09BE\u09A1\u09C7\u099F\u09BE \u09B8\u0982\u0995\u09C7\u09A4",
          "\u09AD\u09C1\u09AF\u09BC\u09BE \u09AA\u09CD\u09B0\u09CB\u09AB\u09BE\u0987\u09B2, \u0987\u09AE\u09CD\u09AA\u09BE\u09B0\u09B8\u09CB\u09A8\u09C7\u09B6\u09A8 \u0993 AI-\u099C\u09C7\u09A8\u09BE\u09B0\u09C7\u099F\u09C7\u09A1 \u09AA\u09CD\u09B0\u09A4\u09BE\u09B0\u09A3\u09BE \u099A\u09BF\u09B9\u09CD\u09A8\u09BF\u09A4 \u0995\u09B0\u09BE",
          "\u09B8\u09A8\u09CD\u09A6\u09C7\u09B9\u099C\u09A8\u0995 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u09B6\u09C7\u09AF\u09BC\u09BE\u09B0 \u09A8\u09BE \u0995\u09B0\u09C7 \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09BE\u09B0 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u0985\u09AD\u09CD\u09AF\u09BE\u09B8"
        ]
      },
      {
        code: "Week 3",
        title: "Account Security, Privacy Protection & Harassment Defence",
        topics: [
          "\u09AE\u09BE\u09B2\u09CD\u099F\u09BF-\u09AB\u09CD\u09AF\u09BE\u0995\u09CD\u099F\u09B0 \u0985\u09A5\u09C7\u09A8\u099F\u09BF\u0995\u09C7\u09B6\u09A8 (2FA), \u09AA\u09BE\u09B8\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u09B9\u09BE\u0987\u099C\u09BF\u09A8 \u0993 \u09B2\u0997\u0987\u09A8 \u09AE\u09A8\u09BF\u099F\u09B0\u09BF\u0982",
          "\u09AB\u09C7\u09B8\u09AC\u09C1\u0995, \u09B9\u09CB\u09AF\u09BC\u09BE\u099F\u09B8\u0985\u09CD\u09AF\u09BE\u09AA \u0993 \u0985\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09AF \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE\u09C7 \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u0993 \u09AC\u09CD\u09B2\u0995\u09BF\u0982 \u09A8\u09BF\u09AF\u09BC\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3",
          "\u09B8\u09BE\u0987\u09AC\u09BE\u09B0 \u09B8\u09CD\u099F\u0995\u09BF\u0982, \u09A1\u0995\u09CD\u09B8\u09BF\u0982 \u0993 \u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995\u09AE\u09C7\u0987\u09B2\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0995\u09CC\u09B6\u09B2",
          "\u09AB\u09BF\u09B6\u09BF\u0982 \u09B2\u09BF\u0999\u09CD\u0995 \u0993 \u09AE\u09CD\u09AF\u09BE\u09B2\u0993\u09AF\u09BC\u09CD\u09AF\u09BE\u09B0 \u09A5\u09C7\u0995\u09C7 \u09A1\u09BF\u09AD\u09BE\u0987\u09B8 \u0993 \u09AB\u099F\u09CB \u0997\u09CD\u09AF\u09BE\u09B2\u09BE\u09B0\u09BF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE"
        ]
      },
      {
        code: "Week 4",
        title: "Response Protocols, Evidence Preservation & Support Ecosystems",
        topics: [
          "\u0995\u09CB\u09A8\u09CB \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B9\u09AF\u09BC\u09B0\u09BE\u09A8\u09BF\u09B0 \u0998\u099F\u09A8\u09BE \u0998\u099F\u09B2\u09C7 \u0986\u09A4\u0999\u09CD\u0995\u09BF\u09A4 \u09A8\u09BE \u09B9\u09AF\u09BC\u09C7 \u09A7\u09BE\u09AA\u09C7 \u09A7\u09BE\u09AA\u09C7 \u0995\u09B0\u09A3\u09C0\u09AF\u09BC",
          "\u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09A8\u09B6\u099F, URL \u0993 \u099F\u09BE\u0987\u09AE\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u09AE\u09CD\u09AA\u09B8\u09B9 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u09AA\u09CD\u09B0\u09AE\u09BE\u09A3 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3\u09C7\u09B0 \u09A8\u09BF\u09AF\u09BC\u09AE\u09BE\u09AC\u09B2\u09BF",
          "\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u09B8\u09BE\u0987\u09AC\u09BE\u09B0 \u09B9\u09C7\u09B2\u09CD\u09AA\u09B2\u09BE\u0987\u09A8, \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982 \u0993 \u0986\u0987\u09A8\u09BF/\u09AE\u09A8\u09B8\u09CD\u09A4\u09BE\u09A4\u09CD\u09A4\u09CD\u09AC\u09BF\u0995 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u09AA\u09A5",
          "\u09A8\u09BF\u099C\u09C7\u09B0 \u0993 \u09AA\u09B0\u09BF\u09AC\u09BE\u09B0\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09EA-\u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 Digital Self-Protection Checklist \u09A4\u09C8\u09B0\u09BF"
        ]
      }
    ],
    practicalSkills: [
      "\u09B8\u09CB\u09B6\u09CD\u09AF\u09BE\u09B2 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u0993 \u09A1\u09BF\u09AD\u09BE\u0987\u09B8 \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u09B2\u0995\u09A1\u09BE\u0989\u09A8",
      "\u09A1\u09BF\u09AA\u09AB\u09C7\u0995 \u0993 \u09AE\u09CD\u09AF\u09BE\u09A8\u09BF\u09AA\u09C1\u09B2\u09C7\u099F\u09C7\u09A1 \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u09AF\u09BE\u099A\u09BE\u0987\u09AF\u09BC\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE",
      "\u09AA\u09BE\u09B8\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u0993 2FA \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u09B8\u09C7\u099F\u0986\u09AA",
      "\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AA\u09CD\u09B0\u09AE\u09BE\u09A3 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0993 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09BF\u0982 \u09AA\u09CD\u09B0\u09CB\u099F\u09CB\u0995\u09B2"
    ],
    outsideScope: [
      "\u0986\u0987\u09A8\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09A8\u09BF\u09A7\u09BF\u09A4\u09CD\u09AC \u09AC\u09BE \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09AA\u09C1\u09B2\u09BF\u09B6\u09BF \u09A4\u09A6\u09A8\u09CD\u09A4 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE (\u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF\u099F\u09BF \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09AE\u09C2\u09B2\u0995 \u0993 \u09B8\u099A\u09C7\u09A4\u09A8\u09A4\u09BE\u09AE\u09C2\u09B2\u0995)",
      "\u0995\u09CD\u09B2\u09BF\u09A8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09B8\u09BE\u0987\u0995\u09CB\u09B2\u099C\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09A5\u09C7\u09B0\u09BE\u09AA\u09BF",
      "\u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09B8\u0982\u09AC\u09C7\u09A6\u09A8\u09B6\u09C0\u09B2 \u099B\u09AC\u09BF \u09AC\u09BE \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F \u09AB\u09B0\u09CD\u09AE\u09C7 \u09B8\u0982\u0997\u09CD\u09B0\u09B9 (\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A8\u09BF\u09B7\u09BF\u09A6\u09CD\u09A7)"
    ],
    programmeNotes: [
      "\u098F\u099F\u09BF Atlas AI Education-\u098F\u09B0 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 (BDT 0) \u09B8\u09BE\u09AE\u09BE\u099C\u09BF\u0995 \u09B8\u099A\u09C7\u09A4\u09A8\u09A4\u09BE \u0993 \u09B8\u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u0989\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8 \u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF\u0964",
      "\u0995\u09A0\u09CB\u09B0 \u09B8\u09C7\u09AB\u0997\u09BE\u09B0\u09CD\u09A1\u09BF\u0982 \u09A8\u09C0\u09A4\u09BF\u09AE\u09BE\u09B2\u09BE: \u098F\u0987 \u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF\u09B0 \u0995\u09CB\u09A8\u09CB \u09AB\u09B0\u09CD\u09AE \u09AC\u09BE \u0995\u09CD\u09B2\u09BE\u09B8\u09C7 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09B8\u0982\u09AC\u09C7\u09A6\u09A8\u09B6\u09C0\u09B2 \u099B\u09AC\u09BF \u09AC\u09BE \u0997\u09CB\u09AA\u09A8\u09C0\u09AF\u09BC \u09A8\u09A5\u09BF \u099C\u09AE\u09BE \u09A8\u09C7\u0993\u09AF\u09BC\u09BE \u09B9\u09AF\u09BC \u09A8\u09BE\u0964"
    ],
    prerequisites: "\u0995\u09CB\u09A8\u09CB \u09AA\u09C2\u09B0\u09CD\u09AC \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u09A8\u09C7\u0987; \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u09B8\u09CD\u09AE\u09BE\u09B0\u09CD\u099F\u09AB\u09CB\u09A8 \u09AC\u09BE \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09B2\u09C7\u0987 \u0985\u0982\u09B6 \u09A8\u09C7\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AC\u09C7\u0964",
    assessment: "\u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09B8\u09C7\u09B6\u09A8\u09C7 \u09A8\u09BF\u09AF\u09BC\u09AE\u09BF\u09A4 \u0985\u0982\u09B6\u0997\u09CD\u09B0\u09B9\u09A3 \u0993 \u09B8\u09AE\u09BE\u09AA\u09A8\u09C0 Digital Self-Protection Checklist \u0985\u09A8\u09C1\u09B6\u09C0\u09B2\u09A8\u0964",
    certificate: "\u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09B2\u09C7 Non-accredited Certificate of Participation \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964",
    registrationNote: "\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 (BDT 0) \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09A8\u09AF\u09CB\u0997\u09CD\u09AF\u0964 \u09E7\u09EE \u09AC\u099B\u09B0\u09C7\u09B0 \u0995\u09AE \u09AC\u09AF\u09BC\u09B8\u09C0\u09A6\u09C7\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u0985\u09AD\u09BF\u09AD\u09BE\u09AC\u0995\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AE\u09A4\u09BF \u0986\u09AC\u09B6\u09CD\u09AF\u0995\u0964"
  }
];
var WOMENS_SAFETY_PROGRAMME = COURSES.find(
  (c) => c.code === "SP-WSAI"
);
var FEATURED_COURSES = [
  COURSES.find((c) => c.code === "FREE"),
  COURSES.find((c) => c.code === "AP-201"),
  COURSES.find((c) => c.code === "PD-301"),
  WOMENS_SAFETY_PROGRAMME
];
function getCourseByCodeOrSlug(codeOrSlug) {
  const key = codeOrSlug.trim().toLowerCase();
  return COURSES.find(
    (c) => c.code.toLowerCase() === key || c.slug.toLowerCase() === key
  );
}

// src/shared/foundationSeo.ts
var FOUNDATION_CATEGORY_SLUG = "ai-literacy";
var FOUNDATION_SEO_PROFILES = {
  FREE: {
    seoTitle: "AI Fundamentals & Digital Literacy (FREE) \u2013 Atlas AI Education",
    metaDescription: "Monthly 2\u20132.5 hour FREE open session (BDT 0) by Atlas AI Education covering how AI works, ML vs Deep Learning, everyday AI applications, and safe use for beginners.",
    ogTitle: "AI Fundamentals & Digital Literacy (FREE Masterclass) \u2013 Atlas AI Education",
    ogDescription: "Beginner-friendly monthly open session (BDT 0 \xB7 2\u20132.5 Hours) introducing Artificial Intelligence, how models learn from data, and everyday responsible AI usage.",
    primaryKeyword: "AI Fundamentals and Digital Literacy Bangladesh",
    secondaryKeywords: [
      "Free AI Masterclass Bangladesh",
      "AI literacy foundation course BDT 0",
      "Introduction to Artificial Intelligence beginner",
      "Atlas AI Education free open session",
      "AI Machine Learning Deep Learning basics"
    ],
    semanticTopics: [
      "Artificial Intelligence Fundamentals",
      "Digital Literacy",
      "Machine Learning vs Deep Learning",
      "Narrow AI and Generative AI",
      "AI Training and Inference Basics",
      "Everyday AI Applications"
    ],
    searchIntent: "informational-educational-free-registration",
    workloadIso: "PT2H30M",
    courseMode: "online"
  },
  "AL-100": {
    seoTitle: "AI Governance Fundamentals (AL-100) \u2013 Atlas AI Education",
    metaDescription: "Free 4-week (8 classes, BDT 0) AI Governance Fundamentals foundation course by Atlas AI Education covering responsible AI principles, algorithmic bias, and UNESCO/OECD/EU frameworks.",
    ogTitle: "AI Governance Fundamentals (AL-100 \xB7 Free Foundation) \u2013 Atlas AI Education",
    ogDescription: "4-week (8 live online classes \xB7 BDT 0) foundation course on AI policy, accountability, transparency, algorithmic risk assessment, and global governance frameworks.",
    primaryKeyword: "AI Governance Fundamentals course",
    secondaryKeywords: [
      "Free AI governance course Bangladesh",
      "Responsible AI policy and ethics training",
      "Algorithmic bias and AI accountability",
      "UNESCO OECD EU AI Act fundamentals",
      "Atlas AI Education AL-100"
    ],
    semanticTopics: [
      "AI Governance",
      "AI Policy Foundations",
      "Transparency and Explainability",
      "Algorithmic Bias and Fairness",
      "Human-in-the-loop Oversight",
      "Global AI Governance Frameworks"
    ],
    searchIntent: "informational-educational-free-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "AL-101": {
    seoTitle: "Generative AI & Prompt Engineering (AL-101) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 999) Generative AI & Prompt Engineering course by Atlas AI Education. Learn LLM fundamentals, zero-shot/few-shot prompting, and multimodal workflows.",
    ogTitle: "Generative AI & Prompt Engineering (AL-101) \u2013 Atlas AI Education",
    ogDescription: "Structured 4-week foundation programme (BDT 999, scholarship eligible) teaching prompt anatomy, role and few-shot prompting, iterative refinement, and output verification.",
    primaryKeyword: "Generative AI and Prompt Engineering course",
    secondaryKeywords: [
      "Prompt engineering foundation course Bangladesh",
      "Generative AI training BDT 999",
      "Zero-shot few-shot role prompting",
      "Large Language Models beginner course",
      "Atlas AI Education AL-101"
    ],
    semanticTopics: [
      "Generative Artificial Intelligence",
      "Large Language Models",
      "Prompt Engineering",
      "Zero-shot and Few-shot Prompting",
      "Structured Output Design",
      "Multimodal Prompting"
    ],
    searchIntent: "educational-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "AL-102": {
    seoTitle: "AI for Everyday & Professional Productivity (AL-102) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 999) foundation course on AI for daily and workplace productivity: emails, reports, meeting notes, presentation outlines, data summaries, and routines.",
    ogTitle: "AI for Everyday & Professional Productivity (AL-102) \u2013 Atlas AI Education",
    ogDescription: "Practical 4-week foundation training (BDT 999) helping students and professionals streamline emails, meeting summaries, structured documents, and daily workflows with AI.",
    primaryKeyword: "AI for Everyday and Professional Productivity course",
    secondaryKeywords: [
      "AI productivity course Bangladesh",
      "AI for emails reports and meeting notes",
      "Workplace AI efficiency beginner course",
      "Personal AI productivity workflows",
      "Atlas AI Education AL-102"
    ],
    semanticTopics: [
      "AI Workplace Productivity",
      "Professional Communication with AI",
      "Document and Presentation Preparation",
      "Structured Data Summarisation",
      "Personal AI Productivity Workflows"
    ],
    searchIntent: "educational-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "AL-103": {
    seoTitle: "AI Safety, Ethics & Responsible Use (AL-103) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 999) AI Safety, Ethics & Responsible Use foundation course covering deepfakes, misinformation verification, privacy protection, bias, and academic integrity.",
    ogTitle: "AI Safety, Ethics & Responsible Use (AL-103) \u2013 Atlas AI Education",
    ogDescription: "4-week foundation programme (BDT 999) teaching fact-checking AI hallucinations, deepfake awareness, confidential data hygiene, and ethical AI use for education and work.",
    primaryKeyword: "AI Safety Ethics and Responsible Use course",
    secondaryKeywords: [
      "AI safety and ethics training Bangladesh",
      "Deepfake misinformation verification course",
      "AI privacy and data protection basics",
      "Responsible AI academic integrity",
      "Atlas AI Education AL-103"
    ],
    semanticTopics: [
      "AI Safety and Harm Awareness",
      "Misinformation and Deepfake Verification",
      "Personal Data Protection with AI",
      "Algorithmic Fairness and Copyright",
      "Human Oversight and Hallucination Detection"
    ],
    searchIntent: "educational-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "AL-104": {
    seoTitle: "AI Tools Literacy & Prompt Engineering (AL-104) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 1,499) AI Tools Literacy & Prompt Engineering course teaching cross-platform tool evaluation, prompt adaptation, source verification, and personal AI toolkits.",
    ogTitle: "AI Tools Literacy & Prompt Engineering (AL-104) \u2013 Atlas AI Education",
    ogDescription: "Beginner-to-intermediate 4-week foundation course (BDT 1,499) focused on choosing the right AI platform, cross-tool prompting, hallucination checking, and building an AI toolkit.",
    primaryKeyword: "AI Tools Literacy and Prompt Engineering course",
    secondaryKeywords: [
      "AI tools literacy training Bangladesh",
      "Comparing AI platforms and workflows",
      "Cross-platform prompt adaptation",
      "AI output accuracy and source verification",
      "Atlas AI Education AL-104"
    ],
    semanticTopics: [
      "AI Tools Ecosystem Classification",
      "Platform Selection and Evaluation",
      "Cross-Tool Prompt Adaptation",
      "AI Output Verification and Hallucination Detection",
      "Personal AI Toolkit Architecture"
    ],
    searchIntent: "educational-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  }
};
function buildFallbackProfile(course) {
  const numericFee = parseCourseFeeBdt(course);
  const feeText = course.isFree ? "FREE (BDT 0)" : `BDT ${numericFee}`;
  return {
    seoTitle: `${course.title} (${course.code}) \u2013 Atlas AI Education`,
    metaDescription: `${course.duration} foundation course (${feeText}) by Atlas AI Education in AI Literacy & Foundation: ${course.keyAreas.slice(0, 3).join(", ")}.`,
    ogTitle: `${course.title} (${course.code}) \u2013 Atlas AI Education`,
    ogDescription: course.hook,
    primaryKeyword: `${course.title} course Atlas AI Education`,
    secondaryKeywords: [
      course.code,
      course.categoryName,
      ...course.keyAreas.slice(0, 4)
    ],
    semanticTopics: [...course.keyAreas],
    searchIntent: course.isFree ? "informational-educational-free-enrolment" : "educational-course-enrolment",
    workloadIso: course.duration.toLowerCase().includes("week") ? "P4W" : "PT2H30M",
    courseMode: "online"
  };
}
function parseCourseFeeBdt(course) {
  if (course.isFree) return 0;
  const digits = course.fee.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}
function discoverFoundationCourses() {
  return COURSES.filter((course) => course.categorySlug === FOUNDATION_CATEGORY_SLUG);
}
function buildOrganizationEntity(baseUrl) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return {
    "@type": "EducationalOrganization",
    "@id": `${cleanBase}/#organization`,
    name: "Atlas AI Education",
    url: `${cleanBase}/`,
    description: "Atlas AI Education is the structured educational initiative of Atlas AI Institute providing bilingual AI Literacy & Foundation, Applied AI, Professional Development, and Specialised Programmes.",
    parentOrganization: {
      "@type": "Organization",
      "@id": `${cleanBase}/#parent-organization`,
      name: "Atlas AI Institute"
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh"
    },
    knowsAbout: [
      "Artificial Intelligence Education",
      "AI Literacy and Foundation",
      "AI Governance Fundamentals",
      "Generative AI and Prompt Engineering",
      "AI Safety and Responsible Use"
    ]
  };
}
function buildWebsiteEntity(baseUrl) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return {
    "@type": "WebSite",
    "@id": `${cleanBase}/#website`,
    name: "Atlas AI Education",
    url: `${cleanBase}/`,
    inLanguage: ["bn", "en"],
    publisher: {
      "@id": `${cleanBase}/#organization`
    }
  };
}
function buildFoundationCourseJsonLd(course, baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const canonicalUrl = `${cleanBase}/programmes/${course.code}`;
  const profile = FOUNDATION_SEO_PROFILES[course.code] || buildFallbackProfile(course);
  const priceNumber = parseCourseFeeBdt(course);
  const imageUrl = course.imageUrl.startsWith("http") ? course.imageUrl : `${cleanBase}${course.imageUrl}`;
  const courseId = `${canonicalUrl}#course`;
  const webPageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const syllabusParts = course.modules.map((mod, idx) => ({
    "@type": "Syllabus",
    position: idx + 1,
    name: `${mod.code}: ${mod.title}`,
    description: mod.topics.join("; ")
  }));
  const aboutTerms = Array.from(
    /* @__PURE__ */ new Set([course.categoryName, "Foundation", ...profile.semanticTopics])
  ).map((term) => ({
    "@type": "DefinedTerm",
    name: term,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Atlas AI Education \u2013 AI Literacy & Foundation Curriculum"
    }
  }));
  const teachesItems = Array.from(
    /* @__PURE__ */ new Set([...course.learningOutcomes || [], ...course.practicalSkills || []])
  );
  const courseEntity = {
    "@type": "Course",
    "@id": courseId,
    name: course.title,
    alternateName: `${course.code}: ${course.title}`,
    courseCode: course.code,
    description: `${course.overview} ${course.hook}`,
    url: canonicalUrl,
    mainEntityOfPage: { "@id": webPageId },
    image: imageUrl,
    inLanguage: ["bn", "en"],
    educationalLevel: course.level || "Beginner",
    coursePrerequisites: course.prerequisites,
    isAccessibleForFree: course.isFree,
    provider: { "@id": `${cleanBase}/#organization` },
    about: aboutTerms,
    teaches: teachesItems,
    keywords: [profile.primaryKeyword, ...profile.secondaryKeywords].join(", "),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: (course.whoThisCourseIsFor || []).join("; ")
    },
    offers: {
      "@type": "Offer",
      price: String(priceNumber),
      priceCurrency: "BDT",
      category: course.isFree ? "Free Educational Programme" : "Foundation Course Fee (Non-Accredited Programme)",
      availability: options?.isFull ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: canonicalUrl
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: profile.courseMode,
      courseWorkload: profile.workloadIso,
      inLanguage: ["bn", "en"]
    },
    hasPart: syllabusParts,
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${cleanBase}/programmes#webpage`,
      name: "Explore Our Programmes \u2013 Atlas AI Education",
      url: `${cleanBase}/programmes`
    }
  };
  const webPageEntity = {
    "@type": "WebPage",
    "@id": webPageId,
    url: canonicalUrl,
    name: options?.seoTitle || profile.seoTitle,
    description: options?.metaDescription || profile.metaDescription,
    inLanguage: ["bn", "en"],
    isPartOf: { "@id": `${cleanBase}/#website` },
    about: { "@id": courseId },
    mainEntity: { "@id": courseId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: course.imageAlt
    },
    breadcrumb: { "@id": breadcrumbId },
    ...options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}
  };
  const breadcrumbEntity = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${cleanBase}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Programmes",
        item: `${cleanBase}/programmes`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.categoryName,
        item: `${cleanBase}/programmes#ai-literacy`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${course.code}: ${course.title}`,
        item: canonicalUrl
      }
    ]
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      webPageEntity,
      breadcrumbEntity,
      courseEntity
    ]
  };
}
function buildFoundationCategoryListingJsonLd(baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const targetPath = options?.canonicalPath || "/programmes";
  const pageUrl = `${cleanBase}${targetPath}`;
  const courses = options?.publishedCourses || discoverFoundationCourses();
  const itemListElements = courses.map((course, index) => {
    const courseUrl = `${cleanBase}/programmes/${course.code}`;
    const priceNumber = parseCourseFeeBdt(course);
    return {
      "@type": "ListItem",
      position: index + 1,
      url: courseUrl,
      item: {
        "@type": "Course",
        "@id": `${courseUrl}#course`,
        name: course.title,
        courseCode: course.code,
        description: course.hook,
        url: courseUrl,
        educationalLevel: course.level || "Beginner",
        inLanguage: ["bn", "en"],
        isAccessibleForFree: course.isFree,
        provider: { "@id": `${cleanBase}/#organization` },
        offers: {
          "@type": "Offer",
          price: String(priceNumber),
          priceCurrency: "BDT",
          url: courseUrl
        }
      }
    };
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: options?.pageTitle || "AI Literacy & Foundation Programmes \u2013 Atlas AI Education",
        description: options?.pageDescription || "Explore all Foundation courses in AI Literacy & Foundation at Atlas AI Education.",
        inLanguage: ["bn", "en"],
        isPartOf: { "@id": `${cleanBase}/#website` },
        about: {
          "@type": "DefinedTerm",
          name: "AI Literacy & Foundation"
        },
        mainEntity: { "@id": `${pageUrl}#foundation-itemlist` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${cleanBase}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Programmes",
            item: `${cleanBase}/programmes`
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#foundation-itemlist`,
        name: "AI Literacy & Foundation Courses (Atlas AI Education)",
        numberOfItems: itemListElements.length,
        itemListElement: itemListElements
      }
    ]
  };
}
function buildFreeMasterclassJsonLd(baseUrl) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const freeCourse = COURSES.find((c) => c.code === "FREE");
  const pageUrl = `${cleanBase}/free-masterclass`;
  const canonicalCourseUrl = `${cleanBase}/programmes/FREE`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Free Masterclass Registration \u2013 Atlas AI Education",
        description: "Monthly FREE open introductory live online session (2\u20132.5 hours, BDT 0) on AI Fundamentals & Digital Literacy by Atlas AI Education.",
        inLanguage: ["bn", "en"],
        isPartOf: { "@id": `${cleanBase}/#website` },
        mainEntity: { "@id": `${canonicalCourseUrl}#course` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${cleanBase}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Free Masterclass",
            item: pageUrl
          }
        ]
      },
      {
        "@type": "Course",
        "@id": `${canonicalCourseUrl}#course`,
        name: freeCourse?.title || "AI Fundamentals & Digital Literacy",
        courseCode: "FREE",
        description: freeCourse?.overview || "Monthly open introductory AI literacy and digital awareness session by Atlas AI Education.",
        url: canonicalCourseUrl,
        inLanguage: ["bn", "en"],
        educationalLevel: "Beginner",
        isAccessibleForFree: true,
        provider: { "@id": `${cleanBase}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BDT",
          category: "Free Monthly Open Session",
          url: pageUrl
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT2H30M",
          inLanguage: ["bn", "en"]
        }
      }
    ]
  };
}
function buildFoundationCourseSeoRecord(course, baseUrl = "", options) {
  const profile = FOUNDATION_SEO_PROFILES[course.code] || buildFallbackProfile(course);
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const canonicalPath = `/programmes/${course.code}`;
  const canonicalUrl = cleanBase ? `${cleanBase}${canonicalPath}` : canonicalPath;
  const isPublished = options?.isPublished ?? true;
  const indexStatus = !isPublished ? "noindex" : options?.indexStatus || "indexed";
  const lastOptimizedAt = options?.lastOptimizedAt || (/* @__PURE__ */ new Date()).toISOString();
  return {
    courseCode: course.code,
    slug: course.slug,
    canonicalPath,
    seoTitle: profile.seoTitle,
    metaDescription: profile.metaDescription,
    ogTitle: profile.ogTitle,
    ogDescription: profile.ogDescription,
    ogImage: course.imageUrl,
    ogImageAlt: course.imageAlt,
    primaryKeyword: profile.primaryKeyword,
    secondaryKeywords: profile.secondaryKeywords,
    semanticTopics: profile.semanticTopics,
    searchIntent: profile.searchIntent,
    intendedAudience: course.whoThisCourseIsFor || [],
    learningLevel: course.level || "Beginner",
    indexStatus,
    isPublished,
    lastOptimizedAt,
    courseSchema: buildFoundationCourseJsonLd(course, cleanBase || "https://atlasaieducation.org", {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle: profile.seoTitle,
      metaDescription: profile.metaDescription
    })
  };
}

// src/shared/appliedAiSeo.ts
var APPLIED_AI_CATEGORY_SLUG = "applied-ai";
var APPLIED_AI_SEO_PROFILES = {
  "AP-201": {
    seoTitle: "AI-Powered Content Creation (AP-201) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 live classes, BDT 1,200) AI-Powered Content Creation course by Atlas AI Education covering editorial planning, copywriting with brand voice, visuals, scripts, and copyright hygiene.",
    ogTitle: "AI-Powered Content Creation (AP-201 \xB7 Applied AI) \u2013 Atlas AI Education",
    ogDescription: "Practical 4-week Applied AI course (BDT 1,200, scholarship eligible) teaching content calendars, bilingual copywriting, slide and visual prompts, video scripts, and multi-format campaign workflows.",
    primaryKeyword: "AI-Powered Content Creation course Bangladesh",
    secondaryKeywords: [
      "Applied AI content creation training BDT 1200",
      "AI copywriting and editorial calendar course",
      "AI video script and visual asset prompts",
      "Responsible AI content publishing and copyright",
      "Atlas AI Education AP-201"
    ],
    semanticTopics: [
      "Editorial Planning and Audience Mapping",
      "Brand Voice Copywriting with AI",
      "Visual Asset and Slide Prompting",
      "Video Scriptwriting Workflows",
      "Copyright Hygiene and Disclosure",
      "Multi-Format Campaign Content Pack"
    ],
    searchIntent: "educational-applied-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "AP-202": {
    seoTitle: "AI for Business & Entrepreneurship (AP-202) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 live classes, BDT 1,200) AI for Business & Entrepreneurship course by Atlas AI Education covering market discovery, Lean Canvas, customer support SOPs, and small-business operations.",
    ogTitle: "AI for Business & Entrepreneurship (AP-202 \xB7 Applied AI) \u2013 Atlas AI Education",
    ogDescription: "Hands-on 4-week Applied AI course (BDT 1,200, scholarship eligible) for entrepreneurs and SMEs: competitor mapping, value messaging, customer FAQ libraries, SOP checklists, and data privacy.",
    primaryKeyword: "AI for Business and Entrepreneurship course Bangladesh",
    secondaryKeywords: [
      "AI for small business and startups Bangladesh",
      "AI market validation and Lean Canvas course",
      "Customer support FAQ and operations SOP with AI",
      "Applied AI business course BDT 1200",
      "Atlas AI Education AP-202"
    ],
    semanticTopics: [
      "AI-Assisted Market Discovery",
      "Lean Canvas and Value Proposition Design",
      "Product Positioning and Pitch Outlines",
      "Customer Support SOP and FAQ Libraries",
      "Small-Team Operational Checklists",
      "Customer Data Privacy and Tool ROI"
    ],
    searchIntent: "educational-applied-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "AP-203": {
    seoTitle: "AI Automation & Workflow Design (AP-203) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 live classes, BDT 1,200) AI Automation & Workflow Design course by Atlas AI Education covering no-code triggers, webhooks, JSON basics, structured AI steps, and human-in-the-loop controls.",
    ogTitle: "AI Automation & Workflow Design (AP-203 \xB7 Applied AI) \u2013 Atlas AI Education",
    ogDescription: "Practical 4-week Applied AI programme (BDT 1,200, scholarship eligible) on mapping repetitive tasks into no-code workflows connecting forms, sheets, webhooks, structured AI prompts, and human review.",
    primaryKeyword: "AI Automation and Workflow Design course Bangladesh",
    secondaryKeywords: [
      "No-code AI workflow automation training",
      "Webhooks JSON and structured AI outputs course",
      "Human-in-the-loop AI workflow design",
      "Applied AI automation course BDT 1200",
      "Atlas AI Education AP-203"
    ],
    semanticTopics: [
      "Process Mapping and Automation Readiness",
      "No-Code Triggers Actions and Webhooks",
      "Structured JSON Payloads and AI Prompts",
      "Inquiry Classification and Summarisation",
      "Human-in-the-Loop Approval Checkpoints",
      "Workflow Error Handling and Data Hygiene"
    ],
    searchIntent: "educational-applied-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "AP-204": {
    seoTitle: "AI-Powered Website Development (AP-204) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 live classes, BDT 1,200) AI-Powered Website Development course by Atlas AI Education covering HTML/CSS layout, AI UI prompting, debugging, accessibility, SEO basics, and live static deployment.",
    ogTitle: "AI-Powered Website Development (AP-204 \xB7 Applied AI) \u2013 Atlas AI Education",
    ogDescription: "Hands-on 4-week Applied AI course (BDT 1,200, scholarship eligible) teaching how to plan, prompt AI coding assistants for responsive components, verify accessibility and SEO metadata, and deploy live sites.",
    primaryKeyword: "AI-Powered Website Development course Bangladesh",
    secondaryKeywords: [
      "AI-assisted coding website development course",
      "Responsive HTML CSS with AI coding tools",
      "Website debugging accessibility and SEO basics",
      "Applied AI web development BDT 1200",
      "Atlas AI Education AP-204"
    ],
    semanticTopics: [
      "Web Fundamentals and Information Architecture",
      "Prompting AI for Front-End Components",
      "Responsive Flexbox and Grid Layout",
      "Browser Debugging and Accessibility Checks",
      "On-Page SEO Metadata and Open Graph",
      "Static Website Deployment and Maintenance"
    ],
    searchIntent: "educational-applied-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  }
};
function buildFallbackProfile2(course) {
  const numericFee = parseCourseFeeBdt(course);
  const feeText = course.isFree ? "FREE (BDT 0)" : `BDT ${numericFee}`;
  return {
    seoTitle: `${course.title} (${course.code}) \u2013 Atlas AI Education`,
    metaDescription: `${course.duration} Applied AI course (${feeText}) by Atlas AI Education: ${course.keyAreas.slice(0, 3).join(", ")}.`,
    ogTitle: `${course.title} (${course.code} \xB7 Applied AI) \u2013 Atlas AI Education`,
    ogDescription: course.hook,
    primaryKeyword: `${course.title} course Atlas AI Education`,
    secondaryKeywords: [
      course.code,
      course.categoryName,
      ...course.keyAreas.slice(0, 4)
    ],
    semanticTopics: [...course.keyAreas],
    searchIntent: "educational-applied-course-enrolment",
    workloadIso: course.duration.toLowerCase().includes("week") ? "P4W" : "PT2H30M",
    courseMode: "online"
  };
}
function discoverAppliedAiCourses() {
  return COURSES.filter((course) => course.categorySlug === APPLIED_AI_CATEGORY_SLUG);
}
function buildAppliedAiCourseJsonLd(course, baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const canonicalUrl = `${cleanBase}/programmes/${course.code}`;
  const profile = APPLIED_AI_SEO_PROFILES[course.code] || buildFallbackProfile2(course);
  const priceNumber = parseCourseFeeBdt(course);
  const imageUrl = course.imageUrl.startsWith("http") ? course.imageUrl : `${cleanBase}${course.imageUrl}`;
  const courseId = `${canonicalUrl}#course`;
  const webPageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const syllabusParts = course.modules.map((mod, idx) => ({
    "@type": "Syllabus",
    position: idx + 1,
    name: `${mod.code}: ${mod.title}`,
    description: mod.topics.join("; ")
  }));
  const aboutTerms = Array.from(
    /* @__PURE__ */ new Set([course.categoryName, "Applied AI", ...profile.semanticTopics])
  ).map((term) => ({
    "@type": "DefinedTerm",
    name: term,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Atlas AI Education \u2013 Applied AI Curriculum"
    }
  }));
  const teachesItems = Array.from(
    /* @__PURE__ */ new Set([...course.learningOutcomes || [], ...course.practicalSkills || []])
  );
  const courseEntity = {
    "@type": "Course",
    "@id": courseId,
    name: course.title,
    alternateName: `${course.code}: ${course.title}`,
    courseCode: course.code,
    description: `${course.overview} ${course.hook}`,
    url: canonicalUrl,
    mainEntityOfPage: { "@id": webPageId },
    image: imageUrl,
    inLanguage: ["bn", "en"],
    educationalLevel: course.level || "Intermediate",
    coursePrerequisites: course.prerequisites,
    isAccessibleForFree: course.isFree,
    provider: { "@id": `${cleanBase}/#organization` },
    about: aboutTerms,
    teaches: teachesItems,
    keywords: [profile.primaryKeyword, ...profile.secondaryKeywords].join(", "),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: (course.whoThisCourseIsFor || []).join("; ")
    },
    offers: {
      "@type": "Offer",
      price: String(priceNumber),
      priceCurrency: "BDT",
      category: course.isFree ? "Free Educational Programme" : "Applied AI Course Fee (Non-Accredited Programme)",
      availability: options?.isFull ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: canonicalUrl
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: profile.courseMode,
      courseWorkload: profile.workloadIso,
      inLanguage: ["bn", "en"]
    },
    hasPart: syllabusParts,
    ...course.practicalProject ? {
      workExample: {
        "@type": "CreativeWork",
        name: course.practicalProject.title,
        description: course.practicalProject.prompt,
        learningResourceType: course.practicalProject.projectLabel || "Applied Project"
      }
    } : {},
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${cleanBase}/programmes#webpage`,
      name: "Explore Our Programmes \u2013 Atlas AI Education",
      url: `${cleanBase}/programmes`
    }
  };
  const webPageEntity = {
    "@type": "WebPage",
    "@id": webPageId,
    url: canonicalUrl,
    name: options?.seoTitle || profile.seoTitle,
    description: options?.metaDescription || profile.metaDescription,
    inLanguage: ["bn", "en"],
    isPartOf: { "@id": `${cleanBase}/#website` },
    about: { "@id": courseId },
    mainEntity: { "@id": courseId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: course.imageAlt
    },
    breadcrumb: { "@id": breadcrumbId },
    ...options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}
  };
  const breadcrumbEntity = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${cleanBase}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Programmes",
        item: `${cleanBase}/programmes`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.categoryName,
        item: `${cleanBase}/programmes#applied-ai`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${course.code}: ${course.title}`,
        item: canonicalUrl
      }
    ]
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      webPageEntity,
      breadcrumbEntity,
      courseEntity
    ]
  };
}
function buildAppliedAiItemListEntity(baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const targetPath = options?.canonicalPath || "/programmes";
  const pageUrl = `${cleanBase}${targetPath}`;
  const courses = options?.publishedCourses || discoverAppliedAiCourses();
  const itemListElements = courses.map((course, index) => {
    const courseUrl = `${cleanBase}/programmes/${course.code}`;
    const priceNumber = parseCourseFeeBdt(course);
    return {
      "@type": "ListItem",
      position: index + 1,
      url: courseUrl,
      item: {
        "@type": "Course",
        "@id": `${courseUrl}#course`,
        name: course.title,
        courseCode: course.code,
        description: course.hook,
        url: courseUrl,
        educationalLevel: course.level || "Intermediate",
        inLanguage: ["bn", "en"],
        isAccessibleForFree: course.isFree,
        provider: { "@id": `${cleanBase}/#organization` },
        offers: {
          "@type": "Offer",
          price: String(priceNumber),
          priceCurrency: "BDT",
          url: courseUrl
        }
      }
    };
  });
  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#applied-ai-itemlist`,
    name: "Applied AI Courses (Atlas AI Education)",
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements
  };
}
function buildAppliedAiCategoryListingJsonLd(baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const targetPath = options?.canonicalPath || "/programmes";
  const pageUrl = `${cleanBase}${targetPath}`;
  const itemList = buildAppliedAiItemListEntity(cleanBase, {
    canonicalPath: targetPath,
    publishedCourses: options?.publishedCourses
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: options?.pageTitle || "Applied AI Programmes \u2013 Atlas AI Education",
        description: options?.pageDescription || "Explore practical Applied AI courses at Atlas AI Education covering Content Creation, Business & Entrepreneurship, Automation & Workflow Design, and Website Development (BDT 1,200).",
        inLanguage: ["bn", "en"],
        isPartOf: { "@id": `${cleanBase}/#website` },
        about: {
          "@type": "DefinedTerm",
          name: "Applied AI"
        },
        mainEntity: { "@id": `${pageUrl}#applied-ai-itemlist` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${cleanBase}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Programmes",
            item: `${cleanBase}/programmes`
          }
        ]
      },
      itemList
    ]
  };
}
function buildAppliedAiCourseSeoRecord(course, baseUrl = "", options) {
  const profile = APPLIED_AI_SEO_PROFILES[course.code] || buildFallbackProfile2(course);
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const canonicalPath = `/programmes/${course.code}`;
  const isPublished = options?.isPublished ?? true;
  const indexStatus = !isPublished ? "noindex" : options?.indexStatus || "indexed";
  const lastOptimizedAt = options?.lastOptimizedAt || (/* @__PURE__ */ new Date()).toISOString();
  return {
    courseCode: course.code,
    slug: course.slug,
    canonicalPath,
    seoTitle: profile.seoTitle,
    metaDescription: profile.metaDescription,
    ogTitle: profile.ogTitle,
    ogDescription: profile.ogDescription,
    ogImage: course.imageUrl,
    ogImageAlt: course.imageAlt,
    primaryKeyword: profile.primaryKeyword,
    secondaryKeywords: profile.secondaryKeywords,
    semanticTopics: profile.semanticTopics,
    searchIntent: profile.searchIntent,
    intendedAudience: course.whoThisCourseIsFor || [],
    learningLevel: course.level || "Intermediate",
    indexStatus,
    isPublished,
    lastOptimizedAt,
    courseSchema: buildAppliedAiCourseJsonLd(course, cleanBase || "https://atlasaieducation.org", {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle: profile.seoTitle,
      metaDescription: profile.metaDescription
    })
  };
}

// src/shared/professionalDevSeo.ts
var PROFESSIONAL_DEV_CATEGORY_SLUG = "professional-development";
var PROFESSIONAL_DEV_SEO_PROFILES = {
  "PD-301": {
    seoTitle: "AI for Professionals & Workplace Productivity (PD-301) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 2,500) AI for Professionals & Workplace Productivity course covering executive documentation, desk research verification, spreadsheets, and responsible AI at work.",
    ogTitle: "AI for Professionals & Workplace Productivity (PD-301) \u2013 Atlas AI Education",
    ogDescription: "Structured 4-week professional track (BDT 2,500, scholarship eligible) teaching workplace prompting, briefing notes, meeting minutes, research synthesis, spreadsheet reporting, and AI oversight.",
    primaryKeyword: "AI for Professionals and Workplace Productivity course",
    secondaryKeywords: [
      "AI workplace productivity training Bangladesh",
      "AI for corporate and NGO professionals",
      "Executive documentation and meeting notes AI",
      "Spreadsheet reporting and desk research with AI",
      "Atlas AI Education PD-301"
    ],
    semanticTopics: [
      "Workplace Prompt Engineering",
      "Executive Communication and Briefing Notes",
      "AI-Assisted Desk Research and Fact-Checking",
      "Spreadsheet Operations and Management Reporting",
      "Personal Productivity Workflows",
      "Confidentiality and Human Oversight at Work"
    ],
    searchIntent: "professional-skill-development-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "PD-302": {
    seoTitle: "AI for Business Development (PD-302) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 2,500) AI for Business Development course covering market intelligence, competitor research, customer personas, lead qualification, proposals, and partnership strategy.",
    ogTitle: "AI for Business Development (PD-302 \xB7 Professional Track) \u2013 Atlas AI Education",
    ogDescription: "4-week professional programme (BDT 2,500, scholarship eligible) on using AI for sector research, buyer personas, sales pipeline planning, partnership proposals, and verified business intelligence.",
    primaryKeyword: "AI for Business Development course Bangladesh",
    secondaryKeywords: [
      "AI market intelligence and competitor analysis",
      "AI lead qualification and sales proposals",
      "B2B partnership mapping with AI",
      "SWOT analysis and business growth strategy AI",
      "Atlas AI Education PD-302"
    ],
    semanticTopics: [
      "Market Intelligence and Sector Research",
      "Customer Personas and Journey Mapping",
      "Sales Strategy and Lead Qualification",
      "Partnership Opportunity Mapping and Proposals",
      "SWOT and Business Growth Analysis",
      "Ethical Commercial Intelligence Verification"
    ],
    searchIntent: "professional-skill-development-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "PD-303": {
    seoTitle: "AI Leadership & Strategic Management (PD-303) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 2,500) AI Leadership & Strategic Management course for managers and executives covering AI readiness, SWOT/PESTLE decision support, change management, and governance.",
    ogTitle: "AI Leadership & Strategic Management (PD-303) \u2013 Atlas AI Education",
    ogDescription: "Intermediate-to-advanced 4-week executive track (BDT 2,500) on organisational AI readiness, workforce reskilling, governance structures, risk accountability, and phased AI roadmaps.",
    primaryKeyword: "AI Leadership and Strategic Management course",
    secondaryKeywords: [
      "AI leadership training for managers Bangladesh",
      "Organisational AI readiness assessment course",
      "AI governance risk and change management",
      "Strategic AI roadmap and executive briefing",
      "Atlas AI Education PD-303"
    ],
    semanticTopics: [
      "Organisational AI Readiness Assessment",
      "AI-Assisted SWOT PESTLE and Scenario Analysis",
      "Workforce Transformation and Change Management",
      "Organisational AI Governance and Risk",
      "AI Investment and Use Case Prioritisation",
      "Executive AI Strategy Blueprint"
    ],
    searchIntent: "executive-leadership-course-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "PD-304": {
    seoTitle: "AI for Project Management (PD-304) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 2,500) AI for Project Management course covering project charters, WBS, scheduling, budget narratives, risk registers, M&E indicators, and stakeholder reporting.",
    ogTitle: "AI for Project Management (PD-304 \xB7 Professional Track) \u2013 Atlas AI Education",
    ogDescription: "4-week applied professional track (BDT 2,500) integrating AI across project planning, Work Breakdown Structures, resource timelines, risk registers, monitoring indicators, and stakeholder updates.",
    primaryKeyword: "AI for Project Management course Bangladesh",
    secondaryKeywords: [
      "AI Work Breakdown Structure WBS and charter",
      "AI project scheduling and risk register",
      "Monitoring evaluation and NGO reporting with AI",
      "Project manager AI workflow training",
      "Atlas AI Education PD-304"
    ],
    semanticTopics: [
      "Project Charters Scopes and Work Breakdown Structure",
      "Activity Scheduling and Resource Planning",
      "Project Budget Narratives and Cost Assumptions",
      "Project Risk Registers and Scenario Mitigation",
      "Monitoring Evaluation and M&E Indicators",
      "Stakeholder Status Reporting and Confidentiality"
    ],
    searchIntent: "professional-skill-development-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "PD-305": {
    seoTitle: "AI for Marketing & Growth Strategy (PD-305) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 2,500) AI for Marketing & Growth Strategy course covering audience segmentation, brand positioning, 30-day content calendars, campaign workflows, and KPI analysis.",
    ogTitle: "AI for Marketing & Growth Strategy (PD-305) \u2013 Atlas AI Education",
    ogDescription: "4-week professional marketing track (BDT 2,500, scholarship eligible) connecting audience insights, brand messaging, campaign planning, marketing KPIs, and copyright-safe AI usage.",
    primaryKeyword: "AI for Marketing and Growth Strategy course",
    secondaryKeywords: [
      "AI digital marketing strategy Bangladesh",
      "Audience segmentation and brand positioning AI",
      "30-day AI marketing content calendar",
      "Marketing KPI analytics and campaign workflows",
      "Atlas AI Education PD-305"
    ],
    semanticTopics: [
      "Audience Segmentation and Buyer Personas",
      "Brand Positioning and Messaging Frameworks",
      "Digital Content Pillars and 30-Day Calendars",
      "Campaign Workflow and Customer Journey Design",
      "Marketing KPIs and Performance Reporting",
      "Brand Safety Copyright and Truthful Claims"
    ],
    searchIntent: "professional-skill-development-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "PD-306": {
    seoTitle: "AI for Human Resource Management (PD-306) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 2,500) AI for Human Resource Management course covering workforce planning, job design, recruitment workflows, L&D pathways, engagement analysis, and bias prevention.",
    ogTitle: "AI for Human Resource Management (PD-306) \u2013 Atlas AI Education",
    ogDescription: "Ethical 4-week HR professional track (BDT 2,500) on competency mapping, structured interview guides, personalised L&D, onboarding workflows, and algorithmic fairness in people decisions.",
    primaryKeyword: "AI for Human Resource Management course",
    secondaryKeywords: [
      "AI in HR workforce planning Bangladesh",
      "Ethical AI recruitment and interview design",
      "Competency mapping and employee L&D with AI",
      "Algorithmic bias and employee privacy in HR",
      "Atlas AI Education PD-306"
    ],
    semanticTopics: [
      "Workforce Planning and Competency Mapping",
      "Structured and Bias-Aware Recruitment Support",
      "Employee Learning and Development Pathways",
      "Performance Documentation and Engagement Surveys",
      "HR Operations and Onboarding Workflows",
      "Algorithmic Fairness Privacy and Human Oversight"
    ],
    searchIntent: "professional-skill-development-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  },
  "PD-307": {
    seoTitle: "AI for Financial Management (PD-307) \u2013 Atlas AI Education",
    metaDescription: "4-week (8 classes, BDT 2,500) AI for Financial Management course covering budgeting templates, spreadsheet intelligence, budget-vs-actual reporting, financial data security, and auditability.",
    ogTitle: "AI for Financial Management (PD-307 \xB7 Professional Track) \u2013 Atlas AI Education",
    ogDescription: "4-week finance workflow track (BDT 2,500, scholarship eligible) teaching budget narratives, expense categorisation, formula validation, cash-flow summaries, and strict financial privacy controls.",
    primaryKeyword: "AI for Financial Management course Bangladesh",
    secondaryKeywords: [
      "AI for budgeting and financial reporting",
      "Spreadsheet intelligence and formula validation AI",
      "Budget versus actual reporting with AI",
      "Financial data privacy and auditability AI",
      "Atlas AI Education PD-307"
    ],
    semanticTopics: [
      "Budgeting Templates and Expense Categorisation",
      "Spreadsheet Data Cleaning and Formula Validation",
      "Budget-vs-Actual and Management Reporting",
      "Revenue Expense and Cash-Flow Trend Analysis",
      "Financial Operations and Approval Workflows",
      "Confidential Financial Data Security and Auditability"
    ],
    searchIntent: "professional-skill-development-enrolment",
    workloadIso: "P4W",
    courseMode: "online"
  }
};
function buildFallbackProfile3(course) {
  const numericFee = parseCourseFeeBdt(course);
  const feeText = course.isFree ? "FREE (BDT 0)" : `BDT ${numericFee}`;
  return {
    seoTitle: `${course.title} (${course.code}) \u2013 Atlas AI Education`,
    metaDescription: `${course.duration} Professional Development course (${feeText}) by Atlas AI Education: ${course.keyAreas.slice(0, 3).join(", ")}.`,
    ogTitle: `${course.title} (${course.code} \xB7 Professional Development) \u2013 Atlas AI Education`,
    ogDescription: course.hook,
    primaryKeyword: `${course.title} course Atlas AI Education`,
    secondaryKeywords: [
      course.code,
      course.categoryName,
      ...course.keyAreas.slice(0, 4)
    ],
    semanticTopics: [...course.keyAreas],
    searchIntent: "professional-skill-development-enrolment",
    workloadIso: course.duration.toLowerCase().includes("week") ? "P4W" : "PT2H30M",
    courseMode: "online"
  };
}
function discoverProfessionalDevCourses() {
  return COURSES.filter((course) => course.categorySlug === PROFESSIONAL_DEV_CATEGORY_SLUG);
}
function buildProfessionalDevCourseJsonLd(course, baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const canonicalUrl = `${cleanBase}/programmes/${course.code}`;
  const profile = PROFESSIONAL_DEV_SEO_PROFILES[course.code] || buildFallbackProfile3(course);
  const priceNumber = parseCourseFeeBdt(course);
  const imageUrl = course.imageUrl.startsWith("http") ? course.imageUrl : `${cleanBase}${course.imageUrl}`;
  const courseId = `${canonicalUrl}#course`;
  const webPageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const syllabusParts = course.modules.map((mod, idx) => ({
    "@type": "Syllabus",
    position: idx + 1,
    name: `${mod.code}: ${mod.title}`,
    description: mod.topics.join("; ")
  }));
  const aboutTerms = Array.from(
    /* @__PURE__ */ new Set([course.categoryName, "Professional Development", ...profile.semanticTopics])
  ).map((term) => ({
    "@type": "DefinedTerm",
    name: term,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Atlas AI Education \u2013 Professional Development Curriculum"
    }
  }));
  const teachesItems = Array.from(
    /* @__PURE__ */ new Set([...course.learningOutcomes || [], ...course.practicalSkills || []])
  );
  const courseEntity = {
    "@type": "Course",
    "@id": courseId,
    name: course.title,
    alternateName: `${course.code}: ${course.title}`,
    courseCode: course.code,
    description: `${course.overview} ${course.hook}`,
    url: canonicalUrl,
    mainEntityOfPage: { "@id": webPageId },
    image: imageUrl,
    inLanguage: ["bn", "en"],
    educationalLevel: course.level || "Intermediate",
    coursePrerequisites: course.prerequisites,
    isAccessibleForFree: course.isFree,
    provider: { "@id": `${cleanBase}/#organization` },
    about: aboutTerms,
    teaches: teachesItems,
    keywords: [profile.primaryKeyword, ...profile.secondaryKeywords].join(", "),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "professional",
      audienceType: (course.whoThisCourseIsFor || []).join("; ")
    },
    offers: {
      "@type": "Offer",
      price: String(priceNumber),
      priceCurrency: "BDT",
      category: course.isFree ? "Free Educational Programme" : "Professional Development Course Fee (Non-Accredited Programme)",
      availability: options?.isFull ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: canonicalUrl
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: profile.courseMode,
      courseWorkload: profile.workloadIso,
      inLanguage: ["bn", "en"]
    },
    hasPart: syllabusParts,
    ...course.practicalProject ? {
      workExample: {
        "@type": "CreativeWork",
        name: course.practicalProject.title,
        description: course.practicalProject.prompt,
        learningResourceType: course.practicalProject.projectLabel || "Capstone Project"
      }
    } : {},
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${cleanBase}/programmes#webpage`,
      name: "Explore Our Programmes \u2013 Atlas AI Education",
      url: `${cleanBase}/programmes`
    }
  };
  const webPageEntity = {
    "@type": "WebPage",
    "@id": webPageId,
    url: canonicalUrl,
    name: options?.seoTitle || profile.seoTitle,
    description: options?.metaDescription || profile.metaDescription,
    inLanguage: ["bn", "en"],
    isPartOf: { "@id": `${cleanBase}/#website` },
    about: { "@id": courseId },
    mainEntity: { "@id": courseId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: course.imageAlt
    },
    breadcrumb: { "@id": breadcrumbId },
    ...options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}
  };
  const breadcrumbEntity = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${cleanBase}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Programmes",
        item: `${cleanBase}/programmes`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.categoryName,
        item: `${cleanBase}/programmes#professional-development`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${course.code}: ${course.title}`,
        item: canonicalUrl
      }
    ]
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      webPageEntity,
      breadcrumbEntity,
      courseEntity
    ]
  };
}
function buildProfessionalDevItemListEntity(baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const targetPath = options?.canonicalPath || "/programmes";
  const pageUrl = `${cleanBase}${targetPath}`;
  const courses = options?.publishedCourses || discoverProfessionalDevCourses();
  const itemListElements = courses.map((course, index) => {
    const courseUrl = `${cleanBase}/programmes/${course.code}`;
    const priceNumber = parseCourseFeeBdt(course);
    return {
      "@type": "ListItem",
      position: index + 1,
      url: courseUrl,
      item: {
        "@type": "Course",
        "@id": `${courseUrl}#course`,
        name: course.title,
        courseCode: course.code,
        description: course.hook,
        url: courseUrl,
        educationalLevel: course.level || "Intermediate",
        inLanguage: ["bn", "en"],
        isAccessibleForFree: course.isFree,
        provider: { "@id": `${cleanBase}/#organization` },
        offers: {
          "@type": "Offer",
          price: String(priceNumber),
          priceCurrency: "BDT",
          url: courseUrl
        }
      }
    };
  });
  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#professional-development-itemlist`,
    name: "Professional Development Courses (Atlas AI Education)",
    numberOfItems: itemListElements.length,
    itemListElement: itemListElements
  };
}
function buildProfessionalDevCategoryListingJsonLd(baseUrl, options) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const targetPath = options?.canonicalPath || "/programmes";
  const pageUrl = `${cleanBase}${targetPath}`;
  const itemList = buildProfessionalDevItemListEntity(cleanBase, {
    canonicalPath: targetPath,
    publishedCourses: options?.publishedCourses
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(cleanBase),
      buildWebsiteEntity(cleanBase),
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: options?.pageTitle || "Professional Development Programmes \u2013 Atlas AI Education",
        description: options?.pageDescription || "Explore 7 structured 4-week Professional Development AI courses at Atlas AI Education covering Workplace Productivity, Business Development, Leadership, Project Management, Marketing, HR, and Financial Management (BDT 2,500).",
        inLanguage: ["bn", "en"],
        isPartOf: { "@id": `${cleanBase}/#website` },
        about: {
          "@type": "DefinedTerm",
          name: "Professional Development"
        },
        mainEntity: { "@id": `${pageUrl}#professional-development-itemlist` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${cleanBase}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Programmes",
            item: `${cleanBase}/programmes`
          }
        ]
      },
      itemList
    ]
  };
}
function buildProfessionalDevCourseSeoRecord(course, baseUrl = "", options) {
  const profile = PROFESSIONAL_DEV_SEO_PROFILES[course.code] || buildFallbackProfile3(course);
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const canonicalPath = `/programmes/${course.code}`;
  const isPublished = options?.isPublished ?? true;
  const indexStatus = !isPublished ? "noindex" : options?.indexStatus || "indexed";
  const lastOptimizedAt = options?.lastOptimizedAt || (/* @__PURE__ */ new Date()).toISOString();
  return {
    courseCode: course.code,
    slug: course.slug,
    canonicalPath,
    seoTitle: profile.seoTitle,
    metaDescription: profile.metaDescription,
    ogTitle: profile.ogTitle,
    ogDescription: profile.ogDescription,
    ogImage: course.imageUrl,
    ogImageAlt: course.imageAlt,
    primaryKeyword: profile.primaryKeyword,
    secondaryKeywords: profile.secondaryKeywords,
    semanticTopics: profile.semanticTopics,
    searchIntent: profile.searchIntent,
    intendedAudience: course.whoThisCourseIsFor || [],
    learningLevel: course.level || "Intermediate",
    indexStatus,
    isPublished,
    lastOptimizedAt,
    courseSchema: buildProfessionalDevCourseJsonLd(course, cleanBase || "https://atlasaieducation.org", {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle: profile.seoTitle,
      metaDescription: profile.metaDescription
    })
  };
}

// src/data/institutionalServicesData.ts
var INSTITUTIONAL_SERVICES = [
  {
    code: "INST-01",
    slug: "employees-ai-training",
    title: "Employees AI Training",
    badge: "Corporate & Teams",
    iconKey: "users",
    shortSummary: "Role-specific workplace AI training workshops helping corporate, NGO, and institutional teams use AI responsibly and productively.",
    overview: "This training programme equips organisational employees across departments\u2014operations, administration, communication, research, and client support\u2014with practical AI fluency tailored to daily workplace responsibilities. Sessions emphasise accuracy, data confidentiality, verification standards, and measurable workflow efficiency without disrupting existing institutional controls.",
    engagementFormat: "On-site Workshops, Live Virtual Cohorts, or Hybrid Team Sprints",
    imageUrl: "/src/assets/images/course_everyday_productivity_1794924806999.jpg",
    imageAlt: "Workplace professionals collaborating on AI productivity exercises",
    whoItIsFor: [
      "Private companies, SMEs, and corporate operational departments",
      "NGOs, development organisations, and programme support teams",
      "Administrative, communications, HR, and finance office staff"
    ],
    scopeOfService: [
      "Pre-training role mapping across participating departments",
      "Hands-on prompt structuring and document/report assistance workshops",
      "Data privacy, client confidentiality, and fact-checking protocols",
      "Departmental use-case library tailored to real team workflows"
    ],
    keyAreas: [
      "Structured workplace prompting & quality review",
      "Document drafting, briefing notes & meeting synthesis",
      "Spreadsheet organisation & management summaries",
      "Data confidentiality & safe AI usage rules",
      "Verification workflows to prevent AI hallucinations",
      "Role-based daily productivity toolkits"
    ],
    deliveryApproach: [
      "Departmental needs scoping prior to session delivery",
      "Bilingual (Bangla & English) interactive facilitation with live exercises",
      "Practical case scenarios modelled on your team\u2019s daily tasks",
      "Post-workshop reference handbook and usage checklists"
    ],
    potentialDeliverables: [
      "Custom Workplace AI Training Slide Deck & Workbook",
      "Department-Specific Prompt & Workflow Library",
      "Employee Safe AI Usage Quick-Reference Checklist",
      "Participant Attendance & Completion Summary Report"
    ]
  },
  {
    code: "INST-02",
    slug: "ai-leadership-executive-training",
    title: "AI Leadership & Executive Training",
    badge: "Executive Advisory",
    iconKey: "briefcase",
    shortSummary: "Executive briefings and strategic workshops on AI adoption decisions, governance oversight, and organisational change management.",
    overview: "Designed for C-suite executives, managing directors, department heads, and senior public-sector leaders, this programme frames AI as an organisational capability rather than an isolated software trend. Leaders examine strategic prioritisation, workforce transition, risk governance, and realistic ROI evaluation before committing institutional resources.",
    engagementFormat: "Executive Roundtables, Half-Day Strategy Briefings, or Multi-Session Advisory",
    imageUrl: "/src/assets/images/course_ai_governance_leadership_1794924812599.jpg",
    imageAlt: "Senior organisational leaders reviewing AI strategy and governance frameworks",
    whoItIsFor: [
      "Chief executives, founders, board members, and senior directors",
      "Department heads and business unit leaders",
      "Senior government officials and NGO country leadership teams"
    ],
    scopeOfService: [
      "Executive briefing on generative AI capabilities, limits, and market shifts",
      "Decision framework for high-impact vs. high-risk AI use cases",
      "Workforce change management, reskilling, and culture alignment",
      "Leadership accountability, governance structures, and oversight standards"
    ],
    keyAreas: [
      "AI adoption vs. true organisational transformation",
      "Executive decision-making & build-buy-partner evaluation",
      "Managing reputational, privacy, and operational AI risks",
      "Workforce capability planning & role evolution",
      "Prioritising pilot initiatives with measurable indicators",
      "Internal leadership alignment & communication"
    ],
    deliveryApproach: [
      "Confidential pre-session alignment with executive sponsors",
      "Case-led roundtable dialogue focused on strategic trade-offs",
      "Decision matrices and prioritisation scorecards applied live"
    ],
    potentialDeliverables: [
      "Executive AI Strategy & Risk Briefing Memo",
      "Use-Case Prioritisation & Feasibility Scorecard",
      "90-Day Leadership Alignment Action Plan"
    ]
  },
  {
    code: "INST-03",
    slug: "university-academic-ai-training",
    title: "University & Academic AI Training",
    badge: "Higher Education",
    iconKey: "graduation-cap",
    shortSummary: "AI literacy, academic integrity, ethical research workflows, and assessment adaptation workshops for universities, faculty, and students.",
    overview: "Higher education institutions face urgent questions regarding academic honesty, thesis supervision, faculty productivity, and student career readiness in the generative AI era. This service supports university leadership, faculty members, and student cohorts in building constructive, transparent, and ethical academic practices.",
    engagementFormat: "Faculty Development Workshops, Departmental Seminars, & Student Bootcamps",
    imageUrl: "/src/assets/images/programme_ai_literacy_1794867547641.jpg",
    imageAlt: "University educators and students participating in an academic AI workshop",
    whoItIsFor: [
      "Public and private university faculty members and department chairs",
      "Academic administrators, IQAC units, and curriculum committees",
      "Undergraduate, postgraduate, and research student cohorts"
    ],
    scopeOfService: [
      "Faculty workshops on AI-resilient assignment & assessment redesign",
      "Academic integrity, citation transparency, and AI disclosure guidelines",
      "Ethical literature review and research synthesis workflows",
      "Department-wide student AI literacy and employability orientations"
    ],
    keyAreas: [
      "Designing AI-aware coursework & oral/applied assessments",
      "Academic integrity policies & disclosure standards",
      "Responsible AI in literature mapping & research drafting",
      "Understanding limitations of AI detection tools",
      "Faculty productivity in rubric design & lesson planning",
      "Student readiness for modern AI-enabled workplaces"
    ],
    deliveryApproach: [
      "Discipline-aware adaptation (STEM, Business, Social Sciences, Humanities)",
      "Interactive syllabus audit and assessment redesign exercises",
      "Dedicated Q&A for faculty governance and departmental policies"
    ],
    potentialDeliverables: [
      "Draft Departmental Academic AI Integrity & Disclosure Policy",
      "Faculty Guide to AI-Resilient Assignment Design",
      "Student Responsible Academic AI Orientation Pack"
    ]
  },
  {
    code: "INST-04",
    slug: "ai-readiness-assessment",
    title: "AI Readiness Assessment",
    badge: "Diagnostic & Audit",
    iconKey: "clipboard-check",
    shortSummary: "Structured AI readiness diagnostics with dedicated pathways evaluating skills, workflows, data practices, and governance for Companies, Offices, and Universities.",
    overview: "Before investing in AI platforms or wide-scale staff rollouts, institutions need an objective baseline of where they stand. Our AI Readiness Assessment evaluates human capabilities, process maturity, data sensitivity, infrastructure constraints, and policy gaps across three specialised institutional pathways.",
    engagementFormat: "2\u20134 Week Diagnostic Engagement (Surveys, Interviews, & Executive Readout)",
    imageUrl: "/src/assets/images/course_data_intelligence_1794924810524.jpg",
    imageAlt: "Institutional AI readiness diagnostic dashboard and maturity scorecard review",
    whoItIsFor: [
      "Companies planning structured AI adoption across business units",
      "Government and administrative offices evaluating workflow readiness",
      "Universities assessing faculty, student, and academic policy readiness"
    ],
    scopeOfService: [
      "Stakeholder readiness survey and leadership/departmental interviews",
      "Workflow audit to identify safe, high-leverage AI assistance opportunities",
      "Data sensitivity, confidentiality, and governance gap diagnostic",
      "Prioritised readiness scorecard and capacity-building recommendations"
    ],
    keyAreas: [
      "Workforce AI literacy & skills baseline evaluation",
      "Operational process suitability & bottleneck mapping",
      "Data privacy, confidentiality & security posture check",
      "Governance, policy & human-oversight readiness",
      "Tooling feasibility within budget & infrastructure limits",
      "Departmental pilot readiness prioritisation"
    ],
    deliveryApproach: [
      "Pathway selection matched to institutional structure (Company, Office, or University)",
      "Mixed-method assessment combining structured surveys and team interviews",
      "Clear maturity findings presentation without vendor lock-in"
    ],
    potentialDeliverables: [
      "Institutional AI Readiness Maturity Scorecard",
      "Departmental Skills & Risk Gap Analysis Report",
      "Prioritised Pre-Adoption & Training Recommendations"
    ],
    pathways: [
      {
        id: "readiness-companies",
        title: "Companies & Private Sector Pathway",
        targetAudience: "SMEs, Corporate Groups, Service Firms & Startups",
        summary: "Assesses commercial workflows, customer-facing teams, reporting bottlenecks, and competitive productivity opportunities alongside commercial data protection.",
        focusAreas: [
          "Sales, marketing, operations & finance workflow suitability",
          "Commercial confidentiality & client data exposure risks",
          "Staff role-by-role AI skill baselines"
        ],
        deliverables: [
          "Commercial AI Opportunity Matrix",
          "Departmental Training & Pilot Readiness Scorecards"
        ]
      },
      {
        id: "readiness-offices",
        title: "Government, Public & Administrative Offices Pathway",
        targetAudience: "Public Agencies, Administrative Directorates & Institutional Offices",
        summary: "Evaluates documentation load, citizen/stakeholder communication, file synthesis processes, and strict public-record confidentiality requirements.",
        focusAreas: [
          "Documentation, drafting & administrative process mapping",
          "Official record confidentiality & access governance",
          "Digital literacy across administrative grades"
        ],
        deliverables: [
          "Administrative Workflow & Safe Use Diagnostic",
          "Office AI Governance & Staff Upskilling Brief"
        ]
      },
      {
        id: "readiness-universities",
        title: "Universities & Academic Institutions Pathway",
        targetAudience: "Universities, Colleges, Research Institutes & Academic Boards",
        summary: "Measures faculty AI fluency, student usage patterns, assessment vulnerability, research integrity standards, and institutional policy readiness.",
        focusAreas: [
          "Curriculum & assessment AI-resilience review",
          "Faculty & researcher AI support requirements",
          "Campus academic integrity & disclosure readiness"
        ],
        deliverables: [
          "Academic AI Readiness & Policy Gap Report",
          "Faculty Development & Curriculum Adaptation Plan"
        ]
      }
    ]
  },
  {
    code: "INST-05",
    slug: "ai-implementation-roadmap",
    title: "AI Implementation Roadmap",
    badge: "Multi-Sector Strategy",
    iconKey: "map",
    shortSummary: "Phased AI implementation roadmaps tailored for Companies & Businesses, Government Offices, Universities, and NGOs.",
    overview: "Translating AI ambition into sustainable daily operations requires sequencing, realistic milestones, governance checkpoints, and human accountability. We co-design practical 90-day, 6-month, and 12-month implementation roadmaps calibrated to your sector\u2019s regulatory environment and operational capacity.",
    engagementFormat: "Advisory Planning Sprints, Stakeholder Co-Design, & Milestone Blueprinting",
    imageUrl: "/src/assets/images/course_business_transformation_1794924809638.jpg",
    imageAlt: "Strategic AI implementation roadmap planning session across teams",
    whoItIsFor: [
      "Companies & private businesses operationalising AI pilots across teams",
      "Government & public offices modernising administrative workflows safely",
      "Universities rolling out faculty, student, and governance programmes",
      "NGOs & development organisations enhancing reporting, M&E, and programme impact"
    ],
    scopeOfService: [
      "Sequenced pilot selection balancing quick wins and risk controls",
      "Role-based staff training plan aligned with rollout phases",
      "Governance gates, human-review checkpoints, and KPI definition",
      "Vendor-neutral tool category recommendations and budget planning"
    ],
    keyAreas: [
      "Phase 1 (Foundation & Policy) to Phase 3 (Scaled Integration)",
      "Cross-functional pilot charter design",
      "Change management & internal champion structures",
      "Risk mitigation, data boundaries & compliance alignment",
      "Measurable adoption KPIs & quarterly review cadence"
    ],
    deliveryApproach: [
      "Sector-specific co-design workshops with departmental leads",
      "Practical documentation structured for immediate leadership sign-off",
      "Zero hype\u2014focused strictly on verifiable operational feasibility"
    ],
    potentialDeliverables: [
      "Phased 90-Day / 6-Month / 12-Month AI Implementation Roadmap",
      "Pilot Project Charters & Success Metrics Framework",
      "Governance & Risk Escalation Checkpoints"
    ],
    sectors: [
      {
        id: "sector-companies",
        title: "Companies & Businesses",
        summary: "Commercial roadmaps prioritising team productivity, client service quality, operations automation, and verifiable ROI.",
        priorities: [
          "Pilot rollout across sales, support & operations",
          "Employee workflow upskilling schedule",
          "Client data protection guardrails"
        ],
        deliverables: [
          "Commercial AI Rollout Blueprint",
          "Departmental KPI & Pilot Tracker"
        ]
      },
      {
        id: "sector-government",
        title: "Government & Public Offices",
        summary: "Careful, accountability-first roadmaps centred on administrative efficiency, citizen service drafting, and public-data safeguards.",
        priorities: [
          "Human-in-the-loop administrative review",
          "Strict data classification & zero-leakage protocols",
          "Capacity development for officers & staff"
        ],
        deliverables: [
          "Public-Sector Phased Adoption Plan",
          "Administrative Safeguards & Oversight Matrix"
        ]
      },
      {
        id: "sector-universities",
        title: "Universities & Academic Institutions",
        summary: "Balanced academic roadmaps integrating faculty enablement, research ethics, assessment reform, and campus-wide AI literacy.",
        priorities: [
          "Senate/Academic Council policy alignment",
          "Faculty & thesis supervisor training schedule",
          "Student AI literacy integration across faculties"
        ],
        deliverables: [
          "University Academic AI Roadmap",
          "Departmental Assessment Transition Guide"
        ]
      },
      {
        id: "sector-ngos",
        title: "NGOs & Development Organisations",
        summary: "Mission-aligned roadmaps improving grant reporting, M&E synthesis, field documentation, and beneficiary privacy protection.",
        priorities: [
          "Beneficiary & sensitive field data safeguarding",
          "Proposal, M&E & donor report workflow efficiency",
          "Field and HQ team AI capacity building"
        ],
        deliverables: [
          "NGO Responsible AI Adoption Plan",
          "Programme & M&E Pilot Implementation Guide"
        ]
      }
    ]
  },
  {
    code: "INST-06",
    slug: "ai-workflow-automation-training",
    title: "AI Workflow & Automation Training",
    badge: "Operations & Process",
    iconKey: "workflow",
    shortSummary: "Practical workflow auditing and no-code, human-reviewed AI automation training for operational, admin, and programme teams.",
    overview: "Many institutions waste staff hours on repetitive data entry, meeting follow-ups, form triage, and report formatting. This hands-on training enables non-engineering operational teams to map bottlenecks and build safe, human-approved no-code AI workflows without writing complex software.",
    engagementFormat: "Hands-On Technical & No-Code Lab Cohorts (2\u20134 Sessions)",
    imageUrl: "/src/assets/images/course_workflow_automation_1794924807818.jpg",
    imageAlt: "Operations specialists designing AI workflow automation diagrams",
    whoItIsFor: [
      "Operations managers, admin leads, and project coordinators",
      "Marketing, HR, and customer support operational teams",
      "NGO programme and M&E documentation units"
    ],
    scopeOfService: [
      "Live workflow bottleneck audit using your team\u2019s real recurring processes",
      "No-code automation architecture (triggers, AI processing, human review gates)",
      "Error-handling, logging, and reliability practices for non-developers",
      "Prototype workflow build sprint during training"
    ],
    keyAreas: [
      "Auditing tasks suitable vs. unsuitable for automation",
      "No-code integration concepts (webhooks, forms, spreadsheets, docs)",
      "Designing human-in-the-loop approval checkpoints",
      "Automated reporting & communication drafting pipelines",
      "Preventing silent errors and maintaining audit logs"
    ],
    deliveryApproach: [
      "Workshop participants map and build an actual pilot workflow",
      "Focus on low-cost, maintainable no-code tools and clear SOP documentation",
      "Strong emphasis on security permissions and human sign-off"
    ],
    potentialDeliverables: [
      "Team Workflow Automation Blueprints & SOP Templates",
      "Working Prototype Pilot Workflows Designed by Staff",
      "Automation Risk & Maintenance Checklist"
    ]
  },
  {
    code: "INST-07",
    slug: "train-the-trainer-programme",
    title: "Train-the-Trainer Programme",
    badge: "Capacity Multiplier",
    iconKey: "presentation",
    shortSummary: "Preparing internal L&D facilitators, corporate AI champions, and university faculty to confidently deliver standardised AI literacy training.",
    overview: "Sustainable institutional capability requires internal capacity\u2014not permanent dependence on external trainers. Our Train-the-Trainer Programme prepares your Learning & Development specialists, senior staff champions, and faculty members with structured curricula, facilitation techniques, and evaluation rubrics to train teams internally.",
    engagementFormat: "Intensive Facilitator Cohort + Teach-Back Evaluation & Curriculum Kit",
    imageUrl: "/src/assets/images/programme_engineering_lab_1794867547072.jpg",
    imageAlt: "Internal trainers and faculty participating in a Train-the-Trainer facilitation cohort",
    whoItIsFor: [
      "Corporate Learning & Development (L&D) and HR training teams",
      "Internal AI champions and departmental mentors",
      "University lecturers and NGO capacity-building officers"
    ],
    scopeOfService: [
      "Mastery of core AI literacy, prompting, and responsible AI concepts",
      "Pedagogical techniques for mixed-skill adult and student audiences",
      "Handling misconceptions, AI scepticism, and ethical classroom debates",
      "Observed practice facilitation (teach-back) with constructive coaching"
    ],
    keyAreas: [
      "Structuring beginner-friendly AI explanations in Bangla & English",
      "Live tool demonstration & troubleshooting techniques",
      "Assessing participant exercises & practical outputs",
      "Embedding AI safety & responsible use in every module",
      "Customising slide decks & case studies per department"
    ],
    deliveryApproach: [
      "Cohort-based experiential training with practice teach-back sessions",
      "Provision of modular facilitator guides and participant handouts",
      "Follow-up coaching clinic after trainers deliver their first internal session"
    ],
    potentialDeliverables: [
      "Standardised Internal Facilitator Guide & Slide Templates",
      "Practical Exercise Bank & Assessment Rubrics",
      "Trainer Readiness Evaluation & Feedback Summary"
    ]
  },
  {
    code: "INST-08",
    slug: "ai-governance-policy-training",
    title: "AI Governance & Policy Training",
    badge: "Risk & Compliance",
    iconKey: "shield-check",
    shortSummary: "Acceptable Use Policy design, data privacy, algorithmic risk, copyright awareness, and institutional AI governance workshops.",
    overview: "Unregulated staff use of public AI tools exposes institutions to data leakage, copyright disputes, biased decisions, and reputational harm. This specialised training equips compliance, legal, HR, IT, and leadership teams to establish clear, enforceable, and practical internal AI governance policies.",
    engagementFormat: "Policy Lab Workshops, Governance Briefings, & Draft Policy Co-Creation",
    imageUrl: "/src/assets/images/programme_governance_forum_1794867547140.jpg",
    imageAlt: "Policy and compliance leaders collaborating in an AI Governance forum",
    whoItIsFor: [
      "Compliance, risk management, legal, and internal audit teams",
      "HR, IT security, and administrative policy committees",
      "University academic boards and NGO safeguarding/compliance leads"
    ],
    scopeOfService: [
      "Mapping institutional AI risks (privacy, IP, bias, hallucination liability)",
      "Alignment with global governance benchmarks (UNESCO, OECD, EU AI Act principles)",
      "Drafting a practical Organisational AI Acceptable Use Policy (AUP)",
      "Establishing human-oversight tiers and incident reporting workflows"
    ],
    keyAreas: [
      "Data classification rules for public vs. enterprise AI tools",
      "Algorithmic bias & fairness reviews in HR/service decisions",
      "Intellectual property, copyright & attribution standards",
      "Third-party AI vendor & procurement risk checklists",
      "Staff communication & realistic policy enforcement"
    ],
    deliveryApproach: [
      "Scenario-based risk table-top exercises tailored to your sector",
      "Guided drafting clinic producing concrete internal policy text",
      "Cross-functional alignment across IT, HR, Legal, and Operations"
    ],
    potentialDeliverables: [
      "Draft Organisational AI Acceptable Use Policy (AUP) Framework",
      "AI Risk Classification & Vendor Review Checklist",
      "Governance Committee Charter & Oversight Protocol"
    ]
  }
];
function getInstitutionalServiceBySlug(slug) {
  const normalized = slug.trim().toLowerCase();
  return INSTITUTIONAL_SERVICES.find(
    (s) => s.slug.toLowerCase() === normalized || s.code.toLowerCase() === normalized
  );
}

// src/data/resourcesData.ts
var RESOURCES = [
  {
    id: "res-ai-literacy-handbook",
    title: "AI Literacy & Foundation Full Curriculum Guide",
    description: "Atlas AI Education-\u098F\u09B0 AI Literacy & Foundation \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF\u09B0 \u09EC\u099F\u09BF \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u09AA\u09C2\u09B0\u09CD\u09A3\u09BE\u0999\u09CD\u0997 \u09B8\u09BF\u09B2\u09C7\u09AC\u09BE\u09B8, \u09AE\u09A1\u09BF\u0989\u09B2 \u0993 \u09B2\u09BE\u09B0\u09CD\u09A8\u09BF\u0982 \u0986\u0989\u099F\u0995\u09BE\u09AE \u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u0964",
    type: "Guide",
    category: "ai-literacy",
    url: "/programmes#ai-literacy"
  },
  {
    id: "res-pd-curriculum-spec",
    title: "Professional Development Programmes Overview (PD-301 to PD-307)",
    description: "\u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0, \u09B2\u09BF\u09A1\u09BE\u09B0\u09B6\u09BF\u09AA, \u09AC\u09BF\u099C\u09A8\u09C7\u09B8 \u09A1\u09C7\u09AD\u09C7\u09B2\u09AA\u09AE\u09C7\u09A8\u09CD\u099F, \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F, \u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F\u09BF\u0982, \u098F\u0987\u099A\u0986\u09B0 \u0993 \u09AB\u09BF\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8 \u0996\u09BE\u09A4\u09C7\u09B0 \u09ED\u099F\u09BF \u09EA-\u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u09AC\u09BF\u09B8\u09CD\u09A4\u09BE\u09B0\u09BF\u09A4 \u09B0\u09C2\u09AA\u09B0\u09C7\u0996\u09BE\u0964",
    type: "Guide",
    category: "professional-development",
    url: "/programmes#professional-development"
  },
  {
    id: "res-womens-safety-charter",
    title: "Women\u2019s Safety in the AI Era: Safeguarding & Participation Guide",
    description: "\u09A1\u09BF\u09AA\u09AB\u09C7\u0995 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4\u0995\u09B0\u09A3, \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u099A\u09C7\u0995\u09B2\u09BF\u09B8\u09CD\u099F \u098F\u09AC\u0982 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u0985\u0982\u09B6\u0997\u09CD\u09B0\u09B9\u09A3\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09C7\u09AB\u0997\u09BE\u09B0\u09CD\u09A1\u09BF\u0982 \u0993 \u09B8\u09B9\u09BE\u09DF\u09A4\u09BE \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09BF\u0995\u09BE\u0964",
    type: "Guide",
    category: "specialised-programmes",
    url: "/programmes/womens-safety-in-the-ai-era"
  },
  {
    id: "res-prompt-toolkit",
    title: "Structured Prompt Architect & Course Matcher Tool",
    description: "\u09AA\u09BE\u09B0\u09B8\u09CB\u09A8\u09BE, \u099F\u09BE\u09B8\u09CD\u0995, \u099F\u09CB\u09A8 \u098F\u09AC\u0982 \u09AB\u09B0\u09AE\u09CD\u09AF\u09BE\u099F \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09A3 \u0995\u09B0\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AD\u09C1\u09B2 \u09AA\u09CD\u09B0\u09AE\u09CD\u09AA\u099F \u09A4\u09C8\u09B0\u09BF\u09B0 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u0985\u09CD\u09AF\u09BE\u0995\u09CD\u099F\u09BF\u09AD \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 \u099F\u09C1\u09B2\u0964",
    type: "Link",
    category: "applied-ai",
    url: "/tools"
  },
  {
    id: "res-unesco-ai-ethics",
    title: "UNESCO Recommendation on the Ethics of Artificial Intelligence",
    description: "\u09A6\u09BE\u09DF\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0, \u09AE\u09BE\u09A8\u09AC\u09BE\u09A7\u09BF\u0995\u09BE\u09B0, \u09B8\u09CD\u09AC\u099A\u09CD\u099B\u09A4\u09BE \u098F\u09AC\u0982 \u09AC\u09C8\u09B6\u09CD\u09AC\u09BF\u0995 AI \u09A8\u09C0\u09A4\u09BF\u09AE\u09BE\u09B2\u09BE\u09B0 \u0986\u09A8\u09CD\u09A4\u09B0\u09CD\u099C\u09BE\u09A4\u09BF\u0995 \u09B0\u09C7\u09AB\u09BE\u09B0\u09C7\u09A8\u09CD\u09B8 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB\u0964",
    type: "Link",
    category: "ai-literacy",
    url: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics"
  },
  {
    id: "res-oecd-ai-principles",
    title: "OECD AI Principles & Responsible Governance Reference",
    description: "\u09AC\u09BF\u09B6\u09CD\u09AC\u09B8\u09CD\u09A4 AI \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE, \u09AE\u09BE\u09A8\u09AC\u09BF\u0995 \u09A4\u09A6\u09BE\u09B0\u0995\u09BF (human-in-the-loop) \u098F\u09AC\u0982 \u099C\u09AC\u09BE\u09AC\u09A6\u09BF\u09B9\u09BF\u09A4\u09BE\u09AE\u09C2\u09B2\u0995 \u0989\u09A6\u09CD\u09AD\u09BE\u09AC\u09A8\u09C7\u09B0 \u09A8\u09C0\u09A4\u09BF\u0997\u09A4 \u0997\u09BE\u0987\u09A1\u0964",
    type: "Link",
    category: "professional-development",
    url: "https://oecd.ai/en/ai-principles"
  },
  {
    id: "res-nist-ai-rmf",
    title: "NIST AI Risk Management Framework (AI RMF 1.0)",
    description: "\u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8 \u0993 \u0995\u09B0\u09CD\u09AE\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 AI-\u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u099D\u09C1\u0981\u0995\u09BF \u09B6\u09A8\u09BE\u0995\u09CD\u09A4\u0995\u09B0\u09A3, \u09AA\u09B0\u09BF\u09AE\u09BE\u09AA \u0993 \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09BE\u09B0\u09BF\u0997\u09B0\u09BF \u0993 \u09AA\u09CD\u09B0\u09B6\u09BE\u09B8\u09A8\u09BF\u0995 \u0997\u09BE\u0987\u09A1\u0964",
    type: "PDF",
    category: "specialised-programmes",
    url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf"
  },
  {
    id: "res-scholarship-policy",
    title: "Course-Based Scholarship Guidelines (Up to 50% Fee Waiver)",
    description: "\u09AA\u09C7\u0987\u09A1 \u0995\u09CB\u09B0\u09CD\u09B8\u09B8\u09AE\u09C2\u09B9\u09C7 \u09AE\u09C7\u09A7\u09BE \u0993 \u09AA\u09CD\u09B0\u09DF\u09CB\u099C\u09A8\u09C7\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u09A4\u09C7 \u09AA\u09CD\u09B0\u09A4\u09BF \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB \u099C\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA \u0986\u09AC\u09C7\u09A6\u09A8\u09C7\u09B0 \u09A8\u09BF\u09DF\u09AE\u09BE\u09AC\u09B2\u09BF\u0964",
    type: "Guide",
    category: "general",
    url: "/scholarships"
  },
  {
    id: "res-certificate-verification",
    title: "Digital Certificate Verification Portal",
    description: "Atlas AI Education \u0995\u09B0\u09CD\u09A4\u09C3\u0995 \u09AA\u09CD\u09B0\u09A6\u09A4\u09CD\u09A4 \u09AF\u09C7\u0995\u09CB\u09A8\u09CB non-accredited completion \u09AC\u09BE participation \u09B8\u09BE\u09B0\u09CD\u099F\u09BF\u09AB\u09BF\u0995\u09C7\u099F\u09C7\u09B0 \u09B8\u09A4\u09CD\u09AF\u09A4\u09BE \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09C1\u09A8\u0964",
    type: "Link",
    category: "general",
    url: "/verify-certificate"
  }
];

// src/shared/siteWideSeo.ts
var FAQ_VERIFIED_ITEMS = [
  {
    q: "Free Masterclass \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7?",
    a: "AI Fundamentals & Digital Literacy \u09B9\u09B2\u09CB \u09AA\u09CD\u09B0\u09A4\u09BF \u09AE\u09BE\u09B8\u09C7 \u0986\u09AF\u09BC\u09CB\u099C\u09BF\u09A4 \u098F\u0995\u099F\u09BF \u0989\u09A8\u09CD\u09AE\u09C1\u0995\u09CD\u09A4 session (\u09AA\u09CD\u09B0\u09BE\u09AF\u09BC \u09E8\u2013\u09E8.\u09EB \u0998\u09A3\u09CD\u099F\u09BE)\u0964 \u098F\u09A4\u09C7 \u0985\u0982\u09B6\u0997\u09CD\u09B0\u09B9\u09A3 \u09AB\u09BF BDT 0, \u09A4\u09AC\u09C7 \u0986\u09B8\u09A8 \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 \u0986\u0997\u09C7 \u09A5\u09C7\u0995\u09C7 Registration \u09B2\u09BE\u0997\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964 \u098F\u099F\u09BF \u0995\u09CB\u09A8\u09CB \u09AA\u09C2\u09B0\u09CD\u09A3\u09BE\u0999\u09CD\u0997 course \u09A8\u09AF\u09BC \u098F\u09AC\u0982 \u098F\u0996\u09BE\u09A8\u09C7 automatic certificate \u09A6\u09C7\u0993\u09AF\u09BC\u09BE \u09B9\u09AF\u09BC \u09A8\u09BE\u0964"
  },
  {
    q: "\u0995\u09CB\u09B0\u09CD\u09B8 \u09AB\u09BF \u0995\u09A4 \u098F\u09AC\u0982 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AF\u09BC?",
    a: "AI Fundamentals & Digital Literacy, AI Governance Fundamentals \u098F\u09AC\u0982 Women\u2019s Safety in the AI Era \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 (FREE)\u0964 AI Literacy & Foundation-\u098F\u09B0 \u0985\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09AF \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE \u09F3999 (\u098F\u09AC\u0982 AI Tools Literacy & Prompt Engineering \u09F31,499), Applied AI-\u098F\u09B0 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u0997\u09C1\u09B2\u09CB \u09F31,200 \u098F\u09AC\u0982 Professional Development \u09AC\u09BF\u09AD\u09BE\u0997\u09C7\u09B0 \u09ED\u099F\u09BF \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF\u09B0 \u09AB\u09BF \u09F32,500\u0964 Paid programme-\u098F \u0986\u09AC\u09C7\u09A6\u09A8 \u09AB\u09B0\u09CD\u09AE \u09AA\u09C2\u09B0\u09A3\u09C7\u09B0 \u09B8\u09AE\u09AF\u09BC +8801601289683 \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 bKash \u0985\u09A5\u09AC\u09BE Nagad Send Money \u0995\u09B0\u09C7 Transaction ID (TrxID) \u099C\u09AE\u09BE \u09A6\u09BF\u09A4\u09C7 \u09B9\u09AF\u09BC; \u09AF\u09BE\u099A\u09BE\u0987\u09AF\u09BC\u09C7\u09B0 \u09B8\u09AE\u09AF\u09BC \u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09BE\u09B8 Pending Verification \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09A5\u09BE\u0995\u09C7\u0964"
  },
  {
    q: "Certificate \u0995\u09BF accredited?",
    a: "\u09A8\u09BE\u0964 Atlas AI Education \u09A5\u09C7\u0995\u09C7 \u09AA\u09CD\u09B0\u09A6\u09A4\u09CD\u09A4 Certificate-\u0997\u09C1\u09B2\u09CB non-accredited\u0964 Paid programme-\u098F \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u0985\u0982\u09B6\u0997\u09CD\u09B0\u09B9\u09A3, \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 assignment \u098F\u09AC\u0982 project \u09AC\u09BE capstone \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8\u09C7\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u09A4\u09C7\u0987 \u098F\u0987 Certificate \u09A6\u09C7\u0993\u09AF\u09BC\u09BE \u09B9\u09AF\u09BC\u0964 Free Masterclass-\u098F automatic certificate \u09A5\u09BE\u0995\u09C7 \u09A8\u09BE\u0964"
  },
  {
    q: "\u099A\u09BE\u0995\u09B0\u09BF \u09AC\u09BE \u0986\u09AF\u09BC\u09C7\u09B0 \u0995\u09CB\u09A8\u09CB \u09A8\u09BF\u09B6\u09CD\u099A\u09AF\u09BC\u09A4\u09BE \u0986\u099B\u09C7 \u0995\u09BF?",
    a: "\u09A8\u09BE\u0964 Atlas AI Education \u099A\u09BE\u0995\u09B0\u09BF, \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09CD\u09A8\u09B6\u09BF\u09AA, \u09AB\u09CD\u09B0\u09BF\u09B2\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8\u09BF\u0982 \u0986\u09AF\u09BC \u09AC\u09BE \u0995\u09CB\u09A8\u09CB \u0995\u09B0\u09CD\u09AE\u09B8\u0982\u09B8\u09CD\u09A5\u09BE\u09A8\u09C7\u09B0 guarantee \u09A6\u09C7\u09AF\u09BC \u09A8\u09BE\u0964 \u0986\u09AE\u09B0\u09BE \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC \u09A6\u0995\u09CD\u09B7\u09A4\u09BE \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09B6\u09C0\u09B2 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B6\u09C7\u0996\u09BE\u09A8\u09CB\u09B0 \u0993\u09AA\u09B0 \u099C\u09CB\u09B0 \u09A6\u09BF\u0987\u0964"
  },
  {
    q: "\u0995\u09CB\u09A8 category \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09BE \u0989\u099A\u09BF\u09A4?",
    a: "\u0986\u09AA\u09A8\u09BF \u09AF\u09A6\u09BF AI-\u09A4\u09C7 \u098F\u0995\u09A6\u09AE \u09A8\u09A4\u09C1\u09A8 \u09B9\u09A8, \u09A4\u09BE\u09B9\u09B2\u09C7 Free Masterclass \u09AC\u09BE AI Literacy & Foundation \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u09A8\u0964 \u09AE\u09CC\u09B2\u09BF\u0995 \u09A7\u09BE\u09B0\u09A3\u09BE \u09A5\u09BE\u0995\u09B2\u09C7 \u098F\u09AC\u0982 project-\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE \u099A\u09BE\u0987\u09B2\u09C7 Applied AI \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964 \u0986\u09B0 \u09AF\u09A6\u09BF \u09A6\u09B2 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE, \u09AC\u09CD\u09AF\u09AC\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8\u09BE \u09AC\u09BE \u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u09B8\u09BF\u09A6\u09CD\u09A7\u09BE\u09A8\u09CD\u09A4\u09C7 AI \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8, \u09A4\u09BE\u09B9\u09B2\u09C7 Professional Development \u0989\u09AA\u09AF\u09CB\u0997\u09C0 \u09B9\u09AC\u09C7\u0964"
  },
  {
    q: "Specialised Programmes \u09AC\u09BF\u09AD\u09BE\u0997\u09C7 \u0995\u09C0 \u0995\u09C0 \u09B0\u09AF\u09BC\u09C7\u099B\u09C7?",
    a: "Specialised Programmes \u09AC\u09BF\u09AD\u09BE\u0997\u09C7 \u09A6\u09C1\u0987\u099F\u09BF \u0985\u0982\u09B6 \u09B0\u09AF\u09BC\u09C7\u099B\u09C7: (\u09E7) Specialised Learning Programmes-\u098F \u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 (FREE) \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09AE\u09C2\u09B2\u0995 \u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF Women\u2019s Safety in the AI Era (SP-WSAI), \u098F\u09AC\u0982 (\u09E8) Institutional Training & Advisory Services-\u098F \u0995\u09CB\u09AE\u09CD\u09AA\u09BE\u09A8\u09BF, \u09B8\u09B0\u0995\u09BE\u09B0\u09BF/\u09AA\u09CD\u09B0\u09BE\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u0985\u09AB\u09BF\u09B8, \u09AC\u09BF\u09B6\u09CD\u09AC\u09AC\u09BF\u09A6\u09CD\u09AF\u09BE\u09B2\u09AF\u09BC \u0993 \u098F\u09A8\u099C\u09BF\u0993-\u0997\u09C1\u09B2\u09CB\u09B0 \u099C\u09A8\u09CD\u09AF \u09EE\u099F\u09BF \u0995\u09BE\u09B8\u09CD\u099F\u09AE \u09AA\u09CD\u09B0\u09B6\u09BF\u0995\u09CD\u09B7\u09A3, AI Readiness Assessment (\u09E9\u099F\u09BF pathway) \u0993 AI Implementation Roadmap \u09B8\u09C7\u09AC\u09BE, \u09AF\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF Consultation \u09AB\u09B0\u09CD\u09AE\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AF\u09BC\u0964"
  },
  {
    q: "Scholarship \u09AC\u09BE \u0986\u09B0\u09CD\u09A5\u09BF\u0995 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u0986\u099B\u09C7 \u0995\u09BF?",
    a: "\u09B9\u09CD\u09AF\u09BE\u0981\u0964 Atlas AI Education-\u098F\u09B0 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 Learning Programmes-\u098F\u09B0 \u099C\u09A8\u09CD\u09AF Course-Based Scholarship Programme \u099A\u09BE\u09B2\u09C1 \u09B0\u09DF\u09C7\u099B\u09C7\u0964 \u09AA\u09CD\u09B0\u09A4\u09BF \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB \u099C\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 Merit-based \u098F\u09AC\u0982 Need-based \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09DF\u09A8\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 Course Fee Waiver \u09AA\u09C7\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u09A8\u0964 Free Programmes \u099B\u09BE\u09DC\u09BE \u0985\u09A8\u09CD\u09AF \u09B8\u09AC \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 /scholarships \u09AA\u09C7\u099C\u09C7 \u0997\u09BF\u09DF\u09C7 \u0985\u09A8\u09B2\u09BE\u0987\u09A8\u09C7 \u0986\u09AC\u09C7\u09A6\u09A8 \u0995\u09B0\u09BE \u09AF\u09BE\u09DF\u0964"
  }
];
var INSTITUTIONAL_SEO_PROFILES = {
  "employees-ai-training": {
    seoTitle: "Employees AI Training (INST-01) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Role-specific workplace AI training workshops (INST-01) by Atlas AI Education for companies, SMEs, and NGOs covering prompting, verification standards, and data confidentiality.",
    ogTitle: "Employees AI Training (INST-01) \u2013 Atlas AI Education",
    ogDescription: "On-site, live virtual, or hybrid workplace AI training helping corporate, NGO, and administrative teams use AI responsibly and productively.",
    primaryKeyword: "Employees AI Training workshops Bangladesh",
    secondaryKeywords: [
      "Corporate workplace AI training Atlas AI Education",
      "SME and NGO staff AI literacy workshop",
      "Responsible workplace prompting and fact checking",
      "Atlas AI Education INST-01"
    ],
    semanticTopics: [
      "Workplace AI Fluency",
      "Departmental Prompt Workflows",
      "Data Confidentiality in AI Usage",
      "Hallucination Verification Protocols",
      "Employee AI Training Bangladesh"
    ],
    searchIntent: "institutional-b2b-training-consultation",
    serviceType: "Workplace AI Training Workshops"
  },
  "ai-leadership-executive-training": {
    seoTitle: "AI Leadership & Executive Training (INST-02) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Executive AI briefings and strategic workshops (INST-02) by Atlas AI Education covering AI adoption trade-offs, governance oversight, ROI evaluation, and workforce reskilling.",
    ogTitle: "AI Leadership & Executive Training (INST-02) \u2013 Atlas AI Education",
    ogDescription: "Executive roundtables and strategy briefings guiding directors, founders, and senior public-sector leaders on responsible AI transformation and risk oversight.",
    primaryKeyword: "AI Leadership and Executive Training Bangladesh",
    secondaryKeywords: [
      "Executive AI strategy briefing corporate directors",
      "Organisational AI governance and oversight training",
      "Workforce AI change management advisory",
      "Atlas AI Education INST-02"
    ],
    semanticTopics: [
      "Executive AI Strategy",
      "Organisational AI Governance",
      "Build-Buy-Partner Evaluation",
      "Workforce Change Management",
      "AI Risk Oversight"
    ],
    searchIntent: "institutional-executive-advisory-consultation",
    serviceType: "Executive AI Briefings & Leadership Training"
  },
  "university-academic-ai-training": {
    seoTitle: "University & Academic AI Training (INST-03) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Higher education AI workshops (INST-03) by Atlas AI Education for universities, faculty, IQAC units, and students on AI-resilient assessment, research ethics, and academic integrity.",
    ogTitle: "University & Academic AI Training (INST-03) \u2013 Atlas AI Education",
    ogDescription: "Faculty development workshops, departmental seminars, and student bootcamps on ethical research workflows, disclosure standards, and AI-aware coursework.",
    primaryKeyword: "University and Academic AI Training Bangladesh",
    secondaryKeywords: [
      "Higher education AI academic integrity training",
      "Faculty AI-resilient assessment redesign workshop",
      "Ethical AI research and citation guidelines",
      "Atlas AI Education INST-03"
    ],
    semanticTopics: [
      "Academic Integrity and AI Disclosure",
      "AI-Resilient Coursework Design",
      "Ethical Literature Synthesis",
      "Faculty Development Workshops",
      "Student AI Literacy Orientation"
    ],
    searchIntent: "institutional-academic-training-consultation",
    serviceType: "University & Academic AI Workshops"
  },
  "ai-readiness-assessment": {
    seoTitle: "AI Readiness Assessment (INST-04) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Structured AI Readiness Assessment (INST-04) with 3 dedicated diagnostic pathways for Companies, Offices, and Universities\u2014evaluating workflow, skills, data hygiene, and governance.",
    ogTitle: "AI Readiness Assessment (INST-04 \xB7 3 Pathways) \u2013 Atlas AI Education",
    ogDescription: "Multi-pathway AI readiness diagnostics by Atlas AI Education tailored for Companies & Businesses, Institutional Offices, and Universities & Colleges.",
    primaryKeyword: "AI Readiness Assessment institutional diagnostic",
    secondaryKeywords: [
      "Company AI readiness assessment Bangladesh",
      "Government and institutional office AI diagnostic",
      "University academic AI readiness assessment",
      "Atlas AI Education INST-04"
    ],
    semanticTopics: [
      "AI Readiness Diagnostic",
      "Workflow Bottleneck Audit",
      "Organisational Data Hygiene",
      "University AI Readiness Pathway",
      "Governance Maturity Assessment"
    ],
    searchIntent: "institutional-assessment-advisory-consultation",
    serviceType: "Organisational AI Readiness Assessment"
  },
  "ai-implementation-roadmap": {
    seoTitle: "AI Implementation Roadmap (INST-05) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Phased AI Implementation Roadmap advisory (INST-05) tailored across 4 sectors\u2014Companies & Businesses, Government Offices, Universities, and NGOs\u2014with 90-day pilot scoping and governance.",
    ogTitle: "AI Implementation Roadmap (INST-05 \xB7 Multi-Sector) \u2013 Atlas AI Education",
    ogDescription: "Structured AI adoption roadmaps covering pilot selection, human-in-the-loop governance, capability sequencing, and operational guardrails for organisations.",
    primaryKeyword: "AI Implementation Roadmap advisory Bangladesh",
    secondaryKeywords: [
      "Enterprise SME AI implementation roadmap",
      "NGO and public office AI adoption planning",
      "Phased AI pilot and governance roadmap",
      "Atlas AI Education INST-05"
    ],
    semanticTopics: [
      "Phased AI Implementation Strategy",
      "90-Day Pilot Scoping",
      "Human-in-the-Loop Controls",
      "Public Sector and NGO AI Adoption",
      "Capability Rollout Planning"
    ],
    searchIntent: "institutional-roadmap-advisory-consultation",
    serviceType: "Institutional AI Implementation Roadmap Advisory"
  },
  "ai-workflow-automation-training": {
    seoTitle: "AI Workflow & Automation Training (INST-06) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Practical workflow mapping and human-reviewed no-code AI automation training (INST-06) by Atlas AI Education for operations, support, and coordination teams.",
    ogTitle: "AI Workflow & Automation Training (INST-06) \u2013 Atlas AI Education",
    ogDescription: "Hands-on team labs on process auditing, intake routing, AI summarisation pipelines, exception handling, and operational safety boundaries.",
    primaryKeyword: "AI Workflow and Automation Training for teams",
    secondaryKeywords: [
      "No-code institutional AI automation training",
      "Human-in-the-loop workflow auditing workshop",
      "Operations team AI intake routing training",
      "Atlas AI Education INST-06"
    ],
    semanticTopics: [
      "Operational Workflow Auditing",
      "No-Code AI Automation Patterns",
      "Human Review Checkpoints",
      "Intake Classification and Drafting",
      "Automation Risk Controls"
    ],
    searchIntent: "institutional-operations-training-consultation",
    serviceType: "Team AI Workflow & Automation Training"
  },
  "train-the-trainer-programme": {
    seoTitle: "Train-the-Trainer Programme (INST-07) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Capacity-building AI Train-the-Trainer programme (INST-07) preparing internal L&D facilitators, corporate champions, NGO mentors, and university faculty to teach AI internally.",
    ogTitle: "AI Train-the-Trainer Programme (INST-07) \u2013 Atlas AI Education",
    ogDescription: "Master facilitator labs and co-teaching mentorship building self-sustaining internal AI training capability inside companies, universities, and NGOs.",
    primaryKeyword: "AI Train the Trainer programme Bangladesh",
    secondaryKeywords: [
      "Internal L&D AI facilitator certification training",
      "Corporate AI champions enablement programme",
      "NGO and faculty AI facilitation workshops",
      "Atlas AI Education INST-07"
    ],
    semanticTopics: [
      "AI Facilitator Enablement",
      "Instructional Design for AI",
      "Internal Training Toolkit Adaptation",
      "Classroom Safeguarding Standards",
      "Self-Sustaining Organisational AI Capacity"
    ],
    searchIntent: "institutional-capacity-building-consultation",
    serviceType: "Internal AI Train-the-Trainer Capacity Building"
  },
  "ai-governance-policy-training": {
    seoTitle: "AI Governance & Policy Training (INST-08) \u2013 Institutional Services \u2013 Atlas AI Education",
    metaDescription: "Institutional AI Governance & Policy workshops (INST-08) by Atlas AI Education covering Acceptable Use Policies, data classification, procurement due diligence, and incident protocols.",
    ogTitle: "AI Governance & Policy Training (INST-08) \u2013 Atlas AI Education",
    ogDescription: "Practical governance sprints helping legal, compliance, IT, HR, and leadership teams draft workable institutional AI Acceptable Use Policies and review frameworks.",
    primaryKeyword: "AI Governance and Policy Training Bangladesh",
    secondaryKeywords: [
      "Organisational AI Acceptable Use Policy workshop",
      "Institutional data privacy and algorithmic risk training",
      "Vendor AI evaluation and disclosure guidelines",
      "Atlas AI Education INST-08"
    ],
    semanticTopics: [
      "AI Acceptable Use Policy",
      "Data Classification and Confidentiality",
      "Vendor AI Due Diligence",
      "Transparency and Incident Response",
      "Organisational AI Governance"
    ],
    searchIntent: "institutional-governance-compliance-consultation",
    serviceType: "AI Governance & Acceptable Use Policy Training"
  }
};
function discoverSpecialisedCourse() {
  return WOMENS_SAFETY_PROGRAMME;
}
function buildWomensSafetyCourseSeoRecord(course = WOMENS_SAFETY_PROGRAMME, baseUrl = "", options) {
  const canonicalPath = "/programmes/womens-safety-in-the-ai-era";
  const seoTitle = "Women's Safety in the AI Era (SP-WSAI) \u2013 Atlas AI Education";
  const metaDescription = "Free 4-week (8 classes, BDT 0) Women\u2019s Safety in the AI Era programme by Atlas AI Education covering deepfakes, synthetic media, digital privacy, and evidence preservation.";
  const ogTitle = "Women's Safety in the AI Era (FREE Programme) \u2013 Atlas AI Education";
  const ogDescription = "AI \u09AF\u09C1\u0997\u09C7 \u09A8\u09BE\u09B0\u09C0 \u0993 \u09AE\u09C7\u09DF\u09C7\u09A6\u09C7\u09B0 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE: \u09A1\u09BF\u09AA\u09AB\u09C7\u0995 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4\u0995\u09B0\u09A3, \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE, \u09B8\u09BE\u0987\u09AC\u09BE\u09B0 \u09B9\u09DF\u09B0\u09BE\u09A8\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0993 \u09AA\u09CD\u09B0\u09AE\u09BE\u09A3 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3\u09C7 \u09EA \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 \u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF (BDT 0)\u0964";
  const primaryKeyword = "Women's Safety in the AI Era Bangladesh";
  const secondaryKeywords = [
    "AI digital safety training for women and girls",
    "Deepfake and synthetic media awareness course FREE",
    "Online privacy protection cyber harassment defence Bangladesh",
    "Digital evidence preservation and helpline guide",
    "Atlas AI Education SP-WSAI"
  ];
  const semanticTopics = [
    "Digital Footprints and Privacy Hygiene",
    "Deepfake and Image Manipulation Recognition",
    "Voice Cloning and Impersonation Prevention",
    "Account Hardening and Two-Factor Authentication",
    "Online Harassment and Blackmail Defence",
    "Digital Evidence Preservation and Support Channels"
  ];
  const isPublished = options?.isPublished ?? true;
  const indexStatus = options?.indexStatus ?? (isPublished ? "indexed" : "noindex");
  const lastOptimizedAt = options?.lastOptimizedAt || (/* @__PURE__ */ new Date()).toISOString();
  return {
    courseCode: course.code,
    slug: course.slug,
    canonicalPath,
    seoTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage: course.imageUrl,
    ogImageAlt: course.imageAlt,
    primaryKeyword,
    secondaryKeywords,
    semanticTopics,
    searchIntent: "informational-educational-free-registration",
    intendedAudience: course.whoThisCourseIsFor || [],
    learningLevel: course.level || "Beginner / Awareness",
    indexStatus,
    isPublished,
    lastOptimizedAt,
    courseSchema: buildWomensSafetyJsonLd(course, baseUrl, {
      isFull: options?.isFull,
      lastOptimizedAt,
      seoTitle,
      metaDescription
    })
  };
}
function buildWomensSafetyJsonLd(course = WOMENS_SAFETY_PROGRAMME, baseUrl, options) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const canonicalUrl = cleanBase ? `${cleanBase}/programmes/womens-safety-in-the-ai-era` : "/programmes/womens-safety-in-the-ai-era";
  const orgId = cleanBase ? `${cleanBase}/#organization` : "#organization";
  const websiteId = cleanBase ? `${cleanBase}/#website` : "#website";
  const imageUrl = cleanBase ? `${cleanBase}${course.imageUrl}` : course.imageUrl;
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: cleanBase ? `${cleanBase}/` : "/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Programmes",
            item: cleanBase ? `${cleanBase}/programmes` : "/programmes"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Specialised Programmes",
            item: cleanBase ? `${cleanBase}/programmes#specialised-programmes` : "/programmes#specialised-programmes"
          },
          {
            "@type": "ListItem",
            position: 4,
            name: course.title,
            item: canonicalUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: options?.seoTitle || `${course.title} (${course.code}) \u2013 Atlas AI Education`,
        description: options?.metaDescription || course.hook,
        isPartOf: { "@id": websiteId },
        about: { "@id": `${canonicalUrl}#course` },
        primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
        inLanguage: ["bn", "en"],
        ...options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}
      },
      {
        "@type": "Course",
        "@id": `${canonicalUrl}#course`,
        url: canonicalUrl,
        name: course.title,
        alternateName: [
          "AI \u09AF\u09C1\u0997\u09C7 \u09A8\u09BE\u09B0\u09C0 \u0993 \u09AE\u09C7\u09DF\u09C7\u09A6\u09C7\u09B0 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE",
          `${course.code}: ${course.title}`
        ],
        courseCode: course.code,
        description: `${course.hook} ${course.overview}`,
        provider: { "@id": orgId },
        publisher: { "@id": orgId },
        image: imageUrl,
        inLanguage: ["bn", "en"],
        educationalLevel: course.level,
        isAccessibleForFree: true,
        timeRequired: "P4W",
        coursePrerequisites: course.prerequisites || "No prior coding or technical experience required.",
        educationalCredentialAwarded: "Non-accredited Certificate of Participation (subject to session participation and digital self-protection checklist completion)",
        teaches: [...course.learningOutcomes || [], ...course.practicalSkills || []],
        about: (course.keyAreas || []).map((topic) => ({
          "@type": "Thing",
          name: topic
        })),
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "Women, female students, parents, teachers, and community educators",
          audienceType: (course.whoThisCourseIsFor || []).join("; ")
        },
        offers: {
          "@type": "Offer",
          category: "Free Social-Impact Programme",
          price: "0",
          priceCurrency: "BDT",
          availability: options?.isFull ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          url: `${canonicalUrl}#register`
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "P4W",
          inLanguage: ["bn", "en"]
        },
        syllabusSections: (course.modules || []).map((mod) => ({
          "@type": "Syllabus",
          name: `${mod.code}: ${mod.title}`,
          description: mod.topics.join("; ")
        }))
      }
    ]
  };
}
function buildInstitutionalServiceJsonLd(service, baseUrl, options) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const canonicalUrl = cleanBase ? `${cleanBase}/institutional-services/${service.slug}` : `/institutional-services/${service.slug}`;
  const orgId = cleanBase ? `${cleanBase}/#organization` : "#organization";
  const websiteId = cleanBase ? `${cleanBase}/#website` : "#website";
  const imageUrl = cleanBase ? `${cleanBase}${service.imageUrl}` : service.imageUrl;
  const profile = INSTITUTIONAL_SEO_PROFILES[service.slug];
  const catalogItems = [
    ...service.keyAreas.map((area) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: area
      }
    })),
    ...(service.pathways || []).map((pw) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: pw.title,
        description: pw.summary
      }
    })),
    ...(service.sectors || []).map((sec) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: sec.title,
        description: sec.summary
      }
    }))
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: cleanBase ? `${cleanBase}/` : "/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Programmes",
            item: cleanBase ? `${cleanBase}/programmes` : "/programmes"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Specialised Programmes",
            item: cleanBase ? `${cleanBase}/programmes#specialised-programmes` : "/programmes#specialised-programmes"
          },
          {
            "@type": "ListItem",
            position: 4,
            name: service.title,
            item: canonicalUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: options?.seoTitle || profile?.seoTitle || `${service.title} \u2013 Institutional Services \u2013 Atlas AI Education`,
        description: options?.metaDescription || profile?.metaDescription || service.shortSummary,
        isPartOf: { "@id": websiteId },
        about: { "@id": `${canonicalUrl}#service` },
        primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
        inLanguage: ["en", "bn"],
        ...options?.lastOptimizedAt ? { dateModified: options.lastOptimizedAt } : {}
      },
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        url: canonicalUrl,
        name: service.title,
        alternateName: `${service.code}: ${service.title}`,
        serviceType: profile?.serviceType || service.badge,
        description: `${service.shortSummary} ${service.overview}`,
        provider: { "@id": orgId },
        image: imageUrl,
        areaServed: {
          "@type": "Country",
          name: "Bangladesh"
        },
        audience: {
          "@type": "Audience",
          audienceType: service.whoItIsFor.join("; ")
        },
        serviceOutput: service.potentialDeliverables,
        termsOfService: "Tailored institutional scoping following a consultation with your organisation via Atlas AI Education.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${service.title} Scope & Focus Areas`,
          itemListElement: catalogItems
        }
      }
    ]
  };
}
function buildSpecialisedItemListEntity(baseUrl, options) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const path4 = options?.canonicalPath || "/programmes";
  const pageUrl = `${cleanBase}${path4}`;
  const wsaiPublished = options?.wsaiPublished ?? true;
  const entries = [];
  if (wsaiPublished) {
    entries.push({
      name: `${WOMENS_SAFETY_PROGRAMME.title} (${WOMENS_SAFETY_PROGRAMME.code})`,
      url: cleanBase ? `${cleanBase}/programmes/womens-safety-in-the-ai-era` : "/programmes/womens-safety-in-the-ai-era",
      description: WOMENS_SAFETY_PROGRAMME.hook
    });
  }
  for (const srv of INSTITUTIONAL_SERVICES) {
    entries.push({
      name: `${srv.title} (${srv.code})`,
      url: cleanBase ? `${cleanBase}/institutional-services/${srv.slug}` : `/institutional-services/${srv.slug}`,
      description: srv.shortSummary
    });
  }
  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#specialised-itemlist`,
    name: "Specialised Programmes & Institutional AI Services \u2013 Atlas AI Education",
    numberOfItems: entries.length,
    itemListElement: entries.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: item.url,
      description: item.description
    }))
  };
}
function buildSpecialisedCategoryListingJsonLd(baseUrl, options) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const targetPath = options?.canonicalPath || "/programmes";
  const pageUrl = `${cleanBase}${targetPath}`;
  const itemList = buildSpecialisedItemListEntity(cleanBase, {
    canonicalPath: targetPath
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#specialised-breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "Programmes", item: `${cleanBase}/programmes` },
          {
            "@type": "ListItem",
            position: 3,
            name: "Specialised Programmes",
            item: `${cleanBase}/programmes#specialised-programmes`
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#specialised-collection`,
        url: pageUrl,
        name: options?.pageTitle || "Specialised Programmes \u2013 Atlas AI Education",
        description: options?.pageDescription || "Free Women's Safety in the AI Era (SP-WSAI) awareness programme and 8 Institutional Training & Advisory Services.",
        isPartOf: { "@id": `${cleanBase}/#website` },
        about: { "@id": `${cleanBase}/#organization` },
        mainEntity: { "@id": `${pageUrl}#specialised-itemlist` },
        inLanguage: ["bn", "en"]
      },
      itemList
    ]
  };
}
function buildHomeJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const homeUrl = cleanBase ? `${cleanBase}/` : "/";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...buildWebsiteEntity(cleanBase),
        inLanguage: ["bn", "en"]
      },
      {
        ...buildOrganizationEntity(cleanBase),
        slogan: "Understand AI. Apply AI. Advance Responsibly",
        description: "Atlas AI Education is an education initiative of Atlas AI Institute delivering structured AI Literacy & Foundation, Applied AI, Professional Development, Specialised Digital Safety (FREE), and Institutional Advisory Services.",
        knowsAbout: [
          "Artificial Intelligence Literacy",
          "Generative AI and Prompt Engineering",
          "Applied AI Workflows and Automation",
          "Responsible AI Governance",
          "Workplace and Leadership AI Strategy",
          "Women's Digital Safety in the AI Era"
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: "Atlas AI Education \u2013 Understand AI. Apply AI. Advance Responsibly",
        description: "AI \u09AC\u09C1\u099D\u09C1\u09A8\u0964 \u0995\u09BE\u099C\u09C7 \u09B2\u09BE\u0997\u09BE\u09A8\u0964 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC \u09A8\u09BF\u09AF\u09BC\u09C7 \u098F\u0997\u09CB\u09A8\u0964 Atlas AI Institute-\u098F\u09B0 education initiative \u2014 \u09E7\u09EE\u099F\u09BF programme, Free Monthly Masterclass, Free Digital Safety \u0993 Institutional Services\u0964",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        about: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: cleanBase ? `${cleanBase}/src/assets/images/hero_atlas_institute_1794867545953.jpg` : "/src/assets/images/hero_atlas_institute_1794867545953.jpg"
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Atlas AI Education Programme Categories",
          numberOfItems: COURSE_CATEGORIES.length,
          itemListElement: COURSE_CATEGORIES.map((cat, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: cat.title,
            description: `${cat.levelLabel} (${cat.feeRange}) \u2014 ${cat.shortDescription}`,
            url: `${cleanBase}/programmes#${cat.slug}`
          }))
        },
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildAboutJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}/about` : "/about";
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "About", item: pageUrl }
        ]
      },
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "About \u2013 Atlas AI Education (Atlas AI Institute)",
        description: "An AI-literate, capable and responsible society \u2014 Atlas AI Education-\u098F\u09B0 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF, \u099B\u09AF\u09BC\u099F\u09BF \u0989\u09A6\u09CD\u09A6\u09C7\u09B6\u09CD\u09AF, \u09B6\u09BF\u0995\u09CD\u09B7\u09A3 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF \u0993 \u09ED\u099F\u09BF \u09A8\u09C0\u09A4\u09BF\u0997\u09A4 \u0985\u0999\u09CD\u0997\u09C0\u0995\u09BE\u09B0\u0964",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        mainEntity: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildContactJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}/contact` : "/contact";
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "Contact", item: pageUrl }
        ]
      },
      {
        "@type": "ContactPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Contact \u2013 Atlas AI Education",
        description: "Contact Atlas AI Education for inquiries on Foundation, Applied AI, Professional Development courses, Free Monthly Masterclass, scholarships, or institutional training.",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        mainEntity: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildFaqJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}/faq` : "/faq";
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "FAQ", item: pageUrl }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faqpage`,
        url: pageUrl,
        name: "Frequently Asked Questions (FAQ) \u2013 Atlas AI Education",
        description: "Answers to common questions about Free Masterclass, course fees (FREE & BDT 999\u20132,500), bKash/Nagad Send Money, non-accredited certificates, and Course-Based Scholarships.",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        about: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        mainEntity: FAQ_VERIFIED_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a
          }
        })),
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildScholarshipsJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}/scholarships` : "/scholarships";
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "Scholarships", item: pageUrl }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Course-Based Scholarships (Up to 50% Fee Waiver) \u2013 Atlas AI Education",
        description: "Atlas AI Education provides merit-based and need-based course fee waivers (up to 50% waiver, maximum 5 scholars per paid course) on eligible paid AI programmes.",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        about: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildResourcesJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}/resources` : "/resources";
  const publicItems = RESOURCES.map((res, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "CreativeWork",
      name: res.title,
      description: res.description,
      learningResourceType: res.type,
      isAccessibleForFree: true,
      url: res.url.startsWith("http") ? res.url : `${cleanBase}${res.url}`
    }
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "Resources", item: pageUrl }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: "AI Learning Resource & Guide Library \u2013 Atlas AI Education",
        description: "Curated AI ethics & governance references (UNESCO, OECD, NIST AI RMF), curriculum guides, scholarship policy guide, and member-gated eBook & industry prompt library overview.",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        about: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        mainEntity: {
          "@type": "ItemList",
          name: "Public Curated AI Learning Guides & Global Ethics References",
          numberOfItems: publicItems.length,
          itemListElement: publicItems
        },
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildToolsJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}/tools` : "/tools";
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "Tools", item: pageUrl }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Interactive AI Learning Tools & Course Matcher \u2013 Atlas AI Education",
        description: "Free online AI practice utilities from Atlas AI Education: Structured Prompt Architect and AI Programme Course Match Finder.",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        about: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: 2,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "SoftwareApplication",
                name: "Structured Prompt Architect",
                applicationCategory: "EducationalApplication",
                operatingSystem: "Web Browser",
                isAccessibleForFree: true,
                description: "Create structured AI prompts using persona, specific task objective, tone, and output format.",
                provider: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" }
              }
            },
            {
              "@type": "ListItem",
              position: 2,
              item: {
                "@type": "SoftwareApplication",
                name: "AI Programme Course Match Finder",
                applicationCategory: "EducationalApplication",
                operatingSystem: "Web Browser",
                isAccessibleForFree: true,
                description: "Interactive utility helping learners select an AI Foundation, Applied AI, Professional Development, or Specialised programme.",
                provider: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" }
              }
            }
          ]
        },
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildVerifyCertificateJsonLd(baseUrl) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}/verify-certificate` : "/verify-certificate";
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: "Verify Certificate", item: pageUrl }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Verify Certificate \u2013 Atlas AI Education",
        description: "Verify the authenticity of non-accredited completion and participation certificates issued by Atlas AI Education by entering a Certificate ID.",
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        about: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        inLanguage: ["en", "bn"]
      }
    ]
  };
}
function buildLegalOrDirectoryJsonLd(baseUrl, opts) {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, "") : "";
  const pageUrl = cleanBase ? `${cleanBase}${opts.routePath}` : opts.routePath;
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebsiteEntity(cleanBase),
      buildOrganizationEntity(cleanBase),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${cleanBase}/` },
          { "@type": "ListItem", position: 2, name: opts.breadcrumbLabel, item: pageUrl }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: opts.pageTitle,
        description: opts.description,
        isPartOf: { "@id": cleanBase ? `${cleanBase}/#website` : "#website" },
        about: { "@id": cleanBase ? `${cleanBase}/#organization` : "#organization" },
        inLanguage: ["bn", "en"]
      }
    ]
  };
}
function buildAllSitePageSeoRecords(baseUrl = "", now = (/* @__PURE__ */ new Date()).toISOString()) {
  const records = [
    {
      routePath: "/",
      canonicalPath: "/",
      pageType: "main",
      pageTitle: "Atlas AI Education \u2013 Home",
      seoTitle: "Atlas AI Education \u2013 Atlas AI Institute | Understand AI. Apply AI. Advance Responsibly",
      metaDescription: "AI \u09AC\u09C1\u099D\u09C1\u09A8\u0964 \u0995\u09BE\u099C\u09C7 \u09B2\u09BE\u0997\u09BE\u09A8\u0964 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC \u09A8\u09BF\u09AF\u09BC\u09C7 \u098F\u0997\u09CB\u09A8\u0964 Atlas AI Institute-\u098F\u09B0 education initiative \u2014 \u09E7\u09EE\u099F\u09BF programme (FREE \u0993 BDT 999\u20132,500), \u09AA\u09CD\u09B0\u09A4\u09BF \u09AE\u09BE\u09B8\u09C7\u09B0 Free Masterclass \u0993 Institutional Services\u0964",
      ogTitle: "Atlas AI Education \u2013 Atlas AI Institute",
      ogDescription: "\u09E7\u09EE\u099F\u09BF structured AI learning programme \u2014 AI Literacy & Foundation, Applied AI, Professional Development, Free Women\u2019s Digital Safety \u0993 Institutional Services\u0964",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "Atlas AI Education \u2013 An Education Initiative of Atlas AI Institute",
      primaryKeyword: "Atlas AI Education Bangladesh",
      secondaryKeywords: [
        "Atlas AI Institute education initiative",
        "AI courses Bangladesh Bangla English",
        "Free AI Masterclass Bangladesh",
        "Responsible AI education platform"
      ],
      semanticTopics: [
        "AI Literacy & Foundation",
        "Applied AI Practical Skills",
        "AI Professional Development",
        "Women's Digital Safety in the AI Era",
        "Free Monthly AI Masterclass",
        "Institutional AI Training & Advisory"
      ],
      searchIntent: "navigational-informational-education-platform",
      schemaType: "WebSite,EducationalOrganization,WebPage",
      schemaJson: buildHomeJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/about",
      canonicalPath: "/about",
      pageType: "main",
      pageTitle: "About \u2013 Atlas AI Education",
      seoTitle: "About Atlas AI Education \u2013 Mission, Methodology & Ethics \u2013 Atlas AI Institute",
      metaDescription: "Atlas AI Education \u0995\u09C0 \u0993 \u0995\u09C7\u09A8 \u2014 Atlas AI Institute-\u098F\u09B0 research-\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 AI \u09B6\u09BF\u0995\u09CD\u09B7\u09BE \u0989\u09A6\u09CD\u09AF\u09CB\u0997\u09C7\u09B0 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF, \u09EC\u099F\u09BF \u0989\u09A6\u09CD\u09A6\u09C7\u09B6\u09CD\u09AF, \u09B6\u09BF\u0995\u09CD\u09B7\u09A3 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF \u0993 \u09ED\u099F\u09BF \u09A8\u09C8\u09A4\u09BF\u0995 \u0985\u0999\u09CD\u0997\u09C0\u0995\u09BE\u09B0\u0964",
      ogTitle: "About Atlas AI Education \u2013 Atlas AI Institute",
      ogDescription: "An AI-literate, capable and responsible society \u2014 \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0 \u09A6\u09B0\u09CD\u09B6\u09A8, \u09B8\u09CD\u09AC\u099A\u09CD\u099B \u09AB\u09BF \u0995\u09BE\u09A0\u09BE\u09AE\u09CB \u098F\u09AC\u0982 non-accredited certification \u09A8\u09C0\u09A4\u09BF\u0964",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "About Atlas AI Education learning method and ethical principles",
      primaryKeyword: "About Atlas AI Education",
      secondaryKeywords: [
        "Atlas AI Institute AI literacy mission",
        "Responsible AI training principles Bangladesh",
        "Project-based bilingual AI learning method"
      ],
      semanticTopics: [
        "AI Literacy Vision",
        "Academic Integrity",
        "Transparency and Honest Certification",
        "Responsible AI Education"
      ],
      searchIntent: "informational-organization-about",
      schemaType: "AboutPage",
      schemaJson: buildAboutJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/programmes",
      canonicalPath: "/programmes",
      pageType: "category",
      pageTitle: "Explore Our Programmes",
      seoTitle: "Explore Our Programmes (18 AI Courses & Institutional Services) \u2013 Atlas AI Education",
      metaDescription: "Explore 18 structured AI programmes across Foundation (FREE\u2013\u09F31,499), Applied AI (\u09F31,200), Professional Development (\u09F32,500), Free Women\u2019s Safety & 8 Institutional Services.",
      ogTitle: "All AI Programmes & Institutional Services \u2013 Atlas AI Education",
      ogDescription: "Compare all 18 bilingual AI courses and 8 institutional advisory programmes across AI Literacy, Applied AI, Professional Development, and Specialised tracks.",
      ogImage: "/src/assets/images/programme_ai_literacy_1794867547641.jpg",
      ogImageAlt: "Atlas AI Education Full Programmes Directory",
      primaryKeyword: "Atlas AI Education programmes catalogue",
      secondaryKeywords: [
        "AI Literacy and Foundation courses Bangladesh",
        "Applied AI and Professional Development courses",
        "Specialised AI programmes and corporate training"
      ],
      semanticTopics: [
        "Foundation AI Literacy",
        "Applied AI",
        "Professional Development",
        "Specialised Programmes",
        "Institutional Training Services"
      ],
      searchIntent: "commercial-educational-catalogue",
      schemaType: "CollectionPage",
      schemaJson: buildSpecialisedCategoryListingJsonLd(baseUrl, { canonicalPath: "/programmes" }),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/free-masterclass",
      canonicalPath: "/free-masterclass",
      pageType: "programme",
      pageTitle: "Free Masterclass Registration",
      seoTitle: "Free Monthly AI Masterclass Registration (BDT 0) \u2013 Atlas AI Education",
      metaDescription: "AI Fundamentals & Digital Literacy: \u09AA\u09CD\u09B0\u09A4\u09BF \u09AE\u09BE\u09B8\u09C7 \u09E7\u099F\u09BE live open session (\u09E8\u2013\u09E8.\u09EB \u0998\u09A3\u09CD\u099F\u09BE, \u09AB\u09BF FREE / BDT 0)\u0964 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 session-\u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 Register \u0995\u09B0\u09C1\u09A8\u0964",
      ogTitle: "Free Monthly AI Masterclass (BDT 0) \u2013 Atlas AI Education",
      ogDescription: "Join our monthly 2\u20132.5 hour open session introducing Artificial Intelligence, how models learn, and responsible everyday use (FREE / BDT 0).",
      ogImage: "/src/assets/images/course_ai_literacy_session_1794924850721.jpg",
      ogImageAlt: "Free Monthly AI Fundamentals & Digital Literacy Masterclass",
      primaryKeyword: "Free AI Masterclass Bangladesh",
      secondaryKeywords: [
        "AI Fundamentals and Digital Literacy FREE",
        "Monthly free online AI open session",
        "Atlas AI Education free registration"
      ],
      semanticTopics: [
        "Free AI Masterclass",
        "Digital Literacy Open Session",
        "Beginner AI Introduction"
      ],
      searchIntent: "informational-free-event-registration",
      schemaType: "EducationEvent,Course",
      schemaJson: { note: "Generated dynamically via buildFreeMasterclassJsonLd" },
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/resources",
      canonicalPath: "/resources",
      pageType: "utility",
      pageTitle: "Resources & Prompt Library Overview",
      seoTitle: "AI Learning Resources, Guides & Global Ethics References \u2013 Atlas AI Education",
      metaDescription: "Access curriculum handbooks, UNESCO/OECD/NIST AI governance references, Women\u2019s Safety guide, scholarship guidelines, and member eBook & industry prompt library overview.",
      ogTitle: "AI Learning Resource & Guide Library \u2013 Atlas AI Education",
      ogDescription: "Explore curated bilingual AI guides, international AI governance references (UNESCO, OECD, NIST), and Atlas AI Education member learning libraries.",
      ogImage: "/src/assets/images/ebook_cover_ai_basics_1794934415808.jpg",
      ogImageAlt: "Atlas AI Education Learning Resources & Curated Guides",
      primaryKeyword: "AI learning guides and responsible AI resources Bangladesh",
      secondaryKeywords: [
        "UNESCO OECD NIST AI governance references",
        "AI literacy curriculum handbook Bangladesh",
        "Atlas AI Education resources library"
      ],
      semanticTopics: [
        "AI Curriculum Guides",
        "UNESCO AI Ethics Recommendation",
        "OECD AI Principles",
        "NIST AI Risk Management Framework",
        "Safeguarding and Scholarship Guides"
      ],
      searchIntent: "informational-educational-resources",
      schemaType: "CollectionPage",
      schemaJson: buildResourcesJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/tools",
      canonicalPath: "/tools",
      pageType: "utility",
      pageTitle: "Interactive AI Learning Tools",
      seoTitle: "Interactive AI Prompt Architect & Course Matcher Tools \u2013 Atlas AI Education",
      metaDescription: "Free interactive AI learning tools from Atlas AI Education: build structured prompts with the Structured Prompt Architect and find your track with Course Match Finder.",
      ogTitle: "Interactive AI Practice Tools & Course Matcher \u2013 Atlas AI Education",
      ogDescription: "Practice structured prompting (Persona, Task, Tone, Format) and match your goals to Foundation, Applied AI, or Professional Development programmes.",
      ogImage: "/src/assets/images/course_prompt_engineering_1794924782953.jpg",
      ogImageAlt: "Structured Prompt Architect and AI Course Match Finder",
      primaryKeyword: "Interactive AI Prompt Builder and Course Matcher",
      secondaryKeywords: [
        "Structured Prompt Architect tool free",
        "AI course finder Atlas AI Education",
        "Prompt engineering practice utility"
      ],
      semanticTopics: [
        "Structured Prompt Engineering",
        "AI Role and Persona Prompting",
        "AI Course Recommendation Tool"
      ],
      searchIntent: "interactive-educational-utility",
      schemaType: "WebPage,SoftwareApplication",
      schemaJson: buildToolsJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/scholarships",
      canonicalPath: "/scholarships",
      pageType: "main",
      pageTitle: "Scholarships & Financial Assistance",
      seoTitle: "Course-Based Scholarships (Up to 50% Fee Waiver) \u2013 Atlas AI Education",
      metaDescription: "Apply for Atlas AI Education Course-Based Scholarships: up to 50% fee waiver on paid AI courses for up to 5 learners per course through merit and need-based evaluation.",
      ogTitle: "Course-Based AI Scholarships (Up to 50% Waiver) \u2013 Atlas AI Education",
      ogDescription: "Merit- and need-based fee waiver programme supporting learners across Foundation, Applied AI, and Professional Development paid courses (max 5 seats per course).",
      ogImage: "/src/assets/images/programme_ai_literacy_1794867547641.jpg",
      ogImageAlt: "Atlas AI Education Course-Based Scholarship Programme",
      primaryKeyword: "Atlas AI Education course scholarship Bangladesh",
      secondaryKeywords: [
        "AI course fee waiver Bangladesh 50 percent",
        "Merit and need-based AI learning scholarship",
        "Apply for Atlas AI Education scholarship"
      ],
      semanticTopics: [
        "Course-Based Scholarship",
        "Tuition Fee Waiver up to 50%",
        "Merit and Financial Need Evaluation"
      ],
      searchIntent: "informational-scholarship-application",
      schemaType: "WebPage",
      schemaJson: buildScholarshipsJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/verify-certificate",
      canonicalPath: "/verify-certificate",
      pageType: "utility",
      pageTitle: "Verify Certificate",
      seoTitle: "Verify Non-Accredited Certificate Authenticity \u2013 Atlas AI Education",
      metaDescription: "Verify the authenticity of non-accredited completion and participation certificates issued by Atlas AI Education using a unique Certificate ID.",
      ogTitle: "Certificate Verification Portal \u2013 Atlas AI Education",
      ogDescription: "Check official completion and participation certificate records issued by Atlas AI Education (non-accredited assessment-based credentials).",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "Atlas AI Education Certificate Verification Portal",
      primaryKeyword: "Verify Atlas AI Education certificate",
      secondaryKeywords: [
        "Atlas AI certificate authenticity check",
        "Non-accredited AI course certificate verification"
      ],
      semanticTopics: [
        "Certificate Verification",
        "Credential Transparency",
        "Non-Accredited Completion Record"
      ],
      searchIntent: "utility-credential-verification",
      schemaType: "WebPage",
      schemaJson: buildVerifyCertificateJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/faq",
      canonicalPath: "/faq",
      pageType: "main",
      pageTitle: "Frequently Asked Questions (FAQ)",
      seoTitle: "FAQ \u2013 Course Fees, Free Masterclass, Certificates & Scholarships \u2013 Atlas AI Education",
      metaDescription: "Answers on Free Masterclass registration, BDT 0\u20132,500 course fees, bKash/Nagad Send Money, non-accredited certificates, Specialised Programmes, and 50% Scholarships.",
      ogTitle: "Frequently Asked Questions (FAQ) \u2013 Atlas AI Education",
      ogDescription: "Clear answers about Atlas AI Education programmes, payment verification, certification policy, and scholarships.",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "Frequently Asked Questions at Atlas AI Education",
      primaryKeyword: "Atlas AI Education FAQ",
      secondaryKeywords: [
        "Atlas AI Education course fees bKash Nagad",
        "Free AI Masterclass certificate policy FAQ",
        "AI course scholarship eligibility Bangladesh FAQ"
      ],
      semanticTopics: [
        "Free Masterclass Policy",
        "Manual Payment Verification",
        "Non-Accredited Certificates",
        "Course-Based Scholarships",
        "Specialised Programmes"
      ],
      searchIntent: "informational-faq-support",
      schemaType: "FAQPage",
      schemaJson: buildFaqJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/contact",
      canonicalPath: "/contact",
      pageType: "main",
      pageTitle: "Contact Atlas AI Education",
      seoTitle: "Contact Us \u2013 Programme & Institutional Inquiries \u2013 Atlas AI Education",
      metaDescription: "Contact Atlas AI Education regarding Foundation, Applied AI, or Professional Development courses, Free Monthly Masterclasses, or institutional training inquiries.",
      ogTitle: "Contact \u2013 Atlas AI Education",
      ogDescription: "Send an inquiry to the Atlas AI Education team about courses, scholarships, free sessions, or institutional training.",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "Contact Atlas AI Education Team",
      primaryKeyword: "Contact Atlas AI Education",
      secondaryKeywords: [
        "Atlas AI Education inquiry form",
        "Institutional AI training consultation contact"
      ],
      semanticTopics: [
        "Learner Support Inquiry",
        "Institutional Consultation Contact"
      ],
      searchIntent: "navigational-contact",
      schemaType: "ContactPage",
      schemaJson: buildContactJsonLd(baseUrl),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/privacy",
      canonicalPath: "/privacy",
      pageType: "legal",
      pageTitle: "Privacy Policy",
      seoTitle: "Privacy Policy & Data Protection \u2013 Atlas AI Education",
      metaDescription: "Atlas AI Education privacy policy detailing how learner account details, enrolment applications, scholarship submissions, and uploaded materials are protected.",
      ogTitle: "Privacy Policy \u2013 Atlas AI Education",
      ogDescription: "Learn how Atlas AI Education handles personal data, educational records, and safeguarding privacy protections.",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "Atlas AI Education Privacy Policy",
      primaryKeyword: "Atlas AI Education privacy policy",
      secondaryKeywords: ["Learner data protection Atlas AI Education"],
      semanticTopics: ["Data Privacy", "Learner Data Protection", "Safeguarding"],
      searchIntent: "informational-legal-policy",
      schemaType: "WebPage",
      schemaJson: buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: "/privacy",
        breadcrumbLabel: "Privacy Policy",
        pageTitle: "Privacy Policy & Data Protection \u2013 Atlas AI Education",
        description: "Atlas AI Education privacy policy detailing learner data protection, safeguarding, and application confidentiality."
      }),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/terms",
      canonicalPath: "/terms",
      pageType: "legal",
      pageTitle: "Terms & Conditions",
      seoTitle: "Terms & Conditions \u2013 Non-Accredited Policy & Transparency \u2013 Atlas AI Education",
      metaDescription: "Atlas AI Education Terms & Conditions covering non-accredited programmes, transparent tuition & assessment rules, and zero job or income guarantees.",
      ogTitle: "Terms & Conditions \u2013 Atlas AI Education",
      ogDescription: "Review Atlas AI Education terms of enrolment, non-accredited certification disclosures, and academic integrity commitments.",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "Atlas AI Education Terms and Conditions",
      primaryKeyword: "Atlas AI Education terms and conditions",
      secondaryKeywords: ["Non-accredited AI education transparency policy"],
      semanticTopics: ["Terms of Enrolment", "Non-Accredited Disclosure", "Academic Integrity"],
      searchIntent: "informational-legal-terms",
      schemaType: "WebPage",
      schemaJson: buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: "/terms",
        breadcrumbLabel: "Terms & Conditions",
        pageTitle: "Terms & Conditions \u2013 Atlas AI Education",
        description: "Non-accredited programme policy, fee transparency, and participation conditions for Atlas AI Education."
      }),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    },
    {
      routePath: "/sitemap",
      canonicalPath: "/sitemap",
      pageType: "utility",
      pageTitle: "Website Sitemap",
      seoTitle: "HTML Sitemap \u2013 All Pages, 18 Programmes & 8 Institutional Services \u2013 Atlas AI Education",
      metaDescription: "Browse the complete directory of Atlas AI Education pages, 4 programme categories, 18 AI courses, and 8 institutional training & advisory services.",
      ogTitle: "Sitemap \u2013 Atlas AI Education",
      ogDescription: "Complete directory of Atlas AI Education public pages, 18 programmes, and institutional AI services.",
      ogImage: "/src/assets/images/hero_atlas_institute_1794867545953.jpg",
      ogImageAlt: "Atlas AI Education Website Sitemap",
      primaryKeyword: "Atlas AI Education sitemap",
      secondaryKeywords: ["Atlas AI Education full programme directory"],
      semanticTopics: ["Website Directory", "AI Programmes List", "Institutional Services Index"],
      searchIntent: "navigational-directory",
      schemaType: "WebPage",
      schemaJson: buildLegalOrDirectoryJsonLd(baseUrl, {
        routePath: "/sitemap",
        breadcrumbLabel: "Sitemap",
        pageTitle: "HTML Sitemap \u2013 Atlas AI Education",
        description: "Directory of all public pages, programme categories, 18 courses, and 8 institutional advisory services."
      }),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    }
  ];
  for (const service of INSTITUTIONAL_SERVICES) {
    const profile = INSTITUTIONAL_SEO_PROFILES[service.slug];
    const seoTitle = profile?.seoTitle || `${service.title} (${service.code}) \u2013 Institutional Services \u2013 Atlas AI Education`;
    const metaDescription = profile?.metaDescription || service.shortSummary;
    const ogTitle = profile?.ogTitle || `${service.title} (${service.code}) \u2013 Atlas AI Education`;
    const ogDescription = profile?.ogDescription || service.shortSummary;
    records.push({
      routePath: `/institutional-services/${service.slug}`,
      canonicalPath: `/institutional-services/${service.slug}`,
      pageType: "institutional-service",
      pageTitle: `${service.title} (${service.code})`,
      seoTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage: service.imageUrl,
      ogImageAlt: service.imageAlt,
      primaryKeyword: profile?.primaryKeyword || `${service.title} Atlas AI Education`,
      secondaryKeywords: profile?.secondaryKeywords || [
        `${service.title} Bangladesh`,
        `Atlas AI Education ${service.code}`
      ],
      semanticTopics: profile?.semanticTopics || service.keyAreas,
      searchIntent: profile?.searchIntent || "institutional-b2b-consultation",
      schemaType: "Service",
      schemaJson: buildInstitutionalServiceJsonLd(service, baseUrl, {
        lastOptimizedAt: now,
        seoTitle,
        metaDescription
      }),
      indexStatus: "indexed",
      isPublished: true,
      lastOptimizedAt: now
    });
  }
  return records;
}
function getPageSeoRecordByPath(routePath) {
  const clean = routePath === "/" ? "/" : routePath.replace(/\/+$/, "");
  return buildAllSitePageSeoRecords("").find(
    (r) => r.routePath.toLowerCase() === clean.toLowerCase()
  );
}
function getInstitutionalServiceSeoSummary(service, baseUrl) {
  const profile = INSTITUTIONAL_SEO_PROFILES[service.slug];
  return {
    code: service.code,
    slug: service.slug,
    title: service.title,
    canonicalUrl: `${baseUrl}/institutional-services/${service.slug}`,
    seoTitle: profile?.seoTitle || `${service.title} (${service.code}) \u2013 Institutional Services \u2013 Atlas AI Education`,
    metaDescription: profile?.metaDescription || service.shortSummary,
    ogTitle: profile?.ogTitle || `${service.title} \u2013 Atlas AI Education`,
    ogDescription: profile?.ogDescription || service.shortSummary,
    ogImage: `${baseUrl}${service.imageUrl}`,
    ogImageAlt: service.imageAlt,
    primaryKeyword: profile?.primaryKeyword || service.title,
    secondaryKeywords: profile?.secondaryKeywords || [],
    semanticTopics: profile?.semanticTopics || service.keyAreas,
    searchIntent: profile?.searchIntent || "institutional-consultation",
    serviceSchema: buildInstitutionalServiceJsonLd(service, baseUrl)
  };
}
function getCourseCountSummaryByCategory() {
  return COURSE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    levelLabel: cat.levelLabel,
    feeRange: cat.feeRange,
    courseCount: COURSES.filter((c) => c.categorySlug === cat.slug).length
  }));
}

// src/shared/seoMeta.ts
var SITE_PAGE_REC_MAP = new Map(
  buildAllSitePageSeoRecords("").map((r) => [r.routePath, r])
);
var pageRec = (routePath) => SITE_PAGE_REC_MAP.get(routePath);
var WSAI_REC = buildWomensSafetyCourseSeoRecord(discoverSpecialisedCourse());
var ROUTE_SEO_ENTRIES = [
  {
    path: "/",
    pageSeoRoute: "/",
    authoritativeHead: true,
    title: pageRec("/").seoTitle,
    description: pageRec("/").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/").ogTitle,
    ogDescription: pageRec("/").ogDescription,
    ogImage: pageRec("/").ogImage,
    ogImageAlt: pageRec("/").ogImageAlt,
    keywords: [pageRec("/").primaryKeyword, ...pageRec("/").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildHomeJsonLd(baseUrl)
  },
  {
    path: "/about",
    pageSeoRoute: "/about",
    authoritativeHead: true,
    title: pageRec("/about").seoTitle,
    description: pageRec("/about").metaDescription,
    ogType: "article",
    ogTitle: pageRec("/about").ogTitle,
    ogDescription: pageRec("/about").ogDescription,
    ogImage: pageRec("/about").ogImage,
    ogImageAlt: pageRec("/about").ogImageAlt,
    keywords: [pageRec("/about").primaryKeyword, ...pageRec("/about").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildAboutJsonLd(baseUrl)
  },
  {
    path: "/programmes",
    pageSeoRoute: "/programmes",
    authoritativeHead: true,
    title: "Explore Our Programmes \u2013 Atlas AI Education",
    description: "Build AI knowledge, practical skills and professional capabilities through 18 structured learning programmes across AI Literacy & Foundation, Applied AI, Professional Development, and Specialised Programmes.",
    ogType: "website",
    ogImage: "/src/assets/images/programme_ai_literacy_1794867547641.jpg",
    ogImageAlt: "Atlas AI Education Foundation, Applied AI, Professional & Specialised Programmes",
    keywords: [
      "Atlas AI Education programmes",
      "AI Literacy and Foundation courses Bangladesh",
      "Applied AI Bangladesh",
      "AI Professional Development",
      "Specialised AI Programmes and Institutional Services"
    ],
    jsonLdBuilder: (baseUrl) => {
      const schema = buildFoundationCategoryListingJsonLd(baseUrl, {
        canonicalPath: "/programmes",
        pageTitle: "Explore Our Programmes \u2013 Atlas AI Education",
        pageDescription: "Structured AI learning programmes across AI Literacy & Foundation, Applied AI, Professional Development, and Specialised Programmes."
      });
      const graph = Array.isArray(schema["@graph"]) ? [
        ...schema["@graph"],
        buildAppliedAiItemListEntity(baseUrl, { canonicalPath: "/programmes" }),
        buildProfessionalDevItemListEntity(baseUrl, { canonicalPath: "/programmes" }),
        buildSpecialisedItemListEntity(baseUrl, { canonicalPath: "/programmes" })
      ] : [];
      return { ...schema, "@graph": graph };
    }
  },
  {
    path: "/free-masterclass",
    title: "Free Masterclass Registration \u2013 Atlas AI Education",
    description: "AI Fundamentals & Digital Literacy: \u09AA\u09CD\u09B0\u09A4\u09BF \u09AE\u09BE\u09B8\u09C7 \u09E7\u099F\u09BE live open session (\u09E8\u2013\u09E8.\u09EB \u0998\u09A3\u09CD\u099F\u09BE, \u09AB\u09BF FREE / BDT 0)\u0964 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 session-\u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 Register \u0995\u09B0\u09C1\u09A8\u0964",
    ogType: "website",
    ogImage: "/src/assets/images/course_ai_literacy_session_1794924850721.jpg",
    ogImageAlt: "Free Monthly AI Fundamentals & Digital Literacy Masterclass session",
    keywords: [
      "Free AI Masterclass Bangladesh",
      "AI Fundamentals and Digital Literacy FREE",
      "Atlas AI Education free session"
    ],
    jsonLdBuilder: (baseUrl) => buildFreeMasterclassJsonLd(baseUrl)
  },
  {
    path: "/programmes/ai-literacy",
    canonicalPath: "/programmes",
    excludeFromSitemap: true,
    noindex: true,
    title: "AI Literacy & Foundation \u2013 Atlas AI Education",
    description: "Entry level: AI Fundamentals, Governance, Generative AI & Prompt Engineering, Productivity \u0993 Responsible Use (FREE \xB7 \u09F3999\u2013\u09F31,499)\u0964",
    ogType: "website",
    ogImage: "/src/assets/images/programme_ai_literacy_1794867547641.jpg",
    ogImageAlt: "AI Literacy & Foundation Courses at Atlas AI Education",
    jsonLdBuilder: (baseUrl) => buildFoundationCategoryListingJsonLd(baseUrl, {
      canonicalPath: "/programmes",
      pageTitle: "AI Literacy & Foundation \u2013 Atlas AI Education",
      pageDescription: "Entry level: AI Fundamentals, Governance, Generative AI & Prompt Engineering, Productivity \u0993 Responsible Use (FREE \xB7 \u09F3999\u2013\u09F31,499)\u0964"
    })
  },
  {
    path: "/programmes/applied-ai",
    canonicalPath: "/programmes",
    excludeFromSitemap: true,
    noindex: true,
    title: "Applied AI \u2013 Atlas AI Education",
    description: "Practical Applied AI programmes (4 weeks, BDT 1,200): AI-Powered Content Creation (AP-201), Business & Entrepreneurship (AP-202), Automation & Workflow Design (AP-203), and Website Development (AP-204).",
    ogType: "website",
    ogTitle: "Applied AI Courses \u2013 Atlas AI Education",
    ogDescription: "4 hands-on Applied AI courses (BDT 1,200 each, scholarship eligible) covering Content Creation, Business & Entrepreneurship, No-Code Automation, and AI Website Development.",
    ogImage: "/src/assets/images/programme_engineering_lab_1794867547072.jpg",
    ogImageAlt: "Applied AI Practical Courses at Atlas AI Education",
    keywords: [
      "Applied AI courses Bangladesh",
      "AI-Powered Content Creation AP-201",
      "AI for Business and Entrepreneurship AP-202",
      "AI Automation and Workflow Design AP-203",
      "AI-Powered Website Development AP-204"
    ],
    jsonLdBuilder: (baseUrl) => buildAppliedAiCategoryListingJsonLd(baseUrl, {
      canonicalPath: "/programmes",
      pageTitle: "Applied AI \u2013 Atlas AI Education",
      pageDescription: "Practical Applied AI programmes covering Content Creation, Business & Entrepreneurship, Automation & Workflow Design, and Website Development (BDT 1,200)."
    })
  },
  {
    path: "/programmes/professional-development",
    canonicalPath: "/programmes",
    excludeFromSitemap: true,
    noindex: true,
    title: "Professional Development \u2013 Atlas AI Education",
    description: "7 structured 4-week Professional Development AI courses (BDT 2,500 each): Workplace Productivity (PD-301), Business Development (PD-302), Leadership (PD-303), Project Management (PD-304), Marketing (PD-305), HR (PD-306), and Financial Management (PD-307).",
    ogType: "website",
    ogTitle: "Professional Development AI Courses \u2013 Atlas AI Education",
    ogDescription: "Professional AI tracks (4 weeks, BDT 2,500, scholarship eligible) for corporate, NGO, public-sector professionals, managers, project teams, HR, marketing, and finance practitioners.",
    ogImage: "/src/assets/images/programme_governance_forum_1794867547140.jpg",
    ogImageAlt: "Professional Development AI Programmes at Atlas AI Education",
    keywords: [
      "AI Professional Development Bangladesh",
      "AI for Workplace Productivity PD-301",
      "AI for Business Development PD-302",
      "AI Leadership and Strategic Management PD-303",
      "AI for Project Marketing HR and Finance"
    ],
    jsonLdBuilder: (baseUrl) => buildProfessionalDevCategoryListingJsonLd(baseUrl, {
      canonicalPath: "/programmes",
      pageTitle: "Professional Development \u2013 Atlas AI Education",
      pageDescription: "7 structured 4-week Professional Development AI courses across workplace productivity, business development, leadership, project, marketing, HR, and finance (BDT 2,500)."
    })
  },
  {
    path: "/programmes/specialised-programmes",
    canonicalPath: "/programmes",
    excludeFromSitemap: true,
    noindex: true,
    authoritativeHead: true,
    title: "Specialised Programmes \u2013 Atlas AI Education",
    description: "Women's Safety in the AI Era (FREE \xB7 4 Weeks) \u098F\u09AC\u0982 \u0995\u09CB\u09AE\u09CD\u09AA\u09BE\u09A8\u09BF, \u0985\u09AB\u09BF\u09B8, \u09AC\u09BF\u09B6\u09CD\u09AC\u09AC\u09BF\u09A6\u09CD\u09AF\u09BE\u09B2\u09AF\u09BC \u0993 \u098F\u09A8\u099C\u09BF\u0993-\u0997\u09C1\u09B2\u09CB\u09B0 \u099C\u09A8\u09CD\u09AF \u09EE\u099F\u09BF Institutional Training & Advisory Services\u0964",
    ogType: "website",
    ogTitle: "Specialised Programmes & Institutional AI Services \u2013 Atlas AI Education",
    ogDescription: "Free Women's Safety in the AI Era awareness programme (BDT 0) and 8 institutional AI training, readiness assessment, and roadmap advisory services.",
    ogImage: "/src/assets/images/course_womens_digital_safety_1794926670102.jpg",
    ogImageAlt: "Specialised AI Programmes & Institutional Services at Atlas AI Education",
    keywords: [
      "Women's Safety in the AI Era",
      "Institutional AI training Bangladesh",
      "AI Readiness Assessment and Implementation Roadmap"
    ],
    jsonLdBuilder: (baseUrl) => buildSpecialisedCategoryListingJsonLd(baseUrl, {
      canonicalPath: "/programmes",
      pageTitle: "Specialised Programmes \u2013 Atlas AI Education",
      pageDescription: "Women's Safety in the AI Era (FREE) \u098F\u09AC\u0982 \u09EE\u099F\u09BF Institutional Training & Advisory Services\u0964"
    })
  },
  {
    path: "/programmes/womens-safety-in-the-ai-era",
    specialisedCourseCode: "SP-WSAI",
    authoritativeHead: true,
    title: WSAI_REC.seoTitle,
    description: WSAI_REC.metaDescription,
    ogType: "article",
    ogTitle: WSAI_REC.ogTitle,
    ogDescription: WSAI_REC.ogDescription,
    ogImage: WSAI_REC.ogImage,
    ogImageAlt: WSAI_REC.ogImageAlt,
    keywords: [WSAI_REC.primaryKeyword, ...WSAI_REC.secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildWomensSafetyJsonLd(discoverSpecialisedCourse(), baseUrl, {
      seoTitle: WSAI_REC.seoTitle,
      metaDescription: WSAI_REC.metaDescription
    })
  },
  {
    path: "/programmes/SP-WSAI",
    canonicalPath: "/programmes/womens-safety-in-the-ai-era",
    excludeFromSitemap: true,
    noindex: true,
    specialisedCourseCode: "SP-WSAI",
    authoritativeHead: true,
    title: WSAI_REC.seoTitle,
    description: WSAI_REC.metaDescription,
    ogType: "article",
    ogTitle: WSAI_REC.ogTitle,
    ogDescription: WSAI_REC.ogDescription,
    ogImage: WSAI_REC.ogImage,
    ogImageAlt: WSAI_REC.ogImageAlt,
    keywords: [WSAI_REC.primaryKeyword, ...WSAI_REC.secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildWomensSafetyJsonLd(discoverSpecialisedCourse(), baseUrl, {
      seoTitle: WSAI_REC.seoTitle,
      metaDescription: WSAI_REC.metaDescription
    })
  },
  // Primary Code-Based Course Detail Routes (/programmes/:code) — Dynamically Generated for All Foundation Courses
  ...discoverFoundationCourses().map((course) => {
    const rec = buildFoundationCourseSeoRecord(course);
    return {
      path: rec.canonicalPath,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: "article",
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      foundationCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) => buildFoundationCourseJsonLd(course, baseUrl, {
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription
      })
    };
  }),
  // Category 2: Applied AI — Dynamically Generated for All Applied AI Courses
  ...discoverAppliedAiCourses().map((course) => {
    const rec = buildAppliedAiCourseSeoRecord(course);
    return {
      path: rec.canonicalPath,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: "article",
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      appliedAiCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) => buildAppliedAiCourseJsonLd(course, baseUrl, {
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription
      })
    };
  }),
  // Category 3: Professional Development — Dynamically Generated for All Professional Development Courses
  ...discoverProfessionalDevCourses().map((course) => {
    const rec = buildProfessionalDevCourseSeoRecord(course);
    return {
      path: rec.canonicalPath,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: "article",
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      professionalDevCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) => buildProfessionalDevCourseJsonLd(course, baseUrl, {
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription
      })
    };
  }),
  // Supporting Foundation Slug Aliases (excluded from sitemap, noindex + canonicalized to code route)
  ...discoverFoundationCourses().map((course) => {
    const rec = buildFoundationCourseSeoRecord(course);
    return {
      path: `/programmes/${course.slug}`,
      canonicalPath: rec.canonicalPath,
      excludeFromSitemap: true,
      noindex: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: "article",
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      foundationCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) => buildFoundationCourseJsonLd(course, baseUrl, {
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription
      })
    };
  }),
  // Supporting Applied AI Slug Aliases (excluded from sitemap, noindex + canonicalized to code route)
  ...discoverAppliedAiCourses().map((course) => {
    const rec = buildAppliedAiCourseSeoRecord(course);
    return {
      path: `/programmes/${course.slug}`,
      canonicalPath: rec.canonicalPath,
      excludeFromSitemap: true,
      noindex: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: "article",
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      appliedAiCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) => buildAppliedAiCourseJsonLd(course, baseUrl, {
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription
      })
    };
  }),
  // Supporting Professional Development Slug Aliases (excluded from sitemap, noindex + canonicalized to code route)
  ...discoverProfessionalDevCourses().map((course) => {
    const rec = buildProfessionalDevCourseSeoRecord(course);
    return {
      path: `/programmes/${course.slug}`,
      canonicalPath: rec.canonicalPath,
      excludeFromSitemap: true,
      noindex: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: "article",
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      professionalDevCourseCode: course.code,
      authoritativeHead: true,
      jsonLdBuilder: (baseUrl) => buildProfessionalDevCourseJsonLd(course, baseUrl, {
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription
      })
    };
  }),
  // Institutional Training & Advisory Services (Specialised Programmes — Section B)
  ...INSTITUTIONAL_SERVICES.map((service) => {
    const rec = pageRec(`/institutional-services/${service.slug}`);
    return {
      path: `/institutional-services/${service.slug}`,
      pageSeoRoute: `/institutional-services/${service.slug}`,
      institutionalServiceSlug: service.slug,
      authoritativeHead: true,
      title: rec.seoTitle,
      description: rec.metaDescription,
      ogType: "article",
      ogTitle: rec.ogTitle,
      ogDescription: rec.ogDescription,
      ogImage: rec.ogImage,
      ogImageAlt: rec.ogImageAlt,
      keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
      jsonLdBuilder: (baseUrl) => buildInstitutionalServiceJsonLd(service, baseUrl, {
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription
      })
    };
  }),
  // Supporting Institutional & Utility Pages
  {
    path: "/resources",
    pageSeoRoute: "/resources",
    authoritativeHead: true,
    title: pageRec("/resources").seoTitle,
    description: pageRec("/resources").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/resources").ogTitle,
    ogDescription: pageRec("/resources").ogDescription,
    ogImage: pageRec("/resources").ogImage,
    ogImageAlt: pageRec("/resources").ogImageAlt,
    keywords: [pageRec("/resources").primaryKeyword, ...pageRec("/resources").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildResourcesJsonLd(baseUrl)
  },
  {
    path: "/tools",
    pageSeoRoute: "/tools",
    authoritativeHead: true,
    title: pageRec("/tools").seoTitle,
    description: pageRec("/tools").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/tools").ogTitle,
    ogDescription: pageRec("/tools").ogDescription,
    ogImage: pageRec("/tools").ogImage,
    ogImageAlt: pageRec("/tools").ogImageAlt,
    keywords: [pageRec("/tools").primaryKeyword, ...pageRec("/tools").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildToolsJsonLd(baseUrl)
  },
  {
    path: "/verify-certificate",
    pageSeoRoute: "/verify-certificate",
    authoritativeHead: true,
    title: pageRec("/verify-certificate").seoTitle,
    description: pageRec("/verify-certificate").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/verify-certificate").ogTitle,
    ogDescription: pageRec("/verify-certificate").ogDescription,
    ogImage: pageRec("/verify-certificate").ogImage,
    ogImageAlt: pageRec("/verify-certificate").ogImageAlt,
    keywords: [
      pageRec("/verify-certificate").primaryKeyword,
      ...pageRec("/verify-certificate").secondaryKeywords
    ],
    jsonLdBuilder: (baseUrl) => buildVerifyCertificateJsonLd(baseUrl)
  },
  {
    path: "/login",
    excludeFromSitemap: true,
    noindex: true,
    title: "Login \u2013 Atlas AI Education",
    description: "Sign in to your Atlas AI Education Learner Dashboard.",
    ogType: "website"
  },
  {
    path: "/signup",
    excludeFromSitemap: true,
    noindex: true,
    title: "Create Account \u2013 Atlas AI Education",
    description: "Create your Atlas AI Education learner account to access courses, assignments, and certificates.",
    ogType: "website"
  },
  {
    path: "/forgot-password",
    excludeFromSitemap: true,
    noindex: true,
    title: "Forgot Password \u2013 Atlas AI Education",
    description: "Request a password reset link for your Atlas AI Education account.",
    ogType: "website"
  },
  {
    path: "/reset-password",
    excludeFromSitemap: true,
    noindex: true,
    title: "Reset Password \u2013 Atlas AI Education",
    description: "Reset your Atlas AI Education account password.",
    ogType: "website"
  },
  {
    path: "/verify-email",
    excludeFromSitemap: true,
    noindex: true,
    title: "Verify Email \u2013 Atlas AI Education",
    description: "Verify your Atlas AI Education learner email address.",
    ogType: "website"
  },
  {
    path: "/profile",
    excludeFromSitemap: true,
    noindex: true,
    title: "My Profile \u2013 Atlas AI Education",
    description: "Manage your Atlas AI Education learner profile and saved items.",
    ogType: "website"
  },
  {
    path: "/dashboard",
    excludeFromSitemap: true,
    noindex: true,
    title: "Learner Dashboard \u2013 Atlas AI Education",
    description: "Atlas AI Education Learner Dashboard & Learning Management System.",
    ogType: "website"
  },
  {
    path: "/admin",
    excludeFromSitemap: true,
    noindex: true,
    title: "Admin & Instructor Console \u2013 Atlas AI Education",
    description: "Operational management console for Atlas AI Education.",
    ogType: "website"
  },
  {
    path: "/menu",
    excludeFromSitemap: true,
    noindex: true,
    title: "Menu \u2013 Atlas AI Education",
    description: "Atlas AI Education \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09AE\u09C7\u09A8\u09CD\u09AF\u09C1 \u0993 \u09B8\u09AC \u09AA\u09C7\u099C\u09C7\u09B0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u0964",
    ogType: "website"
  },
  {
    path: "/scholarships",
    pageSeoRoute: "/scholarships",
    authoritativeHead: true,
    title: pageRec("/scholarships").seoTitle,
    description: pageRec("/scholarships").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/scholarships").ogTitle,
    ogDescription: pageRec("/scholarships").ogDescription,
    ogImage: pageRec("/scholarships").ogImage,
    ogImageAlt: pageRec("/scholarships").ogImageAlt,
    keywords: [pageRec("/scholarships").primaryKeyword, ...pageRec("/scholarships").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildScholarshipsJsonLd(baseUrl)
  },
  {
    path: "/faq",
    pageSeoRoute: "/faq",
    authoritativeHead: true,
    title: pageRec("/faq").seoTitle,
    description: pageRec("/faq").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/faq").ogTitle,
    ogDescription: pageRec("/faq").ogDescription,
    ogImage: pageRec("/faq").ogImage,
    ogImageAlt: pageRec("/faq").ogImageAlt,
    keywords: [pageRec("/faq").primaryKeyword, ...pageRec("/faq").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildFaqJsonLd(baseUrl)
  },
  {
    path: "/contact",
    pageSeoRoute: "/contact",
    authoritativeHead: true,
    title: pageRec("/contact").seoTitle,
    description: pageRec("/contact").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/contact").ogTitle,
    ogDescription: pageRec("/contact").ogDescription,
    ogImage: pageRec("/contact").ogImage,
    ogImageAlt: pageRec("/contact").ogImageAlt,
    keywords: [pageRec("/contact").primaryKeyword, ...pageRec("/contact").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildContactJsonLd(baseUrl)
  },
  {
    path: "/privacy",
    pageSeoRoute: "/privacy",
    authoritativeHead: true,
    title: pageRec("/privacy").seoTitle,
    description: pageRec("/privacy").metaDescription,
    ogType: "article",
    ogTitle: pageRec("/privacy").ogTitle,
    ogDescription: pageRec("/privacy").ogDescription,
    ogImage: pageRec("/privacy").ogImage,
    ogImageAlt: pageRec("/privacy").ogImageAlt,
    keywords: [pageRec("/privacy").primaryKeyword, ...pageRec("/privacy").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildLegalOrDirectoryJsonLd(baseUrl, {
      routePath: "/privacy",
      breadcrumbLabel: "Privacy Policy",
      pageTitle: pageRec("/privacy").seoTitle,
      description: pageRec("/privacy").metaDescription
    })
  },
  {
    path: "/privacy-policy",
    canonicalPath: "/privacy",
    excludeFromSitemap: true,
    noindex: true,
    authoritativeHead: true,
    title: pageRec("/privacy").seoTitle,
    description: pageRec("/privacy").metaDescription,
    ogType: "article",
    ogTitle: pageRec("/privacy").ogTitle,
    ogDescription: pageRec("/privacy").ogDescription,
    ogImage: pageRec("/privacy").ogImage,
    ogImageAlt: pageRec("/privacy").ogImageAlt,
    jsonLdBuilder: (baseUrl) => buildLegalOrDirectoryJsonLd(baseUrl, {
      routePath: "/privacy",
      breadcrumbLabel: "Privacy Policy",
      pageTitle: pageRec("/privacy").seoTitle,
      description: pageRec("/privacy").metaDescription
    })
  },
  {
    path: "/terms",
    pageSeoRoute: "/terms",
    authoritativeHead: true,
    title: pageRec("/terms").seoTitle,
    description: pageRec("/terms").metaDescription,
    ogType: "article",
    ogTitle: pageRec("/terms").ogTitle,
    ogDescription: pageRec("/terms").ogDescription,
    ogImage: pageRec("/terms").ogImage,
    ogImageAlt: pageRec("/terms").ogImageAlt,
    keywords: [pageRec("/terms").primaryKeyword, ...pageRec("/terms").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildLegalOrDirectoryJsonLd(baseUrl, {
      routePath: "/terms",
      breadcrumbLabel: "Terms & Conditions",
      pageTitle: pageRec("/terms").seoTitle,
      description: pageRec("/terms").metaDescription
    })
  },
  {
    path: "/sitemap",
    pageSeoRoute: "/sitemap",
    authoritativeHead: true,
    title: pageRec("/sitemap").seoTitle,
    description: pageRec("/sitemap").metaDescription,
    ogType: "website",
    ogTitle: pageRec("/sitemap").ogTitle,
    ogDescription: pageRec("/sitemap").ogDescription,
    ogImage: pageRec("/sitemap").ogImage,
    ogImageAlt: pageRec("/sitemap").ogImageAlt,
    keywords: [pageRec("/sitemap").primaryKeyword, ...pageRec("/sitemap").secondaryKeywords],
    jsonLdBuilder: (baseUrl) => buildLegalOrDirectoryJsonLd(baseUrl, {
      routePath: "/sitemap",
      breadcrumbLabel: "Sitemap",
      pageTitle: pageRec("/sitemap").seoTitle,
      description: pageRec("/sitemap").metaDescription
    })
  }
];
function resolveRouteSeo(pathname) {
  const clean = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const found = ROUTE_SEO_ENTRIES.find((item) => item.path === clean) || ROUTE_SEO_ENTRIES.find((item) => item.path.toLowerCase() === clean.toLowerCase());
  if (found) {
    return { entry: found, isKnown: true };
  }
  if (clean.startsWith("/dashboard")) {
    return {
      entry: {
        path: clean,
        excludeFromSitemap: true,
        noindex: true,
        title: "Learner Dashboard \u2013 Atlas AI Education",
        description: "Atlas AI Education Learner Dashboard & Learning Management System.",
        ogType: "website"
      },
      isKnown: true
    };
  }
  if (clean.startsWith("/admin")) {
    return {
      entry: {
        path: clean,
        excludeFromSitemap: true,
        noindex: true,
        title: "Admin & Instructor Console \u2013 Atlas AI Education",
        description: "Operational management console for Atlas AI Education.",
        ogType: "website"
      },
      isKnown: true
    };
  }
  if (clean.startsWith("/verify-certificate/")) {
    const verifyRec = getPageSeoRecordByPath("/verify-certificate");
    return {
      entry: {
        path: clean,
        canonicalPath: "/verify-certificate",
        excludeFromSitemap: true,
        noindex: true,
        authoritativeHead: true,
        title: verifyRec.seoTitle,
        description: verifyRec.metaDescription,
        ogType: "website",
        ogTitle: verifyRec.ogTitle,
        ogDescription: verifyRec.ogDescription,
        ogImage: verifyRec.ogImage,
        ogImageAlt: verifyRec.ogImageAlt,
        jsonLdBuilder: (baseUrl) => buildVerifyCertificateJsonLd(baseUrl)
      },
      isKnown: true
    };
  }
  if (clean.startsWith("/programmes/")) {
    const param = clean.slice("/programmes/".length);
    const dynamicFoundation = COURSES.find(
      (c) => c.categorySlug === "ai-literacy" && (c.code.toLowerCase() === param.toLowerCase() || c.slug.toLowerCase() === param.toLowerCase())
    );
    if (dynamicFoundation) {
      const rec = buildFoundationCourseSeoRecord(dynamicFoundation);
      const isSlugAccess = param.toLowerCase() === dynamicFoundation.slug.toLowerCase();
      return {
        entry: {
          path: clean,
          canonicalPath: rec.canonicalPath,
          excludeFromSitemap: isSlugAccess,
          noindex: isSlugAccess,
          title: rec.seoTitle,
          description: rec.metaDescription,
          ogType: "article",
          ogTitle: rec.ogTitle,
          ogDescription: rec.ogDescription,
          ogImage: rec.ogImage,
          ogImageAlt: rec.ogImageAlt,
          keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
          foundationCourseCode: dynamicFoundation.code,
          authoritativeHead: true,
          jsonLdBuilder: (baseUrl) => buildFoundationCourseJsonLd(dynamicFoundation, baseUrl, {
            seoTitle: rec.seoTitle,
            metaDescription: rec.metaDescription
          })
        },
        isKnown: true
      };
    }
    const dynamicAppliedAi = COURSES.find(
      (c) => c.categorySlug === "applied-ai" && (c.code.toLowerCase() === param.toLowerCase() || c.slug.toLowerCase() === param.toLowerCase())
    );
    if (dynamicAppliedAi) {
      const rec = buildAppliedAiCourseSeoRecord(dynamicAppliedAi);
      const isSlugAccess = param.toLowerCase() === dynamicAppliedAi.slug.toLowerCase();
      return {
        entry: {
          path: clean,
          canonicalPath: rec.canonicalPath,
          excludeFromSitemap: isSlugAccess,
          noindex: isSlugAccess,
          title: rec.seoTitle,
          description: rec.metaDescription,
          ogType: "article",
          ogTitle: rec.ogTitle,
          ogDescription: rec.ogDescription,
          ogImage: rec.ogImage,
          ogImageAlt: rec.ogImageAlt,
          keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
          appliedAiCourseCode: dynamicAppliedAi.code,
          authoritativeHead: true,
          jsonLdBuilder: (baseUrl) => buildAppliedAiCourseJsonLd(dynamicAppliedAi, baseUrl, {
            seoTitle: rec.seoTitle,
            metaDescription: rec.metaDescription
          })
        },
        isKnown: true
      };
    }
    const dynamicProfessionalDev = COURSES.find(
      (c) => c.categorySlug === "professional-development" && (c.code.toLowerCase() === param.toLowerCase() || c.slug.toLowerCase() === param.toLowerCase())
    );
    if (dynamicProfessionalDev) {
      const rec = buildProfessionalDevCourseSeoRecord(dynamicProfessionalDev);
      const isSlugAccess = param.toLowerCase() === dynamicProfessionalDev.slug.toLowerCase();
      return {
        entry: {
          path: clean,
          canonicalPath: rec.canonicalPath,
          excludeFromSitemap: isSlugAccess,
          noindex: isSlugAccess,
          title: rec.seoTitle,
          description: rec.metaDescription,
          ogType: "article",
          ogTitle: rec.ogTitle,
          ogDescription: rec.ogDescription,
          ogImage: rec.ogImage,
          ogImageAlt: rec.ogImageAlt,
          keywords: [rec.primaryKeyword, ...rec.secondaryKeywords],
          professionalDevCourseCode: dynamicProfessionalDev.code,
          authoritativeHead: true,
          jsonLdBuilder: (baseUrl) => buildProfessionalDevCourseJsonLd(dynamicProfessionalDev, baseUrl, {
            seoTitle: rec.seoTitle,
            metaDescription: rec.metaDescription
          })
        },
        isKnown: true
      };
    }
  }
  return {
    entry: {
      path: clean,
      noindex: true,
      excludeFromSitemap: true,
      title: "\u09AA\u09C3\u09B7\u09CD\u09A0\u09BE\u099F\u09BF \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF \u2013 Atlas AI Education",
      description: "Atlas AI Education \u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F\u09C7 \u098F\u0987 \u09AA\u09C3\u09B7\u09CD\u09A0\u09BE\u099F\u09BF \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964",
      ogType: "website"
    },
    isKnown: false
  };
}

// server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { DatabaseSync } from "node:sqlite";
var DATA_DIR = path.resolve(process.cwd(), "data");
var UPLOADS_DIR = path.join(DATA_DIR, "uploads");
var AVATARS_DIR = path.join(UPLOADS_DIR, "avatars");
var SUBMISSIONS_DIR = path.join(UPLOADS_DIR, "submissions");
var DB_PATH = path.join(DATA_DIR, "atlas-lms.sqlite");
fs.mkdirSync(AVATARS_DIR, { recursive: true });
fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });
var db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'instructor', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deletion_requested')),
    email_verified INTEGER NOT NULL DEFAULT 0,
    email_verify_token_hash TEXT,
    email_verify_expires_at TEXT,
    reset_token_hash TEXT,
    reset_token_expires_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'Bangladesh',
    city TEXT NOT NULL DEFAULT '',
    profession TEXT NOT NULL DEFAULT '',
    organisation TEXT NOT NULL DEFAULT '',
    educational_background TEXT NOT NULL DEFAULT '',
    linkedin_url TEXT NOT NULL DEFAULT '',
    identity_role TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    interests_json TEXT NOT NULL DEFAULT '[]',
    email_updates INTEGER NOT NULL DEFAULT 0,
    prefs_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    user_agent TEXT NOT NULL DEFAULT '',
    ip TEXT NOT NULL DEFAULT '',
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    revoked_at TEXT
  );

  CREATE TABLE IF NOT EXISTS courses (
    code TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    category_name TEXT NOT NULL,
    fee_display TEXT NOT NULL,
    fee_bdt INTEGER NOT NULL DEFAULT 0,
    is_free INTEGER NOT NULL DEFAULT 0,
    duration TEXT NOT NULL,
    max_seats INTEGER,
    certificate_label TEXT NOT NULL DEFAULT '',
    require_lessons_complete INTEGER NOT NULL DEFAULT 1,
    require_assignments_complete INTEGER NOT NULL DEFAULT 0,
    require_quiz_pass INTEGER NOT NULL DEFAULT 0,
    min_quiz_score INTEGER NOT NULL DEFAULT 60,
    is_published INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS course_seo_metadata (
    course_code TEXT PRIMARY KEY REFERENCES courses(code) ON DELETE CASCADE,
    seo_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    og_title TEXT NOT NULL,
    og_description TEXT NOT NULL,
    og_image TEXT NOT NULL DEFAULT '',
    og_image_alt TEXT NOT NULL DEFAULT '',
    primary_keyword TEXT NOT NULL DEFAULT '',
    secondary_keywords TEXT NOT NULL DEFAULT '[]',
    semantic_topics TEXT NOT NULL DEFAULT '[]',
    search_intent TEXT NOT NULL DEFAULT '',
    intended_audience TEXT NOT NULL DEFAULT '[]',
    learning_level TEXT NOT NULL DEFAULT '',
    course_schema TEXT NOT NULL DEFAULT '{}',
    index_status TEXT NOT NULL DEFAULT 'indexed' CHECK (index_status IN ('indexed', 'noindex')),
    is_published INTEGER NOT NULL DEFAULT 1,
    last_optimized_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS page_seo_metadata (
    route_path TEXT PRIMARY KEY,
    page_type TEXT NOT NULL,
    page_title TEXT NOT NULL,
    seo_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    og_title TEXT NOT NULL,
    og_description TEXT NOT NULL,
    og_image TEXT NOT NULL DEFAULT '',
    og_image_alt TEXT NOT NULL DEFAULT '',
    primary_keyword TEXT NOT NULL DEFAULT '',
    secondary_keywords TEXT NOT NULL DEFAULT '[]',
    semantic_topics TEXT NOT NULL DEFAULT '[]',
    search_intent TEXT NOT NULL DEFAULT '',
    schema_type TEXT NOT NULL DEFAULT 'WebPage',
    schema_json TEXT NOT NULL DEFAULT '{}',
    index_status TEXT NOT NULL DEFAULT 'indexed' CHECK (index_status IN ('indexed', 'noindex')),
    is_published INTEGER NOT NULL DEFAULT 1,
    last_optimized_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS course_modules (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    content_markdown TEXT NOT NULL DEFAULT '',
    video_url TEXT NOT NULL DEFAULT '',
    duration_minutes INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS learning_resources (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL DEFAULT 'pdf' CHECK (resource_type IN ('pdf', 'link', 'exercise', 'note')),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lesson_bookmarks (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
  );

  CREATE TABLE IF NOT EXISTS enrolments (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL COLLATE NOCASE,
    applicant_phone TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'Bangladesh',
    educational_background TEXT NOT NULL DEFAULT '',
    motivation TEXT NOT NULL DEFAULT '',
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    mode TEXT NOT NULL DEFAULT 'course-application',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Rejected', 'Cancelled')),
    enrolled_at TEXT NOT NULL,
    confirmed_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    completed_at TEXT NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    module_id TEXT REFERENCES course_modules(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    due_at TEXT,
    max_points INTEGER NOT NULL DEFAULT 100,
    allow_file_upload INTEGER NOT NULL DEFAULT 1,
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_text TEXT NOT NULL DEFAULT '',
    file_path TEXT NOT NULL DEFAULT '',
    file_name TEXT NOT NULL DEFAULT '',
    file_size INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Pending', 'Submitted', 'Under Review', 'Reviewed', 'Revision Required')),
    score INTEGER,
    feedback TEXT NOT NULL DEFAULT '',
    reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TEXT NOT NULL,
    reviewed_at TEXT,
    UNIQUE (assignment_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL DEFAULT '',
    passing_score INTEGER NOT NULL DEFAULT 60,
    questions_json TEXT NOT NULL DEFAULT '[]',
    is_published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers_json TEXT NOT NULL DEFAULT '[]',
    score_percent INTEGER NOT NULL DEFAULT 0,
    passed INTEGER NOT NULL DEFAULT 0,
    submitted_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    certificate_code TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    certificate_title TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    category_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Issued' CHECK (status IN ('Issued', 'Revoked')),
    issued_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    issued_at TEXT NOT NULL,
    UNIQUE (user_id, course_code)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    enrolment_id TEXT NOT NULL REFERENCES enrolments(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    amount_display TEXT NOT NULL,
    amount_bdt INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('free', 'bkash', 'nagad')),
    payment_number TEXT NOT NULL DEFAULT '',
    sender_phone TEXT NOT NULL DEFAULT '',
    transaction_id TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    verified_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'system',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT '',
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS saved_items (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('programme', 'resource')),
    item_key TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, item_type, item_key)
  );

  CREATE TABLE IF NOT EXISTS account_deletion_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending Review',
    requested_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    reference_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS institutional_inquiries (
    reference_id TEXT PRIMARY KEY,
    service_slug TEXT NOT NULL,
    service_title TEXT NOT NULL,
    organisation_name TEXT NOT NULL,
    organisation_type TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    pathway TEXT NOT NULL DEFAULT '',
    sector TEXT NOT NULL DEFAULT '',
    requirements TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scholarship_applications (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL UNIQUE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    education_or_profession TEXT NOT NULL,
    learning_motivation TEXT NOT NULL,
    financial_need_reason TEXT NOT NULL,
    commitment_statement TEXT NOT NULL,
    requested_waiver_pct INTEGER NOT NULL DEFAULT 50,
    approved_waiver_pct INTEGER,
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Approved', 'Rejected', 'Waitlisted')),
    admin_notes TEXT NOT NULL DEFAULT '',
    reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_enrolments_user ON enrolments(user_id);
  CREATE INDEX IF NOT EXISTS idx_enrolments_course ON enrolments(course_code, status);
  CREATE INDEX IF NOT EXISTS idx_scholarships_course ON scholarship_applications(course_code, status);
  CREATE INDEX IF NOT EXISTS idx_scholarships_user ON scholarship_applications(user_id);
  CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at);
  CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_code, is_published);
  CREATE INDEX IF NOT EXISTS idx_course_seo_status ON course_seo_metadata(index_status, is_published);
`);
{
  const courseCols = db.prepare("PRAGMA table_info(courses)").all();
  if (!courseCols.some((c) => c.name === "is_published")) {
    db.exec("ALTER TABLE courses ADD COLUMN is_published INTEGER NOT NULL DEFAULT 1;");
  }
}
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}
function verifyPassword(password, storedHash) {
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
function parseFeeBdt(fee, isFree) {
  if (isFree) return 0;
  const digits = fee.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}
function syncCatalogAndSeedUsers() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const existingCourseStmt = db.prepare("SELECT code, max_seats FROM courses WHERE code = ?");
  const upsertCourseStmt = db.prepare(`
    INSERT INTO courses (
      code, slug, title, category_slug, category_name, fee_display, fee_bdt, is_free,
      duration, max_seats, certificate_label, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      category_slug = excluded.category_slug,
      category_name = excluded.category_name,
      fee_display = excluded.fee_display,
      fee_bdt = excluded.fee_bdt,
      is_free = excluded.is_free,
      duration = excluded.duration,
      certificate_label = excluded.certificate_label,
      updated_at = excluded.updated_at
  `);
  for (const course of COURSES) {
    const info = getCategoryEnrolmentInfo(course.categorySlug);
    const defaultMaxSeats = info ? info.seatCapacity : null;
    const certLabel = info ? info.certificateLabel : course.code === "SP-WSAI" ? "Certificate of Participation" : "Completion Certificate";
    const existing = existingCourseStmt.get(course.code);
    upsertCourseStmt.run(
      course.code,
      course.slug,
      course.title,
      course.categorySlug,
      course.categoryName,
      course.fee,
      parseFeeBdt(course.fee, course.isFree),
      course.isFree ? 1 : 0,
      course.duration,
      existing ? existing.max_seats : defaultMaxSeats,
      certLabel,
      now
    );
  }
  const upsertSeoStmt = db.prepare(`
    INSERT INTO course_seo_metadata (
      course_code, seo_title, meta_description, canonical_url,
      og_title, og_description, og_image, og_image_alt,
      primary_keyword, secondary_keywords, semantic_topics,
      search_intent, intended_audience, learning_level,
      course_schema, index_status, is_published, last_optimized_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(course_code) DO UPDATE SET
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      og_image = excluded.og_image,
      og_image_alt = excluded.og_image_alt,
      primary_keyword = excluded.primary_keyword,
      secondary_keywords = excluded.secondary_keywords,
      semantic_topics = excluded.semantic_topics,
      search_intent = excluded.search_intent,
      intended_audience = excluded.intended_audience,
      learning_level = excluded.learning_level,
      course_schema = excluded.course_schema,
      index_status = excluded.index_status,
      is_published = excluded.is_published,
      last_optimized_at = excluded.last_optimized_at
  `);
  const courseStateStmt = db.prepare(`
    SELECT c.is_published,
           (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count,
           c.max_seats
    FROM courses c
    WHERE c.code = ?
  `);
  const seoTargets = [
    ...discoverFoundationCourses().map((course) => ({
      course,
      builder: buildFoundationCourseSeoRecord
    })),
    ...discoverAppliedAiCourses().map((course) => ({
      course,
      builder: buildAppliedAiCourseSeoRecord
    })),
    ...discoverProfessionalDevCourses().map((course) => ({
      course,
      builder: buildProfessionalDevCourseSeoRecord
    })),
    {
      course: discoverSpecialisedCourse(),
      builder: buildWomensSafetyCourseSeoRecord
    }
  ];
  for (const { course, builder } of seoTargets) {
    const dbState = courseStateStmt.get(course.code);
    const isPublished = dbState ? dbState.is_published === 1 : true;
    const isFull = dbState && dbState.max_seats !== null ? dbState.confirmed_count >= dbState.max_seats : false;
    const seoRec = builder(course, "", {
      isPublished,
      indexStatus: isPublished ? "indexed" : "noindex",
      isFull,
      lastOptimizedAt: now
    });
    upsertSeoStmt.run(
      seoRec.courseCode,
      seoRec.seoTitle,
      seoRec.metaDescription,
      seoRec.canonicalPath,
      seoRec.ogTitle,
      seoRec.ogDescription,
      seoRec.ogImage,
      seoRec.ogImageAlt,
      seoRec.primaryKeyword,
      JSON.stringify(seoRec.secondaryKeywords),
      JSON.stringify(seoRec.semanticTopics),
      seoRec.searchIntent,
      JSON.stringify(seoRec.intendedAudience),
      seoRec.learningLevel,
      JSON.stringify(seoRec.courseSchema),
      seoRec.indexStatus,
      isPublished ? 1 : 0,
      seoRec.lastOptimizedAt
    );
  }
  const upsertPageSeoStmt = db.prepare(`
    INSERT INTO page_seo_metadata (
      route_path, page_type, page_title, seo_title, meta_description,
      canonical_url, og_title, og_description, og_image, og_image_alt,
      primary_keyword, secondary_keywords, semantic_topics, search_intent,
      schema_type, schema_json, index_status, is_published, last_optimized_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(route_path) DO UPDATE SET
      page_type = excluded.page_type,
      page_title = excluded.page_title,
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      og_image = excluded.og_image,
      og_image_alt = excluded.og_image_alt,
      primary_keyword = excluded.primary_keyword,
      secondary_keywords = excluded.secondary_keywords,
      semantic_topics = excluded.semantic_topics,
      search_intent = excluded.search_intent,
      schema_type = excluded.schema_type,
      schema_json = excluded.schema_json,
      index_status = excluded.index_status,
      is_published = excluded.is_published,
      last_optimized_at = excluded.last_optimized_at
  `);
  for (const pageSeo of buildAllSitePageSeoRecords("", now)) {
    upsertPageSeoStmt.run(
      pageSeo.routePath,
      pageSeo.pageType,
      pageSeo.pageTitle,
      pageSeo.seoTitle,
      pageSeo.metaDescription,
      pageSeo.canonicalPath,
      pageSeo.ogTitle,
      pageSeo.ogDescription,
      pageSeo.ogImage,
      pageSeo.ogImageAlt,
      pageSeo.primaryKeyword,
      JSON.stringify(pageSeo.secondaryKeywords),
      JSON.stringify(pageSeo.semanticTopics),
      pageSeo.searchIntent,
      pageSeo.schemaType,
      JSON.stringify(pageSeo.schemaJson),
      pageSeo.indexStatus,
      pageSeo.isPublished ? 1 : 0,
      pageSeo.lastOptimizedAt
    );
  }
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get();
  if (adminCount.count === 0) {
    const adminEmail = (process.env.ADMIN_SEED_EMAIL || "admin@atlasaieducation.org").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_SEED_PASSWORD && process.env.ADMIN_SEED_PASSWORD !== "REPLACE_WITH_STRONG_ADMIN_PASSWORD" ? process.env.ADMIN_SEED_PASSWORD : "AtlasAdmin#2026";
    const adminId = `usr_admin_${crypto.randomBytes(6).toString("hex")}`;
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, 'admin', 'active', 1, ?, ?)
    `).run(adminId, adminEmail, hashPassword(adminPassword), now, now);
    db.prepare(`
      INSERT INTO user_profiles (
        user_id, full_name, country, profession, organisation, bio, updated_at
      ) VALUES (?, ?, 'Bangladesh', 'Platform Administrator', 'Atlas AI Education', ?, ?)
    `).run(
      adminId,
      "Atlas Administrator",
      "Official administrator account for Atlas AI Education LMS.",
      now
    );
  }
  const instructorCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'instructor'").get();
  if (instructorCount.count === 0) {
    const instEmail = (process.env.INSTRUCTOR_SEED_EMAIL || "instructor@atlasaieducation.org").trim().toLowerCase();
    const instPassword = process.env.INSTRUCTOR_SEED_PASSWORD && process.env.INSTRUCTOR_SEED_PASSWORD !== "REPLACE_WITH_STRONG_INSTRUCTOR_PASSWORD" ? process.env.INSTRUCTOR_SEED_PASSWORD : "AtlasInst#2026";
    const instId = `usr_inst_${crypto.randomBytes(6).toString("hex")}`;
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, 'instructor', 'active', 1, ?, ?)
    `).run(instId, instEmail, hashPassword(instPassword), now, now);
    db.prepare(`
      INSERT INTO user_profiles (
        user_id, full_name, country, profession, organisation, bio, updated_at
      ) VALUES (?, ?, 'Bangladesh', 'Lead Instructor', 'Atlas AI Education', ?, ?)
    `).run(
      instId,
      "Atlas Instructor",
      "Faculty & assignment reviewer at Atlas AI Education.",
      now
    );
  }
}
function createNotification(input) {
  const id = `ntf_${crypto.randomBytes(8).toString("hex")}`;
  db.prepare(`
    INSERT INTO notifications (id, user_id, type, title, message, link, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `).run(id, input.userId, input.type, input.title, input.message, input.link || "", (/* @__PURE__ */ new Date()).toISOString());
}
function computeProfileCompletion(profile) {
  let score = 0;
  const total = 8;
  if (profile.full_name && profile.full_name.trim().length >= 2) score += 1;
  if (profile.phone && profile.phone.trim().length >= 6) score += 1;
  if (profile.country && profile.country.trim().length >= 2) score += 1;
  if (profile.city && profile.city.trim().length >= 2) score += 1;
  if (profile.profession && profile.profession.trim().length >= 2) score += 1;
  if (profile.educational_background && profile.educational_background.trim().length >= 2) score += 1;
  if (profile.bio && profile.bio.trim().length >= 5) score += 1;
  try {
    const interests = JSON.parse(profile.interests_json || "[]");
    if (Array.isArray(interests) && interests.length > 0) score += 1;
  } catch {
  }
  return Math.round(score / total * 100);
}

// server/auth.ts
import crypto2 from "crypto";
var SESSION_COOKIE_NAME = "atlas_sid";
var SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        out[key] = decodeURIComponent(val);
      } catch {
        out[key] = val;
      }
    }
  }
  return out;
}
function buildUserDto(userId) {
  const row = db.prepare(`
      SELECT
        u.id, u.email, u.role, u.status, u.email_verified, u.created_at,
        p.full_name, p.avatar_url, p.phone, p.country, p.city, p.profession,
        p.organisation, p.educational_background, p.linkedin_url, p.identity_role,
        p.bio, p.interests_json, p.email_updates, p.prefs_json
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.id = ?
    `).get(userId);
  if (!row) return null;
  let interests = [];
  try {
    const parsed = JSON.parse(row.interests_json || "[]");
    if (Array.isArray(parsed)) interests = parsed.filter((x) => typeof x === "string");
  } catch {
    interests = [];
  }
  let prefs = {};
  try {
    const parsed = JSON.parse(row.prefs_json || "{}");
    if (parsed && typeof parsed === "object") prefs = parsed;
  } catch {
    prefs = {};
  }
  const profileCompletion = computeProfileCompletion({
    full_name: row.full_name || "",
    avatar_url: row.avatar_url || "",
    phone: row.phone || "",
    country: row.country || "",
    city: row.city || "",
    profession: row.profession || "",
    educational_background: row.educational_background || "",
    bio: row.bio || "",
    interests_json: row.interests_json || "[]"
  });
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    emailVerified: row.email_verified === 1,
    createdAt: row.created_at,
    name: row.full_name || row.email.split("@")[0],
    avatarUrl: row.avatar_url || "",
    phone: row.phone || "",
    country: row.country || "Bangladesh",
    city: row.city || "",
    profession: row.profession || "",
    organisation: row.organisation || "",
    educationalBackground: row.educational_background || "",
    linkedinUrl: row.linkedin_url || "",
    identity: row.identity_role || "",
    bio: row.bio || "",
    interests,
    emailUpdates: row.email_updates === 1,
    prefs,
    profileCompletion
  };
}
function createSessionCookie(req, res, userId) {
  const rawToken = crypto2.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const sessionId = `ses_${crypto2.randomBytes(8).toString("hex")}`;
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  const userAgent = String(req.headers["user-agent"] || "").slice(0, 220);
  const ip = String(req.ip || "unknown").slice(0, 80);
  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, user_agent, ip, expires_at, created_at, last_seen_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sessionId,
    userId,
    tokenHash,
    userAgent,
    ip,
    expiresAt.toISOString(),
    now.toISOString(),
    now.toISOString()
  );
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
  res.cookie(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: Boolean(isHttps),
    path: "/",
    maxAge: SESSION_TTL_MS
  });
  return sessionId;
}
function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}
function attachAuth(req, _res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE_NAME];
  if (!rawToken) {
    next();
    return;
  }
  const tokenHash = hashToken(rawToken);
  const ses = db.prepare(`
      SELECT id, user_id, expires_at, revoked_at
      FROM sessions
      WHERE token_hash = ?
    `).get(tokenHash);
  if (!ses || ses.revoked_at || new Date(ses.expires_at).getTime() <= Date.now()) {
    next();
    return;
  }
  const user = buildUserDto(ses.user_id);
  if (!user || user.status === "suspended") {
    next();
    return;
  }
  db.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?").run((/* @__PURE__ */ new Date()).toISOString(), ses.id);
  req.authUser = user;
  req.authSessionId = ses.id;
  next();
}
function requireAuth(req, res, next) {
  if (!req.authUser) {
    res.status(401).json({ error: "Authentication required. Please log in to continue." });
    return;
  }
  next();
}
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.authUser) {
      res.status(401).json({ error: "Authentication required. Please log in to continue." });
      return;
    }
    if (!roles.includes(req.authUser.role)) {
      res.status(403).json({
        error: "Access denied. You do not have permission to perform this action."
      });
      return;
    }
    next();
  };
}
function getSavedItemsForUser(userId) {
  const rows = db.prepare("SELECT item_type, item_key FROM saved_items WHERE user_id = ?").all(userId);
  return {
    savedProgrammes: rows.filter((r) => r.item_type === "programme").map((r) => r.item_key),
    savedResources: rows.filter((r) => r.item_type === "resource").map((r) => r.item_key)
  };
}
function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

// server/routes/authRoutes.ts
import crypto3 from "crypto";
import { Router } from "express";
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function createAuthRouter() {
  const router = Router();
  router.post("/register", (req, res) => {
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const country = typeof body.country === "string" && body.country.trim().length > 0 ? body.country.trim() : "Bangladesh";
    const identity = typeof body.identity === "string" ? body.identity.trim() : "";
    if (name.length < 2 || name.length > 120) {
      res.status(400).json({ error: "Please enter your full name (at least 2 characters)." });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: "Please enter a valid email address." });
      return;
    }
    if (password.length < 8 || password.length > 128) {
      res.status(400).json({ error: "Password must be between 8 and 128 characters." });
      return;
    }
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      res.status(409).json({
        error: "An account with this email address already exists. Please log in instead."
      });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const userId = `usr_${crypto3.randomBytes(8).toString("hex")}`;
    const verifyRawToken = crypto3.randomBytes(24).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare(`
        INSERT INTO users (
          id, email, password_hash, role, status, email_verified,
          email_verify_token_hash, email_verify_expires_at, created_at, updated_at
        ) VALUES (?, ?, ?, 'learner', 'active', 0, ?, ?, ?, ?)
      `).run(
        userId,
        email,
        hashPassword(password),
        hashToken(verifyRawToken),
        verifyExpires,
        now,
        now
      );
      db.prepare(`
        INSERT INTO user_profiles (
          user_id, full_name, phone, country, identity_role, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, name, phone, country, identity, now);
      createNotification({
        userId,
        type: "account",
        title: "Welcome to Atlas AI Education",
        message: "Your learner account has been created. Complete your profile and verify your email address to keep your learning record secure.",
        link: "/dashboard/profile"
      });
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    createSessionCookie(req, res, userId);
    const user = buildUserDto(userId);
    const saved = getSavedItemsForUser(userId);
    const smtpConfigured = isSmtpConfigured();
    res.status(201).json({
      user,
      ...saved,
      unreadNotificationsCount: 1,
      emailDeliveryStatus: smtpConfigured ? "sent" : "pending_provider_configuration",
      verificationPreviewPath: smtpConfigured ? void 0 : `/verify-email?token=${verifyRawToken}`,
      message: smtpConfigured ? "Account created. Please check your email inbox for your verification link." : "Account created. Email delivery awaits SMTP configuration \u2014 use the verification link in your dashboard or confirmation prompt."
    });
  });
  router.post("/login", (req, res) => {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!EMAIL_REGEX.test(email) || password.length < 1) {
      res.status(400).json({ error: "Please provide your registered email and password." });
      return;
    }
    const row = db.prepare("SELECT id, password_hash, status FROM users WHERE email = ?").get(email);
    if (!row || !verifyPassword(password, row.password_hash)) {
      res.status(401).json({ error: "Invalid email address or password." });
      return;
    }
    if (row.status === "suspended") {
      res.status(403).json({
        error: "This account has been suspended by an administrator. Please contact support."
      });
      return;
    }
    createSessionCookie(req, res, row.id);
    const user = buildUserDto(row.id);
    const saved = getSavedItemsForUser(row.id);
    const unread = db.prepare("SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0").get(row.id);
    res.json({
      user,
      ...saved,
      unreadNotificationsCount: unread.c
    });
  });
  router.post("/logout", (req, res) => {
    if (req.authSessionId) {
      db.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ?").run(
        (/* @__PURE__ */ new Date()).toISOString(),
        req.authSessionId
      );
    }
    clearSessionCookie(res);
    res.json({ ok: true });
  });
  router.get("/me", (req, res) => {
    if (!req.authUser) {
      res.json({
        isAuthenticated: false,
        user: null,
        savedProgrammes: [],
        savedResources: [],
        unreadNotificationsCount: 0
      });
      return;
    }
    const saved = getSavedItemsForUser(req.authUser.id);
    const unread = db.prepare("SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0").get(req.authUser.id);
    res.json({
      isAuthenticated: true,
      user: req.authUser,
      ...saved,
      unreadNotificationsCount: unread.c
    });
  });
  router.post("/verify-email", (req, res) => {
    const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
    if (!token) {
      res.status(400).json({ error: "Verification token is required." });
      return;
    }
    const tokenHash = hashToken(token);
    const userRow = db.prepare(`
        SELECT id, email, email_verified, email_verify_expires_at
        FROM users
        WHERE email_verify_token_hash = ?
      `).get(tokenHash);
    if (!userRow) {
      res.status(400).json({ error: "Invalid or already-used email verification token." });
      return;
    }
    if (userRow.email_verify_expires_at && new Date(userRow.email_verify_expires_at).getTime() < Date.now()) {
      res.status(400).json({
        error: "This verification token has expired. Please request a new verification link."
      });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare(`
        UPDATE users
        SET email_verified = 1, email_verify_token_hash = NULL, email_verify_expires_at = NULL, updated_at = ?
        WHERE id = ?
      `).run(now, userRow.id);
      db.prepare(`
        UPDATE enrolments SET user_id = ? WHERE user_id IS NULL AND LOWER(applicant_email) = LOWER(?)
      `).run(userRow.id, userRow.email);
      db.prepare(`
        UPDATE payments SET user_id = ?
        WHERE user_id IS NULL AND enrolment_id IN (
          SELECT id FROM enrolments WHERE user_id = ?
        )
      `).run(userRow.id, userRow.id);
      db.prepare(`
        UPDATE scholarship_applications SET user_id = ? WHERE user_id IS NULL AND LOWER(email) = LOWER(?)
      `).run(userRow.id, userRow.email);
      createNotification({
        userId: userRow.id,
        type: "account",
        title: "Email Verified",
        message: "Your email address has been successfully verified.",
        link: "/dashboard/profile"
      });
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    res.json({
      verified: true,
      email: userRow.email,
      message: "Your email address has been verified."
    });
  });
  router.post("/resend-verification", requireAuth, (req, res) => {
    const authUser = req.authUser;
    if (authUser.emailVerified) {
      res.json({ alreadyVerified: true, message: "Your email address is already verified." });
      return;
    }
    const rawToken = crypto3.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
    db.prepare(`
      UPDATE users
      SET email_verify_token_hash = ?, email_verify_expires_at = ?, updated_at = ?
      WHERE id = ?
    `).run(hashToken(rawToken), expires, (/* @__PURE__ */ new Date()).toISOString(), authUser.id);
    const smtpConfigured = isSmtpConfigured();
    res.json({
      emailDeliveryStatus: smtpConfigured ? "sent" : "pending_provider_configuration",
      verificationPreviewPath: smtpConfigured ? void 0 : `/verify-email?token=${rawToken}`,
      message: smtpConfigured ? "A fresh verification email has been sent." : "Email delivery awaits SMTP configuration. Use the generated verification link directly below."
    });
  });
  router.post("/forgot-password", (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: "Please enter a valid email address." });
      return;
    }
    const userRow = db.prepare("SELECT id, status FROM users WHERE email = ?").get(email);
    const smtpConfigured = isSmtpConfigured();
    let resetPreviewPath;
    if (userRow && userRow.status !== "suspended") {
      const rawToken = crypto3.randomBytes(24).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1e3).toISOString();
      db.prepare(`
        UPDATE users
        SET reset_token_hash = ?, reset_token_expires_at = ?, updated_at = ?
        WHERE id = ?
      `).run(hashToken(rawToken), expiresAt, (/* @__PURE__ */ new Date()).toISOString(), userRow.id);
      if (!smtpConfigured) {
        resetPreviewPath = `/reset-password?token=${rawToken}`;
      }
    }
    res.json({
      emailDeliveryStatus: smtpConfigured ? "sent" : "pending_provider_configuration",
      resetPreviewPath,
      message: smtpConfigured ? "If an account matches that email address, password reset instructions have been sent." : "If an account matches that email address, a time-limited reset link was generated (SMTP email provider integration pending)."
    });
  });
  router.post("/reset-password", (req, res) => {
    const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
    const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";
    if (!token) {
      res.status(400).json({ error: "Password reset token is required." });
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({ error: "New password must be between 8 and 128 characters." });
      return;
    }
    const row = db.prepare("SELECT id, reset_token_expires_at FROM users WHERE reset_token_hash = ?").get(hashToken(token));
    if (!row) {
      res.status(400).json({ error: "Invalid or already-used password reset token." });
      return;
    }
    if (!row.reset_token_expires_at || new Date(row.reset_token_expires_at).getTime() < Date.now()) {
      res.status(400).json({
        error: "This password reset token has expired. Please request a new one."
      });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare(`
        UPDATE users
        SET password_hash = ?, reset_token_hash = NULL, reset_token_expires_at = NULL, updated_at = ?
        WHERE id = ?
      `).run(hashPassword(newPassword), now, row.id);
      db.prepare("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL").run(
        now,
        row.id
      );
      createNotification({
        userId: row.id,
        type: "security",
        title: "Password Reset Completed",
        message: "Your password was reset and previous active sessions were signed out.",
        link: "/dashboard/settings"
      });
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    res.json({
      ok: true,
      message: "Your password has been updated. You can now log in with your new password."
    });
  });
  router.post("/change-password", requireAuth, (req, res) => {
    const authUser = req.authUser;
    const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
    const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";
    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({ error: "New password must be between 8 and 128 characters." });
      return;
    }
    const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(authUser.id);
    if (!verifyPassword(currentPassword, row.password_hash)) {
      res.status(400).json({ error: "Current password is incorrect." });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").run(
      hashPassword(newPassword),
      now,
      authUser.id
    );
    createNotification({
      userId: authUser.id,
      type: "security",
      title: "Password Changed",
      message: "Your account password was changed successfully.",
      link: "/dashboard/settings"
    });
    res.json({ ok: true, message: "Password updated successfully." });
  });
  router.post("/update-email", requireAuth, (req, res) => {
    const authUser = req.authUser;
    const newEmail = typeof req.body?.newEmail === "string" ? req.body.newEmail.trim().toLowerCase() : "";
    const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
    if (!EMAIL_REGEX.test(newEmail)) {
      res.status(400).json({ error: "Please provide a valid new email address." });
      return;
    }
    const userRow = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(authUser.id);
    if (!verifyPassword(currentPassword, userRow.password_hash)) {
      res.status(400).json({ error: "Password confirmation failed." });
      return;
    }
    const duplicate = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(newEmail, authUser.id);
    if (duplicate) {
      res.status(409).json({ error: "This email address is already registered to another account." });
      return;
    }
    const verifyRawToken = crypto3.randomBytes(24).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      UPDATE users
      SET email = ?, email_verified = 0, email_verify_token_hash = ?, email_verify_expires_at = ?, updated_at = ?
      WHERE id = ?
    `).run(newEmail, hashToken(verifyRawToken), verifyExpires, now, authUser.id);
    const smtpConfigured = isSmtpConfigured();
    res.json({
      user: buildUserDto(authUser.id),
      verificationPreviewPath: smtpConfigured ? void 0 : `/verify-email?token=${verifyRawToken}`,
      message: smtpConfigured ? "Email updated. Please verify your new email address using the link sent to your inbox." : "Email updated. Please verify your new email address (email provider awaiting SMTP configuration)."
    });
  });
  router.get("/sessions", requireAuth, (req, res) => {
    const rows = db.prepare(`
        SELECT id, user_agent, ip, created_at, last_seen_at, expires_at
        FROM sessions
        WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
        ORDER BY last_seen_at DESC
      `).all(req.authUser.id, (/* @__PURE__ */ new Date()).toISOString());
    res.json({
      sessions: rows.map((s) => ({
        id: s.id,
        userAgent: s.user_agent || "Unknown browser",
        ip: s.ip || "Unknown",
        createdAt: s.created_at,
        lastSeenAt: s.last_seen_at,
        expiresAt: s.expires_at,
        isCurrent: s.id === req.authSessionId
      }))
    });
  });
  router.delete("/sessions/:id", requireAuth, (req, res) => {
    const targetId = req.params.id;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (targetId === "others") {
      db.prepare(`
        UPDATE sessions SET revoked_at = ?
        WHERE user_id = ? AND id != ? AND revoked_at IS NULL
      `).run(now, req.authUser.id, req.authSessionId || "");
      res.json({ ok: true, message: "All other active sessions have been signed out." });
      return;
    }
    const result = db.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ?").run(now, targetId, req.authUser.id);
    if (result.changes === 0) {
      res.status(404).json({ error: "Session not found." });
      return;
    }
    if (targetId === req.authSessionId) {
      clearSessionCookie(res);
    }
    res.json({ ok: true });
  });
  router.post("/account-deletion-request", requireAuth, (req, res) => {
    const authUser = req.authUser;
    const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 1e3) : "";
    const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(authUser.id);
    if (!verifyPassword(currentPassword, row.password_hash)) {
      res.status(400).json({ error: "Password verification failed." });
      return;
    }
    const reqId = `del_${crypto3.randomBytes(6).toString("hex")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare(`
        INSERT INTO account_deletion_requests (id, user_id, reason, status, requested_at)
        VALUES (?, ?, ?, 'Pending Review', ?)
      `).run(reqId, authUser.id, reason, now);
      db.prepare(`UPDATE users SET status = 'deletion_requested', updated_at = ? WHERE id = ?`).run(
        now,
        authUser.id
      );
      createNotification({
        userId: authUser.id,
        type: "security",
        title: "Account Deletion Request Logged",
        message: "Your account deletion request has been logged for administrative review. Financial payment records and issued certificate verification logs follow mandatory audit retention policies.",
        link: "/dashboard/settings"
      });
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    res.json({
      ok: true,
      requestId: reqId,
      message: "Your account deletion request has been recorded. Our compliance team will process personal profile removal in accordance with our Privacy Policy."
    });
  });
  return router;
}

// server/routes/dashboardRoutes.ts
import fs2 from "fs";
import path2 from "path";
import crypto4 from "crypto";
import { Router as Router2 } from "express";
function getCourseProgressForUser(userId, courseCode) {
  const publishedLessons = db.prepare(`
      SELECT l.id
      FROM lessons l
      JOIN course_modules m ON m.id = l.module_id
      WHERE l.course_code = ? AND l.is_published = 1 AND m.is_published = 1
      ORDER BY m.sort_order ASC, l.sort_order ASC
    `).all(courseCode);
  const completedRows = db.prepare(`
      SELECT lesson_id, completed_at
      FROM lesson_progress
      WHERE user_id = ? AND course_code = ?
      ORDER BY completed_at DESC
    `).all(userId, courseCode);
  const completedSet = new Set(completedRows.map((r) => r.lesson_id));
  const publishedLessonIds = publishedLessons.map((l) => l.id);
  const completedPublished = publishedLessonIds.filter((id) => completedSet.has(id));
  const totalPublishedLessons = publishedLessonIds.length;
  const completedLessonsCount = completedPublished.length;
  const progressPercent = totalPublishedLessons > 0 ? Math.round(completedLessonsCount / totalPublishedLessons * 100) : 0;
  const assignmentsStats = db.prepare(`
      SELECT
        COUNT(a.id) as total_a,
        SUM(CASE WHEN s.status IN ('Submitted', 'Under Review', 'Reviewed', 'Revision Required') THEN 1 ELSE 0 END) as submitted_a,
        SUM(CASE WHEN s.status = 'Reviewed' THEN 1 ELSE 0 END) as reviewed_a
      FROM assignments a
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
      WHERE a.course_code = ? AND a.is_published = 1
    `).get(userId, courseCode);
  const quizStats = db.prepare(`
      SELECT
        COUNT(DISTINCT q.id) as total_q,
        COUNT(DISTINCT CASE WHEN qa.passed = 1 THEN q.id END) as passed_q,
        MAX(qa.score_percent) as best_score
      FROM quizzes q
      LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = ?
      WHERE q.course_code = ? AND q.is_published = 1
    `).get(userId, courseCode);
  const nextLesson = publishedLessons.find((l) => !completedSet.has(l.id)) || publishedLessons[0] || null;
  let statusLabel = "Not Started";
  if (totalPublishedLessons > 0 && completedLessonsCount >= totalPublishedLessons) {
    statusLabel = "Completed";
  } else if (completedLessonsCount > 0 || (assignmentsStats.submitted_a || 0) > 0) {
    statusLabel = "In Progress";
  }
  return {
    courseCode,
    totalPublishedLessons,
    completedLessonsCount,
    progressPercent,
    totalPublishedAssignments: assignmentsStats.total_a || 0,
    reviewedAssignmentsCount: assignmentsStats.reviewed_a || 0,
    submittedAssignmentsCount: assignmentsStats.submitted_a || 0,
    totalPublishedQuizzes: quizStats.total_q || 0,
    passedQuizzesCount: quizStats.passed_q || 0,
    bestQuizScore: quizStats.best_score ?? null,
    lastCompletedLessonId: completedRows[0]?.lesson_id || null,
    nextLessonId: nextLesson ? nextLesson.id : null,
    statusLabel
  };
}
function evaluateCertificateEligibility(userId, courseCode) {
  const courseRow = db.prepare(`
      SELECT
        code, title, category_name, certificate_label,
        require_lessons_complete, require_assignments_complete,
        require_quiz_pass, min_quiz_score
      FROM courses WHERE code = ?
    `).get(courseCode);
  if (!courseRow) return null;
  const progress = getCourseProgressForUser(userId, courseCode);
  const existingCert = db.prepare("SELECT id, certificate_code, status, issued_at FROM certificates WHERE user_id = ? AND course_code = ?").get(userId, courseCode);
  const hasPublishedLearningContent = progress.totalPublishedLessons > 0 || progress.totalPublishedAssignments > 0 || progress.totalPublishedQuizzes > 0;
  const reasons = [];
  if (!hasPublishedLearningContent) {
    reasons.push("Course learning & assessment materials are not yet published for automated completion.");
  }
  if (courseRow.require_lessons_complete === 1 && progress.totalPublishedLessons > 0 && progress.progressPercent < 100) {
    reasons.push(
      `Complete all published lessons (${progress.completedLessonsCount}/${progress.totalPublishedLessons}).`
    );
  }
  if (courseRow.require_assignments_complete === 1 && progress.totalPublishedAssignments > 0 && progress.reviewedAssignmentsCount < progress.totalPublishedAssignments) {
    reasons.push(
      `Have all required assignments reviewed (${progress.reviewedAssignmentsCount}/${progress.totalPublishedAssignments}).`
    );
  }
  if (courseRow.require_quiz_pass === 1 && progress.totalPublishedQuizzes > 0) {
    const scoreOk = (progress.bestQuizScore ?? 0) >= courseRow.min_quiz_score;
    if (progress.passedQuizzesCount < progress.totalPublishedQuizzes || !scoreOk) {
      reasons.push(`Pass required quizzes with at least ${courseRow.min_quiz_score}%.`);
    }
  }
  return {
    courseCode: courseRow.code,
    courseTitle: courseRow.title,
    categoryName: courseRow.category_name,
    certificateLabel: courseRow.certificate_label,
    hasPublishedLearningContent,
    eligible: hasPublishedLearningContent && reasons.length === 0,
    unmetReasons: reasons,
    existingCertificate: existingCert || null,
    progress
  };
}
function createDashboardRouter() {
  const router = Router2();
  router.use(requireAuth);
  router.get("/overview", (req, res) => {
    const userId = req.authUser.id;
    const confirmedEnrolments = db.prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.enrolled_at, e.confirmed_at, e.completed_at,
               c.title, c.category_slug, c.category_name, c.duration, c.fee_display, c.is_free, c.certificate_label
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        WHERE e.user_id = ? AND e.status = 'Confirmed'
        ORDER BY COALESCE(e.confirmed_at, e.enrolled_at) DESC
      `).all(userId);
    const pendingEnrolments = db.prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.status as enrolment_status, e.enrolled_at,
               c.title, c.category_name, c.fee_display, p.status as payment_status, p.transaction_id
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        LEFT JOIN payments p ON p.enrolment_id = e.id
        WHERE e.user_id = ? AND e.status = 'Pending'
        ORDER BY e.enrolled_at DESC
      `).all(userId);
    const coursesWithProgress = confirmedEnrolments.map((enr) => {
      const progress = getCourseProgressForUser(userId, enr.course_code);
      const catalogCourse = getCourseByCodeOrSlug(enr.course_code);
      return {
        ...enr,
        imageUrl: catalogCourse?.imageUrl || "",
        imageAlt: catalogCourse?.imageAlt || enr.title,
        ...progress
      };
    });
    const certsCount = db.prepare("SELECT COUNT(*) as c FROM certificates WHERE user_id = ? AND status = 'Issued'").get(userId);
    const pendingAssignments = db.prepare(`
        SELECT COUNT(a.id) as c
        FROM assignments a
        JOIN enrolments e ON e.course_code = a.course_code AND e.user_id = ? AND e.status = 'Confirmed'
        LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
        WHERE a.is_published = 1 AND (s.id IS NULL OR s.status IN ('Pending', 'Revision Required'))
      `).get(userId, userId);
    const recentNotifications = db.prepare(`
        SELECT id, type, title, message, link, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5
      `).all(userId);
    const unreadCount = db.prepare("SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0").get(userId);
    const inProgressCount = coursesWithProgress.filter((c) => c.statusLabel === "In Progress").length;
    const completedCount = coursesWithProgress.filter((c) => c.statusLabel === "Completed").length;
    res.json({
      kpis: {
        enrolledCount: coursesWithProgress.length,
        inProgressCount,
        completedCount,
        certificatesCount: certsCount.c,
        pendingAssignmentsCount: pendingAssignments.c,
        unreadNotificationsCount: unreadCount.c
      },
      continueLearning: coursesWithProgress,
      pendingEnrolments,
      recentNotifications,
      profileCompletion: req.authUser.profileCompletion
    });
  });
  router.get("/profile", (req, res) => {
    res.json({ user: buildUserDto(req.authUser.id) });
  });
  router.put("/profile", (req, res) => {
    const userId = req.authUser.id;
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : req.authUser.name;
    const phone = typeof body.phone === "string" ? body.phone.trim() : req.authUser.phone;
    const country = typeof body.country === "string" ? body.country.trim() : req.authUser.country;
    const city = typeof body.city === "string" ? body.city.trim() : req.authUser.city;
    const profession = typeof body.profession === "string" ? body.profession.trim() : req.authUser.profession;
    const organisation = typeof body.organisation === "string" ? body.organisation.trim() : req.authUser.organisation;
    const educationalBackground = typeof body.educationalBackground === "string" ? body.educationalBackground.trim() : req.authUser.educationalBackground;
    const linkedinUrl = typeof body.linkedinUrl === "string" ? body.linkedinUrl.trim() : req.authUser.linkedinUrl;
    const identity = typeof body.identity === "string" ? body.identity.trim() : req.authUser.identity;
    const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 300) : req.authUser.bio;
    const interests = Array.isArray(body.interests) ? body.interests.filter((x) => typeof x === "string") : req.authUser.interests;
    const emailUpdates = typeof body.emailUpdates === "boolean" ? body.emailUpdates : req.authUser.emailUpdates;
    const prefs = body.prefs && typeof body.prefs === "object" ? body.prefs : req.authUser.prefs;
    if (name.length < 2 || name.length > 120) {
      res.status(400).json({ error: "Full name must be between 2 and 120 characters." });
      return;
    }
    if (linkedinUrl && !/^https?:\/\/.+/i.test(linkedinUrl)) {
      res.status(400).json({ error: "LinkedIn URL must start with http:// or https://." });
      return;
    }
    db.prepare(`
      UPDATE user_profiles
      SET full_name = ?, phone = ?, country = ?, city = ?, profession = ?,
          organisation = ?, educational_background = ?, linkedin_url = ?,
          identity_role = ?, bio = ?, interests_json = ?, email_updates = ?,
          prefs_json = ?, updated_at = ?
      WHERE user_id = ?
    `).run(
      name,
      phone,
      country || "Bangladesh",
      city,
      profession,
      organisation,
      educationalBackground,
      linkedinUrl,
      identity,
      bio,
      JSON.stringify(interests),
      emailUpdates ? 1 : 0,
      JSON.stringify(prefs),
      (/* @__PURE__ */ new Date()).toISOString(),
      userId
    );
    res.json({
      user: buildUserDto(userId),
      message: "Profile updated successfully."
    });
  });
  router.post("/profile/avatar", (req, res) => {
    const userId = req.authUser.id;
    const mimeType = typeof req.body?.mimeType === "string" ? req.body.mimeType.trim() : "";
    const dataBase64 = typeof req.body?.dataBase64 === "string" ? req.body.dataBase64.trim() : "";
    const allowed = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp"
    };
    const ext = allowed[mimeType];
    if (!ext || !dataBase64) {
      res.status(400).json({ error: "Only PNG, JPEG, or WEBP profile images are supported." });
      return;
    }
    const cleanedBase64 = dataBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
    const buffer = Buffer.from(cleanedBase64, "base64");
    if (buffer.length === 0 || buffer.length > 2 * 1024 * 1024) {
      res.status(400).json({ error: "Profile photograph must be under 2 MB." });
      return;
    }
    const isPng = buffer.length >= 4 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71;
    const isJpg = buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
    const isWebp = buffer.length >= 12 && buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WEBP";
    if (ext === "png" && !isPng || ext === "jpg" && !isJpg || ext === "webp" && !isWebp) {
      res.status(400).json({ error: "Uploaded file does not match its declared image format." });
      return;
    }
    const filename = `${userId}_${crypto4.randomBytes(6).toString("hex")}.${ext}`;
    const targetPath = path2.join(AVATARS_DIR, filename);
    const prevAvatar = req.authUser.avatarUrl;
    if (prevAvatar && prevAvatar.startsWith("/api/files/avatars/")) {
      const oldName = path2.basename(prevAvatar);
      const oldPath = path2.join(AVATARS_DIR, oldName);
      if (fs2.existsSync(oldPath)) {
        try {
          fs2.unlinkSync(oldPath);
        } catch {
        }
      }
    }
    fs2.writeFileSync(targetPath, buffer);
    const avatarUrl = `/api/files/avatars/${filename}`;
    db.prepare("UPDATE user_profiles SET avatar_url = ?, updated_at = ? WHERE user_id = ?").run(
      avatarUrl,
      (/* @__PURE__ */ new Date()).toISOString(),
      userId
    );
    res.json({
      avatarUrl,
      user: buildUserDto(userId),
      message: "Profile photograph updated."
    });
  });
  router.get("/courses", (req, res) => {
    const userId = req.authUser.id;
    const filter = typeof req.query.status === "string" ? req.query.status : "all";
    const confirmedRows = db.prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.enrolled_at, e.confirmed_at, e.completed_at,
               c.title, c.category_slug, c.category_name, c.duration, c.fee_display, c.is_free, c.certificate_label
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        WHERE e.user_id = ? AND e.status = 'Confirmed'
        ORDER BY COALESCE(e.confirmed_at, e.enrolled_at) DESC
      `).all(userId);
    const mapped = confirmedRows.map((enr) => {
      const progress = getCourseProgressForUser(userId, enr.course_code);
      const eligibility = evaluateCertificateEligibility(userId, enr.course_code);
      const catalogCourse = getCourseByCodeOrSlug(enr.course_code);
      return {
        ...enr,
        imageUrl: catalogCourse?.imageUrl || "",
        imageAlt: catalogCourse?.imageAlt || enr.title,
        ...progress,
        certificateEligible: eligibility?.eligible ?? false,
        existingCertificate: eligibility?.existingCertificate || null
      };
    });
    const filtered = mapped.filter((c) => {
      if (filter === "not_started") return c.statusLabel === "Not Started";
      if (filter === "in_progress") return c.statusLabel === "In Progress";
      if (filter === "completed") return c.statusLabel === "Completed";
      return true;
    });
    const pendingRows = db.prepare(`
        SELECT e.id, e.reference_id, e.course_code, e.status as enrolment_status, e.enrolled_at,
               c.title, c.category_name, c.fee_display, p.payment_method, p.transaction_id, p.status as payment_status
        FROM enrolments e
        JOIN courses c ON c.code = e.course_code
        LEFT JOIN payments p ON p.enrolment_id = e.id
        WHERE e.user_id = ? AND e.status != 'Confirmed'
        ORDER BY e.enrolled_at DESC
      `).all(userId);
    res.json({
      courses: filtered,
      allConfirmedCount: mapped.length,
      pendingOrOtherEnrolments: pendingRows
    });
  });
  router.get("/learning/:courseCode", (req, res) => {
    const userId = req.authUser.id;
    const courseCode = req.params.courseCode;
    const enrolment = db.prepare(`
        SELECT id, status, enrolled_at, confirmed_at
        FROM enrolments
        WHERE user_id = ? AND course_code = ?
        ORDER BY created_at DESC
        LIMIT 1
      `).get(userId, courseCode);
    if (!enrolment) {
      res.status(403).json({
        error: "You are not enrolled in this course. Enrol first to access learning materials."
      });
      return;
    }
    if (enrolment.status !== "Confirmed") {
      res.status(403).json({
        error: enrolment.status === "Pending" ? "Your enrolment is pending payment verification. Access will be unlocked once payment is confirmed." : `This enrolment is currently marked as ${enrolment.status}.`,
        enrolmentStatus: enrolment.status
      });
      return;
    }
    const catalogCourse = getCourseByCodeOrSlug(courseCode);
    const dbCourse = db.prepare("SELECT code, title, category_name, duration, certificate_label FROM courses WHERE code = ?").get(courseCode);
    const modules = db.prepare(`
        SELECT id, title, description, sort_order
        FROM course_modules
        WHERE course_code = ? AND is_published = 1
        ORDER BY sort_order ASC, created_at ASC
      `).all(courseCode);
    const lessons = db.prepare(`
        SELECT id, module_id, title, summary, content_markdown, video_url, duration_minutes, sort_order
        FROM lessons
        WHERE course_code = ? AND is_published = 1
        ORDER BY sort_order ASC, created_at ASC
      `).all(courseCode);
    const resources = db.prepare(`
        SELECT id, lesson_id, title, resource_type, file_url, file_name, created_at
        FROM learning_resources
        WHERE course_code = ?
        ORDER BY created_at ASC
      `).all(courseCode);
    const completedRows = db.prepare("SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_code = ?").all(userId, courseCode);
    const bookmarkRows = db.prepare("SELECT lesson_id FROM lesson_bookmarks WHERE user_id = ?").all(userId);
    const quizzesRaw = db.prepare(`
        SELECT id, title, instructions, passing_score, questions_json
        FROM quizzes
        WHERE course_code = ? AND is_published = 1
        ORDER BY created_at ASC
      `).all(courseCode);
    const quizzes = quizzesRaw.map((q) => {
      let questions = [];
      try {
        const parsed = JSON.parse(q.questions_json || "[]");
        if (Array.isArray(parsed)) {
          questions = parsed.map((item, idx) => ({
            id: String(item.id || idx),
            prompt: String(item.prompt || ""),
            options: Array.isArray(item.options) ? item.options.map(String) : []
          }));
        }
      } catch {
        questions = [];
      }
      const attempts = db.prepare(
        "SELECT id, score_percent, passed, submitted_at FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY submitted_at DESC LIMIT 5"
      ).all(q.id, userId);
      return {
        id: q.id,
        title: q.title,
        instructions: q.instructions,
        passingScore: q.passing_score,
        questions,
        attempts
      };
    });
    const structuredModules = modules.map((m) => ({
      ...m,
      lessons: lessons.filter((l) => l.module_id === m.id)
    }));
    const progress = getCourseProgressForUser(userId, courseCode);
    res.json({
      course: {
        ...dbCourse,
        overview: catalogCourse?.overview || "",
        imageUrl: catalogCourse?.imageUrl || "",
        syllabusOutline: catalogCourse?.modules || []
      },
      modules: structuredModules,
      materialsComingSoon: structuredModules.every((m) => m.lessons.length === 0),
      resources,
      quizzes,
      completedLessonIds: completedRows.map((r) => r.lesson_id),
      bookmarkedLessonIds: bookmarkRows.map((r) => r.lesson_id),
      progress
    });
  });
  router.post("/learning/lessons/:lessonId/complete", (req, res) => {
    const userId = req.authUser.id;
    const lessonId = req.params.lessonId;
    const completed = req.body?.completed !== false;
    const lesson = db.prepare(`
        SELECT l.id, l.course_code, l.title
        FROM lessons l
        JOIN course_modules m ON m.id = l.module_id
        WHERE l.id = ? AND l.is_published = 1 AND m.is_published = 1
      `).get(lessonId);
    if (!lesson) {
      res.status(404).json({ error: "Lesson not found or not published." });
      return;
    }
    const enrolment = db.prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'").get(userId, lesson.course_code);
    if (!enrolment) {
      res.status(403).json({ error: "Confirmed enrolment is required to record lesson progress." });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (completed) {
      db.prepare(`
        INSERT OR IGNORE INTO lesson_progress (user_id, lesson_id, course_code, completed_at)
        VALUES (?, ?, ?, ?)
      `).run(userId, lessonId, lesson.course_code, now);
    } else {
      db.prepare("DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").run(userId, lessonId);
    }
    const progress = getCourseProgressForUser(userId, lesson.course_code);
    if (progress.totalPublishedLessons > 0 && progress.progressPercent === 100) {
      db.prepare("UPDATE enrolments SET completed_at = COALESCE(completed_at, ?) WHERE id = ?").run(
        now,
        enrolment.id
      );
    }
    res.json({ ok: true, progress });
  });
  router.post("/learning/lessons/:lessonId/bookmark", (req, res) => {
    const userId = req.authUser.id;
    const lessonId = req.params.lessonId;
    const existing = db.prepare("SELECT lesson_id FROM lesson_bookmarks WHERE user_id = ? AND lesson_id = ?").get(userId, lessonId);
    if (existing) {
      db.prepare("DELETE FROM lesson_bookmarks WHERE user_id = ? AND lesson_id = ?").run(userId, lessonId);
      res.json({ bookmarked: false });
    } else {
      db.prepare("INSERT INTO lesson_bookmarks (user_id, lesson_id, created_at) VALUES (?, ?, ?)").run(
        userId,
        lessonId,
        (/* @__PURE__ */ new Date()).toISOString()
      );
      res.json({ bookmarked: true });
    }
  });
  router.get("/assignments", (req, res) => {
    const userId = req.authUser.id;
    const assignments = db.prepare(`
        SELECT a.id, a.course_code, c.title as course_title, a.title, a.instructions,
               a.due_at, a.max_points, a.allow_file_upload, a.created_at,
               s.id as submission_id, s.submission_text, s.file_name, s.file_size,
               s.status as submission_status, s.score, s.feedback, s.submitted_at, s.reviewed_at
        FROM assignments a
        JOIN courses c ON c.code = a.course_code
        JOIN enrolments e ON e.course_code = a.course_code AND e.user_id = ? AND e.status = 'Confirmed'
        LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
        WHERE a.is_published = 1
        ORDER BY COALESCE(a.due_at, a.created_at) ASC
      `).all(userId, userId);
    const quizHistory = db.prepare(`
        SELECT qa.id, qa.quiz_id, q.title as quiz_title, q.course_code, c.title as course_title,
               q.passing_score, qa.score_percent, qa.passed, qa.submitted_at
        FROM quiz_attempts qa
        JOIN quizzes q ON q.id = qa.quiz_id
        JOIN courses c ON c.code = q.course_code
        WHERE qa.user_id = ?
        ORDER BY qa.submitted_at DESC
      `).all(userId);
    res.json({ assignments, quizHistory });
  });
  router.post("/assignments/:id/submit", (req, res) => {
    const userId = req.authUser.id;
    const assignmentId = req.params.id;
    const submissionText = typeof req.body?.submissionText === "string" ? req.body.submissionText.trim() : "";
    const filePayload = req.body?.file;
    const assignment = db.prepare("SELECT id, course_code, title, allow_file_upload FROM assignments WHERE id = ? AND is_published = 1").get(assignmentId);
    if (!assignment) {
      res.status(404).json({ error: "Assignment not found or not currently open." });
      return;
    }
    const enrolment = db.prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'").get(userId, assignment.course_code);
    if (!enrolment) {
      res.status(403).json({ error: "Confirmed enrolment in this course is required to submit." });
      return;
    }
    const existingSub = db.prepare("SELECT id, status, file_path FROM submissions WHERE assignment_id = ? AND user_id = ?").get(assignmentId, userId);
    if (existingSub && existingSub.status === "Reviewed") {
      res.status(403).json({
        error: "This submission has already been reviewed and locked by an instructor."
      });
      return;
    }
    let storedFilePath = existingSub?.file_path || "";
    let storedFileName = "";
    let storedFileSize = 0;
    let storedMime = "";
    if (filePayload && filePayload.dataBase64) {
      if (!assignment.allow_file_upload) {
        res.status(400).json({ error: "File upload is not enabled for this assignment." });
        return;
      }
      const rawName = typeof filePayload.fileName === "string" ? path2.basename(filePayload.fileName) : "submission";
      const ext = path2.extname(rawName).toLowerCase();
      const allowedExts = [".pdf", ".doc", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".zip"];
      if (!allowedExts.includes(ext)) {
        res.status(400).json({
          error: "Unsupported file format. Allowed formats: PDF, DOC, DOCX, TXT, PNG, JPG, ZIP."
        });
        return;
      }
      const cleaned = filePayload.dataBase64.replace(/^data:[^;]+;base64,/, "");
      const buf = Buffer.from(cleaned, "base64");
      if (buf.length === 0 || buf.length > 5 * 1024 * 1024) {
        res.status(400).json({ error: "Uploaded assignment file must be between 1 byte and 5 MB." });
        return;
      }
      const safeDiskName = `${assignmentId}_${userId}_${crypto4.randomBytes(4).toString("hex")}${ext}`;
      const diskPath = path2.join(SUBMISSIONS_DIR, safeDiskName);
      fs2.writeFileSync(diskPath, buf);
      storedFilePath = safeDiskName;
      storedFileName = rawName.slice(0, 120);
      storedFileSize = buf.length;
      storedMime = typeof filePayload.mimeType === "string" ? filePayload.mimeType.slice(0, 100) : "application/octet-stream";
    }
    if (submissionText.length < 10 && !storedFilePath) {
      res.status(400).json({
        error: "Please enter a written response (at least 10 characters) or upload a valid file."
      });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const subId = existingSub?.id || `sub_${crypto4.randomBytes(6).toString("hex")}`;
    if (existingSub) {
      db.prepare(`
        UPDATE submissions
        SET submission_text = ?,
            file_path = CASE WHEN ? != '' THEN ? ELSE file_path END,
            file_name = CASE WHEN ? != '' THEN ? ELSE file_name END,
            file_size = CASE WHEN ? > 0 THEN ? ELSE file_size END,
            mime_type = CASE WHEN ? != '' THEN ? ELSE mime_type END,
            status = 'Submitted',
            submitted_at = ?
        WHERE id = ?
      `).run(
        submissionText,
        storedFileName,
        storedFilePath,
        storedFileName,
        storedFileName,
        storedFileSize,
        storedFileSize,
        storedMime,
        storedMime,
        now,
        subId
      );
    } else {
      db.prepare(`
        INSERT INTO submissions (
          id, assignment_id, user_id, submission_text, file_path, file_name,
          file_size, mime_type, status, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)
      `).run(
        subId,
        assignmentId,
        userId,
        submissionText,
        storedFilePath,
        storedFileName,
        storedFileSize,
        storedMime,
        now
      );
    }
    createNotification({
      userId,
      type: "assignment",
      title: "Assignment Submitted",
      message: `Your submission for "${assignment.title}" has been recorded and awaits instructor review.`,
      link: "/dashboard/assignments"
    });
    res.status(201).json({
      id: subId,
      status: "Submitted",
      submittedAt: now,
      message: "Assignment submitted successfully."
    });
  });
  router.post("/quizzes/:id/attempt", (req, res) => {
    const userId = req.authUser.id;
    const quizId = req.params.id;
    const answers = req.body?.answers;
    const quiz = db.prepare("SELECT id, course_code, title, passing_score, questions_json FROM quizzes WHERE id = ? AND is_published = 1").get(quizId);
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found or not published." });
      return;
    }
    const enrolment = db.prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'").get(userId, quiz.course_code);
    if (!enrolment) {
      res.status(403).json({ error: "Confirmed enrolment is required to take this assessment." });
      return;
    }
    let questions = [];
    try {
      questions = JSON.parse(quiz.questions_json || "[]");
    } catch {
      questions = [];
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ error: "This quiz currently has no published questions." });
      return;
    }
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const key = String(q.id || idx);
      const selected = Array.isArray(answers) ? answers[idx] : answers?.[key];
      if (typeof selected === "number" && selected === q.correctIndex) {
        correctCount += 1;
      }
    });
    const scorePercent = Math.round(correctCount / questions.length * 100);
    const passed = scorePercent >= quiz.passing_score ? 1 : 0;
    const attemptId = `qat_${crypto4.randomBytes(6).toString("hex")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      INSERT INTO quiz_attempts (id, quiz_id, user_id, answers_json, score_percent, passed, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(attemptId, quizId, userId, JSON.stringify(answers || {}), scorePercent, passed, now);
    createNotification({
      userId,
      type: "assessment",
      title: `Quiz Result: ${quiz.title}`,
      message: `You scored ${scorePercent}% (${passed ? "Passed" : "Did not meet passing score"}).`,
      link: `/dashboard/learning/${quiz.course_code}`
    });
    res.status(201).json({
      id: attemptId,
      scorePercent,
      passed: passed === 1,
      passingScore: quiz.passing_score,
      correctCount,
      totalQuestions: questions.length,
      submittedAt: now
    });
  });
  router.get("/certificates", (req, res) => {
    const userId = req.authUser.id;
    const certificates = db.prepare(`
        SELECT cert.id, cert.certificate_code, cert.course_code, cert.certificate_title,
               cert.holder_name, cert.category_name, cert.status, cert.issued_at,
               c.duration
        FROM certificates cert
        JOIN courses c ON c.code = cert.course_code
        WHERE cert.user_id = ?
        ORDER BY cert.issued_at DESC
      `).all(userId);
    const confirmedCourses = db.prepare("SELECT course_code FROM enrolments WHERE user_id = ? AND status = 'Confirmed'").all(userId);
    const eligibility = confirmedCourses.map((r) => evaluateCertificateEligibility(userId, r.course_code)).filter(Boolean);
    res.json({ certificates, eligibility });
  });
  router.post("/certificates/:courseCode/request", (req, res) => {
    const userId = req.authUser.id;
    const courseCode = req.params.courseCode;
    const enrolment = db.prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'").get(userId, courseCode);
    if (!enrolment) {
      res.status(403).json({ error: "Confirmed course enrolment is required before certificate issuance." });
      return;
    }
    const evaluation = evaluateCertificateEligibility(userId, courseCode);
    if (!evaluation) {
      res.status(404).json({ error: "Course not found." });
      return;
    }
    if (evaluation.existingCertificate) {
      res.json({ certificate: evaluation.existingCertificate, alreadyIssued: true });
      return;
    }
    if (!evaluation.eligible) {
      res.status(400).json({
        error: "Certificate criteria have not yet been met.",
        reasons: evaluation.unmetReasons
      });
      return;
    }
    const certCode = `AAE-CERT-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${crypto4.randomBytes(3).toString("hex").toUpperCase()}`;
    const certId = `crt_${crypto4.randomBytes(6).toString("hex")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      INSERT INTO certificates (
        id, certificate_code, user_id, course_code, certificate_title,
        holder_name, category_name, status, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Issued', ?)
    `).run(
      certId,
      certCode,
      userId,
      courseCode,
      evaluation.certificateLabel,
      req.authUser.name,
      evaluation.categoryName,
      now
    );
    createNotification({
      userId,
      type: "certificate",
      title: "Certificate Issued",
      message: `Your ${evaluation.certificateLabel} for ${evaluation.courseTitle} (${certCode}) is now available.`,
      link: "/dashboard/certificates"
    });
    res.status(201).json({
      certificate: {
        id: certId,
        certificate_code: certCode,
        course_code: courseCode,
        certificate_title: evaluation.certificateLabel,
        holder_name: req.authUser.name,
        category_name: evaluation.categoryName,
        status: "Issued",
        issued_at: now
      }
    });
  });
  router.get("/payments", (req, res) => {
    const userId = req.authUser.id;
    const rows = db.prepare(`
        SELECT p.id, p.reference_id, p.course_code, c.title as course_title, c.category_name,
               p.amount_display, p.amount_bdt, p.payment_method, p.payment_number,
               p.sender_phone, p.transaction_id, p.status as payment_status,
               p.verified_at, p.created_at, e.status as enrolment_status
        FROM payments p
        JOIN courses c ON c.code = p.course_code
        JOIN enrolments e ON e.id = p.enrolment_id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `).all(userId);
    res.json({ payments: rows });
  });
  router.get("/payments/:referenceId/receipt", (req, res) => {
    const userId = req.authUser.id;
    const referenceId = req.params.referenceId;
    const row = db.prepare(`
        SELECT p.reference_id, p.course_code, c.title as course_title, c.category_name,
               p.amount_display, p.amount_bdt, p.payment_method, p.payment_number,
               p.transaction_id, p.status as payment_status, p.verified_at, p.created_at,
               e.applicant_name, e.applicant_email, e.status as enrolment_status
        FROM payments p
        JOIN courses c ON c.code = p.course_code
        JOIN enrolments e ON e.id = p.enrolment_id
        WHERE p.reference_id = ? AND p.user_id = ?
      `).get(referenceId, userId);
    if (!row) {
      res.status(404).json({ error: "Receipt not found." });
      return;
    }
    if (row.payment_status !== "Paid" && row.payment_method !== "free") {
      res.status(403).json({
        error: "Official receipt is only available after payment verification is confirmed."
      });
      return;
    }
    res.json({
      receipt: {
        ...row,
        issuer: "Atlas AI Education (Atlas AI Institute)",
        disclosure: "Non-accredited educational programme fee receipt. Verified internal reference."
      }
    });
  });
  router.get("/notifications", (req, res) => {
    const userId = req.authUser.id;
    const notifications = db.prepare(`
        SELECT id, type, title, message, link, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 100
      `).all(userId);
    const unreadCount = db.prepare("SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0").get(userId);
    res.json({ notifications, unreadCount: unreadCount.c });
  });
  router.post("/notifications/:id/read", (req, res) => {
    db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(
      req.params.id,
      req.authUser.id
    );
    res.json({ ok: true });
  });
  router.post("/notifications/read-all", (req, res) => {
    db.prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0").run(
      req.authUser.id
    );
    res.json({ ok: true });
  });
  router.post("/saved/:type/:key", (req, res) => {
    const userId = req.authUser.id;
    const type = req.params.type;
    const key = req.params.key;
    if (type !== "programme" && type !== "resource") {
      res.status(400).json({ error: "Invalid bookmark type." });
      return;
    }
    const exists = db.prepare("SELECT item_key FROM saved_items WHERE user_id = ? AND item_type = ? AND item_key = ?").get(userId, type, key);
    if (exists) {
      db.prepare("DELETE FROM saved_items WHERE user_id = ? AND item_type = ? AND item_key = ?").run(
        userId,
        type,
        key
      );
    } else {
      db.prepare("INSERT INTO saved_items (user_id, item_type, item_key, created_at) VALUES (?, ?, ?, ?)").run(
        userId,
        type,
        key,
        (/* @__PURE__ */ new Date()).toISOString()
      );
    }
    res.json(getSavedItemsForUser(userId));
  });
  return router;
}

// server/routes/adminRoutes.ts
import crypto5 from "crypto";
import { Router as Router3 } from "express";
function createAdminRouter() {
  const router = Router3();
  router.use(requireRole("admin", "instructor"));
  router.get("/overview", (_req, res) => {
    const learners = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'learner'").get();
    const confirmedEnrolments = db.prepare("SELECT COUNT(*) as c FROM enrolments WHERE status = 'Confirmed'").get();
    const pendingPayments = db.prepare("SELECT COUNT(*) as c FROM payments WHERE status = 'Pending'").get();
    const pendingSubmissions = db.prepare("SELECT COUNT(*) as c FROM submissions WHERE status IN ('Submitted', 'Under Review')").get();
    const issuedCertificates = db.prepare("SELECT COUNT(*) as c FROM certificates WHERE status = 'Issued'").get();
    const pendingScholarships = db.prepare("SELECT COUNT(*) as c FROM scholarship_applications WHERE status IN ('Submitted', 'Under Review')").get();
    res.json({
      learnersCount: learners.c,
      confirmedEnrolmentsCount: confirmedEnrolments.c,
      pendingPaymentsCount: pendingPayments.c,
      pendingSubmissionsCount: pendingSubmissions.c,
      issuedCertificatesCount: issuedCertificates.c,
      pendingScholarshipsCount: pendingScholarships.c
    });
  });
  router.get("/learners", (req, res) => {
    const search = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const statusFilter = typeof req.query.status === "string" ? req.query.status.trim() : "";
    let sql = `
      SELECT u.id, u.email, u.role, u.status, u.email_verified, u.created_at,
             p.full_name, p.phone, p.country, p.city, p.profession,
             (SELECT COUNT(*) FROM enrolments e WHERE e.user_id = u.id AND e.status = 'Confirmed') as confirmed_courses_count,
             (SELECT COUNT(*) FROM certificates cert WHERE cert.user_id = u.id AND cert.status = 'Issued') as certificates_count
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.role = 'learner'
    `;
    const params = [];
    if (search) {
      sql += ` AND (LOWER(u.email) LIKE LOWER(?) OR LOWER(p.full_name) LIKE LOWER(?))`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (statusFilter && ["active", "suspended", "deletion_requested"].includes(statusFilter)) {
      sql += ` AND u.status = ?`;
      params.push(statusFilter);
    }
    sql += ` ORDER BY u.created_at DESC LIMIT 200`;
    const learners = db.prepare(sql).all(...params);
    res.json({ learners });
  });
  router.patch("/learners/:id/status", requireRole("admin"), (req, res) => {
    const targetId = req.params.id;
    const status = req.body?.status;
    if (status !== "active" && status !== "suspended") {
      res.status(400).json({ error: 'Status must be "active" or "suspended".' });
      return;
    }
    const row = db.prepare("SELECT id, role FROM users WHERE id = ?").get(targetId);
    if (!row || row.role !== "learner") {
      res.status(404).json({ error: "Learner account not found." });
      return;
    }
    db.prepare("UPDATE users SET status = ?, updated_at = ? WHERE id = ?").run(
      status,
      (/* @__PURE__ */ new Date()).toISOString(),
      targetId
    );
    if (status === "suspended") {
      db.prepare("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL").run(
        (/* @__PURE__ */ new Date()).toISOString(),
        targetId
      );
    }
    res.json({ ok: true, status });
  });
  router.get("/enrolments", requireRole("admin"), (req, res) => {
    const status = typeof req.query.status === "string" ? req.query.status.trim() : "";
    let sql = `
      SELECT e.id, e.reference_id, e.user_id, e.applicant_name, e.applicant_email,
             e.applicant_phone, e.course_code, c.title as course_title, c.max_seats,
             e.status as enrolment_status, e.enrolled_at, e.confirmed_at,
             p.id as payment_id, p.amount_display, p.payment_method, p.sender_phone,
             p.transaction_id, p.status as payment_status, p.verified_at
      FROM enrolments e
      JOIN courses c ON c.code = e.course_code
      LEFT JOIN payments p ON p.enrolment_id = e.id
    `;
    const params = [];
    if (status && ["Pending", "Confirmed", "Rejected", "Cancelled"].includes(status)) {
      sql += " WHERE e.status = ?";
      params.push(status);
    }
    sql += " ORDER BY e.created_at DESC LIMIT 300";
    const enrolments = db.prepare(sql).all(...params);
    res.json({ enrolments });
  });
  router.post("/enrolments/:id/verify", requireRole("admin"), (req, res) => {
    const enrolmentId = req.params.id;
    const action = req.body?.action;
    if (!["approve", "reject", "refund"].includes(action)) {
      res.status(400).json({ error: 'Action must be "approve", "reject", or "refund".' });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.exec("BEGIN IMMEDIATE");
    try {
      const enr = db.prepare(`
          SELECT e.id, e.user_id, e.course_code, e.status, e.reference_id,
                 c.title as course_title, c.max_seats, c.is_free
          FROM enrolments e
          JOIN courses c ON c.code = e.course_code
          WHERE e.id = ?
        `).get(enrolmentId);
      if (!enr) {
        db.exec("ROLLBACK");
        res.status(404).json({ error: "Enrolment record not found." });
        return;
      }
      if (action === "approve") {
        if (enr.status !== "Confirmed" && enr.max_seats !== null) {
          const confirmed = db.prepare("SELECT COUNT(*) as c FROM enrolments WHERE course_code = ? AND status = 'Confirmed'").get(enr.course_code);
          if (confirmed.c >= enr.max_seats) {
            db.exec("ROLLBACK");
            res.status(409).json({
              error: `Seat capacity reached (${enr.max_seats}/${enr.max_seats}) for ${enr.course_code}. Increase capacity before confirming another learner.`
            });
            return;
          }
        }
        db.prepare("UPDATE enrolments SET status = 'Confirmed', confirmed_at = ? WHERE id = ?").run(
          now,
          enr.id
        );
        db.prepare("UPDATE payments SET status = 'Paid', verified_by = ?, verified_at = ? WHERE enrolment_id = ?").run(
          req.authUser.id,
          now,
          enr.id
        );
        if (enr.user_id) {
          createNotification({
            userId: enr.user_id,
            type: "payment",
            title: `Enrolment Confirmed: ${enr.course_title}`,
            message: `Your payment (${enr.reference_id}) has been verified and access to the Learning Centre is now unlocked.`,
            link: `/dashboard/learning/${enr.course_code}`
          });
        }
      } else if (action === "reject") {
        db.prepare("UPDATE enrolments SET status = 'Rejected' WHERE id = ?").run(enr.id);
        db.prepare("UPDATE payments SET status = 'Failed', verified_by = ?, verified_at = ? WHERE enrolment_id = ?").run(
          req.authUser.id,
          now,
          enr.id
        );
        if (enr.user_id) {
          createNotification({
            userId: enr.user_id,
            type: "payment",
            title: `Payment Verification Failed: ${enr.course_title}`,
            message: `We could not verify Transaction ID for reference ${enr.reference_id}. Please check Payments History or contact support.`,
            link: "/dashboard/payments"
          });
        }
      } else if (action === "refund") {
        db.prepare("UPDATE enrolments SET status = 'Cancelled' WHERE id = ?").run(enr.id);
        db.prepare("UPDATE payments SET status = 'Refunded', verified_by = ?, verified_at = ? WHERE enrolment_id = ?").run(
          req.authUser.id,
          now,
          enr.id
        );
        if (enr.user_id) {
          createNotification({
            userId: enr.user_id,
            type: "payment",
            title: `Payment Refunded: ${enr.course_title}`,
            message: `Reference ${enr.reference_id} has been marked as Refunded and enrolment access has been closed.`,
            link: "/dashboard/payments"
          });
        }
      }
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    res.json({ ok: true, action });
  });
  router.get("/courses", (_req, res) => {
    const courses = db.prepare(`
        SELECT c.*,
               (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count,
               (SELECT COUNT(*) FROM course_modules m WHERE m.course_code = c.code AND m.is_published = 1) as published_modules_count,
               (SELECT COUNT(*) FROM lessons l WHERE l.course_code = c.code AND l.is_published = 1) as published_lessons_count
        FROM courses c
        ORDER BY c.category_slug, c.code
      `).all();
    res.json({ courses });
  });
  router.patch("/courses/:code", requireRole("admin"), (req, res) => {
    const code = req.params.code;
    const body = req.body || {};
    const existing = db.prepare("SELECT code, max_seats FROM courses WHERE code = ?").get(code);
    if (!existing) {
      res.status(404).json({ error: "Course not found." });
      return;
    }
    const maxSeats = body.maxSeats === null ? null : typeof body.maxSeats === "number" && Number.isInteger(body.maxSeats) && body.maxSeats >= 0 ? body.maxSeats : existing.max_seats;
    const isPublished = typeof body.isPublished === "boolean" ? body.isPublished ? 1 : 0 : null;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      UPDATE courses
      SET max_seats = ?,
          require_lessons_complete = COALESCE(?, require_lessons_complete),
          require_assignments_complete = COALESCE(?, require_assignments_complete),
          require_quiz_pass = COALESCE(?, require_quiz_pass),
          min_quiz_score = COALESCE(?, min_quiz_score),
          is_published = COALESCE(?, is_published),
          updated_at = ?
      WHERE code = ?
    `).run(
      maxSeats,
      typeof body.requireLessonsComplete === "boolean" ? body.requireLessonsComplete ? 1 : 0 : null,
      typeof body.requireAssignmentsComplete === "boolean" ? body.requireAssignmentsComplete ? 1 : 0 : null,
      typeof body.requireQuizPass === "boolean" ? body.requireQuizPass ? 1 : 0 : null,
      typeof body.minQuizScore === "number" ? Math.max(0, Math.min(100, Math.round(body.minQuizScore))) : null,
      isPublished,
      now,
      code
    );
    if (isPublished !== null || typeof body.indexStatus === "string") {
      const requestedIndex = isPublished === 0 ? "noindex" : body.indexStatus === "noindex" ? "noindex" : body.indexStatus === "indexed" ? "indexed" : null;
      db.prepare(`
        UPDATE course_seo_metadata
        SET is_published = COALESCE(?, is_published),
            index_status = COALESCE(?, index_status),
            last_optimized_at = ?
        WHERE course_code = ?
      `).run(isPublished, requestedIndex, now, code);
    }
    res.json({ ok: true });
  });
  router.get("/courses/:code/content", (req, res) => {
    const code = req.params.code;
    const modules = db.prepare("SELECT * FROM course_modules WHERE course_code = ? ORDER BY sort_order ASC, created_at ASC").all(code);
    const lessons = db.prepare("SELECT * FROM lessons WHERE course_code = ? ORDER BY sort_order ASC, created_at ASC").all(code);
    const resources = db.prepare("SELECT * FROM learning_resources WHERE course_code = ? ORDER BY created_at ASC").all(code);
    const assignments = db.prepare("SELECT * FROM assignments WHERE course_code = ? ORDER BY created_at ASC").all(code);
    const quizzes = db.prepare("SELECT * FROM quizzes WHERE course_code = ? ORDER BY created_at ASC").all(code);
    res.json({ modules, lessons, resources, assignments, quizzes });
  });
  router.post("/courses/:code/modules", (req, res) => {
    const code = req.params.code;
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const description = typeof req.body?.description === "string" ? req.body.description.trim() : "";
    const sortOrder = Number(req.body?.sortOrder || 1);
    const isPublished = req.body?.isPublished !== false ? 1 : 0;
    if (title.length < 2) {
      res.status(400).json({ error: "Module title is required." });
      return;
    }
    const id = `mod_${crypto5.randomBytes(6).toString("hex")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      INSERT INTO course_modules (id, course_code, title, description, sort_order, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, code, title, description, sortOrder, isPublished, now);
    res.status(201).json({ id, courseCode: code, title, isPublished: isPublished === 1 });
  });
  router.patch("/modules/:id", (req, res) => {
    const { title, description, sortOrder, isPublished } = req.body || {};
    db.prepare(`
      UPDATE course_modules
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          sort_order = COALESCE(?, sort_order),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).run(
      typeof title === "string" ? title.trim() : null,
      typeof description === "string" ? description.trim() : null,
      typeof sortOrder === "number" ? sortOrder : null,
      typeof isPublished === "boolean" ? isPublished ? 1 : 0 : null,
      req.params.id
    );
    res.json({ ok: true });
  });
  router.delete("/modules/:id", (req, res) => {
    db.prepare("DELETE FROM course_modules WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });
  router.post("/modules/:moduleId/lessons", (req, res) => {
    const moduleRow = db.prepare("SELECT id, course_code FROM course_modules WHERE id = ?").get(req.params.moduleId);
    if (!moduleRow) {
      res.status(404).json({ error: "Module not found." });
      return;
    }
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const summary = typeof req.body?.summary === "string" ? req.body.summary.trim() : "";
    const contentMarkdown = typeof req.body?.contentMarkdown === "string" ? req.body.contentMarkdown.trim() : "";
    const videoUrl = typeof req.body?.videoUrl === "string" ? req.body.videoUrl.trim() : "";
    const durationMinutes = typeof req.body?.durationMinutes === "number" ? req.body.durationMinutes : null;
    const sortOrder = Number(req.body?.sortOrder || 1);
    const isPublished = req.body?.isPublished !== false ? 1 : 0;
    if (title.length < 2) {
      res.status(400).json({ error: "Lesson title is required." });
      return;
    }
    const id = `les_${crypto5.randomBytes(6).toString("hex")}`;
    db.prepare(`
      INSERT INTO lessons (
        id, module_id, course_code, title, summary, content_markdown,
        video_url, duration_minutes, sort_order, is_published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      moduleRow.id,
      moduleRow.course_code,
      title,
      summary,
      contentMarkdown,
      videoUrl,
      durationMinutes,
      sortOrder,
      isPublished,
      (/* @__PURE__ */ new Date()).toISOString()
    );
    if (isPublished === 1) {
      const enrolledLearners = db.prepare("SELECT DISTINCT user_id FROM enrolments WHERE course_code = ? AND status = 'Confirmed' AND user_id IS NOT NULL").all(moduleRow.course_code);
      for (const l of enrolledLearners) {
        createNotification({
          userId: l.user_id,
          type: "material",
          title: `New Lesson Published (${moduleRow.course_code})`,
          message: `"${title}" is now available in your Learning Centre.`,
          link: `/dashboard/learning/${moduleRow.course_code}`
        });
      }
    }
    res.status(201).json({ id, title, courseCode: moduleRow.course_code });
  });
  router.patch("/lessons/:id", (req, res) => {
    const { title, summary, contentMarkdown, videoUrl, durationMinutes, isPublished } = req.body || {};
    db.prepare(`
      UPDATE lessons
      SET title = COALESCE(?, title),
          summary = COALESCE(?, summary),
          content_markdown = COALESCE(?, content_markdown),
          video_url = COALESCE(?, video_url),
          duration_minutes = COALESCE(?, duration_minutes),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).run(
      typeof title === "string" ? title.trim() : null,
      typeof summary === "string" ? summary.trim() : null,
      typeof contentMarkdown === "string" ? contentMarkdown.trim() : null,
      typeof videoUrl === "string" ? videoUrl.trim() : null,
      typeof durationMinutes === "number" ? durationMinutes : null,
      typeof isPublished === "boolean" ? isPublished ? 1 : 0 : null,
      req.params.id
    );
    res.json({ ok: true });
  });
  router.delete("/lessons/:id", (req, res) => {
    db.prepare("DELETE FROM lessons WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });
  router.post("/courses/:code/resources", (req, res) => {
    const code = req.params.code;
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const resourceType = ["pdf", "link", "exercise", "note"].includes(req.body?.resourceType) ? req.body.resourceType : "link";
    const fileUrl = typeof req.body?.fileUrl === "string" ? req.body.fileUrl.trim() : "";
    const fileName = typeof req.body?.fileName === "string" ? req.body.fileName.trim() : "";
    if (title.length < 2 || !fileUrl) {
      res.status(400).json({ error: "Resource title and URL are required." });
      return;
    }
    const id = `res_${crypto5.randomBytes(6).toString("hex")}`;
    db.prepare(`
      INSERT INTO learning_resources (id, course_code, title, resource_type, file_url, file_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, code, title, resourceType, fileUrl, fileName, (/* @__PURE__ */ new Date()).toISOString());
    res.status(201).json({ id, title });
  });
  router.delete("/resources/:id", (req, res) => {
    db.prepare("DELETE FROM learning_resources WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });
  router.post("/courses/:code/assignments", (req, res) => {
    const code = req.params.code;
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const instructions = typeof req.body?.instructions === "string" ? req.body.instructions.trim() : "";
    const dueAt = typeof req.body?.dueAt === "string" && req.body.dueAt ? req.body.dueAt : null;
    const maxPoints = Number(req.body?.maxPoints || 100);
    const allowFileUpload = req.body?.allowFileUpload !== false ? 1 : 0;
    const isPublished = req.body?.isPublished !== false ? 1 : 0;
    if (title.length < 2 || instructions.length < 5) {
      res.status(400).json({ error: "Assignment title and instructions are required." });
      return;
    }
    const id = `asg_${crypto5.randomBytes(6).toString("hex")}`;
    db.prepare(`
      INSERT INTO assignments (
        id, course_code, title, instructions, due_at, max_points, allow_file_upload, is_published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      title,
      instructions,
      dueAt,
      maxPoints,
      allowFileUpload,
      isPublished,
      (/* @__PURE__ */ new Date()).toISOString()
    );
    if (isPublished === 1) {
      const enrolledLearners = db.prepare("SELECT DISTINCT user_id FROM enrolments WHERE course_code = ? AND status = 'Confirmed' AND user_id IS NOT NULL").all(code);
      for (const l of enrolledLearners) {
        createNotification({
          userId: l.user_id,
          type: "assignment",
          title: `New Assignment (${code})`,
          message: `"${title}" has been posted in your Assignments tab.`,
          link: "/dashboard/assignments"
        });
      }
    }
    res.status(201).json({ id, title });
  });
  router.delete("/assignments/:id", (req, res) => {
    db.prepare("DELETE FROM assignments WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });
  router.post("/courses/:code/quizzes", (req, res) => {
    const code = req.params.code;
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const instructions = typeof req.body?.instructions === "string" ? req.body.instructions.trim() : "";
    const passingScore = Math.max(1, Math.min(100, Number(req.body?.passingScore || 60)));
    const questions = Array.isArray(req.body?.questions) ? req.body.questions : [];
    const isPublished = req.body?.isPublished !== false ? 1 : 0;
    if (title.length < 2 || questions.length === 0) {
      res.status(400).json({ error: "Quiz title and at least one question are required." });
      return;
    }
    const id = `qiz_${crypto5.randomBytes(6).toString("hex")}`;
    db.prepare(`
      INSERT INTO quizzes (id, course_code, title, instructions, passing_score, questions_json, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      title,
      instructions,
      passingScore,
      JSON.stringify(questions),
      isPublished,
      (/* @__PURE__ */ new Date()).toISOString()
    );
    res.status(201).json({ id, title });
  });
  router.delete("/quizzes/:id", (req, res) => {
    db.prepare("DELETE FROM quizzes WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });
  router.get("/submissions", (req, res) => {
    const status = typeof req.query.status === "string" ? req.query.status : "";
    let sql = `
      SELECT s.id, s.assignment_id, a.title as assignment_title, a.course_code, a.max_points,
             s.user_id, p.full_name as learner_name, u.email as learner_email,
             s.submission_text, s.file_name, s.file_size, s.status, s.score, s.feedback,
             s.submitted_at, s.reviewed_at
      FROM submissions s
      JOIN assignments a ON a.id = s.assignment_id
      JOIN users u ON u.id = s.user_id
      LEFT JOIN user_profiles p ON p.user_id = u.id
    `;
    const params = [];
    if (status) {
      sql += " WHERE s.status = ?";
      params.push(status);
    }
    sql += " ORDER BY s.submitted_at DESC LIMIT 200";
    res.json({ submissions: db.prepare(sql).all(...params) });
  });
  router.patch("/submissions/:id/review", (req, res) => {
    const subId = req.params.id;
    const status = req.body?.status;
    const score = typeof req.body?.score === "number" ? Math.round(req.body.score) : null;
    const feedback = typeof req.body?.feedback === "string" ? req.body.feedback.trim() : "";
    if (!["Under Review", "Reviewed", "Revision Required"].includes(status)) {
      res.status(400).json({ error: "Invalid review status." });
      return;
    }
    const sub = db.prepare(`
        SELECT s.id, s.user_id, a.title as assignment_title
        FROM submissions s
        JOIN assignments a ON a.id = s.assignment_id
        WHERE s.id = ?
      `).get(subId);
    if (!sub) {
      res.status(404).json({ error: "Submission not found." });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      UPDATE submissions
      SET status = ?, score = ?, feedback = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).run(status, score, feedback, req.authUser.id, now, subId);
    createNotification({
      userId: sub.user_id,
      type: "assignment",
      title: `Submission ${status}: ${sub.assignment_title}`,
      message: feedback || `Your submission status has been updated to ${status}.`,
      link: "/dashboard/assignments"
    });
    res.json({ ok: true, status, reviewedAt: now });
  });
  router.get("/certificates", requireRole("admin"), (_req, res) => {
    const certificates = db.prepare(`
        SELECT cert.*, u.email as learner_email, c.title as course_title
        FROM certificates cert
        JOIN users u ON u.id = cert.user_id
        JOIN courses c ON c.code = cert.course_code
        ORDER BY cert.issued_at DESC
      `).all();
    res.json({ certificates });
  });
  router.post("/certificates/issue", requireRole("admin"), (req, res) => {
    const { userId, courseCode } = req.body || {};
    if (!userId || !courseCode) {
      res.status(400).json({ error: "userId and courseCode are required." });
      return;
    }
    const learner = db.prepare("SELECT u.id, p.full_name FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.id = ?").get(userId);
    const course = db.prepare("SELECT code, title, category_name, certificate_label FROM courses WHERE code = ?").get(courseCode);
    if (!learner || !course) {
      res.status(404).json({ error: "Learner or course not found." });
      return;
    }
    const confirmedEnr = db.prepare("SELECT id FROM enrolments WHERE user_id = ? AND course_code = ? AND status = 'Confirmed'").get(userId, courseCode);
    if (!confirmedEnr) {
      res.status(400).json({ error: "Learner does not have a confirmed enrolment for this course." });
      return;
    }
    const existing = db.prepare("SELECT id, certificate_code FROM certificates WHERE user_id = ? AND course_code = ?").get(userId, courseCode);
    if (existing) {
      db.prepare("UPDATE certificates SET status = 'Issued', issued_by = ?, issued_at = ? WHERE id = ?").run(
        req.authUser.id,
        (/* @__PURE__ */ new Date()).toISOString(),
        existing.id
      );
      res.json({ id: existing.id, certificateCode: existing.certificate_code, reissued: true });
      return;
    }
    const certCode = `AAE-CERT-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${crypto5.randomBytes(3).toString("hex").toUpperCase()}`;
    const certId = `crt_${crypto5.randomBytes(6).toString("hex")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      INSERT INTO certificates (
        id, certificate_code, user_id, course_code, certificate_title,
        holder_name, category_name, status, issued_by, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Issued', ?, ?)
    `).run(
      certId,
      certCode,
      userId,
      course.code,
      course.certificate_label,
      learner.full_name,
      course.category_name,
      req.authUser.id,
      now
    );
    createNotification({
      userId,
      type: "certificate",
      title: `Certificate Issued: ${course.title}`,
      message: `Your ${course.certificate_label} (${certCode}) has been issued by Atlas AI Education.`,
      link: "/dashboard/certificates"
    });
    res.status(201).json({ id: certId, certificateCode: certCode });
  });
  router.patch("/certificates/:id/status", requireRole("admin"), (req, res) => {
    const status = req.body?.status;
    if (status !== "Issued" && status !== "Revoked") {
      res.status(400).json({ error: 'Certificate status must be "Issued" or "Revoked".' });
      return;
    }
    db.prepare("UPDATE certificates SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ ok: true, status });
  });
  router.post("/notifications/broadcast", requireRole("admin"), (req, res) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    const targetUserId = typeof req.body?.targetUserId === "string" ? req.body.targetUserId.trim() : "";
    const targetCourseCode = typeof req.body?.targetCourseCode === "string" ? req.body.targetCourseCode.trim() : "";
    const link = typeof req.body?.link === "string" ? req.body.link.trim() : "/dashboard";
    if (title.length < 3 || message.length < 5) {
      res.status(400).json({ error: "Announcement title and message are required." });
      return;
    }
    let recipients = [];
    if (targetUserId) {
      recipients = db.prepare("SELECT id FROM users WHERE id = ? AND status = 'active'").all(targetUserId);
    } else if (targetCourseCode) {
      recipients = db.prepare("SELECT DISTINCT user_id as id FROM enrolments WHERE course_code = ? AND status = 'Confirmed' AND user_id IS NOT NULL").all(targetCourseCode);
    } else {
      recipients = db.prepare("SELECT id FROM users WHERE role = 'learner' AND status = 'active'").all();
    }
    for (const r of recipients) {
      createNotification({
        userId: r.id,
        type: "announcement",
        title,
        message,
        link
      });
    }
    res.status(201).json({ ok: true, recipientCount: recipients.length });
  });
  router.get("/scholarships", (req, res) => {
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const courseCode = typeof req.query.courseCode === "string" ? req.query.courseCode : "";
    let sql = `
      SELECT s.id, s.reference_id, s.user_id, s.course_code, s.course_title,
             s.applicant_name, s.email, s.phone, s.education_or_profession,
             s.learning_motivation, s.financial_need_reason, s.commitment_statement,
             s.requested_waiver_pct, s.approved_waiver_pct, s.status, s.admin_notes,
             s.reviewed_by, s.reviewed_at, s.created_at,
             (SELECT COUNT(*) FROM scholarship_applications sa WHERE sa.course_code = s.course_code AND sa.status = 'Approved') as course_approved_scholarships_count
      FROM scholarship_applications s
    `;
    const params = [];
    const whereClauses = [];
    if (status) {
      whereClauses.push("s.status = ?");
      params.push(status);
    }
    if (courseCode) {
      whereClauses.push("s.course_code = ?");
      params.push(courseCode);
    }
    if (whereClauses.length > 0) {
      sql += " WHERE " + whereClauses.join(" AND ");
    }
    sql += " ORDER BY s.created_at DESC LIMIT 200";
    const applications = db.prepare(sql).all(...params);
    res.json({ applications });
  });
  router.patch("/scholarships/:id", requireRole("admin"), (req, res) => {
    const id = req.params.id;
    const body = req.body || {};
    const status = body.status;
    const adminNotes = typeof body.adminNotes === "string" ? body.adminNotes.trim() : "";
    const approvedWaiverPct = typeof body.approvedWaiverPct === "number" ? Math.max(10, Math.min(50, Math.round(body.approvedWaiverPct))) : null;
    if (!["Submitted", "Under Review", "Approved", "Rejected", "Waitlisted"].includes(status)) {
      res.status(400).json({ error: "Invalid scholarship status." });
      return;
    }
    const app = db.prepare("SELECT id, user_id, course_code, course_title, reference_id FROM scholarship_applications WHERE id = ?").get(id);
    if (!app) {
      res.status(404).json({ error: "Scholarship application not found." });
      return;
    }
    if (status === "Approved") {
      const approvedCount = db.prepare("SELECT COUNT(*) as c FROM scholarship_applications WHERE course_code = ? AND status = 'Approved' AND id != ?").get(app.course_code, id);
      if (approvedCount.c >= 5) {
        res.status(409).json({
          error: `Scholarship limit reached (5/5 approved) for ${app.course_code}. You cannot approve more than 5 scholarships per course.`
        });
        return;
      }
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      UPDATE scholarship_applications
      SET status = ?, approved_waiver_pct = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).run(status, status === "Approved" ? approvedWaiverPct || 50 : null, adminNotes, req.authUser.id, now, id);
    if (app.user_id) {
      const msg = status === "Approved" ? `Congratulations! Your scholarship application for ${app.course_title} (${app.reference_id}) has been Approved with a ${approvedWaiverPct || 50}% Course Fee Waiver.` : status === "Waitlisted" ? `Your scholarship application for ${app.course_title} (${app.reference_id}) has been placed on the Waitlist.` : status === "Rejected" ? `Your scholarship application for ${app.course_title} (${app.reference_id}) has been reviewed. Unfortunately, we could not allocate a waiver for this batch.` : `Your scholarship application for ${app.course_title} (${app.reference_id}) status is now ${status}.`;
      createNotification({
        userId: app.user_id,
        type: "scholarship",
        title: `Scholarship Application Update: ${status}`,
        message: msg,
        link: "/scholarships"
      });
    }
    res.json({ ok: true, status, approvedWaiverPct: status === "Approved" ? approvedWaiverPct || 50 : null });
  });
  return router;
}

// server.ts
var PORT = Number(process.env.PORT || 3e3);
var IS_PROD = process.env.NODE_ENV === "production";
var MANUAL_PAYMENT_NUMBER = "+8801601289683";
function sendCompressed(req, res, status, contentType, body) {
  const acceptEncoding = String(req.headers["accept-encoding"] || "");
  res.setHeader("Content-Type", contentType);
  res.setHeader("Vary", "Accept-Encoding");
  if (acceptEncoding.includes("gzip") && Buffer.byteLength(body) >= 512) {
    const compressed = zlib.gzipSync(body, { level: 6 });
    res.setHeader("Content-Encoding", "gzip");
    res.status(status).end(compressed);
    return;
  }
  res.status(status).end(body);
}
function normalizeBdtDigits(value) {
  return value.replace(/[^0-9]/g, "");
}
var rateBuckets = /* @__PURE__ */ new Map();
function isRateLimited(ip, limit = 25, windowMs = 15 * 60 * 1e3) {
  const now = Date.now();
  const timestamps = (rateBuckets.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    rateBuckets.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateBuckets.set(ip, timestamps);
  return false;
}
function getBaseUrl(req) {
  if (process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL") {
    return process.env.APP_URL.replace(/\/+$/, "");
  }
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`;
  return `${proto}://${host}`;
}
function escapeHtmlAttr(input) {
  return input.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function getDbCourseSeo(courseCode) {
  return db.prepare(`
      SELECT s.*,
             c.is_published as course_published,
             c.max_seats,
             (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count
      FROM course_seo_metadata s
      JOIN courses c ON c.code = s.course_code
      WHERE s.course_code = ?
    `).get(courseCode);
}
function getDbPageSeo(routePath) {
  return db.prepare("SELECT * FROM page_seo_metadata WHERE route_path = ?").get(routePath);
}
function getPublishedFoundationCoursesFromDb() {
  const rows = db.prepare(`
      SELECT c.code, COALESCE(s.last_optimized_at, c.updated_at) as updated_at,
             c.is_published as course_published,
             COALESCE(s.index_status, 'indexed') as index_status
      FROM courses c
      LEFT JOIN course_seo_metadata s ON s.course_code = c.code
      WHERE c.category_slug = 'ai-literacy'
    `).all();
  const statusMap = new Map(rows.map((r) => [r.code, r]));
  const published = discoverFoundationCourses().filter((c) => {
    const st = statusMap.get(c.code);
    if (!st) return true;
    return st.course_published === 1 && st.index_status === "indexed";
  });
  const timestamps = rows.filter((r) => r.course_published === 1 && r.index_status === "indexed" && r.updated_at).map((r) => r.updated_at).sort().reverse();
  return { courses: published, latestUpdatedAt: timestamps[0] || null };
}
function getPublishedAppliedAiCoursesFromDb() {
  const rows = db.prepare(`
      SELECT c.code, COALESCE(s.last_optimized_at, c.updated_at) as updated_at,
             c.is_published as course_published,
             COALESCE(s.index_status, 'indexed') as index_status
      FROM courses c
      LEFT JOIN course_seo_metadata s ON s.course_code = c.code
      WHERE c.category_slug = 'applied-ai'
    `).all();
  const statusMap = new Map(rows.map((r) => [r.code, r]));
  const published = discoverAppliedAiCourses().filter((c) => {
    const st = statusMap.get(c.code);
    if (!st) return true;
    return st.course_published === 1 && st.index_status === "indexed";
  });
  const timestamps = rows.filter((r) => r.course_published === 1 && r.index_status === "indexed" && r.updated_at).map((r) => r.updated_at).sort().reverse();
  return { courses: published, latestUpdatedAt: timestamps[0] || null };
}
function getPublishedProfessionalDevCoursesFromDb() {
  const rows = db.prepare(`
      SELECT c.code, COALESCE(s.last_optimized_at, c.updated_at) as updated_at,
             c.is_published as course_published,
             COALESCE(s.index_status, 'indexed') as index_status
      FROM courses c
      LEFT JOIN course_seo_metadata s ON s.course_code = c.code
      WHERE c.category_slug = 'professional-development'
    `).all();
  const statusMap = new Map(rows.map((r) => [r.code, r]));
  const published = discoverProfessionalDevCourses().filter((c) => {
    const st = statusMap.get(c.code);
    if (!st) return true;
    return st.course_published === 1 && st.index_status === "indexed";
  });
  const timestamps = rows.filter((r) => r.course_published === 1 && r.index_status === "indexed" && r.updated_at).map((r) => r.updated_at).sort().reverse();
  return { courses: published, latestUpdatedAt: timestamps[0] || null };
}
function injectRouteSeoHtml(html, reqPath, baseUrl) {
  const { entry, isKnown } = resolveRouteSeo(reqPath);
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const targetPath = entry.canonicalPath || entry.path;
  const canonical = `${cleanBase}${targetPath === "/" ? "/" : targetPath}`;
  let effectiveTitle = entry.title;
  let effectiveDescription = entry.description;
  let effectiveOgTitle = entry.ogTitle || effectiveTitle;
  let effectiveOgDescription = entry.ogDescription || effectiveDescription;
  let effectiveOgImage = entry.ogImage || "/src/assets/images/hero_atlas_institute_1794867545953.jpg";
  let effectiveOgImageAlt = entry.ogImageAlt || "Atlas AI Education \u2013 Atlas AI Institute";
  let effectiveKeywords = entry.keywords || [];
  let isNoindex = Boolean(entry.noindex || !isKnown);
  let lastModified;
  let jsonLdPayload;
  const targetCourseCode = entry.foundationCourseCode || entry.appliedAiCourseCode || entry.professionalDevCourseCode || entry.specialisedCourseCode;
  if (targetCourseCode) {
    const dbRow = getDbCourseSeo(targetCourseCode);
    const course = getCourseByCodeOrSlug(targetCourseCode);
    const buildCourseJsonLd = course?.categorySlug === "applied-ai" ? buildAppliedAiCourseJsonLd : course?.categorySlug === "professional-development" ? buildProfessionalDevCourseJsonLd : course?.categorySlug === "specialised-programmes" ? buildWomensSafetyJsonLd : buildFoundationCourseJsonLd;
    if (dbRow) {
      effectiveTitle = dbRow.seo_title || effectiveTitle;
      effectiveDescription = dbRow.meta_description || effectiveDescription;
      effectiveOgTitle = dbRow.og_title || effectiveTitle;
      effectiveOgDescription = dbRow.og_description || effectiveDescription;
      effectiveOgImage = dbRow.og_image || effectiveOgImage;
      effectiveOgImageAlt = dbRow.og_image_alt || effectiveOgImageAlt;
      lastModified = dbRow.last_optimized_at;
      try {
        const sec = JSON.parse(dbRow.secondary_keywords || "[]");
        if (Array.isArray(sec)) {
          effectiveKeywords = [dbRow.primary_keyword, ...sec].filter(Boolean);
        }
      } catch {
      }
      if (dbRow.course_published !== 1 || dbRow.is_published !== 1 || dbRow.index_status !== "indexed") {
        isNoindex = true;
      }
      if (course && !isNoindex) {
        const isFull = dbRow.max_seats !== null && dbRow.confirmed_count >= dbRow.max_seats;
        jsonLdPayload = buildCourseJsonLd(course, cleanBase, {
          isFull,
          lastOptimizedAt: dbRow.last_optimized_at,
          seoTitle: effectiveTitle,
          metaDescription: effectiveDescription
        });
      }
    } else if (course && !isNoindex) {
      jsonLdPayload = buildCourseJsonLd(course, cleanBase, {
        seoTitle: effectiveTitle,
        metaDescription: effectiveDescription
      });
    }
  } else if (entry.path === "/programmes") {
    const { courses: publishedFoundation, latestUpdatedAt: latestFoundationMod } = getPublishedFoundationCoursesFromDb();
    const { courses: publishedAppliedAi, latestUpdatedAt: latestAppliedAiMod } = getPublishedAppliedAiCoursesFromDb();
    const { courses: publishedProfessionalDev, latestUpdatedAt: latestProfDevMod } = getPublishedProfessionalDevCoursesFromDb();
    const wsaiDb = getDbCourseSeo("SP-WSAI");
    const wsaiPublished = wsaiDb ? wsaiDb.course_published === 1 && wsaiDb.is_published === 1 && wsaiDb.index_status === "indexed" : true;
    const pageDb = getDbPageSeo("/programmes");
    const candidates = [
      latestFoundationMod,
      latestAppliedAiMod,
      latestProfDevMod,
      wsaiDb?.last_optimized_at,
      pageDb?.last_optimized_at
    ].filter(Boolean);
    candidates.sort().reverse();
    lastModified = candidates[0];
    const baseSchema = buildFoundationCategoryListingJsonLd(cleanBase, {
      canonicalPath: "/programmes",
      pageTitle: effectiveTitle,
      pageDescription: effectiveDescription,
      publishedCourses: publishedFoundation
    });
    const baseGraph = Array.isArray(baseSchema["@graph"]) ? baseSchema["@graph"] : [];
    jsonLdPayload = {
      ...baseSchema,
      "@graph": [
        ...baseGraph,
        buildAppliedAiItemListEntity(cleanBase, {
          canonicalPath: "/programmes",
          publishedCourses: publishedAppliedAi
        }),
        buildProfessionalDevItemListEntity(cleanBase, {
          canonicalPath: "/programmes",
          publishedCourses: publishedProfessionalDev
        }),
        buildSpecialisedItemListEntity(cleanBase, {
          canonicalPath: "/programmes",
          wsaiPublished
        })
      ]
    };
  } else if (entry.path === "/programmes/ai-literacy") {
    const { courses: publishedFoundation, latestUpdatedAt } = getPublishedFoundationCoursesFromDb();
    lastModified = latestUpdatedAt || void 0;
    jsonLdPayload = buildFoundationCategoryListingJsonLd(cleanBase, {
      canonicalPath: "/programmes",
      pageTitle: effectiveTitle,
      pageDescription: effectiveDescription,
      publishedCourses: publishedFoundation
    });
  } else if (entry.path === "/programmes/applied-ai") {
    const { courses: publishedAppliedAi, latestUpdatedAt } = getPublishedAppliedAiCoursesFromDb();
    lastModified = latestUpdatedAt || void 0;
    jsonLdPayload = buildAppliedAiCategoryListingJsonLd(cleanBase, {
      canonicalPath: "/programmes",
      pageTitle: effectiveTitle,
      pageDescription: effectiveDescription,
      publishedCourses: publishedAppliedAi
    });
  } else if (entry.path === "/programmes/professional-development") {
    const { courses: publishedProfessionalDev, latestUpdatedAt } = getPublishedProfessionalDevCoursesFromDb();
    lastModified = latestUpdatedAt || void 0;
    jsonLdPayload = buildProfessionalDevCategoryListingJsonLd(cleanBase, {
      canonicalPath: "/programmes",
      pageTitle: effectiveTitle,
      pageDescription: effectiveDescription,
      publishedCourses: publishedProfessionalDev
    });
  } else if (entry.path === "/programmes/specialised-programmes") {
    const wsaiDb = getDbCourseSeo("SP-WSAI");
    lastModified = wsaiDb?.last_optimized_at || void 0;
    jsonLdPayload = buildSpecialisedCategoryListingJsonLd(cleanBase, {
      canonicalPath: "/programmes",
      pageTitle: effectiveTitle,
      pageDescription: effectiveDescription
    });
  } else if (entry.path === "/free-masterclass") {
    const freeDb = getDbCourseSeo("FREE");
    if (freeDb) {
      lastModified = freeDb.last_optimized_at;
      if (freeDb.course_published !== 1 || freeDb.index_status !== "indexed") {
        isNoindex = true;
      }
    }
    if (!isNoindex) {
      jsonLdPayload = buildFreeMasterclassJsonLd(cleanBase);
    }
  } else if (entry.pageSeoRoute) {
    const pageDb = getDbPageSeo(entry.pageSeoRoute);
    if (pageDb) {
      effectiveTitle = pageDb.seo_title || effectiveTitle;
      effectiveDescription = pageDb.meta_description || effectiveDescription;
      effectiveOgTitle = pageDb.og_title || effectiveTitle;
      effectiveOgDescription = pageDb.og_description || effectiveDescription;
      effectiveOgImage = pageDb.og_image || effectiveOgImage;
      effectiveOgImageAlt = pageDb.og_image_alt || effectiveOgImageAlt;
      lastModified = pageDb.last_optimized_at;
      try {
        const sec = JSON.parse(pageDb.secondary_keywords || "[]");
        if (Array.isArray(sec)) {
          effectiveKeywords = [pageDb.primary_keyword, ...sec].filter(Boolean);
        }
      } catch {
      }
      if (pageDb.is_published !== 1 || pageDb.index_status !== "indexed") {
        isNoindex = true;
      }
    }
    if (!isNoindex) {
      if (entry.jsonLdBuilder) {
        jsonLdPayload = entry.jsonLdBuilder(cleanBase);
      } else if (entry.jsonLd) {
        jsonLdPayload = entry.jsonLd;
      }
    }
  } else if (entry.jsonLdBuilder) {
    jsonLdPayload = entry.jsonLdBuilder(cleanBase);
  } else if (entry.jsonLd) {
    jsonLdPayload = entry.jsonLd;
  }
  const safeTitle = escapeHtmlAttr(effectiveTitle);
  const safeDesc = escapeHtmlAttr(effectiveDescription);
  const safeOgTitle = escapeHtmlAttr(effectiveOgTitle);
  const safeOgDesc = escapeHtmlAttr(effectiveOgDescription);
  const safeUrl = escapeHtmlAttr(canonical);
  const ogImageAbsolute = effectiveOgImage.startsWith("http") ? effectiveOgImage : `${cleanBase}${effectiveOgImage}`;
  const safeOgImage = escapeHtmlAttr(ogImageAbsolute);
  const safeOgImageAlt = escapeHtmlAttr(effectiveOgImageAlt);
  const ogType = entry.ogType || "website";
  const robotsContent = isNoindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
  let out = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`).replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${safeDesc}" />`
  ).replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${ogType}" />`
  ).replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${safeOgTitle}" />`
  ).replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${safeOgDesc}" />`
  ).replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${safeOgTitle}" />`
  ).replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${safeOgDesc}" />`
  );
  const safeKeywords = effectiveKeywords.length > 0 ? escapeHtmlAttr(effectiveKeywords.join(", ")) : "";
  const extraHeadTags = [
    `<link rel="canonical" href="${safeUrl}" />`,
    !isNoindex ? `<link rel="alternate" hreflang="bn" href="${safeUrl}" />` : "",
    !isNoindex ? `<link rel="alternate" hreflang="x-default" href="${safeUrl}" />` : "",
    `<meta name="robots" content="${robotsContent}" />`,
    safeKeywords ? `<meta name="keywords" content="${safeKeywords}" />` : "",
    `<meta property="og:locale" content="bn_BD" />`,
    `<meta property="og:locale:alternate" content="en_US" />`,
    `<meta property="og:url" content="${safeUrl}" />`,
    `<meta property="og:image" content="${safeOgImage}" />`,
    `<meta property="og:image:alt" content="${safeOgImageAlt}" />`,
    `<meta name="twitter:image" content="${safeOgImage}" />`,
    `<meta name="twitter:image:alt" content="${safeOgImageAlt}" />`,
    jsonLdPayload ? `<script type="application/ld+json" data-atlas-jsonld="true">${JSON.stringify(jsonLdPayload)}</script>` : ""
  ].filter(Boolean).join("\n    ");
  out = out.replace("</head>", `    ${extraHeadTags}
  </head>`);
  return { html: out, isKnown, isNoindex, canonicalUrl: canonical, lastModified };
}
async function startServer() {
  syncCatalogAndSeedUsers();
  const app = express();
  app.set("trust proxy", true);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "8mb" }));
  app.use(attachAuth);
  app.use("/api", (_req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  });
  app.use("/src/assets/images", (_req, res, next) => {
    res.setHeader(
      "Cache-Control",
      IS_PROD ? "public, max-age=31536000, immutable" : "public, max-age=3600"
    );
    next();
  });
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "atlas-ai-education", database: "sqlite" });
  });
  app.get("/api/seo/foundation", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const rows = db.prepare(`
        SELECT s.*,
               c.title as course_title,
               c.fee_display,
               c.fee_bdt,
               c.is_free,
               c.duration,
               c.is_published as course_published,
               c.max_seats,
               (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count
        FROM course_seo_metadata s
        JOIN courses c ON c.code = s.course_code
        WHERE c.category_slug = 'ai-literacy'
        ORDER BY CASE c.code
          WHEN 'FREE' THEN 0
          WHEN 'AL-100' THEN 1
          WHEN 'AL-101' THEN 2
          WHEN 'AL-102' THEN 3
          WHEN 'AL-103' THEN 4
          WHEN 'AL-104' THEN 5
          ELSE 99
        END ASC, c.code ASC
      `).all();
    const publishedCourses = rows.filter(
      (r) => r.course_published === 1 && r.is_published === 1 && r.index_status === "indexed"
    );
    const payload = {
      organization: "Atlas AI Education",
      parentOrganization: "Atlas AI Institute",
      category: "AI Literacy & Foundation",
      categorySlug: "ai-literacy",
      totalDiscovered: rows.length,
      totalPublishedIndexed: publishedCourses.length,
      courses: publishedCourses.map((r) => {
        const courseObj = getCourseByCodeOrSlug(r.course_code);
        const isFull = r.max_seats !== null && r.confirmed_count >= r.max_seats;
        return {
          courseCode: r.course_code,
          title: r.course_title,
          canonicalUrl: `${baseUrl}${r.canonical_url}`,
          seoTitle: r.seo_title,
          metaDescription: r.meta_description,
          ogTitle: r.og_title,
          ogDescription: r.og_description,
          ogImage: `${baseUrl}${r.og_image}`,
          ogImageAlt: r.og_image_alt,
          primaryKeyword: r.primary_keyword,
          secondaryKeywords: JSON.parse(r.secondary_keywords || "[]"),
          semanticTopics: JSON.parse(r.semantic_topics || "[]"),
          searchIntent: r.search_intent,
          intendedAudience: JSON.parse(r.intended_audience || "[]"),
          learningLevel: r.learning_level,
          indexStatus: r.index_status,
          isPublished: r.course_published === 1,
          lastOptimizedAt: r.last_optimized_at,
          courseSchema: courseObj ? buildFoundationCourseJsonLd(courseObj, baseUrl, {
            isFull,
            lastOptimizedAt: r.last_optimized_at,
            seoTitle: r.seo_title,
            metaDescription: r.meta_description
          }) : null
        };
      })
    };
    res.setHeader("Cache-Control", "public, max-age=300");
    sendCompressed(req, res, 200, "application/json; charset=utf-8", JSON.stringify(payload));
  });
  app.get("/api/seo/applied-ai", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const rows = db.prepare(`
        SELECT s.*,
               c.title as course_title,
               c.fee_display,
               c.fee_bdt,
               c.is_free,
               c.duration,
               c.is_published as course_published,
               c.max_seats,
               (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count
        FROM course_seo_metadata s
        JOIN courses c ON c.code = s.course_code
        WHERE c.category_slug = 'applied-ai'
        ORDER BY c.code ASC
      `).all();
    const publishedCourses = rows.filter(
      (r) => r.course_published === 1 && r.is_published === 1 && r.index_status === "indexed"
    );
    const payload = {
      organization: "Atlas AI Education",
      parentOrganization: "Atlas AI Institute",
      category: "Applied AI",
      categorySlug: "applied-ai",
      totalDiscovered: rows.length,
      totalPublishedIndexed: publishedCourses.length,
      courses: publishedCourses.map((r) => {
        const courseObj = getCourseByCodeOrSlug(r.course_code);
        const isFull = r.max_seats !== null && r.confirmed_count >= r.max_seats;
        return {
          courseCode: r.course_code,
          title: r.course_title,
          canonicalUrl: `${baseUrl}${r.canonical_url}`,
          seoTitle: r.seo_title,
          metaDescription: r.meta_description,
          ogTitle: r.og_title,
          ogDescription: r.og_description,
          ogImage: `${baseUrl}${r.og_image}`,
          ogImageAlt: r.og_image_alt,
          primaryKeyword: r.primary_keyword,
          secondaryKeywords: JSON.parse(r.secondary_keywords || "[]"),
          semanticTopics: JSON.parse(r.semantic_topics || "[]"),
          searchIntent: r.search_intent,
          intendedAudience: JSON.parse(r.intended_audience || "[]"),
          learningLevel: r.learning_level,
          indexStatus: r.index_status,
          isPublished: r.course_published === 1,
          lastOptimizedAt: r.last_optimized_at,
          courseSchema: courseObj ? buildAppliedAiCourseJsonLd(courseObj, baseUrl, {
            isFull,
            lastOptimizedAt: r.last_optimized_at,
            seoTitle: r.seo_title,
            metaDescription: r.meta_description
          }) : null
        };
      })
    };
    res.setHeader("Cache-Control", "public, max-age=300");
    sendCompressed(req, res, 200, "application/json; charset=utf-8", JSON.stringify(payload));
  });
  app.get("/api/seo/professional-development", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const rows = db.prepare(`
        SELECT s.*,
               c.title as course_title,
               c.fee_display,
               c.fee_bdt,
               c.is_free,
               c.duration,
               c.is_published as course_published,
               c.max_seats,
               (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count
        FROM course_seo_metadata s
        JOIN courses c ON c.code = s.course_code
        WHERE c.category_slug = 'professional-development'
        ORDER BY c.code ASC
      `).all();
    const publishedCourses = rows.filter(
      (r) => r.course_published === 1 && r.is_published === 1 && r.index_status === "indexed"
    );
    const payload = {
      organization: "Atlas AI Education",
      parentOrganization: "Atlas AI Institute",
      category: "Professional Development",
      categorySlug: "professional-development",
      totalDiscovered: rows.length,
      totalPublishedIndexed: publishedCourses.length,
      courses: publishedCourses.map((r) => {
        const courseObj = getCourseByCodeOrSlug(r.course_code);
        const isFull = r.max_seats !== null && r.confirmed_count >= r.max_seats;
        return {
          courseCode: r.course_code,
          title: r.course_title,
          canonicalUrl: `${baseUrl}${r.canonical_url}`,
          seoTitle: r.seo_title,
          metaDescription: r.meta_description,
          ogTitle: r.og_title,
          ogDescription: r.og_description,
          ogImage: `${baseUrl}${r.og_image}`,
          ogImageAlt: r.og_image_alt,
          primaryKeyword: r.primary_keyword,
          secondaryKeywords: JSON.parse(r.secondary_keywords || "[]"),
          semanticTopics: JSON.parse(r.semantic_topics || "[]"),
          searchIntent: r.search_intent,
          intendedAudience: JSON.parse(r.intended_audience || "[]"),
          learningLevel: r.learning_level,
          indexStatus: r.index_status,
          isPublished: r.course_published === 1,
          lastOptimizedAt: r.last_optimized_at,
          courseSchema: courseObj ? buildProfessionalDevCourseJsonLd(courseObj, baseUrl, {
            isFull,
            lastOptimizedAt: r.last_optimized_at,
            seoTitle: r.seo_title,
            metaDescription: r.meta_description
          }) : null
        };
      })
    };
    res.setHeader("Cache-Control", "public, max-age=300");
    sendCompressed(req, res, 200, "application/json; charset=utf-8", JSON.stringify(payload));
  });
  app.get("/api/seo/specialised", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const wsaiRow = getDbCourseSeo("SP-WSAI");
    const wsaiCourse = discoverSpecialisedCourse();
    const wsaiPublished = wsaiRow ? wsaiRow.course_published === 1 && wsaiRow.is_published === 1 && wsaiRow.index_status === "indexed" : false;
    const isFull = wsaiRow && wsaiRow.max_seats !== null ? wsaiRow.confirmed_count >= wsaiRow.max_seats : false;
    const serviceRows = db.prepare(`
        SELECT * FROM page_seo_metadata
        WHERE page_type = 'institutional-service'
        ORDER BY route_path ASC
      `).all();
    const publishedServices = serviceRows.filter((r) => r.is_published === 1 && r.index_status === "indexed").map((r) => {
      const slug = r.route_path.replace("/institutional-services/", "");
      const srvObj = getInstitutionalServiceBySlug(slug);
      return srvObj ? getInstitutionalServiceSeoSummary(srvObj, baseUrl) : null;
    }).filter(Boolean);
    const payload = {
      organization: "Atlas AI Education",
      parentOrganization: "Atlas AI Institute",
      category: "Specialised Programmes",
      categorySlug: "specialised-programmes",
      specialisedLearningProgramme: wsaiPublished && wsaiRow ? {
        courseCode: wsaiRow.course_code,
        title: wsaiCourse.title,
        canonicalUrl: `${baseUrl}${wsaiRow.canonical_url}`,
        seoTitle: wsaiRow.seo_title,
        metaDescription: wsaiRow.meta_description,
        ogTitle: wsaiRow.og_title,
        ogDescription: wsaiRow.og_description,
        ogImage: `${baseUrl}${wsaiRow.og_image}`,
        ogImageAlt: wsaiRow.og_image_alt,
        primaryKeyword: wsaiRow.primary_keyword,
        secondaryKeywords: JSON.parse(wsaiRow.secondary_keywords || "[]"),
        semanticTopics: JSON.parse(wsaiRow.semantic_topics || "[]"),
        searchIntent: wsaiRow.search_intent,
        learningLevel: wsaiRow.learning_level,
        indexStatus: wsaiRow.index_status,
        isPublished: true,
        lastOptimizedAt: wsaiRow.last_optimized_at,
        courseSchema: buildWomensSafetyJsonLd(wsaiCourse, baseUrl, {
          isFull,
          lastOptimizedAt: wsaiRow.last_optimized_at,
          seoTitle: wsaiRow.seo_title,
          metaDescription: wsaiRow.meta_description
        })
      } : null,
      totalInstitutionalServices: publishedServices.length,
      institutionalServices: publishedServices
    };
    res.setHeader("Cache-Control", "public, max-age=300");
    sendCompressed(req, res, 200, "application/json; charset=utf-8", JSON.stringify(payload));
  });
  app.get("/api/seo/site", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const pageRows = db.prepare(`
        SELECT * FROM page_seo_metadata
        WHERE is_published = 1 AND index_status = 'indexed'
        ORDER BY route_path ASC
      `).all();
    const courseRows = db.prepare(`
        SELECT s.course_code, c.title, c.category_slug, c.fee_display, s.canonical_url,
               s.seo_title, s.meta_description, s.primary_keyword, s.last_optimized_at
        FROM course_seo_metadata s
        JOIN courses c ON c.code = s.course_code
        WHERE c.is_published = 1 AND s.is_published = 1 AND s.index_status = 'indexed'
        ORDER BY c.category_slug ASC, c.code ASC
      `).all();
    const payload = {
      organization: "Atlas AI Education",
      parentOrganization: "Atlas AI Institute",
      slogan: "Understand AI. Apply AI. Advance Responsibly",
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      robotsUrl: `${baseUrl}/robots.txt`,
      categories: getCourseCountSummaryByCategory(),
      totalIndexedPages: pageRows.length,
      totalIndexedCourses: courseRows.length,
      pages: pageRows.map((p) => ({
        routePath: p.route_path,
        pageType: p.page_type,
        canonicalUrl: `${baseUrl}${p.canonical_url === "/" ? "/" : p.canonical_url}`,
        seoTitle: p.seo_title,
        metaDescription: p.meta_description,
        ogImage: `${baseUrl}${p.og_image}`,
        primaryKeyword: p.primary_keyword,
        secondaryKeywords: JSON.parse(p.secondary_keywords || "[]"),
        semanticTopics: JSON.parse(p.semantic_topics || "[]"),
        searchIntent: p.search_intent,
        schemaType: p.schema_type,
        lastOptimizedAt: p.last_optimized_at
      })),
      courses: courseRows.map((c) => ({
        courseCode: c.course_code,
        title: c.title,
        categorySlug: c.category_slug,
        feeDisplay: c.fee_display,
        canonicalUrl: `${baseUrl}${c.canonical_url}`,
        seoTitle: c.seo_title,
        metaDescription: c.meta_description,
        primaryKeyword: c.primary_keyword,
        lastOptimizedAt: c.last_optimized_at
      }))
    };
    res.setHeader("Cache-Control", "public, max-age=300");
    sendCompressed(req, res, 200, "application/json; charset=utf-8", JSON.stringify(payload));
  });
  app.get("/api/seo/courses/:code", (req, res) => {
    const code = req.params.code.trim().toUpperCase();
    const row = getDbCourseSeo(code);
    const courseObj = getCourseByCodeOrSlug(code);
    if (!row || !courseObj || row.course_published !== 1 || row.is_published !== 1 || row.index_status !== "indexed") {
      res.status(404).json({ error: "Published course SEO record not found." });
      return;
    }
    const baseUrl = getBaseUrl(req);
    const isFull = row.max_seats !== null && row.confirmed_count >= row.max_seats;
    const buildCourseJsonLd = courseObj.categorySlug === "applied-ai" ? buildAppliedAiCourseJsonLd : courseObj.categorySlug === "professional-development" ? buildProfessionalDevCourseJsonLd : courseObj.categorySlug === "specialised-programmes" ? buildWomensSafetyJsonLd : buildFoundationCourseJsonLd;
    const payload = {
      courseCode: row.course_code,
      canonicalUrl: `${baseUrl}${row.canonical_url}`,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
      ogTitle: row.og_title,
      ogDescription: row.og_description,
      ogImage: `${baseUrl}${row.og_image}`,
      ogImageAlt: row.og_image_alt,
      primaryKeyword: row.primary_keyword,
      secondaryKeywords: JSON.parse(row.secondary_keywords || "[]"),
      semanticTopics: JSON.parse(row.semantic_topics || "[]"),
      searchIntent: row.search_intent,
      intendedAudience: JSON.parse(row.intended_audience || "[]"),
      learningLevel: row.learning_level,
      indexStatus: row.index_status,
      isPublished: true,
      lastOptimizedAt: row.last_optimized_at,
      courseSchema: buildCourseJsonLd(courseObj, baseUrl, {
        isFull,
        lastOptimizedAt: row.last_optimized_at,
        seoTitle: row.seo_title,
        metaDescription: row.meta_description
      })
    };
    res.setHeader("Cache-Control", "public, max-age=300");
    sendCompressed(req, res, 200, "application/json; charset=utf-8", JSON.stringify(payload));
  });
  app.use("/api/auth", createAuthRouter());
  app.use("/api/dashboard", createDashboardRouter());
  app.use("/api/admin", createAdminRouter());
  app.get("/api/courses/availability", (_req, res) => {
    const rows = db.prepare(`
        SELECT c.code, c.max_seats,
               (SELECT COUNT(*) FROM enrolments e WHERE e.course_code = c.code AND e.status = 'Confirmed') as confirmed_count
        FROM courses c
      `).all();
    const availability = {};
    for (const r of rows) {
      availability[r.code] = {
        maxSeats: r.max_seats,
        confirmedCount: r.confirmed_count,
        isFull: r.max_seats !== null && r.confirmed_count >= r.max_seats
      };
    }
    res.json({ availability });
  });
  app.get("/api/certificates/verify/:code", (req, res) => {
    const certCode = req.params.code.trim().toUpperCase();
    const row = db.prepare(`
        SELECT cert.certificate_code, cert.holder_name, cert.course_code,
               c.title as course_title, cert.certificate_title, cert.category_name,
               cert.status, cert.issued_at
        FROM certificates cert
        JOIN courses c ON c.code = cert.course_code
        WHERE UPPER(cert.certificate_code) = ?
      `).get(certCode);
    if (!row) {
      res.status(404).json({
        valid: false,
        error: "No certificate matching this ID was found in Atlas AI Education records."
      });
      return;
    }
    res.json({
      valid: row.status === "Issued",
      certificate: {
        certificateCode: row.certificate_code,
        holderName: row.holder_name,
        courseCode: row.course_code,
        courseTitle: row.course_title,
        certificateTitle: row.certificate_title,
        categoryName: row.category_name,
        status: row.status,
        issuedAt: row.issued_at,
        issuer: "Atlas AI Education (Atlas AI Institute)",
        disclosure: "Non-accredited educational completion or participation certificate issued by Atlas AI Education."
      }
    });
  });
  app.get("/api/files/avatars/:filename", (req, res) => {
    const safeName = path3.basename(req.params.filename);
    const fullPath = path3.join(AVATARS_DIR, safeName);
    if (!fs3.existsSync(fullPath)) {
      res.status(404).end();
      return;
    }
    res.sendFile(fullPath);
  });
  app.get("/api/files/submissions/:id", requireAuth, (req, res) => {
    const sub = db.prepare("SELECT id, user_id, file_path, file_name FROM submissions WHERE id = ?").get(req.params.id);
    if (!sub || !sub.file_path) {
      res.status(404).json({ error: "Submission file not found." });
      return;
    }
    const isPrivileged = req.authUser.role === "admin" || req.authUser.role === "instructor";
    if (sub.user_id !== req.authUser.id && !isPrivileged) {
      res.status(403).json({ error: "Access denied." });
      return;
    }
    const fullPath = path3.join(SUBMISSIONS_DIR, path3.basename(sub.file_path));
    if (!fs3.existsSync(fullPath)) {
      res.status(404).json({ error: "Stored file missing on disk." });
      return;
    }
    res.download(fullPath, sub.file_name || path3.basename(fullPath));
  });
  app.get("/robots.txt", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const robotsTxt = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /dashboard",
      "Disallow: /admin",
      "Disallow: /api",
      "Disallow: /login",
      "Disallow: /signup",
      "Disallow: /forgot-password",
      "Disallow: /reset-password",
      "Disallow: /verify-email",
      "Disallow: /profile",
      "Disallow: /menu",
      "",
      `Sitemap: ${baseUrl}/sitemap.xml`,
      ""
    ].join("\n");
    res.setHeader("Cache-Control", "public, max-age=3600");
    sendCompressed(req, res, 200, "text/plain; charset=utf-8", robotsTxt);
  });
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const dbCourseRows = db.prepare(`
        SELECT c.code, c.slug, c.is_published as course_published, c.updated_at,
               s.index_status, s.is_published as seo_published, s.last_optimized_at
        FROM courses c
        LEFT JOIN course_seo_metadata s ON s.course_code = c.code
      `).all();
    const dbPageRows = db.prepare(`
        SELECT route_path, index_status, is_published, last_optimized_at
        FROM page_seo_metadata
      `).all();
    const dbCourseMap = new Map(dbCourseRows.map((r) => [r.code, r]));
    const dbCourseBySlug = new Map(dbCourseRows.map((r) => [r.slug, r]));
    const dbPageMap = new Map(dbPageRows.map((r) => [r.route_path, r]));
    const latestCourseMod = dbCourseRows.filter(
      (r) => r.course_published === 1 && (r.seo_published === null || r.seo_published === 1) && r.index_status !== "noindex"
    ).map((r) => r.last_optimized_at || r.updated_at).filter(Boolean).sort().reverse()[0];
    const urls = ROUTE_SEO_ENTRIES.filter((entry) => {
      if (entry.excludeFromSitemap || entry.noindex) return false;
      if (entry.pageSeoRoute) {
        const pageState = dbPageMap.get(entry.pageSeoRoute);
        if (pageState && (pageState.is_published !== 1 || pageState.index_status === "noindex")) {
          return false;
        }
      }
      if (entry.path.startsWith("/programmes/")) {
        const segment = entry.path.slice("/programmes/".length);
        const courseState = dbCourseMap.get(segment) || dbCourseBySlug.get(segment);
        if (courseState) {
          if (courseState.course_published !== 1) return false;
          if (courseState.seo_published === 0 || courseState.index_status === "noindex") {
            return false;
          }
        }
      }
      return true;
    }).map((entry) => {
      const loc = `${baseUrl}${entry.path === "/" ? "/" : entry.path}`;
      const segment = entry.path.startsWith("/programmes/") ? entry.path.slice("/programmes/".length) : "";
      const courseState = segment ? dbCourseMap.get(segment) || dbCourseBySlug.get(segment) : void 0;
      const pageState = entry.pageSeoRoute ? dbPageMap.get(entry.pageSeoRoute) : void 0;
      const lastModRaw = courseState?.last_optimized_at || courseState?.updated_at || pageState?.last_optimized_at || (entry.path === "/programmes" || entry.path === "/free-masterclass" ? latestCourseMod : void 0);
      const lastModTag = lastModRaw ? `
    <lastmod>${escapeHtmlAttr(lastModRaw)}</lastmod>` : "";
      const priority = entry.path === "/" ? "1.0" : entry.foundationCourseCode || entry.appliedAiCourseCode || entry.professionalDevCourseCode || entry.specialisedCourseCode || entry.path === "/programmes" || entry.path === "/free-masterclass" ? "0.9" : entry.institutionalServiceSlug || entry.path === "/resources" || entry.path === "/tools" || entry.path === "/scholarships" ? "0.85" : entry.path === "/privacy" || entry.path === "/terms" || entry.path === "/sitemap" ? "0.6" : "0.8";
      return `  <url>
    <loc>${escapeHtmlAttr(loc)}</loc>${lastModTag}
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    res.setHeader("Cache-Control", "public, max-age=900");
    sendCompressed(req, res, 200, "application/xml; charset=utf-8", xml);
  });
  app.post("/api/applications", (req, res) => {
    const clientIp = req.ip || "unknown";
    if (isRateLimited(clientIp, 30)) {
      res.status(429).json({
        error: "\u098F\u0987 network \u09A5\u09C7\u0995\u09C7 \u0985\u09A8\u09C7\u0995\u09AC\u09BE\u09B0 \u0986\u09AC\u09C7\u09A6\u09A8 \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u098F\u0995\u099F\u09C1 \u0985\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C7 \u0986\u09AC\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964"
      });
      return;
    }
    const body = req.body || {};
    if (typeof body.website_url === "string" && body.website_url.trim().length > 0) {
      res.status(400).json({
        error: "Automated spam validation-\u098F\u09B0 \u0995\u09BE\u09B0\u09A3\u09C7 \u0986\u09AC\u09C7\u09A6\u09A8\u099F\u09BF \u09AC\u09BE\u09A4\u09BF\u09B2 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964"
      });
      return;
    }
    if (typeof body.submittedAfterMs === "number" && body.submittedAfterMs < 800) {
      res.status(400).json({
        error: "Submit \u0995\u09B0\u09BE\u09B0 \u0986\u0997\u09C7 \u0986\u09AC\u09C7\u09A6\u09A8\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF\u0997\u09C1\u09B2\u09CB \u0986\u09B0\u09C7\u0995\u09AC\u09BE\u09B0 \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09C7 \u09A8\u09BF\u09A8\u0964"
      });
      return;
    }
    if ("cardNumber" in body || "cvv" in body || "paymentToken" in body) {
      res.status(400).json({
        error: "\u098F\u0987 application form-\u098F \u0995\u0996\u09A8\u09CB credit/debit card-\u098F\u09B0 \u09A4\u09A5\u09CD\u09AF \u09A6\u09C7\u09AC\u09C7\u09A8 \u09A8\u09BE\u0964"
      });
      return;
    }
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const country = typeof body.country === "string" && body.country.trim().length > 0 ? body.country.trim() : "Bangladesh";
    const educationalBackground = typeof body.educationalBackground === "string" ? body.educationalBackground.trim() : "";
    const selectedProgrammeRaw = typeof body.selectedProgramme === "string" ? body.selectedProgramme.trim() : "";
    const approvedCourse = selectedProgrammeRaw ? getCourseByCodeOrSlug(selectedProgrammeRaw) : void 0;
    const motivation = typeof body.motivation === "string" ? body.motivation.trim() : "";
    const mode = typeof body.mode === "string" ? body.mode.trim() : "course-application";
    const ageBracket = body.ageBracket === "minor" ? "minor" : "adult";
    const guardianConsent = body.guardianConsent === true;
    const privacyConsent = body.privacyConsent === true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!approvedCourse) {
      res.status(400).json({
        error: "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u099F\u09BF \u09AC\u09C8\u09A7 \u09A8\u09AF\u09BC\u0964 \u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE \u09A5\u09C7\u0995\u09C7 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
      });
      return;
    }
    const isFreeProgramme = approvedCourse.isFree;
    if (mode === "free-masterclass" && !isFreeProgramme) {
      res.status(400).json({
        error: "Free Masterclass \u09AB\u09B0\u09CD\u09AE\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u0995\u09C7\u09AC\u09B2 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09C7 \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09A8 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7\u0964"
      });
      return;
    }
    if (fullName.length < 2 || fullName.length > 120 || !emailRegex.test(email) || phone.length < 6 || phone.length > 40 || country.length < 2 || !isFreeProgramme && educationalBackground.length < 2 || motivation.length > 3e3 || !privacyConsent) {
      res.status(400).json({
        error: "\u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u09B8\u09AC \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u09C0\u09AF\u09BC \u0998\u09B0 \u09B8\u09A0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u09AA\u09C2\u09B0\u09A3 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 Privacy Policy \u0993 \u09B6\u09B0\u09CD\u09A4\u09BE\u09AC\u09B2\u09BF\u09A4\u09C7 \u09B8\u09AE\u09CD\u09AE\u09A4\u09BF \u09A6\u09BF\u09A8\u0964"
      });
      return;
    }
    if (approvedCourse.code === "SP-WSAI" && ageBracket === "minor" && !guardianConsent) {
      res.status(400).json({
        error: "\u09E7\u09EE \u09AC\u099B\u09B0\u09C7\u09B0 \u0995\u09AE \u09AC\u09AF\u09BC\u09B8\u09C0\u09A6\u09C7\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u0985\u09AD\u09BF\u09AD\u09BE\u09AC\u0995\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AE\u09A4\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09BE \u0986\u09AC\u09B6\u09CD\u09AF\u0995\u0964"
      });
      return;
    }
    const paymentMethodRaw = typeof body.paymentMethod === "string" ? body.paymentMethod.trim().toLowerCase() : "";
    const transactionId = typeof body.transactionId === "string" ? body.transactionId.trim().toUpperCase() : "";
    const senderNumber = typeof body.senderNumber === "string" ? body.senderNumber.trim() : phone;
    if (!isFreeProgramme) {
      const authoritativeAmount = approvedCourse.fee;
      if (typeof body.amount === "string" && body.amount.trim().length > 0) {
        const submittedDigits = normalizeBdtDigits(body.amount);
        const expectedDigits = normalizeBdtDigits(authoritativeAmount);
        if (!submittedDigits || submittedDigits !== expectedDigits) {
          res.status(400).json({
            error: `\u09AA\u09CD\u09B0\u09A6\u09A4\u09CD\u09A4 \u09AB\u09BF-\u09B0 \u09AA\u09B0\u09BF\u09AE\u09BE\u09A3 \u09B8\u09A0\u09BF\u0995 \u09A8\u09AF\u09BC\u0964 ${approvedCourse.title} (${approvedCourse.code})-\u098F\u09B0 \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 \u09AB\u09BF ${authoritativeAmount}\u0964`
          });
          return;
        }
      }
      if (paymentMethodRaw !== "bkash" && paymentMethodRaw !== "nagad" || transactionId.length < 4 || transactionId.length > 60) {
        res.status(400).json({
          error: "Paid programme-\u098F\u09B0 \u099C\u09A8\u09CD\u09AF bKash \u0985\u09A5\u09AC\u09BE Nagad Send Money-\u09B0 \u09B8\u09A0\u09BF\u0995 Transaction ID (TrxID) \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        });
        return;
      }
    }
    const prefix = approvedCourse.code === "SP-WSAI" ? "WSAI" : "AAE";
    const referenceId = `${prefix}-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${crypto6.randomBytes(3).toString("hex").toUpperCase()}`;
    const enrolmentId = `enr_${crypto6.randomBytes(6).toString("hex")}`;
    const paymentId = `pay_${crypto6.randomBytes(6).toString("hex")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const linkedUserId = req.authUser ? req.authUser.id : null;
    db.exec("BEGIN IMMEDIATE");
    try {
      const courseDb = db.prepare("SELECT code, max_seats, fee_bdt, fee_display FROM courses WHERE code = ?").get(approvedCourse.code);
      if (courseDb && courseDb.max_seats !== null) {
        const confirmed = db.prepare("SELECT COUNT(*) as c FROM enrolments WHERE course_code = ? AND status = 'Confirmed'").get(approvedCourse.code);
        if (confirmed.c >= courseDb.max_seats) {
          db.exec("ROLLBACK");
          res.status(409).json({
            error: `${approvedCourse.title} (${approvedCourse.code}) \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 ${courseDb.max_seats}\u099F\u09BF \u0986\u09B8\u09A8 \u09AA\u09C2\u09B0\u09CD\u09A3 \u09B9\u09AF\u09BC\u09C7 \u0997\u09C7\u099B\u09C7 (Course Full)\u0964`
          });
          return;
        }
      }
      if (linkedUserId) {
        const existingActive = db.prepare(`
            SELECT id, status FROM enrolments
            WHERE user_id = ? AND course_code = ? AND status IN ('Pending', 'Confirmed')
          `).get(linkedUserId, approvedCourse.code);
        if (existingActive) {
          db.exec("ROLLBACK");
          res.status(409).json({
            error: existingActive.status === "Confirmed" ? "\u0986\u09AA\u09A8\u09BF \u0987\u09A4\u09CB\u09AE\u09A7\u09CD\u09AF\u09C7\u0987 \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09BF\u09A4 (Confirmed) \u0986\u099B\u09C7\u09A8\u0964 \u0986\u09AA\u09A8\u09BE\u09B0 Learner Dashboard \u09A6\u09C7\u0996\u09C1\u09A8\u0964" : "\u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u09AA\u09A8\u09BE\u09B0 \u098F\u0995\u099F\u09BF \u0986\u09AC\u09C7\u09A6\u09A8 \u0987\u09A4\u09CB\u09AE\u09A7\u09CD\u09AF\u09C7\u0987 \u09AF\u09BE\u099A\u09BE\u0987\u09DF\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF Pending \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09AF\u09BC \u0986\u099B\u09C7\u0964"
          });
          return;
        }
      }
      const enrolmentStatus = isFreeProgramme ? "Confirmed" : "Pending";
      const paymentStatus = isFreeProgramme ? "Paid" : "Pending";
      const paymentMethod = isFreeProgramme ? "free" : paymentMethodRaw;
      db.prepare(`
        INSERT INTO enrolments (
          id, reference_id, user_id, applicant_name, applicant_email, applicant_phone,
          country, educational_background, motivation, course_code, mode, status,
          enrolled_at, confirmed_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        enrolmentId,
        referenceId,
        linkedUserId,
        fullName,
        email,
        phone,
        country,
        educationalBackground,
        motivation,
        approvedCourse.code,
        mode,
        enrolmentStatus,
        now,
        isFreeProgramme ? now : null,
        now
      );
      db.prepare(`
        INSERT INTO payments (
          id, reference_id, enrolment_id, user_id, course_code, amount_display, amount_bdt,
          payment_method, payment_number, sender_phone, transaction_id, status, verified_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        paymentId,
        referenceId,
        enrolmentId,
        linkedUserId,
        approvedCourse.code,
        isFreeProgramme ? "Free Enrolment" : courseDb.fee_display,
        isFreeProgramme ? 0 : courseDb.fee_bdt,
        paymentMethod,
        isFreeProgramme ? "" : MANUAL_PAYMENT_NUMBER,
        isFreeProgramme ? "" : senderNumber,
        isFreeProgramme ? "" : transactionId,
        paymentStatus,
        isFreeProgramme ? now : null,
        now
      );
      if (linkedUserId) {
        createNotification({
          userId: linkedUserId,
          type: isFreeProgramme ? "enrolment" : "payment",
          title: isFreeProgramme ? `Enrolment Confirmed: ${approvedCourse.title}` : `Application Submitted: ${approvedCourse.title}`,
          message: isFreeProgramme ? `Your free enrolment (${referenceId}) is confirmed. You can open the Learning Centre now.` : `Your manual payment (${transactionId}, ref ${referenceId}) is pending admin verification.`,
          link: isFreeProgramme ? `/dashboard/learning/${approvedCourse.code}` : "/dashboard/payments"
        });
      }
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    if (!isFreeProgramme) {
      res.status(201).json({
        status: "pending_verification",
        verificationStatus: "Pending Verification",
        referenceId,
        paymentMethod: paymentMethodRaw,
        paymentNumber: MANUAL_PAYMENT_NUMBER,
        transactionId,
        amount: approvedCourse.fee,
        message: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0986\u09AC\u09C7\u09A6\u09A8 \u098F\u09AC\u0982 bKash / Nagad Manual Payment (TrxID) \u09A4\u09A5\u09CD\u09AF \u09AF\u09BE\u099A\u09BE\u0987\u09AF\u09BC\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AF\u09BE\u099A\u09BE\u0987 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u09B9\u09B2\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 Learner Dashboard-\u098F \u0995\u09CB\u09B0\u09CD\u09B8\u099F\u09BF \u099A\u09BE\u09B2\u09C1 \u09B9\u09AC\u09C7\u0964",
        disclaimer: `Verification Notice: ${MANUAL_PAYMENT_NUMBER} \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 Send Money-\u09B0 Transaction ID \u09AE\u09CD\u09AF\u09BE\u09A8\u09C1\u09AF\u09BC\u09BE\u09B2\u09BF \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09BE\u09B0 \u09AA\u09B0 \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09A8 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09BE \u09B9\u09AC\u09C7\u0964`
      });
      return;
    }
    res.status(201).json({
      status: "confirmed",
      verificationStatus: "Confirmed",
      referenceId,
      message: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09A8\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09BE \u09A5\u09BE\u0995\u09B2\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 Learner Dashboard \u09A5\u09C7\u0995\u09C7\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      disclaimer: "Disclosure: \u098F\u0987 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7\u09B0 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09C7 \u0995\u09CB\u09A8\u09CB \u09AB\u09BF \u09AC\u09BE \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u09A8\u09C7\u0987\u0964 Non-accredited programme\u0964"
    });
  });
  app.post("/api/contact", (req, res) => {
    const clientIp = req.ip || "unknown";
    if (isRateLimited(clientIp, 15)) {
      res.status(429).json({
        error: "\u0985\u09A8\u09C7\u0995\u09AC\u09BE\u09B0 request \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u098F\u0995\u099F\u09C1 \u09AA\u09B0 \u0986\u09AC\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964"
      });
      return;
    }
    const body = req.body || {};
    if (typeof body.website_url === "string" && body.website_url.trim().length > 0) {
      res.status(400).json({ error: "Request \u09AC\u09BE\u09A4\u09BF\u09B2 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964" });
      return;
    }
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2 || !emailRegex.test(email) || subject.length < 3 || message.length < 10) {
      res.status(400).json({
        error: "\u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u09B8\u09A0\u09BF\u0995 \u09A8\u09BE\u09AE, Email Address, Subject \u098F\u09AC\u0982 Message (\u0995\u09AE\u09AA\u0995\u09CD\u09B7\u09C7 \u09E7\u09E6 \u0985\u0995\u09CD\u09B7\u09B0) \u09B2\u09BF\u0996\u09C1\u09A8\u0964"
      });
      return;
    }
    const referenceId = `MSG-${crypto6.randomBytes(3).toString("hex").toUpperCase()}`;
    db.prepare(`
      INSERT INTO contact_messages (reference_id, name, email, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(referenceId, name, email, subject, message, (/* @__PURE__ */ new Date()).toISOString());
    res.status(201).json({
      status: "logged",
      referenceId,
      message: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BE\u09B0\u09CD\u09A4\u09BE\u099F\u09BF \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u0995\u09CB\u09A8\u09CB \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A4\u09A5\u09CD\u09AF \u099C\u09A8\u09B8\u09AE\u0995\u09CD\u09B7\u09C7 \u09AA\u09CD\u09B0\u0995\u09BE\u09B6 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC \u09A8\u09BE\u0964"
    });
  });
  app.post("/api/institutional-inquiries", (req, res) => {
    const clientIp = req.ip || "unknown";
    if (isRateLimited(clientIp, 12)) {
      res.status(429).json({
        error: "Too many institutional inquiry requests from this network. Please wait briefly and try again."
      });
      return;
    }
    const body = req.body || {};
    if (typeof body.website_url === "string" && body.website_url.trim().length > 0) {
      res.status(400).json({ error: "Automated spam validation rejected this submission." });
      return;
    }
    if (typeof body.submittedAfterMs === "number" && body.submittedAfterMs < 800) {
      res.status(400).json({ error: "Please review your inquiry details before submitting." });
      return;
    }
    if ("paymentMethod" in body || "transactionId" in body || "cardNumber" in body || "cvv" in body || "amount" in body) {
      res.status(400).json({
        error: "Institutional services use consultation scoping and never accept course checkout or payment fields."
      });
      return;
    }
    const serviceSlugRaw = typeof body.serviceSlug === "string" ? body.serviceSlug.trim() : "";
    const service = serviceSlugRaw ? getInstitutionalServiceBySlug(serviceSlugRaw) : void 0;
    if (!service) {
      res.status(400).json({
        error: "Selected institutional service is invalid. Please choose one of the listed institutional offerings."
      });
      return;
    }
    const organisationName = typeof body.organisationName === "string" ? body.organisationName.trim() : "";
    const organisationType = typeof body.organisationType === "string" ? body.organisationType.trim() : "company";
    const contactName = typeof body.contactName === "string" ? body.contactName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const requirements = typeof body.requirements === "string" ? body.requirements.trim() : "";
    const pathway = typeof body.pathway === "string" ? body.pathway.trim() : "";
    const sector = typeof body.sector === "string" ? body.sector.trim() : "";
    const privacyConsent = body.privacyConsent === true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (organisationName.length < 2 || organisationName.length > 160 || contactName.length < 2 || contactName.length > 120 || !emailRegex.test(email) || phone.length < 6 || phone.length > 40 || requirements.length < 15 || requirements.length > 4e3 || !privacyConsent) {
      res.status(400).json({
        error: "Please provide your organisation name, contact person, valid email, phone number, requirements (15+ chars), and confirm the disclosure box."
      });
      return;
    }
    if (service.slug === "ai-readiness-assessment" && !pathway) {
      res.status(400).json({
        error: "Please select an AI Readiness Assessment pathway (Companies, Offices, or Universities)."
      });
      return;
    }
    if (service.slug === "ai-implementation-roadmap" && !sector) {
      res.status(400).json({
        error: "Please select a target sector for the AI Implementation Roadmap."
      });
      return;
    }
    const referenceId = `INST-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${crypto6.randomBytes(3).toString("hex").toUpperCase()}`;
    db.prepare(`
      INSERT INTO institutional_inquiries (
        reference_id, service_slug, service_title, organisation_name, organisation_type,
        contact_name, email, phone, pathway, sector, requirements, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      referenceId,
      service.slug,
      service.title,
      organisationName,
      organisationType,
      contactName,
      email,
      phone,
      pathway,
      sector,
      requirements,
      (/* @__PURE__ */ new Date()).toISOString()
    );
    res.status(201).json({
      status: "consultation_requested",
      referenceId,
      serviceSlug: service.slug,
      serviceTitle: service.title,
      pathway: pathway || void 0,
      sector: sector || void 0,
      message: `Your institutional consultation request for ${service.title} has been logged. Our advisory team will review your requirements and reach out to coordinate scoping.`
    });
  });
  app.get("/api/scholarships/availability", (_req, res) => {
    const paidCourses = COURSES.filter((c) => !c.isFree);
    const approvedCounts = db.prepare(`
        SELECT course_code, COUNT(*) as c
        FROM scholarship_applications
        WHERE status = 'Approved'
        GROUP BY course_code
      `).all();
    const approvedMap = /* @__PURE__ */ new Map();
    for (const row of approvedCounts) {
      approvedMap.set(row.course_code, row.c);
    }
    const courses = paidCourses.map((c) => {
      const approvedCount = approvedMap.get(c.code) || 0;
      const feeNum = parseInt(c.fee.replace(/[^\d]/g, ""), 10) || 0;
      const maxWaiverBdt = Math.round(feeNum * 0.5);
      const feeAfterWaiverBdt = feeNum - maxWaiverBdt;
      return {
        code: c.code,
        title: c.title,
        categorySlug: c.categorySlug,
        categoryName: c.categoryName,
        fee: c.fee,
        feeNum,
        maxWaiverPercent: 50,
        maxWaiverBdt,
        feeAfterWaiverBdt,
        approvedCount,
        maxScholarships: 5,
        remainingScholarships: Math.max(0, 5 - approvedCount),
        isOpen: approvedCount < 5
      };
    });
    res.json({
      maxScholarshipsPerCourse: 5,
      maxWaiverPercent: 50,
      policy: {
        allocation: "\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB \u099C\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u09AA\u09CD\u09B0\u09A4\u09BF \u0995\u09CB\u09B0\u09CD\u09B8\u09C7",
        maxWaiver: "Course Fee-\u098F\u09B0 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB\u09E6% \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4",
        basis: "Merit-based \u098F\u09AC\u0982 Need-based \u09AE\u09BE\u09A8\u09AC\u09BF\u0995 \u0993 \u09AE\u09C7\u09A7\u09BE\u09B0 \u09AC\u09BF\u09AC\u09C7\u099A\u09A8\u09BE",
        freeCoursesExcluded: true
      },
      courses
    });
  });
  app.post("/api/scholarships/apply", (req, res) => {
    const clientIp = req.ip || "unknown";
    if (isRateLimited(clientIp, 20)) {
      res.status(429).json({
        error: "\u0985\u09A8\u09C7\u0995\u09AC\u09BE\u09B0 \u0986\u09AC\u09C7\u09A6\u09A8 \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0995\u09BF\u099B\u09C1\u0995\u09CD\u09B7\u09A3 \u0985\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C7 \u0986\u09AC\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964"
      });
      return;
    }
    const body = req.body || {};
    if (typeof body.website_url === "string" && body.website_url.trim().length > 0) {
      res.status(400).json({ error: "Automated spam validation rejected this submission." });
      return;
    }
    if (typeof body.submittedAfterMs === "number" && body.submittedAfterMs < 800) {
      res.status(400).json({ error: "Please review your application details before submitting." });
      return;
    }
    if ("cardNumber" in body || "cvv" in body || "bankAccount" in body || "bankAccountNumber" in body || "pin" in body || "otp" in body || "password" in body) {
      res.status(400).json({
        error: "Security Safeguard: Scholarship \u0986\u09AC\u09C7\u09A6\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CB\u09A8\u09CB \u09AC\u09CD\u09AF\u09BE\u0982\u0995 \u0995\u09BE\u09B0\u09CD\u09A1, \u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09A8\u09AE\u09CD\u09AC\u09B0, \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u09AC\u09BE \u09B8\u0982\u09AC\u09C7\u09A6\u09A8\u09B6\u09C0\u09B2 \u0986\u09B0\u09CD\u09A5\u09BF\u0995 \u09A4\u09A5\u09CD\u09AF \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09AC\u09C7\u09A8 \u09A8\u09BE\u0964"
      });
      return;
    }
    const courseCodeRaw = typeof body.courseCode === "string" ? body.courseCode.trim() : "";
    const course = getCourseByCodeOrSlug(courseCodeRaw);
    if (!course) {
      res.status(400).json({
        error: "\u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE \u09A5\u09C7\u0995\u09C7 \u098F\u0995\u099F\u09BF \u09AC\u09C8\u09A7 \u0995\u09CB\u09B0\u09CD\u09B8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
      });
      return;
    }
    if (course.isFree) {
      res.status(400).json({
        error: "Free Programmes-\u098F\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 Scholarship \u09AA\u09CD\u09B0\u09AF\u09CB\u099C\u09CD\u09AF \u09A8\u09DF; \u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u099F\u09BF \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7 \u09B8\u09AC\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 \u0989\u09A8\u09CD\u09AE\u09C1\u0995\u09CD\u09A4\u0964"
      });
      return;
    }
    const approvedCount = db.prepare("SELECT COUNT(*) as c FROM scholarship_applications WHERE course_code = ? AND status = 'Approved'").get(course.code);
    if (approvedCount.c >= 5) {
      res.status(409).json({
        error: `\u098F\u0987 \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 (${course.code}) \u099C\u09A8\u09CD\u09AF \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 Scholarship \u0995\u09CB\u099F\u09BE (\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09EB \u099C\u09A8) \u09AA\u09C2\u09B0\u09CD\u09A3 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AC\u09CD\u09AF\u09BE\u099A\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C1\u09A8 \u09AC\u09BE \u0985\u09A8\u09CD\u09AF \u0995\u09CB\u09A8\u09CB \u0995\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u09AC\u09C7\u09A6\u09A8 \u0995\u09B0\u09C1\u09A8\u0964`
      });
      return;
    }
    const applicantName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const educationOrProfession = typeof body.educationOrProfession === "string" ? body.educationOrProfession.trim() : "";
    const learningMotivation = typeof body.learningMotivation === "string" ? body.learningMotivation.trim() : "";
    const financialNeedReason = typeof body.financialNeedReason === "string" ? body.financialNeedReason.trim() : "";
    const commitmentStatement = typeof body.commitmentStatement === "string" ? body.commitmentStatement.trim() : "";
    const privacyConsent = body.privacyConsent === true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (applicantName.length < 2 || applicantName.length > 120 || !emailRegex.test(email) || phone.length < 6 || phone.length > 40 || educationOrProfession.length < 2 || educationOrProfession.length > 160 || learningMotivation.length < 15 || learningMotivation.length > 3e3 || financialNeedReason.length < 15 || financialNeedReason.length > 3e3 || commitmentStatement.length < 10 || commitmentStatement.length > 3e3 || !privacyConsent) {
      res.status(400).json({
        error: "\u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09C2\u09B0\u09CD\u09A3 \u09A8\u09BE\u09AE, \u09AC\u09C8\u09A7 \u0987\u09AE\u09C7\u0987\u09B2, \u09B8\u099A\u09B2 \u09AB\u09CB\u09A8 \u09A8\u09AE\u09CD\u09AC\u09B0, \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u0997\u09A4 \u09AC\u09BE \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09AA\u09B0\u09BF\u099A\u09AF\u09BC, \u09B6\u09C7\u0996\u09BE\u09B0 \u0986\u0997\u09CD\u09B0\u09B9, \u0986\u09B0\u09CD\u09A5\u09BF\u0995 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u09C7\u09B0 \u0995\u09BE\u09B0\u09A3 \u098F\u09AC\u0982 \u0995\u09CB\u09B0\u09CD\u09B8 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09BE\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B6\u09CD\u09B0\u09C1\u09A4\u09BF \u09AA\u09C2\u09B0\u09A3 \u0995\u09B0\u09C7 Privacy Policy-\u09A4\u09C7 \u09B8\u09AE\u09CD\u09AE\u09A4\u09BF \u09A6\u09BF\u09A8\u0964"
      });
      return;
    }
    let linkedUserId = req.authUser ? req.authUser.id : null;
    if (!linkedUserId) {
      const match = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
      if (match) linkedUserId = match.id;
    }
    const referenceId = `AAE-SCH-2026-${crypto6.randomBytes(3).toString("hex").toUpperCase()}`;
    const id = `sch_${crypto6.randomBytes(6).toString("hex")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
      INSERT INTO scholarship_applications (
        id, reference_id, user_id, course_code, course_title, applicant_name, email, phone,
        education_or_profession, learning_motivation, financial_need_reason, commitment_statement,
        requested_waiver_pct, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 50, 'Submitted', ?)
    `).run(
      id,
      referenceId,
      linkedUserId,
      course.code,
      course.title,
      applicantName,
      email,
      phone,
      educationOrProfession,
      learningMotivation,
      financialNeedReason,
      commitmentStatement,
      now
    );
    if (linkedUserId) {
      createNotification({
        userId: linkedUserId,
        type: "scholarship",
        title: `Scholarship Application Received: ${course.title}`,
        message: `Your scholarship application (${referenceId}) for up to 50% waiver has been submitted and is queued for academic review.`,
        link: "/scholarships"
      });
    }
    res.status(201).json({
      status: "submitted",
      referenceId,
      courseCode: course.code,
      courseTitle: course.title,
      requestedWaiverPct: 50,
      message: "\u0986\u09AA\u09A8\u09BE\u09B0 Scholarship \u0986\u09AC\u09C7\u09A6\u09A8\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u0986\u09AC\u09C7\u09A6\u09A8\u0995\u09BE\u09B0\u09C0\u09B0 \u09A4\u09A5\u09CD\u09AF \u0993 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u09C0\u09AF\u09BC\u09A4\u09BE \u09AE\u09C2\u09B2\u09CD\u09AF\u09BE\u09AF\u09BC\u09A8 \u0995\u09B0\u09C7 \u09AB\u09B2\u09BE\u09AB\u09B2 \u099C\u09BE\u09A8\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964",
      disclosure: "Atlas AI Education \u0995\u0996\u09A8\u09CB \u09AC\u09CD\u09AF\u09BE\u0982\u0995 \u0995\u09BE\u09B0\u09CD\u09A1 \u09A8\u09AE\u09CD\u09AC\u09B0, PIN \u09AC\u09BE \u09B8\u0982\u09AC\u09C7\u09A6\u09A8\u09B6\u09C0\u09B2 \u0986\u09B0\u09CD\u09A5\u09BF\u0995 \u09A4\u09A5\u09CD\u09AF \u09A6\u09BE\u09AC\u09BF \u0995\u09B0\u09C7 \u09A8\u09BE\u0964 \u0986\u09AC\u09C7\u09A6\u09A8\u0995\u09BE\u09B0\u09C0\u09B0 \u09A4\u09A5\u09CD\u09AF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4\u09AD\u09BE\u09AC\u09C7 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09A5\u09BE\u0995\u09AC\u09C7\u0964"
    });
  });
  app.get("/api/scholarships/my", requireAuth, (req, res) => {
    const userId = req.authUser.id;
    const userEmail = req.authUser.email.toLowerCase();
    const applications = db.prepare(`
        SELECT s.id, s.reference_id, s.course_code, s.course_title,
               s.requested_waiver_pct, s.approved_waiver_pct, s.status,
               s.admin_notes, s.created_at, s.reviewed_at,
               c.fee_display as fee, c.category_name
        FROM scholarship_applications s
        JOIN courses c ON c.code = s.course_code
        WHERE s.user_id = ? OR LOWER(s.email) = ?
        ORDER BY s.created_at DESC
      `).all(userId, userEmail);
    res.json({ applications });
  });
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found." });
  });
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    const p = req.path;
    if (p.startsWith("/api/") || p.startsWith("/assets/") || p.startsWith("/src/") || p.startsWith("/@") || p.includes(".")) {
      next();
      return;
    }
    const querySuffix = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    if (p.length > 1 && p.endsWith("/")) {
      const stripped = p.replace(/\/+$/, "");
      res.redirect(301, `${stripped}${querySuffix}`);
      return;
    }
    if (p.startsWith("/programmes/")) {
      const segment = p.slice("/programmes/".length);
      const matchedCourse = [
        ...discoverFoundationCourses(),
        ...discoverAppliedAiCourses(),
        ...discoverProfessionalDevCourses(),
        discoverSpecialisedCourse()
      ].find((c) => c.code.toLowerCase() === segment.toLowerCase());
      if (matchedCourse && segment !== matchedCourse.code) {
        res.redirect(301, `/programmes/${matchedCourse.code}${querySuffix}`);
        return;
      }
    }
    if (p.startsWith("/institutional-services/")) {
      const segment = p.slice("/institutional-services/".length);
      const matchedSrv = INSTITUTIONAL_SERVICES.find(
        (s) => s.slug.toLowerCase() === segment.toLowerCase()
      );
      if (matchedSrv && segment !== matchedSrv.slug) {
        res.redirect(301, `/institutional-services/${matchedSrv.slug}${querySuffix}`);
        return;
      }
    }
    next();
  });
  const publicDir = path3.resolve(process.cwd(), "public");
  app.get("/manifest.json", (_req, res) => {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(path3.join(publicDir, "manifest.json"));
  });
  app.get("/sw.js", (_req, res) => {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path3.join(publicDir, "sw.js"));
  });
  let vite;
  const distDir = path3.resolve(process.cwd(), "dist");
  if (!IS_PROD) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      "/assets",
      express.static(path3.join(distDir, "assets"), {
        maxAge: "1y",
        immutable: true
      })
    );
    app.use(
      express.static(distDir, {
        index: false
      })
    );
  }
  app.get("*", async (req, res) => {
    try {
      const reqPath = req.path;
      const baseUrl = getBaseUrl(req);
      const templatePath = IS_PROD ? path3.resolve(distDir, "index.html") : path3.resolve(process.cwd(), "index.html");
      let rawHtml = fs3.readFileSync(templatePath, "utf-8");
      if (!IS_PROD && vite) {
        rawHtml = await vite.transformIndexHtml(req.originalUrl, rawHtml);
      }
      const { html, isKnown, isNoindex, canonicalUrl, lastModified } = injectRouteSeoHtml(
        rawHtml,
        reqPath,
        baseUrl
      );
      if (isKnown && !isNoindex) {
        res.setHeader("Link", `<${canonicalUrl}>; rel="canonical"`);
        res.setHeader(
          "X-Robots-Tag",
          "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        );
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      } else {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        res.setHeader("Cache-Control", "private, no-store");
      }
      if (lastModified) {
        res.setHeader("Last-Modified", new Date(lastModified).toUTCString());
      }
      sendCompressed(req, res, isKnown ? 200 : 404, "text/html; charset=utf-8", html);
    } catch (err) {
      if (vite) vite.ssrFixStacktrace(err);
      res.status(500).end("Internal Server Error");
    }
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Atlas AI Education server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
