import { deploymentPlan } from '@/data/deployment';
import { playbookHighlights } from '@/data/playbook';
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
        id="stack"
        eyebrow="Architecture"
        title="Next.js core with batteries for a full caregiving suite"
        description="A production-ready technical blueprint so you can focus on bonding instead of boilerplate."
      >
        {techStack.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="modules"
        eyebrow="Daily Ops"
        title="Logging modules designed around newborn rhythms"
        description="Fast capture, smart defaults, and insights that highlight what matters for you and your pediatrician."
      >
        {trackingModules.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="playbook"
        eyebrow="Guidance"
        title="Curated playbooks for every 3AM question"
        description="Knowledge stays private but always available: contextual nudges, parent-specific tips, and offline-first content."
      >
        {playbookHighlights.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
      <Section
        id="deployment"
        eyebrow="Self-Hosting"
        title="Ship it to your home lab with confidence"
        description="Secure defaults, monitoring, and backup strategies packaged for Docker Compose."
      >
        {deploymentPlan.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>
    </>
  );
}
