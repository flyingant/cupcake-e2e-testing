import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-341
class TestCase extends MockableTestCase {
  patient: Map<string, string>;
  patientName: string;

  createTestSteps(): void {

    this.addTestStep('Login to Cupcake portal as a clinic coordinator and  Go to Patient list', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });

    this.addTestStep(`Click on the "ADD PATIENT" button`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });

    this.addTestStep(`In First name and Last name, Email fields enter data valid appropriate data`, async () => {
      this.patient = this.addPatientPage.generatePatientData();
      this.patientName = this.patient.get("firstName") + " " + this.patient.get("lastName");
      await this.addPatientPage.setPatientDetail(this.patient);
    });

    this.addTestStep(`In Phone field enter 9 digits and click next "->" button`, async () => {
      await this.addPatientPage.setPhone("369875641");
      await this.addPatientPage.waitForBtnDisabled();
    });

    this.addTestStep(`In Phone field enter 11 digits and click next "->" button`, async () => {
      await this.addPatientPage.setPhone("");
      await this.addPatientPage.setPhone("52879645861");//The default number of the page is 10, which will be passed here
      await this.addPatientPage.waitForBtnLight();
    });

    this.addTestStep(`In Phone field enter 10 digits in format (xxx) xxx xxxx `, async () => {
      await this.addPatientPage.setPhone("");
      await this.addPatientPage.setPhone("2539687415");
      await this.addPatientPage.waitForBtnLight();
    });

    this.addTestStep(` click next "->" button`, async () => {
      await this.addPatientPage.clickNextButton();
      await this.addPatientPage.waitForText("We'll set some important dates based on what stage this patient is at.");
    });
    

  }
}

new TestCase('CC-341', `Phone number should be 10 digits and the format should be (xxx)xxxxxxx`);