import DriveContainer from "@/components/custom/containers/DriveContainer";

const page = () => {
  return (
    <DriveContainer
      needsToToggle={true}
      currentFolder="My Drive"
    ></DriveContainer>
  );
};

export default page;
