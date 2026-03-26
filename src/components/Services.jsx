import { Link } from 'react-router-dom'
import './Services.css'

export default function Services({ cfg }) {
  const { services } = cfg
  if (!services) return null

  return (
    <section id="services" className="section services">
      <div className="container">
        <div className="section-header reveal">
          <div className="title-bar" />
          <h2>{services.headline}</h2>
          {services.subheadline && <p>{services.subheadline}</p>}
        </div>

        <div className="services__grid stagger">
          {(services.items || []).map((item, i) => {
            const hasPage = item.page?.enabled && item.page?.slug
            const CardEl  = hasPage ? Link : 'article'
            const cardProps = hasPage
              ? { to: `/services/${item.page.slug}` }
              : {}

            return (
              <CardEl key={i} {...cardProps} className="card service-card reveal">
                <div className="service-card__icon">{item.icon}</div>
                <h3 className="service-card__title">{item.title}</h3>
                <p className="service-card__desc">{item.description}</p>
                {item.features?.length > 0 && (
                  <ul className="service-card__features">
                    {item.features.map((f, j) => (
                      <li key={j}>
                        <span className="service-card__tick" aria-hidden="true">→</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {hasPage && (
                  <div className="service-card__learn-more">
                    Learn more <span aria-hidden="true">→</span>
                  </div>
                )}
              </CardEl>
            )
          })}
        </div>
      </div>
    </section>
  )
}
