import crypto from "crypto";
import pgp from "pg-promise";
import CpfValidator from "./CpfValidator";
import AccountDAO from "./AccountDAO";

export default class AccountService {
	cpfValidator: CpfValidator;
	accountDAO: AccountDAO;

	constructor () {
		this.cpfValidator = new CpfValidator();
		this.accountDAO = new AccountDAO();
	}

	private async sendEmail (email: string, subject: string, message: string) {
		console.log(email, subject, message);
	}

	async signup (input: SignUpInput) {
    if(!input.isDriver && !input.isPassenger) throw new Error("Account type is not defined");
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    if (!this.cpfValidator.validate(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !input.carPlate?.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid plate");
    if (input.isPassenger) {
      input.carPlate = undefined;
    }

		const existingAccount = await this.accountDAO.getByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");
		const accountId = crypto.randomUUID();
		const verificationCode = crypto.randomUUID();
		const date = new Date();
		await this.accountDAO.save({
			...input,
			accountId,
			verificationCode,
			date
		});
		await this.sendEmail(input.email, "Verification", `Please verify your code at first login ${verificationCode}`);
		return {
			accountId
		}
	}

	async getAccount (accountId: string) {
		return await this.accountDAO.getById(accountId);
	}
}

type SignUpInput = {
  name: string,
  email: string,
  cpf: string,
  carPlate?: string,
  isPassenger?: boolean,
  isDriver?: boolean,
}