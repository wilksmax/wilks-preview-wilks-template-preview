import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CareersPage.css'

function ApplicationForm({ careers, business }) {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', role: '', coverLetter: '' })
  const [file, setFile]     = useState(null)
  const [status, setStatus] = useState('idle')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')

    const formData = new FormData()
    formData.append('access_key', careers.applicationForm.web3formsKey || '')
    formData.append('subject', `Job Application — ${business.name}`)
    formData.append('name',          form.name)
    formData.append('email',         form.email)
    formData.append('phone',         form.phone)
    formData.append('role_interest', form.role)
    formData.append('cover_letter',  form.coverLetter)
    if (file) formData.append('resume', file)

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      const data = await res.json()
      setStatus(data.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="careers-success">
        <div className="careers-success__icon">✓</div>
        <h3>Application Received</h3>
        <p>Thanks for getting in touch. We'll be in touch if there's a great fit.</p>
      </div>
    )
  }

  return (
    <form className="careers-form" onSubmit={submit} noValidate encType="multipart/form-data">
      <div className="careers-form__row">
        <div className="contact__field">
          <label htmlFor="cf-cname">Full name <span>*</span></label>
          <input id="cf-cname" name="name" type="text" required placeholder="Your name" value={form.name} onChange={handle} />
        </div>
        <div className="contact__field">
          <label htmlFor="cf-cphone">Phone</label>
          <input id="cf-cphone" name="phone" type="tel" placeholder="07 1234 5678" value={form.phone} onChange={handle} />
        </div>
      </div>

      <div className="contact__field">
        <label htmlFor="cf-cemail">Email address <span>*</span></label>
        <input id="cf-cemail" name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={handle} />
      </div>

      <div className="contact__field">
        <label htmlFor="cf-crole">What type of role are you interested in?</label>
        <input id="cf-crole" name="role" type="text" placeholder="e.g. Carpenter, Labourer, Project Manager…" value={form.role} onChange={handle} />
      </div>

      <div className="contact__field">
        <label htmlFor="cf-ccl">Tell us about yourself <span>*</span></label>
        <textarea
          id="cf-ccl" name="coverLetter" rows={5} required
          placeholder="Tell us about your experience, trade qualifications, and why you'd like to work with us."
          value={form.coverLetter} onChange={handle}
        />
      </div>

      <div className="contact__field">
        <label htmlFor="cf-resume">Resume (PDF or Word — optional)</label>
        <div className="careers-file-input">
          <label htmlFor="cf-resume" className={`careers-file-btn${file ? ' careers-file-btn--has-file' : ''}`}>
            {file ? `✓ ${file.name}` : '📎 Attach Resume'}
          </label>
          <input
            id="cf-resume" type="file" accept=".pdf,.doc,.docx"
            onChange={e => setFile(e.target.files[0] || null)}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="contact__error">Something went wrong — please try again or email us directly.</p>
      )}

      <button type="submit" className="btn btn-primary careers-form__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send Application'}
      </button>
    </form>
  )
}

export default function CareersPage({ cfg }) {
  const { careers, business } = cfg
  if (!careers?.enabled) return null

  const bgStyle = careers.heroImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)), url(${careers.heroImage})` }
    : {}

  return (
    <div className="careers-page">

      {/* ── Hero ── */}
      <section className={`cp-hero${careers.heroImage ? ' cp-hero--image' : ' cp-hero--gradient'}`} style={bgStyle}>
        <div className="container cp-hero__inner">
          <nav className="sp-breadcrumb reveal" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Careers</span>
          </nav>
          <h1 className="cp-hero__headline reveal">{careers.heroHeadline}</h1>
          <p className="cp-hero__sub reveal">{careers.heroSub}</p>
        </div>
      </section>

      {/* ── Why Join ── */}
      {careers.whyJoin?.enabled && (
        <section className="section cp-why">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>{careers.whyJoin.headline}</h2>
            </div>
            <div className="cp-why__grid stagger">
              {(careers.whyJoin.items || []).map((item, i) => (
                <div key={i} className="cp-why__item reveal">
                  <span className="cp-why__icon">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Intro ── */}
      {careers.intro && (
        <section className="section cp-intro">
          <div className="container cp-intro__inner reveal">
            <p>{careers.intro}</p>
          </div>
        </section>
      )}

      {/* ── Application Form ── */}
      {careers.applicationForm?.enabled && (
        <section id="careers-apply" className="section cp-apply">
          <div className="container cp-apply__inner">
            <div className="cp-apply__header reveal">
              <div className="title-bar" />
              <h2>{careers.applicationForm.headline}</h2>
              <p>{careers.applicationForm.subheadline}</p>
            </div>
            <div className="cp-apply__form reveal">
              <ApplicationForm careers={careers} business={business} />
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
