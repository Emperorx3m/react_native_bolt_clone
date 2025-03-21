import { View, Text, TextInput, TouchableOpacity } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import { setCountryAndCallCode } from "slices/countryCodeSlice";


export default function LoginSendCode() {
  const nav = useNavigation();
  const route = useRoute();
  const country = useSelector((state) => state.countryCode.country)
  const countryCode = useSelector((state) => state.countryCode.countryCode)
  const callingCode = useSelector((state) => state.countryCode.callingCode)
  const dispatch = useDispatch()
  const [phone, setphone] = useState('');
  const [error, setError] = useState('');

  const handleCallingCodeChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setphone(numericText);
    setError('');
  };
  const [isPickerVisible, setPickerVisible] = useState(false);

  const toggleCountryPicker = () => {
    setPickerVisible(true); // Toggle visibility
  };

  const onSelect = (selectedCountry) => {
    let country = selectedCountry?.name;
    let countryCode = selectedCountry.cca2;
    let callingCode = `+${selectedCountry.callingCode[0]}`;
    let phone = ''

    dispatch(setCountryAndCallCode({ country, countryCode, callingCode, phone }));
  };

  const sendOTP = () => {
    if (phone.length < 9 || phone.length > 14) {
      setError('Calling code must be between 9 and 14 digits');
    } else {
      let fullPhone = `${callingCode}${phone}`
      console.log("goto sendotp", fullPhone)
      dispatch(setCountryAndCallCode({ country, countryCode, callingCode, phone }));
      nav.navigate("SendOTP")
    }
  }

  return (
    <View className="flex-1 px-4 pt-10 bg-white">
      <TouchableOpacity onPress={() => nav.goBack()} className="mb-6">
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text className="text-xl font-semibold text-black">Enter your number</Text>
      <Text className="text-gray-500 mt-1">We'll send an SMS code for verification</Text>

      <View className="flex-row items-center mt-6">
        <View className="flex-row items-center bg-gray-200 px-3 py-3 border border-gray-300 rounded-lg">
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
          <Text className="ml-2 text-black">{callingCode}</Text>

        </View>
        <View className="flex-1 ml-3">
          <TextInput
            placeholder="Phone number"
            value={phone}
            onChangeText={handleCallingCodeChange}
            keyboardType="numeric"
            className="flex-1 ml-3 px-4 py-3 border border-green-500 rounded-lg text-black"
          />


        </View>
      </View>
      <Text className="ml-2 text-red-500">{error}</Text>

      {/* Continue Button */}
      <TouchableOpacity onPress={sendOTP} className="absolute bottom-10 left-4 right-4 bg-green-500 py-4 rounded-full">
        <Text className="text-center text-white font-semibold text-lg">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
