import './WhyUs.css'

export default function WhyUs({ cfg }) {
  const { whyUs } = cfg
  if (!whyUs?.enabled) return null

  return (
    <section className="section why-us">
      <div className="container">
        <div className="section-header reveal">
          <div className="title-bar" />
          <h2>{whyUs.headline}</h2>
          {whyUs.subheadline && <p>{whyUs.subheadline}</p>}
        </div>

        <div className="why-us__grid stagger">
          {(whyUs.items || []).map((item, i) => (
            <div key={i} className="why-us__item reveal">
              <div className="why-us__icon">{item.icon}</div>
              <div className="why-us__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
