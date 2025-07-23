// screens/DoneScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DoneScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadTasks();
  }, [isFocused]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      const parsed = JSON.parse(data);
      setTasks(parsed.filter(task => task.status === 'terminer'));  
    }
  };

  const undoTask = async (taskToUndo) => {
    Alert.alert(
      'Remettre en cours ?',
      `Voulez-vous remettre "${taskToUndo.title}" en cours ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui',
          onPress: async () => {
            const data = await AsyncStorage.getItem('tasks');
            if (!data) return;
            let allTasks = JSON.parse(data);

            allTasks = allTasks.map(task => {
              if (task.title === taskToUndo.title) {
                return { ...task, status: 'en cours' };
              }
              return task;
            });

            await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
            loadTasks();

          },
        },
      ]
    );
  };

  const deleteTask = (taskToDelete) => {
    Alert.alert(
      'Supprimer la tâche ?',
      `Voulez-vous vraiment supprimer définitivement "${taskToDelete.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const data = await AsyncStorage.getItem('tasks');
            if (!data) return;
            let allTasks = JSON.parse(data);

            allTasks = allTasks.filter(task => task.title !== taskToDelete.title);

            await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
            loadTasks();

          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.taskItem, styles.taskDone]}>
      <Text style={styles.taskText}>{item.title}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.undoButton} onPress={() => undoTask(item)}>
            <Icon name="undo" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item)}>
            <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tâches terminées</Text>
      {tasks.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>
          Aucune tâche terminée.
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  taskItem: {
    padding: 15,
    backgroundColor: '#d4edda', // vert clair pour tâches terminées
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: { 
    fontSize: 16, 
    flex: 1, 
    color: '#155724', // texte vert foncé visible sur fond vert clair
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  undoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  undoButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

