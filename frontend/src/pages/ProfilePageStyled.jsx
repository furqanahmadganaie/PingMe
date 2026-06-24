import { CalendarDays, Camera, CheckCircle2, Mail, User } from "lucide-react";
import { createElement, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePageStyled = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5 MB");

    const reader = new FileReader();
    reader.onload = async () => {
      setSelectedImg(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "Recently";

  return (
    <main className="app-shell min-h-screen px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Your account</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Profile</h1>
          <p className="mt-2 text-base-content/55">Manage your identity across PingMe.</p>
        </div>

        <section className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
          <div className="px-5 pb-7 sm:px-8">
            <div className="-mt-16 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <div className="relative">
                <img src={selectedImg || authUser?.profilePic || "/avatar.png"} alt="Profile" className="size-32 rounded-[2rem] border-4 border-base-100 bg-base-100 object-cover shadow-xl" />
                <label htmlFor="avatar-upload" className={`btn btn-primary btn-circle btn-sm absolute -bottom-1 -right-1 shadow-lg ${isUpdatingProfile ? "pointer-events-none animate-pulse" : ""}`}>
                  <Camera className="size-4" />
                  <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                </label>
              </div>
              <div className="pb-1 text-center sm:text-left">
                <h2 className="text-2xl font-black">{authUser?.fullName}</h2>
                <p className="text-sm text-base-content/50">{isUpdatingProfile ? "Uploading your photo..." : "Click the camera to change your photo"}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard icon={User} label="Full name" value={authUser?.fullName} />
              <InfoCard icon={Mail} label="Email address" value={authUser?.email} />
              <InfoCard icon={CalendarDays} label="Member since" value={memberSince} />
              <InfoCard icon={CheckCircle2} label="Account status" value="Active" accent />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const InfoCard = ({ icon, label, value, accent }) => (
  <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/40">
      {createElement(icon, { className: `size-4 ${accent ? "text-success" : "text-primary"}` })}
      {label}
    </div>
    <p className={`truncate font-semibold ${accent ? "text-success" : ""}`}>{value || "Not available"}</p>
  </div>
);

export default ProfilePageStyled;
