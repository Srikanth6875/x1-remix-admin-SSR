import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { ResellerModal } from "./ResellerModal";
import { ActionButtons } from "./ActionButtons";
import type { Reseller } from "~/services/ResellerAppService.server";

type Props = {
  initialData: Reseller[];
};

export const ResellerTable = ({ initialData }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
  const action = searchParams.get("action");
  const editId = searchParams.get("editId");
  const resellerToEdit = editId ? initialData.find(r => r.id === Number(editId)) : null;

  const showModal = action === "add" || !!resellerToEdit;

  const openAddModal = () => {
    setSearchParams(prev => {
      prev.set("action", "add");
      prev.delete("editId");
      return prev;
    });
  };

  const openEditModal = (id: number) => {
    setSearchParams(prev => {
      prev.set("editId", String(id));
      prev.delete("action");
      return prev;
    });
  };

  const closeModal = () => {
    setSearchParams(prev => {
      prev.delete("action");
      prev.delete("editId");
      return prev;
    });
  };

  // Optional: Sync scroll or focus when modal opens
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showModal]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resellers</h1>
        <button
          onClick={openAddModal}
          className="px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg hover:from-emerald-500 hover:to-teal-600 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
        >
          Add Reseller
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <ResellerModal
          reseller={resellerToEdit}
          onClose={closeModal}
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              {["ID", "Name", "Email", "Company", "Type", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-1000 uppercase tracking-wider border-b border-gray-1000">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialData.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-sm">{r.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{r.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{r.email}</td>
                <td className="px-4 py-3 text-sm">{r.companyName || "-"}</td>
                <td className="px-4 py-3 text-sm">{r.resellerType}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${r.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}> {r.status}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <ActionButtons reseller={r} onEdit={() => openEditModal(r.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};