import { BrowserContext, Page, Request } from 'playwright';
import MockableTestCase from "../src/MockableTestCase";
import ActivatePage from "../page-object-model/ActivatePage";
import EmailPage from "../page-object-model/EmailPage"

// https://teamsolace.atlassian.net/browse/CC-203
class TestCase extends MockableTestCase {
    createTestSteps(): void {
        this.addTestStep('Login to Cupcake as a clinic admin', async () => {
            await this.homePage.start();
            await this.loginPage.setEmailPasswordAndThenSubmit();
            await this.dashboardPage.waitForMe();
        });

        this.addTestStep('Go to clinic settings page', async () => {
            await this.dashboardPage.clickSettings();
            await this.settingsPage.waitForMe();

        });

        this.addTestStep('Click on "Add staff member" button', async () => {
            await this.settingsPage.clickAddStaffButton();
            await this.addStaffPage.waitForMe();
        });

        this.addTestStep("In Email field enter valid email id and click on the 'plus in circle'button ", async () => {
            await this.addStaffPage.setFirstName("");
            await this.addStaffPage.setLastName("");
            await this.addStaffPage.setEmail("AlanTest008@gmail.com");
           
        });

        this.addTestStep("Fields First Name and Last Name leave as blank and try to click enter button ", async () => {
            await this.tab.keyboard.press("Enter");
            await this.addStaffPage.waitForText("Min 3 characters are required");
        });

       
    }
}
new TestCase('CC-203', 'Validation error message is displayed if admin set First Name and Last Name as blank');

