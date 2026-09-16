import { lazy, Suspense, useState } from 'react'
import logo from '../Final Logo.png'
import DesignPage from './DesignPage'
import Design2V2 from './Design2V2'

const DesignLab = lazy(() => import('./design-lab/DesignLab'))
const CosmicPosterV2 = lazy(() => import('./design-lab/CosmicPosterV2'))
const CosmicSite = lazy(() => import('./cosmic-site/CosmicSite'))

const cosmicSitePages = ['/about', '/events', '/activities', '/gallery', '/leadership']

const activities = [
  ['Hands-On Workshops', 'Students develop practical skills in programming, data analysis, scientific computing, computational modeling, and technical tools.'],
  ['Guest Speakers', 'Industry professionals, researchers, and faculty share their career paths, research, projects, and real-world experiences.'],
  ['Hackathons & Projects', 'Students collaborate to solve meaningful problems, experiment with ideas, and create projects using mathematics, computing, data, and technology.'],
  ['Community & Networking', 'COSMIC connects students with peers, faculty, researchers, and professionals who share similar interests.'],
]

const building = ['Explore STEM interests beyond coursework', 'Develop practical technical skills', 'Collaborate with other students', 'Work on meaningful problems', 'Learn about careers and research', 'Meet professionals and faculty', 'Discover research opportunities', 'Gain confidence using mathematics and computing']
const interests = ['Mathematics', 'Computing', 'Science', 'Data', 'Technology', 'Research', 'Problem solving']
const benefits = ['Build practical skills', 'Work on projects', 'Meet students with similar interests', 'Learn from professionals', 'Explore career paths', 'Discover research opportunities', 'Strengthen your portfolio and experience']

const events = [
  { type: 'Meeting', date: 'September 12', title: 'Fall General Body Meeting', detail: 'Meet the COSMIC community, hear what we are planning, and share what you want to explore this semester.' },
  { type: 'Workshop', date: 'September 26', title: 'Scientific Python Foundations', detail: 'A beginner-friendly introduction to using Python for data, mathematics, and scientific problem solving.' },
  { type: 'Speaker', date: 'October 10', title: 'Careers in Scientific Computing', detail: 'A conversation with a researcher about technical careers, graduate study, and paths into computational work.' },
  { type: 'Project Session', date: 'October 24', title: 'COSMIC Build Night', detail: 'Bring an idea or join a team for an open collaboration session focused on small, meaningful projects.' },
]

const officers = [
  { role: 'President', initials: 'PR', focus: 'Club direction & community' },
  { role: 'Vice President', initials: 'VP', focus: 'Programs & partnerships' },
  { role: 'Secretary', initials: 'SC', focus: 'Communication & records' },
  { role: 'Treasurer', initials: 'TR', focus: 'Resources & planning' },
]

function App() {
  if (window.location.pathname.match(/^\/design-lab\/cosmic-poster-v2\/?$/)) return <Suspense fallback={<div aria-live="polite">Loading COSMIC poster prototype…</div>}><CosmicPosterV2 /></Suspense>
  if (window.location.pathname.match(/^\/design-lab(?:\/.*)?$/)) return <Suspense fallback={<div aria-live="polite">Loading design prototype…</div>}><DesignLab /></Suspense>
  if (window.location.pathname.match(/^\/?$/)) return <Suspense fallback={<div aria-live="polite">Loading COSMIC poster…</div>}><CosmicPosterV2 /></Suspense>
  if (cosmicSitePages.includes(window.location.pathname.replace(/\/$/, '') || '/')) return <Suspense fallback={<div aria-live="polite">Loading COSMIC…</div>}><CosmicSite /></Suspense>
  if (window.location.pathname.match(/^\/design-2-v2\/?$/)) return <Design2V2 />
  const match = window.location.pathname.match(/^\/design-([123])\/?$/)
  if (match) return <DesignPage variant={Number(match[1]) as 1 | 2 | 3} />

  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <>
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <a href="#hero" className="brand" onClick={close}><img src={logo} alt="COSMIC logo" /><span>COSMIC</span></a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span></span><span></span><span></span></button>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          <a href="#about" onClick={close}>About</a><a href="#events" onClick={close}>Events</a><a href="#leadership" onClick={close}>Leadership</a><a href="#membership" onClick={close}>Membership</a><a className="button small" href="#join" onClick={close}>Join COSMIC</a>
        </div>
      </nav>
    </header>

    <main>
      <section id="hero" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy"><p className="eyebrow">Georgia State University</p><h1>COSMIC</h1><p className="subtitle">Community of Students in Math, Innovation, and Computing</p><h2>Explore. Compute. Build. Connect.</h2><p className="lead">A student community exploring the intersection of mathematics, science, and computing through hands-on experiences, collaboration, and real-world problem solving.</p><div className="actions"><a className="button" href="#join">Join COSMIC</a><a className="button secondary" href="#about">Learn More</a></div>
          </div>
          <div className="hero-logo"><img src={logo} alt="COSMIC — Community of Students in Math, Innovation, and Computing" /></div>
        </div>
      </section>

      <section id="about" className="section"><div className="container split"><div><p className="eyebrow">About the community</p><h2>What is COSMIC?</h2></div><div className="body-copy"><p>COSMIC is an undergraduate student organization focused on scientific computing and the intersection of mathematics, science, computing, and innovation.</p><p>We create opportunities for students to explore these areas beyond the classroom through hands-on experiences, collaboration, projects, and professional connections.</p><blockquote>Taking scientific computing beyond the classroom.</blockquote></div></div></section>

      <section id="purpose" className="section tint"><div className="container narrow"><p className="eyebrow">Why we exist</p><h2>Our Purpose</h2><p className="large-copy">The purpose of COSMIC is to provide undergraduate students with opportunities to explore and apply scientific computing through workshops, guest speakers, hackathons, projects, and collaboration.</p><p>The organization promotes practical skill development, professional connections, curiosity, and real-world experience at the intersection of mathematics, science, and computing.</p></div></section>

      <section id="activities" className="section"><div className="container"><p className="eyebrow">Programs & experiences</p><h2>What We Do</h2><div className="card-grid">{activities.map(([title, text], i) => <article className="card" key={title}><span className="number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section id="building" className="section navy"><div className="container split"><div><p className="eyebrow">A place to grow</p><h2>What We’re Building</h2><p>A welcoming undergraduate community where curiosity becomes practical experience.</p></div><ul className="check-list">{building.map(item => <li key={item}>{item}</li>)}</ul></div></section>

      <section id="ideas" className="section"><div className="container"><p className="eyebrow">Our core ideas</p><h2>Learn. Build. Connect.</h2><div className="three-grid"><article><span>01</span><h3>Learn</h3><p>Develop technical and analytical skills beyond the classroom.</p></article><article><span>02</span><h3>Build</h3><p>Apply mathematics and computing to projects and real-world problems.</p></article><article><span>03</span><h3>Connect</h3><p>Build relationships with students, faculty, researchers, and professionals.</p></article></div></div></section>

      <section id="events" className="section events-section"><div className="container"><div className="section-intro"><div><p className="eyebrow">Meet, learn, and make</p><h2>Events & Meetings</h2></div><p>Regular meetings keep the community connected. Workshops, speakers, and project sessions give members practical ways to explore together.</p></div><div className="event-list">{events.map(event => <article className="event-row" key={event.title}><div className="event-meta"><span>{event.type}</span><strong>{event.date}</strong></div><div><h3>{event.title}</h3><p>{event.detail}</p></div></article>)}</div><p className="demo-note">Sample schedule for this UI demo. Final dates and locations will be announced through COSMIC and PIN.</p></div></section>

      <section id="leadership" className="section tint"><div className="container"><div className="section-intro"><div><p className="eyebrow">Student-led</p><h2>Leadership</h2></div><p>COSMIC’s officers help shape programming, connect members with opportunities, and keep the organization moving forward.</p></div><div className="officer-grid">{officers.map(officer => <article className="officer-card" key={officer.role}><div className="officer-initials" aria-hidden="true">{officer.initials}</div><div><p className="officer-name">Name coming soon</p><h3>{officer.role}</h3><span>{officer.focus}</span></div></article>)}</div></div></section>

      <section id="why" className="section tint"><div className="container"><div className="why-heading"><div><p className="eyebrow">Everyone starts somewhere</p><h2>Why COSMIC?</h2></div><p className="statement">You do not have to be an expert to join.</p></div><div className="why-grid"><div><p>COSMIC is for undergraduate students who are curious about:</p><div className="tags">{interests.map(x => <span key={x}>{x}</span>)}</div><p>Students are welcome whether they are beginners or already have technical experience.</p></div><div className="benefits"><h3>What you’ll gain</h3><ul>{benefits.map(x => <li key={x}>{x}</li>)}</ul></div></div></div></section>

      <section id="membership" className="section membership"><div className="container membership-grid"><div><p className="eyebrow">Membership</p><h2>Curiosity is the starting point.</h2><p className="large-copy">COSMIC welcomes Georgia State undergraduate students who want to learn, build, and connect across mathematics, science, and computing.</p><p>No advanced experience is required. Come to a meeting, try a workshop, or join a project at the level that feels right for you.</p></div><div className="membership-panel"><p className="panel-label">A good fit for students who want to</p><ul><li>Explore scientific computing beyond class</li><li>Practice technical and analytical skills</li><li>Meet collaborators and mentors</li><li>Learn about research and careers</li></ul><a className="text-link" href="#join">How to join <span aria-hidden="true">→</span></a></div></div></section>

      <section id="join" className="section join"><div className="container join-inner"><p className="eyebrow">Your next step</p><h2>Join the COSMIC Community</h2><p>Whether you want to learn a new technical skill, build something with other students, explore scientific computing, or simply meet people with similar interests, COSMIC gives you a place to start.</p><div className="actions"><button className="button" type="button">Join on PIN</button><a className="button secondary light" href="mailto:cosmic@example.edu">Contact COSMIC</a></div><p className="pin-note">The official Panther Involvement Network link will be added here when available.</p></div></section>
    </main>

    <footer><div className="container footer-grid"><div className="footer-brand"><img src={logo} alt="" /><div><strong>COSMIC</strong><p>Community of Students in Math, Innovation, and Computing</p><span>Georgia State University</span></div></div><div className="footer-links"><a href="#" onClick={e => e.preventDefault()}>Instagram</a><a href="#" onClick={e => e.preventDefault()}>LinkedIn</a><a href="mailto:cosmic@example.edu">Email</a><a href="#" onClick={e => e.preventDefault()}>Constitution</a></div></div></footer>
  </>
}

export default App
