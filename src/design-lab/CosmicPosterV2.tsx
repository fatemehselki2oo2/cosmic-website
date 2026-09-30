import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Code2,
  ExternalLink,
  FlaskConical,
  Image as ImageIcon,
  MapPin,
  Menu,
  MessagesSquare,
  Paperclip,
  Sigma,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import logo from '../../Final Logo Transparent.png'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCosmicEvents, type CosmicEvent } from '@/pinEvents'
import './cosmic-poster-v2.css'

type EventState = 'loading' | 'upcoming' | 'empty' | 'error'

const PIN_URL = 'https://pin.gsu.edu/organization/cosmic'
const COSMIC_EMAIL = 'cosmicgastate@gmail.com'
const ADVISOR_EMAIL = 'neranjan@gsu.edu'

const pageLinks = [
  ['About', '/about'],
  ['Events', '/events'],
  ['Activities', '/activities'],
  ['Club Moments', '/gallery'],
  ['Leadership', '/leadership'],
] as const

const activities = [
  { signal: 'WORKSHOPS', label: 'Hands-on workshops', note: 'Coding · data analysis · modeling', icon: Wrench },
  { signal: 'BUILD', label: 'Hackathons & projects', note: 'Meaningful problems · creative ideas', icon: Code2 },
  { signal: 'CONNECT', label: 'Guest speakers', note: 'Research · industry · career paths', icon: MessagesSquare },
  { signal: 'COMMUNITY', label: 'Community connections', note: 'Peers · faculty · professionals', icon: Users },
]

const officerRoles = [
  ['President', 'Club direction & community'],
  ['Vice President', 'Programs & partnerships'],
  ['Secretary', 'Communication & records'],
  ['Treasurer', 'Resources & planning'],
]

const routeCopy: Record<string, { index: string; kicker: string; title: string; lead: string; notes: string[] }> = {
  '/about': {
    index: 'A–01',
    kicker: 'About COSMIC',
    title: 'Scientific computing, outside the syllabus.',
    lead: 'COSMIC is a Georgia State undergraduate organization for students exploring the overlap between mathematics, science, computing, and innovation.',
    notes: ['A community for undergraduates interested in math, science, and computing.', 'Hands-on workshops support skill development beyond the classroom.', 'COSMIC connects students with peers, faculty, and professionals.'],
  },
  '/events': {
    index: 'E–02',
    kicker: 'Events & meetings',
    title: 'The next thing on the wall.',
    lead: 'Public COSMIC events are connected to the official organization listing on Georgia State PIN.',
    notes: ['Upcoming events are sourced from Georgia State PIN.', 'Dates, locations, and RSVP information appear when available.', 'Past public events remain available in the event archive.'],
  },
  '/activities': {
    index: 'W–03',
    kicker: 'Verified activity areas',
    title: 'Scientific computing, skills, and connections.',
    lead: 'COSMIC provides opportunities for skill development, professional connections, and real-world experience at the intersection of math, science, and computing.',
    notes: ['Hands-on workshops in coding, data analysis, scientific computing, and computational modeling.', 'Hackathons and collaborative projects.', 'Guest speakers and connections with peers, faculty, and professionals.'],
  },
  '/gallery': {
    index: 'M–04',
    kicker: 'Club moments',
    title: 'Club moments coming soon.',
    lead: 'No real COSMIC gallery media has been provided yet. This page will publish only real club photographs with factual event details.',
    notes: ['No stock or generated student photography is used.', 'Each future item needs a verified activity or event name, date, and factual caption.', 'Real landscape and portrait images will keep their natural proportions.'],
  },
  '/leadership': {
    index: 'L–05',
    kicker: 'Student-led',
    title: 'The people who keep COSMIC moving.',
    lead: 'Officer roles can be shown now; names, photos, academic interests, biographies, and links will only appear after real club information is provided.',
    notes: officerRoles.map(([role, focus]) => `${role} — ${focus}`),
  },
}

function formatEventDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`)
  return {
    month: parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: parsed.toLocaleDateString('en-US', { day: '2-digit' }),
    full: parsed.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  }
}

function usePosterEvent() {
  const [event, setEvent] = useState<CosmicEvent | null>(null)
  const [state, setState] = useState<EventState>('loading')
  const requestedState = new URLSearchParams(window.location.search).get('events')

  useEffect(() => {
    if (requestedState === 'loading' || requestedState === 'empty' || requestedState === 'error') {
      setEvent(null)
      setState(requestedState)
      return
    }
    const controller = new AbortController()
    fetchCosmicEvents(controller.signal)
      .then(events => {
        setEvent(events[0] ?? null)
        setState(events.length ? 'upcoming' : 'empty')
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setEvent(null)
        setState('error')
      })
    return () => controller.abort()
  }, [requestedState])

  return { event, state }
}

function PosterHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`poster-v2-header${compact ? ' is-compact' : ''}`}>
      <div className="poster-v2-campus"><div><span>GEORGIA STATE UNIVERSITY</span><span>STUDENT ORGANIZATION / ATLANTA</span></div></div>
      <div className="poster-v2-nav-shell">
        <a className="poster-v2-brand" href="/" aria-label="COSMIC home">
          <img src={logo} alt="" />
          <span><strong>COSMIC</strong><small>Math · innovation · computing</small></span>
        </a>
        <NavigationMenu className="poster-v2-desktop-nav" aria-label="Primary navigation">
          <NavigationMenuList>
            {pageLinks.map(([label, href], index) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink render={<a href={href} />}><span>0{index + 1}</span>{label}</NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <span className="poster-v2-compare-spacer" aria-hidden="true" />
        <Sheet>
          <SheetTrigger render={<button className="poster-v2-menu" type="button" aria-label="Open site navigation" />}><Menu /></SheetTrigger>
          <SheetContent className="poster-v2-sheet">
            <SheetHeader><SheetTitle>COSMIC / INDEX</SheetTitle><SheetDescription>Pages pinned to the digital club wall.</SheetDescription></SheetHeader>
            <nav aria-label="Mobile navigation">
              <a href="/"><span>00</span>Home</a>
              {pageLinks.map(([label, href], index) => <a href={href} key={href}><span>0{index + 1}</span>{label}<ArrowRight /></a>)}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function StickyNote({ href, tone, eyebrow, children, detail, note, className = '' }: { href: string; tone: 'cyan' | 'pink' | 'blue' | 'paper'; eyebrow: string; children: ReactNode; detail: string; note: string; className?: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger render={<a href={href} className={`poster-v2-sticky sticky-${tone} ${className}`} />}>
        <b className="poster-v2-note-index" aria-hidden="true">{note}</b>
        <i aria-hidden="true" />
        <small>{eyebrow}</small>
        <strong>{children}</strong>
        <span>OPEN NOTE <ArrowRight /></span>
      </HoverCardTrigger>
      <HoverCardContent className="poster-v2-hover" side="top">
        <p>PINNED NOTE</p><strong>{detail}</strong><small>Press Enter or follow the arrow to open the page.</small>
      </HoverCardContent>
    </HoverCard>
  )
}

function EventPreview({ expanded = false }: { expanded?: boolean }) {
  const { event, state } = usePosterEvent()
  if (state === 'loading') return (
    <div className="poster-event-loading" aria-live="polite"><Skeleton /><div><Skeleton /><Skeleton /><Skeleton /></div></div>
  )
  if (state === 'error') return (
    <Item className="poster-event-state"><ItemMedia><span>!</span></ItemMedia><ItemContent><ItemTitle>PIN could not be reached.</ItemTitle><ItemDescription>The event wall is temporarily offline. Check Georgia State PIN for the latest details.</ItemDescription></ItemContent></Item>
  )
  if (state === 'empty' || !event) return (
    <Item className="poster-event-state"><ItemMedia><span>—</span></ItemMedia><ItemContent><ItemTitle>No upcoming event is posted yet.</ItemTitle><ItemDescription>The next public COSMIC event will be pinned here when it is published on PIN.</ItemDescription></ItemContent></Item>
  )
  const date = formatEventDate(event.date)
  return (
    <ItemGroup className="poster-event-list">
      <Item className="poster-event-item">
        <ItemMedia className="poster-event-date"><span>{date.month}</span><strong>{date.day}</strong></ItemMedia>
        <ItemContent>
          <p className="poster-event-label">NEXT ON PIN / {date.full}</p>
          <ItemTitle>{event.title}</ItemTitle>
          <ItemDescription>{event.shortDescription}</ItemDescription>
          <div className="poster-event-details"><span><CalendarDays />{event.startTime}–{event.endTime}</span><span><MapPin />{event.location ?? 'Location to be announced'}</span></div>
        </ItemContent>
        {expanded && <ItemActions><Button nativeButton={false} render={<a href="https://pin.gsu.edu/" target="_blank" rel="noreferrer" />} variant="outline">Open PIN <ExternalLink /></Button></ItemActions>}
      </Item>
    </ItemGroup>
  )
}

function OrbitDiagram() {
  return <div className="poster-v2-orbit" aria-hidden="true"><div className="orbit-ring ring-two" /><div className="orbit-ring ring-one" /><div className="orbit-core"><Sigma /><span>QUESTION</span></div><i /><i /><i /><small>INPUT → METHOD → OUTPUT</small></div>
}

function PosterHome() {
  return (
    <div className="poster-v2-site">
      <PosterHeader />
      <main>
        <section className="poster-v2-hero">
          <div className="poster-v2-hero-grid">
            <div className="poster-v2-hero-copy">
              <p className="poster-v2-kicker">COMMUNITY OF STUDENTS IN MATH, INNOVATION, AND COMPUTING</p>
              <p className="poster-v2-wordmark">COSMIC <span>GSU</span></p>
              <h1>Where math,<br />science, and<br /><em>code meet.</em></h1>
              <p className="poster-v2-lead">A Georgia State undergraduate community exploring scientific computing through hands-on workshops, hackathons, collaborative projects, and guest speakers.</p>
              <div className="poster-v2-hero-actions"><Button nativeButton={false} render={<a href="#join" />}>Start here <ArrowRight /></Button><Button nativeButton={false} render={<a href="#event-board" />} variant="outline">See what’s next</Button></div>
              <p className="poster-v2-beginner"><Sparkles /> Skill development · professional connections · real-world experience.</p>
              <p className="poster-v2-hand-note" aria-hidden="true">math + science + computing — beyond the classroom ↘</p>
            </div>
            <div className="poster-v2-hero-art"><div className="poster-v2-tape tape-top" /><div className="poster-v2-hero-stamp">STUDENT<br />BUILT</div><OrbitDiagram /><div className="poster-v2-spec"><span>FIELD NOTE / 00</span><code>community.learn(together)</code></div><img src={logo} alt="COSMIC logo" /></div>
          </div>
          <div className="poster-v2-discipline-strip"><span><Sigma />MATHEMATICS</span><span><FlaskConical />SCIENCE</span><span><Code2 />COMPUTING</span><span><Users />COMMUNITY</span></div>
        </section>

        <section className="poster-v2-wall" aria-label="COSMIC digital student club wall">
          <div className="poster-v2-wall-label"><span>WALL / FALL STUDIES</span><span>ATLANTA, GA · STUDENT BUILT</span></div>
          <nav className="poster-v2-wall-index" aria-label="Poster wall index">
            <span>PINBOARD INDEX</span>
            <a href="/about"><b>01</b> WHY</a>
            <a href="/events"><b>02</b> NEXT</a>
            <a href="/activities"><b>03</b> MAKE</a>
            <a href="/gallery"><b>04</b> MOMENTS</a>
            <a href="/leadership"><b>05</b> PEOPLE</a>
          </nav>

          <article className="poster-v2-about-poster">
            <div className="poster-v2-registration" aria-hidden="true">+</div>
            <p>ABOUT THE CLUB / NOTE 01</p>
            <h2>Scientific<br />computing,<br /><em>outside</em> the<br />syllabus.</h2>
            <div className="poster-v2-about-copy">
              <p>COSMIC makes scientific computing accessible and engaging through opportunities that go beyond the classroom.</p>
              <div><span>HANDS-ON WORKSHOPS</span><span>GUEST SPEAKERS</span><span>COLLABORATIVE PROJECTS</span></div>
            </div>
            <div className="poster-v2-about-foot"><span>UNDERGRADUATE COMMUNITY / ATLANTA CAMPUS</span><span>SKILLS · CONNECTIONS · EXPERIENCE</span></div>
          </article>
          <StickyNote href="/about" tone="cyan" eyebrow="NEW HERE?" detail="A short, beginner-friendly explanation of COSMIC, its purpose, and who it is for." note="01 / READ" className="about-note">What is<br />COSMIC?</StickyNote>

          <article className="poster-v2-event-poster" id="event-board">
            <header><span>EVENT BOARD / LIVE FROM PIN</span><span className="poster-v2-live-mark"><i /> SYNCED WITH GSU</span><Paperclip /></header>
            <h2>Next<br />on the wall.</h2>
            <EventPreview />
            <a className="poster-v2-text-link" href="/events">SEE ALL EVENTS <ArrowRight /></a>
          </article>
          <StickyNote href="/events" tone="pink" eyebrow="NEXT UP →" detail="The events page preserves live PIN loading, error, empty, and upcoming-event states." note="02 / GO" className="events-note">Events &<br />meetings</StickyNote>

          <StickyNote href="/activities" tone="blue" eyebrow="COSMIC ACTIVITIES" detail="Hands-on workshops, scientific computing, hackathons, collaborative projects, guest speakers, and community connections." note="03 / VIEW" className="activities-note">Explore what<br />we do.</StickyNote>
          <article className="poster-v2-workshop-flyer">
            <span className="poster-v2-big-number">02</span>
            <p>WAYS STUDENTS CAN ENGAGE</p>
            <h2>SKILLS.<br /><em>IDEAS.</em><br />CONNECTIONS.</h2>
            <div className="poster-v2-terminal"><span>FOCUS</span><code>scientific computing</code><span>FORMAT</span><code>workshops + speakers + projects</code></div>
            <ItemGroup className="poster-activity-list">
              {activities.map(({ signal, label, note, icon: Icon }, index) => <Item key={label} className={`activity-${index + 1}`}><ItemMedia><span>0{index + 1}</span><Icon /></ItemMedia><ItemContent><small>{signal}</small><ItemTitle>{label}</ItemTitle><ItemDescription>{note}</ItemDescription></ItemContent><ItemActions><ChevronRight /></ItemActions></Item>)}
            </ItemGroup>
          </article>

          <article className="poster-v2-moments-board">
            <header><div><p>CLUB MOMENTS / 04</p><h2>Club moments<br />coming soon.</h2></div><ImageIcon /></header>
            <div className="poster-v2-moments-empty" role="status">
              <ImageIcon />
              <p>No real COSMIC gallery media has been added yet.</p>
              <span>Real photographs will appear here only with a verified activity or event name, date, and factual caption.</span>
            </div>
            <div className="poster-v2-caption"><Paperclip /><p>No stock photos. No generated students.</p><span>Only real COSMIC photographs with factual event details will appear here.</span></div>
            <a className="poster-v2-text-link" href="/gallery">OPEN CLUB MOMENTS <ArrowRight /></a>
          </article>
          <StickyNote href="/gallery" tone="paper" eyebrow="CLUB MOMENTS →" detail="Real COSMIC photographs will appear here only when factual event details are available." note="04 / LOOK" className="moments-note">Gallery<br />coming soon.</StickyNote>

          <StickyNote href="/leadership" tone="cyan" eyebrow="MEET THE STUDENTS" detail="Officer roles are ready; the prototype deliberately does not invent names, photos, majors, biographies, or social links." note="05 / MEET" className="leadership-note">Behind<br />COSMIC →</StickyNote>
          <article className="poster-v2-leadership-poster">
            <div className="poster-v2-vertical-label">STUDENT RUN / 05</div>
            <div className="poster-v2-leadership-intro"><div><p>WHO KEEPS COSMIC MOVING?</p><h2>The officer<br />team.</h2></div><blockquote>Organized by students.<br /><em>Built with everyone in the room.</em></blockquote></div>
            <div className="poster-v2-role-list">{officerRoles.map(([role, focus], index) => <div key={role}><span>0{index + 1}</span><strong>{role}</strong><small>{focus}</small><i aria-hidden="true">→</i></div>)}</div>
            <p className="poster-v2-data-note">Names and profiles appear only when confirmed club information is available.</p>
          </article>
        </section>

        <section className="poster-v2-join" id="join">
          <div className="poster-v2-join-heading"><p className="poster-v2-kicker">UNDERGRADUATE COMMUNITY / ATLANTA CAMPUS</p><h2>Connect with<br /><em>COSMIC.</em></h2><p>COSMIC is a community for undergraduates interested in the intersection of math, science, and computing.</p><aside className="poster-v2-first-visit"><span>VERIFIED ORGANIZATION INFO</span><ol><li><b>01</b> Atlanta Campus</li><li><b>02</b> No dues required</li><li><b>03</b> Official updates on PIN</li></ol></aside></div>
          <div className="poster-v2-faq-wrap">
            <Accordion defaultValue={['experience']} className="poster-v2-faq">
              <AccordionItem value="experience"><AccordionTrigger>Who is COSMIC for?</AccordionTrigger><AccordionContent><p>COSMIC is an undergraduate student organization focused on the intersection of math, science, and computing.</p></AccordionContent></AccordionItem>
              <AccordionItem value="first"><AccordionTrigger>Where is COSMIC based?</AccordionTrigger><AccordionContent><p>COSMIC is based at Georgia State University’s Atlanta Campus.</p></AccordionContent></AccordionItem>
              <AccordionItem value="bring"><AccordionTrigger>Are membership dues required?</AccordionTrigger><AccordionContent><p>No dues are required.</p></AccordionContent></AccordionItem>
              <AccordionItem value="contact"><AccordionTrigger>How do I follow or contact COSMIC?</AccordionTrigger><AccordionContent><dl className="poster-v2-contact-list"><div><dt>Email</dt><dd><a href={`mailto:${COSMIC_EMAIL}`}>{COSMIC_EMAIL}</a></dd></div><div><dt>On-Campus Advisor</dt><dd>Suranga Edirisinghe<br /><a href={`mailto:${ADVISOR_EMAIL}`}>{ADVISOR_EMAIL}</a></dd></div><div><dt>Campus</dt><dd>Atlanta Campus</dd></div><div><dt>Membership dues</dt><dd>No dues required</dd></div></dl></AccordionContent></AccordionItem>
            </Accordion>
            <div className="poster-v2-join-actions"><Button nativeButton={false} render={<a href={PIN_URL} target="_blank" rel="noreferrer" />}>Find COSMIC on PIN <ExternalLink /></Button><Button nativeButton={false} render={<a href={`mailto:${COSMIC_EMAIL}`} />} variant="outline">Email COSMIC</Button></div>
          </div>
        </section>
      </main>
      <footer className="poster-v2-footer"><img src={logo} alt="" /><div><strong>COSMIC</strong><span>Community of Students in Math, Innovation, and Computing</span><small>Georgia State University · Atlanta Campus</small></div><div className="poster-v2-footer-contact"><a href={`mailto:${COSMIC_EMAIL}`}>{COSMIC_EMAIL}</a><a href={PIN_URL} target="_blank" rel="noreferrer">Official COSMIC page on PIN</a></div></footer>
    </div>
  )
}

function PosterSubpage({ path }: { path: string }) {
  const page = routeCopy[path]
  const isEvents = path === '/events'
  return (
    <div className="poster-v2-site poster-v2-subpage">
      <PosterHeader compact />
      <main>
        <section className="poster-v2-route-hero">
          <div className="poster-v2-route-index">{page.index}</div>
          <div><p className="poster-v2-kicker">{page.kicker}</p><h1>{page.title}</h1><p>{page.lead}</p></div>
          <aside><span>PROTOTYPE ROUTE</span><p>This page is prepared for the full COSMIC poster-wall system. The homepage remains unchanged.</p></aside>
        </section>
        <section className="poster-v2-route-sheet">
          <div className="poster-v2-route-notes">{page.notes.map((note, index) => <div key={note}><span>0{index + 1}</span><p>{note}</p></div>)}</div>
          {isEvents && <div className="poster-v2-route-event"><EventPreview expanded /></div>}
          <div className="poster-v2-route-actions"><Button nativeButton={false} render={<a href="/design-lab/cosmic-poster-v2" />}><ArrowRight className="arrow-back" /> Back to the poster wall</Button><a href="/design-2-v2">Open Design2V2 for comparison ↗</a></div>
        </section>
      </main>
    </div>
  )
}

export default function CosmicPosterV2() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (routeCopy[path]) return <PosterSubpage path={path} />
  return <PosterHome />
}
