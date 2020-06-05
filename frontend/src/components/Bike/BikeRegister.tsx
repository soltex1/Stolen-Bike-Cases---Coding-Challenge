import React, { useState } from "react";

import { Bike } from "../../types/Bike";
import { BikeService } from "../../services/Bike";

const BikeRegister: React.FC<any> = (props) => {
  const initialBikeState: Bike = {
    name: "",
    model: "",
  };

  const [bike, setBike] = useState(initialBikeState);
  const { service, registerBike } = BikeService();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await props.registerBike(bike);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setBike((previousBike) => ({
      ...previousBike,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={bike.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="model"
          value={bike.model}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {service.status === "loading" && <div>Sending...</div>}
      {service.status === "loaded" && <div>Bike submitted</div>}
      {service.status === "error" && <div>Error: {service.error} </div>}
    </div>
  );
};

export default BikeRegister;
