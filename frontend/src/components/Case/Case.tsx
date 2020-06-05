import React, { useEffect } from "react";

import { CasesService } from "../../services/Case";
import CaseItem from "./CaseItem";

const Case: React.FC = () => {
  const { service, listCases, resolveCase } = CasesService();

  useEffect(() => {
    listCases();
  }, []);

  return (
    <div>
      {service.status === "loading" && <div>Loading...</div>}
      {service.payload && (
        <div>
          <h1>CASES</h1>
          <table>
            <tbody>
              <tr>
                <th>Id</th>
                <th>Bike Name</th>
                <th>Officer Name</th>
                <th>Actions</th>
              </tr>
              {service.payload.map((caseService) => (
                <CaseItem
                  key={caseService.id}
                  resolveCase={resolveCase}
                  caseService={caseService}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {service.status === "error" && <div>Error: {service.error} </div>}
    </div>
  );
};

export default Case;
