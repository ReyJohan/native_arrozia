import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/AxiosInstance'; // Asegúrate de importar axiosInstance correctamente
import backgroundImage from '../../assets/background_image.jpg';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error al cargar el email guardado:', error);
      }
    };

    loadRememberedEmail();
  }, []);

  // Función para manejar el inicio de sesión con axios
  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });

      // Si la respuesta es exitosa
      if (response.status === 200) {
        Alert.alert('Login exitoso', 'Bienvenido');

        // Guardar token en AsyncStorage si es necesario
        const token = response.data.access_token;
        await AsyncStorage.setItem('token', token);

        // Guardar o eliminar el email en AsyncStorage según el estado de rememberMe
        if (rememberMe) {
          AsyncStorage.setItem('rememberedEmail', email);
        } else {
          AsyncStorage.removeItem('rememberedEmail');
        }

        // Redirigir al Drawer Navigator con Home y otras pantallas
        navigation.replace('Drawer');
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      Alert.alert('Error', 'Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* Campo de entrada para el email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Contenedor del campo de contraseña y botón de visibilidad */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <Text style={styles.showPassword}>{secureTextEntry ? 'Mostrar' : 'Ocultar'}</Text>
          </TouchableOpacity>
        </View>

        {/* Checkbox para recordar email */}
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
            <Text style={styles.rememberMeText}>
              {rememberMe ? '☑' : '☐'} Recordar Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón para iniciar sesión */}
        <Button title="Ingresar" onPress={handleLogin} />

        {/* Botón para navegar al módulo de recuperación de contraseña */}
        <TouchableOpacity onPress={() => navigation.navigate('PasswordRecovery')}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Estilos para la pantalla de inicio de sesión
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  showPassword: {
    paddingHorizontal: 10,
    color: 'black',
  },
  rememberMeContainer: {
    marginBottom: 20,
  },
  rememberMeText: {
    color: 'black',
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 15,
    color: 'black',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
