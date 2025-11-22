// import { useEffect } from "react";
// import { Form, useNavigation } from "react-router";
// import { Modal } from "./Modal";
// import type { Reseller } from "~/services/ResellerAppService.server";

// type Props = {
//   reseller?: Reseller;
//   onClose: () => void;
// };

// export const ResellerModal = ({ reseller, onClose }: Props) => {
//   const navigation = useNavigation();
//   const isSubmitting = navigation.state === "submitting";

//   useEffect(() => {
//     if (!isSubmitting && navigation.formData) {
//       onClose();
//     }
//   }, [isSubmitting, navigation.formData, onClose]);

//   return (
//     <Modal onClose={onClose}>
//       <h2 className="text-xl font-bold mb-4">
//         {reseller?.id ? "Edit Reseller" : "Add Reseller"}
//       </h2>

//       <Form method="post" className="flex flex-col gap-2">
//         <input type="hidden" name="_method" value={reseller?.id ? "put" : "post"} />

//         {reseller?.id && (<input type="hidden" name="id" defaultValue={reseller.id} />)}

//         <input
//           name="name"
//           defaultValue={reseller?.name || ""}
//           placeholder="Name"
//           className="border border-gray-300 px-2 py-2 rounded w-full"
//           required
//         />

//         <input
//           name="email"
//           defaultValue={reseller?.email || ""}
//           placeholder="Email"
//           className="border border-gray-300 px-2 py-2 rounded w-full"
//           required
//         />

//         <input
//           name="companyName"
//           defaultValue={reseller?.companyName || ""}
//           placeholder="Company Name"
//           className="border border-gray-300 px-2 py-2 rounded w-full"
//         />

//         <select
//           name="resellerType"
//           defaultValue={reseller?.resellerType || "Dealer"}
//           className="border border-gray-300 px-2 py-2 rounded w-full"
//         >
//           <option value="Dealer">Dealer</option>
//           <option value="Distributor">Distributor</option>
//           <option value="Retailer">Retailer</option>
//           <option value="Online Seller">Online Seller</option>
//         </select>

//         <input
//           name="status"
//           defaultValue={reseller?.status || ""}
//           placeholder="Status (e.g., Active, Inactive)"
//           className="border border-gray-300 px-2 py-2 rounded w-full"
//           required
//         />

//         <textarea
//           name="address"
//           defaultValue={reseller?.address || ""}
//           placeholder="Address"
//           className="border border-gray-300 px-2 py-2 rounded w-full"
//           rows={3}
//         ></textarea>

//         <div className="flex justify-end gap-2 mt-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             {reseller?.id ? "Update" : "Add"}
//           </button>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

import { Form, useNavigation } from "react-router";
import { Modal } from "./Modal";
import type { Reseller } from "~/services/ResellerAppService.server";

type Props = {
  reseller?: Reseller;
  onClose: () => void;
};

export const ResellerModal = ({ reseller, onClose }: Props) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Close modal instantly when submitting
  if (isSubmitting) onClose();

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">
        {reseller ? "Edit Reseller" : "Add New Reseller"}
      </h2>

      <Form
        method="post"
        onSubmit={(e) => {
          onClose(); // Close immediately
        }}
        className="space-y-4"
      >
        <input type="hidden" name="app_type" value="RESELLER" />
        <input
          type="hidden"
          name="run_type"
          value={reseller ? "UPDATE_RESELLER" : "ADD_RESELLER"}
        />
        {reseller && <input type="hidden" name="id" value={reseller.id} />}

        <input name="name" defaultValue={reseller?.name} placeholder="Name" required className="w-full px-4 py-2 border rounded-lg" />
        <input name="email" type="email" defaultValue={reseller?.email ?? ''} placeholder="Email" required className="w-full px-4 py-2 border rounded-lg" />
        <input name="companyName" defaultValue={reseller?.companyName ?? ''} placeholder="Company Name" className="w-full px-4 py-2 border rounded-lg" />
        <select name="resellerType" defaultValue={reseller?.resellerType || "Dealer"} className="w-full px-4 py-2 border rounded-lg">
          <option>Dealer</option>
          <option>Distributor</option>
          <option>Retailer</option>
          <option>Online Seller</option>
        </select>
        <input name="status" defaultValue={reseller?.status || "Active"} placeholder="Status" required className="w-full px-4 py-2 border rounded-lg" />
        <textarea name="address" defaultValue={reseller?.address ??''} rows={3} placeholder="Address" className="w-full px-4 py-2 border rounded-lg"></textarea>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-green-600 text-white rounded-lg disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : reseller ? "Update" : "Create"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};