import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Progress from "react-native-progress";
import { MaterialCommunityIcons, FontAwesome, Octicons } from '@expo/vector-icons';


const FindingDriver = ({
    DriverFound,
    setCancelConfirm,
    editPickup,
}) => {
    return (
        <BottomSheet
            
            style={{ zIndex: 99999 }}
            backgroundStyle={{ backgroundColor: "white"}}
            className="border-8x"
        >
            <BottomSheetView className="p-6">
                <View className="px-2 py-2">
                    <Text className="text-3xl font-bold pb-2">
                        Conductor Encontrado
                    </Text>

                    {!DriverFound ? (
                        <View>
                            <View className="my-4">
                                <Progress.Bar
                                    indeterminate={true}
                                    color="#00ff00"
                                    width={null}
                                    indeterminateAnimationDuration={2000}
                                />
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text className="flex-row items-center gap-4 text-xl my-2">
                                Esperando a que el conductor confirme la solicitud
                            </Text>
                            <View className="my-4 flex">
                                <Progress.Bar
                                    indeterminate={true}
                                    color="#00ff00"
                                    width={null}
                                    indeterminateAnimationDuration={20000}
                                />
                            </View>
                            <View className="flex-row justify-around my-6">
                                <TouchableOpacity onPress={editPickup} className="flex items-center">
                                    <View className="rounded-full bg-gray-100 p-4 w-20 flex items-center mb-2">
                                        <FontAwesome name="map-marker" size={40} color="black" />
                                    </View>
                                    <Text>Edit Pickup</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setCancelConfirm(true)} className="flex items-center">
                                    <View className="rounded-full bg-gray-100 p-4 w-20 items-center mb-2">
                                        <MaterialCommunityIcons name="car-off" size={40} color="black" />
                                    </View>
                                    <Text>Cancel Ride</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

export default FindingDriver;
