import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2313
class TestCase extends MockableTestCase {

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
        await this.dashboardPage.waitForMe();
        await this.dashboardPage.waitForPatientList();
      }
    );

    this.addTestStep("Go to Settings on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep(`Click on "Add staff member" button`, async () => {
      await this.settingsPage.clickAddStaffButton();
      await this.addStaffPage.waitForMe();
    });

    this.addTestStep(`In fields First name and Last name fields enter data with more than 3 symbols and go to Email field`, async () => {
      await this.addStaffPage.setFirstName('abc');
      await this.addStaffPage.setLastName('def');
      await this.addStaffPage.waitForNoneFirstNameWarningMessage();
      await this.addStaffPage.waitForNoneLastNameWarningMessage();
    });

    this.addTestStep(`In Email field enter invalid email id and click "next' button`, async () => {
      await this.addStaffPage.setEmail('test@com');
      await this.addStaffPage.waitForEmailWarningMessage();
    });
  }
}

new TestCase(
  "CC-511",
  `Inline field error message “Please enter a valid email address“ is displayed if invalid email id is entered in Email field`
);