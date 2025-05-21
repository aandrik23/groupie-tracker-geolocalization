

function initArtistMap(geoCoordinates) {
  const map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];

  for (const loc in geoCoordinates) {
    if (geoCoordinates.hasOwnProperty(loc)) {
      const coord = geoCoordinates[loc];
      markers.push({
        name: loc,
        lat: parseFloat(coord.lat),
        lon: parseFloat(coord.lon)
      });
    }
  }

  const bounds = [];

  markers.forEach(marker => {
    const m = L.marker([marker.lat, marker.lon]).addTo(map);
    m.bindPopup(`<b>${marker.name}</b>`);
    bounds.push([marker.lat, marker.lon]);
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds);
  }
}

window.onload = function() {
  const artistId = document.body.getAttribute('data-artist-id');
  if (!artistId) {
    console.error('No artist ID found on page.');
    return;
  }

  fetch(`/coordinates?id=${artistId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then(data => {
      initArtistMap(data);
    })
    .catch(err => {
      console.error('Failed to load coordinates:', err);
    });
};
