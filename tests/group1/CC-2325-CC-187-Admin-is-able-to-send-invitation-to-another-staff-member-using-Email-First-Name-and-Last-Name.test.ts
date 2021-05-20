import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2325

class TestCase extends MockableTestCase {
  firstName: string;

  lastName: string;

  email: string;

  createTestSteps(): void {
    this.addTestStep("Login to Cupcake as a clinic admin", async () => {
      await this.homePage.start();

      await this.loginPage.setEmailPasswordAndThenSubmit();
    });

    this.addTestStep(
      'Go to clinic settings page and Click on "Add staff member" button',

      async () => {
        await this.dashboardPage.waitForMe();

        await this.dashboardPage.clickSettings();

        await this.settingsPage.clickAddStaffButton();

        await this.addStaffPage.waitForMe();
      }
    );

    this.addTestStep(
      "In fields First Name, Last Name and Email enter appropriate valid data",

      async () => {
        [
          this.firstName,

          this.lastName,

          this.email,
        ] = this.addStaffPage.generateStaffData();

        await this.addStaffPage.setFirstName(this.firstName);

        await this.addStaffPage.setLastName(this.lastName);

        await this.addStaffPage.setEmail(this.email);

        await this.addStaffPage.clickAddButtonAndWaitForToast();
      }
    );

    this.addTestStep("Verify if email was sent", async () => {
      await this.settingsPage.waitForToast("Invitation sent to");
    });

    this.addTestStep(
      "Click on 'RESEND INVITE' button few times arrow and verify is email was sent few times",

      async () => {
        await this.settingsPage.clickResendInviteBtnByEmail(this.email);

        await this.settingsPage.waitForToast("Invitation link has been resent");
      }
    );
  }
}

new TestCase(
  "CC-187",

  "Verification: Admin is able to send invitation to another staff member using Email, First Name and Last Name"
);
