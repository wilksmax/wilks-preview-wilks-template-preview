import './About.css'

export default function About({ cfg }) {
  const { about, business } = cfg
  if (!about) return null

  const paragraphs = (about.body || '').split('\n\n').filter(Boolean)

  return (
    <section id="about" className="section about">
      <div className="container about__inner">

        {/* Image panel */}
        <div className="about__img-wrap reveal-left">
          {about.image
            ? <img src={about.image} alt={`${business.name} team`} className="about__img" />
            : (
              <div className="about__img-placeholder">
                <div className="about__img-pattern" aria-hidden="true" />
                <div className="about__img-tag">
                  <span className="about__img-tag-num">{business.founded && `Est. ${business.founded}`}</span>
                  <span className="about__img-tag-label">{business.address}</span>
                </div>
              </div>
            )
          }
          {/* Years badge */}
          {business.founded && (
            <div className="about__years-badge">
              <span className="about__years-num">{new Date().getFullYear() - parseInt(business.founded, 10)}</span>
              <span className="about__years-label">Years</span>
            </div>
          )}
        </div>

        {/* Content panel */}
        <div className="about__content reveal-right">
          <div className="title-bar" />
          <h2>{about.headline}</h2>
          <div className="about__body">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {about.highlights?.length > 0 && (
            <ul className="about__highlights stagger">
              {about.highlights.map((h, i) => (
                <li key={i} className="about__highlight reveal">
                  <span className="about__highlight-icon">{h.icon}</span>
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          )}

          {cfg.business?.phone && (
            <a href={`tel:${cfg.business.phone}`} className="btn btn-primary about__cta">
              Call {cfg.business.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
