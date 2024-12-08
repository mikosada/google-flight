import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FlightResults from "./pages/FlightResults";
import FlightDetails from "./pages/FlightDetails";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/flight-results" element={<FlightResults />} />
              <Route
                path="/flight-details/:itineraryId"
                element={<FlightDetails />}
              />
            </Routes>
          </LocalizationProvider>
        </main>
      </div>
    </Router>
  );
}

export default App;
