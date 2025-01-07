import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { getInitials } from "../utils";

const UserInfo = ({ user }) => {
  const name = user?.name || "Unknown User"; // Fallback to "Unknown User" if name is missing
  const initials = getInitials(name); // Get initials or a fallback

  return (
    <div className="px-4">
      <Popover className="relative">
        <>
          {/* Popover Button */}
          <Popover.Button className="group inline-flex items-center outline-none">
            <span>{initials}</span>
          </Popover.Button>

          {/* Popover Panel */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-80 max-w-sm -translate-x-1/2 transform px-4 sm:px-0">
              <div className="flex items-center gap-4 rounded-lg shadow-lg bg-white p-8">
                {/* User Avatar */}
                <div className="w-16 h-16 bg-blue-600 rounded-full text-white flex items-center justify-center text-2xl">
                  <span className="text-center font-bold">{initials}</span>
                </div>

                {/* User Info */}
                <div className="flex flex-col gap-y-1">
                  <p className="text-black text-xl font-bold">{name}</p>
                  <span className="text-base text-gray-500">
                    {user?.title || "No Title"}
                  </span>
                  <span className="text-blue-500">
                    {user?.email || "email@example.com"}
                  </span>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      </Popover>
    </div>
  );
};

export default UserInfo;
