import React from 'react'
import { Suspense } from 'react'
import 'react-native-get-random-values';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';

import App from './App';

import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

const Main = () => {
  return (
    <Suspense fallback={
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#007bff" />
                    </View>
    }>
    <SQLiteProvider databaseName="authy.db" useSuspense>
      <App />
    </SQLiteProvider>
    </Suspense>
  )
}

export default Main