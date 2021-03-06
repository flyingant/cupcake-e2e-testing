import TestComponent from './TestComponent';

export default class ResetPasswordPage extends TestComponent {
    async waitForMe() {
        await this.tab.waitForSelector("text=Reset password");
    }

    async setEmail (email: string) {
        await this.tab.fill('data-test-id=email >> css=input', email);
      }
      
    async submit() {
        await this.tab.click("img[alt=next]");
    }
    
    async setEmailAndThenSubmit(email: string) {
        await this.setEmail(email);
        await this.submit();
    }

    async fillEmail(email: string) {
      await this.setEmail(email);
  }

    async clickIRememberedIt(){
        await this.tab.click("Never mind, I remembered it!");
    }

    async clickNeverMindBtn(){
      await this.tab.click("[class*=styles_foterBtn]");
  }

    async waitForEmailValidateErrorMessage() {
      await this.waitForText("Please enter a valid email address");
    }
}