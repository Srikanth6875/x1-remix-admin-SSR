import { useEffect } from "react";
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

  useEffect(() => {
    if (!isSubmitting && navigation.formData) {
      onClose();
    }
  }, [isSubmitting, navigation.formData, onClose]);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {reseller?.id ? "Edit Reseller" : "Add Reseller"}
      </h2>

      <Form method="post" className="flex flex-col gap-2">
        <input type="hidden" name="_method" value={reseller?.id ? "put" : "post"} />

        {reseller?.id && (<input type="hidden" name="id" defaultValue={reseller.id} />)}

        <input
          name="name"
          defaultValue={reseller?.name || ""}
          placeholder="Name"
          className="border border-gray-300 px-2 py-2 rounded w-full"
          required
        />

        <input
          name="email"
          defaultValue={reseller?.email || ""}
          placeholder="Email"
          className="border border-gray-300 px-2 py-2 rounded w-full"
          required
        />

        <input
          name="companyName"
          defaultValue={reseller?.companyName || ""}
          placeholder="Company Name"
          className="border border-gray-300 px-2 py-2 rounded w-full"
        />

        <select
          name="resellerType"
          defaultValue={reseller?.resellerType || "Dealer"}
          className="border border-gray-300 px-2 py-2 rounded w-full"
        >
          <option value="Dealer">Dealer</option>
          <option value="Distributor">Distributor</option>
          <option value="Retailer">Retailer</option>
          <option value="Online Seller">Online Seller</option>
        </select>

        <input
          name="status"
          defaultValue={reseller?.status || ""}
          placeholder="Status (e.g., Active, Inactive)"
          className="border border-gray-300 px-2 py-2 rounded w-full"
          required
        />

        <textarea
          name="address"
          defaultValue={reseller?.address || ""}
          placeholder="Address"
          className="border border-gray-300 px-2 py-2 rounded w-full"
          rows={3}
        ></textarea>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {reseller?.id ? "Update" : "Add"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};
