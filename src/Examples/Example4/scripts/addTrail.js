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

export {addTrail};
