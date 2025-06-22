# Hey.Builders

**Hey.Builders** is a lightweight, high-trust onboarding funnel designed to match serious builders into micro-teams that actually ship. Built with a React frontend, TanStack router, and Cloudflare Workers for serverless backend logic, it creates a curiosity-fueled experience that earns user commitment before any money changes hands.

## 🔥 Core Concept

Instead of a pitch-first, value-later funnel, we flip the script:

* Start with interactive rotating headlines
* Let users emotionally engage via ❤️ or 🔥
* Reveal progressive, personalized copy based on reactions
* Let users commit to team-oriented values, not just transactions

Once a user selects enough intent-driven actions (e.g., "I'll help someone get unstuck", "\$5" value), and crosses a \$20+ threshold, they're invited to join the private Hey.Builders network.

## 🧱 Tech Stack

* **Frontend**: React + TanStack Router + Tailwind CSS
* **Backend**: Cloudflare Workers + Workers KV for temporary state storage
* **Payments**: Stripe dynamic checkout session (in progress)

## ✨ Key Features

* Emoji-based progressive funnel (rotating copy, opt-in flow)
* Builder commitment checklist (assigns value to actions, not money)
* Nominate others with kindness (AI-enhanced blurbs)
* Tracks and stores headline/emoji/benefit interaction

## 🗂️ File Structure Highlights

```
/src
├── client
│   ├── components
│   │   ├── HeadlinePicker.tsx
│   │   ├── BenefitCycler.tsx
│   │   └── CommitPage.tsx
│   ├── routes
│   │   └── index.tsx
│   └── lib
│       └── tracking.ts
├── worker
│   ├── routes
│   │   └── onboarding.ts
│   └── db
└── shared/schema
```

## 🚀 How to Run

```bash
yarn install
yarn dev
```

* Frontend at: `localhost:5173`
* Workers API served through local wrangler proxy (see `wrangler.toml`)

## 🧪 Todo / Next Up

* [x] Emoji reaction unlock logic
* [x] Commitment funnel with progressive intent
* [x] Nomination UI with AI wording
* [x] Track state to KV
* [ ] Stripe integration
* [ ] Invite validation & referral logic
* [ ] Social DM flow (X/Discord webhook?)

## 💬 Vision

Hey.Builders is for people tired of shallow hype and ready for mutual leverage. We're not building a platform — we're building a trusted set of collaborators.

> If you're in, bring two. Not a pyramid. Just a signal you believe in better ways to build.

---

Inspired by movement. Fueled by momentum. Committed by choice.
