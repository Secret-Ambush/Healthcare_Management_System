import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { fetchNearbyHospitals } from "../utils/fetchNearbyHospitals";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { ClipLoader } from "react-spinners";
import { useGeolocation } from "../hooks/useGeolocation";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const HospitalList = ({ hospitals, sortByRating, sortByProximity, userLocation }) => (
  <div className="hospital-list">
    {hospitals.length > 0 ? (
      <>
        <p className="text-xs justify-center my-4">Note: Blue icon shows your location</p>
        <h2 className="text-xl font-bold my-4">Closest Hospitals</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={sortByRating}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-2"
          >
            Sort by Rating
          </button>
          <button
            onClick={sortByProximity}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Sort by Proximity
          </button>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300" aria-label="List of hospitals">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 relative">
                Name
                <button
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm hover:bg-blue-600"
                  title="Click the hospital name to open its location in Google Maps."
                >
                  ?
                </button>
              </th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Rating</th>
              <th className="border border-gray-300 px-4 py-2">Distance (km)</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital, index) => {
              const distance = userLocation && userLocation.latitude && userLocation.longitude
                ? calculateDistance(userLocation.latitude, userLocation.longitude, hospital.latitude, hospital.longitude).toFixed(2)
                : "-";

              return (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {hospital.name}
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{hospital.address}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {hospital.rating !== "N/A" ? `${hospital.rating} ★` : "No Rating"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{distance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    ) : (
      <p className="text-center my-4">No hospitals available to display.</p>
    )}
  </div>
);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const HospitalSearch = () => {
  const { location, error: geoError } = useGeolocation();
  const [hospitals, setHospitals] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false); // Track map readiness
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.error("Google Maps API Key is not defined. Check your .env file.");
      return;
    }
  
    if (location.latitude && location.longitude && isMapReady) {
      console.log("Fetching hospitals for location:", location);
  
      setMapCenter({ lat: location.latitude, lng: location.longitude });
  
      setLoading(true);
  
      // Fetch hospitals and update map
      fetchNearbyHospitals(location.latitude, location.longitude, mapRef.current)
        .then((data) => {
          console.log("Hospitals fetched successfully:", data);
          setHospitals(data);
          setLoading(false);
  
          if (mapRef.current) {
            // Clear existing markers (if needed)
            if (mapRef.current.markers) {
              mapRef.current.markers.forEach((marker) => marker.setMap(null));
            }
            mapRef.current.markers = [];
  
            // Add user's location marker
            const userMarker = new window.google.maps.Marker({
              position: { lat: location.latitude, lng: location.longitude },
              map: mapRef.current,
              title: "Your Location", // Tooltip text
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom blue icon
              },
            });
            mapRef.current.markers.push(userMarker);
  
            // Add hospital markers with hoverable titles
            data.forEach((hospital) => {
              const hospitalMarker = new window.google.maps.Marker({
                position: { lat: hospital.latitude, lng: hospital.longitude },
                map: mapRef.current,
                title: hospital.name, // Tooltip text
              });
              mapRef.current.markers.push(hospitalMarker);
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching hospitals:", err);
          setFetchError(`Failed to load nearby hospitals: ${err.message}`);
          setLoading(false);
        });
    }
  }, [location, isMapReady, apiKey]);
  

  const sortByRating = () => {
    const sorted = [...hospitals].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setHospitals(sorted);
  };

  const sortByProximity = () => {
    if (!location.latitude || !location.longitude) {
      alert("User location is unavailable for proximity sorting.");
      return;
    }

    const sorted = [...hospitals].sort((a, b) => {
      const distA = calculateDistance(location.latitude, location.longitude, a.latitude, a.longitude);
      const distB = calculateDistance(location.latitude, location.longitude, b.latitude, b.longitude);
      return distA - distB;
    });

    setHospitals(sorted);
  };

  if (!apiKey) {
    return (
      <div className="text-center text-red-500">
        Google Maps API Key is missing. Please configure your environment variables.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="overflow-x-hidden">
        <h1 className="text-center text-2xl font-bold my-6" role="heading" aria-level="1">
          Nearby Hospitals Locator (within 5km)
        </h1>
        {geoError ? (
          <p className="text-center text-red-500">{geoError}</p>
        ) : fetchError ? (
          <p className="text-center text-red-500">{fetchError}</p>
        ): !location.latitude || !location.longitude ? (
          <div className="flex justify-center items-center mt-10">
            <ClipLoader size={50} color={"#123abc"} />
            <p className="ml-4">Locating you...</p>
          </div>
        ) : (
          <>
            <LoadScript
              googleMapsApiKey={apiKey}
              libraries={["places"]} // Ensure Places API is included
              loadingElement={<p className="text-center">Loading map...</p>}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                onLoad={(map) => {
                  console.log("Google Map loaded successfully.");
                  mapRef.current = map;
                  setIsMapReady(true); // Mark map as ready
                }}
              />
            </LoadScript>
            {!loading && hospitals.length > 0 && (
              <HospitalList
                hospitals={hospitals}
                sortByRating={sortByRating}
                sortByProximity={sortByProximity}
                userLocation={location}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HospitalSearch;
