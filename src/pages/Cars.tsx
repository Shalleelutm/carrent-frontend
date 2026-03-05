import React, { useMemo, useState } from "react";
import { Car as CarIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useCarsQuery, useMeQuery } from "@/lib/queries";

import { Button } from "@/components/ui/button";
import BookingCalendarModal from "@/components/BookingCalendarModal";
import ProfileRequiredModal from "@/components/ProfileRequiredModal";
import { getToken } from "@/lib/storage";

type FilterCategory = "All" | "Economy" | "SUV" | "Sedan";

export default function Cars() {
  const { data, isLoading, isError, error, refetch } = useCarsQuery();

  const token = getToken();
  const { refetch: refetchMe } = useMeQuery(!!token);

  const [category, setCategory] = useState<FilterCategory>("All");

  const [openCalendar, setOpenCalendar] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  const cars = data ?? [];

  const sortedCars = useMemo(() => {
    return [...cars].sort((a: any, b: any) => {
      const aRec = Number(a.is_featured || 0);
      const bRec = Number(b.is_featured || 0);
      if (bRec !== aRec) return bRec - aRec;
      return Number(a.daily_price || 0) - Number(b.daily_price || 0);
    });
  }, [cars]);

  const filtered = useMemo(() => {
    return sortedCars.filter((c: any) =>
      category === "All" ? true : c.category === category
    );
  }, [sortedCars, category]);

  const onClickBook = async (car: any) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setSelectedCar(car);

    // IMPORTANT: use the returned value from refetchMe()
    const meRes = await refetchMe();
    const me = meRes?.data as any;

    const completed = Number(me?.profile_completed || 0) === 1;

    if (!completed) {
      setOpenProfile(true);
      return;
    }

    setOpenCalendar(true);
  };

  if (isLoading) return <div className="p-10">Loading cars...</div>;

  if (isError)
    return (
      <div className="p-10 text-red-500">
        {(error as Error)?.message}
      </div>
    );

  return (
    <div className="p-10 space-y-8">
      {/* FILTER */}
      <div className="border rounded-2xl p-6 bg-white shadow-sm flex items-end gap-6">
        <div>
          <div className="text-xs font-semibold text-black/60">Category</div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FilterCategory)}
            className="border rounded-xl px-3 py-2"
          >
            <option>All</option>
            <option>Economy</option>
            <option>SUV</option>
            <option>Sedan</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-black/60 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Recommended cars appear first
        </div>
      </div>

      {/* CARS GRID */}
      <div className="grid gap-8 md:grid-cols-3">
        {filtered.map((c: any) => {
          const image = `/cars/${c.image || c.image_url || c.imageUrl || "swift.jpg"}`;

          return (
            <motion.div
              key={c.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="group border rounded-2xl shadow-sm bg-white overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={image}
                  alt={`${c.make} ${c.model}`}
                  className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Plate number */}
                <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded shadow">
                  {c.plate_number || "AM38"}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="text-lg font-bold">
                  {c.make} {c.model}
                </div>

                <div className="text-sm text-black/70">Year: {c.year}</div>
                <div className="text-sm text-black/70">
                  Transmission: {c.transmission}
                </div>
                <div className="text-sm text-black/70">Seats: {c.seats}</div>

                <div className="text-xl font-black pt-2">
                  Rs {Number(c.daily_price || 0).toLocaleString()} /day
                </div>

                {Number(c.is_featured || 0) === 1 && (
                  <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border mt-2">
                    <Sparkles className="h-3 w-3" />
                    Recommended
                  </div>
                )}
              </div>

              <div className="flex justify-between p-5 border-t">
                <Button variant="outline">Details</Button>

                <Button onClick={() => onClickBook(c)}>
                  <CarIcon className="h-4 w-4 mr-2" />
                  Book
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <ProfileRequiredModal
        open={openProfile}
        onOpenChange={setOpenProfile}
        onCompleted={() => {
          setOpenProfile(false);
          setOpenCalendar(true);
        }}
      />

      <BookingCalendarModal
        open={openCalendar}
        onOpenChange={setOpenCalendar}
        car={selectedCar}
        onBooked={async () => {
          // only refetch cars AFTER booking success
          await refetch();
          window.location.href = "/my-bookings";
        }}
      />
    </div>
  );
}