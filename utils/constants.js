import { GOOGLE_MAPS_APIKEY } from '@env';
export const calculateRideFare = ({ vehicleClass, distanceInMeters, duration, discount = 0 }) => {
    // console.log('calcFare', vehicleClass, distanceInMeters, duration, discount);

    if(!duration){ console.log("no duration"); return}
    let timeInSeconds = parseInt(duration.replace("s", ""), 10);
    // Base rates per vehicle class (₦ per km, ₦ per minute, and base fare)
    const fareRates = {
        "Bolt": { baseFare: 1500, perKm: 300, perMin: 130 },
        "Comfort": { baseFare: 1700, perKm: 500, perMin: 180 },
        "Economy": { baseFare: 1400, perKm: 200, perMin: 100 },
        "Send MotorBike": { baseFare: 800, perKm: 120, perMin: 50 },
    };

    // Ensure valid vehicle class
    if (!fareRates[vehicleClass]) {
        throw new Error("Invalid vehicle class");
    }

    // Convert distance to km and time to minutes
    const distanceKm = distanceInMeters / 1000;
    const timeMin = timeInSeconds / 60;

    // Calculate normal fare
    const { baseFare, perKm, perMin } = fareRates[vehicleClass];
    const normalFare = Math.round(baseFare + (distanceKm * perKm) + (timeMin * perMin));

    // Calculate discounted fare
    const discountAmount = (normalFare * discount) / 100;
    const discountedFare = Math.round(normalFare - discountAmount);

    // Return both fares
    return { normalFare, discountedFare };
};

export const extraMarkersArray = Array.from({ length: 40 }, (_, index) => {
    const isBike = Math.random() < 0.1; // 10% chance for bikemap
    return {
        latitude: 6.52 + Math.random() * 0.01, // Spread across Lagos
        longitude: 3.38 + Math.random() * 0.001, // Spread across Lagos
        heading: Math.floor(Math.random() * 360), // Random heading (0-360)
        customMarker: {
            image: isBike ? require("assets/bikemap.png") : require("assets/carmap.png"),
            width: 20, // Random width between 30-50
            height: 30, // Random height between 40-60
            pinColor: isBike ? "blue" : "yellow",
            title: isBike ? "Bike Stop" : "Car Stop",
            anchorX: 0.5,
            anchorY: 0.25,
            centerOffsetX: 0,
            centerOffsetY: 0,
        },
    };
});

export const generateDrivers = (origin, count = 50, rideType = null, wide=false) => {
    const carBrands = [
        { brand: "Toyota", models: ["Corolla", "Camry", "RAV4", "Highlander"] },
        { brand: "Honda", models: ["Civic", "Accord", "CR-V", "Pilot"] },
        { brand: "Ford", models: ["Focus", "Escape", "Explorer", "Fusion"] },
        { brand: "Hyundai", models: ["Elantra", "Tucson", "Santa Fe", "Sonata"] },
        { brand: "Mercedes", models: ["C-Class", "E-Class", "GLC", "GLE"] },
        { brand: "Lexus", models: ["RX", "NX", "ES", "GX"] },
    ];

    const colors = ["Black", "White", "Silver", "Blue", "Red", "Gray", "Green"];
    const platePrefixes = ["ABC", "XYZ", "LAG", "BEN", "PHC", "KAN"];
    const vehicleClasses = ["Bolt", "Comfort", "Economy", "Send MotorBike"];
    const firstNames = ["John", "Michael", "David", "James", "Robert", "Daniel", "Joseph", "William"];
    const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Davis", "Miller", "Wilson"];
    
    const generateDriverName = () => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${firstName} ${lastName}`;
    };
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const getRandomVehicleClass = () => {
        if (rideType) return rideType;
        
        const random = Math.random();
        if (random < 0.4) return "Bolt"; // 40% chance
        if (random < 0.65) return "Comfort"; // 25% chance
        if (random < 0.90) return "Economy"; // 25% chance
        if (random < 0.3) return "Send MotorBike"; // 10% chance
    };

    const drivers = Array.from({ length: count }, (_, index) => {
        const carBrand = getRandomItem(carBrands);
        const carModel = getRandomItem(carBrand.models);
        const carColor = getRandomItem(colors);
        const carYear = Math.floor(Math.random() * 10) + 2015; // Year between 2015-2024
        const seats = Math.floor(Math.random() * 4) + 4; // Seats between 4-7
        const plateNumber = `${getRandomItem(platePrefixes)}-${Math.floor(Math.random() * 9000) + 1000}-NG`;

        const vehicleClass = getRandomVehicleClass();
        let mult = wide ? 0.1 : 0.02;
        // Generate random location near origin
        const latOffset = (Math.random() - 0.5) * mult; // Small random variation
        const lngOffset = (Math.random() - 0.5) * mult;
        const latitude = origin.latitude + latOffset;
        const longitude = origin.longitude + lngOffset;

        const isBike = vehicleClass === "Send MotorBike";

        return {
            id: `driver-${index + 1}`,
            name: generateDriverName(),
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Rating between 3.5 - 5.0
            phoneNumber: `+23470${Math.floor(10000000 + Math.random() * 89999999)}`,
            image: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
            rides: Math.floor(Math.random() * 2000),
            vehicle: {
                brand: carBrand.brand,
                model: carModel,
                year: carYear,
                color: carColor,
                seats: isBike ? null : seats,
                plateNumber: plateNumber,
                class: vehicleClass, // Assign the vehicle class
            },
                latitude: latitude,
                longitude: longitude,
                heading:Math.floor(Math.random() * 361),
            customMarker: {
                image: isBike ? require("assets/bikemap.png") : require("assets/carmap.png"), // Use bikemap for bikes
                width: 20,
                height: 30,
                pinColor: isBike ? "blue" : "yellow",
                title: `${vehicleClass} - ${carBrand.brand} ${carModel}`,
                anchorX: 0.5,
                anchorY: 0.25,
                centerOffsetX: 0,
                centerOffsetY: 0,
            }
        };
    });

    return drivers;
};

export  const getPlaceNameFromCoords = async (latitude, longitude) => {
    try {
        let url =
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`

        const response = await fetch(url
        );
        const data = await response.json();
        if (data?.results && data?.results?.length > 0) {
            return data.results[0].formatted_address;
        }
        return "";
    } catch (error) {
        console.error("Error getting location name:", error);
        return "";
    }
};