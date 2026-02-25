"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function UserMap({ users }: any) {
    return (
        <div className="h-[400px] rounded-xl overflow-hidden">
            <MapContainer
                center={[20.5937, 78.9629]} // India center
                zoom={5}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {users.map((u: any, i: number) => (
                    <Marker key={i} position={[u.lat, u.lon]}>
                        <Popup>
                            <b>{u.name}</b> <br />
                            {u.city}, {u.country}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}