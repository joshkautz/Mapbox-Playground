import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import Examples from './Examples';
import Example1 from './Examples/Example1/Example1';
import Example2 from './Examples/Example2/Example2';
import Example3 from './Examples/Example3/Example3';
import Example4 from './Examples/Example4/Example4';
import Example5 from './Examples/Example5/Example5';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Examples />,
      }, {
        path: 'example-1',
        element: <Example1 />,
      }, {
        path: 'example-2',
        element: <Example2 />,
      }, {
        path: 'example-3',
        element: <Example3 />,
      }, {
        path: 'example-4',
        element: <Example4 />,
      }, {
        path: 'example-5',
        element: <Example5 />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
