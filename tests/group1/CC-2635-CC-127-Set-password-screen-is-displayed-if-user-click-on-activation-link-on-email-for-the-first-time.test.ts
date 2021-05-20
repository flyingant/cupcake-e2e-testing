import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2635
class TestCase extends MockableTestCase {
  firstName: string;
  lastName: string;
  email: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake as a clinic admin add a staff and Go to received email",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
        await this.dashboardPage.waitForMe();
        // enter to setting, click add staff
        await this.dashboardPage.clickSettings();
        await this.settingsPage.clickAddStaffButton();
        await this.addStaffPage.waitForMe();
        // add staff
        [
          this.firstName,
          this.lastName,
          this.email,
        ] = this.addStaffPage.generateStaffData();
        await this.addStaffPage.setFirstName(this.firstName);
        await this.addStaffPage.setLastName(this.lastName);
        await this.addStaffPage.setEmail(this.email);
        await this.addStaffPage.clickAddButtonAndWaitForToast();
        await this.emailPage.sleep(5000);
        let emailContent = await this.ccTestClient.platform_getEmailForAddress(
          this.email
        );
        let path = await this.emailPage.saveEmail(
          this.id,
          emailContent["content"]
        );
        await this.emailPage.goto(path);
      }
    );

    this.addTestStep(
      "Open corresponding email and click on Activate Cupcake link",
      async () => {
        await this.emailPage.clickAcceptInvitation();
        await this.activatePage.waitForMe();
      }
    );

    this.addTestStep("Set password", async () => {
      await this.activatePage.setPassword(AppConf.passwordForReset());
    });

    this.addTestStep(
      "Verify that after clicking on Arrow button user navigate to Cupcake page",
      async () => {
        await this.activatePage.clickNextButton();
        await this.activatePage.waitForToast("Password set successfully");
        await this.activatePage.clickAgree();
        await this.activatePage.clickAgree();
        await this.dashboardPage.waitForMe();
      }
    );
  }
}
new TestCase(
  "CC-127",
  "Verification: Set password screen is displayed if user click on activation link on email for the first time"
);