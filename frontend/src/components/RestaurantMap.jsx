import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom MapPin icon using HTML/SVG to avoid Vite asset path issues with default Leaflet markers
const createCustomIcon = (name) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background-color: #FF385C;
        border: 3px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transform: translate(-50%, -50%);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin: auto;">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export default function RestaurantMap({ latitude, longitude, name, address, height = '260px' }) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  const isValidCoords = !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0);

  if (!isValidCoords) {
    return (
      <div
        className="w-full bg-[#F7F7F7] border border-[#DDDDDD] rounded-2xl flex flex-col items-center justify-center p-6 text-center text-[#717171]"
        style={{ height }}
      >
        <p className="text-xs font-semibold">Map coordinates not available for this restaurant.</p>
        <p className="text-[11px] mt-1 text-[#999999]">{address}</p>
      </div>
    );
  }

  const customIcon = createCustomIcon(name);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#DDDDDD] shadow-sm z-0 relative" style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          {name && (
            <Popup>
              <div className="p-1 font-sans text-xs">
                <p className="font-bold text-[#222222]">{name}</p>
                <p className="text-[11px] text-[#717171] mt-0.5">{address}</p>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
