import { useEffect, useState } from 'react'
import logo from '../Final Logo Transparent.png'
import { activities, officers, photos } from './DesignPage'
import { fetchCosmicEvents, type CosmicEvent } from './pinEvents'
import './design2v2.css'

type EventItem = CosmicEvent

type EventsStatus = 'upcoming' | 'empty' | 'loading' | 'error'

function calendarDate(date: string, time: string) {
  const [clock = '5', minutes = '00'] = time.match(/\d{1,2}:?\d{0,2}/)?.[0].split(':') ?? []
  const startHour = Number(clock)
  const pm = time.includes('PM') && startHour < 12
  const hour = startHour + (pm ? 12 : 0)
  const compact = date.replaceAll('-', '')
  return `${compact}T${String(hour).padStart(2, '0')}${minutes.padStart(2, '0')}00`
}

function downloadCalendar(event: EventItem) {
  const start = calendarDate(event.date, event.startTime)
  const end = calendarDate(event.date, event.endTime)
  const escape = (value: string) => value.replaceAll('\\', '\\\\').replaceAll(',', '\\,').replaceAll(';', '\\;').replaceAll('\n', '\\n')
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//COSMIC GSU//Events//EN', 'BEGIN:VEVENT', `UID:${event.id}@cosmic.gsu`, `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${escape(event.title)}`, `LOCATION:${escape(event.location ?? 'Location to be announced')}`, `DESCRIPTION:${escape(event.shortDescription)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
  anchor.click()
  URL.revokeObjectURL(url)
}

function eventDateParts(date: string) {
  const value = new Date(`${date}T12:00:00`)
  return {
    month: value.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: value.toLocaleDateString('en-US', { day: '2-digit' }),
    full: value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  }
}

const CalendarIcon = () => <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/></svg>

const NetworkMotif = () => <div className="network-motif" aria-hidden="true"><span className="node n1"/><span className="node n2"/><span className="node n3"/><span className="node n4"/><span className="node n5"/><i className="edge e1"/><i className="edge e2"/><i className="edge e3"/><i className="edge e4"/><b>{'{ }'}</b></div>

const stemAreas = [
  ['math', 'Mathematics', 'Model patterns'],
  ['code', 'Computing', 'Build with code'],
  ['science', 'Science', 'Test ideas'],
  ['network', 'Community', 'Solve together'],
]

const StemIcon = ({ type }: { type: string }) => {
  if (type === 'math') return <svg viewBox="0 0 56 56" aria-hidden="true"><path d="M5 42c8 0 10-25 19-25s8 27 17 27c4 0 7-7 10-15"/><circle cx="24" cy="17" r="2.5"/><path className="soft" d="M6 47h44M10 9v38"/></svg>
  if (type === 'code') return <svg viewBox="0 0 56 56" aria-hidden="true"><rect className="soft" x="5" y="8" width="46" height="39" rx="5"/><path d="m22 21-7 7 7 7m12-14 7 7-7 7m-7 5 5-24"/></svg>
  if (type === 'science') return <svg viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="28" rx="22" ry="8"/><ellipse cx="28" cy="28" rx="22" ry="8" transform="rotate(60 28 28)"/><ellipse cx="28" cy="28" rx="22" ry="8" transform="rotate(120 28 28)"/><circle cx="28" cy="28" r="3"/></svg>
  return <svg viewBox="0 0 56 56" aria-hidden="true"><path d="M12 15 27 27m5 2 13-13M28 32 17 44m16-11 11 10"/><circle cx="10" cy="13" r="5"/><circle cx="29" cy="29" r="6"/><circle cx="46" cy="14" r="5"/><circle cx="15" cy="46" r="5"/><circle cx="46" cy="45" r="5"/></svg>
}

const StemRibbon = () => <section className="stem-ribbon" aria-label="COSMIC fields"><div className="v2-wrap">{stemAreas.map(([type, title, caption]) => <article key={type}><StemIcon type={type}/><div><b>{title}</b><span>{caption}</span></div></article>)}</div></section>

function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const date = eventDateParts(event.date)
  return <article className={`v2-event ${featured ? 'featured' : ''}`}>
    <span className="v2-event-orbit" aria-hidden="true"/>
    <div className="v2-date" aria-hidden="true"><span>{date.month}</span><b>{date.day}</b></div>
    <div className="v2-event-body">
      <time className="v2-type" dateTime={event.date}>{date.full}</time>
      <h3>{event.title}</h3>
      <div className="v2-details">
        <span><b>Time</b>{event.startTime} – {event.endTime}</span>
        <span><b>Location</b>{event.location ?? 'Location to be announced'}</span>
      </div>
      <p>{event.shortDescription}</p>
      <div className="v2-event-organizations" aria-label="Participating organizations">{event.organizations.map(organization => <span key={organization}>{organization}</span>)}</div>
      <div className="v2-event-footer">
        <button className="v2-button calendar" type="button" onClick={() => downloadCalendar(event)}><CalendarIcon/> Add to Calendar</button>
        <span className="v2-rsvp" aria-label={`${event.rsvpCount} students RSVPed`}><b>{event.rsvpCount}</b> students interested</span>
      </div>
    </div>
    <div className={`v2-event-image ${event.image ? '' : 'fallback'}`}>
      {event.image ? <img src={event.image} alt="Students participating in a COSMIC club activity"/> : <div><StemIcon type="network"/><span>Image coming soon</span></div>}
    </div>
  </article>
}

function EventsSection({ status, events }: { status: EventsStatus; events: EventItem[] }) {
  return <section id="events" className="v2-section v2-events">
    <div className="v2-wrap">
      <div className="v2-heading"><div><p className="v2-kicker">See what’s happening next</p><h2>Events & Meetings</h2></div><p>Meet, connect, and get involved. Every gathering is a low-pressure way to learn something, find collaborators, and become part of COSMIC.</p></div>
      {status === 'loading' && <div className="v2-event-state loading" role="status" aria-live="polite"><span/><span/><span/><p>Loading upcoming COSMIC events…</p></div>}
      {status === 'error' && <div className="v2-event-state" role="alert"><b>Events are temporarily unavailable.</b><p>We couldn’t load the schedule. Please check back shortly.</p><a className="v2-button secondary" href="/design-2-v2#events">Try again</a></div>}
      {status === 'empty' && <div className="v2-event-state"><b>No upcoming events yet.</b><p>The next COSMIC meeting is being planned. Follow our PIN page for new dates and announcements.</p><a className="v2-button secondary" href="#join">Stay connected</a></div>}
      {status === 'upcoming' && <><div className="v2-event-grid">{events.map((event, index) => <EventCard event={event} featured={index === 0} key={event.id}/>)}</div><p className="v2-note">Sample schedule for this UI demo. Event details will later be supplied by the Panther Involvement Network.</p></>}
    </div>
  </section>
}

export default function Design2V2() {
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<EventItem[]>([])
  const [eventsStatus, setEventsStatus] = useState<EventsStatus>('loading')
  const close = () => setOpen(false)
  const requestedEventsStatus = new URLSearchParams(window.location.search).get('events')

  useEffect(() => {
    if (requestedEventsStatus === 'empty' || requestedEventsStatus === 'loading' || requestedEventsStatus === 'error') {
      setEvents([])
      setEventsStatus(requestedEventsStatus)
      return
    }

    const controller = new AbortController()
    setEventsStatus('loading')
    fetchCosmicEvents(controller.signal)
      .then(nextEvents => {
        setEvents(nextEvents)
        setEventsStatus(nextEvents.length ? 'upcoming' : 'empty')
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setEvents([])
        setEventsStatus('error')
      })
    return () => controller.abort()
  }, [requestedEventsStatus])
  return <div className="cosmic-v2">
    <aside className="v2-switcher" aria-label="Design comparison"><span>Compare</span><a href="/design-2">Original Design 2</a><a className="active" href="/design-2-v2">Enhanced V2</a></aside>
    <header className="v2-header"><nav className="v2-wrap v2-nav" aria-label="Main navigation"><a className="v2-brand" href="#home" onClick={close}><img src={logo} alt="COSMIC logo"/><span>COSMIC</span></a><button className="v2-menu" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/><span/></button><div className={`v2-links ${open ? 'open' : ''}`}><a href="#about" onClick={close}>About</a><a href="#events" onClick={close}>Events</a><a href="#activities" onClick={close}>Activities</a><a href="#gallery" onClick={close}>Club Moments</a><a href="#leadership" onClick={close}>Leadership</a><a className="v2-button small" href="#join" onClick={close}>Join COSMIC</a></div></nav></header>

    <main>
      <section id="home" className="v2-hero"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="binary-accent" aria-hidden="true">data · code · science · ideas</div><div className="v2-wrap v2-hero-grid"><div className="v2-hero-copy"><p className="v2-kicker"><span/> Georgia State University</p><h1>COSMIC</h1><p className="v2-name">Community of Students in Math, Innovation, and Computing</p><h2>Explore. Compute.<br/>Build. Connect.</h2><p className="v2-lead">A student community exploring the intersection of mathematics, science, and computing through hands-on experiences, collaboration, and real-world problem solving.</p><div className="v2-actions"><a className="v2-button" href="#join">Join COSMIC <span>→</span></a><a className="v2-button secondary" href="#events">See what’s next</a></div><div className="v2-pulse"><i/><span><b>Next up</b> Fall General Body Meeting · Sep 12</span></div></div><div className="v2-hero-visual"><div className="v2-photo"><img src={photos[0][0]} alt={photos[0][1]}/><div><span>Community in motion</span><b>Ideas are better together.</b></div></div><img className="v2-logo-mark" src={logo} alt=""/></div></div></section>
      <StemRibbon/>

      <section id="about" className="v2-section v2-about"><NetworkMotif/><div className="v2-wrap v2-split"><div><p className="v2-kicker">More than a classroom</p><h2>Curiosity becomes something you can build.</h2></div><div><p className="v2-big">COSMIC is an undergraduate student organization focused on scientific computing and the intersection of mathematics, science, computing, and innovation.</p><p>We create opportunities for students to explore these areas beyond the classroom through hands-on experiences, collaboration, projects, and professional connections.</p><blockquote>Taking scientific computing beyond the classroom.</blockquote></div></div></section>

      <EventsSection status={eventsStatus} events={events}/>

      <section id="activities" className="v2-section v2-activities"><div className="circuit-trace" aria-hidden="true"><i/><i/><i/><i/></div><div className="v2-wrap"><div className="v2-heading"><div><p className="v2-kicker">Learn by doing</p><h2>Club Activities</h2></div><p>Choose your way in: learn a tool, hear a new perspective, build with a team, or simply meet people.</p></div><div className="v2-activity-grid">{activities.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><div className="activity-symbol"><StemIcon type={stemAreas[i][0]}/></div><h3>{title}</h3><p>{text}</p><b aria-hidden="true">→</b></article>)}</div></div></section>

      <section id="gallery" className="v2-section v2-gallery"><div className="v2-wrap"><div className="v2-heading"><div><p className="v2-kicker">Recent club highlights</p><h2>COSMIC in Action</h2></div><p>From workshops to build nights, see how members connect, create, solve problems, and get involved.</p></div><div className="v2-gallery-grid">{photos.map(([src, alt], i) => <figure key={src}><img src={src} alt={alt}/><figcaption><span>0{i + 1}</span>{['Build nights', 'Learning together', 'Project teams', 'Campus community'][i]}</figcaption></figure>)}</div></div></section>

      <section id="leadership" className="v2-section v2-leadership"><div className="v2-wrap"><div className="v2-heading"><div><p className="v2-kicker">Student-led</p><h2>Meet the Team</h2></div><p>Officers create the space for members to learn, connect, and try ambitious things together.</p></div><div className="v2-officers">{officers.map(([initials, role, focus], i) => <article key={role}><div className="v2-avatar"><span>{initials}</span><i/></div><span className="v2-role">0{i + 1}</span><p>Name coming soon</p><h3>{role}</h3><small>{focus}</small></article>)}</div></div></section>

      <section className="v2-section v2-membership"><div className="v2-wrap v2-split"><div><p className="v2-kicker">Why join?</p><h2>You don’t have to be an expert. You just have to be curious.</h2><p>COSMIC welcomes Georgia State undergraduate students who want to explore mathematics, science, data, technology, research, and problem solving.</p></div><ul><li><span>01</span>Build practical skills</li><li><span>02</span>Work on meaningful projects</li><li><span>03</span>Meet students with similar interests</li><li><span>04</span>Explore careers and research</li></ul></div></section>

      <section id="join" className="v2-section v2-join"><div className="join-orbit"/><div className="join-network" aria-hidden="true"><span/><span/><span/><span/><i/><i/><i/></div><div className="v2-wrap"><img src={logo} alt=""/><p className="v2-kicker">There’s a place for you here</p><h2>Bring your curiosity.<br/>We’ll build from there.</h2><p>Come to a meeting, try a workshop, or bring an idea you want to explore with others.</p><div className="v2-actions"><button className="v2-button" type="button">Join on PIN <span>↗</span></button><a className="v2-button secondary" href="mailto:cosmic@example.edu">Contact COSMIC</a></div><small>The official Panther Involvement Network link will be added when available.</small></div></section>
    </main>

    <footer className="v2-footer"><div className="v2-wrap"><div className="v2-footer-brand"><img src={logo} alt=""/><div><b>COSMIC</b><span>Community of Students in Math, Innovation, and Computing</span><small>Georgia State University</small></div></div><div className="v2-footer-links"><div><b>Explore</b><a href="#about">About</a><a href="#events">Events</a><a href="#leadership">Leadership</a></div><div><b>Connect</b><a href="#" onClick={e => e.preventDefault()}>Instagram</a><a href="#" onClick={e => e.preventDefault()}>LinkedIn</a><a href="mailto:cosmic@example.edu">Email</a></div><div><b>Organization</b><a href="#" onClick={e => e.preventDefault()}>PIN page</a><a href="#" onClick={e => e.preventDefault()}>Constitution</a></div></div></div></footer>
  </div>
}
