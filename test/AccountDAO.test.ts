import { faker } from "@faker-js/faker";
import AccountDAO from "../src/AccountDAO";

function randomName(){
	return faker.person.fullName()
}

function randomEmail(){
	return faker.internet.email()
}


test("Deve criar um passageiro e obte-lo apartir de seu email para garantir que foi salvo.", async function () {
	const input = {
    accountId: faker.string.uuid(),
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
		isPassenger: true,
    date: new Date(),
    isVerified: false,
    verificationCode: faker.string.uuid()
	}

	const accountDAO = new AccountDAO();
	await accountDAO.save(input);

	const savedAccount = await accountDAO.getByEmail(input.email);
	expect(savedAccount.account_id).toBe(input.accountId);
	expect(savedAccount.name).toBe(input.name);
	expect(savedAccount.email).toBe(input.email);
	expect(savedAccount.cpf).toBe(input.cpf);
	expect(savedAccount.date).toBeDefined();
	expect(savedAccount.is_verified).toBe(input.isVerified);
	expect(savedAccount.verification_code).toBe(input.verificationCode);
	expect(savedAccount.is_passenger).toBeTruthy();
	expect(savedAccount.is_driver).toBeFalsy();
});


test("Deve criar um passageiro e obte-lo apartir de seu ID para garantir que foi salvo.", async function () {
	const input = {
    accountId: faker.string.uuid(),
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
		isPassenger: true,
    date: new Date(),
    isVerified: false,
    verificationCode: faker.string.uuid()
	}

	const accountDAO = new AccountDAO();
	await accountDAO.save(input);

	const savedAccount = await accountDAO.getById(input.accountId);
	expect(savedAccount.account_id).toBe(input.accountId);
	expect(savedAccount.email).toBe(input.email);
	expect(savedAccount.cpf).toBe(input.cpf);
});