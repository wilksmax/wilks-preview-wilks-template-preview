import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CareersPage.css'

function PositionCard({ position, onApply }) {
  const [open, setOpen] = useState(false)
  return (
    <article className={`position-card reveal${open ? ' position-card--open' : ''}`}>
      <div className="position-card__header" onClick={() => setOpen(o => !o)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}>
        <div className="position-card__meta">
          <h3>{position.title}</h3>
          <div className="position-card__tags">
            <span className="tag tag--type">{position.type}</span>
            <span className="tag tag--loc">📍 {position.location}</span>
          </div>
        </div>
        <span className="position-card__toggle" aria-hidden="true">{open ? '−' : '+'}</span>
      </div>

      {open && (
        <div className="position-card__body">
          <p className="position-card__desc">{position.description}</p>
          {position.requirements?.length > 0 && (
            <>
              <h4>Requirements</h4>
              <ul className="position-card__reqs">
                {position.requirements.map((r, i) => (
                  <li key={i}><span className="req-tick" aria-hidden="true">→</span>{r}</li>
                ))}
              </ul>
            </>
          )}
          <button className="btn btn-primary position-card__apply" onClick={() => onApply(position.title)}>
            Apply for This Role
          </button>
        </div>
      )}
    </article>
  )
}

function ApplicationForm({ careers, business, prefilledRole }) {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', role: prefilledRole || '', coverLetter: '' })
  const [file, setFile]     = useState(null)
  const [status, setStatus] = useState('idle')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')

    const formData = new FormData()
    formData.append('access_key', careers.applicationForm.web3formsKey || '')
    formData.append('subject', `Job Application: ${form.role || 'General'} — ${business.name}`)
    formData.append('name',        form.name)
    formData.append('email',       form.email)
    formData.append('phone',       form.phone)
    formData.append('role',        form.role)
    formData.append('cover_letter', form.coverLetter)
    if (file) formData.append('resume', file)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
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
        <p>Thanks for applying. We'll review your application and be in touch if there's a match.</p>
      </div>
    )
  }

  const activePositions = (careers.positions || []).filter(p => p.enabled)

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

      {activePositions.length > 0 && (
        <div className="contact__field">
          <label htmlFor="cf-crole">Position applying for</label>
          <select id="cf-crole" name="role" value={form.role} onChange={handle}>
            <option value="">— Select a role (or leave blank for general enquiry) —</option>
            {activePositions.map((p, i) => (
              <option key={i} value={p.title}>{p.title}</option>
            ))}
            <option value="General Enquiry">General Enquiry / No specific role</option>
          </select>
        </div>
      )}

      <div className="contact__field">
        <label htmlFor="cf-ccl">Cover letter / message <span>*</span></label>
        <textarea
          id="cf-ccl" name="coverLetter" rows={5} required
          placeholder="Tell us a bit about yourself, your experience, and why you'd like to work with us."
          value={form.coverLetter} onChange={handle}
        />
      </div>

      <div className="contact__field">
        <label htmlFor="cf-resume">Resume (PDF or Word)</label>
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
        {status === 'sending' ? 'Sending…' : 'Submit Application'}
      </button>
    </form>
  )
}

export default function CareersPage({ cfg }) {
  const { careers, business } = cfg
  if (!careers?.enabled) return null

  const [applyRole, setApplyRole] = useState('')
  const bgStyle = careers.heroImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)), url(${careers.heroImage})` }
    : {}

  const activePositions = (careers.positions || []).filter(p => p.enabled)

  const handleApply = (role) => {
    setApplyRole(role)
    setTimeout(() => {
      document.getElementById('careers-apply')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

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

      {/* ── Open Positions ── */}
      {activePositions.length > 0 && (
        <section className="section cp-positions">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>Open Positions</h2>
              <p>{activePositions.length} role{activePositions.length !== 1 ? 's' : ''} currently available</p>
            </div>
            <div className="cp-positions__list">
              {activePositions.map((p, i) => (
                <PositionCard key={i} position={p} onApply={handleApply} />
              ))}
            </div>
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
              <ApplicationForm careers={careers} business={business} prefilledRole={applyRole} key={applyRole} />
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
