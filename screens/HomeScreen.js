import { View, Text, Image } from 'react-native';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentLocation, setIntermediate } from 'slices/navSlice';
import { generateDrivers, getPlaceNameFromCoords } from 'utils/constants';
import car from 'assets/carmap.png';


const HomeScreen = () => {
  const currentLocation = useSelector((state) => state.nav.currentLocation)
    const dispatch = useDispatch()
  const navigation = useNavigation();
  const sheetRef = useRef(null);
  const [Drivers, setDrivers] = useState([])


  useEffect(() => {
    if(!currentLocation) {
      dispatch(
        setCurrentLocation({
          address: '',
          latitude: 6.58130,
          longitude: 3.35280,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        })
      );
      return
    };
          const fetchAndMergeMarkers = (num) => {
              setDrivers(generateDrivers(currentLocation, num,null, false));
          };
          fetchAndMergeMarkers( Math.floor(Math.random() * 1) + 12);

  }, [currentLocation])
  
  useEffect(() => {
    let locationSubscription = null;
  
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
  
      // Start watching location changes
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update when user moves 10 meters
        },
        async (location) => {
          if (!location?.coords) return;
  
          let placeName = await getPlaceNameFromCoords(location.coords.latitude, location.coords.longitude);
  
          dispatch(
            setCurrentLocation({
              address: placeName,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
            })
          );
        }
      );
    })();
  
    // Cleanup function to stop location tracking when unmounted
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Define Bottom Sheet snap points
  const snapPoints = useMemo(() => ['19%', '20%', '30%', '40%', '49%', '50%', '100%'], []);

  const handleSheetChange = useCallback((index) => {
    if (index > 5) {
      sheetRef.current?.snapToIndex(7);
      NavNow();
  } else {
      sheetRef.current?.snapToIndex(0); 
  }
  }, [navigation]);

  const NavNow = () => {
      sheetRef.current?.snapToIndex(0); 
      navigation.navigate('SelectPickAndDrop');
  }


  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 items-center'>
        <MapView
          style={{ width: '100%', height: '100%' }}
          provider={PROVIDER_GOOGLE}
          initialRegion={currentLocation}
          region={currentLocation}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {Drivers && 
          Drivers.map((driver, index) => {
            return (
              <Marker
              key={index}
              coordinate={{
                latitude: driver?.latitude,
                longitude: driver?.longitude,
              }}
            >
            <Image source={car} className='h-16 w-16' />
            </Marker>
          )})
          }
          {/* {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude,
              }}
            >
            <Image source={car} className='h-16 w-16' />
            </Marker>
          )} */}
        </MapView>
      </View>
      
        <BottomSheet
          ref={sheetRef}
          onChange={handleSheetChange}
          snapPoints={snapPoints}
          index={0}
        backgroundStyle={{ backgroundColor: 'white' }}
        >
          <BottomSheetView >
            <View className="bg-white p-4 rounded-t-xl shadow-md">
             <View onTouchStart={NavNow} className="bg-gray-100 mb-8 p-4 border-gray-100 rounded-xl shadow-md">
             
              <Text className="text-lg font-semibold">Where to?</Text>
               </View>
              <Text className="text-gray-500">Rides - Let’s get moving</Text>
            </View>
          </BottomSheetView>
        </BottomSheet>
    </SafeAreaView>
  );
};

export default HomeScreen;
