import { getPetrolPricesByCountry } from './js/api';

const CONSUMPTION_DIFFERENCE = 6;

document.addEventListener('DOMContentLoaded', async function () {
  const calculateGasolineConsumption = async () => {
    const petrolPrices = await getPetrolPricesByCountry();
    const parsedGasolinePrice = parseFloat(
      petrolPrices.gasoline.replace(',', '.')
    );

    return parsedGasolinePrice * CONSUMPTION_DIFFERENCE;
  };

  const calculatedGasolineConsumption = await calculateGasolineConsumption();

  document.querySelectorAll('.banner-form_select button').forEach((button) => {
    button.addEventListener('click', function () {
      const userKm = parseInt(this.getAttribute('data-km'));

      const totalPrice = calculatedGasolineConsumption * userKm * 3;

      const formattedTotalPrice = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
      }).format(totalPrice);

      document.querySelector(
        '.banner-form_result_amount'
      ).innerText = `${formattedTotalPrice} Euro`;
    });
  });
});
