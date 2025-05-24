import { FileGrid } from "./files/GridView";
import { FileList } from "./files/ListView";

const ToggleFileView = ({ viewMode }: { viewMode: "grid" | "list" }) => {
  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4">
      {viewMode === "grid" ? <FileGrid /> : <FileList />}
    </main>
  );
};

export default ToggleFileView;
