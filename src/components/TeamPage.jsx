import { Link } from 'react-router-dom'
import './TeamPage.css'

function MemberCard({ member }) {
  return (
    <article className="team-card reveal">
      <div className="team-card__photo">
        {member.photo
          ? <img src={member.photo} alt={member.name} loading="lazy" />
          : <span className="team-card__initials">{member.name.split(' ').map(w => w[0]).join('').slice(0,2)}</span>
        }
      </div>
      <div className="team-card__body">
        <h3 className="team-card__name">{member.name}</h3>
        <p className="team-card__role">{member.role}</p>
        <p className="team-card__bio">{member.bio}</p>
        <div className="team-card__links">
          {member.phone && (
            <a href={`tel:${member.phone}`} className="team-card__link" aria-label={`Call ${member.name}`}>
              📞 <span>{member.phone}</span>
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className="team-card__link" aria-label={`Email ${member.name}`}>
              ✉️ <span>{member.email}</span>
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} className="team-card__link" target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`}>
              in <span>LinkedIn</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function TeamPage({ cfg }) {
  const { team, careers, business } = cfg
  if (!team?.enabled) return null

  const members = (team.members || [])

  return (
    <div className="team-page">

      {/* ── Hero ── */}
      <section className="tp-hero">
        <div className="container tp-hero__inner">
          <nav className="sp-breadcrumb reveal" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Our Team</span>
          </nav>
          <h1 className="tp-hero__headline reveal">{team.headline}</h1>
          <p className="tp-hero__sub reveal">{team.subheadline}</p>
        </div>
      </section>

      {/* ── Team grid ── */}
      <section className="section tp-members">
        <div className="container">
          <div className="tp-members__grid stagger">
            {members.map((m, i) => <MemberCard key={i} member={m} />)}
          </div>
        </div>
      </section>

      {/* ── Careers CTA ── */}
      {careers?.enabled && (
        <section className="tp-careers-cta">
          <div className="container tp-careers-cta__inner">
            <div>
              <h2>Want to Join Us?</h2>
              <p>We're always looking for skilled, reliable people who take pride in their work.</p>
            </div>
            <Link to="/careers" className="btn btn-primary">View Open Roles</Link>
          </div>
        </section>
      )}

    </div>
  )
}
