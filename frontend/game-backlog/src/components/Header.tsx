import React from 'react'
import '../styles/Header.css'

function Header() {
  return (
    <div className='header-container'>
      <div className='header-logo'>
        🎮
      </div>
      <h1 className='header-title'>Game Backlog</h1>
      <nav className='header-nav'>
        <a href="/" className='header-link'>Home</a>
        <a href="/favorites" className='header-link'>Favorites</a>
        <a href="/about" className='header-link'>About</a>
      </nav>
    </div>
  )
}

export default Header