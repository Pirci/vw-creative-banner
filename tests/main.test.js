import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { calculateGasolineConsumption, setSelectedButton } from '../main.js';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;
let container;
let buttons;

jest.mock('../js/api', () => ({
  getPetrolPricesByCountry: jest.fn().mockReturnValue({
    gasoline: '1,582',
  }),
}));

describe('Main functions tests', () => {
  let calculatedGasolineConsumption;

  beforeAll(async () => {
    calculatedGasolineConsumption = await calculateGasolineConsumption();
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="banner-form_select">
        <button data-km="500"></button>
        <button data-km="1000"></button>
        <button data-km="2000"></button>
      </div>
      <div class="banner-form_result_amount"></div>
    `;

    dom = new JSDOM(html);
    container = dom.window.document;
    buttons = container.querySelectorAll('.banner-form_select button');

    require('../main.js');
  });

  it('should calculate gasoline consumption', async () => {
    expect(calculatedGasolineConsumption).toBeCloseTo(9.492); // (1.582 * 6)
  });

  describe('DOM interactions', () => {
    it('should set selected button', () => {
      let clickEvent = new Event('click', { bubbles: true, cancelable: true });
      clickEvent.isTestClick = true;
      buttons[0].dispatchEvent(clickEvent);

      expect(buttons[0].classList.contains('selected')).toBe(true);
      expect(buttons[1].classList.contains('selected')).toBe(false);

      setSelectedButton(buttons[1]);
      expect(buttons[0].classList.contains('selected')).toBe(false);
      expect(buttons[1].classList.contains('selected')).toBe(true);
    });

    it('should update total price when button is clicked', async () => {
      buttons[0].click();
      await new Promise((resolve) => setTimeout(resolve, 50)); // Give it a little more time
      const resultAmount = document.querySelector('.banner-form_result_amount');
      buttons[0].click();

      // Wait for DOM updates
      await new Promise((resolve) => setTimeout(resolve, 50)); // Give it a little more time

      // Check the updated value
      expect(resultAmount.textContent.trim()).toMatch(/\d+\.\d+ Euro/);
    });
  });
});
