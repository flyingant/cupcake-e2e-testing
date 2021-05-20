import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-700
class TestCase extends MockableTestCase {

  createTestSteps(): void {

    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    
    this.addTestStep('Navigate to "All doctors"filter ', async () => {
      await this.dashboardPage.waitForText("All Doctors");
      await this.dashboardPage.clickAllDoctors();
    });

    this.addTestStep(`Navigate to 'All doctors' filter `, async () => {
      await this.dashboardPage.waitForText("All Doctors");
      let doctorName = await this.dashboardPage.getDoctorName();
      await this.dashboardPage.clickOfText(doctorName);
      let doctor = doctorName+"'s Patients";
      await this.dashboardPage.waitForText(doctor);
    });
    
  }
}

new TestCase('CC-700', `The patients and the metrics all are changed for the selected physician from the pull down.`);
