import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import keys from './../../keys.json';
import axios from 'axios'
import nfcIcon from './../../icons/nfcicon.png';

function MapCreator() {
  const [selectedPoint, setselectedPoint] = useState(null);
  const [data,setData] = useState([]);

  useEffect(() => {
    axios.get('api/coordinates')
    .then(values=>{
        console.log(values.data);
        setData(values.data);
    })
    const listener = e => {
      if (e.key === "Escape") {
        setselectedPoint(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: 50.444571, lng: 30.559099 }}
    >
      {data.map(dot => (
        <Marker
          key={dot._id}
          position={{
            lat: dot.coordinates.latitude,
            lng: dot.coordinates.longitude
          }}
          onClick={() => {
            setselectedPoint(dot);
          }}
          icon={{
            url: nfcIcon,
            scaledSize: new window.google.maps.Size(40, 64)
          }}
        >
         {selectedPoint && selectedPoint._id === dot._id && (
           <InfoWindow onCloseClick={() => setselectedPoint(null)}
           >
             <div>
                <h2>Device ID: {selectedPoint.identificatorNFC}</h2>
                <p>Date: {new Date(selectedPoint.date) .toUTCString()}</p>
             </div>
           </InfoWindow>
         )}
        </Marker>
      ))}

    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(MapCreator));

export default function App() {
  return (
    <div style={{ width: `100%`, height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
        keys.googleApi
        }`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}