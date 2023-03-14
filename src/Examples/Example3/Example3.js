import React, {useRef, useEffect, useState} from 'react';
import geojson from './Example3-geojson.json';
import mapboxgl from 'mapbox-gl';
import {saveAs} from 'file-saver';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGthdXR6IiwiYSI6ImNsYW1uYmM0ODBndmczcHFycjQ2b3htNHMifQ.Ijorv-ALBKlH-UN3nLGl7Q';

const initLng = '-108.35343933';
const initLat = '41.63972855';
const initZoom = '4.00';
const initPitch = '25.0000';
const initBearing = '0.00';
const initCamLng = '-108.3534';
const initCamLat = '26.1167';
const initCamAltitude = '4026879.6999';
const DURATION = 10000;

const Example3 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(initLng);
  const [lat, setLat] = useState(initLat);
  const [zoom, setZoom] = useState(initZoom);
  const [pitch, setPitch] = useState(initPitch);
  const [bearing, setBearing] = useState(initBearing);
  const [camLng, setCamLng] = useState(initCamLng);
  const [camLat, setCamLat] = useState(initCamLat);
  const [altitude, setAltitude] = useState(initCamAltitude);

  const resetCamera = () => {
    map.current.jumpTo({
      center: [initLng, initLat],
      zoom: initZoom,
      pitch: initPitch,
      bearing: initBearing,
    });
  };

  const animateRoute = () => {
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
  };

  const animateCamera = () => {
    map.current.easeTo({
      bearing: map.current.getBearing() - 90,
      duration: DURATION,
      easing: (t) => t,
    });
  };

  const createMediaRecorder = () => {
    const chunks = [];
    const canvas = map.current.getCanvas();
    const videoStream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(videoStream);
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks);
      saveAs(blob, 'mapboxgl.webm');
    };

    return mediaRecorder;
  };

  const recordCanvas = async () => {
    map.current.boxZoom.disable();
    map.current.doubleClickZoom.disable();
    map.current.dragPan.disable();
    map.current.dragRotate.disable();
    map.current.keyboard.disable();
    map.current.scrollZoom.disable();
    map.current.touchZoomRotate.disable();

    // Reset Media Recorder
    const mediaRecorder = createMediaRecorder();

    // Reset Camera
    resetCamera();

    // Start Camera animation
    animateCamera();

    // Start Route animation
    animateRoute();

    // Start recording canvas
    mediaRecorder.start();

    // Wait for Camera animation to stop
    await map.current.once('moveend');

    // Stop recording canvas
    mediaRecorder.stop();
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      interactive: true,
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

    map.current.on('load', async () => {
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
    });

    map.current.on('idle', async () => {
      // Start Route animation
      animateRoute();
    });
  });

  return (
    <div>
      <div className="sidebar">
        Target Longitude: {lng} | Target Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}<br />
        Camera Longitude: {camLng} | Camera Latitude: {camLat} | Camera Altitude: {altitude}<br />
        <button type="button" onClick={recordCanvas}>Record Canvas</button>

      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Example3;
