import {Users} from "lucide-react";

const Sidebarskeleton = ({ mobileHidden = false }) => {
    const skeletonContacts = Array(8).fill(null);

  return (
     <aside className={`${mobileHidden ? "hidden md:flex" : "flex"} h-full w-full shrink-0 flex-col border-r border-base-content/10 bg-base-100 md:w-80`}>
      {/* Header */}
      <div className="w-full border-b border-base-content/10 p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium">Messages</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="w-full overflow-y-auto py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="min-w-0 flex-1 text-left">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebarskeleton
