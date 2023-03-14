import React from 'react';
import {Link} from 'react-router-dom';


import './Examples.css';

const Examples = () => {
  return (
    <>
      <h1>Examples</h1>
      <ul>
        <li>
          <Link to='/example-1'>Example 1</Link> - New Zealand mountain, non-interactive map. Uses Free Camera API to rotate and animate around a fixed location in 3D.
          Uses a custom style from Mapbox Studio.
        </li>
        <li>
          <Link to='/example-2'>Example 2</Link> - Continental Divide Trail, non-interactive map. Animated camera and animated GeoJSON layer for the hiking trail.
          Exports video automatically. Uses custom style from Mapbox Studio.
        </li>
        <li>
          <Link to='/example-3'>Example 3</Link> - Continental Divide Trail. Animated GeoJSON layer (using setPaintProperty line-gradient).
          <ul>
            <li>
          Buttons for starting recording with Camera Animation and Layer Animation.
            </li>
            <li>
          Buttons for stopping recording.
            </li>
            <li>
          Buttons for exporting video.
            </li>
          </ul>
        </li>
        <li>
          <Link to='/example-4'>Example 4</Link> - Continental Divide Trail. Animated GeoJSON layer (but in a different way...).
          <ul>
            <li>
          Buttons for starting recording with Camera Animation and Layer Animation.
            </li>
            <li>
          Buttons for stopping recording.
            </li>
            <li>
          Buttons for exporting video.
            </li>
          </ul>
        </li>
        <li>
          <Link to='/example-5'>Example 5</Link> - Continental Divide Trail, non-interactive map.Animates and camera and route a different way. Adds video export the way that
          Mapbox successfully demonstrates.
        </li>
      </ul>
    </>
  );
};

export default Examples;
