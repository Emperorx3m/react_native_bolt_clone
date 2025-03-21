import { GOOGLE_MAPS_APIKEY } from '@env';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons, FontAwesome, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector, useDispatch } from 'react-redux'
import { setDestination, setIntermediate, setOrigin } from 'slices/navSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DefaultLocationInput } from 'components/DefaultLocationInput';
import { getPlaceNameFromCoords } from 'utils/constants';

const { width, height } = Dimensions.get("window");
const SelectPickAndDrop = () => {
    const [focusedorg, setfocusedorg] = useState(true)
    const [focuseddest, setfocuseddest] = useState(true)
    const [showMap, setShowMap] = useState(false);
    const [setFor, setsetFor] = useState('');
    const origin_ = useSelector((state) => state.nav.origin)
    const destination_ = useSelector((state) => state.nav.destination)
    const intermediate_ = useSelector((state) => state.nav.intermediate)
    const currentLocation = useSelector((state) => state.nav.currentLocation)
    const dispatch = useDispatch()
    const nav = useNavigation();
    const [Region, setRegion] = useState(null)
    const [firstEntry, setfirstEntry] = useState(true)
    const route = useRoute();
    const mapRef = useRef(null);
    const GPARef = useRef();
    const GPADESTRef = useRef();
    const intermRef1 = useRef(null)
    const intermRef2 = useRef(null)
    let origin;
    let destination;
    const setOrgn = () => {
        if ((currentLocation && origin_) || (!currentLocation && origin_)) {
            origin = origin_
        } else {
            if (currentLocation && !origin_) origin = currentLocation
            if (!currentLocation && !origin_) origin = def_orig;
        }
    }

    const setDst = () => {
        if (destination_) {
            destination = destination_
        } else {
            destination = def_dest;
        }
    }

    useEffect(() => {
        if (route?.params?.add) {
            console.log("add is clicked")
            intermediate_.length < 1 ? intermRef1.current?.focus() : intermRef2.current?.focus()
        } else {
            if (intermediate_.length) {
                dispatch(setIntermediate([]));
            }
        }

    }, [route?.params?.add])


    let def_orig = {
        latitude: 6.57697,
        longitude: 3.26648
    }
    let def_dest = {
        latitude: 6.57697,
        longitude: 3.26648
    }


    setOrgn();
    setDst();

    useEffect(() => {
        setOrgn
    }, [currentLocation])

  useEffect(() => {
        setDst
    }, [destination_])


    const setOrigNm = useCallback(
        async () => {
            if (origin && origin?.address == '') {
                let placeName = await getPlaceNameFromCoords(origin?.latitude, origin?.longitude)
                let Region_ = { ...origin, address: placeName }
                GPARef.current?.setAddressText(placeName);
                dispatch(setOrigin(Region_))
            }
            else {
                if (!origin_ && origin) {
                    if (origin?.address == '') {
                        let placeName = await getPlaceNameFromCoords(origin?.latitude, origin?.longitude)
                        let Region_ = { ...origin, address: placeName }
                        GPARef.current?.setAddressText(placeName);
                        dispatch(setOrigin(Region_))
                    } else {
                        origin?.address ? GPARef.current?.setAddressText(origin.address) : null;
                        dispatch(setOrigin(origin))
                    }

                } else {
                    origin?.address ? GPARef.current?.setAddressText(origin.address) : null;
                }

            }
        },
        [origin],
    )

    const setDestNm = useCallback(
        async () => {
            if (destination_ && destination_?.address == '') {
                let placeName = await getPlaceNameFromCoords(destination_?.latitude, destination_?.longitude)
                let Region_ = destination_
                GPADESTRef.current?.setAddressText(placeName);
                Region_.address = placeName;
                dispatch(setDestination(Region_))
            } else {
                destination_?.address ? GPADESTRef.current?.setAddressText(destination_?.address) : null;
            }
        },
        [destination_],
    )

    const setIntermNm = useCallback(async (index, ref) => {
        if (intermediate_[index] && intermediate_[index].location.latLng.address === '') {
            let placeName = await getPlaceNameFromCoords(
                intermediate_[index].location.latLng.latitude,
                intermediate_[index].location.latLng.longitude
            );

            let updatedIntermediate = [...intermediate_];
            updatedIntermediate[index] = {
                ...updatedIntermediate[index],
                location: {
                    latLng: {
                        ...updatedIntermediate[index].location.latLng,
                        address: placeName,
                    },
                },
            };

            ref.current?.setAddressText(placeName);
            dispatch(setIntermediate(updatedIntermediate));
        } else {
            intermediate_[index]?.location.latLng.address &&
                ref.current?.setAddressText(intermediate_[index].location.latLng.address);
        }
    }, [intermediate_]);

    useEffect(() => {
        setIntermNm(0, intermRef1);
        setIntermNm(1, intermRef2);
    }, [intermediate_]);

    useEffect(() => {
        setfirstEntry(false)
        setOrigNm();
        setDestNm();
        setIntermNm(0, intermRef1);
        setIntermNm(1, intermRef2);
    }, []);

   
    const handleRegionChangeComplete = (newRegion) => {
        setRegion(
            {
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00922,
                address: ''
            }
        );
    };

    const confirmOrigdest = async () => {

        let placeName = await getPlaceNameFromCoords(Region?.latitude, Region?.longitude);
        let Region_ = { ...Region, address: placeName };


        if (setFor === 'pick') {
            GPARef.current?.setAddressText(placeName);
            dispatch(setOrigin(Region_));
            setShowMap(false);
        } else if (setFor === 'dest') {
            GPADESTRef.current?.setAddressText(placeName);
            dispatch(setDestination(Region_));
            setShowMap(false);
        } else if (setFor === 'interm1' || setFor === 'interm2') {
            let intermediateIndex = setFor === 'interm1' ? 0 : 1;
            let currentIntermediate = [...intermediate_];
            // setFor === 'interm1' ? intermRef1.current?.setAddressText(placeName) : intermRef2.current?.setAddressText(placeName);
            let intermediateData = {
                location: {
                    latLng: {
                        address: placeName,
                        latitude: Region_.latitude,
                        longitude: Region_.longitude,
                        heading: 0,
                        customMarker: {
                            image: require("assets/mapstop.png"),
                            width: 20,
                            height: 30,
                            pinColor: 'blue',
                            title: setFor === 'interm1' ? 'intermedio-1' : 'intermedio-2',
                            anchorX: 0.5,
                            anchorY: 0.25,
                            centerOffsetX: 0,
                            centerOffsetY: 0,
                        },
                    },
                },
            };

            if (currentIntermediate.length > intermediateIndex) {
                currentIntermediate[intermediateIndex] = intermediateData;
            } else {
                currentIntermediate.push(intermediateData);
            }

            dispatch(setIntermediate(currentIntermediate));
            setShowMap(false);

        }
        gotoSelectRide();
    };

    const gotoSelectRide = () => {

        if (origin_ && destination_ && !firstEntry) {
            console.log("241")
            nav.replace("SelectRide");
        }
    }


    const ConfirmAutoComplete = (details, setFor_ = 'pick') => {
        if (!details) return;
        let region = {
            latitude: details?.location?.latitude,
            longitude: details?.location?.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00922,
            address: details?.displayName?.text ?? (details?.shortFormattedAddress ?? details?.formattedAddress)
        };


        if (setFor_ === 'pick') {
            dispatch(setOrigin(region));
        } else if (setFor_ === 'dest') {
            dispatch(setDestination(region));
        } else if (setFor_ === 'interm1' || setFor_ === 'interm2') {
            let intermediateIndex = setFor_ === 'interm1' ? 0 : 1;
            let currentIntermediate = [...intermediate_];
            let intermediateData = {
                location: {
                    latLng: {
                        address: region.address,
                        latitude: region.latitude,
                        longitude: region.longitude,
                        heading: 0,
                        customMarker: {
                            image: require("assets/mapstop.png"),
                            width: 20,
                            height: 30,
                            pinColor: 'blue',
                            title: setFor_ === 'interm1' ? 'intermedio-1' : 'intermedio-2',
                            anchorX: 0.5,
                            anchorY: 0.25,
                            centerOffsetX: 0,
                            centerOffsetY: 0,
                        },
                    },
                },
            };

            if (currentIntermediate.length > intermediateIndex) {
                // Modify existing entry
                currentIntermediate[intermediateIndex] = intermediateData;
            } else {
                // Add new entry
                currentIntermediate.push(intermediateData);
            }

            dispatch(setIntermediate(currentIntermediate));
        }

        gotoSelectRide();
    };


    useEffect(() => {
        gotoSelectRide();
    }, [origin_, destination_])


    useEffect(() => {
        !route?.params?.add && GPADESTRef.current?.focus();
    }, []);

    const handleRemoveIntermediate = (index) => {
        let updatedIntermediate = [...intermediate_];
        updatedIntermediate.splice(index, 1);

        dispatch(setIntermediate(updatedIntermediate));
        intermRef1?.current?.focus()
        intermRef1?.current?.setAddressText(updatedIntermediate?.[0]?.location.latLng.address);
        dispatch(setIntermediate(updatedIntermediate)); // Update Redux state
    };

    return (
        <SafeAreaView className="flex-1 mt-16">
            <View className="flex-1 p-4 bg-white">


                <DefaultLocationInput type="pick" focused={focusedorg} GPARef_={GPARef} ConfirmAutoComplete={ConfirmAutoComplete} setShowMap={setShowMap} setsetFor={setsetFor} />

                <DefaultLocationInput type="dest" focused={focuseddest} GPARef_={GPADESTRef} ConfirmAutoComplete={ConfirmAutoComplete} setShowMap={setShowMap} setsetFor={setsetFor} />

                {route?.params?.add && intermediate_.length > 0 && (
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <DefaultLocationInput
                                type="interm1"
                                focused={true}
                                GPARef_={intermRef1}
                                ConfirmAutoComplete={ConfirmAutoComplete}
                                setShowMap={setShowMap}
                                setsetFor={setsetFor}
                            />
                        </View>
                        <TouchableOpacity onPress={() => handleRemoveIntermediate(0)}>
                            <MaterialCommunityIcons name="close" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                )}

                {route?.params?.add && intermediate_.length > 1 && (
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <DefaultLocationInput
                                type="interm2"
                                focused={true}
                                GPARef_={intermRef2}
                                ConfirmAutoComplete={ConfirmAutoComplete}
                                setShowMap={setShowMap}
                                setsetFor={setsetFor}
                            />
                        </View>
                        <TouchableOpacity onPress={() => handleRemoveIntermediate(1)}>
                            <MaterialCommunityIcons name="close" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Show Add Input Only If There’s Space for More */}
                {route?.params?.add && intermediate_.length < 2 && (
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <DefaultLocationInput
                                type={intermediate_.length === 0 ? "interm1" : "interm2"}
                                focused={true}
                                GPARef_={intermediate_.length === 0 ? intermRef1 : intermRef2}
                                ConfirmAutoComplete={ConfirmAutoComplete}
                                setShowMap={setShowMap}
                                setsetFor={setsetFor}
                            />
                        </View>
                        <TouchableOpacity onPress={() => handleRemoveIntermediate(intermediate_.length - 1)}>
                            <MaterialCommunityIcons name="close" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                )}





                {showMap && (
                    <View className="absolute inset-0 z-50 bg-white ">
                        <TouchableOpacity className="absolute z-50 top-4 right-4 p-2 bg-gray-500 rounded-full" onPress={() => setShowMap(false)}>
                            <MaterialCommunityIcons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <MapView
                            ref={mapRef}
                            style={{ flex: 1 }}
                            showsMyLocationButton={true}
                            initialRegion={{
                                latitude: (() => {
                                    if (setFor === 'pick') return origin?.latitude;
                                    if (setFor === 'dest') return destination?.latitude;
                                    if (setFor === 'interm1' && intermediate_.length > 0) return intermediate_[0]?.location?.latLng?.latitude;
                                    if (setFor === 'interm2' && intermediate_.length > 1) return intermediate_[1]?.location?.latLng?.latitude;
                                    return destination?.latitude; // Default to destination if nothing matches
                                })(),
                                longitude: (() => {
                                    if (setFor === 'pick') return origin?.longitude;
                                    if (setFor === 'dest') return destination?.longitude;
                                    if (setFor === 'interm1' && intermediate_.length > 0) return intermediate_[0]?.location?.latLng?.longitude;
                                    if (setFor === 'interm2' && intermediate_.length > 1) return intermediate_[1]?.location?.latLng?.longitude;
                                    return destination?.longitude; // Default to destination if nothing matches
                                })(),
                                latitudeDelta: 0.00922,
                                longitudeDelta: 0.00421,
                            }}


                            onRegionChangeComplete={handleRegionChangeComplete} on
                        />
                        <View style={{
                            position: "absolute",
                            top: height / 2 - 40,
                            left: width / 2 - 20,
                            zIndex: 10,
                        }}>
                            <FontAwesome name="map-pin" size={40} color="green" />
                        </View>

                        {
                            Region &&
                            <View className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-300 shadow-md">
                                <TouchableOpacity
                                    className="bg-green-500 p-4 rounded-lg"
                                    onPress={() => {
                                        confirmOrigdest();

                                    }}
                                >
                                    <Text className="text-white text-center font-semibold">
                                        Confirm {setFor === 'pick' ? 'Pick up' : setFor === 'dest' ? 'Destination' : `Next Stop ${setFor === 'interm1' ? '1' : '2'}`}

                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SelectPickAndDrop;