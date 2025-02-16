// app.js
const clientId = 'e2cbb0b330d241edab3720338d46e7fc'; // Reemplaza con tu Client ID
const redirectUri = 'https://counts-miscelanea.vercel.app'; // Asegúrate de que coincida con la Redirect URI registrada
const accessToken = 'a1e9ca9182e148f18c2d8b586c3a72af'; // Obtén el token de acceso mediante el flujo de autorización

// Cargar el SDK de Spotify
window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Reproductor Aleatorio',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
    });

    // Inicializar el reproductor
    player.connect().then(success => {
        if (success) {
            console.log('Reproductor conectado con éxito');
        }
    });

    // Función para reproducir una pista aleatoria
    document.getElementById('playRandomTrack').addEventListener('click', () => {
        fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        .then(response => response.json())
        .then(data => {
            const artistId = data.items[Math.floor(Math.random() * data.items.length)].id;
            fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })
            .then(response => response.json())
            .then(data => {
                const trackId = data.tracks[Math.floor(Math.random() * data.tracks.length)].id;
                player.play({ uris: [`spotify:track:${trackId}`] });
            });
        });
    });
};
