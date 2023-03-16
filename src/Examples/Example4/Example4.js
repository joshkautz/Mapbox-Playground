import React, {useRef, useEffect, useState, useCallback} from 'react';
import geojson from './Example4-geojson.json';
import mapboxgl from 'mapbox-gl';
import {add3D, addTrail, flyInAndRotate} from './scripts';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGthdXR6IiwiYSI6ImNsYW1uYmM0ODBndmczcHFycjQ2b3htNHMifQ.Ijorv-ALBKlH-UN3nLGl7Q';

const initLng = '-108.35343933';
const initLat = '41.63972855';
const initZoom = '4.00';
const initPitch = '25.0000';
const initBearing = '0.00';
const initCamLng = '-108.3534';
const initCamLat = '26.1167';
const initCamAltitude = '4026879.6999';
const DURATION = 60000;

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

  const startCameraAnimation = useCallback(() => {
    map.current.jumpTo({
      center: [initLng, initLat],
      zoom: initZoom,
      pitch: initPitch,
      bearing: initBearing,
    });

    map.current.easeTo({
      bearing: map.current.getBearing() - 90,
      duration: DURATION,
      easing: (t) => t,
    });
  }, []);

  // const stopCameraAnimation = useCallback(() => {
  //   map.current.stop();
  // }, []);

  const startRouteAnimation = () => {
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


  const disableInteraction = useCallback(() => {
    map.current.boxZoom.disable();
    map.current.doubleClickZoom.disable();
    map.current.dragPan.disable();
    map.current.dragRotate.disable();
    map.current.keyboard.disable();
    map.current.scrollZoom.disable();
    map.current.touchZoomRotate.disable();
  }, []);

  const enableInteraction = useCallback(() => {
    map.current.boxZoom.enable();
    map.current.doubleClickZoom.enable();
    map.current.dragPan.enable();
    map.current.dragRotate.enable();
    map.current.keyboard.enable();
    map.current.scrollZoom.enable();
    map.current.touchZoomRotate.enable();
  }, []);

  const updateUIValues = useCallback(() => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setPitch(map.current.getPitch().toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    setBearing(map.current.getBearing().toFixed(2));
    setAltitude(map.current.getFreeCameraOptions().position.toAltitude().toFixed(4));
    setCamLng(map.current.getFreeCameraOptions().position.toLngLat().lng.toFixed(4));
    setCamLat(map.current.getFreeCameraOptions().position.toLngLat().lat.toFixed(4));
  }, []);

  useEffect(() => {
    // Initialize map only once
    if (map.current) {
      return;
    }

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
      updateUIValues();
    });

    map.current.on('load', async () => {
      // add 3d, sky and fog
      add3D(map);

      // add a geojson source and layer for the linestring to the map
      addTrail(map, geojson);

      // get the start of the linestring, to be used for animating a zoom-in from high altitude
      const targetLngLat = {
        lng: geojson.geometry.coordinates[0][0],
        lat: geojson.geometry.coordinates[0][1],
      };

      // animate zooming in to the start point, get the final bearing and altitude for use in the next animation
      // const { bearing, altitude } =
      await flyInAndRotate({
        map,
        targetLngLat,
        duration: 7000,
        startAltitude: 3000000,
        endAltitude: 12000,
        startBearing: 0,
        endBearing: -20,
        startPitch: 40,
        endPitch: 50,
      });
    });

    map.current.on('idle', async () => {
      // // Disable user interactions on Mapbox
      // disableInteraction();

      // // Start Camera animation
      // startCameraAnimation();

      // // Start Route animation
      // startRouteAnimation();

      // // Wait for Camera animation to stop
      // await map.current.once('moveend');

      // // Enable user interactions on Mapbox
      // enableInteraction();
    });
  }, []);

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

export default Example3;
