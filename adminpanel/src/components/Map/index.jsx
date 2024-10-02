import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript
} from "@react-google-maps/api";
import keys from './../../keys.json';
import axios from 'axios';
import nfcIcon from './../../icons/nfcicon.png';

const libraries = ['places', 'geometry']; // Additional libraries if needed

function MapCreator() {
  const [selectedPoint, setselectedPoint] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('api/coordinates')
      .then(values => {
        console.log(values.data);
        setData(values.data);
      });

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
      zoom={14}
      center={{ lat: 50.444571, lng: 30.559099 }}
      mapContainerStyle={{ width: '100%', height: '100vh' }}
    >
      {data.map(dot => (
        <Marker
          key={dot._id}
          position={{
            lat: dot.coordinates.latitude,
            lng: dot.coordinates.longitude
          }}
          onClick={() => setselectedPoint(dot)}
          icon={{
            url: nfcIcon,
            scaledSize: new window.google.maps.Size(40, 64)
          }}
        >
          {selectedPoint && selectedPoint._id === dot._id && (
            <InfoWindow onCloseClick={() => setselectedPoint(null)}>
              <div>
                <h2>Device ID: {selectedPoint.identificatorNFC}</h2>
                <p>Date: {new Date(selectedPoint.date).toUTCString()}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
}

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: keys.googleApi, // Add your API key here
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <MapCreator />;
}
