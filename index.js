import {
    AppRegistry
} from 'react-native';
import {
    StackNavigator,
} from 'react-navigation';  
import App from './App';
import MainApp from './MainApp';

const Appz = StackNavigator({
    App: { screen: App },
    MainApp: { screen: MainApp },
});

AppRegistry.registerComponent('AppSense', () => Appz);
