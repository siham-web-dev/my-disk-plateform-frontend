import DriveContainer from "@/components/custom/containers/DriveContainer";
import AccountView from "@/components/custom/views/AccountView";

const page = () => {
  return (
    <DriveContainer needsToToggle={false} currentFolder="accounts">
      <AccountView />
    </DriveContainer>
  );
};

export default page;
