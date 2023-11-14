import pgPromise from "pg-promise";

export default class AccountDAO {

  constructor(){

  }

  async save(input: any){
		const connection = pgPromise()("postgres://postgres:workdb123@localhost:5432/ride_ddd");
    await connection.query("insert into cccat13.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [input.accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.date, false, input.verificationCode]);
		await connection.$pool.end();
  }

  async getByEmail(accountEmail: string) {
		const connection = pgPromise()("postgres://postgres:workdb123@localhost:5432/ride_ddd");
    const [account] = await connection.query("select * from cccat13.account where email = $1", [accountEmail]);
		await connection.$pool.end();
    return account;
  }

  async getById(accountId: string) {
		const connection = pgPromise()("postgres://postgres:workdb123@localhost:5432/ride_ddd");
    const [account] = await connection.query("select * from cccat13.account where account_id = $1", [accountId]);
		await connection.$pool.end();
    return account;
  }
}