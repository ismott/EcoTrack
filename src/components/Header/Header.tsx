import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__icon">🌿</span>
        <span className="header__title">EcoTrack</span>
      </div>
      <div className="header__info">
        <span className="header__info-top">UNIP | APS 2026</span>
        <span className="header__info-bottom">Israel M. &amp; João H.</span>
      </div>
    </header>
  )
}

export default Header