import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2320
class TestCase extends MockableTestCase {
  firstName: string;
  lastName: string;
  email: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake practice page as a clinic admin",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );

    this.addTestStep("Go to Settings on clinic profile page", async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep('Click on "Add staff member" button', async () => {
      await this.settingsPage.clickAddStaffButton();
      await this.addStaffPage.waitForMe();
    });
    this.addTestStep(
      "Add new staff member and displayed practice profile page.",
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
        await this.settingsPage.getStaffLineInfoByEmail(this.email);
      }
    );

    this.addTestStep(
      "Add new staff use the before email and get error toast",
      async () => {
        await this.settingsPage.clickAddStaffButton();
        await this.addStaffPage.waitForMe();
        [this.firstName, this.lastName] = this.addStaffPage.generateStaffData();
        await this.addStaffPage.setFirstName(this.firstName);
        await this.addStaffPage.setLastName(this.lastName);
        // use the before email
        await this.addStaffPage.setEmail(this.email);
        await this.addStaffPage.clickAddBtn();
        await this.addStaffPage.waitForToast(
          `A user with given email already exists`,
          60000
        );
      }
    );
  }
}

new TestCase(
  "CC-512",
  "Error message “User already exists“ is displayed if a user with the same email id is already registered"
);