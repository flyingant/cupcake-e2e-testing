import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1381
class TestCase extends MockableTestCase {
  fullname: string;
  gender: string;
  now = Date.parse(new Date().toString())

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Go to patient contact details page', async () => {
      // go to patient detail
      this.fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName)
      await this.dashboardPage.searchByName(this.fullname);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('Add data for some fields on the page', async () => {
      await this.patientDetailPage.setNotes(`added by automation CC-1381 at ${this.now}`);
      this.gender = await this.patientDetailPage.getSelectedGender();
      if (this.gender == "female"){
        await this.patientDetailPage.setGenderMale();
      }else{
        await this.patientDetailPage.setGenderFemale();

      }
    });
    this.addTestStep('Click on "Save" button and verify if entered data will be saved', async () => {
      await this.patientDetailPage.clickSaveChange();
      await this.patientDetailPage.waitForToast("Patient updated successfully");
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.searchByName(this.fullname)
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe()
      expect(await this.patientDetailPage.getNotes()).toBe(`added by automation CC-1381 at ${this.now}`)
      if (this.gender == "female"){
        expect(await this.patientDetailPage.getSelectedGender()).toBe("male")
      }else{
        expect(await this.patientDetailPage.getSelectedGender()).toBe("female")
      }
    });
  }
}
new TestCase('CC-1381', 'Verification: For saving all data added/edited on Patient Detail page need to hit SAVE button at top');

