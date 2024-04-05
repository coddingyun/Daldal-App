import {Linking, Platform, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {BackHandler} from 'react-native';
import {useEffect, useRef, useState} from 'react';

type NavStateType = {
  canGoBack: boolean;
};

const Home = () => {
  const webViewRef = useRef<WebView>(null);
  const [navState, setNavState] = useState<NavStateType>({
    canGoBack: false,
  });

  useEffect(() => {
    const handleBackButton = () => {
      if (navState.canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navState.canGoBack]);

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: 'https://daldal-web.vercel.app/'}}
        ref={webViewRef}
        originWhitelist={[
          'http://*',
          'https://*',
          'intent://*',
          'zigzag',
          'itms-apps',
        ]}
        onShouldStartLoadWithRequest={event => {
          if (
            event.url.startsWith('https://s.zigzag') ||
            event.url.startsWith('https://zigzag') ||
            event.url.startsWith('itms-apps') ||
            event.url.startsWith('about:blank')
          ) {
            Linking.openURL(event.url);
          } else if (
            Platform.OS === 'android' &&
            event.url.startsWith('intent')
          ) {
            Linking.openURL(event.url.substring(7));
            return false;
          }
          if (Platform.OS === 'ios') {
            return true;
          }
          return true;
        }}
        onNavigationStateChange={state => {
          setNavState({canGoBack: state.canGoBack});
        }}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
