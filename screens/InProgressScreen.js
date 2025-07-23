// screens/InProgressScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function InProgressScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadTasks();
  }, [isFocused]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      const parsed = JSON.parse(data);
      setTasks(parsed.filter(task => task.status === 'en cours'));
    }
  };

  const finishTask = async (taskToFinish) => {
    const data = await AsyncStorage.getItem('tasks');
    if (!data) return;

    let allTasks = JSON.parse(data);

    // Trouver la tâche et mettre à jour son statut
    allTasks = allTasks.map(task => {
      if (task.title === taskToFinish.title && task.status === 'en cours') {
        return { ...task, status: 'terminer' };
      }
      return task;
    });

    await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
    Alert.alert('Bravo !', `"${taskToFinish.title}" est terminée.`);
    loadTasks();
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.title}</Text>
      <TouchableOpacity
        style={styles.finishButton}
        onPress={() => finishTask(item)}
      >
        <Text style={styles.finishButtonText}>Terminer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches en cours</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  taskItem: {
    padding: 15,
    backgroundColor: '#ffefc1',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: { fontSize: 16, flex: 1 },
  finishButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
