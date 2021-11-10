/* eslint-disable no-unused-vars */
import camelize from 'camelize';
import { host, isMock } from '../../utils/env';

export const locationRequest = (searchTerm) => {
  return fetch(`${host}`).then((res) => {
    return res.json();
  });
};

export const locationTransform = (result) => {
  const formattedResponse = camelize(result);
  const { geometry = {} } = formattedResponse.results[0];
  const { lat, lng } = geometry.location;

  return { lat, lng, viewport: geometry.viewport };
};
