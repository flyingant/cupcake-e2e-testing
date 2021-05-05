import { Page } from 'playwright';
import AppConf from '../src/AppConf';
import TestComponent from './TestComponent';

export default class LoginPage extends TestComponent {
  username: string;
  password: string;
  
  css_username = "data-test-id=email >> css=input"
  css_password = "data-test-id=password >> css=input"
  css_submit = "data-test-id=next-button"

	constructor(tab: Page, username: string = AppConf.userName(), password: string = AppConf.password()) {
    super(tab)
    this.username = username;
    this.password = password;
	}

  async waitForMe() {
    await this.waitForText("Sign in")
  }

  async setEmail(username=this.username){
    let userName = await this.tab.waitForSelector(this.css_username, {state: 'visible', timeout: 60000})
    await userName.type(username, {delay:100})
  }

  async setPassword(password=this.password){
    // use type to input password like people,when input password,the submit button status will change
    let pwd = await this.tab.waitForSelector(this.css_password, {state: 'visible', timeout: 60000})
    await pwd.type(password, {delay:200})
  }

  async setEmailAndPassword (username=this.username, password=this.password) {
    await this.setEmail(username);
    await this.setPassword(password);
  }
  
  async submit() {
    await this.tab.click(this.css_submit);
  }

  async isSubmitButtonEnable(){
    return await this.tab.isEnabled(this.css_submit)
  }

  async setEmailPasswordAndThenSubmit(username=this.username, password=this.password){
    await this.setEmailAndPassword(username, password);
    await this.submit();
  }

  async waitForForgotPassword(){
    await this.tab.waitForSelector(':text("Forgot password")');
  }
  
  async clickForgotPassword(){
    await this.tab.click(':text("Forgot password")');
  }

  async isToastExist(){
    return this.isExist(".Toastify .Toastify__toast-body")
  }

  /**
   * fill the usname and the password quickly without delay
   * @param username 
   * @param password 
   */
  async fillEmailAndPasswordWithoutDelay(username=this.username, password=this.password) {
    let userName = await this.tab.waitForSelector(this.css_username, {state: 'visible', timeout: 60000})
    let pwd = await this.tab.waitForSelector(this.css_password, {state: 'visible', timeout: 60000})
    await pwd.type(password)
    await userName.type(username)
    await this.submit();
  }

}