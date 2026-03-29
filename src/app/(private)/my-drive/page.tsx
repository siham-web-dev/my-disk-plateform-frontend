import DriveContainer from "@/components/custom/containers/DriveContainer";

const page = async ({ searchParams }: { searchParams: Promise<{ folderId?: string }> }) => {
  const { folderId } = await searchParams;
  return (
    <DriveContainer
      needsToToggle={true}
      currentFolder="My Drive"
      folderId={folderId}
    ></DriveContainer>
  );
};

export default page;
