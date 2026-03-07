import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateMe } from "@/lib/api";
import { useMeQuery } from "@/lib/queries";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCompleted?: () => void;
};

export default function ProfileRequiredModal({ open, onOpenChange, onCompleted }: Props) {
  const { data: me, refetch } = useMeQuery(open);

  const [busy, setBusy] = React.useState(false);

  const [form, setForm] = React.useState({
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
    passport_no: "",
    license_no: "",
    country: "",
    address_line1: "",
    city: "",
  });

  React.useEffect(() => {
    if (me) {
      setForm({
        first_name: me.first_name || "",
        last_name: me.last_name || "",
        phone: me.phone || "",
        dob: me.dob ? String(me.dob).slice(0, 10) : "",
        passport_no: me.passport_no || "",
        license_no: me.license_no || "",
        country: me.country || "",
        address_line1: me.address_line1 || "",
        city: me.city || "",
      });
    }
  }, [me]);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      const res = await updateMe(form);
      await refetch();
      if (res?.profile_completed) {
        onOpenChange(false);
        onCompleted?.();
      } else {
        alert("Please fill all fields to continue.");
      }
    } catch (e: any) {
      alert(e?.message || "Failed to save profile");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete your details to book</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold text-black/60">First name</div>
            <input className={inputClass} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
          </div>
          <div>
            <div className="text-xs font-semibold text-black/60">Last name</div>
            <input className={inputClass} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
          </div>

          <div>
            <div className="text-xs font-semibold text-black/60">Phone</div>
            <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <div className="text-xs font-semibold text-black/60">Date of birth</div>
            <input type="date" className={inputClass} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          </div>

          <div>
            <div className="text-xs font-semibold text-black/60">Passport number</div>
            <input className={inputClass} value={form.passport_no} onChange={(e) => set("passport_no", e.target.value)} />
          </div>
          <div>
            <div className="text-xs font-semibold text-black/60">Driving licence number</div>
            <input className={inputClass} value={form.license_no} onChange={(e) => set("license_no", e.target.value)} />
          </div>

          <div>
            <div className="text-xs font-semibold text-black/60">Country</div>
            <input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} />
          </div>
          <div>
            <div className="text-xs font-semibold text-black/60">City</div>
            <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-black/60">Address</div>
            <input className={inputClass} value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button className="w-full" disabled={busy} onClick={save}>
            {busy ? "Saving..." : "Save & Continue"}
          </Button>
          <Button className="w-full" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>

        <div className="text-xs text-black/50 mt-2">
          These details are required for rental verification.
        </div>
      </DialogContent>
    </Dialog>
  );
}