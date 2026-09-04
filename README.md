<div align="center">

# ⚡ SplitPay — Split the bill. Not the friendship.

### *The 3D Fintech Web Application Built for Campus Roommates, Travel Squads, and Hostel Groups.*

<br/>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![UPI Powered](https://img.shields.io/badge/UPI-1--Tap_Pay-4682B4?style=for-the-badge&logo=google-pay&logoColor=white)](https://www.npci.org.in/)
[![Razorpay Secured](https://img.shields.io/badge/Razorpay-256--bit_Vault-0C2340?style=for-the-badge&logo=razorpay&logoColor=00BAF2)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-MIT-C6FF3D?style=for-the-badge&logoColor=black)](LICENSE)

<br/>

[🌟 Live Demo](https://github.com/Er-prince-kumar/SplitPay) • [🚀 Try the Live Sandbox](#-interactive-3d-live-sandbox) • [📲 WhatsApp Auto-Nudge](#-smart-whatsapp-auto-nudge-engine) • [👨‍💻 Author](https://github.com/Er-prince-kumar)

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [The Problem We Solve](#-the-problem-we-solve)
- [Key Features](#-key-features)
  - [1. Interactive Trip Splitter & Squad Ledger](#1--interactive-trip-splitter--squad-ledger)
  - [2. Smart WhatsApp Auto-Nudge Engine](#2--smart-whatsapp-auto-nudge-engine)
  - [3. 1-Tap UPI & Razorpay Security Vault](#3--1-tap-upi--razorpay-security-vault)
  - [4. Interactive 3D Live Sandbox](#4--interactive-3d-live-sandbox)
  - [5. Three.js Particle Mesh & Web Audio Engine](#5--threejs-particle-mesh--web-audio-engine)
  - [6. Asymmetric 3D Bento Features Grid](#6--asymmetric-3d-bento-features-grid)
  - [7. Campus VIP Waitlist & Auth System](#7--campus-vip-waitlist--auth-system)
- [Tech Stack](#-tech-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Getting Started](#-getting-started)
- [Configuration & WhatsApp Integration](#-configuration--whatsapp-integration)
- [Author & Contact](#-author--contact)
- [License](#-license)

---

## 🌟 Overview

**SplitPay** is a high-performance, interactive 3D fintech web application engineered to eliminate the awkwardness of chasing friends for money. Whether it is splitting a ₹6,000 Manali road trip, ordering late-night hostel pizza, dividing the apartment flat Wi-Fi bill, or booking fest tickets — **SplitPay turns chaotic group expenses into seamless, 1-tap UPI payments.**

Built with **React 19**, **Three.js**, **TailwindCSS v4**, and synthesized **Web Audio API sound design**, SplitPay delivers a gamified, ultra-responsive financial interface tailored specifically for modern campus culture and group travel.

---

## 🚫 The Problem We Solve

| The Campus Reality 😫 | The SplitPay Solution ⚡ |
| :--- | :--- |
| **"Bhai baad me deta hoon" (I'll pay later):** Debts get forgotten, leaving one person broke after every group trip. | **One-Tap UPI Deep Links:** Direct `upi://` links open PhonePe/GPay with the exact amount prefilled. |
| **Awkward Follow-ups:** Nobody likes begging friends to clear pending payments in group chats. | **Automated WhatsApp Nudges:** 4 psychological tones (Polite, Fun Meme, Standard, Urgent) sent in one click. |
| **Math Clutter:** Screenshots of Excel sheets and confusing bill calculations. | **Dynamic Live Ledger:** Automatic per-person math, custom splits, and instant Paid/Pending tracking. |
| **Payment Insecurity:** Worrying about whether transfers went through or got lost. | **Razorpay Vault Standard:** 256-bit encryption compliance and celebratory confetti on settlement. |

---

## 🚀 Key Features

### 1. 🏔️ Interactive Trip Splitter & Squad Ledger
- **Dynamic Group Bill Management**: Enter trip name (e.g., *Manali Snow Trip 2026*), total amount, host details, and squad members.
- **Auto-Equal Split Engine**: Dynamically recalculates everyone's exact share as members join or leave.
- **Instant Status Toggle**: Switch members between `Paid` and `Pending` with instant ledger updates.
- **Confetti Victory**: Trigger full-screen celebratory confetti when all members have cleared their shares!
- **Local Persistence**: Save and reload trips seamlessly using local browser storage.

### 2. 📲 Smart WhatsApp Auto-Nudge Engine
- **Tone Customization Engine**:
  - 🟢 **Standard**: Direct, professional breakdown with UPI payment link.
  - 🤝 **Friendly**: Warm, polite reminder expressing gratitude for the fun trip.
  - 😂 **Fun / Meme**: Lighthearted banter (*"You ate the food, now SplitPay wants the fund!"*).
  - ⏰ **Urgent**: Firm notice for pending group settlements.
- **Instant Phone Formatting**: Automatically validates and prefixes phone numbers (handles 10-digit Indian numbers, stripping special characters and applying `+91` international standard).
- **Direct `wa.me` Linking**: Dispatches customized payment notices directly to WhatsApp Web or mobile app without requiring contact saving.

### 3. 💳 1-Tap UPI & Razorpay Security Vault
- **Direct UPI Intent**: Generates instant deep links compatible with **Google Pay, PhonePe, Paytm, and BHIM UPI**.
- **Instant QR Code Generation**: Display dynamic QR codes for in-person instant scans.
- **Razorpay Security Vault**: Built following Razorpay's trusted enterprise payment gateway standards with 256-bit SSL encryption, RBI compliance, and zero hidden platform charges.

### 4. ⚡ Interactive 3D Live Sandbox
- Real-time interactive playground allowing users to test bill splitting on the fly.
- Sliders for custom tip percentages (0%, 5%, 10%, 15%), GST calculation toggles, and live per-head math visualization.

### 5. 🌌 Three.js Particle Mesh & Web Audio Engine
- **Three.js Interactive Canvas**: Floating starry particle nebula that dynamically reacts to mouse movements and gyroscope tilt.
- **Synthesized Web Audio**: Zero-latency procedural audio cues generated on-the-fly:
  - 🔔 *UPI Success Chime* (Harmonic two-tone uplifting chime).
  - 🖱️ *Haptic Click* (High-frequency snappy micro-interaction).
  - 🎴 *Card Resonance* (Subtle acoustic feedback on 3D hover).

### 6. 🍱 Asymmetric 3D Bento Features Grid
- **Smart Bill Scanner Simulator**: Preview AI OCR receipt scanning from camera snapshots or UPI screenshot uploads.
- **Escalating Reminders**: Preview automated gentle nudges progressing to assertive alerts.
- **Preset Trip Templates**: Instant one-click expense presets for popular destinations (*Goa Beach Shack*, *Manali Mountain Retreat*, *Lonavala Weekend*).

### 7. 🎟️ Campus VIP Waitlist & Auth System
- **Campus VIP Program**: Gamified early-access waitlist with live count tracking for college student ambassadors.
- **Persistent User Session**: Instant login/signup modal supporting host profile customization, custom avatars, and persistent UPI IDs.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Next-generation React with optimized concurrency and rendering |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Blazing fast sub-second HMR and optimized production bundling |
| **Styling** | [TailwindCSS v4](https://tailwindcss.com/) | Modern CSS utility framework with custom design tokens |
| **3D Graphics** | [Three.js](https://threejs.org/) | Interactive WebGL canvas rendering dynamic particle nebula |
| **Audio Engine** | [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Procedural zero-latency UPI chimes and micro-interaction sounds |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, lightweight SVG icon system |
| **Animation & Visuals** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | High-performance canvas particle bursts for completed settlements |
| **Typography** | Space Grotesk, Inter, JetBrains Mono | Curated fonts for fintech clarity and numerical readability |

---

## 📂 Architecture & Folder Structure

```text
SplitPay/
├── public/
│   ├── favicon.svg                         # SplitPay lightning bolt branding
│   └── icons.svg                           # SVG vector icons
├── src/
│   ├── components/
│   │   └── splitpay/
│   │       ├── AuthModal.jsx               # User authentication & UPI profile modal
│   │       ├── FeaturesGrid.jsx            # Bento grid showcase (AI scan, presets)
│   │       ├── Footer.jsx                  # Footer links & copyright
│   │       ├── Hero3D.jsx                  # 3D gyroscopic bill card & headline
│   │       ├── HowItWorks3D.jsx            # 3-step breakdown with interactive cards
│   │       ├── LiveSandbox.jsx             # Real-time bill splitting sandbox
│   │       ├── Navbar.jsx                  # Glassmorphism top navigation bar
│   │       ├── ProblemSection.jsx          # The 3 campus awkward payment problems
│   │       ├── ThreeScene.jsx              # Three.js 3D background particle mesh
│   │       ├── TripSplitterSection.jsx     # Full trip squad ledger & WhatsApp dispatcher
│   │       ├── TrustRazorpay.jsx           # Razorpay security vault guarantee
│   │       └── WaitlistSection.jsx         # Campus VIP early access waitlist
│   ├── utils/
│   │   ├── audio.js                        # Synthesized Web Audio API sound manager
│   │   └── whatsapp.js                     # WhatsApp message builder & phone sanitizer
│   ├── App.jsx                             # Primary application orchestrator
│   ├── main.jsx                            # React 19 root mount
│   └── index.css                           # TailwindCSS styling & design tokens
├── index.html                              # SplitPay SEO metadata & Google Fonts
├── package.json                            # App dependencies & npm scripts
├── vite.config.js                          # Vite configuration
└── README.md                               # Project documentation
```

---

## 💻 Getting Started

Follow these steps to run SplitPay locally on your development machine:

### Prerequisites

- [Node.js](https://nodejs.org/) (`v20.19.0` or later recommended)
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`
- [Git](https://git-scm.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Er-prince-kumar/SplitPay.git
cd SplitPay
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch the development server
```bash
npm run dev
```

Navigate to **`http://localhost:5173/`** in your browser to experience SplitPay live!

### 4. Build for production
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## ⚙️ Configuration & WhatsApp Integration

### Phone Number Formatting
SplitPay automatically handles phone numbers via `src/utils/whatsapp.js`:
- Standard 10-digit Indian numbers (`9876543210`) are automatically sanitized to international format (`919876543210`).
- Supports direct WhatsApp Web and native mobile app dispatch through the official `https://wa.me/` protocol.

### UPI Payment URI Standard
UPI links follow the NPCI specification:
```text
upi://pay?pa={hostUpi}&pn={hostName}&am={amount}&tn={tripName}&cu=INR
```
This enables zero-fee, 1-tap redirection to **PhonePe**, **Google Pay**, **Paytm**, and **BHIM**.

---

## 👨‍💻 Author & Contact

**Prince Kumar**
- 🎓 **Education**: B.Tech in Computer Science & Engineering, Lovely Professional University (LPU)
- 🐙 **GitHub**: [@Er-prince-kumar](https://github.com/Er-prince-kumar)
- 💼 **LinkedIn**: [linkedin.com/in/cse-prince-kumar](https://www.linkedin.com/in/cse-prince-kumar/)
- 📧 **Email**: [princebxr2000@gmail.com](mailto:princebxr2000@gmail.com)
- 📍 **Location**: Punjab / Bihar, India

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — you are free to inspect, fork, and build upon this project for educational and open-source purposes.

<div align="center">
  <sub>Engineered with ⚡ by <b>Prince Kumar</b> | Split the bill. Not the friendship.</sub>
</div>
