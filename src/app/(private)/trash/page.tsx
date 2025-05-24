import DriveContainer from "@/components/custom/containers/DriveContainer";
import { TrashView } from "@/components/custom/views/TrashView";

const page = () => {
  return (
    <DriveContainer needsToToggle={false} currentFolder="Trash">
      <TrashView />
    </DriveContainer>
  );
};

export default page;
