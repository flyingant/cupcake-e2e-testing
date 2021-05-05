import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2376
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(`Login to Cupcake portal as a clinic coordinator and Navigate to 'All SCS patients' list`, async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPatient();
    });
    this.addTestStep(`Scroll down`, async () => {
      await this.tab.evaluate("window.scrollTo(0, document.documentElement.clientHeight);");
      await this.dashboardPage.waitForPatientListHeaderVisible();
    });
  }
}

new TestCase('CC-1591', `The column headers should be visible on scroll`);
