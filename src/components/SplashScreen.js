import backgroundImage from '../../assets/images/background_image.jpg';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Esperar unos segundos y luego redirigir a la pantalla de login
    setTimeout(() => {
      navigation.replace('Login'); // Reemplaza 'Login' por el nombre de tu pantalla de login
    }, 2000); // Cambia el tiempo según sea necesario
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Aquí puedes personalizar el contenido del splash screen */}
      <Image source={backgroundImage} style={styles.logo} />
      <Text style={styles.text}>Bienvenido a Mi App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150, // Ajusta el tamaño según tu imagen
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
