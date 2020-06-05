import React, { useEffect } from "react";

import OfficerRegister from "./OfficerRegister";
import { OfficerService } from "../../services/Officer";
import { Officer as OfficerType } from "../../types/Officer";

const Bike: React.FC = () => {
  const {
    service,
    listOfficers,
    registerOfficer,
    destroyOfficer,
  } = OfficerService();

  useEffect(() => {
    listOfficers();
  }, []);

  return (
    <div>
      {service.status === "loading" && <div>Loading...</div>}
      {service.payload && (
        <div>
          <h1>BIKES</h1>
          <ul>
            {service.payload.map((officer: OfficerType) => (
              <li key={officer.id}>
                {officer.name}{" "}
                <button onClick={() => destroyOfficer(officer.id)}>x</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {service.status === "error" && <div>Error: {service.error} </div>}
      <OfficerRegister registerBike={registerOfficer} />
    </div>
  );
};

export default Bike;
