import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTaskScreen({ navigation }) {
  const [task, setTask] = useState('');
  const [pendingTasks, setPendingTasks] = useState([]);

  const addToList = () => {
    if (!task.trim()) {
      Alert.alert('Erreur', 'La tâche ne peut pas être vide.');
      return;
    }

    setPendingTasks(prev => [...prev, { title: task.trim(), status: 'ajouter' }]);
    setTask('');
  };

  const saveAllTasks = async () => {
    if (pendingTasks.length === 0) {
      Alert.alert('Erreur', 'Aucune tâche à enregistrer.');
      return;
    }

    const data = await AsyncStorage.getItem('tasks');
    const existingTasks = data ? JSON.parse(data) : [];

    const updatedTasks = [...existingTasks, ...pendingTasks];
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    navigation.goBack();
  };

  const removeTask = (index) => {
    const updated = [...pendingTasks];
    updated.splice(index, 1);
    setPendingTasks(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter plusieurs tâches</Text>

      <TextInput
        style={styles.input}
        placeholder="Saisir une tâche..."
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity style={styles.addButton} onPress={addToList}>
        <Text style={styles.buttonText}>+ Ajouter à la liste</Text>
      </TouchableOpacity>

     <FlatList
  data={pendingTasks}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item, index }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.title}</Text>
      <TouchableOpacity onPress={() => removeTask(index)}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  )}
  ListEmptyComponent={
    <Text style={{ textAlign: 'center', marginVertical: 20 }}>
      Aucune tâche ajoutée.
    </Text>
  }
  contentContainerStyle={{ paddingBottom: 100 }} // 👈 important
/>


      <TouchableOpacity style={styles.saveButton} onPress={saveAllTasks}>
        <Text style={styles.buttonText}>Enregistrer toutes les tâches</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    bottom : 70,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  taskItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: { fontSize: 16 },
  removeText: { color: 'red', fontSize: 20, paddingHorizontal: 10 },
});
