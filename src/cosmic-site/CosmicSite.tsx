import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
  Braces,
  CalendarDays,
  Camera,
  ChevronRight,
  Code2,
  ExternalLink,
  FlaskConical,
  Image as ImageIcon,
  Lightbulb,
  MapPin,
  Menu,
  MessagesSquare,
  Microscope,
  Network,
  Paperclip,
  Sigma,
  Sparkles,
  Terminal,
  Users,
  Wrench,
} from 'lucide-react'
import logo from '../../Final Logo Transparent.png'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchCosmicEvents, fetchCosmicPastEvents, type CosmicEvent } from '@/pinEvents'
import '@/design-lab/cosmic-poster-v2.css'
import './cosmic-site.css'

const PIN_URL = 'https://pin.gsu.edu/organization/cosmic'
const navLinks = [
  ['About', '/about'],
  ['Events', '/events'],
  ['Activities', '/activities'],
  ['Club Moments', '/gallery'],
  ['Leadership', '/leadership'],
] as const

const officerRoles = [
  ['President', 'Club direction & community'],
  ['Vice President', 'Programs & partnerships'],
  ['Secretary', 'Communication & records'],
  ['Treasurer', 'Resources & planning'],
] as const

type Leader = {
  name: string
  role: string
  academicInterest?: string
  description?: string
  photo?: string
  linkedin?: string
  github?: string
}

const leaders: Leader[] = []

function normalizePath(path: string) {
  return path === '/' ? path : path.replace(/\/$/, '')
}

function SiteHeader() {
  const current = normalizePath(window.location.pathname)
  return (
    <header className="poster-v2-header cosmic-header">
      <div className="poster-v2-campus"><div><span>GEORGIA STATE UNIVERSITY</span><span>STUDENT ORGANIZATION / ATLANTA</span></div></div>
      <div className="poster-v2-nav-shell">
        <a className="poster-v2-brand" href="/" aria-label="COSMIC home">
          <img src={logo} alt="" />
          <span><strong>COSMIC</strong><small>Math · innovation · computing</small></span>
        </a>
        <NavigationMenu className="poster-v2-desktop-nav" aria-label="Primary navigation">
          <NavigationMenuList>
            {navLinks.map(([label, href], index) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink render={<a href={href} aria-current={current === href ? 'page' : undefined} />}>
                  <span>0{index + 1}</span>{label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <a className="poster-v2-compare cosmic-pin-link" href={PIN_URL} target="_blank" rel="noreferrer">Join on PIN ↗</a>
        <Sheet>
          <SheetTrigger render={<button className="poster-v2-menu" type="button" aria-label="Open site navigation" />}><Menu /></SheetTrigger>
          <SheetContent className="poster-v2-sheet cosmic-sheet">
            <SheetHeader><SheetTitle>COSMIC / INDEX</SheetTitle><SheetDescription>Pages pinned to the student club wall.</SheetDescription></SheetHeader>
            <nav aria-label="Mobile navigation">
              <a href="/" aria-current={current === '/' ? 'page' : undefined}><span>00</span>Home</a>
              {navLinks.map(([label, href], index) => <a href={href} aria-current={current === href ? 'page' : undefined} key={href}><span>0{index + 1}</span>{label}<ArrowRight /></a>)}
              <a href={PIN_URL} target="_blank" rel="noreferrer"><span>↗</span>Join on PIN</a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="cosmic-footer">
      <div className="cosmic-footer-inner">
        <a className="poster-v2-brand" href="/"><img src={logo} alt="" /><span><strong>COSMIC</strong><small>Georgia State University</small></span></a>
        <nav aria-label="Footer navigation">{navLinks.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
        <a href={PIN_URL} target="_blank" rel="noreferrer">Official COSMIC page on PIN <ExternalLink /></a>
      </div>
    </footer>
  )
}

function StickyLink({ href, tone, eyebrow, children, detail, note, className = '' }: { href: string; tone: 'cyan' | 'pink' | 'blue' | 'paper'; eyebrow: string; children: ReactNode; detail: string; note: string; className?: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger render={<a href={href} className={`poster-v2-sticky sticky-${tone} ${className}`} />}>
        <b className="poster-v2-note-index" aria-hidden="true">{note}</b><i aria-hidden="true" /><small>{eyebrow}</small><strong>{children}</strong><span>OPEN NOTE <ArrowRight /></span>
      </HoverCardTrigger>
      <HoverCardContent className="poster-v2-hover" side="top"><p>PINNED NOTE</p><strong>{detail}</strong><small>Press Enter or follow the arrow to open the page.</small></HoverCardContent>
    </HoverCard>
  )
}

function OrbitDiagram() {
  return <div className="poster-v2-orbit" aria-hidden="true"><div className="orbit-ring ring-two" /><div className="orbit-ring ring-one" /><div className="orbit-core"><Sigma /><span>QUESTION</span></div><i /><i /><i /><small>INPUT → METHOD → OUTPUT</small></div>
}

function PageIntro({ index, kicker, title, lead, children }: { index: string; kicker: string; title: string; lead: string; children?: ReactNode }) {
  return (
    <section className="cosmic-page-intro">
      <div className="cosmic-intro-index">{index}</div>
      <div><p className="poster-v2-kicker">{kicker}</p><h1>{title}</h1><p className="cosmic-page-lead">{lead}</p>{children}</div>
      <div className="cosmic-intro-mark" aria-hidden="true"><span>FIELD NOTE</span><Braces /></div>
    </section>
  )
}

function HomePage() {
  return <>
    <section className="poster-v2-hero cosmic-home-hero">
      <div className="poster-v2-hero-grid">
        <div className="poster-v2-hero-copy">
          <p className="poster-v2-kicker">COMMUNITY OF STUDENTS IN MATH, INNOVATION, AND COMPUTING</p>
          <p className="poster-v2-wordmark">COSMIC <span>GSU</span></p>
          <h1>Where math,<br />science, and<br /><em>code meet.</em></h1>
          <p className="poster-v2-lead">A student-run Georgia State community for exploring scientific computing through workshops, projects, experiments, and the people doing the work.</p>
          <div className="poster-v2-hero-actions"><Button nativeButton={false} render={<a href="#start" />}>Start here <ArrowRight /></Button><Button nativeButton={false} render={<a href="/events" />} variant="outline">See what’s next</Button></div>
          <p className="poster-v2-beginner"><Sparkles /> No experience required. Bring a question, a laptop, or just your curiosity.</p>
          <p className="poster-v2-hand-note" aria-hidden="true">start anywhere — follow the question ↘</p>
        </div>
        <div className="poster-v2-hero-art"><div className="poster-v2-tape tape-top" /><div className="poster-v2-hero-stamp">STUDENT<br />BUILT</div><OrbitDiagram /><div className="poster-v2-spec"><span>FIELD NOTE / 00</span><code>community.learn(together)</code></div><img src={logo} alt="COSMIC logo" /></div>
      </div>
      <div className="poster-v2-discipline-strip"><span><Sigma />MATHEMATICS</span><span><FlaskConical />SCIENCE</span><span><Code2 />COMPUTING</span><span><Users />COMMUNITY</span></div>
    </section>
    <section id="start" className="poster-v2-wall cosmic-home-wall" aria-label="COSMIC student club wall">
      <div className="poster-v2-wall-label"><span>WALL / START HERE</span><span>ATLANTA, GA · STUDENT BUILT</span></div>
      <nav className="poster-v2-wall-index" aria-label="Page index"><span>PINBOARD INDEX</span>{navLinks.map(([label, href], index) => <a href={href} key={href}><b>0{index + 1}</b>{label.toUpperCase()}</a>)}</nav>
      <article className="cosmic-wall-manifesto">
        <span>ABOUT / 01</span><h2>Scientific computing,<br /><em>outside the syllabus.</em></h2><p>We make room to learn a tool, test an idea with other students, build something, and share what happened.</p><a href="/about">Read the field notes <ArrowRight /></a>
      </article>
      <StickyLink href="/about" tone="cyan" eyebrow="WHY COSMIC?" detail="Mission, scientific computing, and who the club is for." note="01" className="cosmic-note-about">Curiosity belongs here.</StickyLink>
      <section className="cosmic-home-event" aria-labelledby="home-event-title"><span>EVENT BOARD / 02</span><h2 id="home-event-title">The next thing<br />on the wall.</h2><p>Workshops, project nights, meetings, and guest conversations—pulled from Georgia State PIN.</p><a href="/events">Open the event board <ArrowRight /></a><CalendarDays aria-hidden="true" /></section>
      <StickyLink href="/events" tone="pink" eyebrow="NEXT UP" detail="A live event board connected to COSMIC on PIN." note="02" className="cosmic-note-events">Find the next session.</StickyLink>
      <section className="cosmic-home-method" aria-labelledby="home-method-title"><div className="cosmic-method-code"><span>METHOD / 03</span><code>learn(tool)</code><code>test(together)</code><code>build(question)</code><code>share(result)</code></div><div><h2 id="home-method-title">The work is the point.</h2><p>From Python workshops to computational models, activities are designed to turn curiosity into practice.</p><a href="/activities">See how COSMIC works <ArrowRight /></a></div></section>
      <StickyLink href="/activities" tone="blue" eyebrow="MAKE SOMETHING" detail="Workshops, hackathons, projects, speakers, research, and careers." note="03" className="cosmic-note-activities">Learn → test → build → share.</StickyLink>
      <section className="cosmic-home-gallery"><div className="cosmic-photo-outline"><ImageIcon /><span>REAL MOMENTS ONLY</span></div><div><span>ARCHIVE / 04</span><h2>A wall for what<br />actually happened.</h2><p>The gallery is ready for real COSMIC photographs—not stock students or made-up events.</p><a href="/gallery">Visit the club archive <ArrowRight /></a></div></section>
      <StickyLink href="/gallery" tone="paper" eyebrow="CLUB MOMENTS" detail="A mixed-format archive prepared for real photos and captions." note="04" className="cosmic-note-gallery">The people. The mess. The work.</StickyLink>
      <section className="cosmic-home-people"><span>PEOPLE / 05</span><h2>Student-led,<br />honestly shown.</h2><p>Officer profiles will be published when the real roster and student-provided details are available.</p><a href="/leadership">Meet the roles <ArrowRight /></a><Users aria-hidden="true" /></section>
      <StickyLink href="/leadership" tone="cyan" eyebrow="WHO KEEPS IT MOVING" detail="Leadership structure with space for real names, interests, and links." note="05" className="cosmic-note-leadership">Meet the team—when the team is confirmed.</StickyLink>
    </section>
    <section className="cosmic-join" id="join"><p className="poster-v2-kicker">YOUR NEXT STEP / OPEN INVITATION</p><h2>Bring a question.<br />Find your people.</h2><p>Georgia State students at any experience level are welcome to start with a meeting, a workshop, or a conversation.</p><Button nativeButton={false} render={<a href={PIN_URL} target="_blank" rel="noreferrer" />}>Join COSMIC on PIN <ExternalLink /></Button></section>
  </>
}

function AboutPage() {
  return <>
    <PageIntro index="A–01" kicker="ABOUT COSMIC / LAB NOTE" title="Scientific computing, outside the syllabus." lead="COSMIC is a Georgia State undergraduate organization where mathematics, science, computing, and innovation meet through practical, collaborative work." />
    <section className="cosmic-about-editorial">
      <aside><span>MARGIN NOTE / 01</span><p>Scientific computing means using computation to investigate questions in mathematics and science.</p><small>It can look like code, data, simulation, visualization, modeling—or a better question.</small></aside>
      <article><p className="cosmic-dropcap">COSMIC creates room for students to explore scientific computing beyond coursework: learning useful tools, trying them with peers, and connecting technical practice to research, projects, and careers.</p><blockquote>Curiosity is enough to begin. Experience is something we build together.</blockquote><p>The club is for Georgia State undergraduates who are curious about mathematics, science, data, technology, research, or problem solving. Beginners are welcome, and students with experience have space to experiment, collaborate, and share what they know.</p></article>
    </section>
    <section className="cosmic-mission-strip"><span>MISSION</span><p>Make scientific computing approachable, practical, social, and connected to real student interests.</p><div aria-hidden="true">question → method → evidence → conversation</div></section>
    <section className="cosmic-lbc" aria-labelledby="lbc-title"><div><p className="poster-v2-kicker">OUR WORKING MODEL</p><h2 id="lbc-title">Learn / Build / Connect</h2></div><div className="cosmic-lbc-path"><article><span>01</span><Wrench /><h3>Learn</h3><p>Develop technical and analytical skills through workshops and shared practice.</p></article><article><span>02</span><Braces /><h3>Build</h3><p>Apply mathematics and computing to projects, investigations, and meaningful problems.</p></article><article><span>03</span><Network /><h3>Connect</h3><p>Meet students, faculty, researchers, and professionals with overlapping questions.</p></article></div></section>
    <section className="cosmic-who"><div><span>WHO THIS IS FOR</span><h2>Not one major.<br />Not one starting point.</h2></div><ul><li>Students trying scientific computing for the first time</li><li>Students looking for collaborators beyond class</li><li>Students exploring research or technical careers</li><li>Students who learn by making, testing, and asking</li></ul><p className="cosmic-hand-note">No gatekeeping. No prerequisite list. ↗</p></section>
  </>
}

type EventLoadState = 'loading' | 'ready' | 'error'

function useEventBoard() {
  const [upcoming, setUpcoming] = useState<CosmicEvent[]>([])
  const [past, setPast] = useState<CosmicEvent[]>([])
  const [state, setState] = useState<EventLoadState>('loading')
  const requested = new URLSearchParams(window.location.search).get('events')
  useEffect(() => {
    if (requested === 'loading') { setState('loading'); return }
    if (requested === 'error') { setState('error'); return }
    if (requested === 'empty') { setUpcoming([]); setPast([]); setState('ready'); return }
    const controller = new AbortController()
    Promise.all([fetchCosmicEvents(controller.signal), fetchCosmicPastEvents(controller.signal)])
      .then(([next, archive]) => { setUpcoming(next); setPast(archive); setState('ready') })
      .catch(error => { if (!(error instanceof DOMException && error.name === 'AbortError')) setState('error') })
    return () => controller.abort()
  }, [requested])
  return { upcoming, past, state }
}

function formatEventDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`)
  return { month: parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), day: parsed.toLocaleDateString('en-US', { day: '2-digit' }), full: parsed.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }
}

function EventRow({ event, featured = false }: { event: CosmicEvent; featured?: boolean }) {
  const date = formatEventDate(event.date)
  return <Item className={`cosmic-event-row${featured ? ' is-featured' : ''}`}>
    <ItemMedia className="cosmic-event-date"><span>{date.month}</span><strong>{date.day}</strong></ItemMedia>
    <ItemContent><p className="cosmic-event-overline">{featured ? 'NEXT ON PIN' : date.full} / {event.organizations.join(' + ')}</p><ItemTitle>{event.title}</ItemTitle><ItemDescription>{event.shortDescription}</ItemDescription><div className="cosmic-event-meta"><span><CalendarDays />{event.startTime}–{event.endTime}</span><span><MapPin />{event.location ?? 'Location to be announced'}</span></div></ItemContent>
    <ItemActions><Button nativeButton={false} render={<a href={`https://pin.gsu.edu/event/${event.id}`} target="_blank" rel="noreferrer" />} variant="outline">RSVP / details <ExternalLink /></Button></ItemActions>
  </Item>
}

function EventEmpty({ past = false }: { past?: boolean }) {
  return <Empty className="cosmic-empty"><EmptyMedia><CalendarDays /></EmptyMedia><EmptyHeader><EmptyTitle>{past ? 'No past events are available from PIN.' : 'No upcoming event is posted yet.'}</EmptyTitle><EmptyDescription>{past ? 'The archive will populate when public COSMIC event records are available.' : 'The next meeting, workshop, or project session will appear here when it is published on PIN.'}</EmptyDescription></EmptyHeader><Button nativeButton={false} render={<a href={PIN_URL} target="_blank" rel="noreferrer" />} variant="outline">Check PIN <ExternalLink /></Button></Empty>
}

function EventsPage() {
  const { upcoming, past, state } = useEventBoard()
  const featured = upcoming[0]
  return <>
    <PageIntro index="E–02" kicker="EVENTS / CAMPUS BOARD" title="The next thing on the wall." lead="Workshops, guest conversations, project nights, and meetings—connected to the official COSMIC listing on Georgia State PIN." />
    <section className="cosmic-events-board">
      <div className="cosmic-board-heading"><span>FEATURED / NEXT</span><p>Live from Georgia State PIN</p></div>
      {state === 'loading' && <div className="cosmic-event-skeleton" aria-live="polite"><Skeleton /><div><Skeleton /><Skeleton /><Skeleton /></div></div>}
      {state === 'error' && <Empty className="cosmic-empty is-error"><EmptyMedia>!</EmptyMedia><EmptyHeader><EmptyTitle>PIN could not be reached.</EmptyTitle><EmptyDescription>The campus event board is temporarily offline. Use the official PIN page for the latest information.</EmptyDescription></EmptyHeader><Button nativeButton={false} render={<a href={PIN_URL} target="_blank" rel="noreferrer" />}>Open PIN <ExternalLink /></Button></Empty>}
      {state === 'ready' && (featured ? <EventRow event={featured} featured /> : <EventEmpty />)}
      {state === 'ready' && <Tabs defaultValue="upcoming" className="cosmic-event-tabs">
        <TabsList variant="line" aria-label="Event archive views"><TabsTrigger value="upcoming">Upcoming <span>{upcoming.length}</span></TabsTrigger><TabsTrigger value="past">Past <span>{past.length}</span></TabsTrigger></TabsList>
        <TabsContent value="upcoming"><ItemGroup>{upcoming.slice(1).map(event => <EventRow event={event} key={event.id} />)}{upcoming.length <= 1 && <EventEmpty />}</ItemGroup></TabsContent>
        <TabsContent value="past"><ItemGroup>{past.map(event => <EventRow event={event} key={event.id} />)}{!past.length && <EventEmpty past />}</ItemGroup></TabsContent>
      </Tabs>}
    </section>
  </>
}

const activitySteps = [
  { number: '01', label: 'LEARN', title: 'Hands-On Workshops', text: 'Practice Python, data analysis, scientific computing, and technical tools with other students.', icon: Wrench },
  { number: '02', label: 'TEST', title: 'Scientific Computing', text: 'Use code, mathematics, and data to investigate a question or test a computational model.', icon: Sigma },
  { number: '03', label: 'BUILD', title: 'Hackathons + Projects', text: 'Collaborate on a focused build, research exploration, or problem worth working through.', icon: Braces },
  { number: '04', label: 'SHARE', title: 'Guest Speakers + Community', text: 'Discuss results, meet researchers and professionals, and learn where technical work can lead.', icon: MessagesSquare },
]

function ActivitiesPage() {
  return <>
    <PageIntro index="W–03" kicker="ACTIVITIES / WORKING METHOD" title="Learn it. Test it. Build something with it." lead="COSMIC activities turn technical curiosity into shared practice—then connect that practice to research, careers, and other students." />
    <section className="cosmic-workflow" aria-labelledby="workflow-title"><div className="cosmic-workflow-heading"><span>EXPERIMENT LOG / 04 STATES</span><h2 id="workflow-title">How COSMIC works</h2><p>One activity can move through all four states. The line is a guide, not a rule.</p></div><ItemGroup className="cosmic-workflow-list">{activitySteps.map(({ number, label, title, text, icon: Icon }) => <Item className="cosmic-workflow-item" key={number}><ItemMedia><span>{number}</span><Icon /></ItemMedia><ItemContent><p>{label}</p><ItemTitle>{title}</ItemTitle><ItemDescription>{text}</ItemDescription></ItemContent></Item>)}</ItemGroup></section>
    <section className="cosmic-activity-field">
      <article className="cosmic-workshop-poster"><div className="cosmic-tape" /><span>WORKSHOP POSTER / SAMPLE FORMAT</span><h2>Data is not<br />the answer.<br /><em>It is evidence.</em></h2><p>A future workshop poster can carry the real topic, date, tools, and student facilitator.</p><div><code>import question</code><code>data = investigate(question)</code><code>share(data.findings)</code></div></article>
      <article className="cosmic-project-note"><Paperclip /><span>PROJECT NOTE</span><h3>From a model to a conversation</h3><p>Computational modeling and data investigations make abstract ideas visible enough to discuss, challenge, and improve.</p><ul><li>Define the question</li><li>Choose the method</li><li>Test assumptions</li><li>Show the result</li></ul></article>
      <article className="cosmic-opportunity-map"><span>BEYOND THE BUILD</span><h3>Where the work can lead</h3><div><p><Microscope />Research Exploration</p><p><Lightbulb />Career Exploration</p><p><Network />Networking</p><p><MessagesSquare />Guest Speakers</p></div><small>These are pathways, not promises—the real opportunities will be posted as the club confirms them.</small></article>
    </section>
  </>
}

const gallerySlots = [
  { label: 'LANDSCAPE / 3:2', title: 'Workshop table', ratio: 3 / 2, className: 'wide' },
  { label: 'PORTRAIT / 4:5', title: 'Student + project', ratio: 4 / 5, className: 'tall' },
  { label: 'LANDSCAPE / 16:9', title: 'Speaker or build night', ratio: 16 / 9, className: 'wide-two' },
] as const

function GalleryPage() {
  return <>
    <PageIntro index="M–04" kicker="CLUB MOMENTS / PHOTO WALL" title="The wall should show what actually happened." lead="This archive is prepared for real COSMIC photographs, dates, captions, event labels, and student-provided context. It will not pretend placeholder people are members." />
    <section className="cosmic-gallery-wall">
      <div className="cosmic-gallery-note"><Paperclip /><span>ARCHIVE STATUS</span><h2>Waiting for real moments.</h2><p>No stock photography, generated students, or invented captions are used here.</p></div>
      {gallerySlots.map(slot => <article className={`cosmic-gallery-slot ${slot.className}`} key={slot.label}><AspectRatio ratio={slot.ratio}><div><Camera /><span>{slot.label}</span><strong>{slot.title}</strong><small>Photo · event label · date · caption</small></div></AspectRatio></article>)}
      <Empty className="cosmic-gallery-empty"><EmptyMedia><ImageIcon /></EmptyMedia><EmptyHeader><EmptyTitle>The photo wall is structured, not fabricated.</EmptyTitle><EmptyDescription>When real files arrive, landscape and portrait images will keep their proportions and carry clear captions, dates, and event labels.</EmptyDescription></EmptyHeader></Empty>
    </section>
  </>
}

function LeaderProfile({ leader }: { leader: Leader }) {
  return <article className="cosmic-leader-profile"><Avatar className="cosmic-avatar" size="lg">{leader.photo && <AvatarImage src={leader.photo} alt="" />}<AvatarFallback>{leader.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2)}</AvatarFallback></Avatar><div><span>{leader.role}</span><h2>{leader.name}</h2>{leader.academicInterest && <p>{leader.academicInterest}</p>}{leader.description && <p>{leader.description}</p>}<div>{leader.linkedin && <a href={leader.linkedin} aria-label={`${leader.name} on LinkedIn`}><ExternalLink /></a>}{leader.github && <a href={leader.github} aria-label={`${leader.name} on GitHub`}><ExternalLink /></a>}</div></div></article>
}

function LeadershipPage() {
  return <>
    <PageIntro index="L–05" kicker="LEADERSHIP / STUDENT LED" title="The people who keep COSMIC moving." lead="This page is ready for real officer photos, names, academic interests, short introductions, and optional professional links—once the roster is confirmed." />
    <section className="cosmic-leadership-board">
      {leaders.length ? <div className="cosmic-leader-list">{leaders.map(leader => <LeaderProfile leader={leader} key={`${leader.role}-${leader.name}`} />)}</div> : <Empty className="cosmic-empty cosmic-leadership-empty"><EmptyMedia><Users /></EmptyMedia><EmptyHeader><EmptyTitle>The officer roster has not been provided yet.</EmptyTitle><EmptyDescription>Names, photos, majors, biographies, and links will not be invented. Confirmed student-provided information can be added here.</EmptyDescription></EmptyHeader></Empty>}
      <div className="cosmic-role-ledger"><div><span>ROLE LEDGER</span><p>What each office helps hold together</p></div>{officerRoles.map(([role, focus], index) => <article key={role}><b>0{index + 1}</b><h2>{role}</h2><p>{focus}</p></article>)}</div>
    </section>
  </>
}

function CosmicSite() {
  const path = normalizePath(window.location.pathname)
  const page = path === '/about' ? <AboutPage /> : path === '/events' ? <EventsPage /> : path === '/activities' ? <ActivitiesPage /> : path === '/gallery' ? <GalleryPage /> : path === '/leadership' ? <LeadershipPage /> : <HomePage />
  return <div className="poster-v2-site cosmic-site"><SiteHeader /><main>{page}</main><SiteFooter /></div>
}

export default CosmicSite
