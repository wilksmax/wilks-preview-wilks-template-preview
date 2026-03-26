import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import './ServicePage.css'

/* ── FAQ Accordion item ── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button
        className="faq-item__q"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="faq-item__icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq-item__a"><p>{answer}</p></div>}
    </div>
  )
}

/* ── Related service card ── */
function RelatedCard({ service }) {
  return (
    <Link to={`/services/${service.page.slug}`} className="related-card">
      <span className="related-card__icon">{service.icon}</span>
      <span className="related-card__title">{service.title}</span>
      <span className="related-card__arrow" aria-hidden="true">→</span>
    </Link>
  )
}

/* ── Main ServicePage component ── */
export default function ServicePage({ cfg }) {
  const { slug }    = useParams()
  const services    = cfg.services?.items || []
  const service     = services.find(s => s.page?.slug === slug)
  const related     = services.filter(s => s.page?.enabled && s.page?.slug !== slug)

  // Scroll reveal for this page
  useEffect(() => {
    if (cfg.sections?.animations === false) {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => el.classList.add('visible'))
      return
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
      el.classList.remove('visible')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [slug, cfg.sections?.animations])

  // Scroll to top on page change
  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!service || !service.page?.enabled) return <Navigate to="/" replace />

  const pg      = service.page
  const { business } = cfg
  const bgStyle = pg.heroImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)), url(${pg.heroImage})` }
    : {}

  return (
    <div className="service-page">

      {/* ── Hero ── */}
      <section
        className={`sp-hero${pg.heroImage ? ' sp-hero--image' : ' sp-hero--gradient'}`}
        style={bgStyle}
      >
        <div className="container sp-hero__inner">
          <nav className="sp-breadcrumb reveal" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/#services">Services</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{service.title}</span>
          </nav>

          <div className="sp-hero__icon reveal">{service.icon}</div>
          <h1 className="sp-hero__headline reveal">{pg.heroHeadline}</h1>
          <p className="sp-hero__sub reveal">{pg.heroSub}</p>

          <div className="sp-hero__cta reveal">
            <a href={pg.cta?.buttonHref || '/#contact'} className="btn btn-primary">
              {pg.cta?.buttonText || 'Get a Quote'}
            </a>
            {business.phone && (
              <a href={`tel:${business.phone}`} className="btn btn-outline">
                📞 {business.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Intro + Highlights ── */}
      <section className="section sp-intro">
        <div className="container sp-intro__inner">
          <div className="sp-intro__text reveal-left">
            <div className="title-bar" />
            <h2>About This Service</h2>
            <p>{pg.intro}</p>

            {business.license && (
              <div className="sp-trust-badge">
                <span className="sp-trust-badge__check">✓</span>
                {business.license} · Licensed & Insured
              </div>
            )}
          </div>

          {pg.highlights?.length > 0 && (
            <ul className="sp-highlights stagger reveal-right">
              {pg.highlights.map((h, i) => (
                <li key={i} className="sp-highlight">
                  <span className="sp-highlight__icon">{h.icon}</span>
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Process ── */}
      {pg.process?.enabled && pg.process.steps?.length > 0 && (
        <section className="section sp-process">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>{pg.process.headline}</h2>
            </div>
            <div className="sp-process__steps stagger">
              {pg.process.steps.map((step, i) => (
                <div key={i} className="sp-process__step reveal">
                  <div className="sp-process__num">{step.number}</div>
                  <div className="sp-process__body">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {pg.gallery?.enabled && pg.gallery.images?.length > 0 && (
        <section className="section sp-gallery">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>{pg.gallery.headline}</h2>
            </div>
            <div className="sp-gallery__grid stagger">
              {pg.gallery.images.map((src, i) => (
                <div key={i} className="sp-gallery__item reveal">
                  <img src={src} alt={`${service.title} project ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ── */}
      {pg.faqs?.enabled && pg.faqs.items?.length > 0 && (
        <section className="section sp-faqs">
          <div className="container sp-faqs__inner">
            <div className="sp-faqs__header reveal">
              <div className="title-bar" />
              <h2>{pg.faqs.headline}</h2>
            </div>
            <div className="sp-faqs__list reveal">
              {pg.faqs.items.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      {pg.cta && (
        <section className="sp-cta-banner reveal">
          <div className="container sp-cta-banner__inner">
            <div className="sp-cta-banner__text">
              <h2>{pg.cta.headline}</h2>
              <p>{pg.cta.subheadline}</p>
            </div>
            <div className="sp-cta-banner__actions">
              <a href={pg.cta.buttonHref} className="btn btn-primary">
                {pg.cta.buttonText}
              </a>
              {business.phone && (
                <a href={`tel:${business.phone}`} className="sp-cta-banner__phone">
                  {business.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Services ── */}
      {related.length > 0 && (
        <section className="section sp-related">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>Other Services</h2>
            </div>
            <div className="sp-related__grid stagger">
              {related.map((s, i) => (
                <RelatedCard key={i} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
