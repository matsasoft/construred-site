import { useState, useEffect, useRef, useCallback } from "react";
import { type Store, DEFAULT_CENTER, haversineDistance } from "../data/stores";
import Button from "./Button";

export default function GoogleMap({ stores }: { stores: Store[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // Get API key from environment
  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

  // Request user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Chihuahua if location denied
          setUserLocation(DEFAULT_CENTER);
        },
      );
    } else {
      setUserLocation(DEFAULT_CENTER);
    }
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) {
      setError("API Key de Google Maps no configurada");
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setError("Error al cargar Google Maps");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (
      isLoading ||
      error ||
      !mapRef.current ||
      !userLocation ||
      !window.google
    )
      return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 12,
      mapId: "construred-map",
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ saturation: -20 }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    setMap(mapInstance);

    // Add markers for each store
    stores.forEach((store) => {
      const markerElement = document.createElement("div");
      markerElement.className = "construred-marker";
      markerElement.innerHTML = `
                <div style="
                    width: 40px;
                    height: 40px;
                    background: #f5b932;
                    border: 3px solid #2d3e7c;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: transform 0.3s;
                ">
                    <span style="
                        transform: rotate(45deg);
                        font-weight: bold;
                        color: #2d3e7c;
                        font-size: 14px;
                    ">C</span>
                </div>
            `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: { lat: store.lat, lng: store.lng },
        content: markerElement,
        title: store.nombre,
      });

      marker.addListener("click", () => {
        setSelectedStore(store);
        mapInstance.panTo({ lat: store.lat, lng: store.lng });
      });

      markersRef.current.push(marker);
    });

    // Add user location marker if available
    if (userLocation) {
      const userMarkerElement = document.createElement("div");
      userMarkerElement.innerHTML = `
                <div style="
                    width: 20px;
                    height: 20px;
                    background: #4285F4;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                "></div>
            `;

      new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: userLocation,
        content: userMarkerElement,
        title: "Tu ubicación",
      });
    }

    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];
    };
  }, [isLoading, error, userLocation, stores]);

  const centerOnUser = useCallback(() => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(14);
    }
  }, [map, userLocation]);

  const findNearest = useCallback(() => {
    if (!userLocation || stores.length === 0) return;

    let nearest = stores[0];
    let minDistance = Infinity;

    stores.forEach((store) => {
      const distance = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        store.lat,
        store.lng,
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = store;
      }
    });

    setSelectedStore(nearest);
    if (map) {
      map.panTo({ lat: nearest.lat, lng: nearest.lng });
      map.setZoom(15);
    }
  }, [map, userLocation, stores]);

  if (error) {
    return (
      <section
        id="ubicaciones"
        className="py-20 lg:py-32 bg-secondary relative overflow-hidden"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4">
              Encuentra Tu Tienda
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Más cercana a ti
            </p>
            <div className="mt-4 flex items-center gap-2 justify-center">
              <span className="w-12 h-1 bg-primary"></span>
              <span className="w-3 h-3 bg-primary rotate-45"></span>
              <span className="w-12 h-1 bg-primary"></span>
            </div>
          </div>

          <div className="bg-neutral-800/50 rounded-lg p-12 text-center">
            <p className="text-white text-lg mb-4">{error}</p>
            <p className="text-neutral-400">
              Para ver el mapa, configura la variable de entorno
              PUBLIC_GOOGLE_MAPS_API_KEY
            </p>
          </div>

          {/* Store List Fallback */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white/10 backdrop-blur-sm p-6 border-l-4 border-primary"
              >
                <h3 className="text-xl font-display text-white mb-2">
                  {store.nombre}
                </h3>
                <p className="text-neutral-300 text-sm mb-1">
                  {store.direccion}
                </p>
                {store.telefono && (
                  <p className="text-primary text-sm mb-1">{store.telefono}</p>
                )}
                {store.horario && (
                  <p className="text-neutral-400 text-sm">{store.horario}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="primary-flat" size="lg" href="/sucursales">
              Ver Todas las Tiendas
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="ubicaciones"
      className="py-20 lg:py-32 bg-secondary relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full"></div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4">
            Encuentra Tu Tienda
          </h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Más cercana a ti
          </p>
          <div className="mt-4 flex items-center gap-2 justify-center">
            <span className="w-12 h-1 bg-primary"></span>
            <span className="w-3 h-3 bg-primary rotate-45"></span>
            <span className="w-12 h-1 bg-primary"></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2 relative">
            <div
              ref={mapRef}
              className="w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl"
              style={{ background: "#e5e5e5" }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2">
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
              <Button
                variant="primary"
                size="sm"
                onClick={findNearest}
                className="rounded-lg shadow-lg"
              >
                Encontrar Más Cercana
              </Button>
            </div>
          </div>

          {/* Store Info Panel */}
          <div className="space-y-4">
            {selectedStore ? (
              <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary animate-fade-in-up">
                <h3 className="text-2xl font-display text-secondary mb-3">
                  {selectedStore.nombre}
                </h3>
                <div className="space-y-3 text-neutral-600">
                  <p className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 shrink-0"
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
                    {selectedStore.direccion}
                  </p>
                  {selectedStore.telefono && (
                    <p className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-primary shrink-0"
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
                      <a
                        href={`tel:${selectedStore.telefono.replace(/\s/g, "")}`}
                        className="hover:text-primary transition-colors"
                      >
                        {selectedStore.telefono}
                      </a>
                    </p>
                  )}
                  {selectedStore.horario && (
                    <p className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-primary shrink-0"
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
                      {selectedStore.horario}
                    </p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full"
                >
                  Cómo Llegar
                </Button>
                {(selectedStore.whatsapp || selectedStore.telefono) && (
                  <div className="mt-3 flex gap-3">
                    {selectedStore.whatsapp && (
                      <a
                        href={`https://wa.me/${selectedStore.whatsapp}?text=${encodeURIComponent(`Hola, me interesa cotizar materiales en ${selectedStore.nombre}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-display font-normal tracking-wider uppercase bg-[#25D366] text-white border-2 border-[#25D366] rounded-md transition-all duration-300 ease-out cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 hover:bg-[#1da851] hover:border-[#1da851]"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    {selectedStore.telefono && (
                      <Button
                        variant="outline"
                        size="md"
                        href={`tel:${selectedStore.telefono.replace(/\s/g, "")}`}
                        className="flex-1"
                      >
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Llamar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
                <p className="text-white">
                  Selecciona una tienda en el mapa para ver más información
                </p>
              </div>
            )}

            {/* Quick Store List */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <h4 className="text-white font-display text-lg mb-3">
                Todas las tiendas
              </h4>
              <div className="space-y-2">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store);
                      map?.panTo({ lat: store.lat, lng: store.lng });
                      map?.setZoom(15);
                    }}
                    className={`w-full text-left p-3 rounded transition-colors ${
                      selectedStore?.id === store.id
                        ? "bg-primary text-secondary-dark"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <span className="font-display">{store.nombre}</span>
                    <span className="block text-sm opacity-75">
                      {store.direccion}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Link to All Stores */}
            <Button
              variant="primary-flat"
              size="lg"
              href="/sucursales"
              className="w-full rounded-lg"
            >
              Ver Todas las Tiendas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
