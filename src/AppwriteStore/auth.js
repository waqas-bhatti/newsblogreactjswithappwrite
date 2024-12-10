import {
  Client,
  Account,
  ID,
  Databases,
  Teams,
  OAuthProvider,
  Query,
} from "appwrite";
import config from "../config/config";

export class AuthService {
  client = new Client();
  account;
  teams;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID);
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.teams = new Teams(this.client); // Initialize Teams API
  }

  isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  async createAccount({ email, password }) {
    if (!this.isValidEmail(email)) {
      throw new Error(`Invalid Format: ${email}`);
    }

    try {
      const userId = ID.unique();
      const userAccount = await this.account.create(userId, email, password);
      return userAccount;
    } catch (error) {
      console.log("Failed to create Account", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(`Failed to login. Verify your email: ${error}`);
      }
      throw error;
    }
  }

  async googleAuth() {
    try {
      this.account.createOAuth2Session(
        OAuthProvider.Google,
        "http://localhost:5173"
      );
    } catch (error) {
      throw new Error("Can't be Google Auth Login", error);
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get(); // Fetch the current user
      // console.log("Fetched user:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error.message);
      throw new Error("Failed to fetch user.");
    }
  }

  /**
   * Fetch user's team memberships and check if they're an admin.
   */
  async getUserTeams() {
    try {
      // Step 1: Fetch all teams the user belongs to
      const memberships = await this.teams.list();

      // Step 2: Check memberships for roles in the admin team
      let isAdmin = false;

      for (const team of memberships.teams) {
        // Fetch memberships for the specific team
        const membership = await this.teams.listMemberships(team.$id);
        // console.log(`Memberships for team ${team.$id}:`, membership);

        // Check if the user is an admin in the admin team
        if (
          team.$id === config.appwriteTeamId &&
          membership.memberships.some((member) =>
            member.roles.includes("admin")
          )
        ) {
          isAdmin = true;
          break;
        }
      }

      // console.log("Is user admin:", isAdmin);
      return isAdmin;
    } catch (error) {
      console.error("Failed to fetch user teams or roles:", error.message);
      throw error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }
}

const authservice = new AuthService();
export default authservice;
