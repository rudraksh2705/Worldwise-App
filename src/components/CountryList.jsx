import PropTypes from "prop-types";
import Message from "./Message";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import { useCities } from "../CitiesContext";

export default function CountryList() {
  const { countries } = useCities();
  if (!countries.length) return <Message message="no countries yet" />;

  return (
    <div>
      <ul className={styles.countriesList}>
        {countries.map((country) => (
          <CountryItem key={country.country} country={country} />
        ))}
      </ul>
    </div>
  );
}

CountryList.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      country: PropTypes.string.isRequired,
      emoji: PropTypes.string, // if you're using emoji too
    })
  ).isRequired,
};
