import styles from "./City.module.css";
import { useCities } from "../CitiesContext";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

function City() {
  const { id } = useParams();
  // const { emoji, cityName, notes, date } = city;
  const { getCity, isLoading, currentCity } = useCities();
  useEffect(
    function () {
      console.log(id);
      getCity(id);
    },
    [id]
  );
  if (isLoading) return <Spinner />;
  console.log(currentCity);
  const { emoji, cityName, notes, date } = currentCity;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{date || "Unknown date"}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
