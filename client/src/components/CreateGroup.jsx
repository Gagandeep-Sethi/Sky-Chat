import React, { useState } from "react";
import UserSelection from "./UserSelection";
import GroupCreation from "./GroupCreation";

const CreateGroup = () => {
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleProceed = (users) => {
    setSelectedUsers(users);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="h-screen bg-neutral-900">
      {step === 1 && <UserSelection onProceed={handleProceed} />}
      {step === 2 && (
        <GroupCreation selectedUsers={selectedUsers} onBack={handleBack} />
      )}
    </div>
  );
};

export default CreateGroup;
