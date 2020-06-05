import { useState } from "react";
import { Service } from "../types/Service";
import { Bike } from "../types/Bike";

export const OfficerService = () => {
  const [service, setService] = useState<Service<Bike[]>>({
    status: "init",
  });

  const listOfficers = (): Promise<any> => {
    setService({ status: "loading" });

    return new Promise((resolve, reject) => {
      fetch("http://localhost:8888/api/officers")
        .then((response) => response.json())
        .then((response) => {
          if (response.statusCode >= 400 && response.statusCode < 600) {
            throw response.message || "Bad response from server";
          } else {
            setService({ status: "loaded", payload: response });
            resolve(response);
          }
        })
        .catch((error) => {
          setService({ status: "error", error });
          reject(error);
        });
    });
  };

  const registerOfficer = (bike: Bike): Promise<any> => {
    setService((oldService) => ({ ...oldService, status: "loading" }));

    return new Promise((resolve, reject) => {
      fetch("http://localhost:8888/api/officers", {
        method: "PUT",
        body: JSON.stringify(bike),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.statusCode >= 400 && response.statusCode < 600) {
            throw response.message || "Bad response from server";
          } else {
            setService((oldResult: Service<Bike[]>) => {
              const newData =
                oldResult && oldResult.payload
                  ? [...oldResult.payload, response]
                  : [];

              return {
                status: "loaded",
                payload: newData,
              };
            });
            resolve(response);
          }
        })
        .catch((error) => {
          setService((oldService) => ({
            ...oldService,
            status: "error",
            error,
          }));
          reject(error);
        });
    });
  };

  const destroyOfficer = (bikeId: string | undefined): Promise<any> => {
    setService((oldService) => ({ ...oldService, status: "loading" }));

    return new Promise((resolve, reject) => {
      fetch(`http://localhost:8888/api/officers/${bikeId}`, {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.statusCode >= 400 && response.statusCode < 600) {
            throw response.message || "Bad response from server";
          } else {
            setService((oldResult: Service<Bike[]>) => {
              const newData =
                oldResult && oldResult.payload
                  ? oldResult.payload.filter((old: Bike) => old.id !== bikeId)
                  : response;
              return {
                status: "loaded",
                payload: newData,
              };
            });

            resolve(response);
          }
        })
        .catch((error) => {
          setService((oldService) => ({
            ...oldService,
            status: "error",
            error,
          }));
          reject(error);
        });
    });
  };

  return { service, listOfficers, registerOfficer, destroyOfficer };
};
