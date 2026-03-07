import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminTickets() {
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [reply, setReply] = useState("");

  const listQ = useQuery({
    queryKey: ["admin-tickets", status],
    queryFn: async () => {
      const params: any = {};
      if (status !== "all") params.status = status;
      const { data } = await api.get("/admin/tickets", { params });
      return data as any[];
    },
    refetchInterval: 6000,
  });

  const msgsQ = useQuery({
    queryKey: ["admin-ticket-messages", selected?.id || 0],
    enabled: !!selected?.id,
    queryFn: async () => {
      const { data } = await api.get(`/admin/tickets/${selected.id}/messages`);
      return data as any[];
    },
    refetchInterval: 4000,
  });

  const updateMut = useMutation({
    mutationFn: async (payload: { id: number; status?: string; priority?: string }) => {
      const { id, ...body } = payload;
      const { data } = await api.patch(`/admin/tickets/${id}`, body);
      return data;
    },
    onSuccess: async () => {
      await listQ.refetch();
      if (selected?.id) await msgsQ.refetch();
    },
  });

  const replyMut = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/admin/tickets/${selected.id}/messages`, {
        message: reply,
      });
      return data;
    },
    onSuccess: async () => {
      setReply("");
      await msgsQ.refetch();
      await listQ.refetch();
    },
  });

  const rows = listQ.data || [];

  const sorted = useMemo(() => {
    return [...rows].sort((a: any, b: any) => {
      const at = new Date(a.updated_at || a.created_at || 0).getTime();
      const bt = new Date(b.updated_at || b.created_at || 0).getTime();
      return bt - at;
    });
  }, [rows]);

  return (
    <div className="p-10 grid grid-cols-12 gap-6">
      <div className="col-span-12 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-black">Support Tickets</div>
          <div className="text-sm text-black/50">Resolve customer issues fast</div>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-xl px-3 py-2"
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Left list */}
      <div className="col-span-5 border rounded-2xl bg-white overflow-hidden">
        <div className="px-5 py-3 border-b text-xs font-semibold text-black/60">
          Tickets
        </div>

        {listQ.isLoading && <div className="p-6">Loading...</div>}

        {sorted.map((t: any) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            className={
              "w-full text-left px-5 py-4 border-b hover:bg-black/5 " +
              (selected?.id === t.id ? "bg-black/5" : "")
            }
          >
            <div className="font-bold">#{t.id} — {t.subject}</div>
            <div className="text-xs text-black/50">
              {t.customer_email || "unknown"} • {t.priority} • {t.status}
            </div>
          </button>
        ))}

        {!listQ.isLoading && !sorted.length && (
          <div className="p-6 text-sm text-black/50">No tickets found.</div>
        )}
      </div>

      {/* Right details */}
      <div className="col-span-7 border rounded-2xl bg-white p-6 space-y-4">
        {!selected ? (
          <div className="text-black/50">Select a ticket to view messages.</div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xl font-black">
                  Ticket #{selected.id}
                </div>
                <div className="text-sm text-black/50">
                  {selected.customer_email || "-"} • priority {selected.priority} • {selected.status}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => updateMut.mutate({ id: selected.id, status: "in_progress" })}
                  disabled={updateMut.isPending}
                >
                  In Progress
                </Button>

                <Button
                  onClick={() => updateMut.mutate({ id: selected.id, status: "resolved" })}
                  disabled={updateMut.isPending}
                >
                  Resolve
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => updateMut.mutate({ id: selected.id, status: "closed" })}
                  disabled={updateMut.isPending}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="border rounded-xl p-4 max-h-[360px] overflow-auto space-y-3">
              {msgsQ.isLoading && <div>Loading messages...</div>}

              {(msgsQ.data || []).map((m: any) => (
                <div key={m.id} className="text-sm">
                  <div className="text-xs text-black/50">
                    {m.sender.toUpperCase()} • {String(m.created_at).slice(0, 19).replace("T", " ")}
                  </div>
                  <div className="font-medium">{m.message}</div>
                </div>
              ))}

              {!msgsQ.isLoading && !(msgsQ.data || []).length && (
                <div className="text-sm text-black/50">No messages.</div>
              )}
            </div>

            <div className="space-y-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Reply to customer..."
                className="border rounded-xl px-3 py-2 w-full min-h-[90px]"
              />

              <Button
                onClick={() => replyMut.mutate()}
                disabled={replyMut.isPending || !reply.trim()}
              >
                {replyMut.isPending ? "Sending..." : "Send Reply"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}