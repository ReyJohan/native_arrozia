import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import VariedadesArroz from '../data/VariedadesArroz';


const MainScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Módulos</Text>
      
      {/* Tarjeta para el Módulo de Roles */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Roles')}
      >
        <Text style={styles.cardTitle}>Módulo Roles</Text>
        <Text style={styles.cardDescription}>
          Asigna y gestiona los roles de los trabajadores de la finca.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Finca')}
      >
        <Text style={styles.cardTitle}>Módulo Finca</Text>
        <Text style={styles.cardDescription}>
          Asigna y gestiona las fincas.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Users')}
      >
        <Text style={styles.cardTitle}>Módulo Usuarios</Text>
        <Text style={styles.cardDescription}>
          Asigna usuarios.
        </Text>
      </TouchableOpacity>
      {/* Nueva Tarjeta para el Módulo de Variedades de Arroz */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('VariedadesArroz')}      >
        <Text style={styles.cardTitle}>Módulo Variedades de Arroz</Text>
        <Text style={styles.cardDescription}>
          Gestiona las variedades de arroz disponibles.
        </Text>
      </TouchableOpacity>
      {/* Agrega más tarjetas para otros módulos aquí */}
      {/* <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OtroModulo')}>
        <Text style={styles.cardTitle}>Otro Módulo</Text>
        <Text style={styles.cardDescription}>Descripción del otro módulo</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 10,
    color: '#555',
  },
});

export default MainScreen;
