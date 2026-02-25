import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25">LB</div>
            <span className="font-bold text-gray-900">Landing Builder</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/jagjerez-org/landing-builder" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">GitHub</a>
            <Link href="/generate" className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">Get Started →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-float delay-500" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium text-blue-700 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Open Source SDK
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8">
              <span className="gradient-text">AI-Powered</span>
              <br />
              <span className="text-gray-900">Landing Pages</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
              Describe what you need. AI designs and builds your landing page.
              Edit visually. Export anywhere.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/generate" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300">
                Generate with AI
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="/gallery" className="inline-flex items-center px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">Browse Examples</Link>
            </div>
          </div>

          {/* Preview mockup */}
          <div className="mt-20 animate-fade-in-up delay-300">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-2 px-4 py-1 bg-white/5 rounded-lg text-xs text-gray-400 text-center">mycompany.com</div>
                </div>
                {/* Content */}
                <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
                  <div className="space-y-4 text-center">
                    <div className="inline-flex px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-600 font-medium">✨ New Feature</div>
                    <div className="h-8 w-2/3 mx-auto bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg" />
                    <div className="h-4 w-1/2 mx-auto bg-gray-100 rounded" />
                    <div className="flex justify-center gap-3 pt-2">
                      <div className="h-10 w-32 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl" />
                      <div className="h-10 w-32 bg-gray-100 rounded-xl border border-gray-200" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-8">
                      <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm" />
                      <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm" />
                      <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <Card href="/generate" icon="✨" title="Generate with AI" description="Describe your page in natural language. GPT-4o or Claude builds the entire layout, copy, and design." gradient="from-blue-500 to-violet-500" />
          <Card href="/gallery" icon="🖼️" title="Gallery" description="Browse pre-built examples — SaaS, Restaurant, Yoga Studio, Portfolio. One-click to edit." gradient="from-violet-500 to-pink-500" />
          <Card href="/editor" icon="🎨" title="Visual Editor" description="Drag-and-drop blocks, edit properties, preview in real-time. Export HTML or JSON." gradient="from-pink-500 to-orange-500" />
        </div>
      </section>

      {/* Tech stack */}
      <section className="px-6 py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <span className="font-medium">Built with</span>
            <span className="flex items-center gap-2 text-gray-600 font-semibold">React</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-gray-400">Vue (soon)</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-gray-400">Angular (soon)</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="https://github.com/jagjerez-org/landing-builder" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">GitHub →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ href, icon, title, description, gradient }: { href: string; icon: string; title: string; description: string; gradient: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-full p-8 bg-white rounded-3xl border border-gray-100 card-hover overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
        <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
        <h2 className="relative text-xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="relative text-gray-500 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
