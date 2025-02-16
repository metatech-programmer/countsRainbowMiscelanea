document.getElementById('loginButton').addEventListener('click', () => {
    const clientId = 'e2cbb0b330d241edab3720338d46e7fc'; // Reemplaza con tu Client ID
    const redirectUri = 'https://counts-miscelanea.vercel.app/'; // Asegúrate de que coincida con la Redirect URI registrada
    const scopes = 'user-read-private user-read-email';
    const state = generateRandomString(16);
    localStorage.setItem('state', state);

    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(clientId)}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;
    window.location.href = authUrl;
});

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

window.onload = () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const storedState = localStorage.getItem('state');

    if (accessToken && state === storedState) {
        localStorage.setItem('spotifyAccessToken', accessToken);
        window.location.hash = '';
        fetchUserProfile(accessToken);
    } else {
        console.error('Error de autenticación o estado inválido.');
    }
};

function fetchUserProfile(accessToken) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('userName').textContent = `Nombre: ${data.display_name}`;
        if (data.images && data.images.length > 0) {
            document.getElementById('userImage').src = data.images[0].url;
        }
        document.getElementById('userProfile').style.display = 'block';
    })
    .catch(error => {
        console.error('Error al obtener la información del usuario:', error);
    });
}
