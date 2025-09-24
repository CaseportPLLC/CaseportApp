import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const navigateToRegister = () => setIsLogin(false);
  const navigateToLogin = () => setIsLogin(true);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <LoginForm onNavigateToRegister={navigateToRegister} />
      ) : (
        <RegisterForm onNavigateToLogin={navigateToLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});