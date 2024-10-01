import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importar Picker
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lista de medidas para el área
const areaUnits = ['m2', 'hectáreas', 'acres'];

// Componente para gestionar fincas
const FincaComponent = ({ navigation }) => {
  const [fincas, setFincas] = useState([]); // Lista de fincas
  const [fincaName, setFincaName] = useState(''); // Nombre de la finca
  const [owner, setOwner] = useState(''); // Propietario de la finca
  const [description, setDescription] = useState(''); // Descripción de la finca
  const [area, setArea] = useState(''); // Área de la finca
  const [areaUnit, setAreaUnit] = useState(''); // Unidad de medida del área
  const [editingIndex, setEditingIndex] = useState(null); // Índice de la finca que se está editando

  // Cargar fincas guardadas en AsyncStorage al iniciar el componente
  useEffect(() => {
    const loadFincas = async () => {
      try {
        const savedFincas = await AsyncStorage.getItem('fincas');
        if (savedFincas) {
          setFincas(JSON.parse(savedFincas));
        }
      } catch (error) {
        console.error('Error al cargar las fincas:', error);
      }
    };
    loadFincas();
  }, []);

  // Guardar fincas en AsyncStorage cada vez que se actualizan
  useEffect(() => {
    const saveFincas = async () => {
      try {
        await AsyncStorage.setItem('fincas', JSON.stringify(fincas));
      } catch (error) {
        console.error('Error al guardar las fincas:', error);
      }
    };
    saveFincas();
  }, [fincas]);

  // Función para crear o editar una finca
  const handleSaveFinca = () => {
    if (!fincaName || !owner || !description || !area || !areaUnit) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const newFinca = { fincaName, owner, description, area, areaUnit };

    if (editingIndex !== null) {
      // Editar finca existente
      const updatedFincas = [...fincas];
      updatedFincas[editingIndex] = newFinca;
      setFincas(updatedFincas);
      setEditingIndex(null);
    } else {
      // Crear una nueva finca
      setFincas([...fincas, newFinca]);
    }

    // Limpiar los campos de entrada
    setFincaName('');
    setOwner('');
    setDescription('');
    setArea('');
    setAreaUnit('');
  };

  // Función para eliminar una finca
  const handleDeleteFinca = (index) => {
    const updatedFincas = fincas.filter((_, i) => i !== index);
    setFincas(updatedFincas);
  };

  // Función para cargar los datos de una finca en los campos de entrada para su edición
  const handleEditFinca = (index) => {
    const finca = fincas[index];
    setFincaName(finca.fincaName);
    setOwner(finca.owner);
    setDescription(finca.description);
    setArea(finca.area);
    setAreaUnit(finca.areaUnit);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Fincas</Text>

      {/* Formulario de Finca */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Finca"
        value={fincaName}
        onChangeText={setFincaName}
      />
      <TextInput
        style={styles.input}
        placeholder="Propietario de la Finca"
        value={owner}
        onChangeText={setOwner}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Área"
        value={area}
        onChangeText={setArea}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={areaUnit}
        onValueChange={(itemValue) => setAreaUnit(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una unidad" value="" />
        {areaUnits.map((unit) => (
          <Picker.Item key={unit} label={unit} value={unit} />
        ))}
      </Picker>

      <Button
        title={editingIndex !== null ? 'Actualizar Finca' : 'Agregar Finca'}
        onPress={handleSaveFinca}
      />

      {/* Lista de fincas */}
      <FlatList
        data={fincas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.fincaItem}>
            <Text style={styles.fincaText}>{item.fincaName} - {item.owner}</Text>
            <Text style={styles.fincaDescription}>{item.description}</Text>
            <Text style={styles.fincaArea}>Área: {item.area} {item.areaUnit}</Text>
            <View style={styles.fincaActions}>
              <Button title="Editar" onPress={() => handleEditFinca(index)} />
              <Button title="Eliminar" onPress={() => handleDeleteFinca(index)} color="red" />
            </View>
          </View>
        )}
      />

      {/* Botones para navegar a agregar Lote y Cultivo */}
      <View style={styles.buttonContainer}>
        <Button title="Agregar Lote" onPress={() => navigation.navigate('AgregarLote')} />
        <Button title="Agregar Cultivo" onPress={() => navigation.navigate('AgregarCultivo')} />
      </View>
    </View>
  );
};

// Estilos para el componente de fincas
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
  picker: {
    height: 50,
    marginBottom: 20,
  },
  fincaItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  fincaText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fincaDescription: {
    fontSize: 14,
  },
  fincaArea: {
    fontSize: 14,
    marginBottom: 10,
  },
  fincaActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default FincaComponent;
