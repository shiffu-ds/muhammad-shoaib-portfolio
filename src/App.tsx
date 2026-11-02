import { About } from './components/About'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MotionLayer } from './components/MotionLayer'
import { ScrollTop } from './components/ScrollTop'
import { Ticker } from './components/Ticker'
import { Work } from './components/Work'

export function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Ticker />
        <Work />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ScrollTop />
      <MotionLayer />
    </>
  )
}
