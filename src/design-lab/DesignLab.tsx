import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Braces,
  ChevronDown,
  Lightbulb,
  Network,
  Sigma,
  Users,
  Wrench,
} from 'lucide-react'
import logo from '../../Final Logo Transparent.png'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Progress } from '@/components/ui/progress'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import './design-lab.css'

type StageKey = 'learn' | 'try' | 'build' | 'share'

const stages = [
  {
    key: 'learn' as StageKey,
    step: '01',
    action: 'Learn a tool',
    category: 'Hands-on workshops',
    description: 'Practice programming, data analysis, scientific computing, and modeling with other students in the room.',
    example: 'Start with a Python workshop: clean a small dataset, plot what you find, and leave with a working notebook.',
    command: 'python workshop_01.py',
    output: 'notebook saved · 3 patterns found',
    icon: Wrench,
  },
  {
    key: 'try' as StageKey,
    step: '02',
    action: 'Try it with other students',
    category: 'Community & connections',
    description: 'Meet students across majors and connect with people who share your curiosity about scientific computing.',
    example: 'Pair up for a short data investigation, compare approaches, and ask the questions that are harder to ask alone.',
    command: 'compare(team_a, team_b)',
    output: '2 approaches · 1 shared question',
    icon: Network,
  },
  {
    key: 'build' as StageKey,
    step: '03',
    action: 'Build or investigate something',
    category: 'Projects & hackathons',
    description: 'Join a small team, try an idea, and turn mathematics, data, or code into something you can show.',
    example: 'Take a computational modeling exercise further during a project night or shape it into a weekend hackathon build.',
    command: 'model.step(iterations=100)',
    output: 'hypothesis tested · prototype running',
    icon: Lightbulb,
  },
  {
    key: 'share' as StageKey,
    step: '04',
    action: 'Share the result',
    category: 'Guest conversations',
    description: 'Hear how faculty, researchers, and industry professionals use technical skills in their day-to-day work.',
    example: 'Walk peers through a result, trade feedback, and hear how a guest researcher would approach the same problem.',
    command: 'present(result, audience="COSMIC")',
    output: 'feedback received · next question opened',
    icon: Users,
  },
]

const prototypeLinks = [
  ['01', 'Method Map', '/design-lab/method-map'],
  ['02', 'Lab Notebook', '/design-lab/notebook'],
  ['03', 'Field Console', '/design-lab/console'],
  ['04', 'Poster Wall', '/design-lab/poster-wall'],
  ['05', 'Split Story', '/design-lab/split-story'],
]

function LabShell({ code, title, children }: { code: string; title: string; children: React.ReactNode }) {
  return (
    <div className={`design-lab lab-${code}`}>
      <header className="lab-header">
        <a className="lab-brand" href="/design-lab"><img src={logo} alt="" /><span><strong>COSMIC</strong><small>Design exploration lab</small></span></a>
        <nav aria-label="Design prototypes">
          {prototypeLinks.map(([number, label, href]) => <a className={href.endsWith(code) ? 'active' : ''} href={href} key={href}><span>{number}</span>{label}</a>)}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="lab-footer"><span>COSMIC · Georgia State University</span><span>{title} · design prototype</span></footer>
    </div>
  )
}

function AboutIntro({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`lab-about-intro${inverse ? ' inverse' : ''}`}>
      <div><p className="lab-kicker">About the club</p><h1>Scientific computing,<br />outside the syllabus.</h1></div>
      <div className="lab-about-copy">
        <p className="lead">COSMIC is an undergraduate organization focused on the overlap between mathematics, science, computing, and innovation.</p>
        <p>Members learn by doing: writing code, analyzing data, building computational models, working through hackathons, and talking with researchers and professionals about how these skills show up in real work.</p>
        <div className="lab-principles"><span>Learn the tools.</span><span>Test an idea.</span><span>Share what you find.</span></div>
      </div>
    </div>
  )
}

function MethodMap() {
  return (
    <LabShell code="method-map" title="Experimental Method Map">
      <section className="method-section">
        <AboutIntro />
        <Separator className="lab-rule" />
        <Tabs defaultValue="learn" className="method-tabs">
          <div className="method-heading">
            <div><p className="lab-kicker">A shared experimental method</p><h2>Follow the question.</h2></div>
            <HoverCard>
              <HoverCardTrigger render={<button className="method-note-trigger" type="button" aria-label="About the experimental map" />}>MAP KEY ↗</HoverCardTrigger>
              <HoverCardContent className="method-hover-note" side="left">
                <strong>Not a required order.</strong>
                <p>COSMIC projects loop between learning, testing, building, and sharing. Select any node to enter the process.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="method-canvas">
            <svg className="method-path" viewBox="0 0 1000 520" aria-hidden="true">
              <path d="M155 128 C310 12 492 72 505 196 C520 330 737 345 850 205 C765 420 430 472 214 350 C78 273 51 194 155 128Z" />
              <path className="dash" d="M155 128 L505 196 L850 205 L214 350 L155 128" />
            </svg>
            <TabsList className="method-nodes" aria-label="COSMIC workflow stages">
              {stages.map(stage => {
                const Icon = stage.icon
                return <TabsTrigger className={`method-node node-${stage.key}`} value={stage.key} key={stage.key}><span>{stage.step}</span><Icon /><strong>{stage.action}</strong></TabsTrigger>
              })}
            </TabsList>
            <div className="method-center"><Sigma /><span>question</span><small>observe · test · revise</small></div>
            <div className="method-readout">
              {stages.map((stage, index) => (
                <TabsContent value={stage.key} key={stage.key}>
                  <div className="method-readout-top"><span>ACTIVE NODE / {stage.step}</span><Progress value={(index + 1) * 25} /></div>
                  <h3>{stage.category}</h3>
                  <p>{stage.description}</p>
                  <code>{stage.command}</code>
                  <small>{stage.example}</small>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </section>
    </LabShell>
  )
}

function LabNotebook() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    if (!api) return
    const sync = () => setCurrent(api.selectedScrollSnap() + 1)
    sync()
    api.on('select', sync)
    return () => { api.off('select', sync) }
  }, [api])

  return (
    <LabShell code="notebook" title="COSMIC Lab Notebook">
      <section className="notebook-section">
        <div className="notebook-title-row"><div><p className="lab-kicker">COSMIC field notes · volume 01</p><h1>Scientific computing,<br />outside the syllabus.</h1></div><p>Four pages from the way COSMIC learns together—messy questions, working code, shared experiments, and results worth discussing.</p></div>
        <Carousel setApi={setApi} opts={{ loop: false }} className="notebook-carousel">
          <div className="notebook-controls"><span>PAGE {String(current).padStart(2, '0')} / 04</span><Progress value={current * 25} /><div><CarouselPrevious /><CarouselNext /></div></div>
          <CarouselContent>
            {stages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <CarouselItem key={stage.key}>
                  <article className={`notebook-page notebook-page-${stage.key}`}>
                    <div className="notebook-binding" aria-hidden="true">{Array.from({ length: 9 }).map((_, hole) => <i key={hole} />)}</div>
                    <div className="notebook-margin"><span>{stage.step}</span><Icon /><small>ENTRY<br />{index + 17}.09</small></div>
                    <div className="notebook-copy"><p className="notebook-action">{stage.action}</p><h2>{stage.category}</h2><p>{stage.description}</p><blockquote>{stage.example}</blockquote></div>
                    <AspectRatio ratio={16 / 9} className="notebook-figure">
                      <div className="notebook-code"><span>cosmic/{stage.key}</span><code>$ {stage.command}</code><strong>{stage.output}</strong></div>
                      <svg viewBox="0 0 420 210" aria-hidden="true"><path d={index % 2 ? 'M20 156 C80 65 132 180 202 78 S330 40 400 116' : 'M20 170 L74 135 L128 148 L186 72 L240 92 L300 38 L400 76'} /><circle cx="74" cy="135" r="5" /><circle cx="186" cy="72" r="5" /><circle cx="300" cy="38" r="5" /></svg>
                    </AspectRatio>
                    <div className="notebook-scribble">{index === 0 ? 'keep the notebook →' : index === 1 ? 'compare, don’t compete' : index === 2 ? 'what happens at n = 100?' : 'new question starts here ↗'}</div>
                  </article>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </section>
    </LabShell>
  )
}

function ConsolePlot({ stage }: { stage: typeof stages[number] }) {
  return (
    <div className={`console-plot plot-${stage.key}`}>
      <div className="console-axis"><span>1.0</span><span>0.5</span><span>0.0</span></div>
      <svg viewBox="0 0 700 330" aria-label={`${stage.action} visualization`}>
        <path className="gridline" d="M0 82H700M0 164H700M0 246H700M140 0V330M280 0V330M420 0V330M560 0V330" />
        <path className="signal" d={stage.key === 'learn' ? 'M10 270 C80 250 92 80 174 112 S280 280 365 148 S510 44 690 92' : stage.key === 'try' ? 'M10 240 C95 42 175 290 268 96 S430 268 690 74 M10 262 C120 168 214 234 302 142 S520 118 690 188' : stage.key === 'build' ? 'M18 278 L104 224 L176 236 L260 120 L342 158 L438 64 L522 104 L682 42' : 'M20 258 C142 258 164 68 304 68 S478 244 682 92'} />
        <circle className="point p1" cx="176" cy="112" r="7" /><circle className="point p2" cx="365" cy="148" r="7" /><circle className="point p3" cx="560" cy="83" r="7" />
      </svg>
      <span className="console-coordinate">x: 33.7537 · y: -84.3863</span>
    </div>
  )
}

function FieldConsole() {
  const [mode, setMode] = useState<StageKey>('learn')
  const stage = stages.find(item => item.key === mode) ?? stages[0]
  const Icon = stage.icon

  return (
    <LabShell code="console" title="COSMIC Field Console">
      <section className="console-section">
        <div className="console-intro"><p className="lab-kicker">Community research instrument</p><h1>Scientific computing,<br />outside the syllabus.</h1><p>COSMIC turns questions into shared technical practice. Pick an operating mode and inspect the experiment.</p></div>
        <div className="console-frame">
          <div className="console-topbar"><span><i /> COSMIC FIELD CONSOLE</span><span>GSU / UNDERGRAD LAB / ONLINE</span></div>
          <ToggleGroup className="console-modes" value={[mode]} onValueChange={values => values[0] && setMode(values[0] as StageKey)} aria-label="Select a COSMIC activity">
            {stages.map(item => <ToggleGroupItem value={item.key} aria-label={item.action} key={item.key}><span>{item.step}</span>{item.key.toUpperCase()}</ToggleGroupItem>)}
          </ToggleGroup>
          <ResizablePanelGroup orientation="horizontal" className="console-panels">
            <ResizablePanel defaultSize="28%" minSize="20%">
              <div className="console-brief"><span className="console-label">ACTIVE METHOD</span><Icon /><p>{stage.action}</p><h2>{stage.category}</h2><small>{stage.description}</small></div>
            </ResizablePanel>
            <ResizableHandle withHandle className="console-handle" />
            <ResizablePanel defaultSize="48%" minSize="32%"><ConsolePlot stage={stage} /></ResizablePanel>
            <ResizableHandle withHandle className="console-handle" />
            <ResizablePanel defaultSize="24%" minSize="18%">
              <ScrollArea className="console-log">
                <span className="console-label">ACTIVITY LOG</span>
                <code>&gt; {stage.command}</code>
                <code>&gt; {stage.output}</code>
                <code>&gt; peer_connection: ready</code>
                <code>&gt; next_question: open</code>
                <Collapsible className="console-collapsible">
                  <CollapsibleTrigger render={<button type="button" />}>FIELD NOTE <ChevronDown /></CollapsibleTrigger>
                  <CollapsibleContent><p>{stage.example}</p></CollapsibleContent>
                </Collapsible>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
          <div className="console-status"><span>INPUT / QUESTION</span><span>PROCESS / TOGETHER</span><span>OUTPUT / SHAREABLE</span></div>
        </div>
      </section>
    </LabShell>
  )
}

function PosterNote({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger render={<button className="poster-note-trigger" type="button" />}>{label} ↗</HoverCardTrigger>
      <HoverCardContent className="poster-hover" side="top"><p>{children}</p></HoverCardContent>
    </HoverCard>
  )
}

function PosterWall() {
  return (
    <LabShell code="poster-wall" title="COSMIC Poster Wall">
      <section className="poster-section">
        <div className="poster-wall">
          <article className="poster poster-manifesto"><span>COMMUNITY OF STUDENTS IN MATH, INNOVATION & COMPUTING</span><h1>Scientific<br />computing,<br /><em>outside</em> the<br />syllabus.</h1><small>GSU · STUDENT RUN · ATLANTA</small></article>
          <article className="poster poster-workshop"><span className="poster-number">01</span><Wrench /><p>LEARN A TOOL</p><h2>PYTHON<br />LAB</h2><code>plot(data)<br />ask(why)</code><PosterNote label="WORKSHOP NOTE">Clean a small dataset, plot what you find, and leave with a working notebook.</PosterNote></article>
          <article className="poster poster-data"><span className="poster-number">02</span><p>TRY IT TOGETHER</p><h2>DATA<br />INVESTIGATION</h2><div className="poster-dots" aria-hidden="true" /><small>Two approaches.<br />One shared question.</small></article>
          <article className="poster poster-build"><div><span className="poster-number">03</span><Lightbulb /></div><p>BUILD OR INVESTIGATE SOMETHING</p><h2>MAKE THE<br />MODEL MOVE.</h2><AspectRatio ratio={16 / 5} className="poster-wave"><svg viewBox="0 0 700 150" aria-hidden="true"><path d="M0 116 C88 116 90 30 178 30 S266 126 354 126 S442 42 530 42 S618 105 700 105" /></svg></AspectRatio><small>PROJECT NIGHT / HACKATHON / COMPUTATIONAL MODEL</small></article>
          <article className="poster poster-share"><span className="poster-number">04</span><Braces /><p>SHARE THE RESULT</p><h2>SHOW<br />YOUR<br />WORK.</h2><Collapsible className="poster-collapsible"><CollapsibleTrigger render={<button type="button" />}>OPEN FIELD NOTE <ChevronDown /></CollapsibleTrigger><CollapsibleContent><p>Walk peers through a result, trade feedback, and hear how a guest researcher would approach the same problem.</p></CollapsibleContent></Collapsible></article>
          <article className="poster poster-principles"><span>LEARN THE TOOLS.</span><span>TEST AN IDEA.</span><span>SHARE WHAT YOU FIND.</span></article>
          <div className="poster-crosshair" aria-hidden="true">+</div>
        </div>
      </section>
    </LabShell>
  )
}

function StoryVisual({ stage }: { stage: typeof stages[number] }) {
  const Icon = stage.icon
  return (
    <div className={`story-visual visual-${stage.key}`}>
      <div className="story-visual-heading"><span>STATE / {stage.step}</span><Icon /></div>
      <div className="story-orbit"><i /><i /><i /><div><strong>{stage.action}</strong><small>{stage.output}</small></div></div>
      <code>{stage.command}</code>
      <Collapsible className="story-note">
        <CollapsibleTrigger render={<button type="button" />}>OPEN FIELD NOTE <ChevronDown /></CollapsibleTrigger>
        <CollapsibleContent><p>{stage.example}</p></CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function SplitStory() {
  const [active, setActive] = useState<StageKey>('learn')
  const index = stages.findIndex(item => item.key === active)
  const activeStage = stages[index] ?? stages[0]

  return (
    <LabShell code="split-story" title="Split-Screen Research Story">
      <section className="story-section">
        <div className="story-title"><p className="lab-kicker">From question to shared result</p><h1>Scientific computing,<br />outside the syllabus.</h1><p>COSMIC is an undergraduate organization where students learn by doing—and where every answer opens another question.</p></div>
        <Tabs value={active} onValueChange={value => setActive(value as StageKey)} className="story-tabs">
          <div className="story-progress"><span>CHAPTER {activeStage.step} / 04</span><Progress value={(index + 1) * 25} /></div>
          <ResizablePanelGroup orientation="horizontal" className="story-panels">
            <ResizablePanel defaultSize="56%" minSize="40%"><div className="story-stage">{stages.map(stage => <TabsContent value={stage.key} key={stage.key}><StoryVisual stage={stage} /></TabsContent>)}</div></ResizablePanel>
            <ResizableHandle withHandle className="story-handle" />
            <ResizablePanel defaultSize="44%" minSize="30%">
              <ScrollArea className="story-scroll">
                <TabsList className="story-chapters" aria-label="COSMIC story chapters">
                  {stages.map(stage => <TabsTrigger value={stage.key} key={stage.key}><span>{stage.step}</span><div><small>{stage.action}</small><strong>{stage.category}</strong><p>{stage.description}</p></div><ArrowRight /></TabsTrigger>)}
                </TabsList>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Tabs>
      </section>
    </LabShell>
  )
}

function DesignLabIndex() {
  return (
    <LabShell code="index" title="Five About + activities studies">
      <section className="lab-index">
        <p className="lab-kicker">COSMIC · Design2V2 studies</p>
        <h1>Five ways to tell<br />the same story.</h1>
        <p className="lab-index-intro">Each prototype preserves the same COSMIC journey and visual identity while testing a fundamentally different composition and interaction model.</p>
        <div className="lab-index-list">{prototypeLinks.map(([number, label, href], index) => <a href={href} key={href}><span>{number}</span><strong>{label}</strong><small>{['Interactive system diagram', 'Horizontal research artifact', 'Student-built technical instrument', 'Typographic campus collage', 'Resizable chapter narrative'][index]}</small><ArrowRight /></a>)}</div>
      </section>
    </LabShell>
  )
}

export default function DesignLab() {
  const route = useMemo(() => window.location.pathname.replace(/\/$/, ''), [])
  if (route.endsWith('/method-map')) return <MethodMap />
  if (route.endsWith('/notebook')) return <LabNotebook />
  if (route.endsWith('/console')) return <FieldConsole />
  if (route.endsWith('/poster-wall')) return <PosterWall />
  if (route.endsWith('/split-story')) return <SplitStory />
  return <DesignLabIndex />
}
