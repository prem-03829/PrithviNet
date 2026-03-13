import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import Modal from './Modal';
import Button from './Button';
import { useAppStore } from '../store/useAppStore';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapEvents({ onClick, isOpen }) {
  const map = useMap();
  
  // Handle Leaflet gray tiles issue by invalidating size when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, [isOpen, map]);

  useMapEvents({
    click: (e) => {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function LocationPickerModal({ isOpen, onClose, onConfirm }) {
  const { userLocation } = useAppStore();
  const defaultPos = userLocation ? [userLocation.lat, userLocation.lng] : [22.5937, 78.9629];
  
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("Click on map to pick location");

  // Reset or initialize position when modal opens
  useEffect(() => {
    if (isOpen && !position) {
      const initial = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: 22.5937, lng: 78.9629 };
      setPosition(initial);
      setAddress(`Lat: ${initial.lat.toFixed(4)}, Lng: ${initial.lng.toFixed(4)}`);
    }
  }, [isOpen, userLocation]);

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    setAddress(`Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`);
  };

  const handleConfirm = () => {
    if (position) {
      onConfirm({ ...position, address });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pick Incident Location">
      <div className="space-y-4">
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-primary dark:border-opacity-20 bg-slate-900">
          <MapContainer 
            center={defaultPos} 
            zoom={15} 
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
            />
            <MapEvents onClick={handleMapClick} isOpen={isOpen} />
            {position && <Marker position={[position.lat, position.lng]} />}
          </MapContainer>
          
          <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
            <div className="bg-background-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary border-opacity-20 shadow-lg">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Instruction</p>
              <p className="text-xs text-white">Click anywhere on the map to place pin</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-primary dark:bg-opacity-5 rounded-lg border border-slate-200 dark:border-primary dark:border-opacity-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-sm">my_location</span>
            <span className="text-xs font-bold text-slate-400 uppercase">Selected Coordinates</span>
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{address}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleConfirm} disabled={!position}>
            Confirm Location
          </Button>
        </div>
      </div>
    </Modal>
  );
}
