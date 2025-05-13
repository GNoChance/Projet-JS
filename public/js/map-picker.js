document.addEventListener('DOMContentLoaded', function() {
    // Coordonnées par défaut (centre de la France)
    const defaultPosition = [46.603354, 1.888334];
    
    // Initialisation de la carte
    const map = L.map('map-picker').setView(defaultPosition, 6);
    let marker = null;

    // Ajout du fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fonction pour mettre à jour le marqueur et les champs
    function updateLocation(latlng) {
        const lat = latlng.lat.toFixed(6);
        const lng = latlng.lng.toFixed(6);

        // Mise à jour des champs de formulaire
        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;

        // Mise à jour du marqueur
        if (marker) {
            marker.setLatLng(latlng);
        } else {
            marker = L.marker(latlng).addTo(map);
        }
    }

    // Gestionnaire de clic sur la carte
    map.on('click', function(e) {
        updateLocation(e.latlng);
    });

    // Gérer les changements manuels des champs lat/lng
    document.getElementById('lat').addEventListener('change', updateFromFields);
    document.getElementById('lng').addEventListener('change', updateFromFields);

    function updateFromFields() {
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            const newLatLng = L.latLng(lat, lng);
            updateLocation(newLatLng);
            map.setView(newLatLng, map.getZoom());
        }
    }

    // Essayer de géolocaliser l'utilisateur
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = [position.coords.latitude, position.coords.longitude];
            map.setView(userLocation, 13);
            updateLocation(L.latLng(userLocation));
        });
    }

    // Forcer un rafraîchissement de la carte après le chargement
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}); 