export class UserData {

  private userName: string;
  private password: string;

  constructor(userName: string, password: string) {
      this.userName = userName;
      this.password = password;
  }

  getUserName(): string {
      return this.userName;
  }

  getPassword(): string {
      return this.password;
  }

}
