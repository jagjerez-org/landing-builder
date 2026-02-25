import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
            🏗️ Landing Builder
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: 600, margin: '0 auto' }}>
            AI-powered landing page builder SDK. Generate from prompts, edit visually, export anywhere.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <Card
            href="/generate"
            icon="✨"
            title="Generate"
            description="Describe your landing page and let AI create it for you"
          />
          <Card
            href="/gallery"
            icon="🖼️"
            title="Gallery"
            description="Browse pre-built examples: SaaS, Restaurant, Yoga, Portfolio"
          />
          <Card
            href="/editor"
            icon="🎨"
            title="Editor"
            description="Open the visual editor with a blank canvas"
          />
        </div>
      </div>
    </div>
  );
}

function Card({ href, icon, title, description }: { href: string; icon: string; title: string; description: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ padding: '2rem', background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'box-shadow 0.2s', height: '100%' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ opacity: 0.6, lineHeight: 1.5 }}>{description}</p>
      </div>
    </Link>
  );
}
