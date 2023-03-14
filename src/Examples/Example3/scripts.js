export const add3D = (map) => {
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
