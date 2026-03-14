import { forwardRef } from 'react';

const MapUi = forwardRef((props, ref) => (
  <iframe
    src="https://aqicn.org/map/india/"
    title="AQI Map"
    style={{
      width: '100%',
      height: '100vh',
      border: 'none',
      overflow: 'hidden',
      display: 'block'
    }}
  />
));

export default MapUi;
