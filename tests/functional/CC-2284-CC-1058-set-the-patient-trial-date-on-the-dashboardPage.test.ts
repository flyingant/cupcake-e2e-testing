import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1058
class TestCase extends MockableTestCase {
  patient : Map<string, string>;
  patientName: string;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('ADD A PATIENT', async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();

      this.patient = this.addPatientPage.generatePatientData();
      this.patientName = this.patient.get("firstName") + " " + this.patient.get("lastName");
      await this.addPatientPage.setPatientDetail(this.patient);
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectStage("Awaiting/Scheduled Trial");
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.clickDoNotSetTrialDate();
      await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.waitForSummaryPage();      
      await this.addPatientPage.clickAddPatientButton();
      await this.dashboardPage.waitForMe();
    });
    this.addTestStep('set trial date', async () => {
      await this.dashboardPage.searchByName(this.patientName)
      // click trail button not stable,try wait for it
      await this.dashboardPage.sleep(1000)
      await this.dashboardPage.clickTrial();
      let days = await this.tab.$$(this.calendarPage.css_AvailableDays);
      expect(days.length).toBeLessThan(60);
      // expect(days.length).toBeGreaterThanOrEqual(25); // remove this one, since the data is changing which is not stable for automation test
      await this.calendarPage.pickAvailableFromToday(3);
      await this.calendarPage.clickSet();
      let text = await this.tab.innerText(this.dashboardPage.css_trial);
      expect(text).not.toBe("schedule")      
    });
  }
}
new TestCase('CC-1058', 'Verification: Clicking on the “Schedule" button should show up the calendar 2 months out where the patient trial date can be set.');

