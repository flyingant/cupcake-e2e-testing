import MockableTestCase from "../src/MockableTestCase";
import { format } from "date-fns";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2356
class TestCase extends MockableTestCase {

  patient: Map<string, string>;

  patientName: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );
    this.addTestStep(`Go to Dashboard Page and Click 'ADD PATIENT' button`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });
    
    this.addTestStep(
      `In First name and Last name fields enter data with min 3 characters and click next "->" button`,
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        await this.addPatientPage.setFirstName('abc');
        await this.addPatientPage.setLastName('efg');
        await this.addPatientPage.waitForNoText('Please enter a valid first name');
        await this.addPatientPage.waitForNoText('Please enter a valid last name');
      }
    );

    this.addTestStep(
      `In First name and Last name fields enter data with max 40 characters and click next "->" button`,
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        await this.addPatientPage.setFirstName('abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde');
        await this.addPatientPage.setLastName('fghijfghijfghijfghijfghijfghijfghijfghij');
        await this.addPatientPage.waitForNoText('Please enter a valid first name');
        await this.addPatientPage.waitForNoText('Please enter a valid last name');
      }
    );

    this.addTestStep(
      `In First name and Last name fields enter data with only 2 characters and click next "->" button`,
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        await this.addPatientPage.setFirstName('ab');
        await this.addPatientPage.setLastName('ef');
        await this.addPatientPage.waitForText('Please enter a valid first name');
        await this.addPatientPage.waitForText('Please enter a valid last name');
      }
    );

    this.addTestStep(
      `In First name and Last name fields enter data with only 41+ characters and click next "->" button`,
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        await this.addPatientPage.setFirstName('abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabc');
        await this.addPatientPage.setLastName('fghijfghijfghijfghijfghijfghijfghijfghijfgh');
        await this.addPatientPage.waitForText('Please enter a valid first name');
        await this.addPatientPage.waitForText('Please enter a valid last name');
      }
    );
  }
}

new TestCase(
  "CC-338",
  `Min 3 and max 40 characters are accepted in First name and Last name fields`
);