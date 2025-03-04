import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {CodePushSelector} from '~modules/setting/settingStore';
import {Splash, Auth, PlayingGame, Home} from '~view';
import {navigationRef} from '~core/helper/navigate';
const Stack = createNativeStackNavigator();

const privateScreen: any[] = [Home];

const MainRouter = () => {
  const {splash} = useSelector(CodePushSelector);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!splash ? (
          <Stack.Screen name="SplashScreen" component={Splash} />
        ) : (
          privateScreen.map((res: any) => {
            return <Stack.Screen name={`${res}`} component={res} />;
          })
        )}

        <Stack.Screen name="PlayingGame" component={PlayingGame} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default React.memo(MainRouter);
