import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const drawerRef = useRef(null)
  const backdropRef = useRef(null)

  const setOpen = (open) => {
    if (!toggleRef.current || !drawerRef.current) return
    toggleRef.current.setAttribute('aria-expanded', String(open))
    toggleRef.current.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    drawerRef.current.hidden = !open
    if (backdropRef.current) backdropRef.current.hidden = !open
    document.body.classList.toggle('lounge-drawer-open', open)
    setIsMenuOpen(open)
  }

  const handleToggle = () => {
    setOpen(!isMenuOpen)
  }

  const handleBackdropClick = () => {
    setOpen(false)
  }

  useEffect(() => {
    const handleLinkClick = () => {
      setOpen(false)
    }

    const drawer = drawerRef.current
    if (drawer) {
      const links = drawer.querySelectorAll('a')
      links.forEach(a => a.addEventListener('click', handleLinkClick))
      return () => {
        links.forEach(a => a.removeEventListener('click', handleLinkClick))
      }
    }
  }, [])

  const navLinks = [
    { label: 'Digital Lounge', href: '/' },
    { label: 'Board Games', href: '/board-games' },
    { label: 'PlayStation', href: '/playstation' },
    { label: 'Menu', href: '/menu' },
    { label: 'Exclusive Offers', href: '/exclusive-offers' },
    { label: 'Privilege Membership', href: '/privilege-membership' },
    { label: 'Birthday Celebrations', href: '/birthday-celebrations' },
    { label: 'Corporate Bookings', href: '/corporate-bookings' },
    { label: 'Sunday Brunch', href: '/sunday-brunch' },
    { label: 'Make It Your Moment', href: '/make-it-your-moment' },
  ]

  return (
    <header className="lounge-header">
      <a href="/" className="logo lounge-header__logo" aria-label="DESIRE SHEESHA LOUNGE home">
        <img
          src="https://restaurents-api.cylsys.com/Assets/theDesireLounge/Image/Logo/logo.webp"
          alt=""
          className="logo__mark"
          width="48"
          height="48"
        />
        <span className="logo__copy">
          <span className="logo__text">DESIRE</span>
          <span className="logo__tag">SHEESHA LOUNGE</span>
        </span>
      </a>

      <div className="lounge-header__actions">
        <button
          ref={toggleRef}
          type="button"
          className="lounge-header__menu"
          aria-expanded="false"
          aria-controls="lounge-drawer"
          aria-label="Open menu"
          onClick={handleToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav
        ref={drawerRef}
        className="lounge-drawer"
        id="lounge-drawer"
        aria-label="Primary"
        hidden
      >
        <div className="lounge-drawer__panel">
          <p className="lounge-drawer__title">Explore</p>
          {navLinks.map(link => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <hr />
          <p className="lounge-drawer__title">Legal</p>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </nav>

      <div
        ref={backdropRef}
        id="drawer-backdrop"
        className="drawer-backdrop"
        onClick={handleBackdropClick}
        hidden
      />
    </header>
  )
}
