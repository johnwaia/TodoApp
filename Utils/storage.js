// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des tâches', e);
  }
};

export const loadTasks = async () => {
  try {
    const data = await AsyncStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Erreur lors du chargement des tâches', e);
    return [];
  }
};
