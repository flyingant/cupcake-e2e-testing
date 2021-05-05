import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-125
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

    this.addTestStep("open eamil and click on Activate Cupcake link", async () => {
      // wait for email sync
      await this.tab.waitForTimeout(5000)
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(this.email);
      let path = await this.emailPage.saveEmail(this.id, emailContent['content']);
      await this.emailPage.goto(path);
      await this.emailPage.clickAcceptInvitation();
    });

    this.addTestStep("Verify that arrow button does not active", async () => {
      await this.activatePage.waitForMe()
      await this.activatePage.setPassword("@gaoshin.COM1")
      expect(await this.tab.getAttribute(this.activatePage.css_nextButton, "class")).not.toContain("disabled")
    });

    this.addTestStep("Verify that after clicking on 'Submit' button user is navigate to Cupcake page and validation message is shown", async () => {
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForToast("Password set successfully")
      await this.dashboardPage.waitForText("Decline")
    });
  }
}
new TestCase('CC-125', 'Verification: User can set valid password on CupCake set password page');

