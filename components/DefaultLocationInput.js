import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MaterialCommunityIcons, FontAwesome, Octicons } from '@expo/vector-icons';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'

export const DefaultLocationInput = ({ type, focused, GPARef_, ConfirmAutoComplete, setShowMap, setsetFor }) => {
    const isPickup = type === 'pick';
    const isIntermediate1 = type === 'interm1';
    const isIntermediate2 = type === 'interm2';
    const zIndex = isPickup ? 5 : isIntermediate1 ? 3 : isIntermediate2 ? 2 : 4; // Manage layering  
    const origin = useSelector((state) => state.nav.origin)

    // Dynamic Placeholder & Label
    const placeholderText = isPickup
        ? 'Enter Pickup'
        : isIntermediate1
            ? 'Enter Next Stop 1'
            : isIntermediate2
                ? 'Enter Next Stop 2'
                : 'Enter Destination';

    const googlePlacesStyles = {
        container: {
            flex: 1,
        },
        textInput: {
            height: 38,
            fontSize: 16,
            backgroundColor: 'transparent',
            zIndex: 9,
        },
        listView: {
            position: 'absolute',
            top: 45,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderRadius: 5,
            flex: 1,
            elevation: 3,
            zIndex: 10000,
        },
        row: {
            zIndex: 10,
            padding: 13,
            height: 54,
            flexDirection: 'row',
        },
        separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
        },
        description: {
            fontSize: 15,
        },
        loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
        },
    };

    return (
        <View
            className={`mb-2 rounded-lg flex-row items-center p-2 bg-gray-100 border-2 ${focused ? 'border-green-500' : 'border-gray-300'
                }`}
            style={{ zIndex }}
        >
            <Octicons name="search" size={24} color="black" />
            <GooglePlacesAutocomplete
                ref={GPARef_}
                placeholder={placeholderText}
                minLength={3}
                fetchDetails={true}
                keepResultsAfterBlur={false}
                onPress={(data, details = null) => {
                    GPARef_?.current?.blur();
                    ConfirmAutoComplete(details, type); // Pass dynamic type
                }}
                query={{
                    key: GOOGLE_MAPS_APIKEY,

                    "locationBias": {
                        "circle": {
                            "center": {
                                "latitude": origin?.latitude ?? 9.072264,
                                "longitude": origin?.longitude ?? 7.491302
                            },
                            "radius": 500.0
                        }
                    }

                }}
                enablePoweredByContainer={false}
                styles={googlePlacesStyles}
                debounce={300}
                isNewPlacesAPI={true}
                requestUrl={{
                    url: 'https://places.googleapis.com',
                    useOnPlatform: 'all',
                    headers: { 'Content-Type': 'application/json' },
                }}
            />
            {/* {(GPARef_?.current?.getAddressText() || (isPickup ? origin : isIntermediate1 ? intermediate_[0] : isIntermediate2 ? intermediate_[1] : destination)) && ( */}
            <TouchableOpacity
                onPress={() => {
                    GPARef_?.current?.setAddressText('');
                    GPARef_?.current?.blur();
                    console.log(`${type} text`, GPARef_?.current?.getAddressText());
                }}
                className="ml-2 bg-gray-200 p-1 rounded-full"
            >
                <MaterialCommunityIcons name="close" size={16} color="black" />
            </TouchableOpacity>
            {/* )} */}
            <TouchableOpacity
                onPress={() => {
                    console.log("lets go")
                    setShowMap(true);
                    setsetFor(type);
                }}
                className="ml-2"
            >
                <MaterialCommunityIcons name="map-marker-path" size={30} color="green" />
            </TouchableOpacity>
        </View>
    );
};
