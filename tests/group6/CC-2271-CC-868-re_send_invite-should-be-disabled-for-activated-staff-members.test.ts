import { BrowserContext, Page, Request } from 'playwright';
import MockableTestCase from "../src/MockableTestCase";
import ActivatePage from "../page-object-model/ActivatePage";
import EmailPage from "../page-object-model/EmailPage"

// https://teamsolace.atlassian.net/browse/CC-868
class TestCase extends MockableTestCase {

  firstName: string;
  lastName: string;
  email: string;

  context2 !: BrowserContext;
  tab2 !: Page;
  activatePage2 : ActivatePage;
  emailPage2 : EmailPage;

  async beforeAll() {
    // browser 1 
    await super.beforeAll()

    // browser 2
    this.context2 = await browser.newContext();
    this.tab2 = await this.context2.newPage();

    this.activatePage2 = new ActivatePage(this.tab2);
    this.emailPage2 = new EmailPage(this.tab2);
  }

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake as a clinic admin', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
      await this.tab.screenshot({path: `./tests/output/${browserName}-${this.id}-dashboardPage-step1.png`, fullPage: true})
    });

    this.addTestStep('Click on "Add staff member" button', async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.clickAddStaffButton();
      await this.addStaffPage.waitForMe();
      await this.tab.screenshot({path: `./tests/output/${browserName}-${this.id}-addStaffPage-step2.png`})
    });

    this.addTestStep('In fields First Name, Last Name and Email enter appropriate valid data', async () => {
      [this.firstName, this.lastName, this.email] = this.addStaffPage.generateStaffData();
      await this.addStaffPage.setFirstName(this.firstName);
      await this.addStaffPage.setLastName(this.lastName);
      await this.addStaffPage.setEmail(this.email);
      await this.addStaffPage.clickAddButtonAndWaitForToast();
    });

    this.addTestStep("Verify if email was received and click on Activate link in received email", async () => {
      // wait for email sync
      await this.tab.waitForTimeout(5000)
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(this.email);
      let path = await this.emailPage2.saveEmail(this.id, emailContent['content']);
      await this.emailPage2.goto(path);
      await this.emailPage2.clickAcceptInvitation();
      await this.activatePage2.waitForMe();
      await this.activatePage2.setPassword("@gaoshin.COM1")
      await this.activatePage2.clickNextButton();
      await this.activatePage2.waitForToast("Password set successfully");
    });

    this.addTestStep("Login to Cupcake as a clinic admin again", async () => {
      await this.homePage.goto("/");
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Verify if opposite already activated member "Re-Send Invite" button is disabled', async () => {

      await this.dashboardPage.clickSettings();
      let [,,,status] = await this.settingsPage.getStaffLineInfoByEmail(this.email);
      expect(status).toBe(false)
    });
  }
}
new TestCase('CC-868', 'Verification: "Re-send Invite" should be disabled for "activated" staff members');

