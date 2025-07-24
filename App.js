import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from './screens/TodoScreen';
import InProgressScreen from './screens/InProgressScreen';
import DoneScreen from './screens/DoneScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Todo" component={TodoScreen} />
        <Stack.Screen name="InProgress" component={InProgressScreen} options={{ title: 'En cours' }} />
        <Stack.Screen name="Done" component={DoneScreen} options={{ title: 'Terminées' }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Ajouter une tâche' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
