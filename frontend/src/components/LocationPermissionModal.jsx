import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useAppStore } from '../store/useAppStore';

export default function LocationPermissionModal() {
  const { 
    showLocationPermission, 
    setShowLocationPermission, 
    setUserLocation, 
    locationLoading, 
    setLocationLoading, 
    locationError,
    setLocationError 
  } = useAppStore();

  const [statusMessage, setStatusMessage] = useState(null);

  const handleRequest = () => {
    setStatusMessage(null);
    setLocationError(null);
    console.log("Geolocation UI: 'Share my location' button clicked.");
    
    if (!navigator.geolocation) {
      const err = "Geolocation is not supported by your browser.";
      console.error("Geolocation Error:", err);
      setLocationError(err);
      return;
    }

    console.log("Geolocation: Requesting current position...");
    setLocationLoading(true);

    const options = { 
      enableHighAccuracy: true, 
      timeout: 15000, 
      maximumAge: 0 
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log("Geolocation Success:", { latitude, longitude, accuracy });
        
        // Mock reverse geocoding
        const mockCity = "Your neighborhood"; 
        
        setStatusMessage("Location successfully shared!");
        console.log("Geolocation UI: Success message displayed.");
        
        // Brief delay to show success state before closing
        setTimeout(() => {
          console.log("Geolocation UI: Updating store and closing modal.");
          setUserLocation({ lat: latitude, lng: longitude, city: mockCity });
          setLocationLoading(false);
          // showLocationPermission is handled by setUserLocation in some store implementations, 
          // but we'll be explicit here if needed.
        }, 1500);
      },
      (error) => {
        console.warn("Geolocation Error Detail:", { code: error.code, message: error.message });
        let msg = "Location access failed.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            msg = "Permission denied. Please enable location access in your browser settings and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable. Please check your network or GPS.";
            break;
          case error.TIMEOUT:
            msg = "The request to get user location timed out. Please try again.";
            break;
          default:
            msg = "An unknown error occurred while fetching location.";
        }
        
        console.error("Geolocation UI Error:", msg);
        setLocationError(msg);
        setLocationLoading(false);
      },
      options
    );
  };

  // Check if permission was already granted
  useEffect(() => {
    if (showLocationPermission && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          console.log("Geolocation: Permission already granted, auto-fetching...");
          handleRequest();
        }
      });
    }
  }, [showLocationPermission]);

  return (
    <Modal 
      isOpen={showLocationPermission} 
      onClose={() => !locationLoading && setShowLocationPermission(false)}
      title="Location Access"
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`size-20 rounded-full flex items-center justify-center transition-colors duration-500 ${
          statusMessage ? 'bg-success bg-opacity-20 text-success' : 
          locationError ? 'bg-danger bg-opacity-10 text-danger' : 
          'bg-primary bg-opacity-10 text-primary'
        }`}>
          {locationLoading && !statusMessage ? (
            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="material-symbols-outlined text-5xl">
              {statusMessage ? 'check_circle' : locationError ? 'location_off' : 'location_on'}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">
            {statusMessage ? "Location Detected" : locationError ? "Access Denied" : "Enable Location Services"}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed min-h-[40px]">
            {statusMessage || locationError || "PrithviNet uses your location to provide real-time local pollution data and alerts for your neighborhood."}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {!statusMessage && (
            <Button 
              variant="primary" 
              className="w-full py-4 relative overflow-hidden" 
              onClick={handleRequest}
              disabled={locationLoading}
            >
              <span className={locationLoading ? 'opacity-0' : 'opacity-100'}>
                {locationError ? 'Try Again' : 'Share My Location'}
              </span>
              {locationLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </Button>
          )}
          
          {!locationLoading && !statusMessage && (
            <Button variant="ghost" className="w-full" onClick={() => setShowLocationPermission(false)}>
              Continue with Default (India)
            </Button>
          )}
        </div>
        
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
          Your privacy is protected. We only use this data within the app.
        </p>
      </div>
    </Modal>
  );
}
