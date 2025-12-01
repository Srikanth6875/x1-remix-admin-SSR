import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { ResellerModal } from "./ResellerModal";
import { ActionButtons } from "./ActionButtons";
import type { Reseller } from "~/services/ResellerAppService.service";

type ColumnDef = {
  key: string;   // field in data
  label: string; // header text
};

type Props = {
  initialData: Reseller[];
  columns: ColumnDef[];
};

export const ResellerTable = ({ initialData, columns }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Sync scroll or focus when modal opens
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "unset";
  }, [showModal]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-gray-800">Resellers</h1>

        <button
          onClick={openAddModal}
          className="px-2 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg hover:from-emerald-500 hover:to-teal-600 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
        >
          Add Reseller
        </button>
      </div>

      {showModal && (<ResellerModal reseller={resellerToEdit} onClose={closeModal} />)}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b">
                  {col.label}
                </th>
              ))}

              {/* Actions column */}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {initialData.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm"> {(row as any)[col.key]} </td>
                ))}

                <td className="px-4 py-3 text-sm">
                  <ActionButtons reseller={row} onEdit={() => openEditModal(row.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
