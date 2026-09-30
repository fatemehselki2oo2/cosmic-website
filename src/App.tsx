import { lazy, Suspense } from 'react'
import DesignPage from './DesignPage'
import Design2V2 from './Design2V2'

const DesignLab = lazy(() => import('./design-lab/DesignLab'))
const CosmicPosterV2 = lazy(() => import('./design-lab/CosmicPosterV2'))
const CosmicSite = lazy(() => import('./cosmic-site/CosmicSite'))

const cosmicSitePages = ['/about', '/events', '/activities', '/gallery', '/leadership']

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'

  if (path === '/design-lab/cosmic-poster-v2') {
    return <Suspense fallback={<div aria-live="polite">Loading COSMIC poster prototype…</div>}><CosmicPosterV2 /></Suspense>
  }
  if (path === '/design-lab' || path.startsWith('/design-lab/')) {
    return <Suspense fallback={<div aria-live="polite">Loading design prototype…</div>}><DesignLab /></Suspense>
  }
  if (path === '/') {
    return <Suspense fallback={<div aria-live="polite">Loading COSMIC poster…</div>}><CosmicPosterV2 /></Suspense>
  }
  if (cosmicSitePages.includes(path)) {
    return <Suspense fallback={<div aria-live="polite">Loading COSMIC…</div>}><CosmicSite /></Suspense>
  }
  if (path === '/design-2-v2') return <Design2V2 />

  const designMatch = path.match(/^\/design-([123])$/)
  if (designMatch) return <DesignPage variant={Number(designMatch[1]) as 1 | 2 | 3} />

  return <Suspense fallback={<div aria-live="polite">Loading COSMIC…</div>}><CosmicSite /></Suspense>
}

export default App
