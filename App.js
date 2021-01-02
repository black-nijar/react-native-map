import React, {useEffect, useRef, useState} from 'react';
import {View, PermissionsAndroid, Alert, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const App = () => {
  const [currLocation, setCurrLocation] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    watchLatitude: 20.5937,
    watchLongitude: 78.9629,
  });
  const mapRef = useRef();
  const {latitude, longitude, watchLongitude, watchLatitude} = currLocation;

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        getCurrentPosition();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getCurrentPosition();
          } else {
            Alert.alert('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
  }, [watchLatitude, watchLongitude]);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        console.log('POS :', latitude, longitude);
        setCurrLocation({latitude, longitude});
      },
      (error) => {
        console.log('GPS ERROR :', error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    Geolocation.watchPosition((position) => {
      const {latitude, longitude} = position.coords;
      console.log('WATCH POS :', latitude, longitude);
    });
  };
  return (
    <View style={{flex: 1}}>
      <MapView
        ref={mapRef}
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsCompass={true}
        zoomEnabled={true}
      />
    </View>
  );
};

export default App;
