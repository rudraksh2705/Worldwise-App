import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCities } from "../CitiesContext";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useGeolocation } from "../../useGeolocation";
import Button from "./Button";
function useUrlPosition() {
  const [searchParams] = useSearchParams(); // ❗Fix: destructure from array
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  return [mapLat, mapLng];
}

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([28.7041, 77.1025]);

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  // Set map position based on searchParams
  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([parseFloat(mapLat), parseFloat(mapLng)]);
    }
  }, [mapLat, mapLng]);

  // Update map position when geolocation is obtained
  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  // Reverse geocoding fetch

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use Your Position"}
      </Button>

      <MapContainer
        center={mapPosition}
        zoom={5}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <strong>{city.cityName}</strong> <br />
              Visited on: {new Date(city.date).toDateString()}
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// This component dynamically recenters the map
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

ChangeCenter.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

// This component detects map clicks and redirects
function DetectClick() {
  const navigate = useNavigate();

  useMapEvent("click", (e) => {
    navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
  });

  return null;
}

export default Map;
