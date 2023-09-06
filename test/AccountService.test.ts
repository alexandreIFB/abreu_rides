import { faker } from "@faker-js/faker";
import AccountService from "../src/AccountService";


function randomName(){
	return faker.person.fullName()
}

function randomEmail(){
	return faker.internet.email()
}




test("Deve criar um passageiro", async function () {
	const input = {
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	const output = await accountService.signup(input);
	const account = await accountService.getAccount(output.accountId);
	console.log(account);
	expect(account.account_id).toBeDefined();
	expect(account.name).toBe(input.name);
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
});

test("Não deve criar uma conta com cpf inválido", async function () {
	const input = {
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705500",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta com nome inválido", async function () {
	const input = {
		name: "John",
		email: randomEmail(),
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta com email inválido", async function () {
	const input = {
		name: randomName(),
		email: `john.doe@`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta com email existente", async function () {
	const input = {
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await accountService.signup(input)
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const accountService = new AccountService();
	const output = await accountService.signup(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
		carPlate: "AAA999",
		isDriver: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid plate"));
});

test("Não deve criar uma conta na qual o tipo não esteja definido", async function () {
	const input = {
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Account type is not defined"));
});


test("Não deve salvar a placa caso seja um passageiro ", async function () {
	const input = {
		name: randomName(),
		email: randomEmail(),
		cpf: "95818705552",
		carPlate: "AAA9999",
		isPassenger: true,
	}
	const accountService = new AccountService();
	const output = await accountService.signup(input);
	const account = await accountService.getAccount(output.accountId);
	expect(account.car_plate).toBeNull();
});