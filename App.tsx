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
import Salas from './componentes/Salas';
import { Chat } from './componentes/Chat';

const PilhaDeAutenticacao = createNativeStackNavigator();
const PilhaDoAplicativo = createNativeStackNavigator();
export const API_URL = "http://192.168.0.76:3000"
export type SalaApi = {
    id: number,
    nome: string,
    usuarios: string[]
}
export type UsuarioApi = {
    id: number,
    nome: string,
    apelido: string
}
export type Mensagem = {
    id: string | number,
    conteudo: string
}
export type Sala = {
    id: string | number,
    nome: string
}
export type UsuarioSala = {
    id: string | number,
    idusuario: string | number,
    idsala: string | number
}
export type MensagemUsuarioSala = {
    idusuario: string | number,
    idsala: string | number,
    idmensagem: string | number,
}
export type Usuario = {
    id: string | number,
    nome: string,
    cor: string
}
export type ContextoGlobalT = {
    usuario?: UsuarioApi,
    salas?: SalaApi[]
    listaMensagens?: Mensagem[],
    lstaSalas?: Sala[],
    listaUsuariosSalas?: UsuarioSala[],
    listaUsuarios?: Usuario[],
    listaMensagensUsuarioSala?: MensagemUsuarioSala[],
    SALA_SELECIONADA:string | boolean
}
export const getContextoGlobal = () => {
    const [ctx, setCtx] = useContext(ContextoGlobal)
    return [ctx as ContextoGlobalT, setCtx]
}
let contex: ContextoGlobalT = {
    SALA_SELECIONADA: false
}
export const ContextoGlobal = createContext(contex);
const ProvedorContextoGlobal = ({children}: any) => {
    const [contextoGlobal, setContextoGlobal] = useState<ContextoGlobalT>(contex)
    return (
        <ContextoGlobal.Provider value={{ contextoGlobal, setContextoGlobal }}>
            {children}
        </ContextoGlobal.Provider>
    )
}
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
  return (
  <ProvedorContextoGlobal>
    <ProvedorContextoAutenticacao>
      <NavigationContainer>
        <ConteudoDoAplicativo />
       </NavigationContainer>
    </ProvedorContextoAutenticacao>
  </ProvedorContextoGlobal>
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
        <PilhaDoAplicativo.Screen
            name="Salas"
            component={Salas}
        />
        <PilhaDoAplicativo.Screen
            name="Chat"
            component={Chat}
        />
    </PilhaDoAplicativo.Navigator>
)
const ConteudoDoAplicativo = () => {
    const { estaAutenticado, setAutenticado } = useContext(AuthContext)
    return !estaAutenticado ? <TelaDeAutenticacao /> : <TelaDoAplicativo />
}
