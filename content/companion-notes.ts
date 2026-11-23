// The avatar serves these short, sourced notes locally.
export type NoteCategory = 'insight' | 'fact';

export const companionNotes = {
  welcome: 'Want a surprising fact or a quick explanation of something you use every day?',
  provenance: 'Source links included',
  insight: [
    {
      id: 'qr-damage',
      text: 'Ever scanned a torn QR code? QR codes store extra information that can help your phone recover some of the missing data.',
      source: 'DENSO WAVE',
      url: 'https://www.qrcode.com/en/about/error_correction.html',
    },
    {
      id: 'offline-maps',
      text: 'You can get turn-by-turn directions with no mobile data. Download the area in Apple Maps before you go and the app can use that saved map offline.',
      source: 'Apple Support',
      url: 'https://support.apple.com/en-gb/105084',
    },
    {
      id: 'noise-cancelling',
      text: 'Noise-cancelling headphones use microphones to listen to outside noise, then play a matching sound wave that reduces what you hear.',
      source: 'Apple Support',
      url: 'https://support.apple.com/en-sa/108918',
    },
    {
      id: 'https-padlock',
      text: 'Even a scam website can use HTTPS. It encrypts the connection, so check the actual web address before entering a password.',
      source: 'Chromium Blog',
      url: 'https://blog.chromium.org/2023/05/an-update-on-lock-icon.html',
    },
  ],
  fact: [
    {
      id: 'lightning-heat',
      text: 'A lightning strike can heat the air around it to about 28,000°C, roughly five times hotter than the surface of the Sun.',
      source: 'US National Weather Service',
      url: 'https://www.weather.gov/safety/lightning-temperature',
    },
    {
      id: 'venus-spin',
      text: 'Venus takes 243 Earth days to spin once and only 225 Earth days to orbit the Sun. One spin takes longer than an entire Venus year.',
      source: 'NASA',
      url: 'https://science.nasa.gov/venus/venus-facts/',
    },
    {
      id: 'ancient-sharks',
      text: 'Sharks were swimming long before dinosaurs walked the Earth. The earliest shark fossils date back about 455 million years.',
      source: 'Smithsonian Tropical Research Institute',
      url: 'https://striresearch.si.edu/sharks/present-and-future/what-is-the-origin-of-sharks/',
    },
    {
      id: 'eiffel-movement',
      text: 'Sunshine can move the top of the Eiffel Tower. As different sides heat up and expand, its tip can trace a loop about 15 centimeters across.',
      source: 'The Eiffel Tower',
      url: 'https://www.toureiffel.paris/en/news/history-and-culture/why-does-eiffel-tower-change-size',
    },
    {
      id: 'two-high-tides',
      text: 'The Moon helps create two tidal bulges on opposite sides of Earth. As Earth rotates through both, many coastlines get two high tides in roughly a day.',
      source: 'NOAA',
      url: 'https://oceanservice.noaa.gov/facts/tidefrequency.html',
    },
  ],
};
