import ProfileCard from "@/features/profile/components/ProfileCard";

const ProfilePage = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4 pb-24">
      <div className="max-w-md w-full">
        <ProfileCard />
      </div>
    </div>
  );
};

export default ProfilePage;
