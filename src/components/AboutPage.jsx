import { Link } from 'react-router-dom'
import './AboutPage.css'

function Timeline({ milestones }) {
  return (
    <div className="ap-timeline">
      {milestones.map((m, i) => (
        <div key={i} className="ap-timeline__item reveal">
          <div className="ap-timeline__year">{m.year}</div>
          <div className="ap-timeline__dot" aria-hidden="true" />
          <div className="ap-timeline__text">{m.text}</div>
        </div>
      ))}
    </div>
  )
}

export default function AboutPage({ cfg }) {
  const { aboutPage, business, stats, team } = cfg
  if (!aboutPage?.enabled) return null

  const bgStyle = aboutPage.heroImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)), url(${aboutPage.heroImage})` }
    : {}

  const previewMembers = (team?.members || []).slice(0, aboutPage.teamPreview?.maxVisible || 4)

  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section
        className={`ap-hero${aboutPage.heroImage ? ' ap-hero--image' : ' ap-hero--gradient'}`}
        style={bgStyle}
      >
        <div className="container ap-hero__inner">
          <nav className="sp-breadcrumb reveal" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">About Us</span>
          </nav>
          <h1 className="ap-hero__headline reveal">{aboutPage.heroHeadline}</h1>
          <p className="ap-hero__sub reveal">{aboutPage.heroSub}</p>
          {business.founded && (
            <div className="ap-hero__badge reveal">
              <span className="ap-hero__badge-dot" />
              Est. {business.founded} · {business.address}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats bar ── */}
      {stats?.length > 0 && (
        <div className="ap-stats-bar">
          <div className="container ap-stats-bar__inner">
            {stats.map((s, i) => (
              <div key={i} className="ap-stat">
                <span className="ap-stat__val">{s.prefix || ''}{s.value}{s.suffix || ''}</span>
                <span className="ap-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mission ── */}
      {aboutPage.mission?.enabled && (
        <section className="section ap-mission">
          <div className="container ap-mission__inner">
            <div className="ap-mission__icon reveal" aria-hidden="true">🎯</div>
            <div className="ap-mission__body reveal">
              <div className="title-bar" />
              <h2>{aboutPage.mission.headline}</h2>
              <p>{aboutPage.mission.text}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Story ── */}
      {aboutPage.story?.enabled && (
        <section className="section ap-story">
          <div className="container ap-story__inner">
            <div className="ap-story__label reveal">
              <div className="title-bar" />
              <h2>{aboutPage.story.headline}</h2>
            </div>
            <div className="ap-story__text reveal-right">
              {(aboutPage.story.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Values ── */}
      {aboutPage.values?.enabled && (
        <section className="section ap-values">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>{aboutPage.values.headline}</h2>
            </div>
            <div className="ap-values__grid stagger">
              {(aboutPage.values.items || []).map((v, i) => (
                <div key={i} className="card ap-value-card reveal">
                  <div className="ap-value-card__icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Milestones timeline ── */}
      {aboutPage.milestones?.enabled && (
        <section className="section ap-milestones">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>{aboutPage.milestones.headline}</h2>
            </div>
            <Timeline milestones={aboutPage.milestones.items || []} />
          </div>
        </section>
      )}

      {/* ── Team preview ── */}
      {aboutPage.teamPreview?.enabled && team?.enabled && previewMembers.length > 0 && (
        <section className="section ap-team-preview">
          <div className="container">
            <div className="section-header reveal">
              <div className="title-bar" />
              <h2>{aboutPage.teamPreview.headline || 'The People Behind It'}</h2>
            </div>
            <div className="ap-team-preview__grid stagger">
              {previewMembers.map((m, i) => (
                <div key={i} className="ap-team-card reveal">
                  <div className="ap-team-card__avatar">
                    {m.photo
                      ? <img src={m.photo} alt={m.name} />
                      : <span>{m.name.charAt(0)}</span>
                    }
                  </div>
                  <div className="ap-team-card__info">
                    <p className="ap-team-card__name">{m.name}</p>
                    <p className="ap-team-card__role">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ap-team-preview__cta reveal">
              <Link to="/team" className="btn btn-outline">
                Meet the Full Team →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      {aboutPage.cta && (
        <section className="sp-cta-banner reveal">
          <div className="container sp-cta-banner__inner">
            <div className="sp-cta-banner__text">
              <h2>{aboutPage.cta.headline}</h2>
              <p>{aboutPage.cta.subheadline}</p>
            </div>
            <div className="sp-cta-banner__actions">
              <a href={aboutPage.cta.buttonHref} className="btn btn-primary">{aboutPage.cta.buttonText}</a>
              {business.phone && (
                <a href={`tel:${business.phone}`} className="sp-cta-banner__phone">{business.phone}</a>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
