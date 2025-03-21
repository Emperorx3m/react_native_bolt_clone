import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import { setDestination, setIntermediate, setOrigin, setTravelTimeInfo } from 'slices/navSlice';
import { generateDrivers, getPlaceNameFromCoords } from 'utils/constants';
import { FontAwesome } from '@expo/vector-icons';
import RideCancelBottomSheet from 'components/RideCancelBottomSheet';
import FindingDriver from 'components/FindingDriver';

const ConfirmPickup = () => {
    const dispatch = useDispatch()
    const mapRef = useRef(null);
    const nav = useNavigation();
    const [setFor, setsetFor] = useState('pick');

    const origin_ = useSelector((state) => state.nav.origin)
    const destination_ = useSelector((state) => state.nav.destination)
    const travelInfo = useSelector((state) => state.nav.travelTimeInfo)
    const [DriverFound, setDriverFound] = useState(null)
    const [confirmRide, setConfirm] = useState(false)
    const [mapWidth, setMapWidth] = useState(0);
    const [mapHeight, setMapHeight] = useState(0);
    const [cancelConfirm, setCancelConfirm] = useState(false);


    useEffect(() => {
        if (!confirmRide || !travelInfo?.[0]?.rideType) return;
        console.log('travelInfo', travelInfo)
        let min = 4;
        let max = 15;
        const drivers = generateDrivers(origin_, 3, travelInfo?.[0]?.rideType);

        const randomTime = Math.floor(Math.random() * ((max * 1000) - (min * 1000) + 1)) + (min * 1000);

        const timeout = setTimeout(() => {
            const selectedDriver = drivers[Math.floor(Math.random() * drivers.length)];
            setDriverFound(selectedDriver);
        }, randomTime);

        return () => clearTimeout(timeout);
    }, [confirmRide, travelInfo]);

    useEffect(() => {
        if (!confirmRide || !DriverFound) return;

        let min = 8;
        let max = 30;

        const randomTime = Math.floor(Math.random() * ((max * 1000) - (min * 1000) + 1)) + (min * 1000);

        const timeout = setTimeout(() => {
            nav.replace("DriverFound", { DriverFound });
        }, randomTime);

        return () => clearTimeout(timeout);
    }, [confirmRide, DriverFound]);



    const handleRegionChangeComplete = async (newRegion) => {
        if(confirmRide) return;
        console.log("New regional:", newRegion);

        // Get updated address
        let placeName = await getPlaceNameFromCoords(newRegion?.latitude, newRegion?.longitude);
        if (setFor === 'pick' && origin_) {
            const updatedOrigin = {
                ...origin_,
                latitude: newRegion?.latitude,
                longitude: newRegion?.longitude,
                address: placeName
            };
            dispatch(setOrigin(updatedOrigin));
        }
    };


    const confirmOrigdest = async () => {

        setConfirm(true)
    };



    const editP = () => {
        setDriverFound(null);
        setConfirm(false);
    }

    const cancelP = () => {
        dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setIntermediate([]));
        dispatch(setTravelTimeInfo([]));
        nav.replace('Home')
    };

    useEffect(() => {
      if (mapRef.current) {
        // Force reset camera to initial region when component mounts
        mapRef.current.setCamera({
          center: {
            latitude: (() => {
                if (setFor === 'pick') return origin_?.latitude;
                if (setFor === 'dest') return destination_?.latitude;
            })(),
            longitude: (() => {
                if (setFor === 'pick') return origin_?.longitude;
                if (setFor === 'dest') return destination_?.longitude;

            })(),
          },
          zoom: 34, // Adjust zoom level to your preference
          heading: 0,
          pitch: 0,
          altitude: 0,
        });
      }
    
    }, [])
    

    return (
        <View className="flex-1">


            {origin_ ?
                <View className=" bg-white flex-1">
                    <View style={{ flex: 1 }} onLayout={(event) => {
                        const { width, height } = event.nativeEvent.layout;
                        setMapWidth(width);
                        setMapHeight(height);
                    }}>
                        <MapView
                            ref={mapRef}
                            scrollEnabled={!confirmRide}
                            zoomEnabled={!confirmRide}
                            // rotateEnabled={true}
                            // pitchEnabled={true}
                            style={{ flex: 1 }}
                            showsMyLocationButton={true}
                            initialRegion={{
                                latitude: (() => {
                                    if (setFor === 'pick') return origin_?.latitude;
                                    if (setFor === 'dest') return destination_?.latitude;
                                })(),
                                longitude: (() => {
                                    if (setFor === 'pick') return origin_?.longitude;
                                    if (setFor === 'dest') return destination_?.longitude;

                                })(),
                                latitudeDelta: 0.0005,
                                longitudeDelta: 0.0005,
                            }}


                            onRegionChangeComplete={handleRegionChangeComplete}
                        />
                        <View style={{
                            position: "absolute",
                            top: mapHeight / 2, // Centered vertically in MapView
                            left: mapWidth / 2,  // Centered horizontally in MapView
                            zIndex: 10,
                        }}>
                            <FontAwesome name="map-pin" size={40} color="green" />
                        </View>
                    </View>


                    {
                        !confirmRide ?
                            <>


                                <View className="px-2 py-2">

                                    <View className='borderx p-6'>
                                        <Text className='font-semibold text-[4vw] py-2'>
                                            Confirm Pickup.
                                        </Text>
                                        <View className='flex-row items-center gap-4'>
                                            <FontAwesome name="map-marker" size={24} color="green" />
                                            <Text className='font-bold texl-xl py-2'>
                                                {origin_?.address}
                                            </Text>
                                        </View>

                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        confirmOrigdest();

                                    }} className="mt-4 bg-green-500 p-3 rounded-lg">

                                        <Text className="text-white text-base text-center font-bold">
                                            Confirm Pickup
                                        </Text>

                                    </TouchableOpacity>

                                </View>
                            </>
                            :


                                <>
                                    {
                                        !cancelConfirm ?
                                            <FindingDriver
                                                DriverFound={DriverFound}
                                                setCancelConfirm={setCancelConfirm}
                                                editPickup={editP}
                                            />
                                            :
                                            <RideCancelBottomSheet cancelP={cancelP} setCancelConfirm={setCancelConfirm} />
                                    }
                                </>
                    }
                </View>
                :
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            }

        </View>
    );
};

export default ConfirmPickup;
