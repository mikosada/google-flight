import { useState } from "react";
import { FaPlane } from "react-icons/fa";
import {
  MdOutlineTravelExplore,
  MdOutlineWbSunny,
  MdPerson,
  MdOutlineMenu,
} from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="shadow-md py-5 px-6 flex items-center justify-between">
      <div className="md:hidden flex flex-row items-center p-1">
        <button onClick={toggleMenu} className="text-white">
          <MdOutlineMenu size={24} />
        </button>
        <span className="text-xl font-semibold text-white mx-5">
          Google Flights
        </span>
        {isOpen && (
          <div
            className={`absolute top-20 left-0 h-full gap-2 pr-5 flex flex-col items-start bg-[#292929] shadow-lg ${
              isOpen ? "inline-flex" : "hidden"
            }`}
          >
            <a
              href="#"
              className="flex items-center text-white px-16 py-2 gap-2 font-bold active:bg-blue-200/20 rounded-r-full"
            >
              <FaPlane className="inline-block mr-1 -rotate-45 text-blue-200" />
              Flights
            </a>
            <a
              href="#"
              className="flex items-center text-white px-16 py-2 gap-2 font-bold active:bg-blue-200/20 rounded-r-full"
            >
              <MdOutlineTravelExplore className="inline-block mr-1 text-blue-200" />
              Explore
            </a>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center space-x-12">
        <span className="text-xl font-semibold text-white">Google Flights</span>
        <div className="hidden md:flex space-x-4">
          <a
            href="#"
            className="flex items-center text-white hover:text-blue-200 border hover:border-blue-200 border-gray-500 rounded-full px-5 py-2 transition-colors font-bold"
          >
            <FaPlane className="inline-block mr-1 -rotate-45 text-blue-200" />
            Flights
          </a>
          <a
            href="#"
            className="flex items-center text-white hover:text-blue-200 border hover:border-blue-200 border-gray-500 rounded-full px-5 py-2 transition-colors font-bold"
          >
            <MdOutlineTravelExplore className="inline-block mr-1 text-blue-200" />
            Explore
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-white p-2 rounded-full hover:bg-gray-200/10 transition-colors">
          <MdOutlineWbSunny className="size-6" />
        </button>
        <button className="text-white p-2 rounded-full hover:bg-gray-200/10 transition-colors">
          <CgMenuGridO className="size-6" />
        </button>
        <div className="text-white p-1 rounded-full hover:bg-gray-200/10 transition-colors">
          <MdPerson className="size-8 bg-green-600 text-white p-2 rounded-full" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
