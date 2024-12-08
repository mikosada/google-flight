import axios from "axios";

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

export interface FlightDestinationsResponse {
  context: {
    status: string;
    sessionId: string;
    totalResults: number;
  };
  results: FlightDestination[];
}

export interface FlightDestination {
  id: string;
  type: string;
  content: {
    location: {
      id: string;
      skyCode: string;
      name: string;
      type: string;
    };
    flightQuotes?: {
      cheapest: {
        price: string;
        rawPrice: number;
        direct: boolean;
      };
    };
    image: {
      url: string;
    };
    flightRoutes: {
      directFlightsAvailable: boolean;
    };
  };
}

export const searchFlightDestinations = async (
  originEntityId: string = "27539774",
  currency: string = "IDR"
): Promise<FlightDestinationsResponse[]> => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightEverywhere",
    params: {
      originEntityId,
      cabinClass: "economy",
      journeyType: "one_way",
      currency,
    },
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching flight destinations:", error);
    return [];
  }
};

export const searchAirports = async (query: string) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
    params: { query, locale: "en-US" },
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error("Error searching airports:", error);
    return [];
  }
};

export const searchFlight = async (
  originSkyId: string,
  destinationSkyId: string,
  originEntityId: string,
  destinationEntityId: string,
  departureDate: string,
  returnDate?: string,
  cabinClass?: string,
  adults?: string,
  children?: string,
  infants?: string
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
    params: {
      originSkyId: originSkyId,
      destinationSkyId: destinationSkyId,
      originEntityId: originEntityId,
      destinationEntityId: destinationEntityId,
      date: departureDate,
      returnDate: returnDate,
      cabinClass: cabinClass,
      adults: adults,
      children: children,
      infants: infants,
      sortBy: "best",
      currency: "USD",
      market: "en-US",
      countryCode: "US",
    },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error searching flight: ", error);
    return [];
  }
};

export const getLocationId = async (location: string) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
    params: { query: location, locale: "en-US" },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data[1];
  } catch (error) {
    console.error("Error getting location ID: ", error);
    return [];
  }
};

export const getFlightDetails = async (
  itineraryId: string,
  legs: Array<{
    origin: string;
    destination: string;
    date: string;
  }>,
  sessionId: string
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails",
    params: {
      itineraryId,
      legs: JSON.stringify(legs),
      sessionId,
    },
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error("Error getting flight details:", error);
    return null;
  }
};
