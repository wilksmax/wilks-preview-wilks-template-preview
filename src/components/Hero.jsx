import './Hero.css'

export default function Hero({ cfg }) {
  const { hero, business } = cfg

  const bgStyle = hero.backgroundImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,${hero.overlayOpacity ?? 0.65}), rgba(0,0,0,${hero.overlayOpacity ?? 0.65})), url(${hero.backgroundImage})` }
    : {}

  return (
    <section className={`hero${hero.backgroundImage ? ' hero--image' : ' hero--gradient'}`} style={bgStyle}>
      <div className="hero__noise" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__badge reveal">
          <span className="hero__badge-dot" />
          {business.license || `Est. ${business.founded}`}
        </div>

        <h1 className="hero__headline reveal">
          {hero.headline.split(' ').map((word, i, arr) =>
            i === arr.length - 1
              ? <span key={i} className="accent"> {word}</span>
              : word + ' '
          )}
        </h1>

        <p className="hero__sub reveal">{hero.subheadline}</p>

        <div className="hero__ctas reveal">
          {hero.cta1Text && (
            <a href={hero.cta1Href} className="btn btn-primary hero__cta-main">
              {hero.cta1Text}
            </a>
          )}
          {hero.cta2Text && (
            <a href={hero.cta2Href} className="btn btn-outline">
              {hero.cta2Text}
            </a>
          )}
        </div>

        <div className="hero__trust reveal">
          {business.license && <span><span className="hero__trust-check">✓</span> {business.license}</span>}
          {business.founded && <span><span className="hero__trust-check">✓</span> Est. {business.founded}</span>}
          <span><span className="hero__trust-check">✓</span> {business.address}</span>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
