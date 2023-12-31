import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import {
  calculateGasolineConsumption,
  setSelectedButton,
  handleButtonClick,
} from '../../main.js';

const html = fs.readFileSync(
  path.resolve(__dirname, '../../index.html'),
  'utf8'
);

let dom;
let container;
let buttons;

jest.mock('../api/locationApi.js', () => ({
  getPetrolPricesByCountry: jest.fn().mockReturnValue({
    gasoline: '2,112',
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

    jest.resetModules();
    require('../../main.js');
  });

  it('should calculate gasoline consumption', async () => {
    expect(calculatedGasolineConsumption).toBeCloseTo(12.672);
  });

  describe('DOM interactions', () => {
    it('should set selected button', async () => {
      await handleButtonClick(buttons[0]);

      expect(buttons[0].classList.contains('selected')).toBe(true);
      expect(buttons[1].classList.contains('selected')).toBe(false);

      buttons[0].classList.remove('selected');
      setSelectedButton(buttons[1]);
      expect(buttons[0].classList.contains('selected')).toBe(false);
      expect(buttons[1].classList.contains('selected')).toBe(true);
    });
  });
});
