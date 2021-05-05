import { BrowserContext, Page, Request } from 'playwright';
import MockableTestCase from "../src/MockableTestCase";
import ActivatePage from "../page-object-model/ActivatePage";
import EmailPage from "../page-object-model/EmailPage"

// https://teamsolace.atlassian.net/browse/CC-191
class TestCase extends MockableTestCase {

  firstName: string;
  lastName: string;
  email: string;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake as a clinic admin', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Go to practice profile (Settings) page', async () => {
      await this.dashboardPage.clickSettings();
    });

    this.addTestStep('Click "Add new staff member" and using all fields add new person to portal', async () => {
      await this.settingsPage.clickAddStaffButton();
      await this.addStaffPage.waitForMe();
      [this.firstName, this.lastName, this.email] = this.addStaffPage.generateStaffData();
      await this.addStaffPage.setFirstName(this.firstName);
      await this.addStaffPage.setLastName(this.lastName);
      await this.addStaffPage.setEmail(this.email);
      await this.addStaffPage.clickAddButtonAndWaitForToast();
    });

    this.addTestStep("Verify if new added staff member is displayed on practice profile page.", async () => {
      await this.settingsPage.getStaffLineInfoByEmail(this.email)
    });
  }
}
new TestCase('CC-191', 'Verification: New added staff member is displayed on practice profile page.');

