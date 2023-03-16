import mapboxgl from 'mapbox-gl';
import {easeCubicOut} from 'd3-ease';

// given a bearing, pitch, altitude, and a targetPosition on the ground to look at,
// calculate the camera's targetPosition as lngLat
let previousCameraPosition;

// amazingly simple, via https://codepen.io/ma77os/pen/OJPVrP
const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

const add3D = (map) => {
  // add map 3d terrain and sky layer and fog
  // Add some fog in the background
  map.current.setFog({
    'range': [0.5, 10],
    'color': 'white',
    'horizon-blend': 0.2,
  });

  // Add a sky layer over the horizon
  map.current.addLayer({
    id: 'sky',
    type: 'sky',
    paint: {
      'sky-type': 'atmosphere',
      'sky-atmosphere-color': 'rgba(85, 151, 210, 0.5)',
    },
  });

  // Add terrain source, with slight exaggeration
  map.current.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.terrain-rgb',
    tileSize: 512,
    maxzoom: 14,
  });

  map.current.setTerrain({source: 'mapbox-dem', exaggeration: 1.5});
};

const addTrail = (map, geojson) => {
  map.current.addSource('CDT', {
    type: 'geojson',
    data: geojson,
    lineMetrics: true, // Line metrics is required to use the 'line-progress' property
  });

  // Add a line feature and layer. This feature will get updated as we progress the animation
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
};

const computeCameraPosition = (
    pitch,
    bearing,
    targetPosition,
    altitude,
    smooth = false,
) => {
  const bearingInRadian = bearing / 57.29;
  const pitchInRadian = (90 - pitch) / 57.29;

  const lngDiff =
    ((altitude / Math.tan(pitchInRadian)) *
      Math.sin(-bearingInRadian)) /
    70000; // ~70km/degree longitude
  const latDiff =
    ((altitude / Math.tan(pitchInRadian)) *
      Math.cos(-bearingInRadian)) /
    110000; // 110km/degree latitude

  const correctedLng = targetPosition.lng + lngDiff;
  const correctedLat = targetPosition.lat - latDiff;

  const newCameraPosition = {
    lng: correctedLng,
    lat: correctedLat,
  };

  if (smooth) {
    if (previousCameraPosition) {
      const SMOOTH_FACTOR = 0.95;
      newCameraPosition.lng = lerp(newCameraPosition.lng, previousCameraPosition.lng, SMOOTH_FACTOR);
      newCameraPosition.lat = lerp(newCameraPosition.lat, previousCameraPosition.lat, SMOOTH_FACTOR);
    }
  }

  previousCameraPosition = newCameraPosition;

  return newCameraPosition;
};

const flyInAndRotate = async ({
  map,
  targetLngLat,
  duration,
  startAltitude,
  endAltitude,
  startBearing,
  endBearing,
  startPitch,
  endPitch,
}) => {
  return new Promise(async (resolve) => {
    let start;

    let currentAltitude;
    let currentBearing;
    let currentPitch;

    // the animation frame will run as many times as necessary until the duration has been reached
    const frame = async (time) => {
      if (!start) {
        start = time;
      }

      // otherwise, use the current time to determine how far along in the duration we are
      let animationPhase = (time - start) / duration;

      // because the phase calculation is imprecise, the final zoom can vary
      // if it ended up greater than 1, set it to 1 so that we get the exact endAltitude that was requested
      if (animationPhase > 1) {
        animationPhase = 1;
      }

      currentAltitude = startAltitude + (endAltitude - startAltitude) * easeCubicOut(animationPhase);
      // rotate the camera between startBearing and endBearing
      currentBearing = startBearing + (endBearing - startBearing) * easeCubicOut(animationPhase);

      currentPitch = startPitch + (endPitch - startPitch) * easeCubicOut(animationPhase);

      // compute corrected camera ground position, so the start of the path is always in view
      const correctedPosition = computeCameraPosition(
          currentPitch,
          currentBearing,
          targetLngLat,
          currentAltitude,
      );

      // set the pitch and bearing of the camera
      const camera = map.current.getFreeCameraOptions();
      camera.setPitchBearing(currentPitch, currentBearing);

      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
          correctedPosition,
          currentAltitude,
      );

      // apply the new camera options
      map.current.setFreeCameraOptions(camera);

      // when the animationPhase is done, resolve the promise so the parent function can move on to the next step in the sequence
      if (animationPhase === 1) {
        resolve({
          bearing: currentBearing,
          altitude: currentAltitude,
        });

        // return so there are no further iterations of this frame
        return;
      }

      await window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};

export {add3D, addTrail, flyInAndRotate};
