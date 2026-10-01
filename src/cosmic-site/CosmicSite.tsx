import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
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
  Network,
  Paperclip,
  Sigma,
  Sparkles,
  Terminal,
  Users,
  Wrench,
} from 'lucide-react'
import logo from '../../Final Logo Transparent.png'
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
const COSMIC_EMAIL = 'cosmicgastate@gmail.com'
const navLinks = [
  ['About', '/about'],
  ['Events', '/events'],
  ['Activities', '/activities'],
  ['Club Moments', '/gallery'],
  ['Leadership', '/leadership'],
] as const

const leadershipRoster = [
  { role: 'Primary Contact', names: ['Hardik Saini'] },
  { role: 'Second Contact', names: ['Vihaan Dhaka'] },
  { role: 'On-Campus Advisor', names: ['Neranjan (Suranga) Edirisinghe'] },
  { role: 'PIN Admins', names: ['Cassie Wilcox', 'Hardik Saini', 'Amari Blackman', 'Fatemeh Selki'] },
] as const

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
        <a className="poster-v2-brand" href="/"><img src={logo} alt="" /><span><strong>COSMIC</strong><small>Georgia State University · Atlanta Campus</small></span></a>
        <nav aria-label="Footer navigation">{navLinks.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
        <div className="cosmic-footer-contact">
          <a href={`mailto:${COSMIC_EMAIL}`}>{COSMIC_EMAIL}</a>
          <a href={PIN_URL} target="_blank" rel="noreferrer">Official COSMIC page on PIN <ExternalLink /></a>
        </div>
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
          <p className="poster-v2-lead">A Georgia State undergraduate community exploring scientific computing through hands-on workshops, hackathons, collaborative projects, and guest speakers.</p>
          <div className="poster-v2-hero-actions"><Button nativeButton={false} render={<a href="#start" />}>Start here <ArrowRight /></Button><Button nativeButton={false} render={<a href="/events" />} variant="outline">See what’s next</Button></div>
          <p className="poster-v2-beginner"><Sparkles /> Skill development · professional connections · real-world experience.</p>
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
        <span>ABOUT / 01</span><h2>Scientific computing,<br /><em>outside the syllabus.</em></h2><p>COSMIC makes scientific computing accessible and engaging through opportunities beyond the classroom.</p><a href="/about">Read the field notes <ArrowRight /></a>
      </article>
      <StickyLink href="/about" tone="cyan" eyebrow="WHY COSMIC?" detail="Mission, scientific computing, and who the club is for." note="01" className="cosmic-note-about">Curiosity belongs here.</StickyLink>
      <section className="cosmic-home-event" aria-labelledby="home-event-title"><span>EVENT BOARD / 02</span><h2 id="home-event-title">The next thing<br />on the wall.</h2><p>Public COSMIC events are pulled from the official Georgia State PIN listing.</p><a href="/events">Open the event board <ArrowRight /></a><CalendarDays aria-hidden="true" /></section>
      <StickyLink href="/events" tone="pink" eyebrow="NEXT UP" detail="A live event board connected to COSMIC on PIN." note="02" className="cosmic-note-events">Find the next session.</StickyLink>
      <section className="cosmic-home-method" aria-labelledby="home-method-title"><div className="cosmic-method-code"><span>ACTIVITY AREAS / 03</span><code>coding</code><code>data analysis</code><code>computational modeling</code><code>scientific computing</code></div><div><h2 id="home-method-title">Skills meet real-world experience.</h2><p>COSMIC offers workshops, guest speakers, hackathons, collaborative projects, and community connections.</p><a href="/activities">Explore COSMIC activities <ArrowRight /></a></div></section>
      <StickyLink href="/activities" tone="blue" eyebrow="COSMIC ACTIVITIES" detail="Hands-on workshops, scientific computing, hackathons, collaborative projects, guest speakers, and community connections." note="03" className="cosmic-note-activities">Ways students can engage.</StickyLink>
      <section className="cosmic-home-gallery"><div className="cosmic-photo-outline"><ImageIcon /><span>REAL MOMENTS ONLY</span></div><div><span>CLUB MOMENTS / 04</span><h2>Club moments<br />coming soon.</h2><p>No real COSMIC gallery media has been added yet.</p><a href="/gallery">Open Club Moments <ArrowRight /></a></div></section>
      <StickyLink href="/gallery" tone="paper" eyebrow="CLUB MOMENTS" detail="A mixed-format archive prepared for real photos and captions." note="04" className="cosmic-note-gallery">The people. The mess. The work.</StickyLink>
      <section className="cosmic-home-people"><span>PEOPLE / 05</span><h2>Student-led,<br />honestly shown.</h2><p>Officer profiles will be published when the real roster and student-provided details are available.</p><a href="/leadership">Meet the roles <ArrowRight /></a><Users aria-hidden="true" /></section>
      <StickyLink href="/leadership" tone="cyan" eyebrow="WHO KEEPS IT MOVING" detail="Leadership structure with space for real names, interests, and links." note="05" className="cosmic-note-leadership">Meet the team—when the team is confirmed.</StickyLink>
    </section>
    <section className="cosmic-join" id="join"><p className="poster-v2-kicker">UNDERGRADUATE COMMUNITY / ATLANTA CAMPUS</p><h2>Connect with<br />COSMIC.</h2><p>COSMIC is an undergraduate organization at Georgia State University. No membership dues are required.</p><Button nativeButton={false} render={<a href={PIN_URL} target="_blank" rel="noreferrer" />}>Join COSMIC on PIN <ExternalLink /></Button></section>
  </>
}

function AboutPage() {
  return <>
    <PageIntro index="A–01" kicker="ABOUT COSMIC / LAB NOTE" title="Scientific computing, outside the syllabus." lead="COSMIC is a community for undergraduates interested in the intersection of math, science, and computing." />
    <section className="cosmic-about-editorial">
      <aside><span>WHO COSMIC IS FOR</span><p>Undergraduates interested in math, science, and computing.</p><small>COSMIC connects students with peers, faculty, and professionals.</small></aside>
      <article>
        <p className="cosmic-dropcap">Our mission is to make scientific computing accessible and engaging by offering opportunities that go beyond the classroom.</p>
        <p>Through hands-on workshops, students develop practical skills in coding, data analysis, and computational modeling.</p>
        <blockquote>The purpose of COSMIC is to provide undergraduate students with opportunities to explore and apply scientific computing through workshops, guest speakers, and hackathons.</blockquote>
        <p>Guest speakers from industry and research share their career paths and current work, giving students a window into real-world applications of computing. Collaborative projects challenge members to solve meaningful problems and showcase their creativity.</p>
        <p>By connecting students with peers, faculty, and professionals, COSMIC prepares the next generation of innovators to apply computing in impactful ways.</p>
      </article>
    </section>
    <section className="cosmic-mission-strip"><span>PURPOSE</span><p>The organization fosters skill development, professional connections, and real-world experience at the intersection of math, science, and computing.</p><div aria-hidden="true">workshops → speakers → hackathons → experience</div></section>
    <section className="cosmic-lbc" aria-labelledby="lbc-title"><div><p className="poster-v2-kicker">WHAT STUDENTS DO</p><h2 id="lbc-title">Learn / Build / Connect</h2></div><div className="cosmic-lbc-path"><article><span>01</span><Wrench /><h3>Learn</h3><p>Develop practical skills in coding, data analysis, and computational modeling through hands-on workshops.</p></article><article><span>02</span><Braces /><h3>Build</h3><p>Collaborate on projects and hackathons that solve meaningful problems and showcase creativity.</p></article><article><span>03</span><Network /><h3>Connect</h3><p>Meet peers, faculty, professionals, and guest speakers from industry and research.</p></article></div></section>
    <section className="cosmic-who"><div><span>WHY SCIENTIFIC COMPUTING MATTERS</span><h2>Beyond the classroom.<br />Into the real world.</h2></div><ul><li>Practical coding and data analysis skills</li><li>Computational modeling experience</li><li>Real-world applications of computing</li><li>Professional and academic connections</li></ul><p className="cosmic-hand-note">Accessible. Engaging. Impactful. ↗</p></section>
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
  return <Empty className="cosmic-empty"><EmptyMedia><CalendarDays /></EmptyMedia><EmptyHeader><EmptyTitle>{past ? 'No past events are available from PIN.' : 'No upcoming event is posted yet.'}</EmptyTitle><EmptyDescription>{past ? 'The archive will populate when public COSMIC event records are available.' : 'The next public COSMIC event will appear here when it is published on PIN.'}</EmptyDescription></EmptyHeader><Button nativeButton={false} render={<a href={PIN_URL} target="_blank" rel="noreferrer" />} variant="outline">Check PIN <ExternalLink /></Button></Empty>
}

function EventsPage() {
  const { upcoming, past, state } = useEventBoard()
  const featured = upcoming[0]
  return <>
    <PageIntro index="E–02" kicker="EVENTS / CAMPUS BOARD" title="The next thing on the wall." lead="Public COSMIC events are connected to the official organization listing on Georgia State PIN." />
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
  { number: '01', label: 'WORKSHOPS', title: 'Hands-On Workshops', text: 'Practical opportunities to build skills in coding, data analysis, scientific computing, and computational modeling.', icon: Wrench },
  { number: '02', label: 'SCIENTIFIC COMPUTING', title: 'Scientific Computing', text: 'Exploring how computing can be used to investigate questions across math and science.', icon: Sigma },
  { number: '03', label: 'HACKATHONS', title: 'Hackathons', text: 'Opportunities for students to apply what they know, experiment, and build.', icon: Braces },
  { number: '04', label: 'PROJECTS', title: 'Collaborative Projects', text: 'Students work together on meaningful problems and creative computing ideas.', icon: Code2 },
  { number: '05', label: 'GUEST SPEAKERS', title: 'Guest Speakers', text: 'Conversations with people from research and industry about their work, career paths, and applications of computing.', icon: MessagesSquare },
  { number: '06', label: 'COMMUNITY', title: 'Community + Connections', text: 'COSMIC connects students with peers, faculty, and professionals.', icon: Users },
]

function ActivitiesPage() {
  return <>
    <PageIntro index="W–03" kicker="ACTIVITIES / VERIFIED AREAS" title="Scientific computing, skills, and connections." lead="COSMIC provides opportunities for skill development, professional connections, and real-world experience at the intersection of math, science, and computing." />
    <section className="cosmic-workflow" aria-labelledby="workflow-title"><div className="cosmic-workflow-heading"><span>ACTIVITY AREAS / 06</span><h2 id="workflow-title">Ways students can engage</h2><p>These broad activity areas reflect the verified purpose of COSMIC.</p></div><ItemGroup className="cosmic-workflow-list">{activitySteps.map(({ number, label, title, text, icon: Icon }) => <Item className="cosmic-workflow-item" key={number}><ItemMedia><span>{number}</span><Icon /></ItemMedia><ItemContent><p>{label}</p><ItemTitle>{title}</ItemTitle><ItemDescription>{text}</ItemDescription></ItemContent></Item>)}</ItemGroup></section>
    <section className="cosmic-activity-field">
      <article className="cosmic-workshop-poster"><div className="cosmic-tape" /><span>HANDS-ON WORKSHOPS</span><h2>Coding.<br />Data.<br /><em>Modeling.</em></h2><p>Practical opportunities to build skills in coding, data analysis, scientific computing, and computational modeling.</p><div><code>CODING</code><code>DATA ANALYSIS</code><code>COMPUTATIONAL MODELING</code></div></article>
      <article className="cosmic-project-note"><Paperclip /><span>COLLABORATIVE PROJECTS</span><h3>Meaningful problems. Creative computing ideas.</h3><p>COSMIC hosts hackathons and collaborative projects where students can apply what they know and work together.</p><ul><li>Hackathons</li><li>Collaborative projects</li><li>Scientific computing</li><li>Real-world experience</li></ul></article>
      <article className="cosmic-opportunity-map"><span>COMMUNITY + CONNECTIONS</span><h3>Peers, faculty, and professionals.</h3><div><p><Users />Peers</p><p><BookOpen />Faculty</p><p><Network />Professionals</p><p><MessagesSquare />Guest Speakers</p></div><small>COSMIC builds professional connections at the intersection of math, science, and computing.</small></article>
    </section>
  </>
}

function GalleryPage() {
  return <>
    <PageIntro index="M–04" kicker="CLUB MOMENTS / PHOTO WALL" title="Club moments coming soon." lead="No real COSMIC gallery media has been provided yet. This page will publish only real club photographs with factual event details." />
    <section className="cosmic-gallery-wall">
      <div className="cosmic-gallery-note"><Paperclip /><span>GALLERY STATUS</span><h2>No real photos yet.</h2><p>No stock photography, generated students, or invented captions are used here.</p></div>
      <Empty className="cosmic-gallery-empty"><EmptyMedia><ImageIcon /></EmptyMedia><EmptyHeader><EmptyTitle>Club moments coming soon.</EmptyTitle><EmptyDescription>When real COSMIC media is available, each item can include the image, activity or event name, date, and a short factual caption.</EmptyDescription></EmptyHeader></Empty>
    </section>
  </>
}

function LeadershipPage() {
  return <>
    <PageIntro index="L–05" kicker="LEADERSHIP / VERIFIED ROSTER" title="The people who keep COSMIC moving." lead="Verified COSMIC contacts and PIN administrators, listed without invented profiles or titles." />
    <section className="cosmic-leadership-board">
      <div className="cosmic-role-ledger"><div><span>VERIFIED ROSTER</span><p>Contacts and PIN administrators</p></div>{leadershipRoster.map(({ role, names }, index) => <article key={role}><b>0{index + 1}</b><h2>{role}</h2><ul>{names.map(name => <li key={name}>{name}</li>)}</ul></article>)}</div>
    </section>
  </>
}

function NotFoundPage() {
  return <PageIntro
    index="404"
    kicker="PAGE NOT FOUND / LOST FIELD NOTE"
    title="This note is not on the wall."
    lead="The page you requested does not exist. Return to the COSMIC homepage or use the navigation to continue exploring the club."
  >
    <div className="poster-v2-route-actions">
      <Button nativeButton={false} render={<a href="/" />}>Return to COSMIC home <ArrowRight /></Button>
    </div>
  </PageIntro>
}

function CosmicSite() {
  const path = normalizePath(window.location.pathname)
  const page = path === '/' ? <HomePage /> : path === '/about' ? <AboutPage /> : path === '/events' ? <EventsPage /> : path === '/activities' ? <ActivitiesPage /> : path === '/gallery' ? <GalleryPage /> : path === '/leadership' ? <LeadershipPage /> : <NotFoundPage />
  return <div className="poster-v2-site cosmic-site"><SiteHeader /><main>{page}</main><SiteFooter /></div>
}

export default CosmicSite
