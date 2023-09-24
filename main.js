import { getPetrolPricesByCountry } from './js/api';

const CONSUMPTION_DIFFERENCE = 6;

export const calculateGasolineConsumption = async () => {
  const petrolPrices = await getPetrolPricesByCountry();
  const parsedGasolinePrice = parseFloat(
    petrolPrices.gasoline.replace(',', '.')
  );

  return parsedGasolinePrice * CONSUMPTION_DIFFERENCE;
};

export const setSelectedButton = (selectedButton) => {
  document.querySelectorAll('.banner-form_select button').forEach((button) => {
    button.classList.remove('selected');
  });
  selectedButton.classList.add('selected');
};

export const handleButtonClick = async (button) => {
  setSelectedButton(button);
  const calculatedGasolineConsumption = await calculateGasolineConsumption();
  const userKm = parseInt(button.getAttribute('data-km'));

  const totalPrice = calculatedGasolineConsumption * userKm * 3;
  const formattedTotalPrice = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(totalPrice);

  document.querySelector(
    '.banner-form_result_amount'
  ).innerText = `${formattedTotalPrice} Euro`;
};

document.addEventListener('DOMContentLoaded', function () {
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
      handleButtonClick(this); // Use the exposed function here
    });
  });
});
