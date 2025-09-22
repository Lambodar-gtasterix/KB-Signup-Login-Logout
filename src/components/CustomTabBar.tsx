import React from 'react';

import {

  View,

  TouchableOpacity,

  Text,

  StyleSheet,

  Dimensions,

} from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';

import LinearGradient from 'react-native-linear-gradient';
 
const { width } = Dimensions.get('window');

const circleSize = width * 0.16;

const innerCircleSize = circleSize * 0.8;
 
export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {

  const renderTab = (route: any, index: number) => {

    const isFocused = state.index === index;
 
    const onPress = () => {

      const event = navigation.emit({

        type: 'tabPress',

        target: route.key,

        canPreventDefault: true,

      });

      if (!isFocused && !event.defaultPrevented) {

        navigation.navigate(route.name);

      }

    };
 
    const iconName = getIconName(route.name);
 
    if (route.name === 'Sell Product') {

      return (
<TouchableOpacity

          key={route.key}

          onPress={onPress}

          style={styles.sellTabWrapper}
>
<LinearGradient

            colors={['#43CDCD', '#26537E', '#143342']}

            style={styles.sellOuterCircle}

            start={{ x: 0, y: 0 }}

            end={{ x: 1, y: 1 }}
>
<View style={styles.sellCircle}>
<Icon name="add" size={28} color="#0A2D41" />
</View>
</LinearGradient>
<Text style={styles.tabLabel}>{getTabLabel(route.name)}</Text>
</TouchableOpacity>

      );

    }
 
    return (
<TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButton}>
<Icon name={iconName} size={24} color={isFocused ? '#0A84FF' : '#8E8E93'} />
<Text style={[styles.tabLabel, { color: isFocused ? '#0A84FF' : '#8E8E93' }]}>

          {getTabLabel(route.name)}
</Text>
</TouchableOpacity>

    );

  };
 
  return (
<View style={styles.container}>
<View style={styles.tabRow}>

        {state.routes.map((route, index) => renderTab(route, index))}
</View>
</View>

  );

}
 
function getIconName(name: string) {

  switch (name) {

    case 'Home':

      return 'home';

    case 'Live Bidding':

      return 'gavel';

    case 'My Ads':

      return 'article';

    case 'Profile':

      return 'person';

    case 'Sell Product':

      return 'add';

    default:

      return 'circle';

  }

}
 
function getTabLabel(name: string) {

  switch (name) {

    case 'Home':

      return 'Home';

    case 'Live Bidding':

      return 'Live Bidding';

    case 'My Ads':

      return 'My Ads';

    case 'Profile':

      return 'Profile';

    case 'Sell Product':

      return 'Sell Product';

    default:

      return name;

  }

}
 
const styles = StyleSheet.create({

  container: {

    height: 70,

    backgroundColor: '#fff',

    borderTopWidth: 1,

    borderTopColor: '#eee',

  },

  tabRow: {

    flexDirection: 'row',

    justifyContent: 'space-around',

    alignItems: 'center',

    height: '100%',

    paddingHorizontal: 10,

  },

  tabButton: {

    alignItems: 'center',

    justifyContent: 'center',

    flex: 1,

  },

  tabLabel: {

    fontSize: width * 0.03,

    marginTop: 2,

    textAlign: 'center',

    color: '#8E8E93',

  },

  sellTabWrapper: {

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 20,

    flex: 1,

  },

  sellOuterCircle: {

    width: circleSize,

    height: circleSize,

    borderRadius: circleSize / 2,

    justifyContent: 'center',

    alignItems: 'center',

  },

  sellCircle: {

    width: innerCircleSize,

    height: innerCircleSize,

    borderRadius: innerCircleSize / 2,

    backgroundColor: '#fff',

    justifyContent: 'center',

    alignItems: 'center',

  },

});

 