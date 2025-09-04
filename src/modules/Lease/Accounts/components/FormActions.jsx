import React from "react";
import { Button } from "../../../../shared/components/ui/Button";

const FormActions = ({ account_id, submitting, navigate }) => {
  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/accounts")}
      >
        Cancel
      </Button>
      <Button type="submit" variant="primary" loading={submitting}>
        {account_id ? "Update Lease Account" : "Create Lease Account"}
      </Button>
    </div>
  );
};

export default FormActions;
