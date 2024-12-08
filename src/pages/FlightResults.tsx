import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchFlight } from "../services/flightServices";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const FlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [flightRes, setFlightRes] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (minutes: number) => {
    const durationObj = dayjs.duration(minutes, "minutes");
    const hours = durationObj.hours();
    const mins = durationObj.minutes();

    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${mins} min`;
    }
  };

  const formatFlightDate = (dateString: string) => {
    const date = dayjs(dateString);
    return {
      time: date.format("HH:mm"),
      day: date.format("ddd, DD MMM"),
    };
  };

  const handleFlightClick = (flight: any) => {
    const itineraryId = flight.id;
    const legs = flight.legs.map((leg: any) => ({
      origin: leg.origin.displayCode,
      destination: leg.destination.displayCode,
      date: dayjs(leg.departure).format("YYYY-MM-DD"),
    }));

    navigate(`/flight-details/${itineraryId}`, {
      state: {
        itineraryId,
        legs,
        sessionId: sessionId,
      },
    });
    console.log(itineraryId, legs, sessionId);
  };

  useEffect(() => {
    const searchParams = location.state;

    const fetchFlightResults = async () => {
      try {
        setIsLoading(true);
        const response = await searchFlight(
          searchParams.originSkyId,
          searchParams.destinationSkyId,
          searchParams.originEntityId,
          searchParams.destinationEntityId,
          searchParams.departureDate,
          searchParams.returnDate,
          searchParams.cabinClass,
          searchParams.adults,
          searchParams.children,
          searchParams.infants
        );

        const sessionId = response.sessionId;
        const flights = response.data.itineraries
          ? response.data.itineraries
          : Array.isArray(response.data)
          ? response.data
          : [response.data];

        setSessionId(sessionId);
        setFlightRes(flights);
      } catch (error) {
        setError("Failed to load flight results");
        console.error("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchParams) {
      fetchFlightResults();
    }
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white font-semibold">
        <p>Searching for flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-white font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold text-white mb-4 ">
        Results for the flights
      </h1>
      {flightRes.length === 0 ? (
        <div className="text-white text-center">No flights found</div>
      ) : (
        flightRes.slice(0, 10).map((flight, index) => {
          const departureInfo = formatFlightDate(flight.legs[0].departure);
          const arrivalInfo = formatFlightDate(flight.legs[0].arrival);

          return (
            <div
              key={index}
              onClick={() => handleFlightClick(flight)}
              className="border border-[#3b3b3b] rounded-lg p-4 mb-4 bg-[#202124]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg text-white">
                    {flight.legs[0].origin.name} (
                    {flight.legs[0].origin.displayCode}) →
                    {flight.legs[0].destination.name} (
                    {flight.legs[0].destination.displayCode})
                  </h2>

                  <div className="flex items-center mt-2">
                    <img
                      src={flight.legs[0].carriers.marketing[0].logoUrl}
                      alt={flight.legs[0].carriers.marketing[0].name}
                      className="w-8 h-8 mr-2"
                    />
                    <span className="text-[#4a4a4a]">
                      {flight.legs[0].carriers.marketing[0].name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {flight.price.formatted}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-[#4a4a4a]">
                <div>
                  <p>
                    {departureInfo.time} {departureInfo.day}
                  </p>
                  <p>
                    {arrivalInfo.time} {arrivalInfo.day}
                  </p>
                </div>
                <div>
                  <p>{formatDuration(flight.legs[0].durationInMinutes)}</p>
                  <p>Stops: {flight.legs[0].stopCount}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FlightResults;
