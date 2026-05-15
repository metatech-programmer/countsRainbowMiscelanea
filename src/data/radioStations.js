// ─── RADIO STATION CATALOG ────────────────────────────────────────────────────
// All streams use CDN-backed, stable endpoints. StreamTheWorld redirects are
// preferred for major stations as they handle geo-failover automatically.

export const STATIONS = [
  // ══════════════════════════════════════════════════════════════════════════
  // COLOMBIA
  // ══════════════════════════════════════════════════════════════════════════
  // ── Nacionales (streams verificados vía radio-browser.info) ─────────────
  { id: 'co-radiouno',   name: 'Radio Uno',             country: 'CO', city: 'Pereira',          genre: 'Tropical',    flag: '🇨🇴', color: '#f59e0b', stream: 'https://us-b4-p-e-qg12-audio.cdn.mdstrm.com/live-audio-aw/632ce1416197360894629aa6' },
  { id: 'co-los40',      name: 'Los 40 Colombia',       country: 'CO', city: 'Bogotá',           genre: 'Pop/Hits',    flag: '🇨🇴', color: '#e11d48', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_COLOMBIAAAC.aac' },
  { id: 'co-caracol',    name: 'Caracol Radio',         country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#dc2626', stream: 'http://27323.live.streamtheworld.com:3690/CARACOL_RADIOAAC_SC' },
  { id: 'co-blu',        name: 'BLU Radio',             country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#1d4ed8', stream: 'http://27433.live.streamtheworld.com:3690/BLURADIO_SC' },
  { id: 'co-w',          name: 'W Radio',               country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#dc2626', stream: 'http://26653.live.streamtheworld.com/WRADIO_SC' },
  { id: 'co-lafm',       name: 'La FM',                 country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#2563eb', stream: 'https://mdstrm.com/audio/632c9b23d1dcd7027f32f7fe/live.m3u8' },
  { id: 'co-rcn',        name: 'RCN Radio',             country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RCNRADIOBOG_SC' },
  { id: 'co-olimpica',   name: 'Olímpica Estéreo',      country: 'CO', city: 'Medellín',         genre: 'Tropical',    flag: '🇨🇴', color: '#059669', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OLP_MEDELLINAAC.aac' },
  { id: 'co-tropicana',  name: 'Tropicana',             country: 'CO', city: 'Bogotá',           genre: 'Tropical',    flag: '🇨🇴', color: '#d97706', stream: 'http://26673.live.streamtheworld.com:3690/TROPICANA_SC' },
  { id: 'co-vibra',      name: 'Vibra',                 country: 'CO', city: 'Bogotá',           genre: 'Pop/Hits',    flag: '🇨🇴', color: '#db2777', stream: 'http://24063.live.streamtheworld.com/VIBRAAAC_SC' },
  { id: 'co-la960',      name: 'La 96.0',               country: 'CO', city: 'Medellín',         genre: 'Pop/Hits',    flag: '🇨🇴', color: '#f97316', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LA960_SC' },
  { id: 'co-amor',       name: 'Amor Estéreo',          country: 'CO', city: 'Pasto',            genre: 'Romántica',   flag: '🇨🇴', color: '#ec4899', stream: 'https://stream.zeno.fm/aycnet07h0hvv' },
  { id: 'co-besame',     name: 'Bésame',                country: 'CO', city: 'Medellín',         genre: 'Romántica',   flag: '🇨🇴', color: '#be185d', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BESAME_MEDELLINAAC.aac' },
  { id: 'co-luna',       name: 'Luna Estéreo',          country: 'CO', city: 'Bogotá',           genre: 'Baladas',     flag: '🇨🇴', color: '#9333ea', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LUNA_SC' },
  { id: 'co-oxigeno',    name: 'Oxígeno',               country: 'CO', city: 'Bogotá',           genre: 'Rock',        flag: '🇨🇴', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OXIGENO_SC' },
  { id: 'co-radionica',  name: 'Radiónica',             country: 'CO', city: 'Bogotá',           genre: 'Alternativo', flag: '🇨🇴', color: '#0891b2', stream: 'http://shoutcast.rtvc.gov.co:8010/;' },
  { id: 'co-javeriana',  name: 'Javeriana Estéreo',     country: 'CO', city: 'Bogotá',           genre: 'Cultural',    flag: '🇨🇴', color: '#0369a1', stream: 'https://radio06.cehis.net:9001/stream' },
  { id: 'co-unal',       name: 'UN Radio',              country: 'CO', city: 'Bogotá',           genre: 'Cultural',    flag: '🇨🇴', color: '#15803d', stream: 'https://radio.unal.edu.co/streaming/bogota/;stream.mp3' },
  { id: 'co-candela',    name: 'Candela Estéreo',       country: 'CO', city: 'Bogotá',           genre: 'Tropical',    flag: '🇨🇴', color: '#ea580c', stream: 'http://24403.live.streamtheworld.com:3690/CANDELAESTEREO_SC' },
  { id: 'co-colmundo',   name: 'Radio Colmundo',        country: 'CO', city: 'Bogotá',           genre: 'Noticias',    flag: '🇨🇴', color: '#0f172a', stream: 'https://streaming.shoutcast.com/colmundo-radio-bogota' },
  { id: 'co-super',      name: 'La Super',              country: 'CO', city: 'Bogotá',           genre: 'Tropical',    flag: '🇨🇴', color: '#7c3aed', stream: 'https://stream-154.zeno.fm/udaw685yezzuv' },
  { id: 'co-minuto',     name: 'Minuto de Dios',        country: 'CO', city: 'Bogotá',           genre: 'Gospel',      flag: '🇨🇴', color: '#0ea5e9', stream: 'https://tupanel.info:2000/public/2digitalradioHDsslLIVE016' },
  { id: 'co-laser',      name: 'Laser 102.3',           country: 'CO', city: 'Bogotá',           genre: 'Rock',        flag: '🇨🇴', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LASER_SC' },
  { id: 'co-hit',        name: 'Hit FM',                country: 'CO', city: 'Bogotá',           genre: 'Pop/Hits',    flag: '🇨🇴', color: '#f43f5e', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/HITFM_SC' },

  // ── Boyacá / Tunja (streams verificados vía radio-browser.info) ──────────
  { id: 'co-tun-tropicalisima', name: 'Tropicalisima FM',    country: 'CO', city: 'Tunja',      genre: 'Tropical',    flag: '🇨🇴', color: '#ea580c', stream: 'http://stream.zeno.fm/vp6ab0schg8uv' },
  { id: 'co-tun-techno',        name: 'Techno Record FM',    country: 'CO', city: 'Tunja',      genre: 'Electrónica', flag: '🇨🇴', color: '#7c3aed', stream: 'http://stream.zeno.fm/r3d2u9pu87zuv' },
  { id: 'co-tun-ciudad',        name: 'Ciudad Estéreo 94.7', country: 'CO', city: 'Tunja',      genre: 'Pop/Hits',    flag: '🇨🇴', color: '#1d4ed8', stream: 'http://stream.zeno.fm/5g2k2a6wd5zuv' },
  { id: 'co-tun-cactus',        name: 'Cactus FM',           country: 'CO', city: 'Tunja',      genre: 'Pop/Hits',    flag: '🇨🇴', color: '#16a34a', stream: 'http://stream.zeno.fm/frz47rqv4f0uv' },
  { id: 'co-tun-cooservicios',  name: 'Cooservicios Estéreo',country: 'CO', city: 'Tunja',      genre: 'Variado',     flag: '🇨🇴', color: '#0891b2', stream: 'http://stream.zeno.fm/27g88q2snd0uv' },
  { id: 'co-tun-chipazaque',    name: 'Radio Chipazaque',    country: 'CO', city: 'Tunja',      genre: 'Variado',     flag: '🇨🇴', color: '#059669', stream: 'http://stream.zeno.fm/9k31xz9004zuv' },
  { id: 'co-tun-wor',           name: 'WOR FM Rock & Pop',   country: 'CO', city: 'Tunja',      genre: 'Rock',        flag: '🇨🇴', color: '#dc2626', stream: 'http://stream.zeno.fm/5mss6vk214zuv' },
  { id: 'co-tun-sonora',        name: 'La Sonora 89.1',      country: 'CO', city: 'Tunja',      genre: 'Tropical',    flag: '🇨🇴', color: '#d97706', stream: 'https://sonic.paulatina.co/7068/stream' },
  { id: 'co-tun-r2',            name: 'R2 Audiovisual Radio',country: 'CO', city: 'Tunja',      genre: 'Variado',     flag: '🇨🇴', color: '#374151', stream: 'https://stream-151.zeno.fm/bufaptza04zuv' },
  { id: 'co-boy-lajefa',        name: 'La Jefa 1300 AM',     country: 'CO', city: 'Boyacá',     genre: 'Variado',     flag: '🇨🇴', color: '#b45309', stream: 'https://sonic.paulatina.co/7046/stream' },
  { id: 'co-boy-voz',           name: 'Voz de la Capilla',   country: 'CO', city: 'Boyacá',     genre: 'Gospel',      flag: '🇨🇴', color: '#9333ea', stream: 'https://sonic.paulatina.co/7446/stream' },
  { id: 'co-boy-calidad',       name: 'Calidad Estéreo 100.6',country: 'CO', city: 'Boyacá',    genre: 'Tropical',    flag: '🇨🇴', color: '#f97316', stream: 'https://sonic.paulatina.co/7070/stream.mp3/live' },
  { id: 'co-boy-cerinza',       name: 'Cerinza FM 100.6',    country: 'CO', city: 'Cerinza',    genre: 'Variado',     flag: '🇨🇴', color: '#0891b2', stream: 'https://radio25.virtualtronics.com/proxy/cerinzafm?mp=/;' },
  { id: 'co-boy-voztierra',     name: 'Voz de mi Tierrita',  country: 'CO', city: 'Boyacá',     genre: 'Variado',     flag: '🇨🇴', color: '#15803d', stream: 'https://radiohd4.streaminghd.co:8040/stream' },

  // ══════════════════════════════════════════════════════════════════════════
  // MEXICO (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'mx-los40',      name: 'Los 40 Mexico',         country: 'MX', city: 'Ciudad de México', genre: 'Pop/Hits',    flag: '🇲🇽', color: '#16a34a', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_MEXICOAAC.aac' },
  { id: 'mx-rock101',    name: 'Rock 101',              country: 'MX', city: 'Ciudad de México', genre: 'Rock',        flag: '🇲🇽', color: '#dc2626', stream: 'https://s3.radio.co/s2c1cebae5/listen' },
  { id: 'mx-exa',        name: 'Exa FM',                country: 'MX', city: 'Ciudad de México', genre: 'Pop',         flag: '🇲🇽', color: '#7c3aed', stream: 'http://18213.live.streamtheworld.com/XHEXA_SC' },
  { id: 'mx-formula',    name: 'Radio Fórmula',         country: 'MX', city: 'Ciudad de México', genre: 'Noticias',    flag: '🇲🇽', color: '#0284c7', stream: 'https://mdstrm.com/audio/6102ce7ef33d0b0830ec3adc/live.m3u8' },
  { id: 'mx-horizonte',  name: 'Horizonte 107.9',       country: 'MX', city: 'Ciudad de México', genre: 'Jazz/Blues',  flag: '🇲🇽', color: '#0891b2', stream: 'https://s2.mexside.net:8014/stream' },
  { id: 'mx-mvs',        name: 'MVS Noticias',          country: 'MX', city: 'Ciudad de México', genre: 'Noticias',    flag: '🇲🇽', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/XHMVSFM_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARGENTINA (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'ar-mitre',      name: 'Radio Mitre',           country: 'AR', city: 'Buenos Aires',     genre: 'Noticias',    flag: '🇦🇷', color: '#dc2626', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/AM790_56AAC.aac' },
  { id: 'ar-la100',      name: 'La 100',                country: 'AR', city: 'Buenos Aires',     genre: 'Pop',         flag: '🇦🇷', color: '#db2777', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/FM999_56.mp3' },
  { id: 'ar-nacional',   name: 'Radio Nacional',        country: 'AR', city: 'Buenos Aires',     genre: 'Cultural',    flag: '🇦🇷', color: '#15803d', stream: 'https://sa.mp3.icecast.magma.edge-access.net/sc_rad1' },
  { id: 'ar-metro',      name: 'Metro 95.1',            country: 'AR', city: 'Buenos Aires',     genre: 'Pop/Hits',    flag: '🇦🇷', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/METRO.mp3' },
  { id: 'ar-nacional-rock', name: 'Nacional Rock',      country: 'AR', city: 'Buenos Aires',     genre: 'Rock',        flag: '🇦🇷', color: '#dc2626', stream: 'https://sa.mp3.icecast.magma.edge-access.net/sc_rad39' },

  // ══════════════════════════════════════════════════════════════════════════
  // CHILE (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'cl-biobio',     name: 'Bío Bío Radio',         country: 'CL', city: 'Santiago',         genre: 'Noticias',    flag: '🇨🇱', color: '#b45309', stream: 'https://unlimited3-cl.dps.live/biobiosantiago/aac/icecast.audio' },
  { id: 'cl-futuro',     name: 'Futuro FM',             country: 'CL', city: 'Santiago',         genre: 'Pop',         flag: '🇨🇱', color: '#16a34a', stream: 'http://19253.live.streamtheworld.com/FUTUROAAC_SC' },
  { id: 'cl-los40',      name: 'Los 40 Chile',          country: 'CL', city: 'Santiago',         genre: 'Pop/Hits',    flag: '🇨🇱', color: '#7c3aed', stream: 'http://27443.live.streamtheworld.com:3690/LOS40_CHILE_SC' },
  { id: 'cl-oasis',      name: 'Oasis FM',              country: 'CL', city: 'Santiago',         genre: 'Pop Clásico', flag: '🇨🇱', color: '#0891b2', stream: 'https://mdstrm.com/audio/5c915497c6fd7c085b29169d/live.m3u8' },

  // ══════════════════════════════════════════════════════════════════════════
  // PERU (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'pe-studio92',   name: 'Studio 92',             country: 'PE', city: 'Lima',             genre: 'Pop/Hits',    flag: '🇵🇪', color: '#0284c7', stream: 'https://mdstrm.com/audio/5fada553978fe1080e3ac5ea/icecast.audio' },

  // ══════════════════════════════════════════════════════════════════════════
  // OTROS LATAM
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'uy-sport890',   name: 'Sport 890',             country: 'UY', city: 'Montevideo',       genre: 'Deportes',    flag: '🇺🇾', color: '#1d4ed8', stream: 'https://icecast.sport890.com.uy/sport890' },
  { id: 'do-z101',       name: 'Z101 FM',               country: 'DO', city: 'Santo Domingo',    genre: 'Pop/Hits',    flag: '🇩🇴', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/Z101FM_SC' },

  // ══════════════════════════════════════════════════════════════════════════
  // BRASIL (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'br-jovempan',   name: 'Jovem Pan News',        country: 'BR', city: 'São Paulo',        genre: 'Noticias',    flag: '🇧🇷', color: '#dc2626', stream: 'https://stream.zeno.fm/vlcraijc6yiuv' },
  { id: 'br-89fm',       name: '89 FM A Rádio Rock',    country: 'BR', city: 'São Paulo',        genre: 'Rock',        flag: '🇧🇷', color: '#991b1b', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_89FM_ADP.aac' },
  { id: 'br-bandnews',   name: 'BandNews FM',           country: 'BR', city: 'São Paulo',        genre: 'Noticias',    flag: '🇧🇷', color: '#1d4ed8', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDNEWSFM_SPAAC.m3u8' },
  { id: 'br-antena1',    name: 'Antena 1',              country: 'BR', city: 'São Paulo',        genre: 'Baladas',     flag: '🇧🇷', color: '#9333ea', stream: 'http://antena1.newradio.it/stream?ext=.mp3' },
  { id: 'br-mix',        name: 'Mix FM Brasil',         country: 'BR', city: 'São Paulo',        genre: 'Pop/Hits',    flag: '🇧🇷', color: '#ea580c', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MIXFM_SAOPAULOAAC.aac' },

  // ══════════════════════════════════════════════════════════════════════════
  // ESPAÑA (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'es-cadena100',  name: 'Cadena 100',            country: 'ES', city: 'Madrid',           genre: 'Pop/Hits',    flag: '🇪🇸', color: '#dc2626', stream: 'http://cadena100-streamers-mp3.flumotion.com/cope/cadena100.mp3' },
  { id: 'es-los40',      name: 'Los 40 España',         country: 'ES', city: 'Madrid',           genre: 'Pop/Hits',    flag: '🇪🇸', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/Los40.mp3' },
  { id: 'es-ser',        name: 'Cadena SER',            country: 'ES', city: 'Madrid',           genre: 'Noticias',    flag: '🇪🇸', color: '#dc2626', stream: 'http://playerservices.streamtheworld.com/api/livestream-redirect/CADENASER.mp3' },
  { id: 'es-rockfm',     name: 'Rock FM España',        country: 'ES', city: 'Madrid',           genre: 'Rock',        flag: '🇪🇸', color: '#b91c1c', stream: 'http://flucast31-h-cloud.flumotion.com/cope/rockfm-low.mp3' },
  { id: 'es-ondacero',   name: 'Onda Cero',             country: 'ES', city: 'Madrid',           genre: 'Noticias',    flag: '🇪🇸', color: '#16a34a', stream: 'https://atres-live.ondacero.es/live/ondacero/bitrate_1.m3u8' },
  { id: 'es-cope',       name: 'COPE',                  country: 'ES', city: 'Madrid',           genre: 'Noticias',    flag: '🇪🇸', color: '#1d4ed8', stream: 'http://wecast-bl02.flumotion.com/copesedes/sevilla.mp3' },
  { id: 'es-dial',       name: 'Cadena Dial',           country: 'ES', city: 'Madrid',           genre: 'Romántica',   flag: '🇪🇸', color: '#be185d', stream: 'http://playerservices.streamtheworld.com/api/livestream-redirect/CADENADIAL.mp3' },
  { id: 'es-rac1',       name: 'RAC1',                  country: 'ES', city: 'Barcelona',        genre: 'Noticias',    flag: '🇪🇸', color: '#ea580c', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RAC_1.mp3' },
  { id: 'es-flaix',      name: 'Flaix FM',              country: 'ES', city: 'Barcelona',        genre: 'Electrónica', flag: '🇪🇸', color: '#0891b2', stream: 'https://stream.flaixfm.cat/icecast' },

  // ══════════════════════════════════════════════════════════════════════════
  // REINO UNIDO (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'uk-bbc1',       name: 'BBC Radio 1',           country: 'GB', city: 'Londres',          genre: 'Pop/Hits',    flag: '🇬🇧', color: '#1d4ed8', stream: 'http://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/hls/nonuk/pc_hd_abr_v2/ak/bbc_radio_one.m3u8' },
  { id: 'uk-bbc2',       name: 'BBC Radio 2',           country: 'GB', city: 'Londres',          genre: 'Pop Clásico', flag: '🇬🇧', color: '#16a34a', stream: 'http://as-hls-ww-live.akamaized.net/pool_74208725/live/ww/bbc_radio_two/bbc_radio_two.isml/bbc_radio_two-audio%3d128000.norewind.m3u8' },
  { id: 'uk-bbc3',       name: 'BBC Radio 3',           country: 'GB', city: 'Londres',          genre: 'Clásica',     flag: '🇬🇧', color: '#7c3aed', stream: 'http://as-hls-ww-live.akamaized.net/pool_23461179/live/ww/bbc_radio_three/bbc_radio_three.isml/bbc_radio_three-audio%3d128000.norewind.m3u8' },
  { id: 'uk-bbc4',       name: 'BBC Radio 4',           country: 'GB', city: 'Londres',          genre: 'Noticias',    flag: '🇬🇧', color: '#b45309', stream: 'http://as-hls-ww-live.akamaized.net/pool_55057080/live/ww/bbc_radio_fourfm/bbc_radio_fourfm.isml/bbc_radio_fourfm-audio%3d128000.norewind.m3u8' },
  { id: 'uk-bbc6',       name: 'BBC Radio 6 Music',     country: 'GB', city: 'Londres',          genre: 'Alternativo', flag: '🇬🇧', color: '#059669', stream: 'http://as-hls-ww-live.akamaized.net/pool_81827798/live/ww/bbc_6music/bbc_6music.isml/bbc_6music-audio%3d128000.norewind.m3u8' },
  { id: 'uk-talksport',  name: 'talkSPORT',             country: 'GB', city: 'Londres',          genre: 'Deportes',    flag: '🇬🇧', color: '#15803d', stream: 'http://radio.talksport.com/stream?aisGetOriginalStream=true' },
  { id: 'uk-smooth',     name: 'Smooth Radio',          country: 'GB', city: 'Londres',          genre: 'Romántica',   flag: '🇬🇧', color: '#0369a1', stream: 'http://media-the.musicradio.com/SmoothLondonMP3' },

  // ══════════════════════════════════════════════════════════════════════════
  // ESTADOS UNIDOS (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'us-npr',        name: 'NPR News',              country: 'US', city: 'Washington',       genre: 'Noticias',    flag: '🇺🇸', color: '#1d4ed8', stream: 'http://npr-ice.streamguys1.com/live.mp3' },
  { id: 'us-wqxr',       name: 'WQXR Classical',        country: 'US', city: 'New York',         genre: 'Clásica',     flag: '🇺🇸', color: '#7c3aed', stream: 'http://stream.wqxr.org/wqxr' },
  { id: 'us-z100',       name: 'Z100 New York',         country: 'US', city: 'New York',         genre: 'Pop/Hits',    flag: '🇺🇸', color: '#db2777', stream: 'https://stream.revma.ihrhls.com/zc1469' },
  { id: 'us-kroq',       name: 'KROQ 106.7',            country: 'US', city: 'Los Angeles',      genre: 'Alternativo', flag: '🇺🇸', color: '#dc2626', stream: 'http://live.amperwave.net/direct/audacy-kroqfmaac-imc' },
  { id: 'us-kexp',       name: 'KEXP Seattle',          country: 'US', city: 'Seattle',          genre: 'Alternativo', flag: '🇺🇸', color: '#15803d', stream: 'http://live-mp3-128.kexp.org/kexp128.mp3' },
  { id: 'us-kcrw',       name: 'KCRW Santa Mónica',     country: 'US', city: 'Los Angeles',      genre: 'Alternativo', flag: '🇺🇸', color: '#0369a1', stream: 'https://streams.kcrw.com/kcrw_mp3' },
  { id: 'us-wbez',       name: 'WBEZ Chicago',          country: 'US', city: 'Chicago',          genre: 'Cultural',    flag: '🇺🇸', color: '#0891b2', stream: 'http://stream.wbez.org/wbez128.mp3' },

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPA — FRANCE (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'fr-fip',        name: 'FIP',                   country: 'FR', city: 'París',            genre: 'Jazz/Blues',  flag: '🇫🇷', color: '#1d4ed8', stream: 'http://icecast.radiofrance.fr/fip-hifi.aac' },
  { id: 'fr-rtl',        name: 'RTL France',            country: 'FR', city: 'París',            genre: 'Noticias',    flag: '🇫🇷', color: '#dc2626', stream: 'http://streaming.radio.rtl.fr/rtl-1-44-128' },
  { id: 'fr-nova',       name: 'Radio Nova',            country: 'FR', city: 'París',            genre: 'Electrónica', flag: '🇫🇷', color: '#0891b2', stream: 'http://novazz.ice.infomaniak.ch/novazz-128.mp3' },
  { id: 'fr-mouv',       name: "Mouv'",                 country: 'FR', city: 'París',            genre: 'Hip-Hop',     flag: '🇫🇷', color: '#7c3aed', stream: 'http://icecast.radiofrance.fr/mouv-hifi.aac' },

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPA — ALEMANIA (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'de-dlf',        name: 'Deutschlandfunk',       country: 'DE', city: 'Colonia',          genre: 'Cultural',    flag: '🇩🇪', color: '#15803d', stream: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3' },
  { id: 'de-ndr',        name: 'NDR Info',              country: 'DE', city: 'Hamburgo',         genre: 'Noticias',    flag: '🇩🇪', color: '#1d4ed8', stream: 'http://icecast.ndr.de/ndr/ndrinfo/hamburg/mp3/128/stream.mp3' },
  { id: 'de-fritz',      name: 'Fritz',                 country: 'DE', city: 'Berlín',           genre: 'Alternativo', flag: '🇩🇪', color: '#ea580c', stream: 'http://dispatcher.rndfnk.com/rbb/fritz/live/mp3/mid' },
  { id: 'de-radioeins',  name: 'radioeins',             country: 'DE', city: 'Berlín',           genre: 'Alternativo', flag: '🇩🇪', color: '#7c3aed', stream: 'http://d141.rndfnk.com/ard/rbb/radioeins/live/mp3/128/stream.mp3' },

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPA — ITALIA / PORTUGAL / BENELUX / OTROS (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'it-rai1',       name: 'RAI Radio 1',           country: 'IT', city: 'Roma',             genre: 'Variado',     flag: '🇮🇹', color: '#15803d', stream: 'http://icestreaming.rai.it/1.mp3' },
  { id: 'it-rai2',       name: 'RAI Radio 2',           country: 'IT', city: 'Roma',             genre: 'Pop',         flag: '🇮🇹', color: '#dc2626', stream: 'http://icestreaming.rai.it/2.mp3' },
  { id: 'it-m2o',        name: 'Radio m2o',             country: 'IT', city: 'Roma',             genre: 'Electrónica', flag: '🇮🇹', color: '#0891b2', stream: 'https://4c4b867c89244861ac216426883d1ad0.msvdn.net/radiom2o/radiom2o/master_ma.m3u8' },
  { id: 'pt-antena1',    name: 'Antena 1 Portugal',     country: 'PT', city: 'Lisboa',           genre: 'Variado',     flag: '🇵🇹', color: '#dc2626', stream: 'http://streaming-live-app.rtp.pt/liveradio/antena180a/playlist.m3u8' },
  { id: 'nl-538',        name: 'Radio 538',             country: 'NL', city: 'Amsterdam',        genre: 'Pop/Dance',   flag: '🇳🇱', color: '#ea580c', stream: 'http://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538.mp3' },
  { id: 'nl-3fm',        name: 'NPO 3FM',               country: 'NL', city: 'Amsterdam',        genre: 'Alternativo', flag: '🇳🇱', color: '#1d4ed8', stream: 'http://icecast.omroep.nl/3fm-bb-mp3' },
  { id: 'be-mnm',        name: 'MNM',                   country: 'BE', city: 'Bruselas',         genre: 'Pop',         flag: '🇧🇪', color: '#dc2626', stream: 'http://icecast.vrtcdn.be/mnm-high.mp3' },
  { id: 'ch-srf3',       name: 'SRF 3',                 country: 'CH', city: 'Zúrich',           genre: 'Pop',         flag: '🇨🇭', color: '#dc2626', stream: 'http://stream.srg-ssr.ch/m/drs3/mp3_128' },
  { id: 'at-oe3',        name: 'Ö3',                    country: 'AT', city: 'Viena',            genre: 'Pop/Hits',    flag: '🇦🇹', color: '#dc2626', stream: 'https://orf-live.ors-shoutcast.at/oe3-q2a' },
  { id: 'se-p3',         name: 'P3 Sverige',            country: 'SE', city: 'Estocolmo',        genre: 'Pop',         flag: '🇸🇪', color: '#1d4ed8', stream: 'https://live1.sr.se/p3-aac-320' },
  { id: 'no-nrk',        name: 'NRK P3',                country: 'NO', city: 'Oslo',             genre: 'Pop',         flag: '🇳🇴', color: '#dc2626', stream: 'https://cdn0-47115-liveicecast0.dna.contentdelivery.net/p3_mp3_h' },
  { id: 'dk-dr1',        name: 'DR P1',                 country: 'DK', city: 'Copenhague',       genre: 'Noticias',    flag: '🇩🇰', color: '#dc2626', stream: 'http://live-icy.gss.dr.dk/A/A03H.mp3' },
  { id: 'fi-yle',        name: 'Yle Radio 1',           country: 'FI', city: 'Helsinki',         genre: 'Cultural',    flag: '🇫🇮', color: '#1d4ed8', stream: 'http://icecast.live.yle.fi/radio/YleRadio1Hifi/icecast.audio' },
  { id: 'pl-trojka',     name: 'Polskie Radio 3',       country: 'PL', city: 'Varsovia',         genre: 'Cultural',    flag: '🇵🇱', color: '#dc2626', stream: 'http://stream3.polskieradio.pl:8904/' },
  { id: 'gr-skai',       name: 'Skai Radio',            country: 'GR', city: 'Atenas',           genre: 'Pop',         flag: '🇬🇷', color: '#1d4ed8', stream: 'http://netradio.live24.gr/skai1003' },
  { id: 'ro-kiss',       name: 'Kiss FM Romania',       country: 'RO', city: 'Bucarest',         genre: 'Pop',         flag: '🇷🇴', color: '#dc2626', stream: 'https://live.kissfm.ro/kissfm.aacp' },
  { id: 'cz-beat',       name: 'Rádio Beat',            country: 'CZ', city: 'Praga',            genre: 'Rock',        flag: '🇨🇿', color: '#dc2626', stream: 'http://icecast2.play.cz/radiobeat128.mp3' },

  // ══════════════════════════════════════════════════════════════════════════
  // ASIA / PACÍFICO (verificado vía radio-browser.info)
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'au-triplej',    name: 'Triple J',              country: 'AU', city: 'Sídney',           genre: 'Alternativo', flag: '🇦🇺', color: '#dc2626', stream: 'http://live-radio01.mediahubaustralia.com/2TJW/mp3/' },
  { id: 'au-nova',       name: 'Nova 96.9',             country: 'AU', city: 'Sídney',           genre: 'Pop/Hits',    flag: '🇦🇺', color: '#7c3aed', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVA_969_AAC48.aac' },
  { id: 'ru-europaplus', name: 'Europa Plus',           country: 'RU', city: 'Moscú',            genre: 'Pop',         flag: '🇷🇺', color: '#0891b2', stream: 'http://ep256.hostingradio.ru:8052/europaplus256.mp3' },
  { id: 'za-947',        name: '947 FM',                country: 'ZA', city: 'Johannesburgo',    genre: 'Pop/Hits',    flag: '🇿🇦', color: '#dc2626', stream: 'http://25553.live.streamtheworld.com:3690/FM947_SC' },

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
