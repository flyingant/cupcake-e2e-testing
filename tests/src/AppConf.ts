export default class AppConf {
    private static MOCK_REQ     = false;

    private static BASE_URL     = "https://stage.bsncloud.ai";
    private static BASE_API_URL = "https://api.stage.bsncloud.ai";

    private static USER_NAME    = 'shiiah1208+101@gmail.com';
    private static PASSWORD     = '@gaoshin.COM';

    private static USER_NAME_03    = 'shiiah1208+103@gmail.com';
    private static PASSWORD_03     = '@gaoshin.COM';

    private static PASSWORD_FOR_RESET = "@gaoshin.COM1";

    private static USER_NAME_FOR_POLICIES_ACCEPT   = 'shiiah1208+102@gmail.com';
    private static PASSWORD_FOR_POLICIES_ACCEPT   = '@gaoshin.COM';
    // private static USER_NAME    = 'shadabunique@rediffmail.com';
    // private static PASSWORD     = 'qq11@qq11';

    private static CC_CLIENT_ID         = 'cupcake';
    private static CC_CLIENT_SECRET     = 'Pp3YqtzZTrax4ckZ4cLZ';

    private static CC_SYSTEM_CLIENT_ID  = 'cupcake_system';
    private static CC_SYSTEM_CLIENT_SECRET     = 'cupcake_system_secret';

    private static CC_ADMIN_USERNAME    = "cupcake-admin@bsci.com";
    private static CC_ADMIN_PASSWORD    = "Cupcake@314";

    private static PLATFORM_URL         = "https://stage.bscdv.com";

    static ccAdminUserName() {
        return process.env.CC_ADMIN_USERNAME || AppConf.CC_ADMIN_USERNAME;
    }
    static ccAdminPassword() {
        return process.env.CC_ADMIN_PASSWORD || AppConf.CC_ADMIN_PASSWORD;
    }

    static ccClientId() : string {
        return process.env.CC_CLIENT_ID || AppConf.CC_CLIENT_ID;
    }
    static ccClientSecret() : string {
        return process.env.CC_CLIENT_SECRET || AppConf.CC_CLIENT_SECRET;
    }
    static ccSystemClientId() : string {
        return process.env.CC_SYSTEM_CLIENT_ID || AppConf.CC_SYSTEM_CLIENT_ID;
    }
    static ccSystemClientSecret() : string {
        return process.env.CC_SYSTEM_CLIENT_SECRET || AppConf.CC_SYSTEM_CLIENT_SECRET;
    }

    static shouldMockRequest() : boolean {
        return ("true" == process.env.MOCK_REQ) || AppConf.MOCK_REQ;
    }

    static baseUrl() : string {
        return process.env.BASE_URL || AppConf.BASE_URL;
    }

    static userName() : string {
        return process.env.USER_NAME || AppConf.USER_NAME
    }

    static password() : string {
        return process.env.PASSWORD || AppConf.PASSWORD
    }

    static passwordForReset() : string {
        return process.env.PASSWORD_FOR_RESET || AppConf.PASSWORD_FOR_RESET
    }

    static userNameForPoliciesAccept() : string {
        return process.env.USER_NAME_FOR_POLICIES_ACCEPT || AppConf.USER_NAME_FOR_POLICIES_ACCEPT
    }

    static passwordForPoliciesAccept() : string {
        return process.env.PASSWORD_FOR_POLICIES_ACCEPT || AppConf.PASSWORD_FOR_POLICIES_ACCEPT
    }

    static baseApiUrl() : string {
        return process.env.BASE_API_URL || AppConf.BASE_API_URL
    }
    static apiRelativePath(fullpath: string) : string {
        return fullpath.substring(AppConf.baseApiUrl().length);
    }

    static platformURL() : string {
        return process.env.PLATFORM_URL || AppConf.PLATFORM_URL;
    }

    // Get the username from a stable account where the data will barely be changed
    static getStableAccountUsername() {
      return this.USER_NAME_03;
    }
    // Get the password from a stable account where the data will barely be changed
    static getStableAccountPassword() {
      return this.PASSWORD_03;
    }
}