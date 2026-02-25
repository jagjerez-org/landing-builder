/**
 * Landing page schema — the universal data model.
 * Supports both simple flat layouts and complex nested trees.
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
  /** Nested children — enables complex layouts (grids, columns, tabs, conditionals) */
  children?: Section[];
}

export type SectionType =
  // Content
  | 'hero'
  | 'features'
  | 'gallery'
  | 'stats'
  | 'team'
  | 'contact'
  // Social proof
  | 'testimonials'
  | 'faq'
  // Conversion
  | 'pricing'
  | 'cta'
  | 'form'
  // Layout
  | 'grid'
  | 'columns'
  | 'spacer'
  | 'divider'
  | 'tabs'
  | 'accordion'
  | 'carousel'
  // Integrations
  | 'embed'
  | 'conditional'
  // Navigation
  | 'navbar'
  | 'footer'
  // Catch-all
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

// ─── New Section Props ──────────────────────────────────

export interface GalleryProps {
  headline: string;
  images: { src: string; alt: string; caption?: string }[];
  columns: 2 | 3 | 4;
  layout: 'grid' | 'masonry';
}

export interface StatsProps {
  headline?: string;
  stats: { value: string; label: string; icon?: string }[];
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  socials?: { platform: string; url: string }[];
}

export interface TeamProps {
  headline: string;
  subheadline?: string;
  members: TeamMember[];
}

export interface ContactProps {
  headline: string;
  subheadline?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapEmbed?: string;
  formFields: FormField[];
}

export interface GridProps {
  columns: number;
  gap: string;
  /** Children are rendered in grid cells */
}

export interface ColumnsProps {
  /** Column ratios like "1:2:1" or "1:1" */
  ratios: string;
  gap: string;
}

export interface FormField {
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface FormProps {
  headline?: string;
  fields: FormField[];
  submitText: string;
  submitUrl: string;
  method: 'POST' | 'GET';
  successMessage: string;
}

export interface EmbedProps {
  url: string;
  type: 'iframe' | 'video' | 'map' | 'calendar' | 'custom';
  aspectRatio: '16:9' | '4:3' | '1:1' | 'auto';
  maxWidth?: string;
}

export interface ConditionalProps {
  /** JS expression evaluated at render time */
  condition: string;
  /** Show/hide based on condition */
}

export interface SpacerProps {
  height: string;
}

export interface DividerProps {
  color?: string;
  thickness?: string;
  style: 'solid' | 'dashed' | 'dotted';
  maxWidth?: string;
}

export interface TabItem {
  label: string;
  icon?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Children[i] maps to tabs[i] */
  defaultTab?: number;
}

export interface AccordionItem {
  title: string;
  /** Content is rendered from children or from a content string */
  content?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export interface CarouselProps {
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export interface NavbarProps {
  logo?: string;
  logoText?: string;
  links: { label: string; url: string }[];
  ctaText?: string;
  ctaUrl?: string;
  sticky?: boolean;
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
  gallery: GalleryProps;
  stats: StatsProps;
  team: TeamProps;
  contact: ContactProps;
  grid: GridProps;
  columns: ColumnsProps;
  form: FormProps;
  embed: EmbedProps;
  conditional: ConditionalProps;
  spacer: SpacerProps;
  divider: DividerProps;
  tabs: TabsProps;
  accordion: AccordionProps;
  carousel: CarouselProps;
  navbar: NavbarProps;
  custom: Record<string, unknown>;
}

// ─── Typed Section Helper ───────────────────────────────

export type TypedSection<T extends SectionType> = Omit<Section, 'type' | 'props'> & {
  type: T;
  props: SectionPropsMap[T];
};
