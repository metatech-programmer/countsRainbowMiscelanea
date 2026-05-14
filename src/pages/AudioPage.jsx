import { useState, useEffect, useRef, useCallback } from 'react';

// ─── STATION DATABASE ────────────────────────────────────────────────────────
const STATIONS = [
  // ══ COLOMBIA ══════════════════════════════════════════════════════════════
  { id: 'co-los40',      name: 'Los 40 Colombia',      country: 'CO', city: 'Bogotá',         genre: 'Pop/Hits',    flag: '🇨🇴', color: '#e11d48', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_CO_SC' },
  { id: 'co-caracol',    name: 'Caracol Radio',         country: 'CO', city: 'Bogotá',         genre: 'Noticias',    flag: '🇨🇴', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CARACOLRADIOBOG_SC' },
  { id: 'co-olimpica',   name: 'Olímpica Estéreo',      country: 'CO', city: 'Bogotá',         genre: 'Tropical',    flag: '🇨🇴', color: '#059669', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OLIMPICA_STS_SC' },
  { id: 'co-lafm',       name: 'La FM',                 country: 'CO', city: 'Bogotá',         genre: 'Noticias',    flag: '🇨🇴', color: '#2563eb', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LA_FM_SC' },
  { id: 'co-rcn',        name: 'RCN Radio',             country: 'CO', city: 'Bogotá',         genre: 'Noticias',    flag: '🇨🇴', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RCNRADIOBOG_SC' },
  { id: 'co-tropicana',  name: 'Tropicana',             country: 'CO', city: 'Cali',           genre: 'Tropical',    flag: '🇨🇴', color: '#d97706', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/TROPICANA_CAL_SC' },
  { id: 'co-radionica',  name: 'Radiónica',             country: 'CO', city: 'Bogotá',         genre: 'Alternativo', flag: '🇨🇴', color: '#0891b2', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIONICA_SC' },
  { id: 'co-vibra',      name: 'Vibra',                 country: 'CO', city: 'Bogotá',         genre: 'Pop/Hits',    flag: '🇨🇴', color: '#db2777', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIBRA_BOG_SC' },
  { id: 'co-oxigeno',    name: 'Oxígeno',               country: 'CO', city: 'Bogotá',         genre: 'Rock',        flag: '🇨🇴', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OXIGENO_SC' },
  { id: 'co-blu',        name: 'BLU Radio',             country: 'CO', city: 'Bogotá',         genre: 'Noticias',    flag: '🇨🇴', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BLURADIO_SC' },
  { id: 'co-luna',       name: 'Luna Estéreo',          country: 'CO', city: 'Bogotá',         genre: 'Baladas',     flag: '🇨🇴', color: '#9333ea', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LUNA_SC' },
  { id: 'co-javeriana',  name: 'Javeriana Estéreo',     country: 'CO', city: 'Bogotá',         genre: 'Cultural',    flag: '🇨🇴', color: '#0369a1', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JAVERIANAESTEREO_SC' },
  { id: 'co-w',          name: 'W Radio',               country: 'CO', city: 'Bogotá',         genre: 'Noticias',    flag: '🇨🇴', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WRADIO_SC' },
  { id: 'co-besame',     name: 'Bésame',                country: 'CO', city: 'Bogotá',         genre: 'Romántica',   flag: '🇨🇴', color: '#be185d', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BESAME_SC' },
  { id: 'co-todelar',    name: 'Todelar',               country: 'CO', city: 'Bogotá',         genre: 'Variado',     flag: '🇨🇴', color: '#ca8a04', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/TODELAR_SC' },
  { id: 'co-la960',      name: 'La 96.0',               country: 'CO', city: 'Medellín',       genre: 'Pop/Hits',    flag: '🇨🇴', color: '#f97316', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LA960_SC' },

  // ══ MEXICO ════════════════════════════════════════════════════════════════
  { id: 'mx-los40',      name: 'Los 40 Mexico',         country: 'MX', city: 'Ciudad de México', genre: 'Pop/Hits', flag: '🇲🇽', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40MEX_SC' },
  { id: 'mx-rock101',    name: 'Rock 101',              country: 'MX', city: 'Ciudad de México', genre: 'Rock',     flag: '🇲🇽', color: '#dc2626', stream: 'https://14253.live.streamtheworld.com/ROCK101_SC' },
  { id: 'mx-exa',        name: 'Exa FM',                country: 'MX', city: 'Ciudad de México', genre: 'Pop',      flag: '🇲🇽', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/EXAFM_SC' },
  { id: 'mx-formula',    name: 'Radio Fórmula',         country: 'MX', city: 'Ciudad de México', genre: 'Noticias', flag: '🇲🇽', color: '#0284c7', stream: 'https://stream.radioformula.com.mx:8010/stream' },
  { id: 'mx-reactor',    name: 'Reactor 105',           country: 'MX', city: 'Ciudad de México', genre: 'Alternativo', flag: '🇲🇽', color: '#ea580c', stream: 'https://live.reactor105.com.mx/live' },
  { id: 'mx-horizonte',  name: 'Horizonte 107.9',       country: 'MX', city: 'Ciudad de México', genre: 'Jazz/Blues', flag: '🇲🇽', color: '#0891b2', stream: 'https://horizonte.com.mx/streaming' },

  // ══ ARGENTINA ════════════════════════════════════════════════════════════
  { id: 'ar-rivadavia',  name: 'Radio Rivadavia',       country: 'AR', city: 'Buenos Aires',    genre: 'Noticias',    flag: '🇦🇷', color: '#1d4ed8', stream: 'https://ssl.radios.com.ar/rivadavia' },
  { id: 'ar-mitre',      name: 'Radio Mitre',           country: 'AR', city: 'Buenos Aires',    genre: 'Noticias',    flag: '🇦🇷', color: '#dc2626', stream: 'https://ssl.radios.com.ar/mitre' },
  { id: 'ar-la100',      name: 'La 100',                country: 'AR', city: 'Buenos Aires',    genre: 'Pop',         flag: '🇦🇷', color: '#db2777', stream: 'https://ssl.radios.com.ar/la100' },
  { id: 'ar-nacional',   name: 'Radio Nacional',        country: 'AR', city: 'Buenos Aires',    genre: 'Cultural',    flag: '🇦🇷', color: '#15803d', stream: 'https://sa-east-1.streamingpulse.net/8110/stream' },
  { id: 'ar-metro',      name: 'Metro 95.1',            country: 'AR', city: 'Buenos Aires',    genre: 'Pop/Hits',    flag: '🇦🇷', color: '#7c3aed', stream: 'https://ssl.radios.com.ar/metro' },

  // ══ CHILE ═════════════════════════════════════════════════════════════════
  { id: 'cl-biobio',     name: 'Bío Bío Radio',         country: 'CL', city: 'Santiago',        genre: 'Noticias',    flag: '🇨🇱', color: '#b45309', stream: 'https://stream.biobiochile.cl/biobio' },
  { id: 'cl-horizonte',  name: 'Horizonte Chile',       country: 'CL', city: 'Santiago',        genre: 'Rock',        flag: '🇨🇱', color: '#dc2626', stream: 'https://n16.heron.cl:8098/horizonte' },
  { id: 'cl-futuro',     name: 'Futuro FM',             country: 'CL', city: 'Santiago',        genre: 'Pop',         flag: '🇨🇱', color: '#16a34a', stream: 'https://stream.futurofm.cl/futuro' },

  // ══ PERU / VENEZUELA / OTROS LATAM ════════════════════════════════════════
  { id: 'pe-moda',       name: 'Radio Moda',            country: 'PE', city: 'Lima',            genre: 'Pop',         flag: '🇵🇪', color: '#9333ea', stream: 'https://stream.radiomoda.com.pe/moda' },
  { id: 've-best',       name: 'Best FM Venezuela',     country: 'VE', city: 'Caracas',         genre: 'Pop/Hits',    flag: '🇻🇪', color: '#ea580c', stream: 'https://s1.viastreaming.net:8060/stream' },
  { id: 'ec-smooth',     name: 'Smooth FM Ecuador',     country: 'EC', city: 'Guayaquil',       genre: 'Jazz',        flag: '🇪🇨', color: '#0369a1', stream: 'https://stream.smoothfm.com.ec/smooth' },
  { id: 'uy-sport890',   name: 'Sport 890',             country: 'UY', city: 'Montevideo',      genre: 'Deportes',    flag: '🇺🇾', color: '#1d4ed8', stream: 'https://stream.sport890.com.uy/sport890' },
  { id: 'bo-panamerica', name: 'Panamericana Bolivia',  country: 'BO', city: 'La Paz',          genre: 'Variado',     flag: '🇧🇴', color: '#15803d', stream: 'https://stream.panamericana.bo/radio' },
  { id: 'do-z101',       name: 'Z101 FM',               country: 'DO', city: 'Santo Domingo',   genre: 'Hits',        flag: '🇩🇴', color: '#7c3aed', stream: 'https://stream.z101digital.com/z101' },
  { id: 'cu-habana',     name: 'Radio Habana Cuba',     country: 'CU', city: 'La Habana',       genre: 'Variado',     flag: '🇨🇺', color: '#dc2626', stream: 'https://rhc.cu:8000/live' },

  // ══ BRASIL ════════════════════════════════════════════════════════════════
  { id: 'br-jovempan',   name: 'Jovem Pan',             country: 'BR', city: 'São Paulo',       genre: 'Noticias',    flag: '🇧🇷', color: '#dc2626', stream: 'https://radio.jovempan.com.br/stream' },
  { id: 'br-89fm',       name: '89 FM Rock',            country: 'BR', city: 'São Paulo',       genre: 'Rock',        flag: '🇧🇷', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/89FM_SC' },
  { id: 'br-bandnews',   name: 'BandNews FM',           country: 'BR', city: 'São Paulo',       genre: 'Noticias',    flag: '🇧🇷', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDNEWSFM_SC' },
  { id: 'br-antena1',    name: 'Antena 1 Brasil',       country: 'BR', city: 'São Paulo',       genre: 'Baladas',     flag: '🇧🇷', color: '#9333ea', stream: 'https://mediaserver.radioantena1.com.br/antena1' },

  // ══ ESPAÑA ════════════════════════════════════════════════════════════════
  { id: 'es-cadena100',  name: 'Cadena 100',            country: 'ES', city: 'Madrid',          genre: 'Pop/Hits',    flag: '🇪🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CADENA100_SC' },
  { id: 'es-los40',      name: 'Los 40 España',         country: 'ES', city: 'Madrid',          genre: 'Pop/Hits',    flag: '🇪🇸', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_SC' },
  { id: 'es-cope',       name: 'COPE',                  country: 'ES', city: 'Madrid',          genre: 'Noticias',    flag: '🇪🇸', color: '#1d4ed8', stream: 'https://cope.cope.es/live' },
  { id: 'es-ser',        name: 'Cadena SER',            country: 'ES', city: 'Madrid',          genre: 'Noticias',    flag: '🇪🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SER_SC' },
  { id: 'es-rockfm',     name: 'Rock FM España',        country: 'ES', city: 'Madrid',          genre: 'Rock',        flag: '🇪🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ROCKFM_SC' },
  { id: 'es-ondacero',   name: 'Onda Cero',             country: 'ES', city: 'Madrid',          genre: 'Noticias',    flag: '🇪🇸', color: '#16a34a', stream: 'https://onceno.ondacero.es/ondacero' },
  { id: 'es-rac1',       name: 'RAC1',                  country: 'ES', city: 'Barcelona',       genre: 'Noticias',    flag: '🇪🇸', color: '#ea580c', stream: 'https://streaming.rac.cat/rac1' },
  { id: 'es-flaix',      name: 'Flaix FM',              country: 'ES', city: 'Barcelona',       genre: 'Electrónica', flag: '🇪🇸', color: '#0891b2', stream: 'https://streaming.flaix.cat/flaixfm' },

  // ══ REINO UNIDO ═══════════════════════════════════════════════════════════
  { id: 'uk-bbc1',       name: 'BBC Radio 1',           country: 'GB', city: 'Londres',         genre: 'Pop/Hits',    flag: '🇬🇧', color: '#1d4ed8', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one' },
  { id: 'uk-bbc2',       name: 'BBC Radio 2',           country: 'GB', city: 'Londres',         genre: 'Pop Clásico', flag: '🇬🇧', color: '#16a34a', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two' },
  { id: 'uk-bbc3',       name: 'BBC Radio 3',           country: 'GB', city: 'Londres',         genre: 'Clásica',     flag: '🇬🇧', color: '#7c3aed', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three' },
  { id: 'uk-bbc4',       name: 'BBC Radio 4',           country: 'GB', city: 'Londres',         genre: 'Noticias',    flag: '🇬🇧', color: '#b45309', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm' },
  { id: 'uk-bbc5',       name: 'BBC Radio 5 Live',      country: 'GB', city: 'Londres',         genre: 'Deportes',    flag: '🇬🇧', color: '#dc2626', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live' },
  { id: 'uk-kiss',       name: 'Kiss FM UK',            country: 'GB', city: 'Londres',         genre: 'Dance/R&B',   flag: '🇬🇧', color: '#db2777', stream: 'https://icecast.thisisdax.com/KissFMUKMP3' },
  { id: 'uk-absolute',   name: 'Absolute Radio',        country: 'GB', city: 'Londres',         genre: 'Rock',        flag: '🇬🇧', color: '#ea580c', stream: 'https://icecast.absoluteradio.co.uk/absoluteradio.mp3' },
  { id: 'uk-talksport',  name: 'talkSPORT',             country: 'GB', city: 'Londres',         genre: 'Deportes',    flag: '🇬🇧', color: '#15803d', stream: 'https://stream.talksport.com/radio/aac/talksport' },

  // ══ ESTADOS UNIDOS ════════════════════════════════════════════════════════
  { id: 'us-npr',        name: 'NPR News',              country: 'US', city: 'Washington',      genre: 'Noticias',    flag: '🇺🇸', color: '#1d4ed8', stream: 'https://npr-ice.streamguys1.com/live.mp3' },
  { id: 'us-wqxr',       name: 'WQXR Classical',        country: 'US', city: 'New York',        genre: 'Clásica',     flag: '🇺🇸', color: '#7c3aed', stream: 'https://stream.wqxr.org/wqxr' },
  { id: 'us-z100',       name: 'Z100 New York',         country: 'US', city: 'New York',        genre: 'Pop/Hits',    flag: '🇺🇸', color: '#db2777', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WHTZ_FM_SC' },
  { id: 'us-power105',   name: 'Power 105.1',           country: 'US', city: 'New York',        genre: 'Hip-Hop/R&B', flag: '🇺🇸', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WWPR_FMAAC_SC' },
  { id: 'us-kroq',       name: 'KROQ 106.7',            country: 'US', city: 'Los Angeles',     genre: 'Alternativo', flag: '🇺🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KROQFMAAC_SC' },
  { id: 'us-country',    name: 'KISS Country',          country: 'US', city: 'Nashville',       genre: 'Country',     flag: '🇺🇸', color: '#b45309', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WSIX_FM_SC' },
  { id: 'us-espn',       name: 'ESPN Radio',            country: 'US', city: 'New York',        genre: 'Deportes',    flag: '🇺🇸', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ESPNRADIOSCAAC' },
  { id: 'us-wbez',       name: 'WBEZ Chicago',          country: 'US', city: 'Chicago',         genre: 'Cultural',    flag: '🇺🇸', color: '#0891b2', stream: 'https://wbez.streamguys1.com/wbez64.aac' },
  { id: 'us-kexp',       name: 'KEXP Seattle',          country: 'US', city: 'Seattle',         genre: 'Alternativo', flag: '🇺🇸', color: '#15803d', stream: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
  { id: 'us-kcrw',       name: 'KCRW Santa Monica',     country: 'US', city: 'Los Angeles',     genre: 'Alternativo', flag: '🇺🇸', color: '#0369a1', stream: 'https://kcrw.streamguys1.com/kcrw_music.aac' },

  // ══ EUROPA ════════════════════════════════════════════════════════════════
  { id: 'fr-fip',        name: 'FIP',                   country: 'FR', city: 'París',           genre: 'Jazz/Blues',  flag: '🇫🇷', color: '#1d4ed8', stream: 'https://icecast.radiofrance.fr/fip-midfi.mp3' },
  { id: 'fr-nrj',        name: 'NRJ France',            country: 'FR', city: 'París',           genre: 'Pop/Dance',   flag: '🇫🇷', color: '#ea580c', stream: 'https://scdn.nrjaudio.fm/fr/30001/mp3_128' },
  { id: 'fr-mouv',       name: "Mouv'",                 country: 'FR', city: 'París',           genre: 'Hip-Hop',     flag: '🇫🇷', color: '#7c3aed', stream: 'https://icecast.radiofrance.fr/mouv-midfi.mp3' },
  { id: 'fr-rtl',        name: 'RTL France',            country: 'FR', city: 'París',           genre: 'Noticias',    flag: '🇫🇷', color: '#dc2626', stream: 'https://streamer.rtl.fr/rtl-1-44-128' },
  { id: 'fr-novaplanet', name: 'Nova Planet',           country: 'FR', city: 'París',           genre: 'Electrónica', flag: '🇫🇷', color: '#0891b2', stream: 'https://nova.streamakaci.com/nova.mp3' },
  { id: 'de-ndr',        name: 'NDR Info',              country: 'DE', city: 'Hamburgo',        genre: 'Noticias',    flag: '🇩🇪', color: '#1d4ed8', stream: 'https://icecast.ndr.de/ndr/ndrinfo/hamburg/mp3/128/stream.mp3' },
  { id: 'de-deutschlan', name: 'Deutschlandradio',      country: 'DE', city: 'Berlín',          genre: 'Cultural',    flag: '🇩🇪', color: '#15803d', stream: 'https://dradio-ogg.t-bn.de/dlf' },
  { id: 'de-radioeins',  name: 'radioeins',             country: 'DE', city: 'Berlín',          genre: 'Alternativo', flag: '🇩🇪', color: '#7c3aed', stream: 'https://radioeins.de/livemp3' },
  { id: 'de-fritz',      name: 'Fritz',                 country: 'DE', city: 'Berlín',          genre: 'Alternativo', flag: '🇩🇪', color: '#ea580c', stream: 'https://fritz.de/livemp3' },
  { id: 'it-rai1',       name: 'RAI Radio 1',           country: 'IT', city: 'Roma',            genre: 'Variado',     flag: '🇮🇹', color: '#15803d', stream: 'https://icecast.unitedradio.it/Radio1.mp3' },
  { id: 'it-rai2',       name: 'RAI Radio 2',           country: 'IT', city: 'Roma',            genre: 'Pop',         flag: '🇮🇹', color: '#dc2626', stream: 'https://icecast.unitedradio.it/Radio2.mp3' },
  { id: 'it-m2o',        name: 'Radio m2o',             country: 'IT', city: 'Roma',            genre: 'Electrónica', flag: '🇮🇹', color: '#0891b2', stream: 'https://icecast.unitedradio.it/m2o.mp3' },
  { id: 'pt-antena1',    name: 'Antena 1 Portugal',     country: 'PT', city: 'Lisboa',          genre: 'Variado',     flag: '🇵🇹', color: '#dc2626', stream: 'https://rdp.pt/stream/antena1' },
  { id: 'nl-538',        name: 'Radio 538',             country: 'NL', city: 'Amsterdam',       genre: 'Pop/Dance',   flag: '🇳🇱', color: '#ea580c', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538' },
  { id: 'nl-3fm',        name: 'NPO 3FM',               country: 'NL', city: 'Amsterdam',       genre: 'Alternativo', flag: '🇳🇱', color: '#1d4ed8', stream: 'https://icecast.omroep.nl/3fm-sb-mp3' },
  { id: 'be-mnm',        name: 'MNM',                   country: 'BE', city: 'Bruselas',        genre: 'Pop',         flag: '🇧🇪', color: '#dc2626', stream: 'https://icecast.vrtcdn.be/mnm-high.mp3' },
  { id: 'ch-srf3',       name: 'SRF 3',                 country: 'CH', city: 'Zúrich',          genre: 'Pop',         flag: '🇨🇭', color: '#dc2626', stream: 'https://stream.srg-ssr.ch/m/srf3/mp3_128' },
  { id: 'at-oe3',        name: 'Ö3',                    country: 'AT', city: 'Viena',           genre: 'Pop/Hits',    flag: '🇦🇹', color: '#dc2626', stream: 'https://orf-live.ors-shoutcast.at/oe3-q2a' },
  { id: 'se-p3',         name: 'P3 Sverige',            country: 'SE', city: 'Estocolmo',       genre: 'Pop',         flag: '🇸🇪', color: '#1d4ed8', stream: 'https://sverigesradio.se/topsy/direkt/164-hi.mp3' },
  { id: 'no-nrk',        name: 'NRK P3',                country: 'NO', city: 'Oslo',            genre: 'Pop',         flag: '🇳🇴', color: '#dc2626', stream: 'https://lyd.nrk.no/nrk_radio_p3_mp3_h' },
  { id: 'dk-dr1',        name: 'DR P1',                 country: 'DK', city: 'Copenhague',      genre: 'Noticias',    flag: '🇩🇰', color: '#dc2626', stream: 'https://live-icy.gss.dr.dk/A/A05H.mp3' },
  { id: 'fi-yle',        name: 'Yle Radio 1',           country: 'FI', city: 'Helsinki',        genre: 'Cultural',    flag: '🇫🇮', color: '#1d4ed8', stream: 'https://icecast.yle.fi/radio1.mp3' },
  { id: 'pl-trojka',     name: 'Polskie Radio 3',       country: 'PL', city: 'Varsovia',        genre: 'Cultural',    flag: '🇵🇱', color: '#dc2626', stream: 'https://stream85.polskieradio.pl/pr3/pr3.mp3' },
  { id: 'gr-skai',       name: 'Skai Radio',            country: 'GR', city: 'Atenas',          genre: 'Pop',         flag: '🇬🇷', color: '#1d4ed8', stream: 'https://skai.livemedia.gr/skai' },
  { id: 'ro-kiss',       name: 'Kiss FM Romania',       country: 'RO', city: 'Bucarest',        genre: 'Pop',         flag: '🇷🇴', color: '#dc2626', stream: 'https://edge126.rcs-rds.ro/kissfm/kissfm.mp3' },
  { id: 'hu-petofi',     name: 'Petőfi Rádió',          country: 'HU', city: 'Budapest',        genre: 'Pop',         flag: '🇭🇺', color: '#16a34a', stream: 'https://stream.mr2.hu/mr2' },
  { id: 'cz-radiobeat',  name: 'Rádio Beat',            country: 'CZ', city: 'Praga',           genre: 'Rock',        flag: '🇨🇿', color: '#dc2626', stream: 'https://radiobeat.stream.jpc.cz/radiobeat.mp3' },

  // ══ RESTO DEL MUNDO ═══════════════════════════════════════════════════════
  { id: 'jp-nhk',        name: 'NHK World Radio',       country: 'JP', city: 'Tokio',           genre: 'Noticias',    flag: '🇯🇵', color: '#dc2626', stream: 'https://nhkworld.nhk.or.jp/en/audio/r1' },
  { id: 'jp-fmcocolo',   name: 'FM COCOLO',             country: 'JP', city: 'Osaka',           genre: 'J-Pop',       flag: '🇯🇵', color: '#db2777', stream: 'https://cocolo.jp/live/stream' },
  { id: 'kr-kbs',        name: 'KBS World Radio',       country: 'KR', city: 'Seúl',            genre: 'K-Pop',       flag: '🇰🇷', color: '#1d4ed8', stream: 'https://worldservice.kbs.co.kr/stream/spanish' },
  { id: 'au-triplej',    name: 'Triple J',              country: 'AU', city: 'Sídney',          genre: 'Alternativo', flag: '🇦🇺', color: '#dc2626', stream: 'https://live-radio01.mediahubaustralia.com/2TJW/aac/' },
  { id: 'au-nova',       name: 'Nova 96.9',             country: 'AU', city: 'Sídney',          genre: 'Pop/Hits',    flag: '🇦🇺', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVAFM969' },
  { id: 'in-city91',     name: 'Radio City 91.1',       country: 'IN', city: 'Mumbai',          genre: 'Bollywood',   flag: '🇮🇳', color: '#ea580c', stream: 'https://prclive2.listenon.in:9150/;' },
  { id: 'ru-europaplus', name: 'Europa Plus',           country: 'RU', city: 'Moscú',           genre: 'Pop',         flag: '🇷🇺', color: '#0891b2', stream: 'https://ep256.hostingradio.ru/ep256.mp3' },
  { id: 'za-947',        name: '947 FM',                country: 'ZA', city: 'Johannesburgo',   genre: 'Pop/Hits',    flag: '🇿🇦', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/HIGHVELD947' },
  { id: 'tr-joy',        name: 'Joy FM Turkey',         country: 'TR', city: 'Estambul',        genre: 'Pop',         flag: '🇹🇷', color: '#dc2626', stream: 'https://listen.joy.com.tr/joy.mp3' },
  { id: 'nz-more',       name: 'More FM New Zealand',   country: 'NZ', city: 'Auckland',        genre: 'Pop/Hits',    flag: '🇳🇿', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MOREFM_SC' },

  // ══ CANALES TEMÁTICOS ONLINE ══════════════════════════════════════════════
  { id: 'on-lofi',       name: 'Lofi Hip-Hop',          country: 'ON', city: 'Online',          genre: 'Lofi/Chill',  flag: '🌐', color: '#7c3aed', stream: 'https://radio.streemlion.com:3420/stream' },
  { id: 'on-chillstep',  name: 'Chillstep Radio',       country: 'ON', city: 'Online',          genre: 'Lofi/Chill',  flag: '🌐', color: '#0891b2', stream: 'https://stream.zeno.fm/f3wvbbqmdg8uv' },
  { id: 'on-focus',      name: 'Focus Study Radio',     country: 'ON', city: 'Online',          genre: 'Lofi/Chill',  flag: '🌐', color: '#6d28d9', stream: 'https://stream.zeno.fm/hn56vhkam4quv' },
  { id: 'on-deephouse',  name: 'Deep House Radio',      country: 'ON', city: 'Online',          genre: 'Electrónica', flag: '🌐', color: '#9333ea', stream: 'https://stream.zeno.fm/4d5ud6npnk0uv' },
  { id: 'on-trance',     name: 'Trance World',          country: 'ON', city: 'Online',          genre: 'Electrónica', flag: '🌐', color: '#0284c7', stream: 'https://stream.zeno.fm/d7gr2es29g8uv' },
  { id: 'on-progressive',name: 'Progressive House',     country: 'ON', city: 'Online',          genre: 'Electrónica', flag: '🌐', color: '#1d4ed8', stream: 'https://stream.zeno.fm/eeam0grb628uv' },
  { id: 'on-rockclass',  name: 'Rock Classics Radio',   country: 'ON', city: 'Online',          genre: 'Rock',        flag: '🌐', color: '#dc2626', stream: 'https://stream.zeno.fm/rz4cqf8m4g8uv' },
  { id: 'on-metal',      name: 'Metal Radio',           country: 'ON', city: 'Online',          genre: 'Metal',       flag: '🌐', color: '#374151', stream: 'https://stream.zeno.fm/1v7m3unm4g8uv' },
  { id: 'on-salsa',      name: 'Salsa Radio Global',    country: 'ON', city: 'Online',          genre: 'Tropical',    flag: '🌐', color: '#ea580c', stream: 'https://stream.zeno.fm/f2kbp2w0u8zuv' },
  { id: 'on-reggae',     name: 'Reggae Radio',          country: 'ON', city: 'Online',          genre: 'Reggae',      flag: '🌐', color: '#15803d', stream: 'https://stream.zeno.fm/rz3e5nzbw8zuv' },
  { id: 'on-rb',         name: 'R&B Soul Radio',        country: 'ON', city: 'Online',          genre: 'R&B/Soul',    flag: '🌐', color: '#9333ea', stream: 'https://stream.zeno.fm/b0a4g3czg8zuv' },
  { id: 'on-hiphop',     name: 'Hip-Hop Nation',        country: 'ON', city: 'Online',          genre: 'Hip-Hop',     flag: '🌐', color: '#374151', stream: 'https://stream.zeno.fm/c5t5tqwq728uv' },
  { id: 'on-country',    name: 'Country Roads Radio',   country: 'ON', city: 'Online',          genre: 'Country',     flag: '🌐', color: '#b45309', stream: 'https://stream.zeno.fm/2z6rp0p8g8zuv' },
  { id: 'on-classical',  name: 'Classical Radio 24/7',  country: 'ON', city: 'Online',          genre: 'Clásica',     flag: '🌐', color: '#7c3aed', stream: 'https://stream.zeno.fm/0r0xa792kwzuv' },
  { id: 'on-jazz',       name: 'Jazz Radio Global',     country: 'ON', city: 'Online',          genre: 'Jazz/Blues',  flag: '🌐', color: '#0891b2', stream: 'https://stream.zeno.fm/yr3fpsgdx0duv' },
  { id: 'on-bossanova',  name: 'Bossa Nova Radio',      country: 'ON', city: 'Online',          genre: 'Jazz/Blues',  flag: '🌐', color: '#059669', stream: 'https://stream.zeno.fm/o8e5xm80628uv' },
  { id: 'on-piano',      name: 'Piano Radio',           country: 'ON', city: 'Online',          genre: 'Clásica',     flag: '🌐', color: '#1e3a5f', stream: 'https://stream.zeno.fm/3yjfwbpmeg8uv' },
  { id: 'on-flamenco',   name: 'Flamenco Radio',        country: 'ON', city: 'Online',          genre: 'Flamenco',    flag: '🌐', color: '#dc2626', stream: 'https://stream.zeno.fm/9e5kw49b9g8uv' },
  { id: 'on-ambient',    name: 'Ambient / Espacial',    country: 'ON', city: 'Online',          genre: 'Ambient',     flag: '🌐', color: '#0369a1', stream: 'https://stream.zeno.fm/2jf44me3xg8uv' },
  { id: 'on-sleep',      name: 'Sleep Sounds Radio',    country: 'ON', city: 'Online',          genre: 'Ambient',     flag: '🌐', color: '#334155', stream: 'https://stream.zeno.fm/ghx5p7mts58uv' },
  { id: 'on-anime',      name: 'Anime Radio',           country: 'ON', city: 'Online',          genre: 'Anime/J-Pop', flag: '🌐', color: '#db2777', stream: 'https://stream.zeno.fm/3btqb0ymg8zuv' },
  { id: 'on-kpop',       name: 'K-Pop Radio',           country: 'ON', city: 'Online',          genre: 'K-Pop',       flag: '🌐', color: '#db2777', stream: 'https://stream.zeno.fm/8d4xhqhbfq0uv' },
  { id: 'on-jpop',       name: 'J-Pop Radio',           country: 'ON', city: 'Online',          genre: 'Anime/J-Pop', flag: '🌐', color: '#dc2626', stream: 'https://stream.zeno.fm/3s5m4sqb9g8uv' },
  { id: 'on-80s',        name: '80s Pop Radio',         country: 'ON', city: 'Online',          genre: 'Pop Clásico', flag: '🌐', color: '#7c3aed', stream: 'https://stream.zeno.fm/n3cwk56bfq0uv' },
  { id: 'on-90s',        name: '90s Hits Radio',        country: 'ON', city: 'Online',          genre: 'Pop Clásico', flag: '🌐', color: '#0891b2', stream: 'https://stream.zeno.fm/ggjvnbptfq0uv' },
  { id: 'on-2000s',      name: '2000s Throwbacks',      country: 'ON', city: 'Online',          genre: 'Pop Clásico', flag: '🌐', color: '#16a34a', stream: 'https://stream.zeno.fm/fwf0wfe0ck0uv' },
  { id: 'on-latinonline',name: 'Latin Hits 24/7',       country: 'ON', city: 'Online',          genre: 'Tropical',    flag: '🌐', color: '#ea580c', stream: 'https://stream.zeno.fm/r6m60e1b2g8uv' },
  { id: 'on-gospel',     name: 'Gospel Radio',          country: 'ON', city: 'Online',          genre: 'Gospel',      flag: '🌐', color: '#b45309', stream: 'https://stream.zeno.fm/9hy0efbsn68uv' },
  { id: 'on-blues',      name: 'Blues Radio',           country: 'ON', city: 'Online',          genre: 'Jazz/Blues',  flag: '🌐', color: '#374151', stream: 'https://stream.zeno.fm/mq7mndnpyw0uv' },
  { id: 'on-synthwave',  name: 'Synthwave Radio',       country: 'ON', city: 'Online',          genre: 'Electrónica', flag: '🌐', color: '#9333ea', stream: 'https://stream.zeno.fm/9sba9xgb628uv' },
];

const ALL_GENRES = ['Todos', ...Array.from(new Set(STATIONS.map((s) => s.genre))).sort()];

const REGIONS = [
  { key: 'all',    label: '🌍 Todo el mundo', countries: null },
  { key: 'CO',     label: '🇨🇴 Colombia',      countries: ['CO'] },
  { key: 'latam',  label: '🌎 Latinoamérica',  countries: ['MX', 'AR', 'CL', 'PE', 'VE', 'EC', 'UY', 'BO', 'BR', 'PY', 'CR', 'CU', 'DO'] },
  { key: 'europe', label: '🇪🇺 Europa',         countries: ['ES', 'GB', 'FR', 'DE', 'IT', 'PT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'GR', 'RO', 'HU', 'CZ'] },
  { key: 'US',     label: '🇺🇸 EE.UU.',         countries: ['US'] },
  { key: 'world',  label: '🌐 Online',          countries: ['ON'] },
  { key: 'other',  label: '🌏 Asia/Pacífico',   countries: ['JP', 'KR', 'AU', 'IN', 'RU', 'ZA', 'EG', 'TR', 'NZ'] },
];

// ─── AUDIO ENGINE (singleton) ─────────────────────────────────────────────────
let _audioEl = null;
function getAudio() {
  if (!_audioEl) _audioEl = new Audio();
  return _audioEl;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
function SignalBars({ active, color = '#6366f1' }) {
  return (
    <span className="inline-flex items-end gap-[2px]" style={{ height: 14 }}>
      {[4, 7, 10, 14].map((h, i) => (
        <span key={i} style={{
          width: 3, height: h, borderRadius: 2,
          background: active ? color : '#94a3b8',
          opacity: active ? 1 : 0.35,
          animation: active ? `audioBounce${i} ${0.55 + i * 0.12}s ease-in-out infinite alternate` : 'none',
        }} />
      ))}
    </span>
  );
}
function VolumeIcon({ muted }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AudioPage() {
  const [current, setCurrent]   = useState(null);
  const [status, setStatus]     = useState('idle'); // idle | loading | playing | error
  const [volume, setVolume]     = useState(() => parseFloat(localStorage.getItem('audio_volume') || '0.8'));
  const [muted, setMuted]       = useState(false);
  const [region, setRegion]     = useState('all');
  const [genre, setGenre]       = useState('Todos');
  const [search, setSearch]     = useState('');
  const [errMsg, setErrMsg]     = useState('');

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById('audio-kf')) return;
    const s = document.createElement('style');
    s.id = 'audio-kf';
    s.textContent = [0,1,2,3].map(i => `
      @keyframes audioBounce${i} { from{transform:scaleY(0.25)} to{transform:scaleY(1)} }
    `).join('') + `
      @keyframes pulseRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.9);opacity:0} }
      @keyframes spin { to{transform:rotate(360deg)} }
    `;
    document.head.appendChild(s);
  }, []);

  useEffect(() => { localStorage.setItem('audio_volume', String(volume)); }, [volume]);
  useEffect(() => { getAudio().volume = muted ? 0 : volume; }, [volume, muted]);

  // Cleanup on unmount
  useEffect(() => () => { const a = getAudio(); a.pause(); a.src = ''; }, []);

  const play = useCallback((station) => {
    const audio = getAudio();
    audio.pause(); audio.src = '';
    setCurrent(station); setStatus('loading'); setErrMsg('');
    audio.src = station.stream;
    audio.volume = muted ? 0 : volume;
    audio.load();
    const onPlay  = () => setStatus('playing');
    const onError = () => { setStatus('error'); setErrMsg('No se pudo conectar. La emisora puede estar fuera de línea.'); };
    audio.removeEventListener('playing', onPlay);
    audio.removeEventListener('error', onError);
    audio.addEventListener('playing', onPlay, { once: true });
    audio.addEventListener('error', onError, { once: true });
    audio.play().catch(onError);
  }, [volume, muted]);

  const stop = useCallback(() => {
    const a = getAudio(); a.pause(); a.src = '';
    setStatus('idle'); setCurrent(null);
  }, []);

  // Filter logic
  const regionDef = REGIONS.find((r) => r.key === region);
  const filtered = STATIONS.filter((s) => {
    if (regionDef?.countries && !regionDef.countries.includes(s.country)) return false;
    if (genre !== 'Todos' && s.genre !== genre) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q) && !s.genre.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <p className="section-eyebrow">Audio en vivo</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Radio mundial
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {STATIONS.length} emisoras de {new Set(STATIONS.map(s => s.country)).size} países, con búsqueda por ciudad, género y región.
        </p>
      </div>

      <section>
        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ── SIDEBAR: Now Playing ── */}
          <div className="lg:w-72 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20 space-y-3">

              {/* Player card */}
              <div className="card p-5">
                {current ? (
                  <>
                    {/* Status bar */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        isPlaying ? 'text-emerald-400' : isLoading ? 'text-amber-400' : status === 'error' ? 'text-red-400' : 'text-slate-500'
                      }`}>
                        {isLoading ? '⟳ Conectando…' : isPlaying ? '● En vivo' : status === 'error' ? '✕ Error' : '—'}
                      </span>
                      {isPlaying && <SignalBars active color={current.color} />}
                    </div>

                    {/* Album art / visual */}
                    <div className="relative mb-4 flex h-28 w-full items-center justify-center rounded-xl overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${current.color}22 0%, ${current.color}08 100%)`, border: `1px solid ${current.color}33` }}>
                      {isPlaying && <>
                        <div className="absolute h-16 w-16 rounded-full" style={{ background: `${current.color}15`, animation: 'pulseRing 2s ease-out infinite' }} />
                        <div className="absolute h-10 w-10 rounded-full" style={{ background: `${current.color}20`, animation: 'pulseRing 2s ease-out infinite 0.5s' }} />
                      </>}
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white/70" style={{ animation: 'spin 0.8s linear infinite' }} />
                        </div>
                      )}
                      <span className="relative text-5xl drop-shadow-lg">{current.flag}</span>
                    </div>

                    <div className="mb-0.5 text-base font-bold leading-snug text-slate-900 dark:text-white">{current.name}</div>
                    <div className="mb-4 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-500">{current.city}</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ background: `${current.color}22`, color: current.color }}>{current.genre}</span>
                    </div>

                    {status === 'error' && (
                      <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300">
                        {errMsg}
                        <button onClick={() => play(current)} className="mt-1.5 block font-semibold underline">Reintentar</button>
                      </div>
                    )}

                    <button onClick={stop}
                      className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ background: `linear-gradient(135deg, ${current.color}dd, ${current.color}99)` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                      Detener
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Elige una emisora</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">Haz clic en cualquier estación</p>
                  </div>
                )}

                {/* Volume control */}
                <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button onClick={() => setMuted(m => !m)} className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300">
                    <VolumeIcon muted={muted} />
                  </button>
                  <input type="range" min="0" max="1" step="0.02" value={muted ? 0 : volume}
                    onChange={e => { setMuted(false); setVolume(parseFloat(e.target.value)); }}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600 dark:bg-slate-700" />
                  <span className="w-8 flex-shrink-0 text-right text-xs tabular-nums text-slate-400">{Math.round((muted ? 0 : volume) * 100)}%</span>
                </div>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { n: STATIONS.length, l: 'Emisoras' },
                  { n: new Set(STATIONS.map(s => s.country)).size, l: 'Países' },
                  { n: ALL_GENRES.length - 1, l: 'Géneros' },
                ].map(({ n, l }) => (
                  <div key={l} className="card px-2 py-2.5 text-center">
                    <div className="text-lg font-black text-slate-900 dark:text-white">{n}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── MAIN: Station List ── */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="mb-5 space-y-3">
              {/* Region tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-0">
                {REGIONS.map((r) => (
                  <button key={r.key} onClick={() => setRegion(r.key)}
                    className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                      region === r.key
                        ? 'border-brand-600 bg-brand-600 text-white shadow-glow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Search + Genre */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-600 pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar emisora, ciudad, género…"
                    className="input py-2.5 pl-9 pr-4" />
                </div>
                <select value={genre} onChange={e => setGenre(e.target.value)}
                  className="input w-auto cursor-pointer py-2.5 pl-3 pr-8">
                  {ALL_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700">
                  {filtered.length} de {STATIONS.length} emisoras
                </span>
                {(region !== 'all' || genre !== 'Todos' || search) && (
                  <button onClick={() => { setRegion('all'); setGenre('Todos'); setSearch(''); }}
                    className="text-xs text-brand-600 underline underline-offset-2 transition-colors hover:text-brand-700 dark:text-brand-400">
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-24 text-center">
                <span className="text-5xl mb-4">📻</span>
                <p className="font-semibold text-slate-600 dark:text-slate-400">Sin resultados</p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-600">Prueba otros filtros</p>
              </div>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((station) => {
                  const active   = current?.id === station.id;
                  const loading  = active && isLoading;
                  const playing  = active && isPlaying;
                  return (
                    <button key={station.id}
                      onClick={() => active && isPlaying ? stop() : play(station)}
                      className={`group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                        active
                          ? 'border-brand-300 bg-brand-50 shadow-glow-sm dark:border-brand-700 dark:bg-brand-900/20'
                          : 'border-slate-100 bg-white shadow-card hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900'
                      }`}
                      style={active
                        ? { boxShadow: `0 0 16px ${station.color}18` }
                        : undefined
                      }
                    >
                      {/* Icon */}
                      <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                        style={{ background: `${station.color}18`, border: `1px solid ${station.color}30` }}>
                        {loading ? (
                          <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" style={{ animation: 'spin 0.8s linear infinite' }} />
                        ) : playing ? (
                          <SignalBars active color={station.color} />
                        ) : (
                          <span className="transition-all duration-200 group-hover:opacity-0">{station.flag}</span>
                        )}
                        {/* Play overlay */}
                        <span className={`absolute inset-0 flex items-center justify-center rounded-xl text-white transition-all duration-200 ${
                          playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`} style={{ background: `${station.color}cc` }}>
                          {playing
                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          }
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`truncate text-sm font-semibold leading-snug ${active ? 'text-slate-900 dark:text-white' : 'text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white'} transition-colors`}>
                          {station.name}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="truncate text-xs text-slate-400 dark:text-slate-500">{station.city}</span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="flex-shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                            style={{ background: `${station.color}18`, color: station.color }}>
                            {station.genre}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
