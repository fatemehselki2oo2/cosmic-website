import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Braces,
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
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCosmicEvents, type CosmicEvent } from '@/pinEvents'
import './cosmic-poster-v2.css'

type EventState = 'loading' | 'upcoming' | 'empty' | 'error'

const pageLinks = [
  ['About', '/about'],
  ['Events', '/events'],
  ['Activities', '/activities'],
  ['Club Moments', '/gallery'],
  ['Leadership', '/leadership'],
] as const

const activities = [
  { signal: 'LEARN', label: 'Hands-on workshops', note: 'Python · data · scientific tools', icon: Wrench },
  { signal: 'BUILD', label: 'Hackathons & projects', note: 'Build with a small team', icon: Code2 },
  { signal: 'CONNECT', label: 'Guest speakers', note: 'Research and industry conversations', icon: MessagesSquare },
  { signal: 'TEST', label: 'Scientific computing', note: 'Models · questions · experiments', icon: Sigma },
]

const momentFrames = [
  { code: 'ARCHIVE SLOT / 01', title: 'The workshop table', detail: 'A wide frame for real hands-on sessions.', motif: 'logo', className: 'moment-wide' },
  { code: 'ARCHIVE SLOT / 02', title: 'Project in progress', detail: 'Room for code, notebooks, and the mess between.', motif: 'code', className: 'moment-tall' },
  { code: 'ARCHIVE SLOT / 03', title: 'People behind the work', detail: 'Only real COSMIC moments belong here.', motif: 'people', className: 'moment-square' },
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
    notes: ['Learn practical tools with other students.', 'Build confidence through questions and experiments.', 'Beginners are welcome—curiosity is enough to begin.'],
  },
  '/events': {
    index: 'E–02',
    kicker: 'Events & meetings',
    title: 'The next thing on the wall.',
    lead: 'Workshops, guest conversations, project nights, and meetings give students a practical way to learn and collaborate.',
    notes: ['Upcoming events are sourced from Georgia State PIN.', 'Dates, locations, and RSVP information appear when available.', 'Past and expanded event views are prepared for the full page.'],
  },
  '/activities': {
    index: 'W–03',
    kicker: 'Workshop & project archive',
    title: 'Learn it. Test it. Build something with it.',
    lead: 'COSMIC activities connect scientific computing practice to real questions, collaborative experiments, research exploration, and career conversations.',
    notes: ['Hands-on workshops and data investigations.', 'Hackathons, collaborative projects, and computational modeling.', 'Guest speakers, networking, research, and career exploration.'],
  },
  '/gallery': {
    index: 'M–04',
    kicker: 'Club moments',
    title: 'The wall should show what actually happened.',
    lead: 'This route is prepared for real COSMIC photographs, dates, captions, event labels, and short student notes.',
    notes: ['No stock or generated student photography is used.', 'Landscape and portrait images will keep their natural proportions.', 'The final layout will be curated rather than forced into square tiles.'],
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
        <a className="poster-v2-brand" href="/design-lab/cosmic-poster-v2" aria-label="COSMIC poster prototype home">
          <img src={logo} alt="" />
          <span><strong>COSMIC</strong><small>Math · innovation · computing</small></span>
        </a>
        <NavigationMenu className="poster-v2-desktop-nav" aria-label="Prototype pages">
          <NavigationMenuList>
            {pageLinks.map(([label, href], index) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink render={<a href={href} />}><span>0{index + 1}</span>{label}</NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <a className="poster-v2-compare" href="/design-2-v2">View Design2V2 ↗</a>
        <Sheet>
          <SheetTrigger render={<button className="poster-v2-menu" type="button" aria-label="Open prototype navigation" />}><Menu /></SheetTrigger>
          <SheetContent className="poster-v2-sheet">
            <SheetHeader><SheetTitle>COSMIC / INDEX</SheetTitle><SheetDescription>Pages pinned to the digital club wall.</SheetDescription></SheetHeader>
            <nav aria-label="Mobile prototype pages">
              <a href="/design-lab/cosmic-poster-v2"><span>00</span>Poster home</a>
              {pageLinks.map(([label, href], index) => <a href={href} key={href}><span>0{index + 1}</span>{label}<ArrowRight /></a>)}
              <a href="/design-2-v2"><span>↗</span>Compare Design2V2</a>
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
    <Item className="poster-event-state"><ItemMedia><span>—</span></ItemMedia><ItemContent><ItemTitle>No upcoming event is posted yet.</ItemTitle><ItemDescription>The next workshop, meeting, or project session will be pinned here when it is published on PIN.</ItemDescription></ItemContent></Item>
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
              <p className="poster-v2-lead">A student-run Georgia State community for exploring scientific computing through workshops, projects, experiments, and the people doing the work.</p>
              <div className="poster-v2-hero-actions"><Button nativeButton={false} render={<a href="#join" />}>Start here <ArrowRight /></Button><Button nativeButton={false} render={<a href="#event-board" />} variant="outline">See what’s next</Button></div>
              <p className="poster-v2-beginner"><Sparkles /> No experience required. Bring a question, a laptop, or just your curiosity.</p>
              <p className="poster-v2-hand-note" aria-hidden="true">start anywhere — follow the question ↘</p>
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
              <p>COSMIC is where Georgia State students learn by doing—asking questions, trying technical tools, and working alongside people who are figuring it out too.</p>
              <div><span>ASK MESSY QUESTIONS</span><span>LEARN IN PUBLIC</span><span>MAKE SOMETHING</span></div>
            </div>
            <div className="poster-v2-about-foot"><span>BEGINNER FRIENDLY / STUDENT RUN</span><span>LEARN → TEST → BUILD → SHARE</span></div>
          </article>
          <StickyNote href="/about" tone="cyan" eyebrow="NEW HERE?" detail="A short, beginner-friendly explanation of COSMIC, its purpose, and who it is for." note="01 / READ" className="about-note">What is<br />COSMIC?</StickyNote>

          <article className="poster-v2-event-poster" id="event-board">
            <header><span>EVENT BOARD / LIVE FROM PIN</span><span className="poster-v2-live-mark"><i /> SYNCED WITH GSU</span><Paperclip /></header>
            <h2>Next<br />on the wall.</h2>
            <EventPreview />
            <a className="poster-v2-text-link" href="/events">SEE ALL EVENTS <ArrowRight /></a>
          </article>
          <StickyNote href="/events" tone="pink" eyebrow="NEXT UP →" detail="The events page preserves live PIN loading, error, empty, and upcoming-event states." note="02 / GO" className="events-note">Events &<br />meetings</StickyNote>

          <StickyNote href="/activities" tone="blue" eyebrow="WORKSHOP ARCHIVE" detail="Workshops, hackathons, projects, guest speakers, scientific computing, data, modeling, research, careers, and networking." note="03 / TRY" className="activities-note">Explore what<br />we do.</StickyNote>
          <article className="poster-v2-workshop-flyer">
            <span className="poster-v2-big-number">02</span>
            <p>WHAT ARE WE BUILDING?</p>
            <h2>TOOLS FOR<br /><em>CURIOUS</em><br />PEOPLE.</h2>
            <div className="poster-v2-terminal"><span>INPUT</span><code>question + laptop + team</code><span>OUTPUT</span><code>something worth sharing</code></div>
            <ItemGroup className="poster-activity-list">
              {activities.map(({ signal, label, note, icon: Icon }, index) => <Item key={label} className={`activity-${index + 1}`}><ItemMedia><span>0{index + 1}</span><Icon /></ItemMedia><ItemContent><small>{signal}</small><ItemTitle>{label}</ItemTitle><ItemDescription>{note}</ItemDescription></ItemContent><ItemActions><ChevronRight /></ItemActions></Item>)}
            </ItemGroup>
          </article>

          <article className="poster-v2-moments-board">
            <header><div><p>CLUB MOMENTS / ARCHIVE 04</p><h2>From the club.</h2></div><ImageIcon /></header>
            <Carousel className="poster-v2-moments-carousel" opts={{ align: 'start' }} aria-label="Club moments preview">
              <CarouselContent>
                {momentFrames.map(({ code, title, detail, motif, className }) => (
                  <CarouselItem className={className} key={code}>
                    <figure className="poster-v2-photo-card">
                      <AspectRatio ratio={motif === 'code' ? 3 / 4 : 4 / 3} className="poster-v2-photo">
                        <div className="poster-v2-photo-empty">
                          {motif === 'logo' ? <img src={logo} alt="" /> : motif === 'code' ? <Braces /> : <Users />}
                          <span>{code}<br />AWAITING REAL CLUB MEDIA</span>
                        </div>
                      </AspectRatio>
                      <figcaption><span>{code}</span><strong>{title}</strong><small>{detail}</small></figcaption>
                    </figure>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="poster-v2-carousel-controls"><CarouselPrevious /><span>DRAG / USE ARROWS</span><CarouselNext /></div>
            </Carousel>
            <div className="poster-v2-caption"><Paperclip /><p>No stock photos. No generated students.</p><span>Real club moments will be pinned here with dates and captions.</span></div>
            <a className="poster-v2-text-link" href="/gallery">OPEN THE PHOTO WALL <ArrowRight /></a>
          </article>
          <StickyNote href="/gallery" tone="paper" eyebrow="FROM THE CLUB →" detail="A prepared route for real COSMIC photos in mixed proportions with event labels, dates, and student notes." note="04 / LOOK" className="moments-note">See what<br />we’ve been up to.</StickyNote>

          <StickyNote href="/leadership" tone="cyan" eyebrow="MEET THE STUDENTS" detail="Officer roles are ready; the prototype deliberately does not invent names, photos, majors, biographies, or social links." note="05 / MEET" className="leadership-note">Behind<br />COSMIC →</StickyNote>
          <article className="poster-v2-leadership-poster">
            <div className="poster-v2-vertical-label">STUDENT RUN / 05</div>
            <div className="poster-v2-leadership-intro"><div><p>WHO KEEPS COSMIC MOVING?</p><h2>The officer<br />team.</h2></div><blockquote>Organized by students.<br /><em>Built with everyone in the room.</em></blockquote></div>
            <div className="poster-v2-role-list">{officerRoles.map(([role, focus], index) => <div key={role}><span>0{index + 1}</span><strong>{role}</strong><small>{focus}</small><i aria-hidden="true">→</i></div>)}</div>
            <p className="poster-v2-data-note">Names and profiles appear only when confirmed club information is available.</p>
          </article>
        </section>

        <section className="poster-v2-join" id="join">
          <div className="poster-v2-join-heading"><p className="poster-v2-kicker">YOUR FIRST MEETING / NO PREREQUISITES</p><h2>Curiosity is<br /><em>enough</em> to begin.</h2><p>COSMIC welcomes Georgia State undergraduates who want to explore mathematics, science, data, computing, research, and collaborative problem solving.</p><aside className="poster-v2-first-visit"><span>FIRST VISIT / FIELD NOTE</span><ol><li><b>01</b> Arrive curious.</li><li><b>02</b> Choose your pace.</li><li><b>03</b> Leave with a next step.</li></ol></aside></div>
          <div className="poster-v2-faq-wrap">
            <Accordion defaultValue={['experience']} className="poster-v2-faq">
              <AccordionItem value="experience"><AccordionTrigger>Do I need technical experience?</AccordionTrigger><AccordionContent><p>No. Workshops and meetings are designed to give beginners a practical place to start, while experienced students can take ideas further.</p></AccordionContent></AccordionItem>
              <AccordionItem value="first"><AccordionTrigger>What happens at a first meeting?</AccordionTrigger><AccordionContent><p>Meet members, hear what is coming up, and choose whether to observe, follow a workshop, or join a conversation.</p></AccordionContent></AccordionItem>
              <AccordionItem value="bring"><AccordionTrigger>What should I bring?</AccordionTrigger><AccordionContent><p>A laptop can help at technical sessions, but curiosity and a question are enough for your first visit.</p></AccordionContent></AccordionItem>
              <AccordionItem value="contact"><AccordionTrigger>How do I follow or contact COSMIC?</AccordionTrigger><AccordionContent><p>Use Georgia State PIN for official organization and event information. Confirmed club contact details will be added when available.</p></AccordionContent></AccordionItem>
            </Accordion>
            <div className="poster-v2-join-actions"><Button nativeButton={false} render={<a href="https://pin.gsu.edu/" target="_blank" rel="noreferrer" />}>Find COSMIC on PIN <ExternalLink /></Button><Button nativeButton={false} render={<a href="/events" />} variant="outline">Check the event board</Button></div>
          </div>
        </section>
      </main>
      <footer className="poster-v2-footer"><img src={logo} alt="" /><div><strong>COSMIC</strong><span>Community of Students in Math, Innovation, and Computing</span><small>Georgia State University · Design exploration only</small></div><Separator orientation="vertical" /><a href="/design-2-v2">Compare with Design2V2 ↗</a></footer>
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
