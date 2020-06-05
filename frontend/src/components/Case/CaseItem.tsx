import React from "react";

import { Case as CaseType } from "../../types/Case";

type CaseItemProps = {
  caseService: CaseType;
  resolveCase: any;
};

const CaseItem: React.FC<CaseItemProps> = ({ caseService, resolveCase }) => {
  const shouldRenderButtonResolve =
    caseService.state === "PROCESSING" && caseService.officer_id;

  return (
    <tr>
      <td>{caseService.id}</td>
      <td>{caseService.bike ? caseService.bike.name : "N/A"}</td>
      <td>{caseService.officer ? caseService.officer.name : "N/A"}</td>
      <td>{caseService.state}</td>
      {shouldRenderButtonResolve && (
        <td>
          <button
            onClick={() => resolveCase(caseService.officer_id, caseService.id)}
          >
            RESOLVE
          </button>
        </td>
      )}
    </tr>
  );
};

export default CaseItem;
