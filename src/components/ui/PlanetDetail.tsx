import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedPlanet } from "../../contexts/SelectedPlanetContext";
import { useCameraContext } from "../../contexts/CameraContext";
import usePlanetData from "../../hooks/usePlanetData";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PlanetDetail: React.FC = () => {
  const [selectedPlanet] = useSelectedPlanet();
  const { cameraState } = useCameraContext();
  const {
    data: planetData,
    isLoading,
    isError,
    error,
  } = usePlanetData(selectedPlanet?.name);

  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // date, city, country
  };

  const shouldDisplayDetails = cameraState === "DETAIL_VIEW";

  return (
    <AnimatePresence>
      {shouldDisplayDetails && (
        <motion.div
          key={selectedPlanet ? selectedPlanet.name : "empty"}
          className="absolute left-5 right-5 top-20 mt-4 w-[400px]"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Formulaire de recherche */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-2">
              <label htmlFor="date" className="block text-sm font-semibold">
                Select Date:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="p-2 w-full border border-gray-300 rounded"
              />
            </div>
            {selectedPlanet?.name === "Earth" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold">Location:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                    className="p-2 flex-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="Country"
                    className="p-2 flex-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </form>

          {/* Détails de la planète */}
          <h1 className="tracking-tight font-semibold text-7xl lg:text-8xl xl:text-8xl opacity-90">
            {selectedPlanet ? selectedPlanet.name : ""}
          </h1>
          <h4 className="tracking-tight text-2xl mb-5 ml-1 text-secondary font-semibold">
            {selectedPlanet?.displayStats.classification}
          </h4>

          <pre>{JSON.stringify(planetData, null, 2)}</pre>
          <ul className="text-sm w-64 ml-2 hidden lg:block text-gray-200">
            <li>
              <p>
                <span className="font-semibold">Orbital Period: </span>
                <span>
                  {selectedPlanet?.displayStats.orbitalPeriod} Earth days
                </span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Mean Distance from Sun: </span>
                <span>
                  {selectedPlanet?.displayStats.meanDistanceFromSun} AU
                </span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Radius: </span>
                <span>{selectedPlanet?.displayStats.accurateRadius} km</span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Mass: </span>
                <span>{selectedPlanet?.displayStats.mass} Earth masses</span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Surface Gravity: </span>
                <span>{selectedPlanet?.displayStats.surfaceGravity} g</span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Rotation Period: </span>
                <span>
                  {selectedPlanet?.displayStats.rotationPeriod} Earth days
                </span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Axial Tilt: </span>
                <span>{selectedPlanet?.displayStats.axialTilt}°</span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Number of Moons: </span>
                <span>{selectedPlanet?.displayStats.numberOfMoons}</span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Atmospheric Composition: </span>
                <span>
                  {selectedPlanet?.displayStats.atmosphericComposition}
                </span>
              </p>
            </li>
            <li>
              <p>
                <span className="font-semibold">Surface Temperature: </span>
                <span>{selectedPlanet?.displayStats.surfaceTemp}</span>
              </p>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanetDetail;
