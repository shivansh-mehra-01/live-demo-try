const socket = io();

// --- GEOLOCATION ---
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            socket.emit("send-location", {
                latitude,
                longitude
            });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// --- MAP ---
const map = L.map("map").setView([0, 0], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

// --- MARKERS ---
const markers = {};

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        // update marker
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // create new marker
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    map.setView([latitude, longitude]);
});
