import './Process.css'

export default function Process({ cfg }) {
  const { process } = cfg
  if (!process) return null

  return (
    <section id="process" className="section process">
      <div className="container">
        <div className="section-header reveal">
          <div className="title-bar" />
          <h2>{process.headline}</h2>
          {process.subheadline && <p>{process.subheadline}</p>}
        </div>

        <div className="process__steps stagger">
          {(process.steps || []).map((step, i) => (
            <div key={i} className="process__step reveal">
              <div className="process__step-num" aria-hidden="true">{step.number}</div>
              <div className="process__step-connector" aria-hidden="true" />
              <div className="process__step-body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
