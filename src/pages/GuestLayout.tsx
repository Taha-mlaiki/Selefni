import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            CréditSim
          </Link>
          <Button asChild>
            <Link to="/simulation">Simuler un crédit</Link>
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
