document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la carte
    const map = L.map('map').setView([46.603354, 1.888334], 6); // Centre sur la France

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Récupération des logements depuis le serveur
    fetch('/api/logements')
        .then(response => response.json())
        .then(logements => {
            logements.forEach(logement => {
                const marker = L.marker([logement.localisation.lat, logement.localisation.lng])
                    .addTo(map)
                    .bindPopup(`
                        <strong>${logement.titre}</strong><br>
                        ${logement.prix}€ / nuit<br>
                        <a href="/logement/${logement.id}">Voir détails</a>
                    `);
            });
        });
}); 