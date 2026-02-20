import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Car,
  ChevronDown,
  Filter,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { useCarsQuery } from "../lib/queries";

// shadcn UI (you already added these)
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../components/ui/dropdown-menu";

type FilterCategory = "All" | "Economy" | "SUV" | "Sedan";

export default function Cars() {
  const { data, isLoading, isError, error, refetch, isFetching } = useCarsQuery();

  const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS).toLowerCase() === "true";

  const [category, setCategory] = useState<FilterCategory>("All");
  const [transmission, setTransmission] = useState<"All" | "Auto" | "Manual">("All");
  const [seats, setSeats] = useState<"All" | 4 | 5 | 7>("All");

  const cars = data ?? [];

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      const okCat = category === "All" ? true : c.category === category;
      const okTr = transmission === "All" ? true : c.transmission === transmission;
      const okSeats = seats === "All" ? true : c.seats === seats;
      return okCat && okTr && okSeats;
    });
  }, [cars, category, transmission, seats]);

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* French-flag background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid grid-cols-12">
            <div className="col-span-4 bg-brand.blue/[0.10]" />
            <div className="col-span-4 bg-white" />
            <div className="col-span-4 bg-brand.red/[0.10]" />
          </div>

          <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:46px_46px]" />

          <motion.div
            className="absolute -top-48 -left-48 h-[560px] w-[560px] rounded-full bg-brand.blue/25 blur-3xl"
            animate={{ x: [0, 35, 0], y: [0, 18, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-56 -right-56 h-[640px] w-[640px] rounded-full bg-brand.red/20 blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1 text-sm text-black/70 backdrop-blur">
                <Sparkles className="h-4 w-4 text-brand.blue" />
                Fleet • Instant pricing • Fast checkout
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
                <span className="text-brand.blue">Browse</span>{" "}
                <span className="bg-gradient-to-r from-brand.blue via-black to-brand.red bg-clip-text text-transparent">
                  Cars
                </span>
              </h1>

              <p className="mt-2 text-black/60">
                Powered by <span className="font-bold">TanStack Query</span>{" "}
                {USE_MOCKS ? "(mock mode works even without backend)." : "(live backend mode)."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {USE_MOCKS && (
                  <Badge className="rounded-full px-3 py-1 font-black" variant="secondary">
                    MOCK MODE
                  </Badge>
                )}

                {isFetching && (
                  <Badge className="rounded-full px-3 py-1 font-black bg-brand.blue text-white">
                    Updating…
                  </Badge>
                )}

                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/60">
                  <Users className="h-4 w-4 text-brand.red" />
                  3–9 people viewing now (safe mock)
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/60">
                  <MapPin className="h-4 w-4 text-brand.blue" />
                  Mauritius delivery + SSR pickup
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full px-3 py-2 font-black bg-white/80 text-black border border-black/10">
                <Filter className="h-4 w-4 mr-2 text-brand.blue" />
                Filters
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-white/80">
                    Category: <span className="ml-2 font-black">{category}</span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(["All", "Economy", "SUV", "Sedan"] as FilterCategory[]).map((v) => (
                    <DropdownMenuItem key={v} onClick={() => setCategory(v)}>
                      {v}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-white/80">
                    Transmission: <span className="ml-2 font-black">{transmission}</span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(["All", "Auto", "Manual"] as const).map((v) => (
                    <DropdownMenuItem key={v} onClick={() => setTransmission(v)}>
                      {v}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-white/80">
                    Seats: <span className="ml-2 font-black">{String(seats)}</span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(["All", 4, 5, 7] as const).map((v) => (
                    <DropdownMenuItem key={String(v)} onClick={() => setSeats(v)}>
                      {String(v)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => refetch()}
                className="rounded-full font-black text-white"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,87,255,0.95), rgba(255,255,255,0.9), rgba(229,41,57,0.95))"
                }}
              >
                Refresh
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* States */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[210px] rounded-3xl border border-black/10 bg-white/70 animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
              <div className="text-xl font-black text-brand.red">Failed to load cars</div>
              <div className="mt-2 text-black/60 text-sm">
                {(error as Error)?.message ?? "Unknown error"}
              </div>
              <Button onClick={() => refetch()} className="mt-4 rounded-full font-black">
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {filtered.map((c) => (
                  <Card
                    key={c.id}
                    className="rounded-3xl border-black/10 bg-white/80 backdrop-blur hover:shadow-[0_22px_70px_rgba(0,87,255,0.16)] transition"
                  >
                    <CardHeader className="pb-3">
                      {/* image placeholder */}
                      <div className="relative overflow-hidden rounded-2xl border border-black/10">
                        <div className="h-[120px] w-full bg-gradient-to-r from-brand.blue/15 via-white to-brand.red/15" />
                        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:34px_34px]" />
                        <div className="absolute inset-0 grid place-items-center text-xs font-bold text-black/45">
                          Image coming
                        </div>
                      </div>

                      <CardTitle className="mt-4 text-xl font-black text-brand.ink">{c.name}</CardTitle>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full font-bold">
                          {c.category}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full font-bold">
                          {c.transmission}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full font-bold">
                          {c.seats} seats
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xs text-black/50">From</div>
                          <div className="text-2xl font-black text-brand.ink">
                            Rs {c.pricePerDayMUR.toLocaleString()}
                            <span className="text-sm font-bold text-black/50"> /day</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-black/55">
                          <ShieldCheck className="h-4 w-4 text-brand.blue" />
                          Verified
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between">
                      <Button variant="outline" className="rounded-full font-black">
                        Details
                      </Button>

                      <Button
                        className="relative rounded-full font-black text-white overflow-hidden"
                        onClick={() => alert(`Book: ${c.name} (flow later)`)}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#0057FF] via-white to-[#E52939] animate-[gradientMove_4s_linear_infinite]" />
                        <span className="absolute inset-0 bg-black/25" />
                        <span className="relative z-10 inline-flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Book
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="mt-8 rounded-3xl border border-black/10 bg-white/80 p-8 text-center">
                  <div className="text-2xl font-black text-brand.ink">No cars match your filters</div>
                  <p className="mt-2 text-black/60">Try resetting filters to see the full fleet.</p>
                  <Button
                    onClick={() => {
                      setCategory("All");
                      setTransmission("All");
                      setSeats("All");
                    }}
                    className="mt-4 rounded-full font-black"
                  >
                    Reset filters
                  </Button>
                </div>
              )}

              {/* Small conversion footer strip */}
              <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <BadgeCheck className="h-5 w-5 text-brand.red" />
                    <span className="font-bold">No hidden fees.</span> Total shown before checkout.
                  </div>
                  <div className="text-sm text-black/65">
                    Tip: Use <span className="font-black text-brand.blue">SUV</span> for family + luggage at SSR.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}