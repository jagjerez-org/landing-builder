/**
 * Landing page schema — the universal data model.
 * Frameworks render this; the prompt engine generates this.
 */

// ─── Primitives ──────────────────────────────────────────

export interface LandingPage {
  id: string;
  name: string;
  slug: string;
  meta: PageMeta;
  theme: ThemeConfig;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
  favicon?: string;
}

export interface ThemeConfig {
  preset: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  spacing: 'compact' | 'normal' | 'relaxed';
}

// ─── Sections & Blocks ──────────────────────────────────

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  props: Record<string, unknown>;
  style?: SectionStyle;
}

export type SectionType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'faq'
  | 'gallery'
  | 'stats'
  | 'team'
  | 'contact'
  | 'footer'
  | 'custom';

export interface SectionStyle {
  backgroundColor?: string;
  backgroundImage?: string;
  padding?: string;
  maxWidth?: string;
  className?: string;
}

// ─── Block Props (typed per section) ────────────────────

export interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  image?: string;
  layout: 'centered' | 'split' | 'background';
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesProps {
  headline: string;
  subheadline?: string;
  features: FeatureItem[];
  columns: 2 | 3 | 4;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  highlighted: boolean;
}

export interface PricingProps {
  headline: string;
  subheadline?: string;
  tiers: PricingTier[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsProps {
  headline: string;
  testimonials: Testimonial[];
  layout: 'grid' | 'carousel' | 'stack';
}

export interface CtaProps {
  headline: string;
  subheadline?: string;
  buttonText: string;
  buttonUrl: string;
  variant: 'simple' | 'with-input' | 'split';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  headline: string;
  items: FaqItem[];
}

export interface FooterProps {
  logo?: string;
  tagline?: string;
  links: { label: string; url: string; group?: string }[];
  socials: { platform: string; url: string }[];
  copyright: string;
}

// ─── Section Props Map ──────────────────────────────────

export interface SectionPropsMap {
  hero: HeroProps;
  features: FeaturesProps;
  pricing: PricingProps;
  testimonials: TestimonialsProps;
  cta: CtaProps;
  faq: FaqProps;
  footer: FooterProps;
  gallery: Record<string, unknown>;
  stats: Record<string, unknown>;
  team: Record<string, unknown>;
  contact: Record<string, unknown>;
  custom: Record<string, unknown>;
}

// ─── Typed Section Helper ───────────────────────────────

export type TypedSection<T extends SectionType> = Omit<Section, 'type' | 'props'> & {
  type: T;
  props: SectionPropsMap[T];
};
