import { BrowserContext, Page, Request } from 'playwright';
import MockableTestCase from "../src/MockableTestCase";
import ActivatePage from "../page-object-model/ActivatePage";
import EmailPage from "../page-object-model/EmailPage"

// https://teamsolace.atlassian.net/browse/CC-317
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

        this.addTestStep('Click on "Add staff member" button', async () => {

            await this.dashboardPage.clickSettings();
            await this.settingsPage.clickAddStaffButton();
            await this.addStaffPage.waitForMe();
        });
        this.addTestStep('In fields First Name, Last Name and Email enter appropriate valid data', async () => {
            [this.firstName, this.lastName, this.email] = this.addStaffPage.generateStaffData();
            await this.addStaffPage.setFirstName(this.firstName);
            await this.addStaffPage.setLastName(this.lastName);
            await this.addStaffPage.setEmail(this.email);
            await this.addStaffPage.clickAddButton();
        });
        this.addTestStep("Verify if email was sent", async () => {
            await this.settingsPage.waitForToast("Invitation sent to");
        });
        this.addTestStep("Verify if email was sent", async () => {
            await this.settingsPage.clickResendInviteBtnByEmail(this.email);
            await this.settingsPage.waitForToast("Invitation link has been resent");
        });
    }
}
new TestCase('CC-317', 'Verification: Clinic coordinator is able to resend the invitation link to staff members');

