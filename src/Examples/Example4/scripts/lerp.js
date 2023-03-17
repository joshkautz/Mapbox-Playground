// amazingly simple, via https://codepen.io/ma77os/pen/OJPVrP
const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

export {lerp};
