import type { FC } from 'react';
import React from 'react';
import type { ContactProps, BlockDefinition } from '@landing-builder/core';

const Contact: FC<ContactProps> = ({ headline, subheadline, email, phone, address, formFields }) => (
  <div style={{ padding: '4rem 2rem', maxWidth: 900, margin: '0 auto' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center' }}>{headline}</h2>
    {subheadline && <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '2rem' }}>{subheadline}</p>}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {formFields.map((f, i) => (
          <label key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{f.label}{f.required && ' *'}</span>
            {f.type === 'textarea' ? <textarea placeholder={f.placeholder} rows={4} style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 6 }} /> : <input type={f.type} placeholder={f.placeholder} style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 6 }} />}
          </label>
        ))}
        <button type="submit" style={{ padding: '0.75rem', background: 'var(--lb-primary, #3b82f6)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {email && <div><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></div>}
        {phone && <div><strong>Phone:</strong> {phone}</div>}
        {address && <div><strong>Address:</strong> {address}</div>}
      </div>
    </div>
  </div>
);

export const ContactBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'contact', label: 'Contact', icon: '📧', category: 'content',
  renderer: Contact as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Get in touch', subheadline: "We'd love to hear from you", email: 'hello@example.com', formFields: [
    { type: 'text', name: 'name', label: 'Name', required: true, placeholder: 'Your name' },
    { type: 'email', name: 'email', label: 'Email', required: true, placeholder: 'you@example.com' },
    { type: 'textarea', name: 'message', label: 'Message', required: true, placeholder: 'How can we help?' },
  ]},
};
