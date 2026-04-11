import { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing – ServiceGen",
  description: "Choose a plan that fits your team and scale your AI services with confidence.",
};

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Get started with one service and a handful of bots.",
    features: [
      "1 active service",
      "Up to 3 bots",
      "Community support",
    ],
    cta: "/auth/login?returnTo=/dashboard",
    ctaLabel: "Get started",
  },
  {
    name: "Pro",
    price: "$49/mo",
    description: "Grow your organisation with more services and advanced features.",
    features: [
      "Up to 5 active services",
      "Unlimited bots",
      "Email & chat support",
      "Custom data ingestion limits",
    ],
    cta: "/auth/login?returnTo=/dashboard",
    ctaLabel: "Start trial",
  },
  {
    name: "Enterprise",
    price: "Contact us",
    description: "Tailored solutions for large teams and regulated industries.",
    features: [
      "Unlimited services & bots",
      "Dedicated onboarding",
      "Custom SLAs & support",
      "SSO & SCIM provisioning",
    ],
    cta: "mailto:sales@servicegen.app",
    ctaLabel: "Contact sales",
  },
];

export default function PricingPage() {
  return (
    <div className="container py-16 space-y-8">
      <h1 className="text-4xl font-bold text-center">Simple, transparent pricing</h1>
      <p className="mx-auto max-w-2xl text-center text-muted-foreground">
        Whether you’re just getting started or scaling an entire organisation, ServiceGen has
        a plan that’s right for you. Upgrade or downgrade at any time — no hidden fees.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.name} className="flex flex-col justify-between">
            <CardHeader>
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold">{plan.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <ul className="space-y-2 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="h-2 w-2 mt-2 rounded-full bg-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.cta} className="mt-4">
                <Button className="w-full" variant={plan.name === "Pro" ? "default" : "outline"}>
                  {plan.ctaLabel}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}