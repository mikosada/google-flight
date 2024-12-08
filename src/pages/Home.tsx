/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import SimpleMap from "../components/SimpleMap";
import FlightDestinations from "../components/FlightsRec";
import { getLocationId } from "../services/flightServices";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [showPassengers, setShowPassengers] = useState<boolean>(false);

  const [tempAdults, setTempAdults] = useState<number>(adults);
  const [tempChildren, setTempChildren] = useState<number>(children);
  const [tempInfants, setTempInfants] = useState<number>(infants);

  const [departureDate, setDepartureDate] = useState<Dayjs>(dayjs());
  const [returnDate, setReturnDate] = useState<Dayjs>(dayjs().add(1, "day"));

  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");

  const [tripType, setTripType] = useState<string>("round-trip");
  const [travelClass, setTravelClass] = useState<string>("economy");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loc, setLoc] = useState<string>("Jakarta");

  const locations = ["Jakarta", "Bali", "Singapore"];

  const locationCoordinates = {
    Jakarta: [-6.2088, 106.8456],
    Bali: [-8.4095, 115.1889],
    Singapore: [1.3521, 103.8198],
  };

  const togglePassengers = () => {
    if (showPassengers) {
      setTempAdults(adults);
      setTempChildren(children);
      setTempInfants(infants);
    }
    setShowPassengers(!showPassengers);
  };

  const handleDone = () => {
    setAdults(tempAdults);
    setChildren(tempChildren);
    setInfants(tempInfants);
    setShowPassengers(false);
  };

  const handleCancel = () => {
    setTempAdults(adults);
    setTempChildren(children);
    setTempInfants(infants);
    setShowPassengers(false);
  };

  const totalPassengers = () => {
    return adults + children + infants;
  };

  const changeDate = (
    date: Dayjs,
    setDate: React.Dispatch<React.SetStateAction<Dayjs>>,
    increment: boolean
  ) => {
    const newDate = increment ? date.add(1, "day") : date.subtract(1, "day");
    setDate(newDate);
  };

  const handleSearchFlights = async () => {
    try {
      setIsLoading(true);

      if (!fromValue || !toValue) {
        alert("Choose departure and arrival destination");
        return;
      }

      const originLocation = await getLocationId(fromValue);
      const destinationLocation = await getLocationId(toValue);

      const flightSearchParams = {
        originSkyId: originLocation.skyId,
        destinationSkyId: destinationLocation.skyId,
        originEntityId: originLocation.entityId,
        destinationEntityId: destinationLocation.entityId,
        departureDate: departureDate.format("YYYY-MM-DD"),
        ...(tripType === "round-trip" && {
          returnDate: returnDate.format("YYYY-MM-DD"),
        }),
        cabinCLass: travelClass,
        adults,
        children,
        infants,
      };

      navigate("/flight-results", { state: flightSearchParams });
    } catch (error) {
      console.error("Error searching flight: ", error);
      alert("Error searching flight, please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-16">
      {/* Hero Section */}
      <div className="flex flex-col relative items-center w-full">
        <img
          src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg"
          alt="Flights Hero"
          className="w-full h-auto object-cover"
        />
        <p className="absolute bottom-0 left-0 right-0 mb-2 md:mb-5 text-center text-white text-3xl md:text-4xl lg:text-6xl">
          Flights
        </p>
      </div>

      {/* Section 1 */}
      <div className="w-full max-w-4xl flex justify-center mt-8">
        <div className="relative w-full lg:w-auto flex flex-col items-start px-2 lg:px-5 py-2 bg-[#3b3b3b] rounded-xl shadow-xl">
          <div className="flex items-center gap-2 md:gap-5">
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="mb-2 px-2 md:px-5 py-2 bg-[#3b3b3b] text-white"
            >
              <option
                className="text-xs md:text-l font-semibold"
                value="round-trip"
              >
                Round Trip
              </option>
              <option
                className="text-xs md:text-l font-semibold"
                value="one-way"
              >
                One way
              </option>
              <option
                className="text-xs md:text-l font-semibold"
                value="multi-city"
              >
                Multi-city
              </option>
            </select>
            <div className="relative">
              <div
                className="mb-2 p-2 cursor-pointer text-white"
                onClick={togglePassengers}
              >
                {totalPassengers()}
              </div>
              {showPassengers && (
                <div className="absolute flex flex-col bg-[#3b3b3b] px-2 md:px-5 py-2 text-white z-20">
                  <div className="flex justify-between items-center mb-2 gap-4 md:gap-16">
                    <span>Adults</span>
                    <div className="flex items-center gap-6 md:gap-8">
                      <button
                        className="bg-zinc-600 size-10 rounded-xl text-xl font-bold"
                        onClick={() =>
                          setTempAdults(Math.max(1, tempAdults - 1))
                        }
                      >
                        -
                      </button>
                      <span>{tempAdults}</span>
                      <button
                        className="bg-blue-600/20 size-10 rounded-xl text-xl font-bold"
                        onClick={() => setTempAdults(tempAdults + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2 gap-4 md:gap-16">
                    <span>Children</span>
                    <div className="flex items-center gap-6 md:gap-8">
                      <button
                        className="bg-zinc-600 size-10 rounded-xl text-xl font-bold"
                        onClick={() =>
                          setTempChildren(Math.max(0, tempChildren - 1))
                        }
                      >
                        -
                      </button>
                      <span>{tempChildren}</span>
                      <button
                        className="bg-blue-600/20 size-10 rounded-xl text-xl font-bold"
                        onClick={() => setTempChildren(tempChildren + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2 gap-4 md:gap-16">
                    <span>Infants</span>
                    <div className="flex items-center gap-6 md:gap-8">
                      <button
                        className="bg-zinc-600 size-10 rounded-xl text-xl font-bold"
                        onClick={() =>
                          setTempInfants(Math.max(0, tempInfants - 1))
                        }
                      >
                        -
                      </button>
                      <span>{tempInfants}</span>
                      <button
                        className="bg-blue-600/20 size-10 rounded-xl text-xl font-bold"
                        onClick={() => setTempInfants(tempInfants + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2 gap-8 font-semibold">
                    <button
                      className="text-blue-200/90 p-2 rounded"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-blue-200/90 p-2 rounded"
                      onClick={handleDone}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Input class */}
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="mb-2 px-5 py-2 bg-[#3b3b3b] text-white"
            >
              <option className="text-xs md:text-s" value="economy">
                Economy
              </option>
              <option className="text-xs md:text-s" value="business">
                Business
              </option>
              <option className="text-xs md:text-s" value="first">
                First
              </option>
            </select>
          </div>

          {/* Input Lokasi */}
          <div className="w-full lg:w-auto flex flex-col md:flex-row justify-center items-center gap-4 lg:gap-10 mb-5 px-3 py-2 text-white">
            <div className="relative flex items-center justify-between gap-2 md:gap-5 font-semibold">
              <input
                type="text"
                placeholder="From"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="w-5/12 md:w-1/2 lg:w-auto p-2 md:p-4 border-2 border-gray-500 rounded bg-[#3b3b3b] text-white"
              />
              <button
                className="text-gray-500 absolute left-1/2 transform -translate-x-1/2 z-10 p-2 rounded-full bg-[#3b3b3b] border-2 border-gray-500"
                onClick={() => {
                  const temp = fromValue;
                  setFromValue(toValue);
                  setToValue(temp);
                }}
              >
                <HiOutlineSwitchHorizontal className="size-6" />
              </button>
              <input
                type="text"
                placeholder="To"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
                className="w-5/12 md:w-1/2 lg:w-auto p-2 md:p-4 border-2 border-gray-500 rounded bg-[#3b3b3b] text-white"
              />
            </div>
            <div className="flex items-center justify-center gap-2 border-2 border-gray-500 rounded">
              <div className="flex items-center">
                <DatePicker
                  value={departureDate}
                  onChange={(newValue: any) => setDepartureDate(newValue)}
                  className="bg-[#3b3b3b] w-full md:w-40"
                />
                <button
                  onClick={() =>
                    changeDate(departureDate, setDepartureDate, false)
                  }
                  className="text-white font-black mx-2 hidden lg:flex"
                >
                  &lt;
                </button>
                <button
                  onClick={() =>
                    changeDate(departureDate, setDepartureDate, true)
                  }
                  className="text-white font-black mx-2 hidden lg:flex"
                >
                  &gt;
                </button>
              </div>
              <div className="flex items-center">
                <DatePicker
                  value={returnDate}
                  onChange={(newValue: any) => setReturnDate(newValue)}
                  className="bg-[#3b3b3b] w-full md:w-40"
                />
                <button
                  onClick={() => changeDate(returnDate, setReturnDate, false)}
                  className="text-white font-black mx-2 hidden lg:flex"
                >
                  &lt;
                </button>
                <button
                  onClick={() => changeDate(returnDate, setReturnDate, true)}
                  className="text-white font-black mx-2 hidden lg:flex"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
          <div className="absolute flex justify-center left-1/2 transform -translate-x-1/2 z-10 -bottom-5">
            <button
              onClick={handleSearchFlights}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-300 drop-shadow-xl text-gray-950 font-semibold px-4 py-2 rounded-full"
            >
              <IoSearch className="size-5" />
              {isLoading ? <span>Loading...</span> : <span>Explore</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="w-full max-w-4xl mt-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Find cheap flights from {loc} to anywhere
          </h2>

          <div className="flex items-center gap-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setLoc(location)}
                className={`px-4 py-1 border border-gray-500 rounded-full transition-all duration-300 text-white hover:text-blue-300 ${
                  loc === location
                    ? "bg-blue-300/20 text-blue-300 border-blue-300/20"
                    : " text-gray-300 hover:bg-gray-600"
                } `}
              >
                {location}
              </button>
            ))}
          </div>
          <div className="w-full h-[360px] mt-4">
            <SimpleMap
              position={
                locationCoordinates[
                  loc as keyof typeof locationCoordinates
                ] as [number, number]
              }
              locationName={loc}
            />
          </div>
        </div>
        <div className="w-full max-w-4xl mt-4">
          <h2 className="text-2xl font-bold text-white mb-4 p-6">
            Flight Recommendations
          </h2>
          <div className="w-full max-w-4xl mt-8">
            <FlightDestinations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
