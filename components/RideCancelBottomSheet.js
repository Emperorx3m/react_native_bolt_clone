import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import BottomSheet, {  BottomSheetView } from '@gorhom/bottom-sheet';
import { FontAwesome, Octicons } from '@expo/vector-icons';


const RideCancelBottomSheet = ({ cancelP, setCancelConfirm }) => {
    const sheetRef = useRef(null);

    return (
           <BottomSheet
                ref={sheetRef}
                borderRadius={25}
                >
                <BottomSheetView>
               
                    <View style={styles.container}>
                        {/* Avatar */}
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: "https://cdn-icons-png.flaticon.com/512/8583/8583437.png" }} // Change to your image
                                style={styles.avatar}
                            />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>¿Seguro?</Text>
                        <Text style={styles.subtitle}>
                            Tendrás que esperar más si cancelas. Volver a buscar otro viaje no tiene por qué llevarte a tu destino más rápido.
                        </Text>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                            className='rounded-full'
                                onPress={() => {
                                    cancelP(); // Call cancel function
                                    
                                }}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar viaje</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setCancelConfirm(false)} // Close sheet
                                style={styles.waitButton}
                            >
                                <Text style={styles.waitButtonText}>Esperar al conductor</Text>
                            </TouchableOpacity>
                        </View>
                    </View>     
                </BottomSheetView>
               </BottomSheet>
            
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: "center",
    },
    avatarContainer: {
        marginBottom: 10,
    },
    avatar: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginBottom: 20,
    },
    buttonContainer: {
        width: "100%",
    },
    cancelButton: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    waitButton: {
        backgroundColor: "#f0f0f0",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    waitButtonText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "bold",
    },
    openButton: {
        position: "absolute",
        bottom: 10,
        left: "50%",
        marginLeft: -20,
        backgroundColor: "black",
        padding: 10,
        borderRadius: 25,
    },
});

export default RideCancelBottomSheet;
