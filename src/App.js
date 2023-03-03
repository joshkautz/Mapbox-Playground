import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGthdXR6IiwiYSI6ImNsYW1uYmM0ODBndmczcHFycjQ2b3htNHMifQ.Ijorv-ALBKlH-UN3nLGl7Q';

const App = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState('175.6320');
  const [lat, setLat] = useState('-39.1568');
  const [zoom, setZoom] = useState('13.00');
  const [pitch, setPitch] = useState('45.0000');

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: pitch,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setPitch(map.current.getPitch().toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  console.log(typeof lng, typeof lat, typeof zoom, typeof pitch);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default App;
