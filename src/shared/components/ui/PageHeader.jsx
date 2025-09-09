import React, { memo } from "react";
import { Button } from "../../../shared/components/ui/Button";

const PageHeader = ({ title, buttonLabel = "Add", onClick }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <Button
        onClick={onClick}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default memo(PageHeader);
