import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {setCustomText} from 'react-native-global-props';
import Feather from 'react-native-vector-icons/Feather';

Feather.loadFont();

const customTextProps = {
  style: {
    fontFamily: 'Poppins-Regular',
  },
};

setCustomText(customTextProps);

AppRegistry.registerComponent(appName, () => App);
