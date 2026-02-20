import { useEffect, useState } from "react";
import {
  getTickets,
  addTicket,
  updateTicket,
  Ticket,
} from "../lib/storage";

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  function waLink(phone: string, text: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  function createTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const ticket: Ticket = {
      ticketNumber: "T-" + Date.now(),
      userEmail: "guest@user.com",
      subject: "General Support",
      status: "Open",
      messages: [
        {
          sender: "customer",
          text: "Initial request",
          date: new Date().toISOString(),
        },
      ],
    };

    addTicket(ticket);
    setTickets(getTickets());
  }

  function adminReply(
    ticketNumber: string,
    text: string,
    nextStatus: string
  ) {
    const current = getTickets().find(
      (t) => t.ticketNumber === ticketNumber
    );
    if (!current) return;

    const updated: Partial<Ticket> = {
      status: nextStatus,
      messages: [
        ...current.messages,
        {
          sender: "admin",
          text,
          date: new Date().toISOString(),
        },
      ],
    };

    updateTicket(ticketNumber, updated);
    setTickets(getTickets());
  }

  const activeTicket =
    selected &&
    tickets.find((t) => t.ticketNumber === selected);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-10">
        <div>
          <h1 className="text-3xl font-black mb-6">Support Tickets</h1>

          <form onSubmit={createTicket} className="mb-6">
            <button className="bg-blue-600 px-4 py-2 rounded">
              Create Demo Ticket
            </button>
          </form>

          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t.ticketNumber}
                onClick={() => setSelected(t.ticketNumber)}
                className="p-4 border border-white/10 rounded cursor-pointer hover:bg-white/5"
              >
                <div className="font-semibold">{t.subject}</div>
                <div className="text-xs text-white/50">
                  {t.ticketNumber} • {t.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {activeTicket && (
            <div>
              <h2 className="text-2xl font-black mb-4">
                {activeTicket.subject}
              </h2>

              <div className="space-y-3 mb-6">
                {activeTicket.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded ${
                      m.sender === "admin"
                        ? "bg-blue-600/20"
                        : "bg-white/10"
                    }`}
                  >
                    <div className="text-xs text-white/50">
                      {m.sender} •{" "}
                      {new Date(m.date).toLocaleString()}
                    </div>
                    <div>{m.text}</div>
                  </div>
                ))}
              </div>

              <AdminReplyBox
                onSend={(text, status) =>
                  adminReply(
                    activeTicket.ticketNumber,
                    text,
                    status
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminReplyBox({
  onSend,
}: {
  onSend: (text: string, status: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 bg-black border border-white/20 rounded"
        placeholder="Reply..."
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            onSend(text, "Answered");
            setText("");
          }}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Reply
        </button>

        <button
          onClick={() => onSend(text, "Closed")}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}