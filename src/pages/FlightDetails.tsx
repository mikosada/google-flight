import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getFlightDetails } from "../services/flightServices";
import dayjs from "dayjs";

const FlightDetails: React.FC = () => {
  const location = useLocation();
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const { itineraryId, legs, sessionId } = location.state || {};
        if (!sessionId) {
          throw new Error("No session ID found");
        }

        const response = await getFlightDetails(itineraryId, legs, sessionId);
        const details = response.itinerary;
        setFlightDetails(details);
        console.log(details);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlightDetails();
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading flight details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        {error}
      </div>
    );
  }

  if (!flightDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        No flight details available
      </div>
    );
  }

  const lowestPriceOption =
    flightDetails.pricingOptions && flightDetails.pricingOptions.length > 0
      ? flightDetails.pricingOptions.reduce((lowest: any, current: any) =>
          lowest.totalPrice < current.totalPrice ? lowest : current
        )
      : null;

  const firstLeg =
    flightDetails.legs && flightDetails.legs.length > 0
      ? flightDetails.legs[0]
      : null;

  const firstSegment =
    firstLeg?.segments && firstLeg.segments.length > 0
      ? firstLeg.segments[0]
      : null;

  if (!firstLeg || !firstSegment || !lowestPriceOption) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Incomplete flight information
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <div className="space-y-6">
        {/* Flight Header */}
        <div className="bg-[#2c2c2c] rounded-lg p-4 md:p-6 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Route Information */}
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-center md:text-left">
                {firstLeg.origin.name} ({firstLeg.origin.displayCode}) →
                {firstLeg.destination.name} ({firstLeg.destination.displayCode})
              </h1>
              <p className="text-gray-400 text-center md:text-left mt-2">
                Direct Flight
              </p>
            </div>

            {/* Pricing */}
            <div className="text-center md:text-right">
              <p className="text-2xl md:text-3xl font-bold text-blue-300">
                {lowestPriceOption.totalPrice} USD
              </p>
              <p className="text-sm text-gray-500">
                Lowest price from {lowestPriceOption.agents[0].name}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Departure Information */}
          <div className="bg-[#2c2c2c] rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Departure</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Airport:</span>
                <span>{firstLeg.origin.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Code:</span>
                <span>{firstLeg.origin.displayCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>
                  {dayjs(firstLeg.departure).format("DD MMM YYYY, HH:mm")}
                </span>
              </div>
            </div>
          </div>

          {/* Arrival Information */}
          <div className="bg-[#2c2c2c] rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Arrival</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Airport:</span>
                <span>{firstLeg.destination.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Code:</span>
                <span>{firstLeg.destination.displayCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>
                  {dayjs(firstLeg.arrival).format("DD MMM YYYY, HH:mm")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          {/* Airline Details */}
          <div className="bg-[#2c2c2c] rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Airline Details
            </h2>
            <div className="flex items-center space-x-4">
              <img
                src={firstSegment.marketingCarrier.logo}
                alt={firstSegment.marketingCarrier.name}
                className="w-12 md:w-16 h-12 md:h-16 object-contain"
              />
              <div>
                <p className="font-bold">
                  {firstSegment.marketingCarrier.name}
                </p>
                <p className="text-sm text-gray-400">
                  Flight Number: {firstSegment.flightNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div className="bg-[#2c2c2c] rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Flight Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{firstLeg.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Stops:</span>
                <span>{firstLeg.stopCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Cabin Class:</span>
                <span>Economy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        {flightDetails.pricingOptions &&
          flightDetails.pricingOptions.length > 0 && (
            <div className="bg-[#2c2c2c] rounded-lg p-4 md:p-6 mt-4">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Booking Options
              </h2>
              <div className="space-y-3">
                {flightDetails.pricingOptions.map(
                  (option: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border-b border-gray-600"
                    >
                      <span>{option.agents[0]?.name || "Unknown Agent"}</span>
                      <span className="font-bold">{option.totalPrice} USD</span>
                      <a
                        href={option.agents[0]?.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Book Now
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default FlightDetails;
