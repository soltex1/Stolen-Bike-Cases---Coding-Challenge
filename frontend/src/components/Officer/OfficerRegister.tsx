import React, { useState } from "react";
import { Officer } from "../../types/Officer";

const OfficerRegister: React.FC<any> = (props) => {
  const initialOfficerState: Officer = {
    name: "",
  };

  const [bike, setBike] = useState(initialOfficerState);

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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default OfficerRegister;
