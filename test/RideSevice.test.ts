import AccountService from "../src/AccountService";
import RideService from "../src/RideSevice";

let passengerId: string;
let driverId: string;

beforeAll(async () => {
  const inputPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
  const inputDriver = {
		name: "John Driver",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const accountService = new AccountService();
	passengerId = (await accountService.signup(inputPassenger)).accountId;
	driverId = (await accountService.signup(inputDriver)).accountId;
})


test("Deve solicitar uma corrida", async function () {
  const input = {
    passengerId,
    driverId,
    from: {
      lat: 12401240,
      long: 2421412
    },
    to: {
      lat: 12401240,
      long: 2421412
    }
  }

	const rideService = new RideService();
  const output = await rideService.callRide(input);
	const ride = await rideService.getRide(output.rideId);
	expect(ride.ride_id).toBeDefined();
	expect(ride.passengerId).toBe(input.passengerId);
	expect(ride.driverId).toBe(input.driverId);
	expect(ride.fare).toBe(2);
	expect(ride.from_lat).toBe(input.from.lat);
	expect(ride.from_long).toBe(input.from.long);
  expect(ride.to_lat).toBe(input.to.lat);
	expect(ride.to_long).toBe(input.to.long);
	expect(ride.status).toBe("requested");
	expect(ride.date).toBeDefined()
	expect(ride.date).toBeInstanceOf(Date);
});