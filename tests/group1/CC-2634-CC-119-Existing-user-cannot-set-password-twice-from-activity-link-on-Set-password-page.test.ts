import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2634
class TestCase extends MockableTestCase {
  firstName: string;
  lastName: string;
  email: string;
  emailPath: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake as a clinic admin add a staff and go to email",
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
        // Go to received email and open it
        await this.emailPage.sleep(5000);
        let emailContent = await this.ccTestClient.platform_getEmailForAddress(
          this.email
        );
        this.emailPath = await this.emailPage.saveEmail(
          this.id,
          emailContent["content"]
        );
        await this.emailPage.goto(this.emailPath);
      }
    );

    this.addTestStep("Click on Activate Cupcake link", async () => {
      await this.emailPage.clickAcceptInvitation();
    });

    this.addTestStep(
      "Enter valid password and click on 'Submit' button",
      async () => {
        await this.activatePage.waitForMe();
        await this.activatePage.setPassword(AppConf.passwordForReset());
        await this.activatePage.clickNextButton();
        await this.activatePage.waitForToast("Password set successfully");
        await this.activatePage.clickAgree();
        await this.activatePage.clickAgree();
        await this.dashboardPage.waitForMe();
      }
    );
    this.addTestStep(
      "Verify that after clicking on Activate Cupcake link one more time error message is display",
      async () => {
        await this.emailPage.goto(this.emailPath);
        await this.emailPage.clickAcceptInvitation();
        await this.activatePage.waitForMe();
        await this.activatePage.setPassword(AppConf.passwordForReset());
        await this.activatePage.waitForToast(
          "Link is expired. Please request another link."
        );
      }
    );
  }
}
new TestCase(
  "CC-119",
  "Verification: Existing user cannot set password twice from activity link on Set password page"
);