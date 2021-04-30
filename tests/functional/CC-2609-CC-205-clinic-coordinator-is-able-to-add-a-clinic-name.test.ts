import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-205
class TestCase extends MockableTestCase {
  name: string

  async afterAll(){
    await this.settingsPage.setClinicName(this.name);
    await this.settingsPage.clickSaveButton();
    super.afterAll();
  }

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Go to Setting on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep('Enter some text up to 60 symbols and click on "Enter" button', async () => {
      this.name = await this.settingsPage.getClinicName();
      let clinicName = "s21111111111111111111111111111111111111111111111111111111sts";
      await this.settingsPage.setClinicName(clinicName);
      await this.settingsPage.clickSaveButton();
      await this.settingsPage.waitForToast("Clinic name successfully updated")
      expect(await this.settingsPage.getClinicName()).toBe(clinicName);
    });

    this.addTestStep('Try to enter some text with more than 60 symbols and click on "Enter" button', async () => {
      let clinicName = "s21111111111111111111111111111111111111111111111111111111sts2";
      await this.settingsPage.setClinicName(clinicName);
      await this.settingsPage.clickSaveButton();
      expect(await this.settingsPage.getClinicName()).toBe(clinicName.substr(0, 60));
    });
  }

}
new TestCase('CC-205', 'Verification: Clinic coordinator is able to add a clinic name');

