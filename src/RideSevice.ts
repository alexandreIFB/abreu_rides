import pgPromise from "pg-promise";
import crypto from 'crypto';

const DEFAULT_FARE = 2;


export default class RideService {
  async callRide(input: CallRideInput) {
    const connection = pgPromise()("postgres://postgres:workdb123@localhost:5432/ride_ddd");

    const rideId = crypto.randomUUID();
    const initialStatus = "requested";
    const distance = 10;
    const callDate = new Date();
    try {

      await connection.query("insert into cccat13.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
      [rideId, input.passengerId, input.driverId, initialStatus, DEFAULT_FARE, distance, input.from.lat, input.from.long,
      input.to.lat, input.to.long, callDate ]);
    } catch(e) {
      console.log(e)
    } finally {
			await connection.$pool.end();
    }

    return {
      rideId,
    }
  }


  acceptRide(input: any) {
  }

  async getRide(rideId: string) {
    const connection = pgPromise()("postgres://postgres:workdb123@localhost:5432/ride_ddd");
		const [ride] = await connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return ride;
  }
}

type CallRideInput = {
  passengerId: string,
  driverId: string,
  from: {
    lat: number,
    long: number
  },
  to: {
    lat: number,
    long: number
  }
}