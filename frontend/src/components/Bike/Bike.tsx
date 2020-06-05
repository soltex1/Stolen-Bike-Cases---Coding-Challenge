import React, { useEffect } from "react";

import BikeRegister from "./BikeRegister";
import { BikeService } from "../../services/Bike";
import { Bike as BikeType } from "../../types/Bike";

const Bike: React.FC = () => {
  const { service, listBikes, registerBike, destroyBike } = BikeService();

  useEffect(() => {
    listBikes();
  }, []);

  return (
    <div>
      {service.status === "loading" && <div>Loading...</div>}
      {service.payload && (
        <div>
          <h1>BIKES</h1>
          <ul>
            {service.payload.map((bike: BikeType) => (
              <li key={bike.id}>
                {bike.name}{" "}
                <button onClick={() => destroyBike(bike.id)}>x</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {service.status === "error" && <div>Error: {service.error} </div>}
      <BikeRegister registerBike={registerBike} />
    </div>
  );
};

export default Bike;
