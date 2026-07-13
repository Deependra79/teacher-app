"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(10);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const router = useRouter();

  // 🔐 Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);
    setUser(parsed);
  }, []);

  // 📍 Get location (RUN ONLY ONCE)
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Location fetched");

        setUser((prev) => ({
          ...prev,
          user: {
            ...prev?.user,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
      },
      (err) => {
        console.error("❌ Location error:", err.message);
        alert("Please allow location access to search nearby teachers");
      }
    );
  }, []); // ✅ FIXED (no dependency)

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // 🔍 Search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search) return;

    if (!user?.user?.latitude || !user?.user?.longitude) {
      alert("Location not available. Please allow location.");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: search,
          latitude: user.user.latitude,
          longitude: user.user.longitude,
          radiusKm: radius,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("API failed:", errText);
        setTeachers([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Response:", data);

      setTeachers(data.teachers || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setTeachers([]);
    }

    setLoading(false);
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h1 className="text-lg font-bold">Student Dashboard</h1>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="bg-white text-black px-3 py-1 rounded-full"
          >
            👤
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-md w-64 z-50">
              <p><b>Name:</b> {user?.user?.name}</p>
              <p><b>Email:</b> {user?.user?.email}</p>
              <p><b>Qualification:</b> {user?.user?.qualification}</p>
              <p><b>Role:</b> {user?.role}</p>

              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-500 text-white p-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="p-6">
        <h2 className="text-xl mb-6">
          Welcome, {user?.user?.name}
        </h2>

        {/* 🔍 Search */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by skill (example: Maths, English)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="p-3 border rounded-lg bg-white"
          >
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={20}>Within 20 km</option>
            <option value={50}>Within 50 km</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <p className="text-blue-600 mb-4">Searching teachers...</p>
        )}

        {/* Results */}
        <div className="grid gap-4">

          {/* Show message only AFTER search */}
          {!loading && hasSearched && teachers.length === 0 && (
            <p className="text-gray-500">No teachers found within {radius} km for that skill.</p>
          )}

          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-4 bg-white rounded shadow flex flex-col md:flex-row md:justify-between md:items-center gap-3"
            >
              <div>
                <p className="font-bold">{teacher.name}</p>
                <p className="text-sm text-gray-600">Skill: {teacher.subject}</p>
                <p className="text-sm text-gray-600">Qualification: {teacher.qualification}</p>
                <p className="text-sm text-gray-500">📍 {teacher.distance?.toFixed(2)} km away</p>
                {teacher.address && <p className="text-sm text-gray-500">{teacher.address}</p>}
              </div>

              <button
                onClick={() => router.push(`/chat/${teacher.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}