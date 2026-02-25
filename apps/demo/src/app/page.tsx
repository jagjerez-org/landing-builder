import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            ✨ Open Source SDK
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">Landing</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Builder</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Describe what you need. AI designs and builds your landing page. Edit visually. Export anywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card href="/generate" icon="✨" title="Generate with AI" description="Describe your page in natural language. GPT-4o builds the entire layout, copy, and design." gradient="from-blue-500 to-violet-500" />
          <Card href="/gallery" icon="🖼️" title="Gallery" description="Browse 4 pre-built examples — SaaS, Restaurant, Yoga Studio, Portfolio. One-click edit." gradient="from-violet-500 to-pink-500" />
          <Card href="/editor" icon="🎨" title="Visual Editor" description="Drag-and-drop blocks, edit properties, preview in real-time. Export HTML or JSON." gradient="from-pink-500 to-orange-500" />
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-400">
            <span>React</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Vue (soon)</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Angular (soon)</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://github.com/jagjerez-org/landing-builder" className="text-blue-500 hover:text-blue-600 transition-colors">GitHub →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ href, icon, title, description, gradient }: { href: string; icon: string; title: string; description: string; gradient: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>{icon}</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
