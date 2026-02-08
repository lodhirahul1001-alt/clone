import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { Check, ChevronDown } from "lucide-react";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

const FAQ = [
  {
    q: "How does music distribution work?",
    a: "Upload your track once, choose stores (Spotify, Apple Music, YouTube Music, etc.), and we deliver it to DSPs. You keep 100% of your rights and can monitor performance from your dashboard.",
  },
  {
    q: "Do you take a percentage of my royalties?",
    a: "No. All plans are subscription-based. Your earnings are yours — we only provide the tools to track and manage your releases.",
  },
  {
    q: "Can I switch plans anytime?",
    a: "Yes. Upgrade or downgrade at any time. Your catalog stays available and your analytics remain in your account.",
  },
  {
    q: "Do you support YouTube Content ID?",
    a: "Yes, Pro and Studio plans include automated YouTube Content ID so you can monetize user-generated content using your music.",
  },
  {
    q: "What payout methods do you support?",
    a: "Bank transfer and PayPal are supported. Your payout options can be managed from your dashboard.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const [openIndex, setOpenIndex] = useState(0);

  const planCards = useMemo(() => {
    const yearly = billing === "yearly";
    return [
      {
        tag: "Free Plan",
        popular: false,
        // price: yearly ? "$39" : "₹00 Off",
        // cadence: yearly ? "/mo (billed yearly)" : "0/month",
        description: "Perfect for artists starting distribution.",
        features: [
       "Upload unlimited releases",
"75% Revenue",
"No take down after plan expires",
"Monthly Analytics & Revenue",
"Spotify Verification",
"Live automatically on new stores",
"Approval in min 7 working days",
"Customer support in 48 hours",
"Free Backlinks",
"Access to promotional tools",
// "Instagram Account Linking",
// "YouTube Official Artist Channel",
// "Free YouTube Content ID"

        ],
      },
      {
        tag: "Paid Plan",
        popular: true,
        price: yearly ? " ₹49999" : "₹4999",
        cadence: yearly ? "/ (billed yearly)" : "/yearly",
        description: "For growing catalogs and teams.",
        features: [
      "Upload unlimited releases",
        "100% Revenue",
"No take down after plan expires",
"Monthly Analytics & Revenue",
"Spotify Verification",
"Live automatically on new stores",
"Approval in min 4 working days",
"Customer support in 24 hours",
"Free Backlinks",
"Access to promotional tools",
"Instagram Account Linking",
"YouTube Official Artist Channel",
"Free YouTube Content ID",
        ],
      },
      // {
      //   tag: "Pro Plan",
      //   popular: false,
      //   price: yearly ? "₹2999" : "₹2999",
      //   cadence: yearly ? "/mo (billed yearly)" : "/month",
      //   description: "For labels, studios & high volume distribution.",
      //   features: [
      //     "Everything in Popular",
      //     "YouTube Content ID",
      //     "Custom reporting exports",
      //     "Dedicated account manager",
      //     "24/7 studio support",
      //   ],
      // },
    ];
  }, [billing]);

  return (
    <div className="container-page  pt-14 pb-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Try it first, then <span className="text-neon">choose a plan</span>.
        </h1>
        <p className="mt-4 text-[color:var(--muted)] max-w-2xl mx-auto">
          Simple pricing for music distribution and analytics. Change or cancel anytime.
        </p>
{/* 
        <div className="mt-8 inline-flex items-center gap-3 glass-soft px-4 py-2">
          <span className={classNames("text-sm", billing === "monthly" ? "text-[color:var(--text)]" : "text-[color:var(--muted)]")}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setBilling((v) => (v === "monthly" ? "yearly" : "monthly"))}
            className="relative inline-flex h-7 w-14 items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
            aria-label="Toggle billing"
          >
            <span
              className={classNames(
                "inline-block h-5 w-5 transform rounded-full transition",
                "bg-[color:var(--accent-1)]",
                billing === "yearly" ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
          <span className={classNames("text-sm", billing === "yearly" ? "text-[color:var(--text)]" : "text-[color:var(--muted)]")}>
            Yearly
          </span>
        </div> */}
      </div>

      {/* Pricing cards */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-19">
        {planCards.map((p, idx) => (
          <div
            key={idx}
            className={classNames(
              "glass p-7 relative overflow-hidden",
              p.popular ? "ring-2 ring-[color:var(--accent-1)]" : ""
            )}
          >
            <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full opacity-40 blur-2xl"
              style={{ background: `radial-gradient(circle, var(--accent-2), transparent 60%)` }}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold tracking-wide">
                {p.tag}
                {p.popular && (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
                    Paid
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <div className="text-4xl font-semibold">{p.price}</div>
              <div className="text-sm text-[color:var(--muted)] pb-1">{p.cadence}</div>
            </div>

            <p className="mt-3 text-sm text-[color:var(--muted)]">{p.description}</p>

            <div className="mt-6 space-y-3">
              {p.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
                    <Check className="h-4 w-4" />
                  </span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <Link
              to={p.tag === "Free Plan"
                ? "/signup"
                : `/pricing-details?plan=${encodeURIComponent(
                    p.tag.split(" ")[0]
                  )}&billing=${billing}`}
              className={classNames(
                "mt-8 w-full text-center text-neon",
                p.popular ? "btn-primary" : "btn-ghost"
              )}
            >
              {p.tag === "Free Plan" ? "Free Singup Now" : "View payment details"}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">
          Frequently Asked <span className="text-neon">Questions</span>
        </h2>

        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {FAQ.map((item, idx) => {
            const open = idx === openIndex;
            return (
              <div key={idx} className="glass-soft p-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex((v) => (v === idx ? -1 : idx))}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown
                    className={classNames(
                      "h-5 w-5 transition-transform",
                      open ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>
                {open && (
                  <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
