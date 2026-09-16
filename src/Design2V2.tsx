import { Fragment, useEffect, useState } from 'react'
import {
  ArrowRight,
  CalendarPlus,
  Clock3,
  Code2,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  MapPin,
  Menu,
  MessagesSquare,
  Network,
  Sigma,
  Users,
  Wrench,
} from 'lucide-react'
import logo from '../Final Logo Transparent.png'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCosmicEvents, type CosmicEvent } from './pinEvents'
import './design2v2.css'

type EventsStatus = 'upcoming' | 'empty' | 'loading' | 'error'

const navItems = [
  ['About', '#about'],
  ['Events', '#events'],
  ['Programs', '#programs'],
  ['Leadership', '#leadership'],
]

const disciplines = [
  { label: 'Mathematics', note: 'Model patterns', icon: Sigma },
  { label: 'Computing', note: 'Build with code', icon: Code2 },
  { label: 'Science', note: 'Test ideas', icon: FlaskConical },
  { label: 'Community', note: 'Learn together', icon: Users },
]

const programs = [
  {
    stage: 'Learn a tool',
    title: 'Hands-on workshops',
    text: 'Practice programming, data analysis, scientific computing, and modeling with other students in the room.',
    example: 'Start with a Python workshop: clean a small dataset, plot what you find, and leave with a working notebook.',
    icon: Wrench,
  },
  {
    stage: 'Try it with other students',
    title: 'Community & connections',
    text: 'Meet students across majors and connect with people who share your curiosity about scientific computing.',
    example: 'Pair up for a short data investigation, compare approaches, and ask the questions that would be harder to ask alone.',
    icon: Network,
  },
  {
    stage: 'Build or investigate something',
    title: 'Projects & hackathons',
    text: 'Join a small team, try an idea, and turn mathematics, data, or code into something you can show.',
    example: 'Take a computational modeling exercise further during a project night or shape it into a weekend hackathon build.',
    icon: Lightbulb,
  },
  {
    stage: 'Share the result',
    title: 'Guest conversations',
    text: 'Hear how faculty, researchers, and industry professionals use technical skills in their day-to-day work.',
    example: 'Walk peers through a result, trade feedback, and hear how a guest researcher would approach the same problem.',
    icon: MessagesSquare,
  },
]

const officerRoles = [
  ['President', 'Club direction & community'],
  ['Vice President', 'Programs & partnerships'],
  ['Secretary', 'Communication & records'],
  ['Treasurer', 'Resources & planning'],
]

function calendarDate(date: string, time: string) {
  const [clock = '5', minutes = '00'] = time.match(/\d{1,2}:?\d{0,2}/)?.[0].split(':') ?? []
  const startHour = Number(clock)
  const pm = time.includes('PM') && startHour < 12
  const amAtNoon = time.includes('AM') && startHour === 12
  const hour = amAtNoon ? 0 : startHour + (pm ? 12 : 0)
  return `${date.replaceAll('-', '')}T${String(hour).padStart(2, '0')}${minutes.padStart(2, '0')}00`
}

function downloadCalendar(event: CosmicEvent) {
  const escape = (value: string) => value.replaceAll('\\', '\\\\').replaceAll(',', '\\,').replaceAll(';', '\\;').replaceAll('\n', '\\n')
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//COSMIC GSU//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@cosmic.gsu`,
    `DTSTART:${calendarDate(event.date, event.startTime)}`,
    `DTEND:${calendarDate(event.date, event.endTime)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.location ?? 'Location to be announced')}`,
    `DESCRIPTION:${escape(event.shortDescription)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
  anchor.click()
  URL.revokeObjectURL(url)
}

function eventDate(date: string) {
  const value = new Date(`${date}T12:00:00`)
  return {
    month: value.toLocaleDateString('en-US', { month: 'short' }),
    day: value.toLocaleDateString('en-US', { day: '2-digit' }),
    full: value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  }
}

function EventCard({ event }: { event: CosmicEvent }) {
  const date = eventDate(event.date)
  return (
    <Card className="club-event-card">
      {event.image && <img className="club-event-image" src={event.image} alt="" />}
      <div className="club-event-layout">
        <div className="club-date-block" aria-hidden="true"><span>{date.month}</span><strong>{date.day}</strong></div>
        <div className="club-event-copy">
          <CardHeader>
            <Badge variant="outline" className="club-event-badge">Upcoming event</Badge>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.shortDescription}</CardDescription>
          </CardHeader>
          <CardContent className="club-event-details">
            <span><Clock3 /> <time dateTime={event.date}>{date.full}, {event.startTime}–{event.endTime}</time></span>
            <span><MapPin /> {event.location ?? 'Location to be announced'}</span>
          </CardContent>
          <CardFooter className="club-event-footer">
            <Button variant="outline" size="lg" onClick={() => downloadCalendar(event)}>
              <CalendarPlus data-icon="inline-start" /> Add to calendar
            </Button>
            {event.organizations.length > 0 && <span className="club-hosted-by">Hosted by {event.organizations.join(' · ')}</span>}
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

function EventsSection({ status, events }: { status: EventsStatus; events: CosmicEvent[] }) {
  return (
    <section id="events" className="club-section club-events-section">
      <div className="club-shell">
        <div className="club-section-heading">
          <div><p className="club-kicker">On the calendar</p><h2>What’s happening at COSMIC</h2></div>
          <p>Meetings, workshops, project nights, and guest conversations—open to curious GSU undergraduates.</p>
        </div>
        {status === 'loading' && (
          <Card className="club-event-skeleton" aria-label="Loading upcoming events">
            <Skeleton className="club-skeleton-date" />
            <div><Skeleton className="club-skeleton-short" /><Skeleton className="club-skeleton-title" /><Skeleton className="club-skeleton-copy" /><Skeleton className="club-skeleton-copy small" /></div>
          </Card>
        )}
        {status === 'error' && (
          <Card className="club-event-state">
            <CardHeader><CardTitle>We couldn’t load the schedule.</CardTitle><CardDescription>Check Panther Involvement Network for the latest COSMIC meetings and announcements.</CardDescription></CardHeader>
            <CardFooter><Button nativeButton={false} render={<a href="https://pin.gsu.edu/" target="_blank" rel="noreferrer" />} size="lg">Open PIN <ExternalLink data-icon="inline-end" /></Button></CardFooter>
          </Card>
        )}
        {status === 'empty' && (
          <Card className="club-event-state">
            <CardHeader><CardTitle>The next meetup is being planned.</CardTitle><CardDescription>Visit PIN for new workshop, build-night, and guest-speaker announcements.</CardDescription></CardHeader>
            <CardFooter><Button nativeButton={false} render={<a href="https://pin.gsu.edu/" target="_blank" rel="noreferrer" />} size="lg">Check PIN <ExternalLink data-icon="inline-end" /></Button></CardFooter>
          </Card>
        )}
        {status === 'upcoming' && <div className="club-event-list">{events.slice(0, 3).map(event => <EventCard event={event} key={event.id} />)}</div>}
        {status === 'upcoming' && <p className="club-source-note">Event details are provided by the Panther Involvement Network.</p>}
      </div>
    </section>
  )
}

function SiteHeader() {
  return (
    <>
      <div className="club-campus-bar"><div className="club-shell"><span>Georgia State University</span><span>Undergraduate student organization</span></div></div>
      <header className="club-header">
        <nav className="club-shell club-nav" aria-label="Main navigation">
          <a className="club-brand" href="#home" aria-label="COSMIC home">
            <img src={logo} alt="" />
            <span><strong>COSMIC</strong><small>Math · Innovation · Computing</small></span>
          </a>
          <div className="club-desktop-nav">
            {navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
            <Button nativeButton={false} render={<a href="#join" />} size="lg" className="club-nav-cta">Join the club</Button>
          </div>
          <div className="club-mobile-nav">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon-lg" aria-label="Open navigation" />}><Menu /></SheetTrigger>
              <SheetContent className="club-mobile-panel">
                <SheetHeader>
                  <SheetTitle>COSMIC</SheetTitle>
                  <SheetDescription>Community of Students in Math, Innovation, and Computing</SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile navigation">{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}<a href="#join">Join COSMIC</a></nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  )
}

export default function Design2V2() {
  const [events, setEvents] = useState<CosmicEvent[]>([])
  const [eventsStatus, setEventsStatus] = useState<EventsStatus>('loading')
  const requestedStatus = new URLSearchParams(window.location.search).get('events')

  useEffect(() => {
    if (requestedStatus === 'empty' || requestedStatus === 'loading' || requestedStatus === 'error') {
      setEvents([])
      setEventsStatus(requestedStatus)
      return
    }
    const controller = new AbortController()
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
  }, [requestedStatus])

  return (
    <div className="club-site">
      <SiteHeader />
      <main>
        <section id="home" className="club-hero">
          <div className="club-shell club-hero-grid">
            <div className="club-hero-copy">
              <Badge variant="outline" className="club-hero-badge">Student-run at Georgia State</Badge>
              <p className="club-wordmark">COSMIC</p>
              <h1>Where math, science, and code meet.</h1>
              <p className="club-hero-lead">A student community for exploring scientific computing through workshops, projects, and the people doing the work.</p>
              <div className="club-actions">
                <Button nativeButton={false} render={<a href="#join" />} size="lg" className="club-primary-action">Join COSMIC <ArrowRight data-icon="inline-end" /></Button>
                <Button nativeButton={false} render={<a href="#events" />} variant="outline" size="lg">See upcoming events</Button>
              </div>
              <p className="club-beginner-note"><strong>No experience required.</strong> Bring a question, a laptop, or just your curiosity.</p>
            </div>
            <Card className="club-start-card">
              <div className="club-start-accent"><span>01</span><span>Start here</span></div>
              <CardHeader><CardTitle>New to scientific computing?</CardTitle><CardDescription>You are exactly who this club is for.</CardDescription></CardHeader>
              <CardContent>
                <ol>
                  <li><span>1</span><div><strong>Come to a meeting</strong><small>Meet members and see what is coming up.</small></div></li>
                  <li><span>2</span><div><strong>Try a workshop</strong><small>Follow along at your own pace.</small></div></li>
                  <li><span>3</span><div><strong>Build with someone</strong><small>Join a project when you are ready.</small></div></li>
                </ol>
              </CardContent>
              <CardFooter><Button nativeButton={false} render={<a href="#about" />} variant="secondary" size="lg">How COSMIC works <ArrowRight data-icon="inline-end" /></Button></CardFooter>
            </Card>
          </div>
          <div className="club-discipline-strip">
            <div className="club-shell">{disciplines.map(({ label, note, icon: Icon }) => <div key={label}><Icon /><span><strong>{label}</strong><small>{note}</small></span></div>)}</div>
          </div>
        </section>

        <section id="about" className="club-section club-about">
          <div className="club-shell">
            <div className="club-about-grid">
              <div><p className="club-kicker">About the club</p><h2>Scientific computing, outside the syllabus.</h2></div>
              <div className="club-about-copy">
                <p className="club-large-copy">COSMIC is an undergraduate organization focused on the overlap between mathematics, science, computing, and innovation.</p>
                <p>Members learn by doing: writing code, analyzing data, building computational models, working through hackathons, and talking with researchers and professionals about how these skills show up in real work.</p>
                <div className="club-principles"><span>Learn the tools.</span><span>Test an idea.</span><span>Share what you find.</span></div>
              </div>
            </div>
            <Separator className="club-story-divider" />
            <div id="programs" className="club-journey">
              <div className="club-section-heading club-journey-heading"><div><p className="club-kicker">What we do</p><h2>How COSMIC works</h2></div><p>Choose the doorway that fits. You can learn a tool, hear a new perspective, join a team, or simply meet people.</p></div>
              <ItemGroup className="club-journey-list">
                {programs.map(({ stage, title, text, example, icon: Icon }, index) => (
                  <Fragment key={title}>
                    <Item className={`club-journey-item step-${index + 1}${index % 2 ? ' is-reversed' : ''}`} role="listitem">
                      <ItemMedia className="club-journey-marker">
                        <span>0{index + 1}</span>
                        <Icon aria-hidden="true" />
                      </ItemMedia>
                      <ItemContent className="club-journey-content">
                        <p className="club-journey-stage">{stage}</p>
                        <ItemTitle className="club-journey-title">{title}</ItemTitle>
                        <ItemDescription className="club-journey-description">{text}</ItemDescription>
                      </ItemContent>
                      <div className="club-journey-example">
                        <span>One way this looks</span>
                        <p>{example}</p>
                      </div>
                    </Item>
                    {index < programs.length - 1 && <ItemSeparator className="club-journey-separator" />}
                  </Fragment>
                ))}
              </ItemGroup>
            </div>
          </div>
        </section>

        <EventsSection status={eventsStatus} events={events} />

        <section className="club-section club-membership">
          <div className="club-shell club-membership-grid">
            <div><p className="club-kicker">Membership</p><h2>Curiosity is enough to begin.</h2><p>COSMIC welcomes Georgia State undergraduates interested in mathematics, science, data, technology, research, and problem solving.</p></div>
            <Card className="club-membership-card">
              <CardHeader><CardTitle>What you can expect</CardTitle></CardHeader>
              <CardContent><ul><li>Beginner-friendly technical practice</li><li>Small projects with other students</li><li>Conversations with faculty and professionals</li><li>A community that learns in public</li></ul></CardContent>
            </Card>
          </div>
        </section>

        <section id="leadership" className="club-section club-leadership">
          <div className="club-shell">
            <div className="club-section-heading"><div><p className="club-kicker">Student-led</p><h2>The officer team</h2></div><p>Officers organize COSMIC’s meetings, workshops, projects, partnerships, and member communication.</p></div>
            <div className="club-officer-grid">{officerRoles.map(([role, focus], index) => <Card className="club-officer-card" key={role}><CardHeader><span className="club-officer-number">0{index + 1}</span><CardTitle>{role}</CardTitle><CardDescription>{focus}</CardDescription></CardHeader></Card>)}</div>
            <p className="club-roster-note">Officer names and contact details will be added when the club roster is confirmed.</p>
          </div>
        </section>

        <section id="join" className="club-section club-join">
          <div className="club-shell club-join-grid">
            <div><Badge variant="outline">Open to GSU undergraduates</Badge><h2>Come see what we’re working on.</h2><p>Start with a meeting or workshop. You do not need a project idea, a technical background, or the right vocabulary.</p></div>
            <div className="club-join-actions"><Button nativeButton={false} render={<a href="https://pin.gsu.edu/" target="_blank" rel="noreferrer" />} size="lg">Find COSMIC on PIN <ExternalLink data-icon="inline-end" /></Button><Button nativeButton={false} render={<a href="#events" />} variant="outline" size="lg"><CalendarPlus data-icon="inline-start" /> View club events</Button></div>
          </div>
        </section>
      </main>
      <footer className="club-footer">
        <div className="club-shell">
          <div className="club-footer-brand"><img src={logo} alt="" /><div><strong>COSMIC</strong><span>Community of Students in Math, Innovation, and Computing</span><small>Georgia State University</small></div></div>
          <Separator orientation="vertical" className="club-footer-separator" />
          <nav aria-label="Footer navigation">{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}<a href="#join">Membership</a></nav>
        </div>
      </footer>
    </div>
  )
}
