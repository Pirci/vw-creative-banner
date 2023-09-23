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

  const setSelectedButton = (selectedButton) => {
    document
      .querySelectorAll('.banner-form_select button')
      .forEach((button) => {
        button.classList.remove('selected');
      });
    selectedButton.classList.add('selected');
  };

  const calculatedGasolineConsumption = await calculateGasolineConsumption();

  document.addEventListener('click', function (event) {
    if (!event.target.matches('.banner-form_select button')) {
      document
        .querySelectorAll('.banner-form_select button')
        .forEach((button) => {
          button.classList.remove('selected');
        });
    }
  });

  document.querySelectorAll('.banner-form_select button').forEach((button) => {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      setSelectedButton(this);
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
