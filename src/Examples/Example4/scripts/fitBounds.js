const fitBounds = async (map, bounds, options) => {
  return new Promise(async (resolve) => {
    await map.current.fitBounds(bounds, options);

    await map.current.once('moveend');

    resolve();
  });
};

export {fitBounds};

