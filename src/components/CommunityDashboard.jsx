import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

const sensors = [
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
    id: 'rustenburg',
    name: 'Rustenburg Mine Perimeter',
    community: 'Rustenburg, North West',
    lat: -25.6672,
    lng: 27.2424,
    status: 'red',
    pm10: 160,
    pm25: 72,
    arsenic: 0.05,
    waterPh: 4.8,
    active: false,
  },
  {
    id: 'emalahleni',
    name: 'eMalahleni Community',
    community: 'eMalahleni, Mpumalanga',
    lat: -25.877,
    lng: 29.201,
    status: 'yellow',
    pm10: 90,
    pm25: 38,
    arsenic: 0.02,
    waterPh: 6.1,
    active: false,
  },
  {
    id: 'welkom',
    name: 'Welkom Residential',
    community: 'Welkom, Free State',
    lat: -27.9774,
    lng: 26.735,
    status: 'green',
    pm10: 30,
    pm25: 12,
    arsenic: 0.01,
    waterPh: 7.0,
    active: false,
  },
];

const colors = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };

export default function CommunityDashboard() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const visible = filter === 'all' ? sensors : sensors.filter(s => s.status === filter);
  const redCount = sensors.filter(s => s.status === 'red').length;
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
          ⚠️ {redCount} monitoring point{redCount > 1 ? 's' : ''} in danger. Residents advised to stay indoors and avoid local water sources.
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 600px', minWidth: 300 }}>
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

          <MapContainer center={[-26.5, 28.0]} zoom={6} style={{ height: '480px', borderRadius: 8 }}>
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
