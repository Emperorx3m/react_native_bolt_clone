import './gesture-handler';
import "./global.css"
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { initDatabase, saveAuthData, getAuthData, clearAuthData } from 'utils/database';
import { store } from 'store';
import { Provider } from 'react-redux'

import { StatusBar } from 'expo-status-bar';
import { ScrollView, Image, Text, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from 'screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import LoginScreen from 'screens/LoginScreen';
import LoginSendCode from 'screens/LoginSendCode';
import SendOTP from 'screens/SendOTP';
import SelectPickAndDrop from 'screens/SelectPickAndDrop';
import { useNavigation } from '@react-navigation/native';
import SelectRide from 'screens/SelectRide';
import ConfirmPickup from 'screens/ConfirmPickup';
import DriverFound from 'screens/DriverFound';
import Trips from 'screens/Trips';
import ProfileScreen from 'screens/ProfileScreen';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, authData_1 }) => {
  
  return (
    <SafeAreaView className='flex-1 justify-between mt-4'>
      <View>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center space-x-3 mr-2">
            <Image source={{ uri: "https://randomuser.me/api/portraits/men/12.jpg" }} className="w-12 h-12 rounded-full" />
            <View>
              <Text className="text-lg font-semibold">{authData_1 ? authData_1?.name : 'Loading...'}</Text>
              <Text onPress={() => {
                navigation.navigate('Account');
              }} className="text-green-600 text-sm">My account</Text>
            </View>
          </View>
          <Text className="text-gray-500 mt-2">⭐ 5.00 Rating</Text>
        </View>

        {/* Drawer Items */}
        <View className="p-4 space-y-4">
          <DrawerItem icon="credit-card" text="Payment" navigation={navigation} />
          <DrawerItem icon="tag" text="Promotions" navigation={navigation} badge />
          <DrawerItem icon="car" text="My Rides" navigation={navigation} text2={Trips} io={true} />
          <DrawerItem icon="cc-mastercard" text="Expense Your Rides" navigation={navigation} fa={true} />
          <DrawerItem icon="help-buoy" text="Support" navigation={navigation} io={true} />
          <DrawerItem icon="information-circle" text="About" navigation={navigation} io={true} />
        </View>
      </View>
      {/* Become a Driver Banner */}
      <TouchableOpacity className="bg-green-100 p-3 mx-4 rounded-lg flex-row items-center mt-6">
        <View className="flex-1">
          <Text className="font-semibold">Become a driver</Text>
          <Text className="text-gray-600 text-sm">Earn money on your schedule</Text>
        </View>
        <Ionicons name="close" size={18} color="gray" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Drawer Item Component
const DrawerItem = ({ icon, text, navigation, badge, fa = false, io = false, text2 }) => {
  if (fa) {
    return (<TouchableOpacity className="flex-row items-center space-x-3 p-3" onPress={() => navigation.navigate(text2)}>

      <FontAwesome name={icon} size={20} color="black" />
      <Text className="text-gray-800 flex-1">{text}</Text>
      {badge && <Text className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">NEW</Text>
      }
    </TouchableOpacity>)
  } else if (io) {
    return (<TouchableOpacity className="flex-row items-center space-x-3 p-3" onPress={() => navigation.navigate(text2)}>

<Ionicons name={icon} size={20} color="black" />
      <Text className="text-gray-800 flex-1">{text}</Text>
      {badge && <Text className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">NEW</Text>
      }
    </TouchableOpacity>)
  } else {
    return (<TouchableOpacity className="flex-row items-center space-x-3 p-3" onPress={() => navigation.navigate(text2)}>

      <MaterialIcons name={icon} size={20} color="gray" />
      <Text className="text-gray-800 flex-1">{text}</Text>
      {badge && <Text className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">NEW</Text>}
    </TouchableOpacity>)
  }

};

// Main Drawer Navigator
const DrawerNav = () => {
  const db = useSQLiteContext();
    const [authData_1, setAuthData_1] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAuthData(db);
                setAuthData_1(data);
            } catch (error) {
                console.error("Error fetching auth data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} authData_1={authData_1} />}
            screenOptions={{ headerShown: false }}
        >
      <Drawer.Screen name="Home_Drawer" component={HomeStack} />
    </Drawer.Navigator>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        title="Home"
        component={DrawerNav}
        options={{ headerShown: false, tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} /> }}
      />
      <Tab.Screen
        name="Trips"
        component={Trips}
        options={{ headerShown: false, tabBarIcon: ({ color }) => <Icon name="calendar-clock" color={color} size={24} /> }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{ headerShown: false, tabBarIcon: ({ color }) => <Icon name="account-circle-outline" color={color} size={24} /> }}
      />

    </Tab.Navigator>
  );
}
const CustomBackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 20 }}
    >
      <Icon name="keyboard-backspace" size={24} color="#000" />
    </TouchableOpacity>
  );
};

const CustomXButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className='mr-4'
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 20 }}
    >
      <Icon name="close-thick" size={24} color="#000" />
    </TouchableOpacity>
  );
};

const CustomMenuButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={{ marginLeft: 20 }}
    >
      <Icon name="menu" size={30} color="#000" className='bg-white rounded-full p-4' />
    </TouchableOpacity>
  );
};
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => <CustomMenuButton />,
          headerTransparent: true,
          headerTintColor: '#000',

        }}
        name="Home" component={HomeScreen} />
      <Stack.Screen
        options={{
          title: 'Your route',
          headerLeft: () => <CustomXButton />,
          headerTransparent: true,
          headerTintColor: '#000',

        }}
        name="SelectPickAndDrop" component={SelectPickAndDrop} />

      <Stack.Screen
        options={{ headerShown: false }}
        name="SelectRide" component={SelectRide} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ConfirmPickup" component={ConfirmPickup} />

      <Stack.Screen
        options={{ headerShown: false }}
        name="DriverFound" component={DriverFound} />

    </Stack.Navigator>
  );
}

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      <Stack.Screen options={{ headerShown: false }} name="SendCode" component={LoginSendCode} />
      <Stack.Screen options={{ headerShown: false }} name="SendOTP" >
        {() => <SendOTP onLogin={onLogin} />}
      </Stack.Screen>

    </Stack.Navigator>
  );
}


export default function App() {
  const db = useSQLiteContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase(db);
        await checkAuthentication(db);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Check if the user is authenticated
  const checkAuthentication = async (db) => {
    try {
      const authData = await getAuthData(db);
      console.log("authData", authData, 'dt')
      if (authData) {
        const validTill = new Date(authData.validTill);
        const now = new Date();

        if (validTill > now) {
          setIsAuthenticated(true);          
          return true;
        } else {
          // Auth expired, clear it/
          console.log("clearing db for logout")
          await clearAuthData(db);
          setIsAuthenticated(false);          
          return false;
        }
      } else {
        setIsAuthenticated(false);        
        return false;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);      
      return false;
    }
  };

  // Handle login
  const handleLogin = async (phone, name, email) => {
    try {
      // Set validity for 1 month from now
      const validTill = new Date();
      validTill.setMonth(validTill.getMonth() + 1);

      let save_ = await saveAuthData(phone, validTill.toISOString(), name, email, db);
      save_ && setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };



  return (
    <Provider store={store}>
      <NavigationContainer >
        {isAuthenticated ? (
          <MyTabs />
        ) : (
          <AuthStack onLogin={handleLogin} />
        )}

        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
