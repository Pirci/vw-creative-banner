import fuelPrices from '../public/data/fuelPrice.json';

const locationApi = 'https://api.ipregistry.co/';
const publicAPIKey = 'clv2xohxdhdoxniw';

const defaultPetrolPrices = {
  currency: 'euro',
  lpg: '0,744',
  diesel: '1,339',
  gasoline: '1,582',
  country: 'Netherlands',
};

const getCountryName = async () =>
  await fetch(`${locationApi}?key=${publicAPIKey}`)
    .then((response) => response.json())
    .then((res) => res.location.country.name);

export const getPetrolPricesByCountry = async () => {
  const usersCountry = await getCountryName();

  const prices = fuelPrices.find((result) => result.country === usersCountry);

  return prices || defaultPetrolPrices;
};
