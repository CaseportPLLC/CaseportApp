import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RootStackParamList } from '../types';
import { useAuthState } from '../hooks/useAuth';
import { colors } from '../utils';

// Screens
import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateCaseScreen } from '../screens/CreateCaseScreen';
import { CaseDetailsScreen } from '../screens/CaseDetailsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigation: React.FC = () => {
  const { authState, checkAuthStatus } = useAuthState();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (authState.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        {authState.isAuthenticated ? (
          // Pantallas autenticadas
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Mis Casos',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
              }}
            />
            <Stack.Screen
              name="CreateCase"
              component={CreateCaseScreen}
              options={{
                title: 'Nuevo Caso',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
              }}
            />
            <Stack.Screen
              name="CaseDetails"
              component={CaseDetailsScreen}
              options={{
                title: 'Detalles del Caso',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
              }}
            />
            <Stack.Screen
              name="EditCase"
              component={CreateCaseScreen}
              options={{
                title: 'Editar Caso',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
              }}
            />
          </>
        ) : (
          // Pantallas de autenticación
          <Stack.Screen
            name="Login"
            component={AuthScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
});