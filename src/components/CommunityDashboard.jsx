import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

const sensors = [
  // ============ RED ============
  {
    id: 'snake-park-primary',
    name: 'Snake Park Primary',
    community: 'Snake Park, Soweto',
    lat: -26.2685,
    lng: 27.863,
    status: 'red',
    pm10: 145,
    pm25: 68,
    arsenic: 0.04,
    waterPh: 5.2,
    active: true,
  },
  {
    id: 'mountain-view-clinic',
    name: 'Mountain View Clinic',
    community: 'Snake Park, Soweto',
    lat: -26.2655,
    lng: 27.8605,
    status: 'red',
    pm10: 132,
    pm25: 61,
    arsenic: 0.038,
    waterPh: 5.4,
    active: false,
  },

  // ============ YELLOW ============
  {
    id: 'dobsonville-east',
    name: 'Dobsonville East',
    community: 'Snake Park, Soweto',
    lat: -26.2695,
    lng: 27.8655,
    status: 'yellow',
    pm10: 78,
    pm25: 32,
    arsenic: 0.02,
    waterPh: 6.4,
    active: false,
  },
  {
    id: 'snake-park-station',
    name: 'Snake Park Station',
    community: 'Snake Park, Soweto',
    lat: -26.2715,
    lng: 27.8615,
    status: 'yellow',
    pm10: 82,
    pm25: 35,
    arsenic: 0.022,
    waterPh: 6.2,
    active: false,
  },

  // ============ GREEN ============
  {
    id: 'diepkloof-community',
    name: 'Diepkloof Community Hall',
    community: 'Snake Park, Soweto',
    lat: -26.2660,
    lng: 27.8595,
    status: 'green',
    pm10: 28,
    pm25: 11,
    arsenic: 0.005,
    waterPh: 7.1,
    active: false,
  },
  {
    id: 'orlando-stadium',
    name: 'Orlando Stadium Precinct',
    community: 'Soweto, Gauteng',
    lat: -26.2325,
    lng: 27.8445,
    status: 'green',
    pm10: 32,
    pm25: 13,
    arsenic: 0.006,
    waterPh: 7.0,
    active: false,
  },
];

const colors = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };

export default function CommunityDashboard() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const visible = filter === 'all' ? sensors : sensors.filter(s => s.status === filter);

  // Red count is now based on what is currently visible, not the full list.
  const redCount = visible.filter(s => s.status === 'red').length;
  const activeSite = sensors.find(s => s.active);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {redCount > 0 && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: 8,
          marginBottom: 16,
          fontWeight: 600
        }}>
          <div>
            ⚠️ {redCount} monitoring point{redCount > 1 ? 's' : ''} in danger. Residents advised to stay indoors and avoid local water sources.
          </div>

          <div style={{
            marginTop: 10,
            padding: '10px 12px',
            background: 'white',
            border: '1px solid #fca5a5',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            color: '#7f1d1d'
          }}>
            📱 ALERT SENT: SMS and WhatsApp messages dispatched to 12,400 registered residents within 2 km of Snake Park Primary and Mountain View Clinic.
            <br />
            <span style={{ fontSize: 11, color: '#991b1b' }}>
              Sent at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Automatic · No action required by user
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 480px', minWidth: 280 }}>
          <div style={{ marginBottom: 12 }}>
            {['all', 'green', 'yellow', 'red'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  marginRight: 8,
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  background: filter === f ? '#1e293b' : 'white',
                  color: filter === f ? 'white' : '#333',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <MapContainer center={[-26.2685, 27.863]} zoom={14} style={{ height: '480px', borderRadius: 8 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {visible.map(s => (
              <CircleMarker
                key={s.id}
                center={[s.lat, s.lng]}
                radius={s.active ? 18 : 13}
                pathOptions={{
                  color: colors[s.status],
                  fillColor: colors[s.status],
                  fillOpacity: 0.75,
                  weight: s.active ? 4 : 2,
                }}
                eventHandlers={{ click: () => setSelected(s) }}
              >
                <Popup>
                  <strong>{s.name}</strong><br />
                  {s.community}<br />
                  Status: {s.status.toUpperCase()}<br />
                  PM10: {s.pm10} µg/m³<br />
                  PM2.5: {s.pm25} µg/m³<br />
                  Arsenic: {s.arsenic} µg/m³<br />
                  Water pH: {s.waterPh}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 260 }}>
          <div style={{
            padding: 16,
            background: '#172338',
            color: 'white',
            borderRadius: 8,
            marginBottom: 12
          }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#71809a', marginBottom: 6 }}>
              ACTIVE SITE
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Snake Park, Soweto</div>
            <div style={{ fontSize: 12, color: '#a5b3c9', marginTop: 4 }}>
              Gauteng · ~50,000 residents
            </div>
            <div style={{ fontSize: 12, color: '#a5b3c9', marginTop: 4 }}>
              {sensors.length} monitoring points · nationwide rollout planned
            </div>
          </div>

          {selected ? (
            <div style={{
              padding: 16,
              background: 'white',
              borderRadius: 8,
              border: '1px solid #dce3eb',
              borderLeft: `6px solid ${colors[selected.status]}`
            }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 15 }}>{selected.name}</h3>
              <p style={{ margin: '2px 0', fontSize: 13, color: '#71809a' }}>
                {selected.community}
              </p>
              <p style={{ margin: '10px 0 4px', fontSize: 13 }}>
                <strong>Status:</strong>{' '}
                <span style={{ color: colors[selected.status], fontWeight: 700 }}>
                  {selected.status.toUpperCase()}
                </span>
              </p>
              <p style={{ margin: '4px 0', fontSize: 13 }}>
                <strong>PM10:</strong> {selected.pm10} µg/m³
              </p>
              <p style={{ margin: '4px 0', fontSize: 13 }}>
                <strong>PM2.5:</strong> {selected.pm25} µg/m³
              </p>
              <p style={{ margin: '4px 0', fontSize: 13 }}>
                <strong>Arsenic:</strong> {selected.arsenic} µg/m³
              </p>
              <p style={{ margin: '4px 0', fontSize: 13 }}>
                <strong>Water pH:</strong> {selected.waterPh}
              </p>
              <button
                onClick={() => setSelected(null)}
                style={{ marginTop: 10, padding: '6px 12px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          ) : (
            <div style={{
              padding: 20,
              background: 'white',
              borderRadius: 8,
              border: '1px dashed #dce3eb',
              color: '#71809a',
              fontSize: 13,
              textAlign: 'center'
            }}>
              Click a sensor on the map to view detailed readings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
