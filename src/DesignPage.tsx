import { useState } from 'react'
import logo from '../Final Logo.png'
import './designs.css'

type Variant = 1 | 2 | 3

export const activities = [
  ['Hands-On Workshops', 'Build practical skills in programming, data analysis, scientific computing, modeling, and technical tools.'],
  ['Guest Speakers', 'Meet professionals, researchers, and faculty—and hear how they found their way into technical work.'],
  ['Hackathons & Projects', 'Team up to solve meaningful problems and turn ideas into projects using mathematics, data, and code.'],
  ['Community & Networking', 'Find students, faculty, researchers, and professionals who are curious about the same things you are.'],
]

const events = [
  { type: 'Meeting', date: 'SEP 12', title: 'Fall General Body Meeting', detail: 'Meet the community, see what we are planning, and tell us what you want to explore.' },
  { type: 'Workshop', date: 'SEP 26', title: 'Scientific Python Foundations', detail: 'A beginner-friendly introduction to Python for mathematics, data, and scientific problem solving.' },
  { type: 'Speaker', date: 'OCT 10', title: 'Careers in Scientific Computing', detail: 'A conversation about technical careers, research, graduate study, and the paths between them.' },
  { type: 'Project night', date: 'OCT 24', title: 'COSMIC Build Night', detail: 'Bring an idea or join a team for an open evening of collaborative making and experimentation.' },
]

export const officers = [
  ['PR', 'President', 'Club direction & community'],
  ['VP', 'Vice President', 'Programs & partnerships'],
  ['SC', 'Secretary', 'Communication & records'],
  ['TR', 'Treasurer', 'Resources & planning'],
]

export const photos = [
  ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', 'Students collaborating around a laptop'],
  ['https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', 'Students learning together'],
  ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80', 'A student team working together'],
  ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', 'Students gathering on campus'],
]

const names = { 1: 'Playful Club', 2: 'Modern COSMIC', 3: 'Editorial Club' }

export default function DesignPage({ variant }: { variant: Variant }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <div className={`concept concept-${variant}`}>
    <aside className="concept-switcher" aria-label="Design versions">
      <span>Design direction</span>
      {([1, 2, 3] as Variant[]).map(v => <a key={v} className={v === variant ? 'active' : ''} href={`/design-${v}`}>{v}. {names[v]}</a>)}
    </aside>

    <header className="concept-header"><nav className="concept-nav concept-wrap" aria-label="Main navigation">
      <a className="concept-brand" href="#home" onClick={close}><img src={logo} alt="COSMIC logo"/><span>COSMIC</span></a>
      <button className="concept-menu" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)}><span/><span/><span/></button>
      <div className={`concept-links ${open ? 'open' : ''}`}><a href="#about" onClick={close}>About</a><a href="#events" onClick={close}>Events</a><a href="#activities" onClick={close}>Activities</a><a href="#gallery" onClick={close}>Gallery</a><a className="concept-button compact" href="#join" onClick={close}>Join COSMIC</a></div>
    </nav></header>

    <main>
      <section id="home" className="concept-hero"><div className="concept-wrap hero-layout">
        <div className="hero-text"><p className="concept-kicker">Georgia State University</p><h1>COSMIC</h1><p className="concept-fullname">Community of Students in Math, Innovation, and Computing</p><h2>Explore. Compute.<br/>Build. Connect.</h2><p className="concept-lead">A student community exploring the intersection of mathematics, science, and computing through hands-on experiences, collaboration, and real-world problem solving.</p><div className="concept-actions"><a className="concept-button" href="#join">Join COSMIC <span>→</span></a><a className="concept-button ghost" href="#events">See what’s happening</a></div></div>
        <div className="hero-visual"><div className="hero-photo"><img src={photos[0][0]} alt={photos[0][1]}/><span>Ideas are better together.</span></div><img className="hero-mark" src={logo} alt=""/></div>
      </div></section>

      <section id="about" className="concept-section about-section"><div className="concept-wrap about-layout"><div><p className="concept-kicker">More than a classroom</p><h2>What is COSMIC?</h2></div><div><p className="big-copy">COSMIC is an undergraduate student organization focused on scientific computing and the intersection of mathematics, science, computing, and innovation.</p><p>We create opportunities for students to explore these areas beyond the classroom through hands-on experiences, collaboration, projects, and professional connections.</p><strong className="highlight-line">Taking scientific computing beyond the classroom.</strong></div></div></section>

      <section id="events" className="concept-section events-concept"><div className="concept-wrap"><div className="concept-heading"><div><p className="concept-kicker">Coming up</p><h2>Events & Meetings</h2></div><p>Show up curious. Leave with a new idea, skill, or collaborator.</p></div><div className="concept-events">{events.map((event, i) => <article className="concept-event" key={event.title}><div className="event-date"><b>{event.date.split(' ')[0]}</b><span>{event.date.split(' ')[1]}</span></div><div className="event-content"><span className="event-type">{event.type}</span><h3>{event.title}</h3><p>{event.detail}</p></div><span className="event-arrow" aria-hidden="true">↗</span>{variant === 3 && i === 0 ? <img src={photos[1][0]} alt={photos[1][1]}/> : null}</article>)}</div><p className="concept-note">Sample schedule for this design demo. Final details will be shared through COSMIC and PIN.</p></div></section>

      <section id="activities" className="concept-section activities-concept"><div className="concept-wrap"><div className="concept-heading"><div><p className="concept-kicker">Learn by doing</p><h2>Club Activities</h2></div><p>Different ways to explore, practice, make something, and meet people.</p></div><div className="concept-cards">{activities.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p><b aria-hidden="true">→</b></article>)}</div></div></section>

      <section id="gallery" className="concept-section gallery-concept"><div className="concept-wrap"><div className="concept-heading"><div><p className="concept-kicker">Recent moments</p><h2>Life at COSMIC</h2></div><p>Workshops, project nights, conversations, and the people who make them memorable.</p></div><div className="concept-gallery">{photos.map(([src, alt], i) => <figure key={src}><img src={src} alt={alt}/><figcaption>{['Build nights', 'Learning together', 'Project teams', 'Campus community'][i]}</figcaption></figure>)}</div></div></section>

      <section id="leadership" className="concept-section leadership-concept"><div className="concept-wrap"><div className="concept-heading"><div><p className="concept-kicker">Student-led</p><h2>Meet the Team</h2></div><p>Officers create the space for members to learn, connect, and try ambitious things.</p></div><div className="concept-officers">{officers.map(([initials, role, focus]) => <article key={role}><div>{initials}</div><p>Name coming soon</p><h3>{role}</h3><span>{focus}</span></article>)}</div></div></section>

      <section id="membership" className="concept-section membership-concept"><div className="concept-wrap membership-layout"><div><p className="concept-kicker">Why join?</p><h2>You don’t have to be an expert. You just have to be curious.</h2><p>COSMIC welcomes Georgia State undergraduate students who want to explore mathematics, science, data, technology, research, and problem solving.</p></div><ul><li><span>01</span>Build practical skills</li><li><span>02</span>Work on meaningful projects</li><li><span>03</span>Meet students with similar interests</li><li><span>04</span>Explore careers and research</li></ul></div></section>

      <section id="join" className="concept-section join-concept"><div className="concept-wrap"><img src={logo} alt=""/><p className="concept-kicker">There’s a place for you here</p><h2>Join the COSMIC community.</h2><p>Come to a meeting, try a workshop, or bring an idea you want to build with others.</p><div className="concept-actions"><button className="concept-button" type="button">Join on PIN <span>→</span></button><a className="concept-button ghost" href="mailto:cosmic@example.edu">Contact COSMIC</a></div><small>The official Panther Involvement Network link will be added when available.</small></div></section>
    </main>

    <footer className="concept-footer"><div className="concept-wrap"><div className="footer-lockup"><img src={logo} alt=""/><div><b>COSMIC</b><span>Community of Students in Math, Innovation, and Computing</span><small>Georgia State University</small></div></div><div><a href="#" onClick={e => e.preventDefault()}>Instagram</a><a href="#" onClick={e => e.preventDefault()}>LinkedIn</a><a href="mailto:cosmic@example.edu">Email</a><a href="#" onClick={e => e.preventDefault()}>Constitution</a></div></div></footer>
  </div>
}
