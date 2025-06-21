import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Spinner from "./Spinner";
import { useCities } from "../CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  return [mapLat, mapLng];
}

function Form() {
  const { dispatch, cities } = useCities(); // ✅ use setCities here
  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(""); // ✅ must be string for input type="date"
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [mapLat, mapLng] = useUrlPosition();

  // ✅ Handle form submit
  function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      id: Date.now(), // simple ID generator
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: parseFloat(mapLat),
        lng: parseFloat(mapLng),
      },
    };

    dispatch({ type: "setCity", payload: [...cities, newCity] });
    navigate("/app/cities"); // optional: navigate to cities list
  }

  // ✅ Reverse geocoding
  useEffect(() => {
    async function fetchCity() {
      if (!mapLat || !mapLng) return;

      try {
        setIsLoadingGeocoding(true);

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${mapLat}&longitude=${mapLng}`
        );

        if (!res.ok) throw new Error("Failed to fetch location");

        const data = await res.json();
        if (!data.countryCode) throw new Error("Country Not Found");

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(convertToEmoji(data.countryCode));
        setDate(new Date().toISOString().split("T")[0]); // YYYY-MM-DD
      } catch (err) {
        console.error("Reverse geocoding failed:", err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCity();
  }, [mapLat, mapLng]);

  if (isLoadingGeocoding) return <Spinner />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
