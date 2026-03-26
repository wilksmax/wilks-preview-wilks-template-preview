import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ProjectsPage.css'

/* ── Lightbox for project images ── */
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [images.length, onClose])

  return (
    <div className="proj-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image lightbox">
      <button className="proj-lb-close" onClick={onClose} aria-label="Close">✕</button>
      <button className="proj-lb-prev" onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length) }} aria-label="Previous">‹</button>
      <img src={images[idx]} alt={`Project photo ${idx + 1}`} onClick={e => e.stopPropagation()} />
      <button className="proj-lb-next" onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length) }} aria-label="Next">›</button>
      {images.length > 1 && (
        <div className="proj-lb-dots" onClick={e => e.stopPropagation()}>
          {images.map((_, i) => (
            <button key={i} className={`proj-lb-dot${i === idx ? ' proj-lb-dot--active' : ''}`} onClick={() => setIdx(i)} aria-label={`Go to image ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Project detail modal ── */
function ProjectModal({ project, onClose }) {
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const allImages = [project.image, ...(project.images || [])].filter(Boolean)

  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && lightboxIdx === null && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIdx, onClose])

  return (
    <>
      <div className="proj-modal-overlay" onClick={onClose} aria-hidden="true" />
      <div className="proj-modal" role="dialog" aria-modal="true" aria-label={project.title}>
        <button className="proj-modal__close" onClick={onClose} aria-label="Close">✕</button>

        {/* Hero image or placeholder */}
        <div className="proj-modal__cover">
          {project.image
            ? <img src={project.image} alt={project.title} />
            : <div className="proj-modal__cover-placeholder"><span>{project.category}</span></div>
          }
        </div>

        <div className="proj-modal__body">
          <div className="proj-modal__meta-row">
            <span className="proj-tag proj-tag--cat">{project.category}</span>
            {project.year && <span className="proj-modal__year">{project.year}</span>}
          </div>

          <h2 className="proj-modal__title">{project.title}</h2>

          <div className="proj-modal__details">
            {project.location && (
              <div className="proj-detail"><span>📍</span><span>{project.location}</span></div>
            )}
            {project.duration && (
              <div className="proj-detail"><span>⏱️</span><span>{project.duration}</span></div>
            )}
            {project.value && (
              <div className="proj-detail"><span>💰</span><span>{project.value}</span></div>
            )}
          </div>

          <p className="proj-modal__desc">{project.description}</p>

          {project.tags?.length > 0 && (
            <div className="proj-modal__tags">
              {project.tags.map((t, i) => (
                <span key={i} className="proj-tag proj-tag--label">#{t}</span>
              ))}
            </div>
          )}

          {/* Additional images gallery */}
          {allImages.length > 1 && (
            <div className="proj-modal__gallery">
              <h4>Project Photos</h4>
              <div className="proj-modal__imgs">
                {allImages.map((src, i) => (
                  <button key={i} className="proj-modal__img-btn" onClick={() => setLightboxIdx(i)} aria-label={`View photo ${i + 1}`}>
                    <img src={src} alt={`${project.title} ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox images={allImages} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  )
}

/* ── Project card ── */
function ProjectCard({ project, onClick }) {
  return (
    <article className="proj-card reveal" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()} aria-label={`View ${project.title}`}>
      <div className="proj-card__img">
        {project.image
          ? <img src={project.image} alt={project.title} loading="lazy" />
          : <div className="proj-card__img-placeholder"><span>{project.category}</span></div>
        }
        <div className="proj-card__overlay" aria-hidden="true">
          <span className="proj-card__view">View Project →</span>
        </div>
      </div>
      <div className="proj-card__body">
        <div className="proj-card__meta">
          <span className="proj-tag proj-tag--cat">{project.category}</span>
          {project.year && <span className="proj-card__year">{project.year}</span>}
        </div>
        <h3 className="proj-card__title">{project.title}</h3>
        <p className="proj-card__location">📍 {project.location}</p>
      </div>
    </article>
  )
}

/* ── Main ProjectsPage ── */
export default function ProjectsPage({ cfg }) {
  const { projects, business } = cfg
  if (!projects?.enabled) return null

  const [activeCategory, setActiveCategory] = useState('All')
  const [activeProject,  setActiveProject]  = useState(null)

  const categories = projects.categories || ['All']
  const items      = (projects.items || []).filter(p => p.enabled !== false)
  const filtered   = activeCategory === 'All'
    ? items
    : items.filter(p => p.category === activeCategory)

  const bgStyle = projects.heroImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)), url(${projects.heroImage})` }
    : {}

  return (
    <div className="projects-page">

      {/* ── Hero ── */}
      <section className={`pp-hero${projects.heroImage ? ' pp-hero--image' : ' pp-hero--gradient'}`} style={bgStyle}>
        <div className="container pp-hero__inner">
          <nav className="sp-breadcrumb reveal" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Our Projects</span>
          </nav>
          <h1 className="pp-hero__headline reveal">{projects.headline}</h1>
          <p className="pp-hero__sub reveal">{projects.subheadline}</p>
          <p className="pp-hero__count reveal">{items.length} projects completed</p>
        </div>
      </section>

      {/* ── Filter tabs ── */}
      <div className="pp-filters">
        <div className="container pp-filters__inner">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pp-filter-btn${activeCategory === cat ? ' pp-filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span className="pp-filter-count">
                  {items.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Projects grid ── */}
      <section className="section pp-grid-section">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="pp-empty">
              <p>No projects in this category yet.</p>
              <button className="btn btn-outline" onClick={() => setActiveCategory('All')}>Show all projects</button>
            </div>
          ) : (
            <div className="pp-grid stagger">
              {filtered.map((p, i) => (
                <ProjectCard key={i} project={p} onClick={() => setActiveProject(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sp-cta-banner reveal">
        <div className="container sp-cta-banner__inner">
          <div className="sp-cta-banner__text">
            <h2>Start Your Project</h2>
            <p>Get a free quote for your residential or commercial project.</p>
          </div>
          <div className="sp-cta-banner__actions">
            <a href="/#contact" className="btn btn-primary">Get a Free Quote</a>
            {business.phone && (
              <a href={`tel:${business.phone}`} className="sp-cta-banner__phone">{business.phone}</a>
            )}
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}

    </div>
  )
}
