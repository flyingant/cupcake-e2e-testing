import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-141
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
      await this.addStaffPage.clickAddButton();
    });

    this.addTestStep("Open Set password page", async () => {
      // wait for email sync
      await this.tab.waitForTimeout(5000)
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(this.email);
      let path = await this.emailPage.saveEmail(this.id, emailContent['content']);
      await this.emailPage.goto(path);
      await this.emailPage.clickAcceptInvitation();
    });

    this.addTestStep("Verify that arrow button does not active", async () => {
      await this.activatePage.waitForMe()
      expect(await this.tab.getAttribute(this.activatePage.css_nextButton, "class")).toContain("disabled")
    });

    this.addTestStep('Verify the set password page', async () => {
      await this.activatePage.waitForMe();
    });

    this.addTestStep('Verify that after clicking on arrow button nothing happen', async () => {
      await this.activatePage.clickNextButtonByJs();
      await this.activatePage.waitForMe();
    });
  }
}
new TestCase('CC-141', 'Verification: User cannot be redirected from Set password page to CupCake page if password field is blank');

