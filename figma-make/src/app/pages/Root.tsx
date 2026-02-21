import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Toaster } from "../components/ui/sonner";

export default function Root() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}