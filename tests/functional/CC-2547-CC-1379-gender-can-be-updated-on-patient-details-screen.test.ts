import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1379
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
      // go to patient detail
      this.fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName)
      await this.dashboardPage.searchByName(this.fullname);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('gender can be added or updated', async () => {
      this.gender = await this.patientDetailPage.getSelectedGender();
      if (this.gender == "female"){
        await this.patientDetailPage.setGenderMale();
        await this.patientDetailPage.clickSaveChange();
      }else{
        await this.patientDetailPage.setGenderFemale();
        await this.patientDetailPage.clickSaveChange();

      }
      await this.patientDetailPage.waitForToast("Patient updated successfully");
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.searchByName(this.fullname)
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe()
      if (this.gender == "female"){
        expect(await this.patientDetailPage.getSelectedGender()).toBe("male")
      }else{
        expect(await this.patientDetailPage.getSelectedGender()).toBe("female")
      }
    });
  }
}
new TestCase('CC-1379', 'Verification: Gender (male/female or other) can be added or updated on Patient Details screen');

