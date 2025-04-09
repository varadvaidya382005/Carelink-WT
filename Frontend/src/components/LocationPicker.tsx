import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { LatLng, Icon, Map } from 'leaflet';
import { MapPin, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
}

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map events and marker movement
function MapEvents({ onLocationSelect }: { onLocationSelect: (location: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

// Component to handle search and marker updates
function SearchControl({ onLocationSelect }: { onLocationSelect: (location: LatLng) => void }) {
  const map = useMap();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const location = new LatLng(parseFloat(lat), parseFloat(lon));
        map.setView(location, 16);
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="absolute top-3 left-3 right-3 z-[1000]">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

// Component to handle marker position
function DraggableMarker({ position }: { position: LatLng }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return <Marker position={position} icon={customIcon} />;
}

function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<LatLng>(new LatLng(19.0760, 72.8777)); // Mumbai

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
          setPosition(newPos);
          updateLocationInfo(newPos);
        },
        () => {
          // If geolocation fails, use Mumbai as default
          const mumbai = new LatLng(19.0760, 72.8777);
          updateLocationInfo(mumbai);
        }
      );
    }
  }, []);

  const updateLocationInfo = async (latLng: LatLng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat}&lon=${latLng.lng}`
      );
      const data = await response.json();

      onLocationSelect({
        address: data.display_name || 'Unknown location',
        lat: latLng.lat,
        lng: latLng.lng,
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleLocationSelect = useCallback((latLng: LatLng) => {
    setPosition(latLng);
    updateLocationInfo(latLng);
  }, []);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden relative">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl onLocationSelect={handleLocationSelect} />
        <MapEvents onLocationSelect={handleLocationSelect} />
        <DraggableMarker position={position} />
      </MapContainer>
    </div>
  );
}

export default LocationPicker; 