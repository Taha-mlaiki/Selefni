import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuestLayout from "./pages/GuestLayout";
import AdminLayout from "./pages/AdminLayout";
import Home from "./pages/Home";
import Simulation from "./pages/Simulation";
import ApplicationForm from "./pages/ApplicationForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDetail from "./pages/AdminDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route
            path="/application/:simulationId"
            element={<ApplicationForm />}
          />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:id" element={<AdminDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
