// screens/AddTaskScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTaskScreen({ navigation }) {
  const [task, setTask] = useState('');

  const saveTask = async () => {
    if (!task.trim()) {
      Alert.alert('Erreur', 'La tâche ne peut pas être vide');
      return;
    }
    const data = await AsyncStorage.getItem('tasks');
    const tasks = data ? JSON.parse(data) : [];
    tasks.push(task);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle tâche</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre tâche..."
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.button} onPress={saveTask}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
