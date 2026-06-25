import { Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FavoritePage from './pages/FavoritePage'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>天候と服装</h1>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            ホーム
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>
            お気に入り
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritePage />} />
        </Routes>
      </main>
    </div>
  )
}
