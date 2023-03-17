import React, {useRef, useEffect, useState, useCallback} from 'react';
import geojson from './newgeojson.json';
import mapboxgl from 'mapbox-gl';
import {bbox} from '@turf/turf';

import {add3D} from './scripts/add3D';
import {addTrail} from './scripts/addTrail';
import {flyInAndRotate} from './scripts/flyInAndRotate';
import {animatePath} from './scripts/animatePath';
import {fitBounds} from './scripts/fitBounds';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGthdXR6IiwiYSI6ImNsYW1uYmM0ODBndmczcHFycjQ2b3htNHMifQ.Ijorv-ALBKlH-UN3nLGl7Q';

const initLng = geojson.geometry.coordinates[0][0].toString();
const initLat = geojson.geometry.coordinates[0][1].toString();
const initZoom = '4.00';
const initPitch = '45.0000';
const initBearing = '0.00';
const initCamLng = '-108.3534';
const initCamLat = '26.1167';
const initCamAltitude = '4026879.6999';
const DURATION = 300000;

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

  const updateUIValues = useCallback(() => {
    setLng(map.current.getCenter().lng);
    setLat(map.current.getCenter().lat);
    setPitch(map.current.getPitch());
    setZoom(map.current.getZoom());
    setBearing(map.current.getBearing());
    setAltitude(map.current.getFreeCameraOptions().position.toAltitude());
    setCamLng(map.current.getFreeCameraOptions().position.toLngLat().lng);
    setCamLat(map.current.getFreeCameraOptions().position.toLngLat().lat);
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
      // interactive: false,
    });

    map.current.on('move', () => {
      updateUIValues();
    });

    map.current.on('load', async () => {
      // add 3d, sky and fog
      add3D(map);

      // add a geojson source and layer for the linestring to the map
      addTrail(map, geojson);

      await map.current.once('idle');

      // get the start of the linestring, to be used for animating a zoom-in from high altitude
      const targetLngLat = {
        lng: geojson.geometry.coordinates[0][0],
        lat: geojson.geometry.coordinates[0][1],
      };

      // animate zooming in to the start point, get the final bearing and altitude for use in the next animation
      await flyInAndRotate({
        map,
        targetLngLat,
        duration: 3000,
        startAltitude: parseFloat(map.current.getFreeCameraOptions().position.toAltitude()),
        endAltitude: 35000,
        startBearing: parseFloat(map.current.getBearing()),
        endBearing: 20,
        startPitch: parseFloat(map.current.getPitch()),
        endPitch: 50,
      });

      // follow the path while slowly rotating the camera, passing in the camera bearing and altitude from the previous animation
      await animatePath({
        map,
        duration: DURATION,
        path: geojson,
        startBearing: parseFloat(map.current.getBearing()),
        startAltitude: parseFloat(map.current.getFreeCameraOptions().position.toAltitude()),
        pitch: parseFloat(map.current.getPitch()),
      });

      // get the bounds of the linestring, use fitBounds() to animate to a final view
      await fitBounds(map, bbox(geojson), {
        duration: 3000,
        pitch: 30,
        bearing: 0,
        padding: 120,
      });
    });
  }, []);

  return (
    <div>
      {/* <div className="sidebar">
        Target Longitude: {lng} | Target Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}<br />
        Camera Longitude: {camLng} | Camera Latitude: {camLat} | Camera Altitude: {altitude}<br />
      </div> */}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Example3;
