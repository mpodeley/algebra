import { HashRouter, Route, Routes } from 'react-router-dom'
import { ChapterNav } from './components/layout/ChapterNav'
import { Hero } from './chapters/intro/Hero'
import { IntroPlaceholder } from './chapters/intro/IntroPlaceholder'

export default function App() {
  return (
    <HashRouter>
      <ChapterNav />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/intro" element={<IntroPlaceholder />} />
      </Routes>
    </HashRouter>
  )
}
