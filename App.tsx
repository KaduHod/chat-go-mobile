/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createContext ,useContext,useState } from 'react';
//import ReactWelcome from './componentes/ReactWelcome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './componentes/Login';
import { Cadastro } from './componentes/Cadastro';
import { TelaInicial } from './componentes/PaginaInicial';

const PilhaDeAutenticacao = createNativeStackNavigator();
const PilhaDoAplicativo = createNativeStackNavigator();
export const AuthContext = createContext({} as any);
export const ProvedorContextoAutenticacao = ({children}: any) => {
    const [estaAutenticado, setAutenticado] = useState(false)
    return (
        <AuthContext.Provider value={{ estaAutenticado, setAutenticado }}>
            {children}
        </AuthContext.Provider>
    )
}
export default function App(): React.JSX.Element {
    const { estaAutenticado } = useContext(AuthContext)
  return (
    <ProvedorContextoAutenticacao>
      <NavigationContainer>
        { !estaAutenticado ? (<TelaDeAutenticacao />) : (<TelaDoAplicativo />) }
       </NavigationContainer>
    </ProvedorContextoAutenticacao>
  );
}
const TelaDeAutenticacao = () => (
    <PilhaDeAutenticacao.Navigator>
        <PilhaDeAutenticacao.Screen
            name="Login"
            component={Login}

        />
        <PilhaDeAutenticacao.Screen
            name="Cadastro"
            component={Cadastro}
        />
    </PilhaDeAutenticacao.Navigator>
)

const TelaDoAplicativo = () => (
    <PilhaDoAplicativo.Navigator>
        <PilhaDoAplicativo.Screen
            name="TelaInicial"
            component={TelaInicial}
        />
    </PilhaDoAplicativo.Navigator>
)
