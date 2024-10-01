import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VariedadesArroz = () => {
  const [variedadName, setVariedadName] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [variedades, setVariedades] = useState([]); // Estado para las variedades
  const [editingIndex, setEditingIndex] = useState(null); // Índice para edición

  // Cargar variedades guardadas
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedVariedades = await AsyncStorage.getItem('variedades');
        if (savedVariedades) {
          setVariedades(JSON.parse(savedVariedades));
        }
      } catch (error) {
        console.error('Error al cargar las variedades:', error);
      }
    };
    loadData();
  }, []);

  // Guardar variedades en AsyncStorage
  useEffect(() => {
    const saveVariedades = async () => {
      try {
        await AsyncStorage.setItem('variedades', JSON.stringify(variedades));
      } catch (error) {
        console.error('Error al guardar las variedades:', error);
      }
    };
    saveVariedades();
  }, [variedades]);

  // Función para agregar o editar una variedad
  const handleAgregarVariedad = () => {
    if (!variedadName || !descripcion) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const newVariedad = { variedadName, descripcion };

    if (editingIndex !== null) {
      // Editar variedad existente
      const updatedVariedades = [...variedades];
      updatedVariedades[editingIndex] = newVariedad;
      setVariedades(updatedVariedades);
      setEditingIndex(null);
    } else {
      // Crear una nueva variedad
      setVariedades([...variedades, newVariedad]);
    }

    // Limpiar campos
    setVariedadName('');
    setDescripcion('');

    Alert.alert('Éxito', `Variedad ${variedadName} guardada con éxito`);
  };

  const handleEditVariedad = (index) => {
    const variedad = variedades[index];
    setVariedadName(variedad.variedadName);
    setDescripcion(variedad.descripcion);
    setEditingIndex(index);
  };

  const handleDeleteVariedad = (index) => {
    const updatedVariedades = variedades.filter((_, i) => i !== index);
    setVariedades(updatedVariedades);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Variedades de Arroz</Text>

      {/* Campos para agregar/editar variedad */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Variedad"
        value={variedadName}
        onChangeText={setVariedadName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción de la Variedad"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Button
        title={editingIndex !== null ? 'Actualizar Variedad' : 'Agregar Variedad'}
        onPress={handleAgregarVariedad}
      />

      {/* Listar variedades */}
      <FlatList
        data={variedades}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.variedadItem}>
            <Text style={styles.variedadText}>{item.variedadName}</Text>
            <Text style={styles.variedadDescription}>{item.descripcion}</Text>
            <View style={styles.variedadActions}>
              <Button title="Editar" onPress={() => handleEditVariedad(index)} />
              <Button title="Eliminar" onPress={() => handleDeleteVariedad(index)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  variedadItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  variedadText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  variedadDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  variedadActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default VariedadesArroz;
