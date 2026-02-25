import type { FC } from 'react';
import React from 'react';
import type { ContactProps, BlockDefinition } from '@landing-builder/core';

const Contact: FC<ContactProps> = ({ headline, subheadline, email, phone, address, formFields }) => (
  <div className="px-6 py-20 md:py-28 max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{headline}</h2>
      {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subheadline}</p>}
    </div>
    <div className="grid md:grid-cols-5 gap-12">
      <form onSubmit={(e) => e.preventDefault()} className="md:col-span-3 space-y-5">
        {formFields.map((f, i) => (
          <label key={i} className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">{f.label}{f.required && <span className="text-red-500 ml-1">*</span>}</span>
            {f.type === 'textarea' ? (
              <textarea placeholder={f.placeholder} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-shadow" />
            ) : f.type === 'select' ? (
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select...</option>
                {f.options?.map((o, j) => <option key={j} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} placeholder={f.placeholder} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" />
            )}
          </label>
        ))}
        <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">Send Message</button>
      </form>
      <div className="md:col-span-2 space-y-6">
        {email && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">✉</div>
            <div><div className="text-sm font-medium text-gray-500">Email</div><a href={`mailto:${email}`} className="text-gray-900 hover:text-blue-600 transition-colors">{email}</a></div>
          </div>
        )}
        {phone && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">📞</div>
            <div><div className="text-sm font-medium text-gray-500">Phone</div><span className="text-gray-900">{phone}</span></div>
          </div>
        )}
        {address && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">📍</div>
            <div><div className="text-sm font-medium text-gray-500">Address</div><span className="text-gray-900">{address}</span></div>
          </div>
        )}
      </div>
    </div>
  </div>
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
