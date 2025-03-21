import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetHandle, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import MapViewDirectionsRoutesAPI from 'react-native-maps-directions-routes-api';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { calculateRideFare, generateDrivers } from 'utils/constants';
import { MaterialIcons, FontAwesome, Octicons } from '@expo/vector-icons';
import bike from 'assets/fastbike.png';
import car from 'assets/moderncar.png';
const { height } = Dimensions.get("window");
import { setDestination, setTravelTimeInfo, setOrigin } from 'slices/navSlice';

const SelectRide = () => {
    const dispatch = useDispatch()
    const nav = useNavigation();
    const origin_ = useSelector((state) => state.nav.origin)
    const destination_ = useSelector((state) => state.nav.destination)
    const intermediate_ = useSelector((state) => state.nav.intermediate)
    const bottomSheetRef = useRef(null);
    const [bottomSheetHeight, setBottomSheetHeight] = useState(height * 0.3);
    const [routes, setroutes] = useState(null)
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [rideType, setrideType] = useState();
    const RidesArray = ['Bolt', 'Comfort', 'Economy', 'Send MotorBike'];
    const [Drivers, setDrivers] = useState([])
    const [discount, setDiscount] = useState(() => Math.floor(Math.random() * 21))
    const [originMod, setoriginMod] = useState(null)
    const [destinationMod, setdestinationMod] = useState(null)
    const [intermediateMod, setintermediateMod] = useState([]);
    const [randomETAs, setRandomETAs] = useState({});

// Memoize random ETA values so they don't change on every render
useEffect(() => {
    const newETAs = {};
    RidesArray.forEach(ride => {
        newETAs[ride] = Math.floor(Math.random() * 30);
    });
    setRandomETAs(newETAs);
}, []);

    let styleMarker = {

        bubble: { backgroundColor: '#000' },
        arrow: {
            borderColor: '#000',
            borderLeftWidth: 3,
            borderRightWidth: 3,
        },

    }
    const fitToCoordinates = {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
    };

    const onMapIsReady = (routeOBJ) => {
        setroutes(routeOBJ)
        if (destination_) {
            let newDestination = { ...destination_ };
            let CT
            let now = new Date();
            let durationMinutes = typeof routeOBJ?.[0]?.duration === "string"
                ? routeOBJ?.[0]?.duration.endsWith("s")
                    ? Math.ceil(parseInt(routeOBJ?.[0]?.duration, 10) / 60)
                    : null // Keep unchanged if another letter exists
                : Math.ceil(parseInt(routeOBJ?.[0]?.duration, 10));

            if (durationMinutes !== null) {
                now.setMinutes(now.getMinutes() + durationMinutes);
                let formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                CT = `${formattedTime}`;
                console.log(CT);
            }


            if (newDestination.customMarker) {
                // If customMarker exists, update customText and remove image
                newDestination.customMarker = {
                    ...newDestination.customMarker,
                    customText: CT,
                    style: styleMarker
                };
                delete newDestination.customMarker.image;
            } else {
                // If customMarker does not exist, create it
                newDestination = {
                    ...newDestination,
                    heading: newDestination.heading || 0,
                    customMarker: {
                        customText: CT,
                        width: 20,
                        height: 30,
                        pinColor: 'yellow',
                        title: 'Destino',
                        anchorX: 0.5,
                        anchorY: 0.25,
                        centerOffsetX: 0,
                        centerOffsetY: 0,

                    }
                };
            }

            dispatch(setDestination(newDestination));
            setdestinationMod(newDestination);
        }


    }

    const onSelectRoute = (routeindex) => {
        setSelectedRouteIndex(routeindex)
    }

    useEffect(() => {
        if (originMod) {
            const fetchAndMergeMarkers = (num) => {
                setDrivers(generateDrivers(originMod, num));
            };
            fetchAndMergeMarkers(15);
        }

    }, [originMod])

    useEffect(() => {
        setrideType(null)
        if (origin_) {
            if (!origin_.heading || !origin_.customMarker) {
                const newOrigin = {
                    ...origin_, heading: 0, customMarker: {
                        image: require("assets/myloc.png"),
                        width: 20,
                        height: 30,
                        pinColor: 'blue',
                        title: 'Start'
                    }
                };
                dispatch(setOrigin(newOrigin));
                setoriginMod(newOrigin);
            } else {
                setoriginMod(origin_);
            }
        }

        if (destination_) {
            if (!destination_.heading || !destination_.customMarker) {
                const newDestination = {
                    ...destination_, heading: 0, customMarker: {
                        image: require("assets/destino.png"),
                        width: 20,
                        height: 30,
                        pinColor: 'yellow',
                        title: 'Destino',
                        anchorX: 0.25,
                        anchorY: 0.25,
                        centerOffsetX: 0.5,
                        centerOffsetY: 0.2
                    }
                };
                dispatch(setDestination(newDestination));
                setdestinationMod(newDestination);
            } else {
                setdestinationMod(destination_);
            }
        }

        if (intermediate_.length > 0) {
            console.log('intermediate_', JSON.stringify(intermediate_, null, 2))
            setintermediateMod(intermediate_)
        }

    }, [])

    const calcFare = (rides) => {
        return calculateRideFare({ vehicleClass: rides, distanceInMeters: routes?.[selectedRouteIndex].distanceMeters, duration: routes?.[selectedRouteIndex]?.duration, discount: discount })
    }

    const addIntermediates = () => {
        nav.replace('SelectPickAndDrop', { add: true });
    }

    const CustomHandle = () => {
        return (
            // <BottomSheetHandle>
            <View className="w-full mb-4 bg-blue-800 rounded-t-3xl items-center">
                {discount && (
                    <Text className="text-base font-semibold text-white">
                        {discount}% promo applied
                    </Text>
                )}
            </View>

        );
    };

    const bookride = () => {
        console.log("book ride");
        let payload = [{
            price: calcFare(rideType),
            routes,
            rideType,
            discount
        }]
        dispatch(setTravelTimeInfo(payload))
        nav.replace('ConfirmPickup');
    }


    const snapPoints = [height * 0.5];
    let ridetypeSet = 0;

    return (
        <View className="flex-1">
            <View className='flex-row rounded-full bg-gray-200 px-4 w-[92%] top-10 left-6 absolute z-50 p-2 gap-2 items-center'>
                <MaterialIcons name="keyboard-backspace" size={24} color="black"
                    onPress={() => nav.goBack()} />
                <View className='px-8 flex-1 flex-row items-center justify-center'>
                    <Octicons name="search" size={24} color="black" />
                    <Text className='line-clamp-1 ml-2'>{destination_?.address}</Text>
                </View>
                <FontAwesome name="plus-square-o" size={24} color="black" onPress={addIntermediates} />
            </View>
            <View style={{ flex: 1, marginBottom: bottomSheetHeight }}>
                {originMod && destinationMod && <MapViewDirectionsRoutesAPI
                    origin={originMod}
                    destination={destinationMod}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={4}
                    strokeColor="blue"
                    computeAlternativeRoutes={false}
                    fitToCoordinates={fitToCoordinates}
                    extraMarkers={Drivers}
                    onReady={onMapIsReady}
                    onSelectRoute={onSelectRoute}
                    selectedRouteColor={'blue'}
                    notselectedRouteColor={'black'}
                    intermediates={intermediateMod}

                />}
            </View>

            <BottomSheet
                handleComponent={() =>
                    discount ? <CustomHandle /> :
                        <View className='flex justify-center items-center'>
                            <Octicons name="dash" size={34} color="black" />
                        </View>
                }
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                style={{ zIndex: 99999 }}
                backgroundStyle={{ backgroundColor: 'white' }}
                onChange={(index) => {
                    // setBottomSheetHeight(snapPoints[index]);
                }}
            >

                {routes ?
                    <BottomSheetView >
                        <View className="px-2 py-2">

                            {
                                RidesArray.map((rides, i) => {

                                    var matchedDriver = Drivers.find(driver => driver?.vehicle?.class === rides);
                                    var isAvailable = !!matchedDriver;
                                    if (!rideType && isAvailable && !ridetypeSet) {
                                        ridetypeSet = 1
                                        setrideType(rides)
                                    }
                                    
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setrideType(rides)
                                            }}
                                            key={i}
                                            disabled={!isAvailable}
                                            className={`
                ${rides === rideType ? 'border-green-500 border-2' : ''} 
                rounded-lg flex-row items-center mb-2x
                ${isAvailable ? '' : 'opacity-50'}`
                                            }
                                        >
                                            <View className='px-3 py-1'>
                                                {rides.toLowerCase().includes('bike') ?
                                                    <Image source={bike} className='h-16 w-16' /> :
                                                    <Image source={car} className='h-16 w-16' />
                                                }
                                            </View>

                                            <View className='px-3 py-1 flex-1'>
                                                <Text className="font-bold">
                                                    {rides}
                                                    {rides.toLowerCase().includes('bike') && <Text> (Delivery only)</Text>}
                                                </Text>
                                                <Text className="text-gray-500">{isAvailable && `${randomETAs[rides]} min`}   <Text className="text-base">- {matchedDriver?.vehicle?.seats} </Text></Text>
                                            </View>

                                            <View className="px-3 py-1">
                                                {discount ? (
                                                    <>
                                                        <Text className="font-bold text-black">₦{calcFare(rides)?.discountedFare}</Text>
                                                        <Text className="font-bold line-through text-gray-400">₦{calcFare(rides)?.normalFare}</Text>
                                                    </>
                                                ) : (
                                                    <Text className="font-bold text-black">₦{calcFare(rides)?.normalFare}</Text>
                                                )}
                                            </View>

                                        </TouchableOpacity>
                                    );
                                })
                            }

                            {
                                rideType ?
                                    <TouchableOpacity onPress={bookride} className="mt-4 bg-green-500 p-3 rounded-lg">

                                        <Text className="text-white text-base text-center font-semibold">
                                            Select {rideType.toUpperCase()}
                                        </Text>

                                    </TouchableOpacity>
                                    :
                                    <View className='mt-4 bg-green-500 p-3 rounded-lg'>
                                        <ActivityIndicator size="large" color="#000" />
                                    </View>
                            }
                        </View>
                    </BottomSheetView>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#007bff" />
                    </View>
                }
            </BottomSheet>
        </View>
    );
};

export default SelectRide;
