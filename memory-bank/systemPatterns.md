# System Patterns

## Architecture
- **SPA with Next.js App Router:** Single-page funnel experience with separate admin route
- **Component-based:** Reusable UI primitives (Button, Card, Badge) composed into sections
- **Client-side booking state:** React Hook Form manages entire booking flow client-side

## Key Patterns
1. **Multi-step Form:** BookingForm orchestrator manages 5 child step components via step state
2. **Slide Transitions:** AnimatePresence + motion variants for step-to-step transitions
3. **Glass Card Design:** `glass-card` utility class for consistent surface styling
4. **Gold Gradient System:** `gold-gradient` and `gold-gradient-text` utility classes

## Component Relationships
```
page.tsx
├── HeroSection (scroll CTA → #booking)
├── SocialProof (testimonials, trust counters)
├── BookingSection
│   └── BookingForm (orchestrator)
│       ├── StepIndicator
│       ├── SelectService (step 1)
│       ├── SelectBarber (step 2)
│       ├── SelectDateTime (step 3)
│       ├── CustomerDetails (step 4)
│       └── Confirmation (step 5)
├── Footer
└── StickyBookButton (fixed, appears on scroll)

/admin
├── LoginForm (mock auth)
└── AdminPage
    ├── Stats cards
    ├── BarberFilter
    ├── AppointmentList → AppointmentCard
    └── AvailabilityManager
```

## Design Decisions
- Mock data in constants.ts for offline development; Supabase integration ready
- Zod validation only on step 4 (customer details) for speed
- Admin uses simple tab-based navigation (appointments vs availability)
- **Anti-spam protection**:
  - Multi-layer defense: rate limiting → duplicate detection → suspicious flagging
  - Customer identification via normalized name + phone
  - Configurable thresholds in `antiSpam.ts`
  - Non-blocking for legitimate users (warning + confirmation vs hard block)
  - Admin visibility via flagged appointments with expandable details
