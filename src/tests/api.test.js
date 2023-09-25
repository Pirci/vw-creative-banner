// tests/api.test.js
import { getPetrolPricesByCountry } from '../api/locationApi.js';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => ({ location: { country: { name: 'Netherlands' } } }),
  })
);

describe('API tests', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('should get petrol prices by country', async () => {
    const prices = await getPetrolPricesByCountry();
    expect(prices.country).toBe('Netherlands');
  });

  it('should return default prices if country is not found', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            location: {
              country: {
                name: 'UnknownCountry',
              },
            },
          }),
      })
    );

    const prices = await getPetrolPricesByCountry();
    expect(prices).toEqual({
      currency: 'euro',
      lpg: '0,744',
      diesel: '1,339',
      gasoline: '2,112',
      country: 'Netherlands',
    });
  });
});
