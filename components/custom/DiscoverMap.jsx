"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";
import { ArrowBigUp } from "lucide-react";

// Dynamically import React-Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const DiscoverMap = () => {
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null); // Store map reference
  const [heading, setHeading] = useState(0);

  // Fetch nearby users - can be memoized using useCallback
  const fetchNearbyUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/location");
      if (!res.ok) throw new Error("Failed to fetch nearby users");
      const data = await res.json();
      setNearbyUsers(data || []);
    } catch (error) {
      console.error(error);
      setError("Error fetching nearby users");
    } finally {
      setLoading(false);
    }
  }, []); // Avoiding unnecessary re-renders for fetch

  const updateMyLocationForOthers = useCallback(async (latitude, longitude) => {
    try {
      await fetch("/api/users/location", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            coordinates: [latitude, longitude],
          },
        }),
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      const geoWatchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await updateMyLocationForOthers(latitude, longitude);
          setLocation({ latitude, longitude });
          // fetchNearbyUsers(latitude, longitude);

          // Update the map position directly
          if (mapRef.current) {
            const map = mapRef.current;
            map.setView([latitude, longitude], map.getZoom());
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Location permission denied or error occurred");
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      // Cleanup the watchPosition when the component unmounts
      return () => {
        navigator.geolocation.clearWatch(geoWatchId);
      };
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [updateMyLocationForOthers]); // Adding dependencies to useEffect

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.alpha !== null) {
        setHeading(event.alpha); // Get the compass heading (rotation)
      }
    };

    // Listen to device orientation events
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      // Clean up the event listener when the component is unmounted
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // if (loading) {
  //   return <div className="text-center">Loading map and users...</div>;
  // }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!location) {
    return (
      <div className="text-center">Please enable location permissions.</div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100dvh-200px)] rounded-lg overflow-hidden">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)} // Using useRef to store map object
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* <Marker
          position={[location.latitude, location.longitude]}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `<div class="bg-green-500 text-white font-bold w-12 h-12 flex items-center justify-center rounded-full">
                  Me
                </div>`,
            iconSize: [50, 60],
            iconAnchor: [25, 60],
          })}
        > */}

        <Marker
          position={[location.latitude, location.longitude]}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `
              <div class="bg-green-500 text-white font-bold size-11 flex items-center justify-center rounded-full" 
                   style="transform: rotate(${heading}deg)">
                  <ArrowBigUp/>
              </div>`,
            iconSize: [50, 60],
            iconAnchor: [25, 60],
          })}
        >
          <Popup>You are here!</Popup>
        </Marker>

        {nearbyUsers?.map((user) => (
          <Marker
            key={user._id}
            position={[
              user.location.coordinates[1],
              user.location.coordinates[0],
            ]}
            icon={L.divIcon({
              className: "custom-div-icon",
              html: `
                <div class="flex flex-col items-center">
                  <img 
                    src="${user.image}" 
                    alt="${user.name}" 
                    class="w-12 h-12 rounded-full border-2 border-blue-500" 
                  />
                  <span class="text-sm font-medium text-gray-800">${user.name}</span>
                </div>
              `,
              iconSize: [60, 70],
              iconAnchor: [30, 70],
            })}
          >
            <Popup>
              <div className="p-2">
                <Image
                  width={54}
                  height={54}
                  src={user.image}
                  alt={user.name}
                  className="w-16 h-16 rounded-full mx-auto"
                />
                <h3 className="text-center text-lg font-semibold mt-2">
                  {user.name}
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  {user.email}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DiscoverMap;
