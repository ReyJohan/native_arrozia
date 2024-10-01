import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoginScreen from "../screens/LoginScreen";
import MainScreen from "../screens/MainScreen";
import RolesComponent from "../screens/RolesComponent";
import PasswordRecovery from "../screens/PasswordRecovery";
import FincaComponent from "../screens/FincaComponent";
import UsersComponent from "../screens/UsersComponent";
import HomeScreen from "../screens/HomeScreen";
import AgregarLote from "../screens/AgregarLote";
import AgregarCultivo from "../screens/AgregarCultivo";
import VariedadesArroz from "../data/VariedadesArroz";
import SplashScreen from "../components/SplashScreen"; // Importa el SplashScreen

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Crear el Drawer Navigator con las opciones necesarias
const DrawerNavigator = ({ navigation }) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerRight: () =>
          // Solo mostrar el botón "Atrás" si hay historial de navegación
          navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingRight: 15 }}
            >
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        headerTitleAlign: "center",
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={MainScreen}
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen
        name="Finca"
        component={FincaComponent}
        options={{ title: "Finca" }}
      />
      <Drawer.Screen
        name="Roles"
        component={RolesComponent}
        options={{ title: "Roles" }}
      />
      <Drawer.Screen
        name="Users"
        component={UsersComponent}
        options={{ title: "Usuarios" }}
      />
      <Drawer.Screen
        name="AgregarLote"
        component={AgregarLote}
        options={{ title: "Lotes" }}
      />
      <Drawer.Screen
        name="AgregarCultivo"
        component={AgregarCultivo}
        options={{ title: "Cultivos" }}
      />
      <Drawer.Screen
        name="VariedadesArroz"
        component={VariedadesArroz}
        options={{ title: "Variedades de Arroz" }}
      />
    </Drawer.Navigator>
  );
};

// Función personalizada para el contenido del Drawer
const CustomDrawerContent = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: "space-between" }}>
    {/* Opciones del drawer */}
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.drawerItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.drawerItem}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Finca")}>
        <Text style={styles.drawerItem}>Finca</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Roles")}>
        <Text style={styles.drawerItem}>Roles</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Users")}>
        <Text style={styles.drawerItem}>Usuarios</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AgregarLote")}>
        <Text style={styles.drawerItem}>Lotes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AgregarCultivo")}>
        <Text style={styles.drawerItem}>Cultivos</Text>
      </TouchableOpacity>
    </View>
    {/* Botón de Cerrar Sesión */}
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => {
        navigation.replace("Login"); // Redirige al login al cerrar sesión.
      }}
    >
      <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
    </TouchableOpacity>
  </View>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" // Cambia el nombre de la pantalla inicial a 'Splash'
        screenOptions={({ navigation }) => ({
          headerRight: () =>
            navigation.canGoBack() && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ paddingRight: 15 }}
              >
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          headerTitleAlign: "center",
        })}
      >
        {/* Pantalla de Splash */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }} // Ocultar encabezado para el splash screen
        />
        {/* Pantalla de Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Iniciar Sesión",
            headerShown: false,
          }}
        />
        {/* Drawer Navigator con todas las pantallas principales */}
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{
            headerShown: false, // Ocultar encabezado
          }}
        />
        {/* Pantalla de Recuperar Contraseña */}
        <Stack.Screen
          name="PasswordRecovery"
          component={PasswordRecovery}
          options={{ title: "Recuperar Contraseña" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Estilos para el Drawer
const styles = StyleSheet.create({
  drawerItem: {
    padding: 15,
    fontSize: 18,
    color: "#000",
  },
  logoutButton: {
    marginBottom: 30,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "red",
    borderRadius: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AppNavigator;
