import { Navigate, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Review from './pages/Review'
import Settings from './pages/Settings'

export default function App() {
  return (
    <>
      <Nav />
      {/* Content stays in a centered column with air on both sides, even on wide screens. */}
      <main className="mx-auto w-full max-w-[680px] px-4 pb-32 pt-6 md:px-6 md:pb-20 md:pt-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
