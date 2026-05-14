import { useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS } from '../lib/constants.js';
import Spinner from '../components/ui/Spinner.jsx';

// ─── Emisoras del mundo con streams MP3/AAC públicos ───────────────────────────
const STATIONS = [
  // ── Colombia ──────────────────────────────────────────────────────────────
  { id: 'los40co',      name: 'Los 40 Colombia',       country: 'CO', city: 'Bogotá',          genre: 'Pop / Top 40',    flag: '🇨🇴', color: '#e11d48', stream: 'https://19273.live.streamtheworld.com/LOS40_SC' },
  { id: 'caracol',      name: 'Caracol Radio',          country: 'CO', city: 'Bogotá',          genre: 'Noticias',        flag: '🇨🇴', color: '#0369a1', stream: 'https://15453.live.streamtheworld.com/CARACOL_RADIO_SC' },
  { id: 'olimpica',     name: 'Olímpica FM',            country: 'CO', city: 'Bogotá',          genre: 'Vallenato',       flag: '🇨🇴', color: '#b45309', stream: 'https://19523.live.streamtheworld.com/OLIMPICA_FM_SC' },
  { id: 'lafm',         name: 'La FM',                  country: 'CO', city: 'Bogotá',          genre: 'Rock / Pop',      flag: '🇨🇴', color: '#7c3aed', stream: 'https://15443.live.streamtheworld.com/LA_FM_SC' },
  { id: 'rcnco',        name: 'RCN Radio',              country: 'CO', city: 'Bogotá',          genre: 'Noticias',        flag: '🇨🇴', color: '#0f766e', stream: 'https://15453.live.streamtheworld.com/RCN_RADIO_SC' },
  { id: 'tropicana',    name: 'Tropicana Colombia',     country: 'CO', city: 'Bogotá',          genre: 'Tropical / Salsa',flag: '🇨🇴', color: '#dc6b19', stream: 'https://19273.live.streamtheworld.com/TROPICANA_CO_SC' },
  { id: 'radionica',    name: 'Radiónica',              country: 'CO', city: 'Bogotá',          genre: 'Alternativo',     flag: '🇨🇴', color: '#6d28d9', stream: 'https://15453.live.streamtheworld.com/RADIONICA_SC' },
  { id: 'luna',         name: 'Luna Estéreo',           country: 'CO', city: 'Bogotá',          genre: 'Baladas / Romántico', flag: '🇨🇴', color: '#4f46e5', stream: 'https://19273.live.streamtheworld.com/LUNAESTEREO_SC' },
  { id: 'vibra',        name: 'Vibra Colombia',         country: 'CO', city: 'Bogotá',          genre: 'Urbano / Reggaeton', flag: '🇨🇴', color: '#ea580c', stream: 'https://15443.live.streamtheworld.com/VIBRA_SC' },
  { id: 'oxigeno',      name: 'Oxígeno Radio',          country: 'CO', city: 'Bogotá',          genre: 'Pop / Dance',     flag: '🇨🇴', color: '#06b6d4', stream: 'https://19273.live.streamtheworld.com/OXIGENO_SC' },
  { id: 'javeriana',    name: 'Radio Javeriana',        country: 'CO', city: 'Bogotá',          genre: 'Clásica / Cultural', flag: '🇨🇴', color: '#1e3a8a', stream: 'https://15453.live.streamtheworld.com/JAVERIANA_SC' },
  { id: 'blu',          name: 'BLU Radio',              country: 'CO', city: 'Bogotá',          genre: 'Noticias',        flag: '🇨🇴', color: '#1d4ed8', stream: 'https://19523.live.streamtheworld.com/BLU_RADIO_SC' },

  // ── México ────────────────────────────────────────────────────────────────
  { id: 'los40mx',      name: 'Los 40 México',          country: 'MX', city: 'CDMX',            genre: 'Pop / Top 40',    flag: '🇲🇽', color: '#15803d', stream: 'https://15993.live.streamtheworld.com/LOS40MX_SC' },
  { id: 'rock101mx',    name: 'Rock 101',               country: 'MX', city: 'CDMX',            genre: 'Rock',            flag: '🇲🇽', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ROCK_101_SC' },
  { id: 'exa',          name: 'Exa FM',                 country: 'MX', city: 'CDMX',            genre: 'Pop / Dance',     flag: '🇲🇽', color: '#e11d48', stream: 'https://15993.live.streamtheworld.com/EXAFM_SC' },
  { id: 'radioformula', name: 'Radio Fórmula',          country: 'MX', city: 'CDMX',            genre: 'Noticias',        flag: '🇲🇽', color: '#b91c1c', stream: 'https://1753.live.streamtheworld.com/RADIOFORMULA_SC' },
  { id: 'estereo',      name: 'Estéreo Joya',           country: 'MX', city: 'CDMX',            genre: 'Baladas / Clásicos', flag: '🇲🇽', color: '#a16207', stream: 'https://15993.live.streamtheworld.com/ESTEREO_JOYA_SC' },
  { id: 'horizonte',    name: 'Horizonte 107.9',        country: 'MX', city: 'CDMX',            genre: 'Soft Rock / Pop', flag: '🇲🇽', color: '#0f766e', stream: 'https://15993.live.streamtheworld.com/HORIZONTE_SC' },

  // ── Argentina ─────────────────────────────────────────────────────────────
  { id: 'fmmilenio',    name: 'FM Milenium',            country: 'AR', city: 'Buenos Aires',    genre: 'Pop / Hits',      flag: '🇦🇷', color: '#1d4ed8', stream: 'https://streams.milenium.fm/milenium128' },
  { id: 'rockandpop',   name: 'Rock & Pop',             country: 'AR', city: 'Buenos Aires',    genre: 'Rock',            flag: '🇦🇷', color: '#dc2626', stream: 'https://streaming.radios.com.ar/rockandpop' },
  { id: 'fmglobar',     name: 'FM Globo Argentina',     country: 'AR', city: 'Buenos Aires',    genre: 'Tropical / Cumbia', flag: '🇦🇷', color: '#ea580c', stream: 'https://streaming.radios.com.ar/globo' },
  { id: 'radio10',      name: 'Radio 10 AM',            country: 'AR', city: 'Buenos Aires',    genre: 'Noticias / Talk', flag: '🇦🇷', color: '#0369a1', stream: 'https://streaming.radios.com.ar/radio10' },
  { id: 'metro',        name: 'Metro 95.1',             country: 'AR', city: 'Buenos Aires',    genre: 'Indie / Pop',     flag: '🇦🇷', color: '#7c3aed', stream: 'https://streams.metro951.com.ar/metro' },

  // ── Chile ─────────────────────────────────────────────────────────────────
  { id: 'sonocl',       name: 'Sono Radio',             country: 'CL', city: 'Santiago',        genre: 'Pop / Hits',      flag: '🇨🇱', color: '#dc2626', stream: 'https://radio.streaming.cl/sono' },
  { id: 'futuro',       name: 'Futuro FM',              country: 'CL', city: 'Santiago',        genre: 'Alternativo / Rock', flag: '🇨🇱', color: '#4f46e5', stream: 'https://radio.streaming.cl/futuro' },
  { id: 'cooperativa',  name: 'Radio Cooperativa',      country: 'CL', city: 'Santiago',        genre: 'Noticias',        flag: '🇨🇱', color: '#1e40af', stream: 'https://radio.streaming.cl/cooperativa' },

  // ── Perú ──────────────────────────────────────────────────────────────────
  { id: 'studioppe',    name: 'Studio 92',              country: 'PE', city: 'Lima',            genre: 'Pop / Top 40',    flag: '🇵🇪', color: '#b45309', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/STUDIO92_SC' },
  { id: 'moda',         name: 'Moda FM Perú',           country: 'PE', city: 'Lima',            genre: 'Pop / Dance',     flag: '🇵🇪', color: '#db2777', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MODA_FM_SC' },

  // ── Venezuela ─────────────────────────────────────────────────────────────
  { id: 'losalpes',     name: 'Los Alpes 89.5',         country: 'VE', city: 'Caracas',         genre: 'Vallenato / Salsa', flag: '🇻🇪', color: '#b45309', stream: 'https://radio.streaming.ve/losalpes' },

  // ── Ecuador ───────────────────────────────────────────────────────────────
  { id: 'superec',      name: 'La Super 94.5',          country: 'EC', city: 'Quito',           genre: 'Pop / Noticias',  flag: '🇪🇨', color: '#0369a1', stream: 'https://n2.radio.co/n43a7cbf8f/listen' },

  // ── Brasil ────────────────────────────────────────────────────────────────
  { id: 'jovempan',     name: 'Jovem Pan FM',           country: 'BR', city: 'São Paulo',       genre: 'Pop / Rock',      flag: '🇧🇷', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOVEMPANFM_SC' },
  { id: 'bandnews',     name: 'BandNews FM',            country: 'BR', city: 'São Paulo',       genre: 'Noticias',        flag: '🇧🇷', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDNEWS_SC' },
  { id: 'radioglobo',   name: 'Rádio Globo',            country: 'BR', city: 'Rio de Janeiro',  genre: 'Talk / Deportes', flag: '🇧🇷', color: '#15803d', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_GLOBO_RJ_SC' },

  // ── España ────────────────────────────────────────────────────────────────
  { id: 'los40es',      name: 'Los 40 España',          country: 'ES', city: 'Madrid',          genre: 'Pop / Top 40',    flag: '🇪🇸', color: '#e11d48', stream: 'https://21093.live.streamtheworld.com/LOS40_SC' },
  { id: 'cadenaser',    name: 'Cadena SER',             country: 'ES', city: 'Madrid',          genre: 'Noticias / Talk', flag: '🇪🇸', color: '#b91c1c', stream: 'https://21093.live.streamtheworld.com/CADENA_SER_SC' },
  { id: 'cadenadial',   name: 'Cadena Dial',            country: 'ES', city: 'Madrid',          genre: 'Español / Baladas', flag: '🇪🇸', color: '#a21caf', stream: 'https://21093.live.streamtheworld.com/CADENA_DIAL_SC' },
  { id: 'europaes',     name: 'Europa FM España',       country: 'ES', city: 'Madrid',          genre: 'Dance / Electronic', flag: '🇪🇸', color: '#0891b2', stream: 'https://21093.live.streamtheworld.com/EUROPA_FM_SC' },
  { id: 'rock_fm_es',   name: 'Rock FM España',         country: 'ES', city: 'Madrid',          genre: 'Rock',            flag: '🇪🇸', color: '#7f1d1d', stream: 'https://21093.live.streamtheworld.com/ROCK_FM_SC' },
  { id: 'rnees',        name: 'RNE Radio Nacional',     country: 'ES', city: 'Madrid',          genre: 'Cultural / Clásica', flag: '🇪🇸', color: '#1e3a8a', stream: 'https://rtvestream.rtve.es/master/live/rne1/rne1.m3u8' },

  // ── Reino Unido ───────────────────────────────────────────────────────────
  { id: 'bbc1',         name: 'BBC Radio 1',            country: 'GB', city: 'Londres',         genre: 'Pop / Indie',     flag: '🇬🇧', color: '#1d4ed8', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one' },
  { id: 'bbc2',         name: 'BBC Radio 2',            country: 'GB', city: 'Londres',         genre: 'Pop / Clásicos',  flag: '🇬🇧', color: '#0f766e', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two' },
  { id: 'bbc3',         name: 'BBC Radio 3',            country: 'GB', city: 'Londres',         genre: 'Clásica / Jazz',  flag: '🇬🇧', color: '#7c3aed', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three' },
  { id: 'bbc4',         name: 'BBC Radio 4',            country: 'GB', city: 'Londres',         genre: 'Noticias / Talk', flag: '🇬🇧', color: '#374151', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm' },
  { id: 'bbcworld',     name: 'BBC World Service',      country: 'GB', city: 'Londres',         genre: 'Noticias Global', flag: '🇬🇧', color: '#1e40af', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
  { id: 'classicfm',    name: 'Classic FM UK',          country: 'GB', city: 'Londres',         genre: 'Clásica',         flag: '🇬🇧', color: '#6d28d9', stream: 'https://media-ice.musicradio.com/ClassicFMMP3' },
  { id: 'absolute',     name: 'Absolute Radio',         country: 'GB', city: 'Londres',         genre: 'Rock / Clásico',  flag: '🇬🇧', color: '#b45309', stream: 'https://icy.absolute.radio/absolute' },
  { id: 'kissfmuk',     name: 'KISS FM UK',             country: 'GB', city: 'Londres',         genre: 'Dance / Urban',   flag: '🇬🇧', color: '#dc2626', stream: 'https://media-ice.musicradio.com/KISSFMMP3' },

  // ── Estados Unidos ────────────────────────────────────────────────────────
  { id: 'jazz24',       name: 'Jazz24',                 country: 'US', city: 'Seattle',         genre: 'Jazz',            flag: '🇺🇸', color: '#92400e', stream: 'https://24523.live.streamtheworld.com/JAZZ24_SC' },
  { id: 'smoothjazz',   name: 'Smooth Jazz Global',     country: 'US', city: 'Online',          genre: 'Smooth Jazz',     flag: '🇺🇸', color: '#a16207', stream: 'https://19373.live.streamtheworld.com/SMOOTHJAZZ_SC' },
  { id: 'nprone',       name: 'NPR News',               country: 'US', city: 'Washington D.C.', genre: 'Noticias / Talk', flag: '🇺🇸', color: '#1e3a8a', stream: 'https://npr-ice.streamguys1.com/live.mp3' },
  { id: 'wnyc',         name: 'WNYC New York',          country: 'US', city: 'Nueva York',      genre: 'Noticias / Talk', flag: '🇺🇸', color: '#374151', stream: 'https://fm939.wnyc.org/wnycfm.aac' },
  { id: 'kexp',         name: 'KEXP 90.3',              country: 'US', city: 'Seattle',         genre: 'Indie / Alternativo', flag: '🇺🇸', color: '#4f46e5', stream: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
  { id: 'kroq',         name: 'KROQ Los Ángeles',       country: 'US', city: 'Los Ángeles',     genre: 'Rock / Alternative', flag: '🇺🇸', color: '#dc2626', stream: 'https://15923.live.streamtheworld.com/KROQFMAAC_SC' },
  { id: 'z100',         name: 'Z100 New York',          country: 'US', city: 'Nueva York',      genre: 'Pop / Top 40',    flag: '🇺🇸', color: '#db2777', stream: 'https://19923.live.streamtheworld.com/WHTZ_FM_SC' },
  { id: 'hot97',        name: 'HOT 97 New York',        country: 'US', city: 'Nueva York',      genre: 'Hip-Hop / R&B',   flag: '🇺🇸', color: '#ea580c', stream: 'https://19993.live.streamtheworld.com/WQHTFMAAC_SC' },
  { id: 'power105',     name: 'Power 105.1',            country: 'US', city: 'Nueva York',      genre: 'Hip-Hop / Urban', flag: '🇺🇸', color: '#7c3aed', stream: 'https://15963.live.streamtheworld.com/WWPRFMAAC_SC' },
  { id: 'classicalmp',  name: 'Classical MPR',          country: 'US', city: 'Minneapolis',     genre: 'Clásica',         flag: '🇺🇸', color: '#1e3a8a', stream: 'https://classicalmp3.streamguys1.com/classical128.mp3' },

  // ── Francia ───────────────────────────────────────────────────────────────
  { id: 'franceinter',  name: 'France Inter',           country: 'FR', city: 'París',           genre: 'Noticias / Cultural', flag: '🇫🇷', color: '#1d4ed8', stream: 'https://icecast.radiofrance.fr/franceinter-hifi.aac' },
  { id: 'franceinfo',   name: 'France Info',            country: 'FR', city: 'París',           genre: 'Noticias',        flag: '🇫🇷', color: '#0369a1', stream: 'https://icecast.radiofrance.fr/franceinfo-hifi.aac' },
  { id: 'francemusique',name: 'France Musique',         country: 'FR', city: 'París',           genre: 'Clásica / Jazz',  flag: '🇫🇷', color: '#7c3aed', stream: 'https://icecast.radiofrance.fr/francemusique-hifi.aac' },
  { id: 'nrjfr',        name: 'NRJ France',             country: 'FR', city: 'París',           genre: 'Pop / Dance',     flag: '🇫🇷', color: '#e11d48', stream: 'https://cdn.nrjaudio.fm/audio1/fr/30001/mp3_128.mp3' },
  { id: 'rfifr',        name: 'RFI Français',           country: 'FR', city: 'París',           genre: 'Noticias Global', flag: '🇫🇷', color: '#0f766e', stream: 'https://live02.rfi.fr/rfi-francais-128k.mp3' },

  // ── Alemania ──────────────────────────────────────────────────────────────
  { id: 'deutschefm',   name: 'Deutschlandfunk',        country: 'DE', city: 'Colonia',         genre: 'Noticias / Cultural', flag: '🇩🇪', color: '#1e40af', stream: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3' },
  { id: 'deutschekultur',name: 'Deutschlandradio Kultur',country:'DE', city: 'Berlín',          genre: 'Clásica / Jazz',  flag: '🇩🇪', color: '#6d28d9', stream: 'https://st01.sslstream.dlf.de/dlf/02/128/mp3/stream.mp3' },
  { id: 'energy_de',    name: 'Energy Germany',         country: 'DE', city: 'Berlín',          genre: 'Dance / Pop',     flag: '🇩🇪', color: '#dc2626', stream: 'https://stream.energy.de/radio/energy_national' },
  { id: 'antennede',    name: 'Antenne Bayern',         country: 'DE', city: 'Múnich',          genre: 'Pop / Hits',      flag: '🇩🇪', color: '#0891b2', stream: 'https://stream.antenne.de/antenne' },

  // ── Italia ────────────────────────────────────────────────────────────────
  { id: 'rai1',         name: 'RAI Radio 1',            country: 'IT', city: 'Roma',            genre: 'Noticias / Talk', flag: '🇮🇹', color: '#15803d', stream: 'https://icestreaming.rai.it/1.mp3' },
  { id: 'rai2',         name: 'RAI Radio 2',            country: 'IT', city: 'Roma',            genre: 'Pop / Rock',      flag: '🇮🇹', color: '#b45309', stream: 'https://icestreaming.rai.it/2.mp3' },
  { id: 'rai3',         name: 'RAI Radio 3',            country: 'IT', city: 'Roma',            genre: 'Clásica / Cultura', flag: '🇮🇹', color: '#7c3aed', stream: 'https://icestreaming.rai.it/3.mp3' },
  { id: 'rdsit',        name: 'RDS 100%',               country: 'IT', city: 'Génova',          genre: 'Pop / Top 40',    flag: '🇮🇹', color: '#dc2626', stream: 'https://streaming.rds.it/rds.mp3' },

  // ── Portugal ──────────────────────────────────────────────────────────────
  { id: 'radiocomercial', name: 'Rádio Comercial',      country: 'PT', city: 'Lisboa',          genre: 'Pop / Hits',      flag: '🇵🇹', color: '#dc2626', stream: 'https://mediaserver.rtp.pt/radiocomercial' },
  { id: 'renascenca',   name: 'Rádio Renascença',       country: 'PT', city: 'Lisboa',          genre: 'Noticias / Pop',  flag: '🇵🇹', color: '#1d4ed8', stream: 'https://mediaserver.rtp.pt/renascenca' },

  // ── Países Bajos ──────────────────────────────────────────────────────────
  { id: 'radio1nl',     name: 'Radio 1 NL',             country: 'NL', city: 'Amsterdam',       genre: 'Noticias',        flag: '🇳🇱', color: '#dc2626', stream: 'https://icecast.omroep.nl/radio1-bb-mp3' },
  { id: 'radio2nl',     name: 'Radio 2 NL',             country: 'NL', city: 'Amsterdam',       genre: 'Pop / Clásicos',  flag: '🇳🇱', color: '#ea580c', stream: 'https://icecast.omroep.nl/radio2-bb-mp3' },
  { id: 'qmusicnl',     name: 'Qmusic NL',              country: 'NL', city: 'Amsterdam',       genre: 'Dance / Pop',     flag: '🇳🇱', color: '#e11d48', stream: 'https://stream.qmusic.nl/qmusic/mp3' },

  // ── Bélgica ───────────────────────────────────────────────────────────────
  { id: 'mnmbe',        name: 'MNM Belgium',            country: 'BE', city: 'Bruselas',        genre: 'Pop / Dance',     flag: '🇧🇪', color: '#db2777', stream: 'https://icecast.vrt.be/mnm-high.mp3' },
  { id: 'studio_bru',   name: 'Studio Brussel',         country: 'BE', city: 'Bruselas',        genre: 'Indie / Rock',    flag: '🇧🇪', color: '#4f46e5', stream: 'https://icecast.vrt.be/stubru-high.mp3' },

  // ── Suiza ─────────────────────────────────────────────────────────────────
  { id: 'sr3ch',        name: 'SRF 3',                  country: 'CH', city: 'Zúrich',          genre: 'Pop / Rock',      flag: '🇨🇭', color: '#dc2626', stream: 'https://stream.srg-ssr.ch/m/drs3/mp3_128' },
  { id: 'rsich',        name: 'RSI Rete Uno',           country: 'CH', city: 'Lugano',          genre: 'Pop / Talk',      flag: '🇨🇭', color: '#0369a1', stream: 'https://stream.srg-ssr.ch/m/la1ere/mp3_128' },

  // ── Austria ───────────────────────────────────────────────────────────────
  { id: 'orf1at',       name: 'Ö1 Austria',             country: 'AT', city: 'Viena',           genre: 'Clásica / Jazz',  flag: '🇦🇹', color: '#7c3aed', stream: 'https://orf-live.ors-shoutcast.at/oe1-q2a' },
  { id: 'orf3at',       name: 'FM4 Austria',            country: 'AT', city: 'Viena',           genre: 'Indie / Alternativo', flag: '🇦🇹', color: '#0891b2', stream: 'https://orf-live.ors-shoutcast.at/fm4-q2a' },

  // ── Suecia ────────────────────────────────────────────────────────────────
  { id: 'sr_p3',        name: 'SR P3 Sverige',          country: 'SE', city: 'Estocolmo',       genre: 'Pop / Rock',      flag: '🇸🇪', color: '#1d4ed8', stream: 'https://sverigesradio.se/topsy/direkt/srapi/2562.mp3' },
  { id: 'sr_p4',        name: 'SR P4 Sverige',          country: 'SE', city: 'Estocolmo',       genre: 'Pop / Clásicos',  flag: '🇸🇪', color: '#0f766e', stream: 'https://sverigesradio.se/topsy/direkt/srapi/2576.mp3' },

  // ── Noruega ───────────────────────────────────────────────────────────────
  { id: 'nrk1no',       name: 'NRK P1',                 country: 'NO', city: 'Oslo',            genre: 'Pop / Talk',      flag: '🇳🇴', color: '#dc2626', stream: 'https://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_mp3_hq' },
  { id: 'p3no',         name: 'NRK P3',                 country: 'NO', city: 'Oslo',            genre: 'Pop / Indie',     flag: '🇳🇴', color: '#7c3aed', stream: 'https://lyd.nrk.no/nrk_radio_p3_mp3_hq' },

  // ── Dinamarca ─────────────────────────────────────────────────────────────
  { id: 'dr_p4',        name: 'DR P4',                  country: 'DK', city: 'Copenhague',      genre: 'Pop / Clásicos',  flag: '🇩🇰', color: '#e11d48', stream: 'https://live-icy.gss.dr.dk/A/A08H.mp3' },
  { id: 'dr_p6',        name: 'DR P6 Beat',             country: 'DK', city: 'Copenhague',      genre: 'Jazz / Soul / Funk', flag: '🇩🇰', color: '#b45309', stream: 'https://live-icy.gss.dr.dk/A/A28H.mp3' },

  // ── Finlandia ─────────────────────────────────────────────────────────────
  { id: 'yle1fi',       name: 'Yle Radio 1',            country: 'FI', city: 'Helsinki',        genre: 'Clásica / Cultural', flag: '🇫🇮', color: '#1e40af', stream: 'https://yle-radio1.akamaized.net/hls/live/622886/radio1fi/master.m3u8' },

  // ── Japón ─────────────────────────────────────────────────────────────────
  { id: 'nhkworld',     name: 'NHK World Radio',        country: 'JP', city: 'Tokio',           genre: 'Noticias Global', flag: '🇯🇵', color: '#1e3a8a', stream: 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index_1M.m3u8' },
  { id: 'tokyofm',      name: 'Tokyo FM',               country: 'JP', city: 'Tokio',           genre: 'J-Pop / Pop',     flag: '🇯🇵', color: '#dc2626', stream: 'https://cssjp-i.akamaihd.net/hls/live/571329/tokyofm/master.m3u8' },

  // ── Corea del Sur ────────────────────────────────────────────────────────
  { id: 'kbsworld',     name: 'KBS World Radio',        country: 'KR', city: 'Seúl',            genre: 'Noticias / K-Pop', flag: '🇰🇷', color: '#0369a1', stream: 'https://kbsworld.kbs.co.kr/kbsworld_live_stream.m3u8' },

  // ── Australia ─────────────────────────────────────────────────────────────
  { id: 'tripleJ',      name: 'Triple J',               country: 'AU', city: 'Sídney',          genre: 'Indie / Alternativo', flag: '🇦🇺', color: '#dc2626', stream: 'https://live-radio01.mediahubaustralia.com/2TJW_stream' },
  { id: 'abc_classic',  name: 'ABC Classic FM',         country: 'AU', city: 'Sídney',          genre: 'Clásica',         flag: '🇦🇺', color: '#6d28d9', stream: 'https://live-radio01.mediahubaustralia.com/2CLA_stream' },
  { id: 'nova_au',      name: 'Nova 96.9',              country: 'AU', city: 'Sídney',          genre: 'Pop / Top 40',    flag: '🇦🇺', color: '#0891b2', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVA969_SC' },

  // ── India ─────────────────────────────────────────────────────────────────
  { id: 'airin',        name: 'AIR National',           country: 'IN', city: 'Nueva Delhi',     genre: 'Cultural / Talk', flag: '🇮🇳', color: '#ea580c', stream: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8' },

  // ── Rusia ─────────────────────────────────────────────────────────────────
  { id: 'mayorru',      name: 'Radio Mayak',            country: 'RU', city: 'Moscú',           genre: 'Pop / Clásicos',  flag: '🇷🇺', color: '#dc2626', stream: 'https://icecast.vgtrk.cdnvideo.ru/mayak_aac' },
  { id: 'russiaru',     name: 'Radio Russia',           country: 'RU', city: 'Moscú',           genre: 'Noticias / Talk', flag: '🇷🇺', color: '#1d4ed8', stream: 'https://icecast.vgtrk.cdnvideo.ru/rrzonam_aac' },

  // ── Sudáfrica ─────────────────────────────────────────────────────────────
  { id: '947za',        name: '947 Joburg',             country: 'ZA', city: 'Johannesburgo',   genre: 'Pop / Top 40',    flag: '🇿🇦', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/947_SC' },
  { id: 'safm',         name: 'SAFM',                   country: 'ZA', city: 'Johannesburgo',   genre: 'Noticias / Talk', flag: '🇿🇦', color: '#0369a1', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SAFM_SC' },

  // ── Canales temáticos globales online ─────────────────────────────────────
  { id: 'lofi',         name: 'Lofi Hip-Hop Radio',     country: '🌐', city: 'Online',          genre: 'Lofi / Chill',    flag: '🎵', color: '#0891b2', stream: 'https://usa9.fastcast4u.com/proxy/jamz?mp=/1' },
  { id: 'chillstep',    name: 'ChillStep Radio',        country: '🌐', city: 'Online',          genre: 'Chillstep / Ambient', flag: '🎵', color: '#4f46e5', stream: 'https://icecast2.atemio.de/chill' },
  { id: 'deephouse',    name: 'Deep House Radio',       country: '🌐', city: 'Online',          genre: 'Deep House',      flag: '🎵', color: '#7c3aed', stream: 'https://deep.driven.fm' },
  { id: 'trance',       name: 'DI.FM Trance',           country: '🌐', city: 'Online',          genre: 'Trance / EDM',    flag: '🎵', color: '#6d28d9', stream: 'https://prem4.di.fm/trance' },
  { id: 'rockclassics', name: 'Rock Classics Radio',    country: '🌐', city: 'Online',          genre: 'Rock Clásico',    flag: '🎵', color: '#dc2626', stream: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
  { id: 'metal',        name: 'Metal Radio',            country: '🌐', city: 'Online',          genre: 'Metal / Heavy',   flag: '🎵', color: '#1c1917', stream: 'https://streams.ilovemusic.de/iloveradio28.mp3' },
  { id: 'salsa',        name: 'Salsa Internacional',    country: '🌐', city: 'Online',          genre: 'Salsa / Tropical', flag: '🎵', color: '#ea580c', stream: 'https://icecast.omroep.nl/funx-salsa-bb-mp3' },
  { id: 'reggae',       name: 'Reggae Radio',           country: '🌐', city: 'Online',          genre: 'Reggae / Dancehall', flag: '🎵', color: '#15803d', stream: 'https://streams.ilovemusic.de/iloveradio16.mp3' },
  { id: 'randb',        name: 'R&B Soul Radio',         country: '🌐', city: 'Online',          genre: 'R&B / Soul',      flag: '🎵', color: '#a21caf', stream: 'https://streams.ilovemusic.de/iloveradio5.mp3' },
  { id: 'country',      name: 'Country Radio',          country: '🌐', city: 'Online',          genre: 'Country',         flag: '🎵', color: '#92400e', stream: 'https://streams.ilovemusic.de/iloveradio11.mp3' },
  { id: 'classical',    name: 'Classical Radio',        country: '🌐', city: 'Online',          genre: 'Clásica',         flag: '🎵', color: '#1e3a8a', stream: 'https://streams.ilovemusic.de/iloveradio19.mp3' },
  { id: 'jazzglobal',   name: 'Jazz Radio Global',      country: '🌐', city: 'Online',          genre: 'Jazz',            flag: '🎵', color: '#b45309', stream: 'https://streams.ilovemusic.de/iloveradio21.mp3' },
  { id: 'bossa',        name: 'Bossa Nova Radio',       country: '🌐', city: 'Online',          genre: 'Bossa Nova / Samba', flag: '🎵', color: '#0f766e', stream: 'https://streams.ilovemusic.de/iloveradio30.mp3' },
  { id: 'flamenco',     name: 'Flamenco Radio',         country: '🌐', city: 'Online',          genre: 'Flamenco / Español', flag: '🎵', color: '#dc2626', stream: 'https://streams.ilovemusic.de/iloveradio27.mp3' },
  { id: 'piano',        name: 'Piano & Relax',          country: '🌐', city: 'Online',          genre: 'Piano / Relax',   flag: '🎵', color: '#6d28d9', stream: 'https://icecast2.atemio.de/piano' },
];

// Géneros únicos para filtro
const GENRES = ['Todos', ...Array.from(new Set(STATIONS.map((s) => s.genre))).sort()];

// Regiones para filtro
const REGIONS = [
  { key: 'all',    label: 'Todo el mundo' },
  { key: 'CO',     label: '🇨🇴 Colombia' },
  { key: 'latam',  label: '🌎 Latinoamérica' },
  { key: 'europe', label: '🇪🇺 Europa' },
  { key: 'US',     label: '🇺🇸 EE.UU.' },
  { key: 'world',  label: '🌐 Global / Online' },
  { key: 'other',  label: '🌏 Resto del mundo' },
];

const REGION_COUNTRIES = {
  CO:     ['CO'],
  latam:  ['MX', 'AR', 'CL', 'PE', 'VE', 'EC', 'BR'],
  europe: ['ES', 'GB', 'FR', 'DE', 'IT', 'PT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'],
  US:     ['US'],
  world:  ['🌐'],
  other:  ['JP', 'KR', 'AU', 'IN', 'RU', 'ZA'],
};

function PlayIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}
function PauseIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>;
}
function VolumeIcon({ level }) {
  if (level === 0) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
  if (level < 0.5) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function SignalBars({ active }) {
  return (
    <span className={`flex items-end gap-[2px] ${active ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} aria-hidden="true">
      {[4, 6, 8, 10].map((h, i) => (
        <span key={i} className="w-1 rounded-sm bg-current" style={{ height: `${h}px`, opacity: active ? 1 : 0.35 }} />
      ))}
    </span>
  );
}

function RadioIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
      <line x1="2" y1="20" x2="2.01" y2="20" />
    </svg>
  );
}

function AudioPage() {
  const audioRef = useRef(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIO_VOLUME);
    return stored !== null ? parseFloat(stored) : 0.75;
  });
  const [filterGenre, setFilterGenre] = useState('Todos');
  const [filterRegion, setFilterRegion] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    localStorage.setItem(STORAGE_KEYS.AUDIO_VOLUME, String(volume));
  }, [volume]);

  function playStation(station) {
    setError('');
    if (currentStation?.id === station.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    setCurrentStation(station);
    setIsLoading(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.src = station.stream;
      audioRef.current.volume = volume;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setIsLoading(false); })
        .catch(() => {
          setIsLoading(false);
          setError(`No se pudo conectar. Intenta otra emisora.`);
        });
    }
  }

  function handlePlayPause() {
    if (!audioRef.current || !currentStation) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }

  const visibleStations = STATIONS.filter((s) => {
    const genreMatch = filterGenre === 'Todos' || s.genre === filterGenre;
    const regionMatch = filterRegion === 'all' ||
      (REGION_COUNTRIES[filterRegion]?.includes(s.country)) ||
      (filterRegion === 'world' && s.country === '🌐');
    const q = search.toLowerCase();
    const searchMatch = !search ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q);
    return genreMatch && regionMatch && searchMatch;
  });

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Header */}
      <div>
        <p className="section-eyebrow">Ambiente</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Radio en vivo
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {STATIONS.length} emisoras de Colombia y el mundo — selecciona y escucha al instante
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

        {/* ── Station browser ── */}
        <div className="flex flex-col gap-4">

          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </span>
            <input
              className="input pl-9"
              placeholder={`Buscar entre ${STATIONS.length} emisoras...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Region tabs */}
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setFilterRegion(r.key)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  filterRegion === r.key
                    ? 'border-brand-600 bg-brand-600 text-white shadow-glow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Genre select */}
          <select
            className="input"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            {GENRES.map((g) => <option key={g}>{g}</option>)}
          </select>

          {/* Results count */}
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {visibleStations.length} emisora{visibleStations.length !== 1 ? 's' : ''} encontrada{visibleStations.length !== 1 ? 's' : ''}
          </p>

          {/* Station grid */}
          <div className="grid gap-2 sm:grid-cols-2">
            {visibleStations.length === 0 && (
              <p className="col-span-2 py-10 text-center text-sm text-slate-400">Sin emisoras para este filtro.</p>
            )}
            {visibleStations.map((station) => {
              const active = currentStation?.id === station.id;
              const playing = active && isPlaying;
              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => playStation(station)}
                  className={`group flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                    active
                      ? 'scale-[1.01] shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-card dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                  style={active ? {
                    background: `linear-gradient(135deg, ${station.color}18, ${station.color}06)`,
                    borderColor: `${station.color}50`,
                  } : {}}
                  aria-pressed={playing}
                  aria-label={`${playing ? 'Pausar' : 'Reproducir'} ${station.name}`}
                >
                  {/* Icon */}
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
                    style={{ backgroundColor: station.color }}
                  >
                    {active && isLoading
                      ? <Spinner size="sm" className="text-white" />
                      : playing
                      ? <PauseIcon />
                      : <span>{station.flag}</span>}
                  </div>
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white leading-tight">{station.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{station.genre} · {station.city}</p>
                  </div>
                  {/* Signal */}
                  <div className="flex-shrink-0 pr-0.5">
                    <SignalBars active={playing} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Now playing ── */}
        <div className="card flex flex-col overflow-hidden lg:sticky lg:top-20 lg:self-start">
          {/* Gradient header */}
          <div
            className="flex h-36 flex-col items-center justify-center gap-3 transition-all duration-700"
            style={{
              background: currentStation
                ? `linear-gradient(135deg, ${currentStation.color}dd, ${currentStation.color}88)`
                : 'linear-gradient(135deg, #0d9488cc, #0891b2aa)',
            }}
          >
            <div className={`text-white/40 transition-transform duration-500 ${isPlaying ? 'scale-110' : ''}`}>
              <RadioIcon size={40} />
            </div>
            {isPlaying && (
              <div className="flex items-end gap-[3px]" aria-label="En reproducción">
                {[1,2,3,4,5,6].map((i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-white/75"
                    style={{
                      height: `${6 + (i % 3) * 6}px`,
                      animation: `bounceGentle 0.${3 + i}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5">
            {/* Station info */}
            <div className="mb-5 min-h-[64px]">
              {currentStation ? (
                <>
                  <p className="font-display text-base font-bold leading-snug text-slate-900 dark:text-white">{currentStation.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {currentStation.flag} {currentStation.city} · {currentStation.country}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{currentStation.genre}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isPlaying
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : isLoading
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        isPlaying ? 'bg-emerald-500 animate-pulse' : isLoading ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {isPlaying ? 'En vivo' : isLoading ? 'Conectando...' : 'Detenido'}
                    </span>
                  </div>
                  {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-3 text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Ninguna emisora activa</p>
                  <p className="mt-1 text-xs text-slate-400">Selecciona una de la lista</p>
                </div>
              )}
            </div>

            {/* Play/pause */}
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={!currentStation || isLoading}
                className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: currentStation?.color ?? '#0d9488' }}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isLoading ? <Spinner className="text-white" /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>

            {/* Volume */}
            <div className="mt-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => setVolume((v) => (v > 0 ? 0 : 0.75))}
                className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
              >
                <VolumeIcon level={volume} />
              </button>
              <input
                type="range" min="0" max="1" step="0.02"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-current"
                style={{ background: `linear-gradient(to right, ${currentStation?.color ?? '#0d9488'} ${volume * 100}%, #e2e8f0 ${volume * 100}%)` }}
                aria-label="Volumen"
              />
              <span className="w-8 flex-shrink-0 text-right text-xs text-slate-400">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <audio
            ref={audioRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setIsPlaying(false);
              if (currentStation) setError(`No se pudo conectar a ${currentStation.name}.`);
            }}
            className="sr-only"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPage;
