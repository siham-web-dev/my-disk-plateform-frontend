import DriveContainer from "@/components/custom/containers/DriveContainer";

const page = ({ searchParams }: { searchParams: { folderId?: string } }) => {
  return (
    <DriveContainer
      needsToToggle={true}
      currentFolder="My Drive"
      folderId={searchParams.folderId}
    ></DriveContainer>
  );
};

export default page;
