import { BrowserContext, Page, Request } from 'playwright';
import MockableTestCase from "../src/MockableTestCase";
import ActivatePage from "../page-object-model/ActivatePage";
import EmailPage from "../page-object-model/EmailPage"

// https://teamsolace.atlassian.net/browse/CC-512
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

        this.addTestStep('Go to clinic settings page', async () => {
            await this.dashboardPage.clickSettings();
            await this.settingsPage.waitForMe();

        });

        this.addTestStep('Click on "ADD STAFF MEMBER" button', async () => {
            await this.settingsPage.clickAddStaffButton();
            await this.addStaffPage.waitForMe();
        });

        this.addTestStep("In the First name and Last name, fields enter data with 3 or more symbols and go to Email field", async () => {
            [this.firstName, this.lastName, this.email] = this.addStaffPage.generateStaffData();
            await this.addStaffPage.setFirstName(this.firstName);
            await this.addStaffPage.setLastName(this.lastName);

        });

        this.addTestStep("In Email field enter valid email id and click on the 'plus in circle'button ", async () => {
            this.email = await this.addStaffPage.getRandomEmail();
            await this.addStaffPage.setEmail(this.email);
            await this.addStaffPage.clickAddBtn();
            await this.addStaffPage.waitForTimeout(1500);//Wait for the animation
            await this.settingsPage.waitForText(this.email);
            await this.settingsPage.clickCloseIcon();
        });

        this.addTestStep("Repeat all steps 1 to 5 and verify the result", async () => {
            await this.settingsPage.clickAddStaffButton();
            await this.addStaffPage.waitForMe();
            await this.addStaffPage.setFirstName(this.firstName);
            await this.addStaffPage.setLastName(this.lastName);
            await this.addStaffPage.setEmail(this.email);
            await this.addStaffPage.clickAddBtn();
            await this.addStaffPage.waitForTimeout(2000);//Wait for the animation
            await this.settingsPage.waitForText("A user with given email already exists");
        });
    }
}
new TestCase('CC-512', 'Error message “A user with given email already exists“ is displayed if a user with the same email id is already registered');

