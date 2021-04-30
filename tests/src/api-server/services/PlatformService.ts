import _ from 'lodash'
import { ObjectData } from '../lib/types'
import { PlatformError } from "../lib/errors"
import { AuthType, PlatformClient } from '../lib/PlatformClient'
import AppConf from '../../AppConf'

export interface PlatformAuth {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  scope: string
}

export interface PlatformUser {
  id: string
  username: string
  password: string | null
  authorities: Array<{ authority: string }>
  accountNonExpired: boolean
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  enabled: boolean
  firstName: string
  lastName: string
  salesforceId: string | null
  accountType: string
  accountExtId: string
}

export interface PlatformExtUser {
  id: string
  email: string
  hasPassword: boolean
}

export interface PlatformUserCredentials {
  id?: string
  email: string
  password: string
}

export interface PlatformSalesRep {
  id: string
  salesforceId: string
  firstName: string
  lastName: string
  email: string
  active: boolean
}

export interface PlatformPhysician {
  id: string
  email: string
  firstName?: string
  lastName?: string
  salesforceId: string
}

export interface PlatformPatient {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  gender: string
  email: string
  dob: string
  zip?: string
  stage?: number
  trialStartDateLocal?: string,
  trialEndDateLocal?: string,
  salesforceId: string
  territoryId: string
  physicianPlatformId: string
}

export class PlatformService {
  protected platformClient: PlatformClient
  protected sysPlatformClient: PlatformClient

  constructor(token?: string) {
    this.platformClient = new PlatformClient(token)
  }

  /**
   * --------------------------------------------------------------------------
   * Get Platform auth object from email and password
   * --------------------------------------------------------------------------
   * @param {string} email
   * @param {string} password
   * @returns {Promise<PlatformAuth>}
   */
  public async getAuthToken(email: string, password: string): Promise<PlatformAuth> {
    const authServiceUrl = AppConf.platformURL() + "/auth-service"
    const platformAuth = await this.platformClient.form({
      url: `${authServiceUrl}/oauth/token`,
      auth: AuthType.Basic,
      payload: {
        grant_type: 'password',
        username: `Email:${email}`,
        password,
      },
    })

    return {
      accessToken: platformAuth.access_token,
      refreshToken: platformAuth.refresh_token,
      tokenType: platformAuth.token_type,
      expiresIn: platformAuth.expires_in,
      scope: platformAuth.scope,
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Get Platform auth by refreshToken
   * --------------------------------------------------------------------------
   * @param {string} refreshToken
   * @returns {Promise<PlatformAuth>}
   */
  public async getRefreshToken(refreshToken: string): Promise<PlatformAuth> {
    const authServiceUrl = AppConf.platformURL() + "/auth-service"
    const platformAuth = await this.platformClient.form({
      url: `${authServiceUrl}/oauth/token`,
      auth: AuthType.Basic,
      payload: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    })

    return {
      accessToken: platformAuth.access_token,
      refreshToken: platformAuth.refresh_token,
      tokenType: platformAuth.token_type,
      expiresIn: platformAuth.expires_in,
      scope: platformAuth.scope,
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Get Platform user profile data
   * --------------------------------------------------------------------------
   * @returns {Promise<PlatformUser>}
   */
  public async getPlatformUser(): Promise<PlatformUser> {
    const authServiceUrl = AppConf.platformURL() + "/auth-service"
    const { principal } = await this.platformClient.get({
      url: `${authServiceUrl}/me`,
      auth: AuthType.Token,
    })

    return principal
  }

  /**
   * --------------------------------------------------------------------------
   * Get PlatformExtUser user by email
   * --------------------------------------------------------------------------
   * @param {string} email
   * @returns {Promise<PlatformExtUser | null>}
   */
  public async getPlatformUserByEmail(email: string): Promise<PlatformExtUser | null> {
    const result = await this.platformClient.get({
      url: AppConf.platformURL() + "/user-service/account-by-extid-and-type",
      payload: {
        extId: email,
        type: 'Email',
      },
    })
    if (Object.keys(result).length > 0) {
      return {
        id: result.userId,
        email,
        hasPassword: !!result.token,
      }
    }

    return null
  }

  /**
   * --------------------------------------------------------------------------
   * Register new platform user with email
   * --------------------------------------------------------------------------
   * @param {string} email
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} password
   * @returns {Promise<PlatformUserCredentials>}
   */
  public async registerPlatformEmailUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<PlatformUserCredentials> {
    const result = await this.platformClient.post({
      url: AppConf.platformURL() + "/user-service/register/email",
      payload: {
        email: email,
        firstName,
        lastName,
        password,
      },
    })
    return {
      id: result.id,
      email,
      password,
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Create new Platorm user with email
   * --------------------------------------------------------------------------
   * @param {string} userId
   * @param {string} email
   * @param {string} password
   * @returns {Promise<PlatformUserCredentials>}
   */
  public async createPlatformEmailUser(
    userId: string,
    email: string,
    password: string,
  ): Promise<PlatformUserCredentials> {
    const sysPlatformClient = await this.getSysPlatformClient()
    await sysPlatformClient.post({
      url: AppConf.platformURL() + "/user-service/user/create-account",
      auth: AuthType.Token,
      payload: {
        userId,
        type: 'Email',
        extId: email,
        tempPassword: password,
        tempPasswordExpiredAt: 604800, // 7 days
      },
    })

    return {
      id: userId,
      email,
      password,
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Change platform user password
   * --------------------------------------------------------------------------
   * @param {string} email
   * @param {string} oldPassword
   * @param {string} password
   * @returns {Promise<void>}
   */
  public async changePlatformUserPassword(email: string, oldPassword: string, password: string): Promise<void> {
    await this.platformClient.post({
      url: AppConf.platformURL() + "/user-service/users/me/change-password",
      auth: AuthType.Token,
      payload: {
        login: `Email:${email}`,
        oldPassword,
        password,
      },
    })
  }

  public async setPlatformUserTempPassword(email: string, password: string): Promise<PlatformUserCredentials> {
    const sysPlatformClient = await this.getSysPlatformClient()
    await sysPlatformClient.post({
      url: AppConf.platformURL() + "/user-service/accounts/reset/by-user",
      auth: AuthType.Token,
      payload: {
        type: 'Email',
        login: email,
        tempPassword: password,
        expiredIn: 604800, // 7 days
      },
    })

    return {
      email,
      password,
    }
  }

  public async getPlatformSalesRep(email: string): Promise<PlatformSalesRep | null> {
    const sysPlatformClient = await this.getSysPlatformClient()
    const result = await sysPlatformClient.form({
      url: AppConf.platformURL() + "/user-service/salesforce/import/salesrep",
      auth: AuthType.Token,
      payload: {
        email,
      },
    })

    if (Object.keys(result).length > 0) {
      return result as PlatformSalesRep
    }

    return null
  }

  public async getPlatformSalesRepById(salesrepId: string): Promise<PlatformSalesRep | null> {
    const sysPlatformClient = await this.getSysPlatformClient()

    const result = await sysPlatformClient.get({
      url: AppConf.platformURL() + "/user-service/sales-rep/by-id",
      auth: AuthType.Token,
      payload: {
        salesrepId
      },
    })

    if (Object.keys(result).length > 0) {
      return result as PlatformSalesRep
    }

    return null
  }

  public async getPlatformPhysician(salesforceId: string): Promise<PlatformPhysician | null> {
    const sysPlatformClient = await this.getSysPlatformClient()

    const result = await sysPlatformClient.get({
      url: AppConf.platformURL() + "/user-service/physicians/by-salesforce-id",
      auth: AuthType.Token,
      payload: {
        salesforceId,
      },
    })

    if (Object.keys(result).length > 0) {
      let firstName = null
      let lastName = null
      if (result.fullName) {
        const match = String(result.fullName).match(/(Dr\.?\s?)?(?<firstName>.*)\s(?<lastName>.*)/)
        if (match) {
          firstName = match.groups.firstName
          lastName = match.groups.lastName
        }
      }
      return {
        id: result.id,
        email: result.email,
        salesforceId,
        firstName,
        lastName,
      }
    }

    return null
  }

  public async getPlatformPhysicianByID(physicianId: string): Promise<PlatformPhysician | null> {
    const sysPlatformClient = await this.getSysPlatformClient()

    const result = await sysPlatformClient.get({
      url: AppConf.platformURL() + "/user-service/physicians/by-id",
      auth: AuthType.Token,
      payload: {
        physicianId,
      },
    })

    if (Object.keys(result).length > 0) {
      let firstName = null
      let lastName = null
      if (result.fullName) {
        const match = String(result.fullName).match(/(Dr\.?\s?)?(?<firstName>.*)\s(?<lastName>.*)/)
        if (match) {
          firstName = match.groups.firstName
          lastName = match.groups.lastName
        }
      }
      return {
        id: result.id,
        email: result.email,
        salesforceId: result.salesforceId,
        firstName,
        lastName,
      }
    }

    return null
  }

  public async searchPlatformPhysicianByIDs(ids: string[]): Promise<ObjectData> {
    const sysPlatformClient = await this.getSysPlatformClient()

    const physicians = await sysPlatformClient.post({
      url: AppConf.platformURL() + "/user-service/physicians/search-by-ids",
      auth: AuthType.Token,
      payload: ids
    })

    return physicians;
  }

  public searchPlatformSalesRepByIDs(ids: string[]): Promise<PlatformSalesRep[]> {
    return Promise.all(
      ids.map(id => this.getPlatformSalesRepById(id))
    )
  }

  public async importPlatformSalesforceData({ salesforceId: physicianSfid, territorySfId }): Promise<void> {
    console.log('Start import platform salesforce data:', { physicianSfid, territorySfId })
    const sysPlatformClient = await this.getSysPlatformClient()

    try {
      await Promise.all([
        sysPlatformClient.form({
          url: AppConf.platformURL() + "/user-service/salesforce/import/opportunities/by-physician",
          auth: AuthType.Token,
          payload: {
            physicianSfid
          }
        }),

        sysPlatformClient.form({
          url: AppConf.platformURL() + "/user-service/salesforce/import/leads/by-physician",
          auth: AuthType.Token,
          payload: {
            physicianSfid
          }
        }),

        new Promise((resolve, reject) => {
          if (!territorySfId) {
            return resolve()
          }
          sysPlatformClient.form({
            url: AppConf.platformURL() + "/user-service/salesforce/import/cases/by-territory",
            auth: AuthType.Token,
            payload: {
              territorySfid: territorySfId
            }
          }).then(resolve).catch(reject)
        })
      ])
    } catch (error) {
      console.log(`Failed to import from Salesforce:`, { 
        physicianSfid, 
        territorySfId,
        errorBody: error.toString()
      })
      throw new PlatformError(error.toString())
    }
  }

  public async getPlatformPatientByID(patientId: string): Promise<ObjectData> {
    const sysPlatformClient = await this.getSysPlatformClient()

    const patient = await sysPlatformClient.get({
      url: AppConf.platformURL() + "/user-service/patients/by-id",
      auth: AuthType.Token,
      payload: {
        patientId
      }
    })

    return patient;
  }

  public async getPlatformPatientsBySalesforceIds(salesforceIds: string[]): Promise<ObjectData> {
    const sysPlatformClient = await this.getSysPlatformClient()
    return sysPlatformClient.post({
      url: AppConf.platformURL() + "/user-service/patients/search",
      auth: AuthType.Token,
      payload: {
        salesforceIds
      }
    })
  }

  /**
   * --------------------------------------------------------------------------
   * Get leads patient
   * --------------------------------------------------------------------------
   * @param {string} physicianId
   * @param {array} status
   * @returns {Promise<void>}
   */
  public async getLeadsPatient(physicianId?: string[]): Promise<ObjectData> {
    const sysPlatformClient = await this.getSysPlatformClient()
    const leadPatients = await sysPlatformClient.get({
      url: AppConf.platformURL() + "/user-service/leads/by-trial-physician-or-patient-physician", 
      auth: AuthType.Token,
      payload: {
        physicianId,
        status: ['New', 'Contacted', 'Educated', 'Disqualified', 'Converted'],
        eagerPatients: true
      }
    })

    return leadPatients;
  }

  /**
   * --------------------------------------------------------------------------
   * Get opportunities patient
   * --------------------------------------------------------------------------
   * @param {string} physicianId
   * @returns {Promise<void>}
   */
  public async getOpportunityPatients(physicianId?: string[]): Promise<ObjectData> {
    const sysPlatformClient = await this.getSysPlatformClient()

    const opportunityPatients = await sysPlatformClient.get({
      url: AppConf.platformURL() + "/user-service/opportunities/by-physician",
      auth: AuthType.Token,
      payload: {
        physicianId,
        eagerPatients: true
      },
    })
    return opportunityPatients;
  }

  /**
   * --------------------------------------------------------------------------
   * Get case patients
   * --------------------------------------------------------------------------
   * @param {string} physicianId
   * @returns {Promise<void>}
   */
  public async getCasePatients(physicianId?: string[]): Promise<ObjectData[]> {
    const sysPlatformClient = await this.getSysPlatformClient()

    const casePatients = await sysPlatformClient.get({
      url: AppConf.platformURL() + "/user-service/cases/by-patient-physician",
      auth: AuthType.Token,
      payload: {
        physicianId,
        eagerPatients: true
      },
    })

    const mappedCasePatients = this.filterPatientsByCreatedDate(casePatients)
      .map(item => ({
        platformId: item.patientId,
        preAuthSfId: item.salesforceId,
        preAuthState: item.status,
        preAuthDate: item.closedDate ? item.closedDate : item.createdDate,
        preAuthSubStatus: item.subStatus,
        preAuthOffLabel: item.offLabel,
        _added: item.createdDate
      }));

    return mappedCasePatients;
  }

  public static async getSystemAuthToken(): Promise<PlatformAuth> {
    const authServiceUrl = AppConf.platformURL() + "/auth-service"
    const platformAuth: ObjectData = await new PlatformClient(null, AppConf.ccSystemClientId(), AppConf.ccSystemClientSecret()).form({
      url: AppConf.platformURL() + "/auth-service/oauth/token",
      auth: AuthType.Basic,
      payload: {
        grant_type: 'client_credentials',
      },
    })

    return {
      accessToken: platformAuth.access_token,
      refreshToken: platformAuth.refresh_token,
      tokenType: platformAuth.token_type,
      expiresIn: platformAuth.expires_in,
      scope: platformAuth.scope,
    }
  }

  protected async getSysPlatformClient(): Promise<PlatformClient> {
    if (!this.sysPlatformClient) {
      const result = await PlatformService.getSystemAuthToken()
      this.sysPlatformClient = new PlatformClient(result.accessToken);
    }
    return this.sysPlatformClient
  }

  private filterPatientsByCreatedDate(patient: ObjectData): ObjectData {
    return _(patient).groupBy('patientId')
      .map(group => {
        if (group.length > 1) {
          return group.reduce((acc, e) => {
            return new Date(acc.createdDate).valueOf() - new Date(e.createdDate).valueOf() > 0 ? acc : e
          })
        }
        return group[0];
      }).value();
  }
}
