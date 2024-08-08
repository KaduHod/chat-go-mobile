/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
//import ReactWelcome from './componentes/ReactWelcome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './componentes/Login';
import { Cadastro } from './componentes/Cadastro';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
  <NavigationContainer>
    <Stack.Navigator>
        <Stack.Screen
            name="Login"
            component={Login}
        />
        <Stack.Screen
            name="Cadastro"
            component={Cadastro}
        />
    </Stack.Navigator>
   </NavigationContainer>
  );
}

export default App;
