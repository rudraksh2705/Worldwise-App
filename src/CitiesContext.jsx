import { createContext, useEffect, useContext, useReducer } from "react";
import PropTypes from "prop-types"; // ✅ import prop-types

const citiesli = [
  {
    cityName: "Jaipur",
    country: "India",
    emoji: "🇮🇳",
    date: "2027-10-31T15:59:59.138Z",
    notes: "My favorite city so far!",
    position: {
      lat: 26.9124,
      lng: 75.7873,
    },
    id: 73930385,
  },
  {
    cityName: "Mumbai",
    country: "India",
    emoji: "🇮🇳",
    date: "2027-07-15T08:22:53.976Z",
    notes: "",
    position: {
      lat: 18.9582,
      lng: 72.8321,
    },
    id: 17806751,
  },
  {
    cityName: "Delhi",
    country: "India",
    emoji: "🇮🇳",
    date: "2027-02-12T09:24:11.863Z",
    notes: "Amazing 😃",
    position: {
      lat: 28.7041,
      lng: 77.1025,
    },
    id: 98443197,
  },
];

export const CityContext = createContext();

const initialState = {
  cities: JSON.parse(localStorage.getItem("cities")) || [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  if (action.type === "setLoading") {
    return { ...state, isLoading: !state.isLoading };
  }
  if (action.type === "setCity") {
    return { ...state, cities: action.payload };
  }
  if (action.type === "setCurrentCity") {
    return { ...state, currentCity: action.payload };
  }
  if (action.type === "deleteCity") {
    return { ...state, cities: action.payload };
  } else return state;
}

export default function ContextProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "setLoading" });
        const res = citiesli;
        const data = await res.json();
        dispatch({ type: "setCity", payload: data });
      } catch {
        alert("Failed to load cities.");
      } finally {
        dispatch({ type: "setLoading" });
      }
    }
    fetchCities();
  }, []);

  function getCity(id) {
    console.log(id);
    console.log(cities);
    dispatch({ type: "setLoading" });

    const res = cities.find((city) => +city.id === +id);
    console.log(res);
    dispatch({ type: "setCurrentCity", payload: res });
    setTimeout(() => {
      dispatch({ type: "setLoading" });
    }, 300); // 300ms delay (adjust as needed)
  }

  const countries = Array.from(
    new Map(
      cities.map((city) => [
        city.country,
        { country: city.country, emoji: city.emoji },
      ])
    ).values()
  );

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        countries,
        currentCity,
        getCity,
        dispatch,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CityContext);
  if (context === undefined)
    throw new Error("Cities Context used Outside Provider");
  return context;
}

// ✅ Add prop type checking
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
