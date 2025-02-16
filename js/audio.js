// app.js
const clientId = 'e2cbb0b330d241edab3720338d46e7fc'; // Reemplaza con tu Client ID
const redirectUri = 'https://counts-miscelanea.vercel.app/'; // Asegúrate de que coincida con la Redirect URI registrada
const scope = 'user-read-private user-read-email';

// Función para generar un estado aleatorio
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// Iniciar sesión con Spotify
document.getElementById('login').addEventListener('click', () => {
    const state = generateRandomString(16);
    localStorage.setItem('state', state);

    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.location = authUrl;
});

// Obtener el token de acceso de la URL
function getAccessTokenFromUrl() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return hashParams.get('access_token');
}

// Inicializar el reproductor de Spotify
function initializePlayer(accessToken) {
    const player = new Spotify.Player({
        name: 'Reproductor Aleatorio',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
    });

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
}

// Verificar si ya tenemos un token de acceso
const accessToken = getAccessTokenFromUrl();
if (accessToken) {
    // Si ya tenemos el token, inicializamos el reproductor
    document.getElementById('login').style.display = 'none';
    document.getElementById('playRandomTrack').style.display = 'inline-block';
    initializePlayer(accessToken);
} else {
    // Si no tenemos el token, mostramos el botón de login
    document.getElementById('login').style.display = 'inline-block';
    document.getElementById('playRandomTrack').style.display = 'none';
}
