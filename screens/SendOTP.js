import { useEffect, useRef, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux'
import { setCountryAndCallCode } from "slices/countryCodeSlice";
import { SafeAreaView } from "react-native-safe-area-context";



export default function SendOTP({ onLogin }) {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const nav = useNavigation();
    const phone = useSelector((state) => state.countryCode.phone)
    const callingCode = useSelector((state) => state.countryCode.callingCode)
    const [countdown, setCountdown] = useState(10);
    const [isResendActive, setIsResendActive] = useState(false);
    const [EmError, setEmError] = useState('')
    const [NameError, setNameError] = useState('')


    const inputRefs = useRef([]);

    const correctOTP = ["1", "2", "3", "4"]; // Replace with actual backend OTP verification

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else {
            setIsResendActive(true);
        }

        // Cleanup function
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

    // Function to handle resend OTP
    const handleResendOTP = () => {
        if (isResendActive) {
            // Call your API to resend OTP here

            // Reset the countdown
            Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
            setCountdown(10);
            setIsResendActive(false);
        }
    };

    const validateFullName = () => {
        if (!fullName) { return false }
        const words = fullName.split(/\s+/);
        const fullName_ = words.join(" ");
        const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
        setFullName(fullName_)
        return nameRegex.test(fullName_.trim());
    };

    const validateEmail = () => {
        if (!email) { return false }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() !== "" && emailRegex.test(email.trim());
    };

    const GoLogin = () => {

        if (!validateFullName()) {
            setNameError("Provide a valid Name - No foreign symbols");
            return;
        }
        if (!validateEmail()) {
            setEmError("Provide a valid Email");
            return;
        }

        onLogin(`${callingCode}${phone}`, fullName, email);
        return true

    }

    const handleChange = (text, index) => {
        setError("");
        const isBackspace = text === '' && otp[index] !== '';
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 3) {
            inputRefs.current[index + 1].focus();
        }

        if (isBackspace && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (newOtp.every((val) => val !== "")) {
            if (newOtp.join("") === correctOTP.join("")) {
                setAuthenticated(true);
                setError("");
                setShowForm(true)
            } else {
                setError("Invalid OTP. Please try again.");
            }
        }
    };


    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 px-4 pt-10 bg-white">
                <TouchableOpacity onPress={() => nav.goBack()} className="mb-6">
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>

{
                    !showForm && !authenticated ?
                 <>   
                <Text className="text-xl font-semibold text-black">Enter the code <Text className='text-gray-200'>USE CODE 1234</Text></Text>
                <Text className="text-gray-500 mt-1">
                    An SMS code was sent to <Text className="font-semibold">{`${callingCode}${phone}`}</Text>
                </Text>

                <View className="flex-row mt-6 space-x-4">
                    {otp.map((val, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            value={val}
                            onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''), index)}

                            keyboardType="numeric"
                            maxLength={1}
                            className={`flex-1 mx-4 border-2 ${error ? "border-red-500" : "border-green-500"
                                } text-center text-lg font-semibold rounded-lg`}
                        />
                    ))}
                </View></>
                :
                    null
                    }

                {error && <Text className="text-red-500 mt-2">{error}</Text>}

                {
                    !showForm && !authenticated ?
                        countdown < 1 ?
                            <TouchableOpacity onPress={handleResendOTP}>
                                <Text className="mt-4 font-bold text-green-500">
                                    Resend code
                                </Text>
                            </TouchableOpacity>
                            :
                            <Text className="mt-4 text-gray-500">
                                Resend code in <Text className="font-bold">{countdown}</Text>
                            </Text>

                        :
                        <View className=" mt-6">
                            <Text className="pl-4  pb-4 text-gray-500 mt-1">
                                Full Name </Text>

                            <TextInput
                                value={fullName}
                                maxLength={100}
                                onChangeText={(text) => { setFullName(text); setNameError('') }}
                                className={` mx-4 border-2 ${NameError ? "border-red-500" : "border-green-500"
                                    }   text-lg font-semibold rounded-lg`}
                            />
                            {NameError && <Text className="text-base text-red-500 mt-2">{NameError}</Text>}

                            <Text className="pl-4  pb-4 text-gray-500 mt-1">
                                Email Address </Text>

                            <TextInput
                                value={email}
                                maxLength={100}
                                onChangeText={(text) => { setEmail(text); setEmError('') }}
                                className={` mx-4 border-2 ${EmError ? "border-red-500" : "border-green-500"
                                    }   text-lg font-semibold rounded-lg`}
                            />
                            {EmError && <Text className="text-base text-red-500 mt-2">{EmError}</Text>}
                        </View>
                }

            </View>

            {
                showForm && authenticated ?
                    <TouchableOpacity onPress={GoLogin} className="absolute bottom-10 left-4 right-4 bg-green-500 py-4 rounded-full">
                        <Text className="text-center text-white font-semibold text-lg">Continue</Text>
                    </TouchableOpacity>
                    :
                    null
            }

        </SafeAreaView>

    );
}
