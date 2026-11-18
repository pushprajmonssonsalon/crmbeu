import { FaUser } from "react-icons/fa";
import Loader from "../loader/Loader";
import Modal from "../modal/Modal";

const UserListModal = ({ show, setShow, title, users, loading, error }) => {
  return (
    <Modal show={show} setShow={setShow} overlayClassName="bg-transparent" scrollWithin lockScroll closeOnBackdrop>
      <ChildComponent title={title} users={users} loading={loading} error={error} />
    </Modal>
  );
};

const ChildComponent = ({ closeModal, modalRef, title, users, loading, error }) => {
  return (
    <div className="relative mx-auto p-4 w-full max-w-full sm:w-fit sm:min-w-[300px] md:min-w-[450px] xl:min-w-[600px] max-h-[calc(100dvh-2rem)]">
      <div
        ref={modalRef}
        className="slide-in-top relative flex flex-col max-h-[calc(100dvh-2rem)] w-full bg-white rounded-lg shadow"
      >
        <div className="flex w-full shrink-0 items-center justify-between p-3 border-b">
          <h3 className="text-lg flex items-center gap-2 font-semibold text-gray-900">
            <FaUser className="text-customPurple" />
            {title}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="min-h-0 py-5 px-3 flex flex-col gap-2 overflow-y-auto">
          {loading ? (
            <div className="h-[20vh] flex items-center justify-center">
              <Loader />
            </div>
          ) : error ? (
            <div role="alert" className="h-[20vh] flex items-center justify-center text-sm text-red-600">
              {error}
            </div>
          ) : users?.length > 0 ? (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="text-sm">Name</th>
                    <th className="text-sm">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id || `${user.phoneNumber}-${index}`}>
                      <td className="text-sm">{user.name || "-"}</td>
                      <td className="text-sm">{user.phoneNumber || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-[20vh] flex items-center justify-center">
              <h2 className="text-gray2 text-md mb-5">No users found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
