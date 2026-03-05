import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Support() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");

  const ticketsQ = useQuery({
    queryKey: ["my-tickets"],
    queryFn: async () => {
      const { data } = await api.get("/support/tickets");
      return data as any[];
    },
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/support/tickets", {
        subject,
        message,
        priority,
      });
      return data;
    },
    onSuccess: async () => {
      setSubject("");
      setMessage("");
      setPriority("normal");
      await ticketsQ.refetch();
      alert("Ticket created");
    },
  });

  return (
    <div className="p-10 space-y-8 max-w-3xl">
      <div>
        <div className="text-2xl font-black">Support</div>
        <div className="text-sm text-black/50">Open a ticket and our admin will reply.</div>
      </div>

      <div className="border rounded-2xl p-6 bg-white space-y-3">
        <div className="font-bold">Create Ticket</div>

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (e.g. Refund request / Change dates / Payment issue)"
          className="border rounded-xl px-3 py-2 w-full"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue..."
          className="border rounded-xl px-3 py-2 w-full min-h-[120px]"
        />

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="border rounded-xl px-3 py-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <Button
            onClick={() => createMut.mutate()}
            disabled={createMut.isPending || !subject.trim() || !message.trim()}
          >
            {createMut.isPending ? "Creating..." : "Submit Ticket"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-bold">My Tickets</div>

        {ticketsQ.isLoading && <div>Loading...</div>}

        {(ticketsQ.data || []).map((t: any) => (
          <div key={t.id} className="border rounded-2xl p-5 bg-white">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-bold">#{t.id} — {t.subject}</div>
                <div className="text-sm text-black/50">
                  Priority: {t.priority} • Status: {t.status}
                </div>
              </div>
              <div className="text-xs text-black/40">
                Updated: {String(t.updated_at || t.created_at).slice(0, 19).replace("T", " ")}
              </div>
            </div>
          </div>
        ))}

        {!ticketsQ.isLoading && !(ticketsQ.data || []).length && (
          <div className="text-sm text-black/50">No tickets yet.</div>
        )}
      </div>
    </div>
  );
}