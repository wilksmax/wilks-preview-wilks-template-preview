import './Testimonials.css'

function Stars({ rating }) {
  return (
    <div className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'star star--filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials({ cfg }) {
  const { testimonials } = cfg
  if (!testimonials?.enabled || !testimonials.items?.length) return null

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-header reveal">
          <div className="title-bar" />
          <h2>{testimonials.headline}</h2>
        </div>

        <div className="testimonials__grid stagger">
          {testimonials.items.map((t, i) => (
            <article key={i} className="card testimonial-card reveal">
              <Stars rating={t.rating || 5} />
              <blockquote className="testimonial-card__text">"{t.text}"</blockquote>
              <footer className="testimonial-card__footer">
                <div className="testimonial-card__avatar" aria-hidden="true">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  {t.role && <p className="testimonial-card__role">{t.role}</p>}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
