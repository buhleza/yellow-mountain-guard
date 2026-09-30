import "./Navigation.css";
function Navigation({ activeDashboard, onNavigate }) {
  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-icon">
          ◇
        </div>

        <div>
          <div className="brand-name">Sentinel</div>
          <div className="brand-subtitle">ENVIRONMENTAL GUARD</div>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <div className="dashboard-section">
        <div className="section-title">DASHBOARDS</div>

        <button
          className={`nav-item ${
            activeDashboard === "drone" ? "active" : ""
          }`}
          onClick={() => onNavigate("drone")}
        >
          <span className="nav-icon">◇</span>

          <span className="nav-text">
            <strong>Drone Response</strong>
            <small>Wind & dispatch</small>
          </span>

          {activeDashboard === "drone" && (
            <span className="active-dot"></span>
          )}
        </button>

        <button
          className={`nav-item ${
            activeDashboard === "recycling" ? "active" : ""
          }`}
          onClick={() => onNavigate("recycling")}
        >
          <span className="nav-icon">▣</span>

          <span className="nav-text">
            <strong>Recycling Value</strong>
            <small>Gold · Bricks · Jobs</small>
          </span>

          {activeDashboard === "recycling" && (
            <span className="active-dot"></span>
          )}
        </button>

        <button
          className={`nav-item ${
            activeDashboard === "community" ? "active" : ""
          }`}
          onClick={() => onNavigate("community")}
        >
          <span className="nav-icon">⊕</span>

          <span className="nav-text">
            <strong>Community Monitor</strong>
            <small>Air quality & alerts</small>
          </span>

          {activeDashboard === "community" && (
            <span className="active-dot"></span>
          )}
        </button>
      </div>

      <div className="active-site">
        <div className="active-site-title">ACTIVE SITE</div>

        <div className="active-site-name">
          Snake Park
        </div>

        <div className="active-site-location">
          Soweto, Gauteng ZA
        </div>

        <div className="active-site-residents">
          ~50,000 residents
        </div>
      </div>

      <div className="sensor-status">
        <span className="online-dot"></span>
        6 sensors online
      </div>

    </aside>
  );
}

export default Navigation;