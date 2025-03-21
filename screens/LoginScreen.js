import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Button } from "react-native";
import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import CountryPicker from "react-native-country-picker-modal";
import { useSelector, useDispatch } from 'react-redux'
import { setCountryAndCallCode } from "slices/countryCodeSlice";


export default function LoginScreen() {
    const country = useSelector((state) => state.countryCode.country)
    const countryCode = useSelector((state) => state.countryCode.countryCode)
    const callingCode = useSelector((state) => state.countryCode.callingCode)
    const dispatch = useDispatch()

    const [isPickerVisible, setPickerVisible] = useState(false);
    const nav = useNavigation();

    const sendcode = () => {
        nav.navigate('SendCode');
    }

    const onSelect = (selectedCountry) => {
        let country = selectedCountry?.name;
        let countryCode = selectedCountry.cca2;        
        let callingCode = `+${selectedCountry.callingCode[0]}`;

        dispatch(setCountryAndCallCode({ country, countryCode, callingCode }));
        
        sendcode();
        // nav.navigate('SendCode', { country_: selectedCountry?.name, countryCode_: selectedCountry.cca2, callingCode_: `+${selectedCountry.callingCode[0]}` });
    };


    const toggleCountryPicker = () => {
        setPickerVisible(true);
        console.log("tcp", isPickerVisible)
    };

    return (
        <>
            <View className="flex-1 bg-white px-6 py-12 justify-center">
                {/* Phone Input */}
                <Text className="text-xl font-semibold text-center mb-4">Enter your number</Text>
                <View className="border border-gray-300  bg-gray-100 rounded-lg flex-row items-center px-4 py-3 mb-6">
                    <View className='flex-row items-center'>
                        <CountryPicker
                            withCallingCode
                            withFlag
                            countryCode={countryCode}
                            onSelect={onSelect}
                            visible={isPickerVisible}
                        />
                        <AntDesign onPress={toggleCountryPicker} name="down" size={12} className="-ml-1 mr-2" />
                    </View>

                    <Text className="text-lg font-medium mr-2">{callingCode}</Text>
                    <View onTouchStart={sendcode} title='sdf' className="flex-1 h-full bg-transparent"
                    />

                </View>

                <View className="flex-row items-center mb-6">
                    <View className="flex-1 h-[1px] bg-gray-300" />
                    <Text className="mx-3 text-gray-500 text-sm">OR</Text>
                    <View className="flex-1 h-[1px] bg-gray-300" />
                </View>

                <View className="flex-row bg-white border border-gray-300 rounded-full p-4 mb-4 items-center">
                    <FontAwesome6 name="google" size={20} className="mr-3" />
                    <Text className="text-base flex-1 text-center font-medium">Sign in with Google</Text>
                </View>

                <View className="flex-row bg-white border border-gray-300 rounded-full p-4">
                    <FontAwesome6 name="facebook" size={20} color="#1877F2" className="mr-3" />
                    <Text className="text-base flex-1 text-center font-medium">Sign in with Facebook</Text>
                </View>
            </View>

            <View>
                <Text className="text-xs text-gray-500 text-center mb-4 p-4">
                    By signing up, you agree to our{" "}
                    <Text className="text-blue-600">Terms & Conditions</Text>, acknowledge our{" "}
                    <Text className="text-blue-600">Privacy Policy</Text>, and confirm that you’re over 18. We may send promotions related to our services – you can unsubscribe anytime in Communication Settings under your profile.
                </Text>
            </View>

        </>
    );
}
