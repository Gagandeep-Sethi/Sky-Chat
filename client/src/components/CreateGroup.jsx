import React, { useState } from "react";
import UserSelection from "./UserSelection";
import GroupCreation from "./GroupCreation";
import { useSelector } from "react-redux";

const CreateGroup = () => {
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { isDarkMode } = useSelector((state) => state.theme);

  const handleProceed = (users) => {
    setSelectedUsers(users);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className={`h-screen ${isDarkMode ? "bg-darkBg  " : "bg-lightBg"}`}>
      {step === 1 && <UserSelection onProceed={handleProceed} />}
      {step === 2 && (
        <GroupCreation selectedUsers={selectedUsers} onBack={handleBack} />
      )}
    </div>
  );
};

export default CreateGroup;
