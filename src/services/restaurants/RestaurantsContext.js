/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, createContext, useContext } from 'react';
import * as firebase from 'firebase';
import { firebaseConfig } from '../../utils/env';
import {
  restaurantsRequest,
  restaurantsTransform,
} from './restaurants.service';

import { LocationContext } from '../location/LocationContext';

export const RestaurantsContext = createContext();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const RestaurantsContextProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsWithIcecream, setRestaurantsWithIcecream] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { location, iceCream } = useContext(LocationContext);

  var db = firebase.firestore();

  const retrieveRestaurants = (loc) => {
    setIsLoading(true);
    setRestaurants([]);

    restaurantsRequest(loc)
      .then(restaurantsTransform)
      .then((results) => {
        setError(null);
        setIsLoading(false);
        setRestaurants(results);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setError(err);
      });
  };

  // const
  useEffect(() => {
    console.log(
      restaurantsWithIcecream.length,
      restaurants.length,
      '1 restaurantsWithIcecream'
    );
    if (restaurantsWithIcecream.length && restaurants.length) {
      console.log(restaurantsWithIcecream, '1 restaurantsWithIcecream');
      let res = restaurants.filter((el) =>
        restaurantsWithIcecream.includes(el.placeId)
      );
      setRestaurants(res);
    }
  }, [restaurantsWithIcecream]);

  useEffect(() => {
    if (location) {
      const locationString = `${location.lat},${location.lng}`;
      retrieveRestaurants(locationString);
    }
  }, [location, iceCream]);

  useEffect(() => {
    setRestaurantsWithIcecream([]);
    const fetchData = () => {
      let restaurantsId = [];
      if (iceCream != '') {
        db.collection('Menu')
          .where('icecreams', 'array-contains-any', [iceCream])
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((documentSnapshot) => {
              //console.log(documentSnapshot.id);
              restaurantsId.push(documentSnapshot.id);
            });
          });

        setRestaurantsWithIcecream(restaurantsId);
      }
    };

    fetchData();
  }, [iceCream]);

  // console.log(restaurantsWithIcecream, iceCream);
  // console.log(restaurants, iceCream, 'restaurants');

  return (
    <RestaurantsContext.Provider value={{ restaurants, isLoading, error }}>
      {children}
    </RestaurantsContext.Provider>
  );
};
