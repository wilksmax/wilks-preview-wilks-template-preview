import { useState } from 'react'
import './Contact.css'

export default function Contact({ cfg }) {
  const { contact, business } = cfg
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [form, setForm]     = useState({ name: '', phone: '', email: '', message: '' })

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: contact.web3formsKey || '',
          subject:    `New enquiry from ${form.name} — ${business.name}`,
          ...form,
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">

        {/* Info panel */}
        <div className="contact__info reveal-left">
          <div className="title-bar" />
          <h2>{contact.headline}</h2>
          <p className="contact__sub">{contact.subheadline}</p>

          <div className="contact__details">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="contact__detail">
                <span className="contact__detail-icon">📞</span>
                <div>
                  <span className="contact__detail-label">Phone</span>
                  <span className="contact__detail-value">{business.phone}</span>
                </div>
              </a>
            )}
            {business.email && (
              <a href={`mailto:${business.email}`} className="contact__detail">
                <span className="contact__detail-icon">✉️</span>
                <div>
                  <span className="contact__detail-label">Email</span>
                  <span className="contact__detail-value">{business.email}</span>
                </div>
              </a>
            )}
            {business.address && (
              <div className="contact__detail">
                <span className="contact__detail-icon">📍</span>
                <div>
                  <span className="contact__detail-label">Location</span>
                  <span className="contact__detail-value">{business.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form panel */}
        <div className="contact__form-wrap reveal-right">
          {status === 'sent' ? (
            <div className="contact__success">
              <div className="contact__success-icon">✓</div>
              <h3>Message received!</h3>
              <p>{contact.confirmationMessage}</p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={submit} noValidate>
              <div className="contact__row">
                <div className="contact__field">
                  <label htmlFor="cf-name">Full name <span aria-hidden="true">*</span></label>
                  <input
                    id="cf-name" name="name" type="text" required
                    placeholder="John Smith"
                    value={form.name} onChange={handle}
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="cf-phone">Phone</label>
                  <input
                    id="cf-phone" name="phone" type="tel"
                    placeholder="07 1234 5678"
                    value={form.phone} onChange={handle}
                  />
                </div>
              </div>

              <div className="contact__field">
                <label htmlFor="cf-email">Email address <span aria-hidden="true">*</span></label>
                <input
                  id="cf-email" name="email" type="email" required
                  placeholder="you@example.com"
                  value={form.email} onChange={handle}
                />
              </div>

              <div className="contact__field">
                <label htmlFor="cf-message">Tell us about your project</label>
                <textarea
                  id="cf-message" name="message"
                  rows={5}
                  placeholder="What are you building or renovating? When do you need it done?"
                  value={form.message} onChange={handle}
                />
              </div>

              {status === 'error' && (
                <p className="contact__error">Something went wrong — please try again or call us directly.</p>
              )}

              <button type="submit" className="btn btn-primary contact__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
