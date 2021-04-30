import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1252
class TestCase extends MockableTestCase {
  fullname: string
  now = Date.parse(new Date().toString())

  createTestSteps(): void {
    this.addTestStep('Login as clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Go to Patient Details page', async () => {
      this.fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName);
      await this.dashboardPage.searchByName(this.fullname);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('Navigate to Notes section and enter any text ih the field', async () => {
      await this.patientDetailPage.setNotes(`noted by automation CC-1252 at ${this.now}`);
    });
    
    this.addTestStep('Click "Save changes" button', async () => {
      await this.patientDetailPage.clickSaveChange();
      await this.patientDetailPage.waitForToast("Patient updated successfully");
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.searchByName(this.fullname);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
      expect(await this.patientDetailPage.getNotes()).toBe(`noted by automation CC-1252 at ${this.now}`)
    });
  }
}
new TestCase('CC-1252', 'Verification: Coordinator can enter and save notes on Patient details page');

