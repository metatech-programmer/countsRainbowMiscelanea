// ─── RADIO STATION CATALOG ────────────────────────────────────────────────────
// All streams use CDN-backed, stable endpoints. StreamTheWorld redirects are
// preferred for major stations as they handle geo-failover automatically.

export const STATIONS = [
  // ══════════════════════════════════════════════════════════════════════════
  // COLOMBIA
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'co-los40',      name: 'Los 40 Colombia',      country: 'CO', city: 'Bogotá',           genre: 'Pop/Hits',    flag: '🇨🇴', color: '#e11d48', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_CO_SC' },
  { id: 'co-caracol',    name: 'Caracol Radio',         country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CARACOLRADIOBOG_SC' },
  { id: 'co-olimpica',   name: 'Olímpica Estéreo',      country: 'CO', city: 'Bogotá',           genre: 'Tropical',    flag: '🇨🇴', color: '#059669', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OLIMPICA_STS_SC' },
  { id: 'co-lafm',       name: 'La FM',                 country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#2563eb', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LA_FM_SC' },
  { id: 'co-rcn',        name: 'RCN Radio',             country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RCNRADIOBOG_SC' },
  { id: 'co-tropicana',  name: 'Tropicana',             country: 'CO', city: 'Cali',             genre: 'Tropical',    flag: '🇨🇴', color: '#d97706', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/TROPICANA_CAL_SC' },
  { id: 'co-radionica',  name: 'Radiónica',             country: 'CO', city: 'Bogotá',           genre: 'Alternativo', flag: '🇨🇴', color: '#0891b2', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIONICA_SC' },
  { id: 'co-vibra',      name: 'Vibra',                 country: 'CO', city: 'Bogotá',           genre: 'Pop/Hits',    flag: '🇨🇴', color: '#db2777', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIBRA_BOG_SC' },
  { id: 'co-oxigeno',    name: 'Oxígeno',               country: 'CO', city: 'Bogotá',           genre: 'Rock',        flag: '🇨🇴', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OXIGENO_SC' },
  { id: 'co-blu',        name: 'BLU Radio',             country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BLURADIO_SC' },
  { id: 'co-luna',       name: 'Luna Estéreo',          country: 'CO', city: 'Bogotá',           genre: 'Baladas',     flag: '🇨🇴', color: '#9333ea', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LUNA_SC' },
  { id: 'co-javeriana',  name: 'Javeriana Estéreo',     country: 'CO', city: 'Bogotá',           genre: 'Cultural',    flag: '🇨🇴', color: '#0369a1', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JAVERIANAESTEREO_SC' },
  { id: 'co-w',          name: 'W Radio',               country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WRADIO_SC' },
  { id: 'co-besame',     name: 'Bésame',                country: 'CO', city: 'Bogotá',           genre: 'Romántica',   flag: '🇨🇴', color: '#be185d', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BESAME_SC' },
  { id: 'co-la960',      name: 'La 96.0',               country: 'CO', city: 'Medellín',         genre: 'Pop/Hits',    flag: '🇨🇴', color: '#f97316', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LA960_SC' },
  { id: 'co-amor',       name: 'Amor Estéreo',          country: 'CO', city: 'Bogotá',           genre: 'Romántica',   flag: '🇨🇴', color: '#ec4899', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/AMOR_SC' },
  { id: 'co-minuto',     name: 'Minuto de Dios',        country: 'CO', city: 'Bogotá',           genre: 'Gospel',      flag: '🇨🇴', color: '#0ea5e9', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MINUTODEDIOS_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // MEXICO
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'mx-los40',      name: 'Los 40 Mexico',         country: 'MX', city: 'Ciudad de México', genre: 'Pop/Hits',    flag: '🇲🇽', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40MEX_SC' },
  { id: 'mx-rock101',    name: 'Rock 101',              country: 'MX', city: 'Ciudad de México', genre: 'Rock',        flag: '🇲🇽', color: '#dc2626', stream: 'https://14253.live.streamtheworld.com/ROCK101_SC' },
  { id: 'mx-exa',        name: 'Exa FM',                country: 'MX', city: 'Ciudad de México', genre: 'Pop',         flag: '🇲🇽', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/EXAFM_SC' },
  { id: 'mx-formula',    name: 'Radio Fórmula',         country: 'MX', city: 'Ciudad de México', genre: 'Noticias',    flag: '🇲🇽', color: '#0284c7', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOFORMULAM_SC' },
  { id: 'mx-reactor',    name: 'Reactor 105',           country: 'MX', city: 'Ciudad de México', genre: 'Alternativo', flag: '🇲🇽', color: '#ea580c', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/XHIMS_FMAAC_SC' },
  { id: 'mx-horizonte',  name: 'Horizonte 107.9',       country: 'MX', city: 'Ciudad de México', genre: 'Jazz/Blues',  flag: '🇲🇽', color: '#0891b2', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/XHRED_FMAAC_SC' },
  { id: 'mx-mvs',        name: 'MVS Radio',             country: 'MX', city: 'Ciudad de México', genre: 'Noticias',    flag: '🇲🇽', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MVSNEWS_SC' },
  { id: 'mx-vive',       name: 'Vive 93.7',             country: 'MX', city: 'Ciudad de México', genre: 'Alternativo', flag: '🇲🇽', color: '#059669', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/XHVIVE_FMAAC_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARGENTINA
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'ar-mitre',      name: 'Radio Mitre',           country: 'AR', city: 'Buenos Aires',     genre: 'Noticias',    flag: '🇦🇷', color: '#dc2626', stream: 'https://streaming.radios.com.ar/mitre' },
  { id: 'ar-la100',      name: 'La 100',                country: 'AR', city: 'Buenos Aires',     genre: 'Pop',         flag: '🇦🇷', color: '#db2777', stream: 'https://streaming.radios.com.ar/la100' },
  { id: 'ar-nacional',   name: 'Radio Nacional',        country: 'AR', city: 'Buenos Aires',     genre: 'Cultural',    flag: '🇦🇷', color: '#15803d', stream: 'https://streaming.radios.com.ar/nacional' },
  { id: 'ar-metro',      name: 'Metro 95.1',            country: 'AR', city: 'Buenos Aires',     genre: 'Pop/Hits',    flag: '🇦🇷', color: '#7c3aed', stream: 'https://streaming.radios.com.ar/metro' },
  { id: 'ar-vorterix',   name: 'Vorterix',              country: 'AR', city: 'Buenos Aires',     genre: 'Rock',        flag: '🇦🇷', color: '#dc2626', stream: 'https://streaming.radios.com.ar/vorterix' },
  { id: 'ar-cienluego',  name: 'Los 40 Argentina',      country: 'AR', city: 'Buenos Aires',     genre: 'Pop/Hits',    flag: '🇦🇷', color: '#e11d48', stream: 'https://streaming.radios.com.ar/los40' },

  // ══════════════════════════════════════════════════════════════════════════
  // CHILE
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'cl-biobio',     name: 'Bío Bío Radio',         country: 'CL', city: 'Santiago',         genre: 'Noticias',    flag: '🇨🇱', color: '#b45309', stream: 'https://unlimited3-cl.dps.live/biobio/aac/icecast.audio' },
  { id: 'cl-horizonte',  name: 'Horizonte Chile',       country: 'CL', city: 'Santiago',         genre: 'Rock',        flag: '🇨🇱', color: '#dc2626', stream: 'https://unlimited1-cl.dps.live/horizonte/aac/icecast.audio' },
  { id: 'cl-futuro',     name: 'Futuro FM',             country: 'CL', city: 'Santiago',         genre: 'Pop',         flag: '🇨🇱', color: '#16a34a', stream: 'https://unlimited2-cl.dps.live/futuro/aac/icecast.audio' },
  { id: 'cl-los40',      name: 'Los 40 Chile',          country: 'CL', city: 'Santiago',         genre: 'Pop/Hits',    flag: '🇨🇱', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_CL_SC' },
  { id: 'cl-oasis',      name: 'Oasis FM',              country: 'CL', city: 'Santiago',         genre: 'Pop Clásico', flag: '🇨🇱', color: '#0891b2', stream: 'https://unlimited4-cl.dps.live/oasis/aac/icecast.audio' },

  // ══════════════════════════════════════════════════════════════════════════
  // PERU
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'pe-moda',       name: 'Radio Moda',            country: 'PE', city: 'Lima',             genre: 'Pop',         flag: '🇵🇪', color: '#9333ea', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOMODA_SC' },
  { id: 'pe-studio92',   name: 'Studio 92',             country: 'PE', city: 'Lima',             genre: 'Pop/Hits',    flag: '🇵🇪', color: '#0284c7', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/STUDIO92_SC' },
  { id: 'pe-oxigeno',    name: 'Oxígeno Perú',          country: 'PE', city: 'Lima',             genre: 'Electrónica', flag: '🇵🇪', color: '#0d9488', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OXIGENOPERU_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // VENEZUELA / ECUADOR / URUGUAY / OTROS LATAM
  // ══════════════════════════════════════════════════════════════════════════
  { id: 've-hits',       name: 'Hits Venezuela',        country: 'VE', city: 'Caracas',          genre: 'Pop/Hits',    flag: '🇻🇪', color: '#ea580c', stream: 'https://s1.viastreaming.net:8060/stream' },
  { id: 'uy-sport890',   name: 'Sport 890',             country: 'UY', city: 'Montevideo',       genre: 'Deportes',    flag: '🇺🇾', color: '#1d4ed8', stream: 'https://icecast.sport890.com.uy/sport890' },
  { id: 'do-z101',       name: 'Z101 FM',               country: 'DO', city: 'Santo Domingo',    genre: 'Pop/Hits',    flag: '🇩🇴', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/Z101FM_SC' },
  { id: 'cr-columbia',   name: 'Radio Columbia',        country: 'CR', city: 'San José',         genre: 'Pop/Hits',    flag: '🇨🇷', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/COLUMBIA_CR_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // BRASIL
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'br-jovempan',   name: 'Jovem Pan News',        country: 'BR', city: 'São Paulo',        genre: 'Noticias',    flag: '🇧🇷', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOVEMPANNEWSSC' },
  { id: 'br-89fm',       name: '89 FM Rock',            country: 'BR', city: 'São Paulo',        genre: 'Rock',        flag: '🇧🇷', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/89FM_SC' },
  { id: 'br-bandnews',   name: 'BandNews FM',           country: 'BR', city: 'São Paulo',        genre: 'Noticias',    flag: '🇧🇷', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDNEWSFM_SC' },
  { id: 'br-antena1',    name: 'Antena 1',              country: 'BR', city: 'São Paulo',        genre: 'Baladas',     flag: '🇧🇷', color: '#9333ea', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ANTENA1_SC' },
  { id: 'br-mix',        name: 'Mix FM Brasil',         country: 'BR', city: 'São Paulo',        genre: 'Pop/Hits',    flag: '🇧🇷', color: '#ea580c', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MIXFM_SP_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // ESPAÑA
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'es-cadena100',  name: 'Cadena 100',            country: 'ES', city: 'Madrid',           genre: 'Pop/Hits',    flag: '🇪🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CADENA100_SC' },
  { id: 'es-los40',      name: 'Los 40 España',         country: 'ES', city: 'Madrid',           genre: 'Pop/Hits',    flag: '🇪🇸', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_SC' },
  { id: 'es-ser',        name: 'Cadena SER',            country: 'ES', city: 'Madrid',           genre: 'Noticias',    flag: '🇪🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SER_SC' },
  { id: 'es-rockfm',     name: 'Rock FM España',        country: 'ES', city: 'Madrid',           genre: 'Rock',        flag: '🇪🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ROCKFM_SC' },
  { id: 'es-ondacero',   name: 'Onda Cero',             country: 'ES', city: 'Madrid',           genre: 'Noticias',    flag: '🇪🇸', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ONDACERO_SC' },
  { id: 'es-cope',       name: 'COPE',                  country: 'ES', city: 'Madrid',           genre: 'Noticias',    flag: '🇪🇸', color: '#1d4ed8', stream: 'https://cope.akamaized.net/cope/live/audio/master.m3u8' },
  { id: 'es-energy',     name: 'Energy España',         country: 'ES', city: 'Madrid',           genre: 'Electrónica', flag: '🇪🇸', color: '#f97316', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ENERGY_ES_SC' },
  { id: 'es-dial',       name: 'Cadena Dial',           country: 'ES', city: 'Madrid',           genre: 'Romántica',   flag: '🇪🇸', color: '#be185d', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/DIAL_SC' },
  { id: 'es-rac1',       name: 'RAC1',                  country: 'ES', city: 'Barcelona',        genre: 'Noticias',    flag: '🇪🇸', color: '#ea580c', stream: 'https://streaming.rac.cat/rac1' },
  { id: 'es-flaix',      name: 'Flaix FM',              country: 'ES', city: 'Barcelona',        genre: 'Electrónica', flag: '🇪🇸', color: '#0891b2', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/FLAIXFM_SC' },
  { id: 'es-melodia',    name: 'Melodía FM',            country: 'ES', city: 'Madrid',           genre: 'Pop Clásico', flag: '🇪🇸', color: '#9333ea', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MELODIA_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // REINO UNIDO
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'uk-bbc1',       name: 'BBC Radio 1',           country: 'GB', city: 'Londres',          genre: 'Pop/Hits',    flag: '🇬🇧', color: '#1d4ed8', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one' },
  { id: 'uk-bbc2',       name: 'BBC Radio 2',           country: 'GB', city: 'Londres',          genre: 'Pop Clásico', flag: '🇬🇧', color: '#16a34a', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two' },
  { id: 'uk-bbc3',       name: 'BBC Radio 3',           country: 'GB', city: 'Londres',          genre: 'Clásica',     flag: '🇬🇧', color: '#7c3aed', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three' },
  { id: 'uk-bbc4',       name: 'BBC Radio 4',           country: 'GB', city: 'Londres',          genre: 'Noticias',    flag: '🇬🇧', color: '#b45309', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm' },
  { id: 'uk-bbc6',       name: 'BBC Radio 6 Music',     country: 'GB', city: 'Londres',          genre: 'Alternativo', flag: '🇬🇧', color: '#059669', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_6music' },
  { id: 'uk-kiss',       name: 'Kiss FM UK',            country: 'GB', city: 'Londres',          genre: 'Dance/R&B',   flag: '🇬🇧', color: '#db2777', stream: 'https://icecast.thisisdax.com/KissFMUKMP3' },
  { id: 'uk-absolute',   name: 'Absolute Radio',        country: 'GB', city: 'Londres',          genre: 'Rock',        flag: '🇬🇧', color: '#ea580c', stream: 'https://icecast.absoluteradio.co.uk/absoluteradio.mp3' },
  { id: 'uk-talksport',  name: 'talkSPORT',             country: 'GB', city: 'Londres',          genre: 'Deportes',    flag: '🇬🇧', color: '#15803d', stream: 'https://stream.talksport.com/radio/aac/talksport' },
  { id: 'uk-smooth',     name: 'Smooth Radio',          country: 'GB', city: 'Londres',          genre: 'Romántica',   flag: '🇬🇧', color: '#0369a1', stream: 'https://icecast.thisisdax.com/SmoothUKMP3' },

  // ══════════════════════════════════════════════════════════════════════════
  // ESTADOS UNIDOS
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'us-npr',        name: 'NPR News',              country: 'US', city: 'Washington',       genre: 'Noticias',    flag: '🇺🇸', color: '#1d4ed8', stream: 'https://npr-ice.streamguys1.com/live.mp3' },
  { id: 'us-wqxr',       name: 'WQXR Classical',        country: 'US', city: 'New York',         genre: 'Clásica',     flag: '🇺🇸', color: '#7c3aed', stream: 'https://stream.wqxr.org/wqxr' },
  { id: 'us-z100',       name: 'Z100 New York',         country: 'US', city: 'New York',         genre: 'Pop/Hits',    flag: '🇺🇸', color: '#db2777', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WHTZ_FM_SC' },
  { id: 'us-power105',   name: 'Power 105.1',           country: 'US', city: 'New York',         genre: 'Hip-Hop/R&B', flag: '🇺🇸', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WWPR_FMAAC_SC' },
  { id: 'us-kroq',       name: 'KROQ 106.7',            country: 'US', city: 'Los Angeles',      genre: 'Alternativo', flag: '🇺🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KROQFMAAC_SC' },
  { id: 'us-espn',       name: 'ESPN Radio',            country: 'US', city: 'New York',         genre: 'Deportes',    flag: '🇺🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ESPNRADIOSCAAC' },
  { id: 'us-kexp',       name: 'KEXP Seattle',          country: 'US', city: 'Seattle',          genre: 'Alternativo', flag: '🇺🇸', color: '#15803d', stream: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
  { id: 'us-kcrw',       name: 'KCRW Santa Mónica',     country: 'US', city: 'Los Angeles',      genre: 'Alternativo', flag: '🇺🇸', color: '#0369a1', stream: 'https://kcrw.streamguys1.com/kcrw_music.aac' },
  { id: 'us-wbez',       name: 'WBEZ Chicago',          country: 'US', city: 'Chicago',          genre: 'Cultural',    flag: '🇺🇸', color: '#0891b2', stream: 'https://wbez.streamguys1.com/wbez64.aac' },
  { id: 'us-country',    name: 'KISS Country',          country: 'US', city: 'Nashville',        genre: 'Country',     flag: '🇺🇸', color: '#b45309', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WSIX_FM_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPA — FRANCE
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'fr-fip',        name: 'FIP',                   country: 'FR', city: 'París',            genre: 'Jazz/Blues',  flag: '🇫🇷', color: '#1d4ed8', stream: 'https://icecast.radiofrance.fr/fip-midfi.mp3' },
  { id: 'fr-nrj',        name: 'NRJ France',            country: 'FR', city: 'París',            genre: 'Pop/Dance',   flag: '🇫🇷', color: '#ea580c', stream: 'https://scdn.nrjaudio.fm/fr/30001/mp3_128' },
  { id: 'fr-mouv',       name: "Mouv'",                 country: 'FR', city: 'París',            genre: 'Hip-Hop',     flag: '🇫🇷', color: '#7c3aed', stream: 'https://icecast.radiofrance.fr/mouv-midfi.mp3' },
  { id: 'fr-rtl',        name: 'RTL France',            country: 'FR', city: 'París',            genre: 'Noticias',    flag: '🇫🇷', color: '#dc2626', stream: 'https://streamer.rtl.fr/rtl-1-44-128' },
  { id: 'fr-nova',       name: 'Radio Nova',            country: 'FR', city: 'París',            genre: 'Electrónica', flag: '🇫🇷', color: '#0891b2', stream: 'https://nova.streamakaci.com/nova.mp3' },

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPA — GERMANY
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'de-ndr',        name: 'NDR Info',              country: 'DE', city: 'Hamburgo',         genre: 'Noticias',    flag: '🇩🇪', color: '#1d4ed8', stream: 'https://icecast.ndr.de/ndr/ndrinfo/hamburg/mp3/128/stream.mp3' },
  { id: 'de-dlf',        name: 'Deutschlandfunk',       country: 'DE', city: 'Berlín',           genre: 'Cultural',    flag: '🇩🇪', color: '#15803d', stream: 'https://st01.sslstream.dlf.de/dlf/01/high/aac/stream.aac' },
  { id: 'de-radioeins',  name: 'radioeins',             country: 'DE', city: 'Berlín',           genre: 'Alternativo', flag: '🇩🇪', color: '#7c3aed', stream: 'https://radioeins.de/livemp3' },
  { id: 'de-fritz',      name: 'Fritz',                 country: 'DE', city: 'Berlín',           genre: 'Alternativo', flag: '🇩🇪', color: '#ea580c', stream: 'https://fritz.de/livemp3' },

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPA — ITALY / PORTUGAL / NETHERLANDS / OTHER
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'it-rai1',       name: 'RAI Radio 1',           country: 'IT', city: 'Roma',             genre: 'Variado',     flag: '🇮🇹', color: '#15803d', stream: 'https://icecast.unitedradio.it/Radio1.mp3' },
  { id: 'it-rai2',       name: 'RAI Radio 2',           country: 'IT', city: 'Roma',             genre: 'Pop',         flag: '🇮🇹', color: '#dc2626', stream: 'https://icecast.unitedradio.it/Radio2.mp3' },
  { id: 'it-m2o',        name: 'Radio m2o',             country: 'IT', city: 'Roma',             genre: 'Electrónica', flag: '🇮🇹', color: '#0891b2', stream: 'https://icecast.unitedradio.it/m2o.mp3' },
  { id: 'pt-antena1',    name: 'Antena 1 Portugal',     country: 'PT', city: 'Lisboa',           genre: 'Variado',     flag: '🇵🇹', color: '#dc2626', stream: 'https://streaming.rtp.pt/liveradio/antena1' },
  { id: 'nl-538',        name: 'Radio 538',             country: 'NL', city: 'Amsterdam',        genre: 'Pop/Dance',   flag: '🇳🇱', color: '#ea580c', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538' },
  { id: 'nl-3fm',        name: 'NPO 3FM',               country: 'NL', city: 'Amsterdam',        genre: 'Alternativo', flag: '🇳🇱', color: '#1d4ed8', stream: 'https://icecast.omroep.nl/3fm-sb-mp3' },
  { id: 'be-mnm',        name: 'MNM',                   country: 'BE', city: 'Bruselas',         genre: 'Pop',         flag: '🇧🇪', color: '#dc2626', stream: 'https://icecast.vrtcdn.be/mnm-high.mp3' },
  { id: 'ch-srf3',       name: 'SRF 3',                 country: 'CH', city: 'Zúrich',           genre: 'Pop',         flag: '🇨🇭', color: '#dc2626', stream: 'https://stream.srg-ssr.ch/m/srf3/mp3_128' },
  { id: 'at-oe3',        name: 'Ö3',                    country: 'AT', city: 'Viena',            genre: 'Pop/Hits',    flag: '🇦🇹', color: '#dc2626', stream: 'https://orf-live.ors-shoutcast.at/oe3-q2a' },
  { id: 'se-p3',         name: 'P3 Sverige',            country: 'SE', city: 'Estocolmo',        genre: 'Pop',         flag: '🇸🇪', color: '#1d4ed8', stream: 'https://sverigesradio.se/topsy/direkt/164-hi.mp3' },
  { id: 'no-nrk',        name: 'NRK P3',                country: 'NO', city: 'Oslo',             genre: 'Pop',         flag: '🇳🇴', color: '#dc2626', stream: 'https://lyd.nrk.no/nrk_radio_p3_mp3_h' },
  { id: 'dk-dr1',        name: 'DR P1',                 country: 'DK', city: 'Copenhague',       genre: 'Noticias',    flag: '🇩🇰', color: '#dc2626', stream: 'https://live-icy.gss.dr.dk/A/A05H.mp3' },
  { id: 'fi-yle',        name: 'Yle Radio 1',           country: 'FI', city: 'Helsinki',         genre: 'Cultural',    flag: '🇫🇮', color: '#1d4ed8', stream: 'https://icecast.yle.fi/radio1.mp3' },
  { id: 'pl-trojka',     name: 'Polskie Radio 3',       country: 'PL', city: 'Varsovia',         genre: 'Cultural',    flag: '🇵🇱', color: '#dc2626', stream: 'https://stream85.polskieradio.pl/pr3/pr3.mp3' },
  { id: 'gr-skai',       name: 'Skai Radio',            country: 'GR', city: 'Atenas',           genre: 'Pop',         flag: '🇬🇷', color: '#1d4ed8', stream: 'https://skai.livemedia.gr/skai' },
  { id: 'ro-kiss',       name: 'Kiss FM Romania',       country: 'RO', city: 'Bucarest',         genre: 'Pop',         flag: '🇷🇴', color: '#dc2626', stream: 'https://edge126.rcs-rds.ro/kissfm/kissfm.mp3' },
  { id: 'cz-beat',       name: 'Rádio Beat',            country: 'CZ', city: 'Praga',            genre: 'Rock',        flag: '🇨🇿', color: '#dc2626', stream: 'https://radiobeat.stream.jpc.cz/radiobeat.mp3' },

  // ══════════════════════════════════════════════════════════════════════════
  // ASIA / PACÍFICO
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'au-triplej',    name: 'Triple J',              country: 'AU', city: 'Sídney',           genre: 'Alternativo', flag: '🇦🇺', color: '#dc2626', stream: 'https://live-radio01.mediahubaustralia.com/2TJW/aac/' },
  { id: 'au-nova',       name: 'Nova 96.9',             country: 'AU', city: 'Sídney',           genre: 'Pop/Hits',    flag: '🇦🇺', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVAFM969' },
  { id: 'ru-europaplus', name: 'Europa Plus',           country: 'RU', city: 'Moscú',            genre: 'Pop',         flag: '🇷🇺', color: '#0891b2', stream: 'https://ep256.hostingradio.ru/ep256.mp3' },
  { id: 'za-947',        name: '947 FM',                country: 'ZA', city: 'Johannesburgo',    genre: 'Pop/Hits',    flag: '🇿🇦', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/HIGHVELD947' },
  { id: 'tr-joy',        name: 'Joy FM Turkey',         country: 'TR', city: 'Estambul',         genre: 'Pop',         flag: '🇹🇷', color: '#dc2626', stream: 'https://listen.joy.com.tr/joy.mp3' },
  { id: 'nz-more',       name: 'More FM New Zealand',   country: 'NZ', city: 'Auckland',         genre: 'Pop/Hits',    flag: '🇳🇿', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MOREFM_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // CANALES TEMÁTICOS ONLINE — LOFI / CHILLOUT
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'on-lofi',       name: 'Lofi Hip-Hop',          country: 'ON', city: 'Online',           genre: 'Lofi/Chill',  flag: '🌐', color: '#7c3aed', stream: 'https://radio.streemlion.com:3420/stream' },
  { id: 'on-chillstep',  name: 'Chillstep Radio',       country: 'ON', city: 'Online',           genre: 'Lofi/Chill',  flag: '🌐', color: '#0891b2', stream: 'https://stream.zeno.fm/f3wvbbqmdg8uv' },
  { id: 'on-focus',      name: 'Focus Study Radio',     country: 'ON', city: 'Online',           genre: 'Lofi/Chill',  flag: '🌐', color: '#6d28d9', stream: 'https://stream.zeno.fm/hn56vhkam4quv' },
  { id: 'on-ambient',    name: 'Ambient / Espacial',    country: 'ON', city: 'Online',           genre: 'Ambient',     flag: '🌐', color: '#0369a1', stream: 'https://stream.zeno.fm/2jf44me3xg8uv' },
  { id: 'on-sleep',      name: 'Sleep Sounds Radio',    country: 'ON', city: 'Online',           genre: 'Ambient',     flag: '🌐', color: '#334155', stream: 'https://stream.zeno.fm/ghx5p7mts58uv' },
  { id: 'on-piano',      name: 'Piano Radio',           country: 'ON', city: 'Online',           genre: 'Clásica',     flag: '🌐', color: '#1e3a5f', stream: 'https://stream.zeno.fm/3yjfwbpmeg8uv' },

  // ══════════════════════════════════════════════════════════════════════════
  // CANALES TEMÁTICOS ONLINE — ELECTRÓNICA
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'on-deephouse',  name: 'Deep House Radio',      country: 'ON', city: 'Online',           genre: 'Electrónica', flag: '🌐', color: '#9333ea', stream: 'https://stream.zeno.fm/4d5ud6npnk0uv' },
  { id: 'on-trance',     name: 'Trance World',          country: 'ON', city: 'Online',           genre: 'Electrónica', flag: '🌐', color: '#0284c7', stream: 'https://stream.zeno.fm/d7gr2es29g8uv' },
  { id: 'on-progressive',name: 'Progressive House',     country: 'ON', city: 'Online',           genre: 'Electrónica', flag: '🌐', color: '#1d4ed8', stream: 'https://stream.zeno.fm/eeam0grb628uv' },
  { id: 'on-synthwave',  name: 'Synthwave Radio',       country: 'ON', city: 'Online',           genre: 'Electrónica', flag: '🌐', color: '#9333ea', stream: 'https://stream.zeno.fm/9sba9xgb628uv' },

  // ══════════════════════════════════════════════════════════════════════════
  // CANALES TEMÁTICOS ONLINE — ROCK / METAL
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'on-rockclass',  name: 'Rock Classics Radio',   country: 'ON', city: 'Online',           genre: 'Rock',        flag: '🌐', color: '#dc2626', stream: 'https://stream.zeno.fm/rz4cqf8m4g8uv' },
  { id: 'on-metal',      name: 'Metal Radio',           country: 'ON', city: 'Online',           genre: 'Metal',       flag: '🌐', color: '#374151', stream: 'https://stream.zeno.fm/1v7m3unm4g8uv' },

  // ══════════════════════════════════════════════════════════════════════════
  // CANALES TEMÁTICOS ONLINE — LATINA / URBANA
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'on-salsa',      name: 'Salsa Radio Global',    country: 'ON', city: 'Online',           genre: 'Tropical',    flag: '🌐', color: '#ea580c', stream: 'https://stream.zeno.fm/f2kbp2w0u8zuv' },
  { id: 'on-reggae',     name: 'Reggae Radio',          country: 'ON', city: 'Online',           genre: 'Reggae',      flag: '🌐', color: '#15803d', stream: 'https://stream.zeno.fm/rz3e5nzbw8zuv' },
  { id: 'on-rb',         name: 'R&B Soul Radio',        country: 'ON', city: 'Online',           genre: 'R&B/Soul',    flag: '🌐', color: '#9333ea', stream: 'https://stream.zeno.fm/b0a4g3czg8zuv' },
  { id: 'on-hiphop',     name: 'Hip-Hop Nation',        country: 'ON', city: 'Online',           genre: 'Hip-Hop',     flag: '🌐', color: '#374151', stream: 'https://stream.zeno.fm/c5t5tqwq728uv' },
  { id: 'on-latinonline',name: 'Latin Hits 24/7',       country: 'ON', city: 'Online',           genre: 'Tropical',    flag: '🌐', color: '#ea580c', stream: 'https://stream.zeno.fm/r6m60e1b2g8uv' },
  { id: 'on-flamenco',   name: 'Flamenco Radio',        country: 'ON', city: 'Online',           genre: 'Flamenco',    flag: '🌐', color: '#dc2626', stream: 'https://stream.zeno.fm/9e5kw49b9g8uv' },

  // ══════════════════════════════════════════════════════════════════════════
  // CANALES TEMÁTICOS ONLINE — CLÁSICA / JAZZ
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'on-classical',  name: 'Classical Radio 24/7',  country: 'ON', city: 'Online',           genre: 'Clásica',     flag: '🌐', color: '#7c3aed', stream: 'https://stream.zeno.fm/0r0xa792kwzuv' },
  { id: 'on-jazz',       name: 'Jazz Radio Global',     country: 'ON', city: 'Online',           genre: 'Jazz/Blues',  flag: '🌐', color: '#0891b2', stream: 'https://stream.zeno.fm/yr3fpsgdx0duv' },
  { id: 'on-bossanova',  name: 'Bossa Nova Radio',      country: 'ON', city: 'Online',           genre: 'Jazz/Blues',  flag: '🌐', color: '#059669', stream: 'https://stream.zeno.fm/o8e5xm80628uv' },
  { id: 'on-blues',      name: 'Blues Radio',           country: 'ON', city: 'Online',           genre: 'Jazz/Blues',  flag: '🌐', color: '#374151', stream: 'https://stream.zeno.fm/mq7mndnpyw0uv' },

  // ══════════════════════════════════════════════════════════════════════════
  // CANALES TEMÁTICOS ONLINE — POP CLÁSICO
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'on-80s',        name: '80s Pop Radio',         country: 'ON', city: 'Online',           genre: 'Pop Clásico', flag: '🌐', color: '#7c3aed', stream: 'https://stream.zeno.fm/n3cwk56bfq0uv' },
  { id: 'on-90s',        name: '90s Hits Radio',        country: 'ON', city: 'Online',           genre: 'Pop Clásico', flag: '🌐', color: '#0891b2', stream: 'https://stream.zeno.fm/ggjvnbptfq0uv' },
  { id: 'on-2000s',      name: '2000s Throwbacks',      country: 'ON', city: 'Online',           genre: 'Pop Clásico', flag: '🌐', color: '#16a34a', stream: 'https://stream.zeno.fm/fwf0wfe0ck0uv' },

  // ══════════════════════════════════════════════════════════════════════════
  // CANALES TEMÁTICOS ONLINE — VARIOS
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'on-country',    name: 'Country Roads Radio',   country: 'ON', city: 'Online',           genre: 'Country',     flag: '🌐', color: '#b45309', stream: 'https://stream.zeno.fm/2z6rp0p8g8zuv' },
  { id: 'on-gospel',     name: 'Gospel Radio',          country: 'ON', city: 'Online',           genre: 'Gospel',      flag: '🌐', color: '#b45309', stream: 'https://stream.zeno.fm/9hy0efbsn68uv' },
  { id: 'on-anime',      name: 'Anime Radio',           country: 'ON', city: 'Online',           genre: 'Anime/J-Pop', flag: '🌐', color: '#db2777', stream: 'https://stream.zeno.fm/3btqb0ymg8zuv' },
  { id: 'on-kpop',       name: 'K-Pop Radio',           country: 'ON', city: 'Online',           genre: 'K-Pop',       flag: '🌐', color: '#db2777', stream: 'https://stream.zeno.fm/8d4xhqhbfq0uv' },
];

export const REGIONS = [
  { key: 'all',    label: '🌍 Todo',          countries: null },
  { key: 'CO',     label: '🇨🇴 Colombia',     countries: ['CO'] },
  { key: 'latam',  label: '🌎 Latinoamérica', countries: ['MX', 'AR', 'CL', 'PE', 'VE', 'EC', 'UY', 'BO', 'BR', 'PY', 'CR', 'CU', 'DO'] },
  { key: 'ES',     label: '🇪🇸 España',       countries: ['ES'] },
  { key: 'europe', label: '🇪🇺 Europa',        countries: ['GB', 'FR', 'DE', 'IT', 'PT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'GR', 'RO', 'HU', 'CZ'] },
  { key: 'US',     label: '🇺🇸 EE.UU.',        countries: ['US'] },
  { key: 'world',  label: '🌐 Online',         countries: ['ON'] },
  { key: 'other',  label: '🌏 Asia/Pacífico',  countries: ['JP', 'KR', 'AU', 'IN', 'RU', 'ZA', 'TR', 'NZ'] },
];

export const RADIO_COLORS = ['#0d9488', '#2563eb', '#7c3aed', '#dc2626', '#d97706', '#0891b2', '#16a34a', '#db2777'];

export function countryFlag(code) {
  const clean = (code || 'ON').slice(0, 2).toUpperCase();
  if (clean === 'ON') return '🌐';
  return clean.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}
