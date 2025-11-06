import { analyticsAndQa } from '@/data/insights';
import { integrations } from '@/data/integrations';
import { offlineStrategy, rulesEngine } from '@/data/offline';
import { personas } from '@/data/personas';
import { playbookHighlights } from '@/data/playbook';
import { productGoals, successMetrics } from '@/data/goals';
import { roadmap } from '@/data/roadmap';
import { securityPrivacy } from '@/data/security';
import { techStack } from '@/data/tech-stack';
import { trackingModules } from '@/data/tracking-modules';
import { FeatureCard } from '@/components/feature-card';
import { Hero } from '@/components/hero';
import { Section } from '@/components/section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section
        id="goals"
        eyebrow="North star"
        title="Product goals that center exhausted caregivers"
        description="A privacy-first newborn tracker must be lightning fast, contextually smart, collaborative, and resilient offline."
      >
        {productGoals.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="metrics"
        eyebrow="Success metrics"
        title="Define measurable targets for the MVP"
        description="Keep the team accountable to speed, reliability, and signal-rich nudges that build trust from day one."
      >
        {successMetrics.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="personas"
        eyebrow="Who we serve"
        title="Primary personas and their top tasks"
        description="Each feature ladders up to helping parents, helpers, and pediatricians collaborate without friction."
      >
        {personas.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="platforms"
        eyebrow="Platforms & stack"
        title="PWA-first experience with optional cloud sync"
        description="Choose web technologies that excel on mobile, work offline, and scale to encrypted collaboration when families are ready."
      >
        {techStack.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="modules"
        eyebrow="Daily operations"
        title="Logging modules designed around newborn rhythms"
        description="Fast capture, predictive helpers, and insights that spotlight what matters for caregivers and doctors."
      >
        {trackingModules.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="guidance"
        eyebrow="Guidance"
        title="Playbooks, nudges, and resource libraries"
        description="Keep knowledge at your fingertips even without connectivity, and tailor nudges to each family’s comfort level."
      >
        {playbookHighlights.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="offline"
        eyebrow="Offline-first"
        title="Sync architecture built for dead zones"
        description="Outbox queues, deterministic conflict handling, and attachment pipelines keep data safe until the network returns."
      >
        {offlineStrategy.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="rules"
        eyebrow="Rules engine"
        title="Nudges that respect sleep schedules"
        description="Evaluate sliding windows, manage thresholds, and deliver insights across channels without overwhelming caregivers."
      >
        {rulesEngine.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="security"
        eyebrow="Security & privacy"
        title="Safety controls worthy of family data"
        description="Blend local-only mode, E2EE key management, and careful access controls with practical backup strategies."
      >
        {securityPrivacy.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="integrations"
        eyebrow="Integrations"
        title="Connect calendars, automations, and APIs"
        description="Extend the experience through n8n flows, calendar sync, and focused endpoints without sacrificing privacy."
      >
        {integrations.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="roadmap"
        eyebrow="Delivery"
        title="MVP → v1 roadmap"
        description="Sequence work from core logging into advanced coordination, while keeping stretch goals visible for future iterations."
      >
        {roadmap.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="analytics"
        eyebrow="Insights & QA"
        title="Analytics, doctor packets, and quality checks"
        description="Measure what matters, package it for pediatricians, and run rigorous tests to trust every insight."
      >
        {analyticsAndQa.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
    </>
  );
}
