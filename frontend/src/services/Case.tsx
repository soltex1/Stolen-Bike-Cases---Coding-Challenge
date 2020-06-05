import { useState } from "react";
import { Service } from "../types/Service";
import { Case } from "../types/Case";

export const CasesService = () => {
  const [service, setService] = useState<Service<Case[]>>({
    status: "init",
  });

  const listCases = (): Promise<any> => {
    setService({ status: "loading" });

    return new Promise((resolve, reject) => {
      fetch("http://localhost:8888/api/cases")
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

  const resolveCase = (officerId: string, caseId: string): Promise<any> => {
    setService({ status: "loading" });

    return new Promise((resolve, reject) => {
      fetch(`http://localhost:8888/api/officers/${officerId}/case`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.statusCode >= 400 && response.statusCode < 600) {
            throw response.message || "Bad response from server";
          } else {
            if (service.payload) {
              const cases = service.payload;

              // find the index of case
              const caseIndex = cases.findIndex((obj) => obj.id === caseId);

              // Update the list of cases
              let updatedCases = [
                ...cases.slice(0, caseIndex),
                response[0],
                ...cases.slice(caseIndex + 1),
              ];

              // Check if the officer has a new case assigned
              if (typeof response[1] !== "undefined") {
                // Find the new case index
                const newCaseIndex = updatedCases.findIndex(
                  (obj) => obj.id === response[1].id
                );

                // Update the list of cases
                updatedCases = [
                  ...updatedCases.slice(0, newCaseIndex),
                  Object.assign(response[1], { officer: response[0].officer }),
                  ...updatedCases.slice(newCaseIndex + 1),
                ];
              }

              setService({ status: "loaded", payload: updatedCases });
            }

            resolve(response);
          }
        })
        .catch((error) => {
          setService({ status: "error", error });
          reject(error);
        });
    });
  };

  return { service, listCases, resolveCase };
};
