import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AgregarLote = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [area, setArea] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('m2');
  const [ubicacion, setUbicacion] = useState('');
  const [fincaSeleccionada, setFincaSeleccionada] = useState('');
  const [fincas, setFincas] = useState([]);
  const [lotes, setLotes] = useState([]); // Estado para los lotes
  const [editingIndex, setEditingIndex] = useState(null); // Índice para edición

  // Cargar fincas y lotes guardados
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFincas = await AsyncStorage.getItem('fincas');
        if (savedFincas) {
          setFincas(JSON.parse(savedFincas));
        }

        const savedLotes = await AsyncStorage.getItem('lotes');
        if (savedLotes) {
          setLotes(JSON.parse(savedLotes));
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    loadData();
  }, []);

  const saveLotesToStorage = async (newLotes) => {
    try {
      await AsyncStorage.setItem('lotes', JSON.stringify(newLotes));
    } catch (error) {
      console.error('Error al guardar los lotes:', error);
    }
  };

  const handleAgregarLote = () => {
    if (!nombre || !area || !unidadMedida || !ubicacion || !fincaSeleccionada) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const newLote = { nombre, area, unidadMedida, ubicacion, fincaSeleccionada };

    let updatedLotes = [];
    if (editingIndex !== null) {
      // Editar lote existente
      updatedLotes = [...lotes];
      updatedLotes[editingIndex] = newLote;
      setEditingIndex(null);
    } else {
      // Crear un nuevo lote
      updatedLotes = [...lotes, newLote];
    }

    setLotes(updatedLotes);
    saveLotesToStorage(updatedLotes); // Guardar los datos manualmente después de agregar o editar

    // Limpiar campos
    setNombre('');
    setArea('');
    setUnidadMedida('m2');
    setUbicacion('');
    setFincaSeleccionada('');

    Alert.alert('Éxito', `Lote ${nombre} guardado con éxito`);
  };

  const handleEditLote = (index) => {
    const lote = lotes[index];
    setNombre(lote.nombre);
    setArea(lote.area);
    setUnidadMedida(lote.unidadMedida);
    setUbicacion(lote.ubicacion);
    setFincaSeleccionada(lote.fincaSeleccionada);
    setEditingIndex(index);
  };

  const handleDeleteLote = (index) => {
    const updatedLotes = lotes.filter((_, i) => i !== index);
    setLotes(updatedLotes);
    saveLotesToStorage(updatedLotes); // Guardar los datos manualmente después de eliminar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Lotes</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Lote"
        value={nombre}
        onChangeText={setNombre}
      />

      <View style={styles.areaContainer}>
        <TextInput
          style={[styles.input, styles.areaInput]}
          placeholder="Área del Lote"
          value={area}
          onChangeText={setArea}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={unidadMedida}
          onValueChange={(itemValue) => setUnidadMedida(itemValue)}
          style={styles.unitPicker}
        >
          <Picker.Item label="m2" value="m2" />
          <Picker.Item label="Hectáreas" value="hectareas" />
          <Picker.Item label="Acres" value="acres" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Ubicación del Lote"
        value={ubicacion}
        onChangeText={setUbicacion}
      />

      <Picker
        selectedValue={fincaSeleccionada}
        onValueChange={(itemValue) => setFincaSeleccionada(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una finca" value="" />
        {fincas.map((finca, index) => (
          <Picker.Item key={index} label={finca.fincaName} value={finca.fincaName} />
        ))}
      </Picker>

      <Button
        title={editingIndex !== null ? 'Actualizar Lote' : 'Agregar Lote'}
        onPress={handleAgregarLote}
      />

      {/* Listar lotes */}
      <FlatList
        data={lotes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.loteItem}>
            <Text style={styles.loteText}>{item.nombre} - {item.area} {item.unidadMedida}</Text>
            <Text style={styles.loteDescription}>Ubicación: {item.ubicacion} - Finca: {item.fincaSeleccionada}</Text>
            <View style={styles.loteActions}>
              <Button title="Editar" onPress={() => handleEditLote(index)} />
              <Button title="Eliminar" onPress={() => handleDeleteLote(index)} color="red" />
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
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  areaInput: {
    flex: 1,
  },
  unitPicker: {
    flex: 1,
    height: 50,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  loteItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  loteText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loteDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  loteActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default AgregarLote;
