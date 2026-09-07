"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteRoomAction } from "@/actions/chatActions";

export default function DeleteConversationButton({ roomId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Delete conversation? This will remove its messages."))
      return;
    setIsDeleting(true);
    const result = await deleteRoomAction(roomId);
    if (result?.success) router.push("/dashboard/chats");
    else setIsDeleting(false);
  };

  return (
    <button
      type='button'
      onClick={handleDelete}
      disabled={isDeleting}
      title='Delete conversation'
      className='inline-flex items-center gap-2 rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:border-rose-400 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60'>
      <Trash2 className='h-3.5 w-3.5' />
      {isDeleting ? "Deleting..." : "Delete Conversation"}
    </button>
  );
}
