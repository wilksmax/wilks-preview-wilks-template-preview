import { useState } from 'react'
import './Gallery.css'

export default function Gallery({ cfg }) {
  const { gallery } = cfg
  if (!gallery?.enabled || !gallery.images?.length) return null

  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <div className="section-header reveal">
          <div className="title-bar" />
          <h2>{gallery.headline}</h2>
          {gallery.subheadline && <p>{gallery.subheadline}</p>}
        </div>

        <div className="gallery__grid stagger">
          {gallery.images.map((src, i) => (
            <button
              key={i}
              className="gallery__item reveal"
              onClick={() => setLightbox(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt={`Project ${i + 1}`} loading="lazy" />
              <div className="gallery__item-overlay" aria-hidden="true">
                <span>+</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="gallery__lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button className="gallery__lb-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <button
            className="gallery__lb-prev"
            onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + gallery.images.length) % gallery.images.length) }}
            aria-label="Previous"
          >‹</button>
          <img
            src={gallery.images[lightbox]}
            alt={`Project ${lightbox + 1}`}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="gallery__lb-next"
            onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % gallery.images.length) }}
            aria-label="Next"
          >›</button>
        </div>
      )}
    </section>
  )
}
