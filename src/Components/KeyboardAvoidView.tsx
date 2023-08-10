import React from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';

export default function KeyboardAvoidView({children}: any): JSX.Element {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="h-full"
      keyboardVerticalOffset={Platform.select({
        ios: 0,
        android: 20,
      })}>
      {children}
    </KeyboardAvoidingView>
  );
}
