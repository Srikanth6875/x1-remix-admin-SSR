import { useNavigate } from "react-router";
import type { Reseller } from "~/services/ResellerAppService.service";

type Props = {
  reseller: Reseller;
  onEdit: () => void;
};

export const ActionButtons = ({ reseller, onEdit }: Props) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!confirm("Delete this reseller permanently?")) return;

    navigate(
      `/reflection?app_type=RESELLER&run_type=DELETE_RESELLER&delete_id=${reseller.id}`
    );
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
