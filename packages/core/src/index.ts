// Schema
export type {
  LandingPage,
  PageMeta,
  ThemeConfig,
  Section,
  SectionType,
  SectionStyle,
  SectionPropsMap,
  TypedSection,
  HeroProps,
  FeaturesProps,
  FeatureItem,
  PricingProps,
  PricingTier,
  TestimonialsProps,
  Testimonial,
  CtaProps,
  FaqProps,
  FaqItem,
  FooterProps,
  GalleryProps,
  StatsProps,
  TeamProps,
  TeamMember,
  ContactProps,
  GridProps,
  ColumnsProps,
  FormProps,
  FormField,
  EmbedProps,
  ConditionalProps,
  SpacerProps,
  DividerProps,
  TabsProps,
  TabItem,
  AccordionProps,
  AccordionItem,
  CarouselProps,
  NavbarProps,
} from './schema.js';

// LLM Adapter
export type { LlmAdapter, LlmMessage } from './llm-adapter.js';
export { createOpenAIAdapter } from './llm-adapter.js';

// Prompt Engine
export type { GenerateOptions } from './prompt-engine.js';
export { generateFromPrompt } from './prompt-engine.js';

// Block Registry
export { BlockRegistry } from './block-registry.js';
export type { BlockDefinition, PropField } from './block-registry.js';

// HTML Renderer
export type { RenderHtmlOptions } from './html-renderer.js';
export { renderToHtml } from './html-renderer.js';

// Editor Operations
export {
  addSection,
  removeSection,
  moveSection,
  updateSectionProps,
  updateSectionStyle,
  toggleSection,
  duplicateSection,
  getUnusedSectionTypes,
} from './editor-operations.js';
