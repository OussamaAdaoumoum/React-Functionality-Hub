import { useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "../components/modal/ModalContent";

export default function PortalPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
     
        <button
          data-modal-target="staticModal"
          data-modal-toggle="staticModal"
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Toggle modal
        </button>
      {showModal &&
        createPortal(
          <ModalContent onClose={() => setShowModal(false)} />,
          document.getElementById("portal")
        )}
    </>
  );
}
