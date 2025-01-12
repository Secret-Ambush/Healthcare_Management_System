export const fetchNearbyHospitals = (latitude, longitude, mapInstance, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error("Google Maps JavaScript API is not loaded."));
      return;
    }

    if (!latitude || !longitude) {
      reject(new Error("Invalid latitude or longitude."));
      return;
    }

    if (!mapInstance) {
      reject(new Error("Invalid map instance. Ensure the map is initialized."));
      return;
    }

    const { radius = 5000, type = "hospital" } = options;
    const location = new google.maps.LatLng(latitude, longitude);
    const service = new google.maps.places.PlacesService(mapInstance);

    const request = {
      location,
      radius,
      type,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const hospitals = results.map((place) => ({
          name: place.name || "Unknown",
          latitude: place.geometry?.location?.lat() || null,
          longitude: place.geometry?.location?.lng() || null,
          address: place.vicinity || "Address unavailable",
          rating: place.rating || "N/A",
        }));
        resolve(hospitals);
      } else {
        switch (status) {
          case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
            reject(new Error("No hospitals found in the specified area."));
            break;
          case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
            reject(new Error("Query limit exceeded. Please try again later."));
            break;
          case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
            reject(new Error("Request denied. Check your API key and permissions."));
            break;
          case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
            reject(new Error("Invalid request. Please check the parameters."));
            break;
          default:
            reject(new Error(`PlacesService Error: ${status}`));
        }
      }
    });
  });
};
