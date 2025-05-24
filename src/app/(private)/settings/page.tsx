import DriveContainer from "@/components/custom/containers/DriveContainer";
import SettingsView from "@/components/custom/views/SettingsView";

const page = () => {
  return (
    <DriveContainer needsToToggle={false} currentFolder="settings">
      <SettingsView />
    </DriveContainer>
  );
};

export default page;
