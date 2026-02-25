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
} from './schema';

// LLM Adapter
export type { LlmAdapter, LlmMessage } from './llm-adapter';
export { createOpenAIAdapter } from './llm-adapter';

// Prompt Engine
export type { GenerateOptions } from './prompt-engine';
export { generateFromPrompt } from './prompt-engine';

// Block Registry
export { BlockRegistry } from './block-registry';
export type { BlockDefinition, PropField } from './block-registry';

// HTML Renderer
export type { RenderHtmlOptions } from './html-renderer';
export { renderToHtml } from './html-renderer';

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
} from './editor-operations';
