import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-887
class TestCase extends MockableTestCase {
  physicianList: string[]

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Click on any name of patient from 'All SCS Patients' list", async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test008'));
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('Go to "SURGEON" section click on the "ADD" button and enter physician data in entries field ', async () => {
      await this.patientDetailPage.clickSurgon();
      this.physicianList = await this.patientDetailPage.getPhysicianInSurgonList();
      await this.patientDetailPage.searchSurgon(this.physicianList[0]);
    });
    
    this.addTestStep('Verify that after clicking on "name of surgeon", data is displayed on patient detail screen', async () => {
      await this.patientDetailPage.selectSurgon({index: 0});
      let surgonName = await this.tab.innerText(this.patientDetailPage.css_surgon);
      expect(surgonName).toBe(this.physicianList[0])
    });
  }
}
new TestCase('CC-887', 'Verification: The coordinator can add the "SURGEON" name for the patient ');

