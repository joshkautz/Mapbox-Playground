import mapboxgl from 'mapbox-gl';
import {lineDistance, along} from '@turf/turf';
import {computeCameraPosition} from './computeCameraPosition';

const animatePath = async ({
  map,
  duration,
  path,
  startBearing,
  startAltitude,
  pitch,
}) => {
  return new Promise(async (resolve) => {
    const pathDistance = lineDistance(path);
    let startTime;

    const frame = async (currentTime) => {
      if (!startTime) startTime = currentTime;
      const animationPhase = (currentTime - startTime) / duration;

      // when the duration is complete, resolve the promise and stop iterating
      if (animationPhase > 1) {
        resolve();
        return;
      }

      // calculate the distance along the path based on the animationPhase
      const alongPath = along(path, pathDistance * animationPhase).geometry
          .coordinates;

      const lngLat = {
        lng: alongPath[0],
        lat: alongPath[1],
      };

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.current.setPaintProperty(
          'CDT',
          'line-gradient',
          [
            'step',
            ['line-progress'],
            'red',
            animationPhase,
            'rgba(0, 0, 0, 0)',
          ],
      );

      // slowly rotate the map at a constant rate
      const bearing = startBearing - animationPhase * 2000.0;

      // compute corrected camera ground position, so that he leading edge of the path is in view
      const correctedPosition = computeCameraPosition(
          pitch,
          bearing,
          lngLat,
          startAltitude,
          true, // smooth
      );

      // set the pitch and bearing of the camera
      const camera = map.current.getFreeCameraOptions();
      camera.setPitchBearing(pitch, bearing);

      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
          correctedPosition,
          startAltitude,
      );

      // apply the new camera options
      map.current.setFreeCameraOptions(camera);

      // repeat!
      await window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};

export {animatePath};

