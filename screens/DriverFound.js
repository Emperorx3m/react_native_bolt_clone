import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native';
import MapViewDirectionsRoutesAPI from 'react-native-maps-directions-routes-api';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { calculateRideFare, generateDrivers } from 'utils/constants';
import { MaterialIcons, FontAwesome, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
const { height } = Dimensions.get("window");
import { setDestination, setIntermediate, setOrigin, setTravelTimeInfo } from 'slices/navSlice';
import RideCancelBottomSheet from 'components/RideCancelBottomSheet';

const DriverFound = () => {
    const dispatch = useDispatch()
    const nav = useNavigation();
    const origin_ = useSelector((state) => state.nav.origin)
    const destination_ = useSelector((state) => state.nav.destination)
    const intermediate_ = useSelector((state) => state.nav.intermediate)
    const travelInfo = useSelector((state) => state.nav.travelTimeInfo)
    const bottomSheetRef = useRef(null);
    const [routes, setroutes] = useState(null)
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [driver, setDriver] = useState()
    const route = useRoute();
    const [cancelConfirm, setCancelConfirm] = useState(false);
    let driver_ = route?.params?.DriverFound
    

    useEffect(() => {
        if (driver_) {
            
            setDriver(driver_)
        }

    }, [driver_])

    const fitToCoordinates = {
        edgePadding: { top: 100, right: 100, bottom: 250, left: 100 },
        animated: true,
    };

    const onMapIsReady = (routeOBJ) => {
        setroutes(routeOBJ)
    }

    const onSelectRoute = (routeindex) => {
        setSelectedRouteIndex(routeindex)
    }

    const cancelP = () => {
        dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setIntermediate([]));
        dispatch(setTravelTimeInfo([]));
        nav.replace('Home')
    };

    useEffect(() => {

    }, [])

    
    return (
        <View className="flex-1">

            {/* <View style={{ flex: 1 }}> */}
                {origin_ && driver && <MapViewDirectionsRoutesAPI
                    origin={origin_}
                    destination={driver}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={4}
                    strokeColor="blue"
                    computeAlternativeRoutes={false}
                    fitToCoordinates={fitToCoordinates}
                    onReady={onMapIsReady}
                    onSelectRoute={onSelectRoute}
                    selectedRouteColor={'blue'}
                    notselectedRouteColor={'black'}
                />}
            {/* </View> */}
            {
                !cancelConfirm ?
                    <BottomSheet
                        ref={bottomSheetRef}
                        style={{ zIndex: 99999, flex: 1 }}
                        backgroundStyle={{ backgroundColor: 'white' }}
                        maxDynamicContentSize={350}
                        index={1}
                        snapPoints={['35%', '50%', '80%']}
                    >

                        {routes && driver ?
                            <BottomSheetScrollView className="p-6 borderx">
                                <TouchableOpacity
                                    className="absolute right-4 top-4"
                                    onPress={() => bottomSheetRef?.current?.snapToIndex(0)}
                                >
                                    <MaterialCommunityIcons name="close" size={30} color="gray" />
                                </TouchableOpacity>

                                <View className="items-center">
                                    <Image
                                        source={{ uri: driver?.image }}
                                        className="w-20 h-20 rounded-full border-2 border-yellow-500"
                                    />
                                    <Text className="text-2xl font-bold mt-2">{driver?.name}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <FontAwesome name="star" size={18} color="green" />
                                        <Text className="text-lg ml-1">{driver?.rating}</Text>
                                        <Text className="text-gray-500 ml-2">{driver?.rides} viajes</Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-around mt-6">
                                    <TouchableOpacity className="items-center">
                                        <View className="bg-gray-100 p-4 rounded-full">
                                            <MaterialCommunityIcons name="message-text" size={30} color="black" />
                                        </View>
                                        <Text className="mt-1 text-gray-700">Chat</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="items-center">
                                        <View className="bg-gray-100 p-4 rounded-full">
                                            <MaterialCommunityIcons name="phone-in-talk" size={30} color="black" />
                                        </View>
                                        <Text className="mt-1 text-gray-700">Llamada por internet</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="items-center">
                                        <View className="bg-gray-100 p-4 rounded-full">
                                            <MaterialCommunityIcons name="phone" size={30} color="black" />
                                        </View>
                                        <Text className="mt-1 text-gray-700">Llamar</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className=" p-4 rounded-lg mt-6">
                                    <View className="flex-row items-start bg-gray-100 p-4">
                                        <MaterialCommunityIcons name="star-circle" size={24} color="gold" />
                                        <View className="ml-3 p-2">
                                            <Text className="font-bold">Mejor conductora</Text>
                                            <Text className="text-gray-600 break-all px-4">
                                                {driver?.name} está en el 10% de mejores conductoresas en cuanto a servicio y fiabilidad.
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-start mt-4 p-4 bg-gray-100">
                                        <MaterialCommunityIcons name="check-circle" size={24} color="green" />
                                        <View className="ml-3">
                                            <Text className="font-bold">Conductor/a verificado/a</Text>
                                            <Text className="text-gray-600 px-4">
                                                La identidad y el teléfono de todos los conductores que colaboran con Bolt han sido verificados.
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <Text className="text-gray-600 text-center">
                                    ¡Nuevo! Activa los códigos de recogida para no equivocarte de coche.
                                </Text>

                                {/* Route Section */}
                                <View className="mt-4">
                                    <Text className="font-bold text-lg">Mi ruta</Text>

                                    <View className="mt-2">
                                        {/* Pickup Location */}
                                        <View className="flex-row items-center p-2">
                                            <FontAwesome name="circle" size={14} color="green" />
                                            <Text className="ml-3 text-base font-semibold">{origin_?.address}</Text>
                                            <TouchableOpacity className="ml-auto">
                                                <MaterialCommunityIcons name="pencil" size={18} color="gray" />
                                            </TouchableOpacity>
                                        </View>


                                        {intermediate_?.map((stop, index) => {
                                            console.log(stop)
                                            return (
                                            <View key={index} className="flex-row items-center p-2">
                                                <MaterialCommunityIcons name="bus-stop" size={18} color="blue" />
                                                <Text className="ml-3 text-base font-semibold">{stop?.location?.latLng?.address}</Text>
                                                <TouchableOpacity className="ml-auto">
                                                    <MaterialCommunityIcons name="pencil" size={18} color="gray" />
                                                </TouchableOpacity>
                                            </View>
                                        )})}

                                        {/* Add Stop */}
                                        {(intermediate_ && intermediate_.length < 2) && (
                                            <View className="flex-row items-center mt-2 p-2">
                                                <FontAwesome name="plus-circle" size={14} color="blue" />
                                                <Text className="ml-3 text-blue-500">Añadir parada</Text>
                                            </View>
                                        )}


                                        {/* Drop-off Location */}
                                        <View className="flex-row items-center mt-2 p-2">
                                            <FontAwesome name="map-marker" size={18} color="blue" />
                                            <Text className="ml-3 text-base font-semibold">{destination_?.address}</Text>
                                            <TouchableOpacity className="ml-auto">
                                                <MaterialCommunityIcons name="pencil" size={18} color="gray" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Edit Destinations */}
                                    <TouchableOpacity className="mt-4 flex-row items-center p-2">
                                        <MaterialCommunityIcons name="map-marker-path" size={20} color="black" />
                                        <Text className="ml-2 text-gray-700">Editar destinos</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Payment Section */}
                                <View className="mt-6">
                                    <Text className="font-bold text-lg">Método de pago</Text>
                                    <View className="flex-row justify-between mt-2">
                                        <View className="flex-row items-center">
                                            <MaterialCommunityIcons name="cash-100" size={24} color="green" />
                                            <Text className="ml-2 text-base">Efectivo</Text>
                                        </View>
                                        <Text className="text-lg font-bold">₦{ travelInfo?.[0]?.price?.discountedFare ?? travelInfo?.[0]?.price?.normalFare}</Text>
                                    </View>
                                </View>

                                {/* More Options */}
                                <View className="mt-6 mb-8 ">
                                    <Text className="font-bold text-lg">Más</Text>

                                    {/* Share Ride */}
                                    <TouchableOpacity className="flex-row items-center mt-4 p-2">
                                        <MaterialCommunityIcons name="share-variant" size={22} color="black" />
                                        <Text className="ml-3 text-base">Compartir detalles del viaje</Text>
                                    </TouchableOpacity>

                                    {/* Contact Driver */}
                                    <TouchableOpacity className="flex-row items-center mt-4 p-2">
                                        <MaterialCommunityIcons name="phone" size={22} color="black" />
                                        <Text className="ml-3 text-base">Contactar con el conductor</Text>
                                    </TouchableOpacity>

                                    {/* Cancel Ride */}
                                    <TouchableOpacity onPress={() => {
                                        // bottomSheetRef?.current?.snapToIndex(0)
                                        setCancelConfirm(true)
                                        }} className="flex-row items-center mt-4 p-2">
                                        <MaterialCommunityIcons name="close-circle" size={22} color="red" />
                                        <Text className="ml-3 text-base text-red-600">Cancelar viaje</Text>
                                    </TouchableOpacity>
                                </View>

                            </BottomSheetScrollView>
                            :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size="large" color="#007bff" />
                            </View>
                        }
                    </BottomSheet>
                    :
                    <RideCancelBottomSheet cancelP={cancelP} setCancelConfirm={setCancelConfirm} />
            }
        </View>
    );
};

export default DriverFound