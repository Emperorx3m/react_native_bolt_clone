import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Trips = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
       <View className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold">Rides</Text>
        <FontAwesome name="info-circle" size={20} color="gray" />
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-300">
        <TouchableOpacity className="flex-1 border-b-2 border-green-500 pb-2">
          <Text className="text-green-600 font-semibold text-center">Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 pb-2">
          <Text className="text-gray-500 text-center">Past</Text>
        </TouchableOpacity>
      </View>

      {/* No Upcoming Rides */}
      <View className="flex-1 items-center justify-center mt-8">
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7475/7475093.png' }} // Replace with your local image if needed
          className="w-20 h-20"
          resizeMode="contain"
        />
        <Text className="text-lg font-semibold mt-4">No Upcoming rides</Text>
        <Text className="text-gray-600 text-center px-6 mt-2">
          Whatever is on your schedule, a Scheduled Ride can get you there on time
        </Text>
        <TouchableOpacity>
          <Text className="text-green-600 font-semibold mt-2">Learn how it works</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule a Ride Button */}
      <TouchableOpacity className="bg-green-500 py-3 rounded-full mt-4">
        <Text className="text-white font-semibold text-center">Schedule a ride</Text>
      </TouchableOpacity>
    </View> 
    </SafeAreaView>
    
  );
};

export default Trips;
