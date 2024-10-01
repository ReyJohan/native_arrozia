// src/screens/UsersComponent.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// Lista de roles predefinidos
const predefinedRoles = ['Administrador', 'Usuario', 'Operario'];

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); // Índice del usuario que se está editando

  // Cargar usuarios guardados en AsyncStorage al iniciar el componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const savedUsers = await AsyncStorage.getItem('users');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      }
    };

    loadUsers();
  }, []);

  // Guardar usuarios en AsyncStorage cada vez que se actualizan
  useEffect(() => {
    const saveUsers = async () => {
      try {
        await AsyncStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error('Error al guardar los usuarios:', error);
      }
    };

    saveUsers();
  }, [users]);

  // Función para crear o editar un usuario
  const handleSaveUser = () => {
    if (!username || !lastName || !email || !selectedRole) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const newUser = { username, lastName, email, role: selectedRole };

    if (editingIndex !== null) {
      // Editar usuario existente
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = newUser;
      setUsers(updatedUsers);
      setEditingIndex(null);
    } else {
      // Crear un nuevo usuario
      setUsers([...users, newUser]);
    }

    // Limpiar campos de entrada
    setUsername('');
    setLastName('');
    setEmail('');
    setSelectedRole('');
  };

  // Función para eliminar un usuario
  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  // Función para cargar los datos de un usuario en los campos de entrada para su edición
  const handleEditUser = (index) => {
    const user = users[index];
    setUsername(user.username);
    setLastName(user.lastName);
    setEmail(user.email);
    setSelectedRole(user.role);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

      {/* Formulario para crear o editar usuario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Selector para asignar un rol */}
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

      <Button title={editingIndex !== null ? 'Actualizar Usuario' : 'Agregar Usuario'} onPress={handleSaveUser} />

      {/* Lista de usuarios */}
      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.username} {item.lastName} - {item.role}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.userActions}>
              <Button title="Editar" onPress={() => handleEditUser(index)} />
              <Button title="Eliminar" onPress={() => handleDeleteUser(index)} color="red" />
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
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 10,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default UsersComponent;
