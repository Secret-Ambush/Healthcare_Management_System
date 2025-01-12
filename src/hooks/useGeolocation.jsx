import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const success = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null); // Clear any existing error
    };

    const failure = (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        setError("Please enable location permissions for this website, and refresh.");
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setError("Location information is unavailable. Please check your GPS or network.");
      } else if (err.code === err.TIMEOUT) {
        setError("Location request timed out. Please try again.");
      } else {
        setError("An unknown error occurred while fetching location.");
      }
    };

    // Use `getCurrentPosition` for one-time location retrieval
    const options = {
      enableHighAccuracy: false,
      timeout: 20000, // 20 seconds
      maximumAge: 0, // Prevent using cached location
    };

    navigator.geolocation.getCurrentPosition(success, failure, options);

    // Clean-up function (not needed for `getCurrentPosition`)
    return () => {
      // Cleanup if switching back to `watchPosition`
    };
  }, []);

  return { location, error };
};
