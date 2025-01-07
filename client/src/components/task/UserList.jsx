import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import clsx from "clsx";
import { MdCheck } from "react-icons/md";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getInitials } from "../../utils";

const UserList = ({ setTeam, team }) => {
  const [users, setUsers] = useState([]); // Store fetched users
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const auth = getAuth();
        const adminId = auth.currentUser?.uid; // Get the logged-in admin's ID

        if (!adminId) {
          console.error("Admin not authenticated.");
          return;
        }

        const usersCollectionRef = collection(db, "admins", adminId, "users");
        const snapshot = await getDocs(usersCollectionRef);

        const fetchedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(fetchedUsers);

        // Set default selection if no team is preselected
        if (team?.length < 1 && fetchedUsers.length > 0) {
          setSelectedUsers([fetchedUsers[0]]);
          setTeam([fetchedUsers[0]._id]); // Update the team state
        } else {
          setSelectedUsers(fetchedUsers.filter((user) => team.includes(user.id)));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchUsers();
  }, [team, setTeam]);

  const handleChange = (selected) => {
    setSelectedUsers(selected);
    setTeam(selected.map((user) => user.id)); // Update the team state with selected user IDs
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <p className="text-gray-700">Assign Task To: </p>
      <Listbox
        value={selectedUsers}
        onChange={(el) => handleChange(el)}
        multiple
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 sm:text-sm">
            <span className="block truncate">
              {selectedUsers.map((user) => user.name).join(", ")}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {users.map((user) => (
                <Listbox.Option
                  key={user.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={clsx(
                          "flex items-center gap-2 truncate",
                          selected ? "font-medium" : "font-normal"
                        )}
                      >
                        <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                          <span className="text-center text-[10px]">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <span>{user.name}</span>
                      </div>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <MdCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;
