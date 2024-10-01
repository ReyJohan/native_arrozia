// src/screens/PasswordRecovery.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';
import { users } from '../data/users';
import backgroundImage from '../../assets/background_image.jpg';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = () => {
    // Buscar el usuario por el correo
    const user = users.find((user) => user.email.toLowerCase().trim() === email.toLowerCase().trim());

    if (user) {
      // Generar un token simple (para el ejemplo)
      const token = Math.random().toString(36).substr(2);
      console.log(`Token generado: ${token}`);

      // Simular el envío del token por correo electrónico
      Alert.alert(
        'Token Enviado',
        `Un token de recuperación ha sido enviado a: ${email}`
      );

      // Aquí agregarías la lógica para enviar el correo con el token
    } else {
      Alert.alert('Error', 'El correo electrónico no está registrado');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        
        {/* Campo de entrada para el correo electrónico */}
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none" // Asegura que el teclado empiece con minúsculas
        />

        <Button title="Enviar Token" onPress={handlePasswordRecovery} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la imagen de fondo
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255,)', // Fondo semitransparente para el contenido
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff', // Fondo blanco para el campo de texto
  },
});

export default PasswordRecovery;
