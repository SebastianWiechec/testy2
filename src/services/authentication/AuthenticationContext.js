import React, { useState, createContext } from 'react';
import * as firebase from 'firebase';

import { loginRequest } from './authentication.service';
const firebaseConfig = {
  apiKey: 'AIzaSyBZqBqmfgvSILa3OFHkvgwTI_3U2H4WtBk', //'AIzaSyAMOQP9M0--a-l6JDPF5wIXxSHtTd58BLw',
  authDomain: 'icespotting.firebaseapp.com', //'yummeals-e8d3d.firebaseapp.com',
  projectId: 'icespotting', //'yummeals-e8d3d',
  storageBucket: 'icespotting.appspot.com', //'yummeals-e8d3d.appspot.com',
  messagingSenderId: '729160709089', //'572941448591',
  appId: '1:729160709089:android:7f55c031a5957c4cf258a0', //'1:572941448591:web:9993d5c64e60e32232c7fa',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var db = firebase.firestore();
export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [placeId, setPlaceId] = useState(null);
  const [error, setError] = useState(null);

  firebase.auth().onAuthStateChanged((usr) => {
    if (usr) {
      setUser(usr);
      setIsLoading(false);
    }
  });

  const onLogin = (email, password) => {
    setIsLoading(true);
    loginRequest(email, password)
      .then((u) => {
        // console.log(u.user.uid, "user authCon")

        db.collection('Admins')
          .doc(u.user.uid)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.data()) {
              setPlaceId(querySnapshot.data().place_id);
            }
            // console.log(querySnapshot.data())
            // querySnapshot.forEach((doc) => {
            //   console.log(doc.id, ' => ', doc.data());
            // });
          });

        setUser(u);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.toString());
      });
  };

  const onRegister = (email, password, repeatedPassword) => {
    setIsLoading(true);
    if (password !== repeatedPassword) {
      setError('Error: Passwords do not match');
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.toString());
      });
  };

  const onLogout = () => {
    setUser(null);
    firebase.auth().signOut();
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        placeId,
        error,
        onLogin,
        onRegister,
        onLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
