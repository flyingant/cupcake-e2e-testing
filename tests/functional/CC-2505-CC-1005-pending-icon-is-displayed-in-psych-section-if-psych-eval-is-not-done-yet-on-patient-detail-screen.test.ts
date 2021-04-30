import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1005
class TestCase extends MockableTestCase {
  fullname: string;
  gender: string;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Go to patient contact details page', async () => {
      // set psy
      this.fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName)
      await this.dashboardPage.searchByName(this.fullname);
      await this.dashboardPage.clickPsySetDate();
      await this.calendarPage.pickNextAvailableDay();
      await this.calendarPage.clickSchedule();
      // goto details
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('Verify if pending icon is present in Psych Eval section, if psych eval is not done yet', async () => {
      let status = await this.tab.innerText(this.patientDetailPage.css_psychEval)
      expect(status).toContain("Pending")
    });
  }
}
new TestCase('CC-1005', 'Verification: Pending icon is displayed in Psych section if psych eval is not done yet on Patient detail screen');

