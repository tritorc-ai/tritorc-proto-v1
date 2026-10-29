"use client";

import { useEffect, useRef } from "react";

export const TRITORC_OFFICES = [
  { city: "Mumbai",    country: "India",   lat: 19.0760, lng: 72.8777 },
  { city: "Pune",      country: "India",   lat: 18.5204, lng: 73.8567 },
  { city: "Ambernath", country: "India",   lat: 19.1972, lng: 73.1927 },
  { city: "Pasadena",  country: "USA",     lat: 29.6911, lng: -95.2091 },
  { city: "Sharjah",   country: "UAE",     lat: 25.3463, lng: 55.4209 },
  { city: "Abu Dhabi", country: "UAE",     lat: 24.4539, lng: 54.3773 },
  { city: "Boumerdes", country: "Algeria", lat: 36.7547, lng: 3.4771  },
  { city: "Muscat",    country: "Oman",    lat: 23.5880, lng: 58.3829 },
  { city: "Edmonton",  country: "Canada",  lat: 53.5461, lng: -113.4938 },
  { city: "Dortmund",  country: "Germany", lat: 51.5136, lng: 7.4653  },
];

const FLAG_CODE: Record<string, string> = {
  India: "in",
  USA: "us",
  UAE: "ae",
  Algeria: "dz",
  Oman: "om",
  Canada: "ca",
  Germany: "de",
};

const MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "AIzaSyDX6psysUiUSa-sIerP9WqbRNYLnsb9cUQ";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initTritorMap?: () => void;
  }
}

interface Props {
  /** City name to pan to and open info window for */
  focusCity?: string | null;
}

export function OfficesMap({ focusCity }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, { marker: any; infoWindow: any }>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openInfoRef = useRef<any>(null);

  useEffect(() => {
    if (mapInstance.current) return;

    function initMap() {
      if (!mapRef.current || !window.google) return;

      // Always apply fresh CSS — remove old tag first so changes take effect
      const existingStyle = document.getElementById("tritorc-iw-style");
      if (existingStyle) existingStyle.remove();
      const s = document.createElement("style");
      s.id = "tritorc-iw-style";
      s.textContent = `
        .gm-style .gm-style-iw-c {
          padding: 7px 10px !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
          min-width: 0 !important;
          max-width: none !important;
        }
        .gm-style .gm-style-iw-d { overflow: hidden !important; padding: 0 !important; }
        .gm-style .gm-style-iw-chr { display: none !important; height: 0 !important; padding: 0 !important; }
        .gm-style button.gm-ui-hover-effect { display: none !important; }
      `;
      document.head.appendChild(s);

      const bounds = new window.google.maps.LatLngBounds();

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 3,
        center: { lat: 25, lng: 45 },
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        styles: [
          // Full grayscale / black-and-white theme
          { elementType: "all", stylers: [{ saturation: -100 }] },
          { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { elementType: "geometry", stylers: [{ lightness: 5 }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#a0a0a0" }] },
          { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }, { lightness: 17 }] },
          { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }] },
          { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 18 }] },
          { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
          { featureType: "poi", elementType: "geometry", stylers: [{ color: "#d4d4d4" }, { lightness: 21 }] },
          { featureType: "administrative", elementType: "geometry.fill", stylers: [{ color: "#c8c8c8" }, { lightness: 20 }] },
          { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#aaaaaa" }, { lightness: 17 }, { weight: 1.2 }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#e8e8e8" }, { lightness: 20 }] },
        ],
      });

      mapInstance.current = map;

      TRITORC_OFFICES.forEach((office) => {
        const position = { lat: office.lat, lng: office.lng };
        bounds.extend(position);

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: office.city + ", " + office.country,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: "#e11d24",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 1.5,
            scale: 1.6,
            anchor: new window.google.maps.Point(12, 22),
          },
        });

        const flagCode = FLAG_CODE[office.country];
        const flagUrl = flagCode
          ? window.location.origin + "/flags/" + flagCode + ".png"
          : null;

        const infoWindow = new window.google.maps.InfoWindow({
          content:
            '<div style="font-family:system-ui,sans-serif;display:flex;align-items:center;gap:7px;white-space:nowrap">' +
            (flagUrl
              ? '<img src="' + flagUrl + '" alt="" style="width:20px;height:14px;object-fit:cover;border-radius:2px;flex-shrink:0;box-shadow:0 0 0 1px rgba(0,0,0,0.1)" />'
              : '') +
            '<span style="font-weight:700;font-size:13px;color:#111;line-height:1">' + office.city + '</span>' +
            '</div>',
          disableAutoPan: true,
        });

        marker.addListener("click", () => {
          if (openInfoRef.current) openInfoRef.current.close();
          infoWindow.open(map, marker);
          openInfoRef.current = infoWindow;
        });

        markersRef.current.set(office.city, { marker, infoWindow });
      });

      map.fitBounds(bounds, { top: 24, right: 24, bottom: 24, left: 24 });
    }

    if (window.google && window.google.maps) {
      initMap();
    } else {
      window.initTritorMap = initMap;
      if (!document.getElementById("tritorc-gmaps-script")) {
        const script = document.createElement("script");
        script.id = "tritorc-gmaps-script";
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + MAPS_API_KEY + "&callback=initTritorMap";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => { delete window.initTritorMap; };
  }, []);

  // Pan to focusCity whenever it changes
  useEffect(() => {
    if (!focusCity || !mapInstance.current) return;
    const entry = markersRef.current.get(focusCity);
    if (!entry) return;
    const map = mapInstance.current;
    // Close any open info window
    if (openInfoRef.current) openInfoRef.current.close();
    map.setZoom(10);
    map.panTo(entry.marker.getPosition());
    entry.infoWindow.open(map, entry.marker);
    openInfoRef.current = entry.infoWindow;
  }, [focusCity]);

  return (
    <div className="mt-4 overflow-hidden rounded-[22px] border border-black/[0.06] shadow-sm">
      <div className="flex items-center gap-2 bg-[#111112] px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e11d24]">
          <svg viewBox="0 0 24 24" fill="white" className="h-3.5 w-3.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </span>
        <span className="text-[13px] font-semibold text-white">Find us near you</span>
        <span className="ml-auto text-[10.5px] text-white/40">10 locations worldwide</span>
      </div>
      <div ref={mapRef} className="h-[260px] w-full bg-[#f0f0f0] tablet:h-[380px] tablet-lg:h-[440px]">
        <div className="flex h-full items-center justify-center text-[12px] text-neutral-400">
          Loading map…
        </div>
      </div>
    </div>
  );
}
