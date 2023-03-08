import React, {useRef, useEffect, useState} from 'react';
import geojson from './Example2-geojson.json';
import mapboxgl from 'mapbox-gl';
import {saveAs} from 'file-saver';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGthdXR6IiwiYSI6ImNsYW1uYmM0ODBndmczcHFycjQ2b3htNHMifQ.Ijorv-ALBKlH-UN3nLGl7Q';

const Example2 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState('-108.35343933');
  const [lat, setLat] = useState('41.63972855');
  const [zoom, setZoom] = useState('4.00');
  const [pitch, setPitch] = useState('25.0000');
  const [bearing, setBearing] = useState('0.00');
  const [camLng, setCamLng] = useState('Loading...');
  const [camLat, setCamLat] = useState('Loading...');
  const [altitude, setAltitude] = useState('Loading...');

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/joshkautz/clesyuvgl004w01n0npa8ohk2',
      center: [lng, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      // interactive: false,
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setPitch(map.current.getPitch().toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      setBearing(map.current.getBearing().toFixed(2));
      setAltitude(map.current.getFreeCameraOptions().position.toAltitude().toFixed(4));
      setCamLng(map.current.getFreeCameraOptions().position.toLngLat().lng.toFixed(4));
      setCamLat(map.current.getFreeCameraOptions().position.toLngLat().lat.toFixed(4));
    });

    const DURATION = 10000;

    map.current.on('load', async () => {
      const animate = async () => {
        // Animate Camera
        map.current.easeTo({
          bearing: map.current.getBearing() - 20,
          duration: DURATION,
          easing: (t) => t,
        });

        // Animate Route
        let startTime;
        const frame = (time) => {
          if (!startTime) startTime = time;
          const animationPhase = (time - startTime) / DURATION;

          // Reduce the visible length of the line by using a line-gradient to cutoff the line
          // animationPhase is a value between 0 and 1 that reprents the progress of the animation
          map.current.setPaintProperty(
              'CDT',
              'line-gradient', [
                'step',
                ['line-progress'],
                'red',
                animationPhase,
                'rgba(0, 0, 0, 0)',
              ]);

          if (animationPhase > 1) {
            return;
          }
          window.requestAnimationFrame(frame);
        };

        window.requestAnimationFrame(frame);

        // Wait for animation to finish
        await map.current.once('moveend');
      };

      map.current.addSource('CDT', {
        type: 'geojson',
        data: geojson,
        lineMetrics: true,
      });

      map.current.addLayer({
        id: 'CDT',
        type: 'line',
        source: 'CDT',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'rgba(0,0,0,0)',
          'line-width': 8,
          'line-opacity': 0.5,
        },
      });

      await map.current.once('idle');

      const chunks = [];
      const canvas = map.current.getCanvas();
      const videoStream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(videoStream);
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        console.log(chunks);
        const blob = new Blob(chunks);
        console.log(blob);

        saveAs(blob, 'mapboxgl.webm');
      };

      mediaRecorder.start();

      await animate();

      mediaRecorder.stop();
    });
  });

  return (
    <div>
      <div className="sidebar">
        Target Longitude: {lng} | Target Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}<br />
        Camera Longitude: {camLng} | Camera Latitude: {camLat} | Camera Altitude: {altitude}<br />
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Example2;
