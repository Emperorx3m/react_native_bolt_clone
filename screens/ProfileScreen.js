import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { getAuthData } from 'utils/database';
import { useEffect, useState } from 'react';

const ProfileScreen = () => {
    const db = useSQLiteContext();
    const [authData_1, setAuthData_1] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAuthData(db);
            setAuthData_1(data);
        };
        fetchData();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4">
            <View className="flex-1 bg-gray-100 p-4">
               
                <View className="items-center mt-4">
                    <View className="relative">
                    <Image source={{ uri: "https://randomuser.me/api/portraits/men/12.jpg" }} className="w-20 h-20 rounded-full" />
                    </View>
                    <Text className="text-lg font-semibold mt-2">{authData_1 ? authData_1?.name : 'Loading...'}</Text>
                    <View className="flex-row items-center mt-1">
                        <FontAwesome name="star" size={14} color="green" />
                        <Text className="text-green-600 font-semibold ml-1">5.00 Rating</Text>
                    </View>
                </View>

                {/* Update Account Notification */}
                <View className="bg-green-100 p-3 rounded-lg mt-4">
                    <Text className="text-green-700 font-semibold">Let's update your account</Text>
                    <Text className="text-gray-600 text-sm">Improve your app experience</Text>
                    <TouchableOpacity>
                        <Text className="text-green-600 font-semibold mt-1">3 new suggestions</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings List */}
                <View className="bg-white rounded-lg mt-4">
                    {["Personal info", "Trip safety", "Login & security", "Privacy"].map((item, index) => (
                        <TouchableOpacity key={index} className="border-b border-gray-200 p-4">
                            <Text className="text-gray-800">{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Saved Places */}
                <Text className="text-lg font-semibold mt-6">Saved places</Text>
                <View className="bg-white rounded-lg mt-2">
                    {[{ icon: "home", text: "Enter home location" }, { icon: "briefcase", text: "Enter work location" }, { icon: "plus", text: "Add a place" }].map((item, index) => (
                        <TouchableOpacity key={index} className="border-b border-gray-200 p-4 flex-row items-center">
                            <Feather name={item.icon} size={20} color="gray" />
                            <Text className="ml-3 text-gray-800">{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;
