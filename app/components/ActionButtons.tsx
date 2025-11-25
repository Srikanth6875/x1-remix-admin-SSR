import type { Reseller } from "~/services/ResellerAppService.server";

type Props = {
  reseller: Reseller;
  onEdit: () => void;
};

export const ActionButtons = ({ reseller, onEdit }: Props) => {
  const handleDelete = () => {
    if (confirm("Delete this reseller permanently?")) {
      const url = new URL(window.location.href);
      url.searchParams.set("app_type", "RESELLER");
      url.searchParams.set("run_type", "DELETE_RESELLER");
      url.searchParams.set("delete_id", String(reseller.id));
      window.location.href = url.toString();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="px-3 py-1 text-xs bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-lg hover:from-indigo-500 hover:to-purple-600 transition duration-200 shadow-sm hover:shadow"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 text-xs bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-lg hover:from-pink-500 hover:to-rose-600 transition duration-200 shadow-sm hover:shadow"
      >
        Delete
      </button>
    </div>
  );
};