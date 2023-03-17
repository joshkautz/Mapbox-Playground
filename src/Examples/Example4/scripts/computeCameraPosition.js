import {lerp} from './lerp';

// given a bearing, pitch, altitude, and a targetPosition on the ground to look at,
// calculate the camera's targetPosition as lngLat
let previousCameraPosition;

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

export {computeCameraPosition};
