import type { FC } from 'react';
import React from 'react';
import type { ContactProps, BlockDefinition } from '@landing-builder/core';

const Contact: FC<ContactProps> = ({ headline, subheadline, email, phone, address, formFields }) => (
  <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto">
    <div className="text-center mb-16 animate-fade-in-up">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{headline}</h2>
      {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{subheadline}</p>}
    </div>
    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-3 space-y-5">
        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-5">
          {formFields.map((f, i) => (
            <label key={i} className="block">
              <span className="text-sm font-semibold text-gray-700 mb-1.5 block">{f.label}{f.required && <span className="text-red-500 ml-1">*</span>}</span>
              {f.type === 'textarea' ? (
                <textarea placeholder={f.placeholder} rows={4} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-y transition-all duration-200" />
              ) : f.type === 'select' ? (
                <select className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200">
                  <option value="">Select...</option>
                  {f.options?.map((o, j) => <option key={j} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type} placeholder={f.placeholder} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200" />
              )}
            </label>
          ))}
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-[var(--lb-primary,#3b82f6)] to-[var(--lb-secondary,#8b5cf6)] text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300">
            Send Message
          </button>
        </div>
      </form>
      {/* Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 space-y-6">
          {email && (
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 text-lg">✉</div>
              <div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</div><a href={`mailto:${email}`} className="text-gray-900 hover:text-blue-600 transition-colors font-medium">{email}</a></div>
            </div>
          )}
          {phone && (
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 text-lg">📞</div>
              <div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</div><span className="text-gray-900 font-medium">{phone}</span></div>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 text-lg">📍</div>
              <div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</div><span className="text-gray-900 font-medium">{address}</span></div>
            </div>
          )}
        </div>
        {/* Trust badge */}
        <div className="p-6 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3">
          <div className="text-2xl">🔒</div>
          <div>
            <div className="text-sm font-semibold text-green-800">Secure & Private</div>
            <div className="text-xs text-green-600">Your data is encrypted and never shared</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const ContactBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'contact', label: 'Contact', icon: '📧', category: 'content',
  renderer: Contact as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Get in touch', subheadline: "Have a question? We'd love to hear from you.", email: 'hello@company.com', phone: '+1 (555) 123-4567', address: '123 Main St, San Francisco, CA', formFields: [
    { type: 'text', name: 'name', label: 'Full Name', required: true, placeholder: 'John Doe' },
    { type: 'email', name: 'email', label: 'Email', required: true, placeholder: 'john@company.com' },
    { type: 'textarea', name: 'message', label: 'Message', required: true, placeholder: 'Tell us about your project...' },
  ]},
};
