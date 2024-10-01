// src/screens/RolesComponent.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Importar Picker desde el paquete correcto

// Lista de roles predefinidos
const predefinedRoles = ['Administrador', 'Usuario', 'Operario'];

const RolesComponent = () => {
  const [roles, setRoles] = useState([]); // Lista de roles
  const [selectedRole, setSelectedRole] = useState(''); // Rol seleccionado de la lista
  const [description, setDescription] = useState(''); // Descripción del rol
  const [editingIndex, setEditingIndex] = useState(null); // Índice del rol que se está editando

  // Cargar roles guardados en AsyncStorage al iniciar el componente
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const savedRoles = await AsyncStorage.getItem('roles');
        if (savedRoles) {
          setRoles(JSON.parse(savedRoles));
        }
      } catch (error) {
        console.error('Error al cargar los roles:', error);
      }
    };

    loadRoles();
  }, []);

  // Guardar roles en AsyncStorage cada vez que se actualizan
  useEffect(() => {
    const saveRoles = async () => {
      try {
        await AsyncStorage.setItem('roles', JSON.stringify(roles));
      } catch (error) {
        console.error('Error al guardar los roles:', error);
      }
    };

    saveRoles();
  }, [roles]);

  // Función para crear o editar un rol
  const handleSaveRole = () => {
    if (!selectedRole || !description) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Contar el número de roles existentes con el mismo nombre y añadir un número al nombre
    const roleCount = roles.filter(role => role.roleName.startsWith(selectedRole)).length;
    const roleName = `${selectedRole} ${roleCount + 1}`; // Añadir el número al rol

    const newRole = { roleName, description };

    if (editingIndex !== null) {
      // Editar rol existente
      const updatedRoles = [...roles];
      updatedRoles[editingIndex] = newRole;
      setRoles(updatedRoles);
      setEditingIndex(null);
    } else {
      // Crear un nuevo rol
      setRoles([...roles, newRole]);
    }

    // Limpiar los campos de entrada
    setSelectedRole('');
    setDescription('');
  };

  // Función para eliminar un rol
  const handleDeleteRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  // Función para cargar los datos de un rol en los campos de entrada para su edición
  const handleEditRole = (index) => {
    const role = roles[index];
    setSelectedRole(role.roleName.split(' ')[0]); // Solo el nombre base sin el número
    setDescription(role.description);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roles</Text>

      {/* Selector para elegir un rol de la lista predefinida */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Selecciona un Rol:</Text>
        <Picker
          selectedValue={selectedRole}
          onValueChange={(itemValue) => setSelectedRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un rol" value="" />
          {predefinedRoles.map((role) => (
            <Picker.Item key={role} label={role} value={role} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title={editingIndex !== null ? 'Actualizar Rol' : 'Agregar Rol'}
        onPress={handleSaveRole}
      />

      {/* Lista de roles */}
      <FlatList
        data={roles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.roleItem}>
            <Text style={styles.roleText}>{item.roleName}</Text>
            <Text style={styles.roleDescription}>{item.description}</Text>
            <View style={styles.roleActions}>
              <Button title="Editar" onPress={() => handleEditRole(index)} />
              <Button title="Eliminar" onPress={() => handleDeleteRole(index)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
};

// Estilos para el componente de roles
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
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  roleItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  roleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  roleActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default RolesComponent;
