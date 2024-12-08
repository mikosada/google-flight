import React, { useState, useEffect } from "react";
import {
  searchFlightDestinations,
  FlightDestination,
} from "../services/flightServices";

const FlightDestinations: React.FC = () => {
  const [locations, setLocations] = useState<FlightDestination[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFlightDestinations = async () => {
      try {
        setIsLoading(true);
        const response = await searchFlightDestinations();
        const des = response.results.slice(0, 8);
        setLocations(des);
      } catch (error) {
        console.error("Error fetching flight destinations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlightDestinations();
  }, []);

  if (isLoading) {
    return (
      <div className="text-white text-center py-4">
        Loading flight destinations...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {locations.map((location) => {
          const departureDate = new Date(
            Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          );

          return (
            <div
              key={location.id}
              className="rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={location.content.image.url}
                  alt={location.content.location.name}
                  className="w-full h-24 object-cover"
                />
                {/* Price */}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded">
                  {location.content.flightQuotes?.cheapest.price || "Price N/A"}
                </div>
              </div>

              {/* Flight Details */}
              <div className="p-4 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  {location.content.location.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">
                    {departureDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Destinations Message */}
      {locations.length === 0 && (
        <div className="text-center text-white py-8">
          No flight destinations available
        </div>
      )}
    </div>
  );
};

export default FlightDestinations;
