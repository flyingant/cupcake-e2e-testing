import SettingsPage from './SettingsPage';
import TestComponent from './TestComponent';
import Faker from 'faker'
import { stat } from 'node:fs';

export default class AddStaffPage extends TestComponent {
  async waitForMe() {
    await this.waitForText("Add staff member")
  }

  async setFirstName(value: string) {
    let inputs = await this.tab.$$("input");
    await inputs[0].fill(value);
  }

  async setLastName(value: string) {
    let inputs = await this.tab.$$("input");
    await inputs[1].fill(value);
  }

  async setEmail(value: string) {
    let input = await this.tab.$(`input[id="email"]`);
    await input.fill(value);
  }

  async clickCloseButton() {
    await this.tab.click('css=button[aria-label="delete"]')
  }

  async clickAddButtonAndWaitForToast() {
    await this.tab.click("css=img[alt='add']");
    await this.waitForToast(`Invitation sent to`, 60000);
  }

  generateStaffData() {
    let first_name = Faker.name.firstName(1);
    if (first_name.length < 3) {
      first_name = first_name + "o"
    }
    let last_name = Faker.name.lastName(1);
    let email = Faker.internet.email(first_name, last_name, "cupcake.com");
    return [first_name, last_name, email]
  }

  async clickAddBtn() {
    await this.tab.click("css=img[alt='add']");
  }

  async waitForFirstNameWarningMessage() {
    await this.tab.waitForSelector(`div[data-test-id=first_name] p:has-text("Min 3 characters are required")`)
  }

  async waitForNoneFirstNameWarningMessage() {
    await this.tab.waitForSelector(`div[data-test-id=first_name] p:has-text("Min 3 characters are required")`, { state: 'hidden' })
  }

  async waitForLastNameWarningMessage() {
    await this.tab.waitForSelector(`div[data-test-id=last_name] p:has-text("Min 3 characters are required")`)
  }

  async waitForNoneLastNameWarningMessage() {
    await this.tab.waitForSelector(`div[data-test-id=last_name] p:has-text("Min 3 characters are required")`, { state: 'hidden' })
  }

  async waitForEmailWarningMessage() {
    await this.tab.waitForSelector(`p:has-text("Please enter a valid email address")`)
  }

  async waitForNoneEmailWarningMessage() {
    await this.tab.waitForSelector(`p:has-text("Please enter a valid email address")`, { state: 'hidden' })
  }

  async getRandomEmail() {
    let date = new Date();
    let email = "Alan" + date.getHours() + date.getMinutes() + date.getMilliseconds() + "@gmail.com";
    return email;
  }


}
