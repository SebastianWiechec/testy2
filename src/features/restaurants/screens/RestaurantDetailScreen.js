/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { List, Divider } from 'react-native-paper';

import { SafeArea } from '../../../components/SafeArea/SafeArea';
import { Spacer } from '../../../components/Spacer/Spacer';
import { RestaurantInfoCard } from '../components/RestaurantInfoCard';
import { OrderButton } from '../components/RestaurantList.styles';

import { CartContext } from '../../../services/cart/CartContext';
import * as firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyBZqBqmfgvSILa3OFHkvgwTI_3U2H4WtBk',
  authDomain: 'icespotting.firebaseapp.com',
  projectId: 'icespotting',
  storageBucket: 'icespotting.appspot.com',
  messagingSenderId: '729160709089',
  appId: '1:729160709089:android:7f55c031a5957c4cf258a0',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const RestaurantDetailScreen = ({ route, navigation }) => {
  const [breakfastExpanded, setBreakfastExpanded] = useState(false);
  const [lunchExpanded, setLunchExpanded] = useState(false);
  const [dinnerExpanded, setDinnerExpanded] = useState(false);
  const [drinksExpanded, setDrinksExpanded] = useState(false);

  const [icecreams, setIcecreams] = useState([]);
  const [milkshake, setMilkshake] = useState(false);
  const { addToCart } = useContext(CartContext);

  const { restaurant } = route.params;
  console.log(restaurant.placeId, 'restaurant resDet');
  console.log(icecreams);

  var db = firebase.firestore();

  useEffect(() => {
    const fetchData = async () => {
      db.collection('Menu')
        .doc(restaurant.placeId)
        .get()
        .then((querySnapshot) => {
          const result = querySnapshot.data();
          if (result) {
            setIcecreams(result.icecreams);
            setMilkshake(result.milkshake);
          }
          //console.log(querySnapshot.data())
        });
    };

    fetchData();
  }, []);

  return (
    <SafeArea>
      <ScrollView>
        <RestaurantInfoCard restaurant={restaurant} />
        <List.Accordion
          title="Icecreams"
          left={(props) => <List.Icon {...props} icon="food-croissant" />}
          expanded={breakfastExpanded}
          onPress={() => setBreakfastExpanded(!breakfastExpanded)}
        >
          {icecreams.length ? (
            icecreams?.map((el) => (
              <View>
                <List.Item title={el?.toString()} />
                <Divider />
              </View>
            ))
          ) : (
            <Text>Ta lodziarnia z nami nie współpracuje jeszcze !</Text>
          )}
        </List.Accordion>
        <Divider />
        <List.Accordion
          title="MilkShakes"
          left={(props) => <List.Icon {...props} icon="local-drink" />}
          expanded={lunchExpanded}
          onPress={() => setLunchExpanded(!lunchExpanded)}
        >
          {milkshake.length &&
            milkshake?.map((el) => (
              <View>
                <List.Item title={el?.toString()} />
                <Divider />
              </View>
            ))}
        </List.Accordion>
      </ScrollView>
      <Spacer position="bottom" size="large">
        <OrderButton
          icon="cash-usd"
          mode="contained"
          onPress={() => {
            addToCart({ item: 'special', price: 1299 }, restaurant);
            navigation.navigate('Checkout');
          }}
        >
          Zestaw specjalny tylko 12 PLN!
        </OrderButton>
      </Spacer>
    </SafeArea>
  );
};
