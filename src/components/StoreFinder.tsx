import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  stores,
  type Store,
  DEFAULT_CENTER,
  haversineDistance,
} from "../data/stores";
import Button from "./Button";

// =====================
// Types
// =====================
interface StoreWithDistance extends Store {
  distance: number;
}

const RADIUS_OPTIONS = [10, 25, 50, 100, 200];

function roundUpToOption(km: number): number {
  return RADIUS_OPTIONS.find((r) => r >= km) ?? RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1];
}

// =====================
// Main Component
// =====================
export default function StoreFinder() {
  // ----- state -----
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const userMarkerRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [radiusKm, setRadiusKm] = useState(50);
  const [filterMunicipio, setFilterMunicipio] = useState<string>("todos");

  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

  // ----- derived: stores with distance -----
  const storesWithDistance: StoreWithDistance[] = useMemo(() => {
    const center = userLocation ?? DEFAULT_CENTER;
    return stores
      .map((s) => ({
        ...s,
        distance: haversineDistance(center.lat, center.lng, s.lat, s.lng),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation]);

  // ----- derived: radius center (centroid of selected city or user location) -----
  const radiusCenter = useMemo(() => {
    if (filterMunicipio === "todos") return userLocation ?? DEFAULT_CENTER;
    const cityStores = stores.filter((s) => s.municipio === filterMunicipio);
    return {
      lat: cityStores.reduce((sum, s) => sum + s.lat, 0) / cityStores.length,
      lng: cityStores.reduce((sum, s) => sum + s.lng, 0) / cityStores.length,
    };
  }, [filterMunicipio, userLocation]);

  // ----- derived: filtered stores -----
  const filteredStores = useMemo(() => {
    let result = storesWithDistance;

    // radius filter (from radiusCenter, not user location)
    result = result.filter(
      (s) =>
        haversineDistance(radiusCenter.lat, radiusCenter.lng, s.lat, s.lng) <=
        radiusKm,
    );

    // municipio filter
    if (filterMunicipio !== "todos") {
      result = result.filter((s) => s.municipio === filterMunicipio);
    }

    // text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.calle.toLowerCase().includes(q) ||
          s.colonia.toLowerCase().includes(q) ||
          s.municipio.toLowerCase().includes(q),
      );
    }

    return result;
  }, [storesWithDistance, radiusKm, radiusCenter, filterMunicipio, searchQuery]);

  // ----- geolocation -----
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation(DEFAULT_CENTER),
      );
    } else {
      setUserLocation(DEFAULT_CENTER);
    }
  }, []);

  // ----- inject marker bounce + modal keyframes -----
  useEffect(() => {
    const styleId = "marker-bounce-keyframes";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes markerBounce {
        0%   { transform: rotate(-45deg) scale(1); }
        30%  { transform: rotate(-45deg) scale(1.45); }
        50%  { transform: rotate(-45deg) scale(1.2); }
        70%  { transform: rotate(-45deg) scale(1.35); }
        100% { transform: rotate(-45deg) scale(1.3); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes modalIn {
        from { opacity: 0; transform: scale(0.9); }
        to   { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // ----- image modal: escape key + body scroll lock -----
  useEffect(() => {
    if (!imageModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setImageModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [imageModalOpen]);

  // ----- load Google Maps script -----
  useEffect(() => {
    if (!apiKey) {
      setMapError("API Key de Google Maps no configurada");
      return;
    }

    // avoid double-loading
    if (window.google?.maps) {
      setIsMapReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapReady(true);
    script.onerror = () => setMapError("Error al cargar Google Maps");
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [apiKey]);

  // ----- create custom marker element -----
  const createStoreMarkerElement = useCallback(
    (isSelected: boolean, isDimmed: boolean) => {
      const el = document.createElement("div");
      const scale = isSelected ? "scale(1.3)" : "scale(1)";
      const shadow = isSelected
        ? "0 8px 24px rgba(0,0,0,0.4), 0 0 0 6px rgba(245,185,50,0.4)"
        : "0 4px 8px rgba(0,0,0,0.3)";
      const opacity = isDimmed ? "0.5" : "1";
      const animation = isSelected
        ? "animation:markerBounce 0.5s ease-out forwards;"
        : "";
      el.innerHTML = `
      <div style="
        width:40px;height:40px;
        background:#f5b932;border:3px solid #2d3e7c;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg) ${scale};
        display:flex;align-items:center;justify-content:center;
        box-shadow:${shadow};
        opacity:${opacity};
        cursor:pointer;transition:transform 0.3s,box-shadow 0.3s,opacity 0.3s;
        ${animation}
      ">
        <span style="transform:rotate(45deg);font-weight:bold;color:#2d3e7c;font-size:14px;">C</span>
      </div>`;
      return el;
    },
    [],
  );

  const createUserMarkerElement = useCallback(() => {
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="
        width:20px;height:20px;
        background:#4285F4;border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 0 6px rgba(66,133,244,0.25), 0 2px 6px rgba(0,0,0,0.3);
      "></div>`;
    return el;
  }, []);

  // ----- initialize map -----
  useEffect(() => {
    if (
      !isMapReady ||
      mapError ||
      !mapRef.current ||
      !userLocation ||
      !window.google
    )
      return;

    const center = userLocation;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center,
      zoom: 11,
      mapId: "construred-store-finder",
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = mapInstance;

    // user marker
    const userMkr = new google.maps.marker.AdvancedMarkerElement({
      map: mapInstance,
      position: center,
      content: createUserMarkerElement(),
      title: "Tu ubicación",
    });
    userMarkerRef.current = userMkr;

    // radius circle
    const circle = new google.maps.Circle({
      map: mapInstance,
      center,
      radius: radiusKm * 1000,
      fillColor: "#f5b932",
      fillOpacity: 0.08,
      strokeColor: "#2d3e7c",
      strokeOpacity: 0.4,
      strokeWeight: 2,
    });
    circleRef.current = circle;

    return () => {
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];
      circle.setMap(null);
      userMkr.map = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady, mapError, userLocation]);

  // ----- sync circle radius + center -----
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(radiusKm * 1000);
      circleRef.current.setCenter(radiusCenter);
    }
  }, [radiusKm, radiusCenter]);

  // ----- sync markers to filteredStores -----
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance || !isMapReady || !window.google) return;

    // remove old markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    const hasSelection = selectedStore !== null && drawerOpen;

    // add new markers
    filteredStores.forEach((store) => {
      const isSelected = hasSelection && store.id === selectedStore?.id;
      const isDimmed = hasSelection && !isSelected;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: { lat: store.lat, lng: store.lng },
        content: createStoreMarkerElement(isSelected, isDimmed),
        title: store.nombre,
        zIndex: isSelected ? 10 : 1,
      });

      marker.addListener("click", () => {
        setSelectedStore(store);
        setDrawerOpen(true);
        mapInstance.panTo({ lat: store.lat, lng: store.lng });
        mapInstance.setZoom(14);
      });

      markersRef.current.push(marker);
    });
  }, [filteredStores, isMapReady, createStoreMarkerElement, selectedStore, drawerOpen]);

  // ----- helpers -----
  const selectStore = useCallback((store: StoreWithDistance) => {
    setSelectedStore(store);
    setDrawerOpen(true);
    const map = mapInstanceRef.current;
    if (map) {
      map.panTo({ lat: store.lat, lng: store.lng });
      map.setZoom(14);
    }
  }, []);

  const handleCityFilter = useCallback(
    (municipio: string) => {
      setFilterMunicipio(municipio);
      const map = mapInstanceRef.current;
      if (!map || !window.google) return;

      if (municipio === "todos") {
        setRadiusKm(50);
        const loc = userLocation ?? DEFAULT_CENTER;
        const nearbyStores = stores.filter(
          (s) => haversineDistance(loc.lat, loc.lng, s.lat, s.lng) <= 50,
        );
        if (nearbyStores.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          nearbyStores.forEach((s) =>
            bounds.extend({ lat: s.lat, lng: s.lng }),
          );
          bounds.extend(loc);
          map.fitBounds(bounds, { top: 80, right: 20, bottom: 20, left: 20 });
        } else {
          map.panTo(loc);
          map.setZoom(11);
        }
      } else {
        const cityStores = stores.filter((s) => s.municipio === municipio);
        const centroid = {
          lat:
            cityStores.reduce((sum, s) => sum + s.lat, 0) / cityStores.length,
          lng:
            cityStores.reduce((sum, s) => sum + s.lng, 0) / cityStores.length,
        };
        const maxDist = Math.max(
          ...cityStores.map((s) =>
            haversineDistance(centroid.lat, centroid.lng, s.lat, s.lng),
          ),
        );
        setRadiusKm(roundUpToOption(Math.ceil(maxDist * 1.2)));
        const bounds = new google.maps.LatLngBounds();
        cityStores.forEach((s) =>
          bounds.extend({ lat: s.lat, lng: s.lng }),
        );
        map.fitBounds(bounds, { top: 80, right: 20, bottom: 20, left: 20 });
      }
    },
    [userLocation],
  );

  const centerOnUser = useCallback(() => {
    const map = mapInstanceRef.current;
    const loc = userLocation ?? DEFAULT_CENTER;
    if (map) {
      setFilterMunicipio("todos");
      setRadiusKm(50);
      map.panTo(loc);
      map.setZoom(11);
    }
  }, [userLocation]);

  // ----- render: map error fallback -----
  if (mapError) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Error Hero */}
        <div className="bg-secondary py-32 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4">
              Buscador de Sucursales
            </h1>
            <p className="text-neutral-300 text-lg mb-6">{mapError}</p>
            <p className="text-neutral-400 text-sm">
              Configura la variable de entorno PUBLIC_GOOGLE_MAPS_API_KEY para
              ver el mapa.
            </p>
          </div>
        </div>

        {/* Store Grid Fallback */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map((store) => (
              <FallbackStoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----- render: main -----
  return (
    <div className="relative min-h-screen bg-neutral-50">
      {/* ===== MAP HERO ===== */}
      <section className="relative" style={{ height: "70vh" }}>
        {/* Map Container */}
        <div
          ref={mapRef}
          className="absolute inset-0"
          style={{ background: "#e5e5e5" }}
        />

        {/* Loading overlay */}
        {(!isMapReady || !userLocation) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/90 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
            <p className="text-white font-display text-xl tracking-wider">
              Cargando mapa...
            </p>
          </div>
        )}

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-20">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center">
              {/* Search icon */}
              <div className="pl-4 pr-2 text-neutral-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar sucursal por nombre, colonia o ciudad..."
                className="flex-1 py-3.5 px-2 text-neutral-800 placeholder-neutral-400 outline-none font-body text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="pr-4 text-neutral-400 hover:text-neutral-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Radius Selector Overlay */}
        <div className="absolute top-20 md:top-4 right-4 z-20">
          <div className="bg-white rounded-lg shadow-xl p-3">
            <label className="block text-xs font-body text-neutral-500 mb-1.5 font-medium">
              Radio de búsqueda
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="bg-neutral-100 rounded px-3 py-2 text-sm font-body text-neutral-800 outline-none cursor-pointer border border-neutral-200 focus:border-primary transition-colors"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} km
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center on User Button */}
        <div className="absolute bottom-4 left-4 z-20 flex gap-2">
          <button
            onClick={centerOnUser}
            className="bg-white p-3 rounded-lg shadow-lg hover:bg-neutral-100 transition-colors"
            aria-label="Centrar en mi ubicación"
          >
            <svg
              className="w-5 h-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Results Count Badge */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-secondary text-white px-4 py-2 rounded-lg shadow-lg font-body text-sm">
            <span className="font-bold text-primary">
              {filteredStores.length}
            </span>{" "}
            {filteredStores.length === 1
              ? "sucursal encontrada"
              : "sucursales encontradas"}
          </div>
        </div>

        {/* ===== SLIDE-IN DRAWER (Desktop: right panel / Mobile: bottom sheet) ===== */}
        {drawerOpen && selectedStore && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={() => { setDrawerOpen(false); setImageModalOpen(false); }}
            />

            {/* Drawer */}
            <div
              className={`
                fixed z-40
                lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-[400px]
                bottom-0 left-0 right-0 max-h-[75vh] lg:max-h-none
                bg-white shadow-2xl
                transform transition-transform duration-300
                overflow-y-auto
                rounded-t-2xl lg:rounded-none
              `}
              style={{ animationFillMode: "forwards" }}
            >
              {/* Mobile drag handle */}
              <div className="lg:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-neutral-300 rounded-full" />
              </div>

              {/* Close button */}
              <button
                onClick={() => { setDrawerOpen(false); setImageModalOpen(false); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors z-10"
                aria-label="Cerrar"
              >
                <svg
                  className="w-5 h-5 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Store Image */}
              <div
                className="relative h-48 lg:h-56 bg-secondary overflow-hidden cursor-pointer group/img"
                onClick={() => setImageModalOpen(true)}
              >
                <img
                  src={selectedStore.imagen}
                  alt={selectedStore.nombre}
                  className="w-full h-full object-cover transition-all duration-500 group-hover/img:scale-110 group-hover/img:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl lg:text-3xl font-display text-white tracking-wider">
                    {selectedStore.nombre}
                  </h3>
                </div>
                {/* Expand hint icon */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Store Details */}
              <div className="p-6 space-y-4">
                {/* Distance badge */}
                {userLocation && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    A{" "}
                    {haversineDistance(
                      userLocation.lat,
                      userLocation.lng,
                      selectedStore.lat,
                      selectedStore.lng,
                    ).toFixed(1)}{" "}
                    km de ti
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/20 flex items-center justify-center shrink-0 rounded">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-neutral-800 text-sm font-medium">
                      {selectedStore.calle}
                    </p>
                    <p className="text-neutral-500 text-sm">
                      Col. {selectedStore.colonia}, {selectedStore.municipio},{" "}
                      {selectedStore.estado}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/20 flex items-center justify-center shrink-0 rounded">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <a
                    href={`tel:${selectedStore.telefono.replace(/\s/g, "")}`}
                    className="text-secondary hover:text-primary transition-colors text-sm font-medium"
                  >
                    {selectedStore.telefono}
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/20 flex items-center justify-center shrink-0 rounded">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    {selectedStore.horario}
                  </p>
                </div>

                {/* Correo */}
                {selectedStore.correo && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/20 flex items-center justify-center shrink-0 rounded">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <a
                      href={`mailto:${selectedStore.correo}`}
                      className="text-secondary hover:text-primary transition-colors text-sm font-medium"
                    >
                      {selectedStore.correo}
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 space-y-3">
                  <Button
                    variant="primary"
                    size="md"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    Cómo Llegar
                  </Button>
                  {selectedStore.whatsapp ? (
                    <a
                      href={`https://wa.me/${selectedStore.whatsapp}?text=${encodeURIComponent(`Hola, me interesa cotizar materiales en ${selectedStore.nombre}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-display font-normal tracking-wider uppercase bg-[#25D366] text-white border-2 border-[#25D366] rounded-md transition-all duration-300 ease-out cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 hover:bg-[#1da851] hover:border-[#1da851] relative overflow-hidden"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Cotizar por Whatsapp
                    </a>
                  ) : selectedStore.correo ? (
                    <Button
                      variant="outline"
                      size="sm"
                      href={`mailto:${selectedStore.correo}?subject=${encodeURIComponent(`Cotización - Construred ${selectedStore.nombre}`)}`}
                      className="w-full"
                    >
                      Cotizar por Correo
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      href={`tel:${selectedStore.telefono.replace(/\s/g, "")}`}
                      className="w-full"
                    >
                      Llamar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ===== STORE LIST SECTION ===== */}
      <section className="py-12 lg:py-20">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="container mx-auto px-4 lg:px-8 pt-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-secondary tracking-wider">
                Nuestras Sucursales
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-12 h-1 bg-primary" />
                <span className="w-3 h-3 bg-primary rotate-45" />
                <span className="w-12 h-1 bg-primary" />
              </div>
            </div>

            {/* Municipio Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {["todos", "Chihuahua", "Cuauhtémoc", "Delicias"].map((m) => (
                <button
                  key={m}
                  onClick={() => handleCityFilter(m)}
                  className={`px-4 py-2 rounded font-display tracking-wider text-sm uppercase transition-all duration-300 border-2 ${
                    filterMunicipio === m
                      ? "bg-primary text-secondary border-primary shadow-industrial-sm"
                      : "bg-transparent text-secondary border-secondary/30 hover:border-secondary hover:bg-secondary/5"
                  }`}
                >
                  {m === "todos" ? "Todas" : m}
                </button>
              ))}
            </div>
          </div>

          {/* Store Cards Grid */}
          {filteredStores.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 text-neutral-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-neutral-500 text-lg font-body">
                No se encontraron sucursales con los filtros seleccionados.
              </p>
              <p className="text-neutral-400 text-sm mt-2 font-body">
                Intenta ampliar el radio de búsqueda o cambiar los filtros.
              </p>
              <button
                onClick={() => {
                  handleCityFilter("todos");
                  setSearchQuery("");
                }}
                className="mt-4 text-primary hover:text-primary-dark font-display tracking-wider transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStores.map((store, idx) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isSelected={selectedStore?.id === store.id}
                  onSelect={() => selectStore(store)}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BACK LINK ===== */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Button variant="outline" size="md" href="/">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al Inicio
          </Button>
        </div>
      </section>

      {/* ===== IMAGE LIGHTBOX MODAL ===== */}
      {imageModalOpen && selectedStore && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen de sucursal"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-[fadeIn_300ms_ease-out_forwards]"
            onClick={() => setImageModalOpen(false)}
          />

          {/* Close button */}
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors duration-200"
            aria-label="Cerrar imagen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={selectedStore.imagen}
            alt={selectedStore.nombre}
            className="relative z-[1] max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl animate-[modalIn_300ms_ease-out_forwards]"
          />
        </div>
      )}
    </div>
  );
}

// =====================
// StoreCard Sub-component
// =====================
function StoreCard({
  store,
  isSelected,
  onSelect,
  index,
}: {
  store: StoreWithDistance;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        group text-left w-full rounded-lg overflow-hidden
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        border-2 bg-white
        ${isSelected ? "border-primary shadow-industrial-sm" : "border-transparent shadow-md hover:border-primary/40"}
        animate-fade-in-up
      `}
      style={{
        animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
        animationFillMode: "forwards",
        opacity: 0,
      }}
    >
      {/* Image */}
      <div className="relative h-40 bg-secondary overflow-hidden">
        <img
          src={store.imagen}
          alt={store.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />

        {/* Distance badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-secondary text-xs font-body font-bold px-2.5 py-1 rounded-full">
          {store.distance.toFixed(1)} km
        </div>

        {/* City badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-primary text-secondary-dark text-xs font-display tracking-wider px-2.5 py-1 rounded">
            {store.municipio}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg text-secondary tracking-wider mb-2 group-hover:text-primary transition-colors">
          {store.nombre}
        </h3>
        <p className="text-neutral-500 text-sm mb-1 font-body">
          {store.calle}, Col. {store.colonia}
        </p>
        <div className="flex items-center gap-2 text-neutral-400 text-xs mt-3 font-body">
          <svg
            className="w-3.5 h-3.5 text-primary shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {store.horario}
        </div>
      </div>
    </button>
  );
}

// =====================
// FallbackStoreCard (no map)
// =====================
function FallbackStoreCard({ store }: { store: Store }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-primary">
      <div className="relative h-40 bg-secondary">
        <img
          src={store.imagen}
          alt={store.nombre}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-secondary tracking-wider mb-2">
          {store.nombre}
        </h3>
        <p className="text-neutral-500 text-sm">
          {store.calle}, Col. {store.colonia}
        </p>
        <p className="text-neutral-400 text-xs mt-1">
          {store.municipio}, {store.estado}
        </p>
        <div className="flex items-center gap-2 text-neutral-400 text-xs mt-3">
          <svg
            className="w-3.5 h-3.5 text-primary shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {store.horario}
        </div>
        <p className="text-primary text-sm mt-2 font-medium">
          {store.telefono}
        </p>
      </div>
    </div>
  );
}
