import React, { useState, useMemo } from "react";
import { Plus, Search, X, User, Fingerprint, Building2, Wallet, Camera, Pencil, Trash2 } from "lucide-react";

const COMPANIES = ["Company A", "Company B", "Company C"];

const emptyForm = {
  id: null,
  name: "",
  address: "",
  dob: "",
  aadhar: "",
  pan: "",
  epfNo: "",
  esicNo: "",
  company: COMPANIES[0],
  department: "",
  designation: "",
  joiningDate: "",
  exitDate: "",
  photo: "",
  basic: "",
  hra: "",
  allowances: "",
};

function grossOf(emp) {
  const b = Number(emp.basic) || 0;
  const h = Number(emp.hra) || 0;
  const a = Number(emp.allowances) || 0;
  return b + h + a;
}

function statutoryTags(emp) {
  const tags = [];
  const basic = Number(emp.basic) || 0;
  const gross = grossOf(emp);
  if (basic > 0 && basic <= 15000) tags.push({ label: "PF applicable", tone: "pf" });
  if (gross > 0 && gross <= 21000) tags.push({ label: "ESIC applicable", tone: "esic" });
  if (tags.length === 0 && gross > 0) tags.push({ label: "Above statutory limits", tone: "none" });
  return tags;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesCompany = companyFilter === "All" || e.company === companyFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.epfNo.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q);
      return matchesCompany && matchesQuery;
    });
  }, [employees, companyFilter, query]);

  const counts = useMemo(() => {
    const map = { All: employees.length };
    COMPANIES.forEach((c) => (map[c] = employees.filter((e) => e.company === c).length));
    return map;
  }, [employees]);

  function openNew() {
    setForm({ ...emptyForm, company: companyFilter === "All" ? COMPANIES[0] : companyFilter });
    setPanelOpen(true);
  }

  function openEdit(emp) {
    setForm(emp);
    setPanelOpen(true);
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  }

  function saveEmployee(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.id) {
      setEmployees((list) => list.map((emp) => (emp.id === form.id ? form : emp)));
    } else {
      setEmployees((list) => [...list, { ...form, id: uid() }]);
    }
    setPanelOpen(false);
    setForm(emptyForm);
  }

  function removeEmployee(id) {
    setEmployees((list) => list.filter((e) => e.id !== id));
    setConfirmDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#1B1F23]" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <header className="border-b border-[#DCD9D1] bg-[#1E3A5F] text-[#F6F5F2]">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Employee Register</h1>
            <p className="text-xs text-[#B9C6D6] mt-0.5">Phase 1 — master records, in-memory until Supabase is connected</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 bg-[#C9992C] hover:opacity-90 text-[#1B1F23] font-medium text-sm px-3.5 py-2 rounded-sm transition-opacity"
          >
            <Plus size={16} /> Add employee
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-6 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {["All", ...COMPANIES].map((c) => (
            <button
              key={c}
              onClick={() => setCompanyFilter(c)}
              className={`text-left px-3 py-2 rounded-sm text-sm whitespace-nowrap flex items-center justify-between gap-3 border ${
                companyFilter === c
                  ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                  : "bg-white text-[#1B1F23] border-[#E3E0D8] hover:border-[#1E3A5F]"
              }`}
            >
              <span>{c}</span>
              <span className={`text-xs font-mono ${companyFilter === c ? "text-[#B9C6D6]" : "text-[#8A8577]"}`}>
                {counts[c] ?? 0}
              </span>
            </button>
          ))}
        </nav>

        <main>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A8577]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, EPF no, or designation"
                className="w-full pl-8 pr-3 py-2 text-sm rounded-sm border border-[#E3E0D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/40"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-[#D8D4C8] rounded-sm py-16 text-center text-sm text-[#8A8577]">
              {employees.length === 0
                ? 'No employees added yet. Start with "Add employee" above.'
                : "No records match this search."}
            </div>
          ) : (
            <>
              <div className="hidden md:block border border-[#E3E0D8] rounded-sm overflow-hidden bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-[#EFECE3] text-[#5B5748] text-xs">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">Employee</th>
                      <th className="text-left font-medium px-3 py-2">Company / role</th>
                      <th className="text-left font-medium px-3 py-2 font-mono">EPF / ESIC</th>
                      <th className="text-left font-medium px-3 py-2">Joined</th>
                      <th className="text-left font-medium px-3 py-2">Status</th>
                      <th className="text-right font-medium px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((emp) => (
                      <tr key={emp.id} className="border-t border-[#EDEAE1]">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            {emp.photo ? (
                              <img src={emp.photo} alt="" className="w-8 h-8 rounded-sm object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-sm bg-[#EFECE3] flex items-center justify-center text-[#8A8577]">
                                <User size={14} />
                              </div>
                            )}
                            <span className="font-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div>{emp.company}</div>
                          <div className="text-xs text-[#8A8577]">{emp.designation || "—"}</div>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">
                          <div>{emp.epfNo || "—"}</div>
                          <div className="text-[#8A8577]">{emp.esicNo || "—"}</div>
                        </td>
                        <td className="px-3 py-2 text-xs">{emp.joiningDate || "—"}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {statutoryTags(emp).map((t, i) => (
                              <span
                                key={i}
                                className={`text-[11px] px-1.5 py-0.5 rounded-sm ${
                                  t.tone === "pf"
                                    ? "bg-[#DCE6DC] text-[#2F7A4F]"
                                    : t.tone === "esic"
                                    ? "bg-[#DDE6EF] text-[#1E3A5F]"
                                    : "bg-[#EFECE3] text-[#8A8577]"
                                }`}
                              >
                                {t.label}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button onClick={() => openEdit(emp)} className="p-1.5 hover:bg-[#EFECE3] rounded-sm mr-1">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setConfirmDeleteId(emp.id)} className="p-1.5 hover:bg-[#F3DEDC] rounded-sm text-[#B3261E]">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col gap-2">
                {filtered.map((emp) => (
                  <div key={emp.id} className="border border-[#E3E0D8] rounded-sm bg-white p-3">
                    <div className="flex items-start gap-3">
                      {emp.photo ? (
                        <img src={emp.photo} alt="" className="w-11 h-11 rounded-sm object-cover" />
                      ) : (
                        <div className="w-11 h-11 rounded-sm bg-[#EFECE3] flex items-center justify-center text-[#8A8577]">
                          <User size={18} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-xs text-[#8A8577]">{emp.company} · {emp.designation || "—"}</div>
                        <div className="text-xs font-mono text-[#8A8577] mt-1">EPF {emp.epfNo || "—"}</div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {statutoryTags(emp).map((t, i) => (
                            <span
                              key={i}
                              className={`text-[11px] px-1.5 py-0.5 rounded-sm ${
                                t.tone === "pf" ? "bg-[#DCE6DC] text-[#2F7A4F]" : t.tone === "esic" ? "bg-[#DDE6EF] text-[#1E3A5F]" : "bg-[#EFECE3] text-[#8A8577]"
                              }`}
                            >
                              {t.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => openEdit(emp)} className="p-1.5 hover:bg-[#EFECE3] rounded-sm">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(emp.id)} className="p-1.5 hover:bg-[#F3DEDC] rounded-sm text-[#B3261E]">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-20 flex justify-end bg-black/30">
          <form onSubmit={saveEmployee} className="w-full sm:max-w-md h-full bg-[#FBFAF7] overflow-y-auto">
            <div className="sticky top-0 bg-[#1E3A5F] text-white px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-sm">{form.id ? "Edit employee" : "Add employee"}</h2>
              <button type="button" onClick={() => setPanelOpen(false)} className="p-1 hover:bg-white/10 rounded-sm">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              <section>
                <SectionLabel icon={<Camera size={13} />} text="Photo" />
                <div className="flex items-center gap-3 mt-2">
                  {form.photo ? (
                    <img src={form.photo} alt="" className="w-14 h-14 rounded-sm object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-sm bg-[#EFECE3] flex items-center justify-center text-[#8A8577]">
                      <User size={22} />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhoto} className="text-xs" />
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <SectionLabel icon={<User size={13} />} text="Personal details" />
                <Field label="Full name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
                <Field label="Address" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} textarea />
                <Field label="Date of birth" type="date" value={form.dob} onChange={(v) => setForm((f) => ({ ...f, dob: v }))} />
              </section>

              <section className="flex flex-col gap-3">
                <SectionLabel icon={<Fingerprint size={13} />} text="Identity & statutory numbers" />
                <Field label="Aadhar number" value={form.aadhar} onChange={(v) => setForm((f) => ({ ...f, aadhar: v }))} mono />
                <Field label="PAN" value={form.pan} onChange={(v) => setForm((f) => ({ ...f, pan: v.toUpperCase() }))} mono />
                <Field label="EPF number" value={form.epfNo} onChange={(v) => setForm((f) => ({ ...f, epfNo: v }))} mono />
                <Field label="ESIC number" value={form.esicNo} onChange={(v) => setForm((f) => ({ ...f, esicNo: v }))} mono />
              </section>

              <section className="flex flex-col gap-3">
                <SectionLabel icon={<Building2 size={13} />} text="Employment" />
                <div>
                  <label className="text-xs text-[#5B5748] mb-1 block">Company</label>
                  <select
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="w-full px-2.5 py-2 text-sm rounded-sm border border-[#E3E0D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/40"
                  >
                    {COMPANIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Field label="Department" value={form.department} onChange={(v) => setForm((f) => ({ ...f, department: v }))} />
                <Field label="Designation" value={form.designation} onChange={(v) => setForm((f) => ({ ...f, designation: v }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Joining date" type="date" value={form.joiningDate} onChange={(v) => setForm((f) => ({ ...f, joiningDate: v }))} />
                  <Field label="Exit date" type="date" value={form.exitDate} onChange={(v) => setForm((f) => ({ ...f, exitDate: v }))} />
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <SectionLabel icon={<Wallet size={13} />} text="Salary structure (monthly, ₹)" />
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Basic" type="number" value={form.basic} onChange={(v) => setForm((f) => ({ ...f, basic: v }))} mono />
                  <Field label="HRA" type="number" value={form.hra} onChange={(v) => setForm((f) => ({ ...f, hra: v }))} mono />
                  <Field label="Allowances" type="number" value={form.allowances} onChange={(v) => setForm((f) => ({ ...f, allowances: v }))} mono />
                </div>
                <p className="text-xs text-[#8A8577] font-mono">Gross: ₹{grossOf(form).toLocaleString("en-IN")}</p>
              </section>
            </div>

            <div className="sticky bottom-0 bg-[#FBFAF7] border-t border-[#E3E0D8] px-5 py-3 flex gap-2">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex-1 py-2 text-sm rounded-sm border border-[#E3E0D8] hover:bg-[#EFECE3]"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2 text-sm rounded-sm bg-[#1E3A5F] text-white hover:bg-[#16304F]">
                {form.id ? "Save changes" : "Add employee"}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-5">
          <div className="bg-white rounded-sm p-5 max-w-sm w-full">
            <p className="text-sm mb-4">Remove this employee record? This can't be undone in this session.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2 text-sm rounded-sm border border-[#E3E0D8]">
                Cancel
              </button>
              <button
                onClick={() => removeEmployee(confirmDeleteId)}
                className="flex-1 py-2 text-sm rounded-sm bg-[#B3261E] text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-[#5B5748] pb-1 border-b border-[#E3E0D8]">
      {icon} {text}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false, mono = false, required = false }) {
  const cls = `w-full px-2.5 py-2 text-sm rounded-sm border border-[#E3E0D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/40 ${
    mono ? "font-mono" : ""
  }`;
  return (
    <div>
      <label className="text-xs text-[#5B5748] mb-1 block">{label}{required ? " *" : ""}</label>
      {textarea ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} required={required} />
      )}
    </div>
  );
}
