import { Form, useNavigation } from "react-router";
import { Modal } from "./Modal";
import type { Reseller } from "~/services/ResellerAppService.service";
import React from "react";

type Props = {
  reseller?: Reseller | null;
  onClose: () => void;
};

export const ResellerModal = ({ reseller, onClose }: Props) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  React.useEffect(() => {
    if (!isSubmitting && navigation.formData) {
      const timer = setTimeout(() => onClose(), 100);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, navigation.formData, onClose]);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">
        {reseller ? "Edit Reseller" : "Add New Reseller"}
      </h2>

      <Form method="post" className="space-y-4">
        <input
          type="hidden"
          name="run_type"
          value={reseller ? "UPDATE_RESELLER" : "ADD_RESELLER"}
        />

        {reseller && <input type="hidden" name="id" value={reseller.id} />}

        <input
          name="name"
          defaultValue={reseller?.name}
          placeholder="Name"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          defaultValue={reseller?.email ?? ""}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          name="companyName"
          defaultValue={reseller?.companyName ?? ""}
          placeholder="Company Name"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <select
          name="resellerType"
          defaultValue={reseller?.resellerType || "Dealer"}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option>Dealer</option>
          <option>Distributor</option>
          <option>Retailer</option>
        </select>

        <select
          name="status"
          defaultValue={reseller?.status || "Active"}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <textarea
          name="address"
          defaultValue={reseller?.address ?? ""}
          rows={3}
          placeholder="Address"
          className="w-full px-4 py-2 border rounded-lg"
        ></textarea>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 bg-gray-300 rounded-lg"
          >
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
