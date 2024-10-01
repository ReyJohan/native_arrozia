import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const tiposDeArroz = ['Arroz Tipo 1', 'Arroz Tipo 2', 'Arroz Tipo 3'];
const unidadesMedida = ['m2', 'hectareas', 'acres'];

const AgregarCultivo = ({ navigation }) => {
  const [tipoArroz, setTipoArroz] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [area, setArea] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [fincaSeleccionada, setFincaSeleccionada] = useState('');
  const [loteSeleccionado, setLoteSeleccionado] = useState('');
  const [fincas, setFincas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cultivos, setCultivos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

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

        const savedCultivos = await AsyncStorage.getItem('cultivos');
        if (savedCultivos) {
          setCultivos(JSON.parse(savedCultivos));
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    loadData();
  }, []);

  const saveCultivosToStorage = async (updatedCultivos) => {
    try {
      await AsyncStorage.setItem('cultivos', JSON.stringify(updatedCultivos));
    } catch (error) {
      console.error('Error al guardar los cultivos:', error);
    }
  };

  const handleAgregarCultivo = () => {
    if (!tipoArroz || !area || !unidadMedida || !fincaSeleccionada || !loteSeleccionado) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const newCultivo = {
      tipoArroz,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      area,
      unidadMedida,
      fincaSeleccionada,
      loteSeleccionado,
    };

    let updatedCultivos;
    if (editingIndex !== null) {
      // Editar cultivo existente
      updatedCultivos = [...cultivos];
      updatedCultivos[editingIndex] = newCultivo;
      setEditingIndex(null);
    } else {
      // Agregar nuevo cultivo
      updatedCultivos = [...cultivos, newCultivo];
    }

    setCultivos(updatedCultivos);
    saveCultivosToStorage(updatedCultivos); // Guardar inmediatamente

    // Limpiar campos
    setTipoArroz('');
    setFechaInicio(new Date());
    setArea('');
    setUnidadMedida('');
    setFincaSeleccionada('');
    setLoteSeleccionado('');
  };

  const handleEditCultivo = (index) => {
    const cultivo = cultivos[index];
    setTipoArroz(cultivo.tipoArroz);
    setFechaInicio(new Date(cultivo.fechaInicio));
    setArea(cultivo.area);
    setUnidadMedida(cultivo.unidadMedida);
    setFincaSeleccionada(cultivo.fincaSeleccionada);
    setLoteSeleccionado(cultivo.loteSeleccionado);
    setEditingIndex(index);
  };

  const handleDeleteCultivo = (index) => {
    const updatedCultivos = cultivos.filter((_, i) => i !== index);
    setCultivos(updatedCultivos);
    saveCultivosToStorage(updatedCultivos); // Guardar inmediatamente al eliminar
  };

  // Filtrar lotes según la finca seleccionada
  const lotesFiltrados = lotes.filter((lote) => lote.fincaSeleccionada === fincaSeleccionada);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Cultivos</Text>

      <Picker
        selectedValue={tipoArroz}
        onValueChange={(itemValue) => setTipoArroz(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un tipo de arroz" value="" />
        {tiposDeArroz.map((arroz, index) => (
          <Picker.Item key={index} label={arroz} value={arroz} />
        ))}
      </Picker>

      <View style={styles.datePickerContainer}>
        <Button title="Seleccionar Fecha de Inicio" onPress={() => setShowDatePicker(true)} />
        <Text>{fechaInicio.toISOString().split('T')[0]}</Text>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={fechaInicio}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFechaInicio(selectedDate);
            }
          }}
        />
      )}

      {/* Campo de área del cultivo */}
      <TextInput
        style={styles.input}
        placeholder="Área del Cultivo"
        value={area}
        onChangeText={setArea}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={unidadMedida}
        onValueChange={(itemValue) => setUnidadMedida(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una unidad" value="" />
        {unidadesMedida.map((unidad, index) => (
          <Picker.Item key={index} label={unidad} value={unidad} />
        ))}
      </Picker>

      {/* Seleccionar finca */}
      <Picker
        selectedValue={fincaSeleccionada}
        onValueChange={(itemValue) => {
          setFincaSeleccionada(itemValue);
          setLoteSeleccionado('');
        }}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una finca" value="" />
        {fincas.map((finca, index) => (
          <Picker.Item key={index} label={finca.fincaName} value={finca.fincaName} />
        ))}
      </Picker>

      {/* Seleccionar lote */}
      <Picker
        selectedValue={loteSeleccionado}
        onValueChange={(itemValue) => setLoteSeleccionado(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un lote" value="" />
        {lotesFiltrados.map((lote, index) => (
          <Picker.Item key={index} label={lote.nombre} value={lote.nombre} />
        ))}
      </Picker>

      <Button title={editingIndex !== null ? 'Actualizar Cultivo' : 'Agregar Cultivo'} onPress={handleAgregarCultivo} />

      <FlatList
        data={cultivos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cultivoItem}>
            <Text style={styles.cultivoText}>{item.tipoArroz} - {item.fechaInicio}</Text>
            <Text style={styles.cultivoDescription}>
              {item.area} {item.unidadMedida} - Finca: {item.fincaSeleccionada} - Lote: {item.loteSeleccionado}
            </Text>
            <View style={styles.cultivoActions}>
              <Button title="Editar" onPress={() => handleEditCultivo(index)} />
              <Button title="Eliminar" onPress={() => handleDeleteCultivo(index)} color="red" />
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
  picker: {
    height: 50,
    marginBottom: 20,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  cultivoItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  cultivoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cultivoDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  cultivoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default AgregarCultivo;
