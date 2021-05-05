import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-265
class TestCase extends MockableTestCase {
  name: string

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

    this.addTestStep("enter text with more than 60 symbols", async () => {
      this.name = await this.settingsPage.getClinicName();
      let clinicName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1";
      let clinicName1= "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      await this.settingsPage.setClinicName(clinicName);
      await this.loginPage.tab.keyboard.press("Enter");
      expect(await this.settingsPage.getClinicName()).toBe(clinicName1);
    });
    this.addTestStep("enter text with 60 symbols", async () => {
      let clinicName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      await this.settingsPage.setClinicName(clinicName);
      await this.settingsPage.clickSaveButton();
      expect(await this.settingsPage.getClinicName()).toBe(clinicName);
    });
    this.addTestStep("enter text with 2 symbols", async () => {
      let clinicName = "aa";
      await this.settingsPage.setClinicName(clinicName);
      await this.loginPage.tab.keyboard.press("Enter");
      await this.settingsPage.waitForToast("Min 3 characters are required")
    });
    this.addTestStep("enter text with 3 symbols", async () => {
      let clinicName = "aaa";
      await this.settingsPage.setClinicName(clinicName);
      await this.settingsPage.clickSaveButton();
      expect(await this.settingsPage.getClinicName()).toBe(clinicName);
    });
    this.addTestStep("Restore clinic name", async () => {
      await this.settingsPage.setClinicName(this.name);
      await this.settingsPage.clickSaveButton();  
    })
  }

}
new TestCase('CC-265', 'Verification: Clinic co-ordinator is able to add/update the clinic name.');

