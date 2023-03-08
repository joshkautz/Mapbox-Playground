import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from '!mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGthdXR6IiwiYSI6ImNsYW1uYmM0ODBndmczcHFycjQ2b3htNHMifQ.Ijorv-ALBKlH-UN3nLGl7Q';

const Example1 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState('175.6320');
  const [lat, setLat] = useState('-39.1568');
  const [zoom, setZoom] = useState('14.00');
  const [pitch, setPitch] = useState('72.0000');
  const [bearing, setBearing] = useState('180.00');
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
      interactive: false,
    });

    map.current.on('style.load', () => {
      // map.current.setFog({}); // Set the default atmosphere style

      // Add terrain
      // map.current.addSource('mapbox-dem', {
      //   'type': 'raster-dem',
      //   'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      //   'tileSize': 512,
      //   'maxzoom': 14,
      // });
      // map.current.setTerrain({'source': 'mapbox-dem', 'exaggeration': 1.5});
    });

    let animationIndex = 0;
    let animationTime = 0.0;

    const updateCameraPosition = (position, altitude, bearing, pitch, target) => {
      const camera = map.current.getFreeCameraOptions();
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
          position,
          altitude,
      );
      camera.lookAtPoint(target);
      // camera.setPitchBearing(pitch, bearing);
      map.current.setFreeCameraOptions(camera);
    };

    // Wait for the terrain to load before starting animations
    map.current.once('idle', () => {
      const camera = map.current.getFreeCameraOptions();
      const cameraStartAltitude = camera.position.toAltitude();
      const cameraStartBearing = bearing;
      const cameraStartPitch = pitch;

      // Linearly interpolate between two altitudes/positions based on time
      const lerp = (a, b, t) => {
        if (Array.isArray(a) && Array.isArray(b)) {
          const result = [];
          for (let i = 0; i < Math.min(a.length, b.length); i++) {
            result[i] = a[i] * (1.0 - t) + b[i] * t;
          }
          return result;
        } else {
          return a * (1.0 - t) + b * t;
        }
      };

      const animations = [
        {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6316, -39.1127], [175.6173, -39.1142], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6173, -39.1142], [175.6039, -39.1185], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6039, -39.1185], [175.5925, -39.1253], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude+1000, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.5925, -39.1253], [175.5837, -39.1342], phase);
            const cameraAltitude = lerp(cameraStartAltitude+1000, cameraStartAltitude+1000, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.5837, -39.1342], [175.5782, -39.1445], phase);
            const cameraAltitude = lerp(cameraStartAltitude+1000, cameraStartAltitude+400, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.5782, -39.1445], [175.5763, -39.1556], phase);
            const cameraAltitude = lerp(cameraStartAltitude+400, cameraStartAltitude+600, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.5763, -39.1556], [175.5782, -39.1667], phase);
            const cameraAltitude = lerp(cameraStartAltitude+600, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.5782, -39.1667], [175.5837, -39.1771], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.5837, -39.1771], [175.5925, -39.1859], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.5925, -39.1859], [175.6039, -39.1927], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude+1000, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6039, -39.1927], [175.6173, -39.1970], phase);
            const cameraAltitude = lerp(cameraStartAltitude+1000, cameraStartAltitude+2000, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6173, -39.1970], [175.6316, -39.1985], phase);
            const cameraAltitude = lerp(cameraStartAltitude+2000, cameraStartAltitude+1000, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6316, -39.1985], [175.6459, -39.1970], phase);
            const cameraAltitude = lerp(cameraStartAltitude+1000, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6459, -39.1970], [175.6592, -39.1927], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6592, -39.1927], [175.6707, -39.1859], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6707, -39.1859], [175.6794, -39.1771], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6794, -39.1771], [175.6850, -39.1667], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude-1500, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6850, -39.1667], [175.6868, -39.1556], phase);
            const cameraAltitude = lerp(cameraStartAltitude-1500, cameraStartAltitude+500, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6868, -39.1556], [175.6850, -39.1445], phase);
            const cameraAltitude = lerp(cameraStartAltitude+500, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6850, -39.1445], [175.6794, -39.1342], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6794, -39.1342], [175.6707, -39.1253], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude-800, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6707, -39.1253], [175.6592, -39.1185], phase);
            const cameraAltitude = lerp(cameraStartAltitude-800, cameraStartAltitude-800, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6592, -39.1185], [175.6459, -39.1142], phase);
            const cameraAltitude = lerp(cameraStartAltitude-800, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        }, {
          duration: 2000.0,
          animate: (phase) => {
            // Interpolate camera position while keeping focus on a target lat/lng
            const cameraPosition = lerp([175.6459, -39.1142], [175.6316, -39.1127], phase);
            const cameraAltitude = lerp(cameraStartAltitude, cameraStartAltitude, phase);
            const cameraBearing = lerp(cameraStartBearing, 0, phase);
            const cameraPitch = lerp(cameraStartPitch, 0, phase);
            const cameraTarget = [175.6320, -39.1568];

            updateCameraPosition(cameraPosition, cameraAltitude, cameraBearing, cameraPitch, cameraTarget);
          },
        },
      ];

      let lastTime = 0.0;
      const frame = (time) => {
        animationIndex %= animations.length;
        const current = animations[animationIndex];

        if (animationTime < current.duration) {
          // Normalize the duration between 0 and 1 to interpolate the animation
          const phase = animationTime / current.duration;
          current.animate(phase);
        }

        // Elasped time since last frame, in milliseconds
        const elapsed = time - lastTime;
        animationTime += elapsed;
        lastTime = time;

        if (animationTime > current.duration) {
          animationIndex++;
          animationTime = 0.0;
        }

        window.requestAnimationFrame(frame);
      };

      window.requestAnimationFrame(frame);
    });
  });


  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
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
  });

  return (
    <div>
      <div className="sidebar">
        Target Longitude: {lng} | Target Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}<br />
        Camera Longitude: {camLng} | Camera Latitude: {camLat} | Camera Altitude: {altitude}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Example1;
