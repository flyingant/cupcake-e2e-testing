import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf"

// https://teamsolace.atlassian.net/browse/CC-194
class TestCase extends MockableTestCase {

  firstName: string;
  lastName: string;
  email: string;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake as a clinic admin add a staff', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
      // enter to setting, click add staff
      await this.dashboardPage.clickSettings();
      await this.settingsPage.clickAddStaffButton();
      await this.addStaffPage.waitForMe();
      // add staff
      [this.firstName, this.lastName, this.email] = this.addStaffPage.generateStaffData();
      await this.addStaffPage.setFirstName(this.firstName);
      await this.addStaffPage.setLastName(this.lastName);
      await this.addStaffPage.setEmail(this.email);
      await this.addStaffPage.clickAddButtonAndWaitForToast();
    });

    this.addTestStep("Go to received email and open it", async () => {
      // wait for email sync
      await this.emailPage.sleep(5000)
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(this.email);
      let path = await this.emailPage.saveEmail(this.id, emailContent['content']);
      await this.emailPage.goto(path);
    });

    this.addTestStep("Click on magic link", async () => {
      await this.emailPage.clickAcceptInvitation();
    });

    this.addTestStep('Verify Cupcake set password page', async () => {
      await this.activatePage.waitForMe()
      await this.activatePage.setPassword(AppConf.passwordForReset())
    });
  }
}
new TestCase('CC-194', 'Verification: Staff member is able to login to the Cupcake portal using magic link in email');

