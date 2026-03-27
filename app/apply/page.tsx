"use client";
import { useState, useCallback, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { Inter, Playfair_Display } from "next/font/google";
import { Eye, EyeOff, Upload, Plus, Trash2, CheckCircle, Lock, ChevronRight, ChevronLeft } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });

const PRIMARY = "#d97706";
const PRIMARY_LIGHT = "#fef3c7";
const PRIMARY_DARK = "#b45309";
const BG_WARM = "#fffbeb";
const CREAM = "#fffdf7";
const BORDER = "#e5e7eb";

// ── Types ──
interface OwnerInfo {
  firstName: string; lastName: string; title: string; ownership: string;
  ssn: string; ssnRaw: string; ssnVisible: boolean;
  dob: string; phone: string; email: string;
  street: string; city: string; state: string; zip: string;
  dlNumber: string; dlState: string; personalGuarantee: boolean;
  dlPhoto: File | null;
}

interface BankAccount {
  bankName: string; accountType: string; routingNumber: string;
  accountNumber: string; accountNumberRaw: string; accountNumberVisible: boolean;
}

interface FormData {
  // Step 1
  legalName: string; dba: string; taxFilingMethod: string; taxId: string; taxFilingName: string;
  bizType: string; bizStartDate: string;
  bizStreet: string; bizStreet2: string; bizCity: string; bizState: string; bizZip: string;
  bizPhone: string; bizEmail: string; website: string; bizDescription: string;
  mailingDifferent: boolean;
  mailStreet: string; mailStreet2: string; mailCity: string; mailState: string; mailZip: string;
  // Step 2
  owners: OwnerInfo[];
  // Step 3
  deposit: BankAccount;
  withdrawalDifferent: boolean;
  withdrawal: BankAccount;
  voidedCheck: File | null;
  // Step 4
  avgMonthlyVolume: string; avgTransaction: string;
  inPerson: string; telephone: string; online: string;
  deliveryWindow: string;
  hasThirdParty: string; tppName: string; tppEmail: string; tppPhone: string;
  // Step 5
  certified: boolean;
}

const blankOwner = (): OwnerInfo => ({
  firstName: "", lastName: "", title: "", ownership: "",
  ssn: "", ssnRaw: "", ssnVisible: false,
  dob: "", phone: "", email: "",
  street: "", city: "", state: "", zip: "",
  dlNumber: "", dlState: "", personalGuarantee: false, dlPhoto: null,
});

const blankBank = (): BankAccount => ({
  bankName: "", accountType: "", routingNumber: "",
  accountNumber: "", accountNumberRaw: "", accountNumberVisible: false,
});

const initialForm = (): FormData => ({
  legalName: "", dba: "", taxFilingMethod: "", taxId: "", taxFilingName: "",
  bizType: "", bizStartDate: "",
  bizStreet: "", bizStreet2: "", bizCity: "", bizState: "", bizZip: "",
  bizPhone: "", bizEmail: "", website: "", bizDescription: "",
  mailingDifferent: false,
  mailStreet: "", mailStreet2: "", mailCity: "", mailState: "", mailZip: "",
  owners: [blankOwner()],
  deposit: blankBank(),
  withdrawalDifferent: false,
  withdrawal: blankBank(),
  voidedCheck: null,
  avgMonthlyVolume: "", avgTransaction: "",
  inPerson: "", telephone: "", online: "",
  deliveryWindow: "",
  hasThirdParty: "no", tppName: "", tppEmail: "", tppPhone: "",
  certified: false,
});

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const OWNERSHIP_TYPES = [
  "Sole Proprietor", "Partnership", "Corporation (C-Corp)", "Corporation (S-Corp)",
  "LLC – Single Member", "LLC – Multi-Member", "Non-Profit"
];

const OWNER_TITLES = [
  "Owner", "Co-Owner", "President", "Vice President", "CEO", "CFO", "COO", "Partner", "Member", "Director"
];

const DELIVERY_WINDOWS = [
  "0–7 days", "8–14 days", "15–30 days", "31–90 days", "Over 90 days", "Services rendered"
];

const STEP_LABELS = ["Business Info", "Owner Info", "Banking", "Processing", "Review & Submit"];

// ── SSN masking ──
function maskSSN(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 5) return "●".repeat(digits.length);
  return "●●●-●●-" + digits.slice(5);
}

// ── Account number masking ──
function maskAccount(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 4) return "●".repeat(digits.length);
  return "●".repeat(digits.length - 4) + digits.slice(-4);
}

// ── Shared input styles ──
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: `1.5px solid ${BORDER}`,
  borderRadius: 8, fontSize: 14, color: "#1f2937", background: "white",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5,
};

const errorStyle: React.CSSProperties = {
  color: "#dc2626", fontSize: 12, marginTop: 3,
};

const cardStyle: React.CSSProperties = {
  background: "white", borderRadius: 12, border: `1px solid ${BORDER}`,
  padding: "24px 28px", marginBottom: 20,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

// ── Field group ──
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: PRIMARY, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// ── File Upload Zone ──
function FileUpload({ label, required, accept, value, onChange, error }: {
  label: string; required?: boolean; accept: string;
  value: File | null; onChange: (f: File | null) => void; error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: PRIMARY, marginLeft: 3 }}>*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${error ? "#dc2626" : value ? PRIMARY : BORDER}`,
          borderRadius: 10, padding: "20px 16px", textAlign: "center",
          cursor: "pointer", background: value ? PRIMARY_LIGHT : "#fafafa",
          transition: "all 0.2s",
        }}
      >
        {value ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <CheckCircle size={18} color={PRIMARY} />
            <span style={{ fontSize: 13, color: PRIMARY_DARK, fontWeight: 600 }}>{value.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={20} color="#9ca3af" style={{ margin: "0 auto 6px" }} />
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Click to upload</p>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0" }}>JPG, PNG, PDF · Max 10MB</p>
          </>
        )}
        <input
          ref={inputRef} type="file" accept={accept} style={{ display: "none" }}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// ── Masked Input ──
function MaskedInput({ value, rawValue, visible, onToggle, onChange, placeholder, error }: {
  value: string; rawValue: string; visible: boolean;
  onToggle: () => void; onChange: (raw: string) => void;
  placeholder?: string; error?: string;
}) {
  return (
    <div>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          value={visible ? rawValue : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingRight: 42, borderColor: error ? "#dc2626" : BORDER }}
          onFocus={(e) => { e.currentTarget.style.borderColor = PRIMARY; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#dc2626" : BORDER; }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4,
          }}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// ── Grid helper ──
function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0 20px" }}>
      {children}
    </div>
  );
}

// ── Section heading ──
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px", borderBottom: `1px solid ${BORDER}`, paddingBottom: 10 }}>
      {children}
    </h3>
  );
}

// ── Bank Account Fields ──
function BankFields({ data, onChange, prefix, errors }: {
  data: BankAccount;
  onChange: (updates: Partial<BankAccount>) => void;
  prefix: string;
  errors: Record<string, string>;
}) {
  return (
    <>
      <Grid2>
        <Field label="Bank Name" required error={errors[`${prefix}bankName`]}>
          <input style={{ ...inputStyle, borderColor: errors[`${prefix}bankName`] ? "#dc2626" : BORDER }}
            value={data.bankName} onChange={e => onChange({ bankName: e.target.value })}
            onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
            onBlur={e => { e.currentTarget.style.borderColor = errors[`${prefix}bankName`] ? "#dc2626" : BORDER; }} />
        </Field>
        <Field label="Account Type" required error={errors[`${prefix}accountType`]}>
          <select
            style={{ ...inputStyle, borderColor: errors[`${prefix}accountType`] ? "#dc2626" : BORDER }}
            value={data.accountType}
            onChange={e => onChange({ accountType: e.target.value })}
          >
            <option value="">Select…</option>
            <option>Checking</option>
            <option>Savings</option>
          </select>
        </Field>
      </Grid2>
      <Grid2>
        <Field label="Routing Number" required error={errors[`${prefix}routingNumber`]}>
          <input style={{ ...inputStyle, borderColor: errors[`${prefix}routingNumber`] ? "#dc2626" : BORDER }}
            value={data.routingNumber}
            onChange={e => onChange({ routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9) })}
            placeholder="9 digits" maxLength={9}
            onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
            onBlur={e => { e.currentTarget.style.borderColor = errors[`${prefix}routingNumber`] ? "#dc2626" : BORDER; }} />
        </Field>
        <Field label="Account Number" required error={errors[`${prefix}accountNumber`]}>
          <MaskedInput
            rawValue={data.accountNumberRaw}
            value={data.accountNumber}
            visible={data.accountNumberVisible}
            onToggle={() => onChange({ accountNumberVisible: !data.accountNumberVisible })}
            onChange={(raw) => onChange({ accountNumberRaw: raw, accountNumber: maskAccount(raw) })}
            error={errors[`${prefix}accountNumber`]}
          />
        </Field>
      </Grid2>
    </>
  );
}

// ── Review Row ──
function ReviewRow({ label, value }: { label: string; value?: string | boolean }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: `1px solid #f3f4f6` }}>
      <span style={{ fontSize: 13, color: "#6b7280", minWidth: 180, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#1f2937", fontWeight: 500 }}>
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function MerchantApplyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const update = useCallback((updates: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  const updateOwner = useCallback((idx: number, updates: Partial<OwnerInfo>) => {
    setForm(prev => {
      const owners = [...prev.owners];
      owners[idx] = { ...owners[idx], ...updates };
      return { ...prev, owners };
    });
  }, []);

  const updateDeposit = useCallback((updates: Partial<BankAccount>) => {
    setForm(prev => ({ ...prev, deposit: { ...prev.deposit, ...updates } }));
  }, []);

  const updateWithdrawal = useCallback((updates: Partial<BankAccount>) => {
    setForm(prev => ({ ...prev, withdrawal: { ...prev.withdrawal, ...updates } }));
  }, []);

  // ── Validation ──
  function validateStep(s: number): Record<string, string> {
    const errs: Record<string, string> = {};
    const req = (key: string, val: string | undefined, label: string) => {
      if (!val?.trim()) errs[key] = `${label} is required`;
    };
    const email = (key: string, val: string | undefined) => {
      if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) errs[key] = "Invalid email address";
    };
    const phone = (key: string, val: string | undefined) => {
      if (val && val.replace(/\D/g, "").length < 10) errs[key] = "Enter a valid phone number";
    };

    if (s === 1) {
      req("legalName", form.legalName, "Business Legal Name");
      req("taxFilingMethod", form.taxFilingMethod, "Tax Filing Method");
      req("taxId", form.taxId, "Tax ID");
      req("bizType", form.bizType, "Type of Ownership");
      req("bizStartDate", form.bizStartDate, "Business Start Date");
      req("bizStreet", form.bizStreet, "Street Address");
      req("bizCity", form.bizCity, "City");
      req("bizState", form.bizState, "State");
      req("bizZip", form.bizZip, "ZIP Code");
      req("bizPhone", form.bizPhone, "Business Phone");
      req("bizEmail", form.bizEmail, "Business Email");
      req("bizDescription", form.bizDescription, "Business Description");
      email("bizEmail", form.bizEmail);
      phone("bizPhone", form.bizPhone);
      if (form.bizZip && !/^\d{5}$/.test(form.bizZip)) errs["bizZip"] = "Enter a valid 5-digit ZIP";
      if (form.mailingDifferent) {
        req("mailStreet", form.mailStreet, "Mailing Street");
        req("mailCity", form.mailCity, "Mailing City");
        req("mailState", form.mailState, "Mailing State");
        req("mailZip", form.mailZip, "Mailing ZIP");
        if (form.mailZip && !/^\d{5}$/.test(form.mailZip)) errs["mailZip"] = "Enter a valid 5-digit ZIP";
      }
    }

    if (s === 2) {
      form.owners.forEach((o, i) => {
        const p = `owner${i}_`;
        req(`${p}firstName`, o.firstName, "First Name");
        req(`${p}lastName`, o.lastName, "Last Name");
        req(`${p}title`, o.title, "Title");
        req(`${p}ownership`, o.ownership, "Ownership %");
        req(`${p}ssn`, o.ssnRaw, "SSN");
        req(`${p}dob`, o.dob, "Date of Birth");
        req(`${p}phone`, o.phone, "Mobile Phone");
        req(`${p}email`, o.email, "Email");
        req(`${p}street`, o.street, "Street Address");
        req(`${p}city`, o.city, "City");
        req(`${p}state`, o.state, "State");
        req(`${p}zip`, o.zip, "ZIP Code");
        req(`${p}dlNumber`, o.dlNumber, "DL Number");
        req(`${p}dlState`, o.dlState, "DL State");
        if (!o.dlPhoto) errs[`${p}dlPhoto`] = "Driver's License photo is required";
        email(`${p}email`, o.email);
        phone(`${p}phone`, o.phone);
        if (o.ssnRaw && o.ssnRaw.replace(/\D/g, "").length !== 9) errs[`${p}ssn`] = "Enter a valid 9-digit SSN";
        if (o.zip && !/^\d{5}$/.test(o.zip)) errs[`${p}zip`] = "Enter a valid 5-digit ZIP";
        const pct = parseFloat(o.ownership);
        if (o.ownership && (isNaN(pct) || pct < 1 || pct > 100)) errs[`${p}ownership`] = "Must be 1–100%";
      });
    }

    if (s === 3) {
      req("depositBankName", form.deposit.bankName, "Bank Name");
      req("depositAccountType", form.deposit.accountType, "Account Type");
      req("depositRoutingNumber", form.deposit.routingNumber, "Routing Number");
      req("depositAccountNumber", form.deposit.accountNumberRaw, "Account Number");
      if (!form.voidedCheck) errs["voidedCheck"] = "Voided check is required";
      if (form.deposit.routingNumber && !/^\d{9}$/.test(form.deposit.routingNumber)) errs["depositRoutingNumber"] = "Routing number must be 9 digits";
      if (form.withdrawalDifferent) {
        req("withdrawalBankName", form.withdrawal.bankName, "Bank Name");
        req("withdrawalAccountType", form.withdrawal.accountType, "Account Type");
        req("withdrawalRoutingNumber", form.withdrawal.routingNumber, "Routing Number");
        req("withdrawalAccountNumber", form.withdrawal.accountNumberRaw, "Account Number");
        if (form.withdrawal.routingNumber && !/^\d{9}$/.test(form.withdrawal.routingNumber)) errs["withdrawalRoutingNumber"] = "Routing number must be 9 digits";
      }
    }

    if (s === 4) {
      req("avgMonthlyVolume", form.avgMonthlyVolume, "Average Monthly Card Volume");
      req("avgTransaction", form.avgTransaction, "Average Transaction Amount");
      req("deliveryWindow", form.deliveryWindow, "Delivery Window");
      const sum = (parseFloat(form.inPerson) || 0) + (parseFloat(form.telephone) || 0) + (parseFloat(form.online) || 0);
      if (sum !== 100) errs["transactionMode"] = "Transaction mode percentages must total 100%";
      if (form.hasThirdParty === "yes") {
        req("tppName", form.tppName, "TPP Name");
        req("tppEmail", form.tppEmail, "TPP Email");
        email("tppEmail", form.tppEmail);
      }
    }

    if (s === 5) {
      if (!form.certified) errs["certified"] = "You must certify the information is accurate";
    }

    return errs;
  }

  function handleNext() {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(s => Math.min(s + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(s: number) {
    if (s < step) {
      setStep(s);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateStep(5);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      // Step 1
      fd.append("legalName", form.legalName);
      fd.append("dba", form.dba);
      fd.append("taxFilingMethod", form.taxFilingMethod);
      fd.append("taxId", form.taxId);
      fd.append("taxFilingName", form.taxFilingName);
      fd.append("bizType", form.bizType);
      fd.append("bizStartDate", form.bizStartDate);
      fd.append("bizStreet", form.bizStreet);
      fd.append("bizStreet2", form.bizStreet2);
      fd.append("bizCity", form.bizCity);
      fd.append("bizState", form.bizState);
      fd.append("bizZip", form.bizZip);
      fd.append("bizPhone", form.bizPhone);
      fd.append("bizEmail", form.bizEmail);
      fd.append("website", form.website);
      fd.append("bizDescription", form.bizDescription);
      fd.append("mailingDifferent", String(form.mailingDifferent));
      if (form.mailingDifferent) {
        fd.append("mailStreet", form.mailStreet);
        fd.append("mailStreet2", form.mailStreet2);
        fd.append("mailCity", form.mailCity);
        fd.append("mailState", form.mailState);
        fd.append("mailZip", form.mailZip);
      }
      // Step 2
      form.owners.forEach((o, i) => {
        fd.append(`owner${i}_firstName`, o.firstName);
        fd.append(`owner${i}_lastName`, o.lastName);
        fd.append(`owner${i}_title`, o.title);
        fd.append(`owner${i}_ownership`, o.ownership);
        fd.append(`owner${i}_ssn`, o.ssnRaw);
        fd.append(`owner${i}_dob`, o.dob);
        fd.append(`owner${i}_phone`, o.phone);
        fd.append(`owner${i}_email`, o.email);
        fd.append(`owner${i}_street`, o.street);
        fd.append(`owner${i}_city`, o.city);
        fd.append(`owner${i}_state`, o.state);
        fd.append(`owner${i}_zip`, o.zip);
        fd.append(`owner${i}_dlNumber`, o.dlNumber);
        fd.append(`owner${i}_dlState`, o.dlState);
        fd.append(`owner${i}_personalGuarantee`, String(o.personalGuarantee));
        if (o.dlPhoto) fd.append(`owner${i}_dlPhoto`, o.dlPhoto);
      });
      // Step 3
      fd.append("bankName", form.deposit.bankName);
      fd.append("accountType", form.deposit.accountType);
      fd.append("routingNumber", form.deposit.routingNumber);
      fd.append("accountNumber", form.deposit.accountNumberRaw);
      fd.append("withdrawalDifferent", String(form.withdrawalDifferent));
      if (form.withdrawalDifferent) {
        fd.append("withdrawalBankName", form.withdrawal.bankName);
        fd.append("withdrawalAccountType", form.withdrawal.accountType);
        fd.append("withdrawalRoutingNumber", form.withdrawal.routingNumber);
        fd.append("withdrawalAccountNumber", form.withdrawal.accountNumberRaw);
      }
      if (form.voidedCheck) fd.append("voidedCheck", form.voidedCheck);
      // Step 4
      fd.append("avgMonthlyVolume", form.avgMonthlyVolume);
      fd.append("avgTransactionAmt", form.avgTransaction);
      fd.append("inPerson", form.inPerson);
      fd.append("telephone", form.telephone);
      fd.append("online", form.online);
      fd.append("deliveryWindow", form.deliveryWindow);
      fd.append("hasThirdParty", form.hasThirdParty);
      if (form.hasThirdParty === "yes") {
        fd.append("tppName", form.tppName);
        fd.append("tppEmail", form.tppEmail);
        fd.append("tppPhone", form.tppPhone);
      }

      const res = await fetch("/api/merchant", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setSubmissionId(json.id || "");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Input helpers ──
  function inp(key: keyof FormData, placeholder?: string, type = "text") {
    const val = form[key] as string;
    const err = errors[key as string];
    return (
      <input
        type={type}
        value={val}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => update({ [key]: e.target.value } as Partial<FormData>)}
        style={{ ...inputStyle, borderColor: err ? "#dc2626" : BORDER }}
        onFocus={(e) => { e.currentTarget.style.borderColor = PRIMARY; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = err ? "#dc2626" : BORDER; }}
      />
    );
  }

  function sel(key: keyof FormData, options: string[], placeholder = "Select…") {
    const val = form[key] as string;
    const err = errors[key as string];
    return (
      <select
        value={val}
        onChange={(e) => update({ [key]: e.target.value } as Partial<FormData>)}
        style={{ ...inputStyle, borderColor: err ? "#dc2626" : BORDER }}
        onFocus={(e) => { e.currentTarget.style.borderColor = PRIMARY; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = err ? "#dc2626" : BORDER; }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    );
  }

  // ── Success Screen ──
  if (submitted) {
    return (
      <div className={inter.className} style={{ minHeight: "100vh", background: BG_WARM, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
          <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle size={36} color={PRIMARY} />
            </div>
            <h1 className={playfair.className} style={{ fontSize: 30, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
              Application Submitted!
            </h1>
            <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
              Thank you for applying. We&rsquo;ve received your merchant application and will review it within 1–2 business days.
            </p>
            {submissionId && (
              <div style={{ background: PRIMARY_LIGHT, borderRadius: 10, padding: "14px 20px", marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: PRIMARY_DARK, margin: 0 }}>
                  Reference ID: <strong>{submissionId}</strong>
                </p>
              </div>
            )}
            <p style={{ fontSize: 14, color: "#9ca3af" }}>
              Questions? Contact us at{" "}
              <a href="mailto:info@buildkind.tech" style={{ color: PRIMARY }}>info@buildkind.tech</a>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={inter.className} style={{ minHeight: "100vh", background: BG_WARM, display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 800, width: "100%", margin: "0 auto", padding: "40px 24px 60px" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 className={playfair.className} style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Merchant Application
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>
            Complete all 5 steps to submit your merchant application.
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar step={step} onGoTo={goToStep} />

        {/* Form Card */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ background: CREAM, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

            {/* STEP 1: Business Information */}
            {step === 1 && (
              <div>
                <StepTitle step={1}>Business Information</StepTitle>

                <div style={cardStyle}>
                  <SectionHeading>Legal & Tax Details</SectionHeading>
                  <Grid2>
                    <Field label="Business Legal Name" required error={errors.legalName}>
                      {inp("legalName", "As registered with IRS")}
                    </Field>
                    <Field label="DBA (Doing Business As)">
                      {inp("dba", "If different from legal name")}
                    </Field>
                  </Grid2>
                  <Grid2>
                    <Field label="Tax Filing Method" required error={errors.taxFilingMethod}>
                      {sel("taxFilingMethod", ["EIN", "SSN"])}
                    </Field>
                    <Field label="Tax ID (EIN or SSN)" required error={errors.taxId}>
                      {inp("taxId", "XX-XXXXXXX")}
                    </Field>
                    <Field label="Tax Filing Name">
                      {inp("taxFilingName", "Name on tax return")}
                    </Field>
                  </Grid2>
                  <Grid2>
                    <Field label="Type of Ownership" required error={errors.bizType}>
                      {sel("bizType", OWNERSHIP_TYPES)}
                    </Field>
                    <Field label="Business Start Date" required error={errors.bizStartDate}>
                      {inp("bizStartDate", "", "date")}
                    </Field>
                  </Grid2>
                </div>

                <div style={cardStyle}>
                  <SectionHeading>Business Address</SectionHeading>
                  <Field label="Street Address" required error={errors.bizStreet}>
                    {inp("bizStreet", "123 Main St")}
                  </Field>
                  <Field label="Suite / Unit">
                    {inp("bizStreet2", "Apt, suite, floor (optional)")}
                  </Field>
                  <Grid2>
                    <Field label="City" required error={errors.bizCity}>{inp("bizCity")}</Field>
                    <Field label="State" required error={errors.bizState}>{sel("bizState", US_STATES)}</Field>
                    <Field label="ZIP Code" required error={errors.bizZip}>
                      {inp("bizZip", "75001")}
                    </Field>
                  </Grid2>

                  <div style={{ marginTop: 12, marginBottom: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#374151" }}>
                      <input
                        type="checkbox"
                        checked={form.mailingDifferent}
                        onChange={(e) => update({ mailingDifferent: e.target.checked })}
                        style={{ accentColor: PRIMARY, width: 16, height: 16 }}
                      />
                      Mailing address is different from business address
                    </label>
                  </div>

                  {form.mailingDifferent && (
                    <div style={{ background: PRIMARY_LIGHT, borderRadius: 10, padding: "16px 16px 4px", marginTop: 8 }}>
                      <SectionHeading>Mailing Address</SectionHeading>
                      <Field label="Street" required error={errors.mailStreet}>{inp("mailStreet")}</Field>
                      <Field label="Suite / Unit">{inp("mailStreet2")}</Field>
                      <Grid2>
                        <Field label="City" required error={errors.mailCity}>{inp("mailCity")}</Field>
                        <Field label="State" required error={errors.mailState}>{sel("mailState", US_STATES)}</Field>
                        <Field label="ZIP" required error={errors.mailZip}>{inp("mailZip")}</Field>
                      </Grid2>
                    </div>
                  )}
                </div>

                <div style={cardStyle}>
                  <SectionHeading>Contact & Details</SectionHeading>
                  <Grid2>
                    <Field label="Business Phone" required error={errors.bizPhone}>{inp("bizPhone", "(555) 000-0000", "tel")}</Field>
                    <Field label="Business Email" required error={errors.bizEmail}>{inp("bizEmail", "contact@business.com", "email")}</Field>
                    <Field label="Website URL">{inp("website", "https://yourbusiness.com")}</Field>
                  </Grid2>
                  <Field label="Business Description" required error={errors.bizDescription}>
                    <textarea
                      value={form.bizDescription}
                      onChange={(e) => update({ bizDescription: e.target.value })}
                      rows={3}
                      placeholder="Describe your products/services…"
                      style={{ ...inputStyle, resize: "vertical", borderColor: errors.bizDescription ? "#dc2626" : BORDER }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = PRIMARY; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = errors.bizDescription ? "#dc2626" : BORDER; }}
                    />
                    {errors.bizDescription && <p style={errorStyle}>{errors.bizDescription}</p>}
                  </Field>
                </div>
              </div>
            )}

            {/* STEP 2: Owner Information */}
            {step === 2 && (
              <div>
                <StepTitle step={2}>Owner Information</StepTitle>
                {form.owners.map((owner, idx) => (
                  <div key={idx} style={{ ...cardStyle, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                        {idx === 0 ? "Primary Owner" : `Owner ${idx + 1}`}
                      </h3>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setForm(prev => ({ ...prev, owners: prev.owners.filter((_, i) => i !== idx) }));
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </div>

                    <SectionHeading>Personal Information</SectionHeading>
                    <Grid2>
                      <Field label="First Name" required error={errors[`owner${idx}_firstName`]}>
                        <input style={{ ...inputStyle, borderColor: errors[`owner${idx}_firstName`] ? "#dc2626" : BORDER }}
                          value={owner.firstName}
                          onChange={e => updateOwner(idx, { firstName: e.target.value })}
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_firstName`] ? "#dc2626" : BORDER; }} />
                      </Field>
                      <Field label="Last Name" required error={errors[`owner${idx}_lastName`]}>
                        <input style={{ ...inputStyle, borderColor: errors[`owner${idx}_lastName`] ? "#dc2626" : BORDER }}
                          value={owner.lastName}
                          onChange={e => updateOwner(idx, { lastName: e.target.value })}
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_lastName`] ? "#dc2626" : BORDER; }} />
                      </Field>
                      <Field label="Title" required error={errors[`owner${idx}_title`]}>
                        <select
                          style={{ ...inputStyle, borderColor: errors[`owner${idx}_title`] ? "#dc2626" : BORDER }}
                          value={owner.title}
                          onChange={e => updateOwner(idx, { title: e.target.value })}
                        >
                          <option value="">Select…</option>
                          {OWNER_TITLES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </Field>
                      <Field label="% Ownership" required error={errors[`owner${idx}_ownership`]}>
                        <input type="number" min={1} max={100}
                          style={{ ...inputStyle, borderColor: errors[`owner${idx}_ownership`] ? "#dc2626" : BORDER }}
                          value={owner.ownership}
                          onChange={e => updateOwner(idx, { ownership: e.target.value })}
                          placeholder="e.g. 50"
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_ownership`] ? "#dc2626" : BORDER; }} />
                      </Field>
                    </Grid2>

                    <Grid2>
                      <Field label="Social Security Number (SSN)" required error={errors[`owner${idx}_ssn`]}>
                        <MaskedInput
                          rawValue={owner.ssnRaw}
                          value={owner.ssn}
                          visible={owner.ssnVisible}
                          onToggle={() => updateOwner(idx, { ssnVisible: !owner.ssnVisible })}
                          onChange={(raw) => {
                            const digits = raw.replace(/\D/g, "").slice(0, 9);
                            updateOwner(idx, { ssnRaw: digits, ssn: maskSSN(digits) });
                          }}
                          placeholder="●●●-●●-●●●●"
                          error={errors[`owner${idx}_ssn`]}
                        />
                      </Field>
                      <Field label="Date of Birth" required error={errors[`owner${idx}_dob`]}>
                        <input type="date"
                          style={{ ...inputStyle, borderColor: errors[`owner${idx}_dob`] ? "#dc2626" : BORDER }}
                          value={owner.dob}
                          onChange={e => updateOwner(idx, { dob: e.target.value })}
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_dob`] ? "#dc2626" : BORDER; }} />
                      </Field>
                      <Field label="Mobile Phone" required error={errors[`owner${idx}_phone`]}>
                        <input type="tel"
                          style={{ ...inputStyle, borderColor: errors[`owner${idx}_phone`] ? "#dc2626" : BORDER }}
                          value={owner.phone}
                          onChange={e => updateOwner(idx, { phone: e.target.value })}
                          placeholder="(555) 000-0000"
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_phone`] ? "#dc2626" : BORDER; }} />
                      </Field>
                      <Field label="Email" required error={errors[`owner${idx}_email`]}>
                        <input type="email"
                          style={{ ...inputStyle, borderColor: errors[`owner${idx}_email`] ? "#dc2626" : BORDER }}
                          value={owner.email}
                          onChange={e => updateOwner(idx, { email: e.target.value })}
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_email`] ? "#dc2626" : BORDER; }} />
                      </Field>
                    </Grid2>

                    <SectionHeading>Home Address</SectionHeading>
                    <Field label="Street" required error={errors[`owner${idx}_street`]}>
                      <input style={{ ...inputStyle, borderColor: errors[`owner${idx}_street`] ? "#dc2626" : BORDER }}
                        value={owner.street}
                        onChange={e => updateOwner(idx, { street: e.target.value })}
                        onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                        onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_street`] ? "#dc2626" : BORDER; }} />
                    </Field>
                    <Grid2>
                      <Field label="City" required error={errors[`owner${idx}_city`]}>
                        <input style={{ ...inputStyle, borderColor: errors[`owner${idx}_city`] ? "#dc2626" : BORDER }}
                          value={owner.city}
                          onChange={e => updateOwner(idx, { city: e.target.value })}
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_city`] ? "#dc2626" : BORDER; }} />
                      </Field>
                      <Field label="State" required error={errors[`owner${idx}_state`]}>
                        <select style={{ ...inputStyle, borderColor: errors[`owner${idx}_state`] ? "#dc2626" : BORDER }}
                          value={owner.state}
                          onChange={e => updateOwner(idx, { state: e.target.value })}>
                          <option value="">Select…</option>
                          {US_STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="ZIP Code" required error={errors[`owner${idx}_zip`]}>
                        <input style={{ ...inputStyle, borderColor: errors[`owner${idx}_zip`] ? "#dc2626" : BORDER }}
                          value={owner.zip} maxLength={5}
                          onChange={e => updateOwner(idx, { zip: e.target.value.replace(/\D/g, "").slice(0, 5) })}
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_zip`] ? "#dc2626" : BORDER; }} />
                      </Field>
                    </Grid2>

                    <SectionHeading>Driver&apos;s License</SectionHeading>
                    <Grid2>
                      <Field label="DL Number" required error={errors[`owner${idx}_dlNumber`]}>
                        <input style={{ ...inputStyle, borderColor: errors[`owner${idx}_dlNumber`] ? "#dc2626" : BORDER }}
                          value={owner.dlNumber}
                          onChange={e => updateOwner(idx, { dlNumber: e.target.value })}
                          onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                          onBlur={e => { e.currentTarget.style.borderColor = errors[`owner${idx}_dlNumber`] ? "#dc2626" : BORDER; }} />
                      </Field>
                      <Field label="DL State" required error={errors[`owner${idx}_dlState`]}>
                        <select style={{ ...inputStyle, borderColor: errors[`owner${idx}_dlState`] ? "#dc2626" : BORDER }}
                          value={owner.dlState}
                          onChange={e => updateOwner(idx, { dlState: e.target.value })}>
                          <option value="">Select…</option>
                          {US_STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                    </Grid2>

                    <FileUpload
                      label="Driver's License Photo"
                      required
                      accept="image/jpeg,image/png,application/pdf"
                      value={owner.dlPhoto}
                      onChange={(f) => updateOwner(idx, { dlPhoto: f })}
                      error={errors[`owner${idx}_dlPhoto`]}
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#374151", marginTop: 8 }}>
                      <input
                        type="checkbox"
                        checked={owner.personalGuarantee}
                        onChange={e => updateOwner(idx, { personalGuarantee: e.target.checked })}
                        style={{ accentColor: PRIMARY, width: 16, height: 16 }}
                      />
                      This owner provides a personal guarantee
                    </label>
                  </div>
                ))}

                {form.owners.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, owners: [...prev.owners, blankOwner()] }))}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                      background: "white", border: `2px dashed ${PRIMARY}`, borderRadius: 10,
                      color: PRIMARY_DARK, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%",
                      justifyContent: "center", marginTop: 4,
                    }}
                  >
                    <Plus size={16} /> Add Additional Owner
                  </button>
                )}
              </div>
            )}

            {/* STEP 3: Banking Information */}
            {step === 3 && (
              <div>
                <StepTitle step={3}>Banking Information</StepTitle>
                <div style={cardStyle}>
                  <SectionHeading>Deposit Account</SectionHeading>
                  <BankFields data={form.deposit} onChange={updateDeposit} prefix="deposit" errors={errors} />
                  <FileUpload
                    label="Voided Check"
                    required
                    accept="image/jpeg,image/png,application/pdf"
                    value={form.voidedCheck}
                    onChange={(f) => update({ voidedCheck: f })}
                    error={errors.voidedCheck}
                  />

                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#374151" }}>
                      <input
                        type="checkbox"
                        checked={form.withdrawalDifferent}
                        onChange={(e) => update({ withdrawalDifferent: e.target.checked })}
                        style={{ accentColor: PRIMARY, width: 16, height: 16 }}
                      />
                      Withdrawal account is different from deposit account
                    </label>
                  </div>
                </div>

                {form.withdrawalDifferent && (
                  <div style={cardStyle}>
                    <SectionHeading>Withdrawal Account</SectionHeading>
                    <BankFields data={form.withdrawal} onChange={updateWithdrawal} prefix="withdrawal" errors={errors} />
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Processing Details */}
            {step === 4 && (
              <div>
                <StepTitle step={4}>Processing Details</StepTitle>
                <div style={cardStyle}>
                  <SectionHeading>Volume & Transactions</SectionHeading>
                  <Grid2>
                    <Field label="Avg Monthly Card Volume ($)" required error={errors.avgMonthlyVolume}>
                      <input type="number" min={0}
                        style={{ ...inputStyle, borderColor: errors.avgMonthlyVolume ? "#dc2626" : BORDER }}
                        value={form.avgMonthlyVolume}
                        onChange={e => update({ avgMonthlyVolume: e.target.value })}
                        placeholder="e.g. 15000"
                        onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                        onBlur={e => { e.currentTarget.style.borderColor = errors.avgMonthlyVolume ? "#dc2626" : BORDER; }} />
                    </Field>
                    <Field label="Avg Transaction Amount ($)" required error={errors.avgTransaction}>
                      <input type="number" min={0}
                        style={{ ...inputStyle, borderColor: errors.avgTransaction ? "#dc2626" : BORDER }}
                        value={form.avgTransaction}
                        onChange={e => update({ avgTransaction: e.target.value })}
                        placeholder="e.g. 125"
                        onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                        onBlur={e => { e.currentTarget.style.borderColor = errors.avgTransaction ? "#dc2626" : BORDER; }} />
                    </Field>
                  </Grid2>
                </div>

                <div style={cardStyle}>
                  <SectionHeading>Mode of Transaction (must total 100%)</SectionHeading>
                  {errors.transactionMode && (
                    <p style={{ ...errorStyle, marginBottom: 12 }}>{errors.transactionMode}</p>
                  )}
                  <Grid2>
                    {(["inPerson", "telephone", "online"] as const).map((k, i) => {
                      const labels = ["In Person (%)", "Telephone (%)", "Online (%)"];
                      return (
                        <Field key={k} label={labels[i]}>
                          <input type="number" min={0} max={100}
                            style={{ ...inputStyle, borderColor: errors.transactionMode ? "#dc2626" : BORDER }}
                            value={form[k]}
                            onChange={e => update({ [k]: e.target.value } as Partial<FormData>)}
                            placeholder="0"
                            onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; }}
                            onBlur={e => { e.currentTarget.style.borderColor = errors.transactionMode ? "#dc2626" : BORDER; }} />
                        </Field>
                      );
                    })}
                  </Grid2>
                  <div style={{ textAlign: "right", fontSize: 13, color: "#6b7280" }}>
                    Total: <strong style={{
                      color: (parseFloat(form.inPerson) || 0) + (parseFloat(form.telephone) || 0) + (parseFloat(form.online) || 0) === 100
                        ? "#16a34a" : "#dc2626"
                    }}>
                      {(parseFloat(form.inPerson) || 0) + (parseFloat(form.telephone) || 0) + (parseFloat(form.online) || 0)}%
                    </strong>
                  </div>
                </div>

                <div style={cardStyle}>
                  <SectionHeading>Delivery & Third Party</SectionHeading>
                  <Field label="Product/Service Delivery Window" required error={errors.deliveryWindow}>
                    {sel("deliveryWindow", DELIVERY_WINDOWS)}
                  </Field>

                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Third Party Processor (TPP)?</label>
                    <div style={{ display: "flex", gap: 24 }}>
                      {["yes", "no"].map(v => (
                        <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#374151" }}>
                          <input
                            type="radio" name="hasThirdParty" value={v}
                            checked={form.hasThirdParty === v}
                            onChange={() => update({ hasThirdParty: v })}
                            style={{ accentColor: PRIMARY }}
                          />
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>

                  {form.hasThirdParty === "yes" && (
                    <div style={{ background: PRIMARY_LIGHT, borderRadius: 10, padding: "16px 16px 4px" }}>
                      <Grid2>
                        <Field label="TPP Name" required error={errors.tppName}>
                          {inp("tppName")}
                        </Field>
                        <Field label="TPP Email" required error={errors.tppEmail}>
                          {inp("tppEmail", "", "email")}
                        </Field>
                        <Field label="TPP Phone">
                          {inp("tppPhone", "(555) 000-0000", "tel")}
                        </Field>
                      </Grid2>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: Review & Submit */}
            {step === 5 && (
              <div>
                <StepTitle step={5}>Review & Submit</StepTitle>

                {/* Business Info Review */}
                <div style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1f2937" }}>Business Information</h3>
                    <button type="button" onClick={() => goToStep(1)}
                      style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: PRIMARY_DARK, cursor: "pointer", fontWeight: 600 }}>
                      Edit
                    </button>
                  </div>
                  <ReviewRow label="Legal Name" value={form.legalName} />
                  {form.dba && <ReviewRow label="DBA" value={form.dba} />}
                  <ReviewRow label="Tax Filing Method" value={form.taxFilingMethod} />
                  <ReviewRow label="Tax ID" value={"●●●●●" + form.taxId.slice(-4)} />
                  <ReviewRow label="Type of Ownership" value={form.bizType} />
                  <ReviewRow label="Business Start Date" value={form.bizStartDate} />
                  <ReviewRow label="Business Address" value={[form.bizStreet, form.bizStreet2, form.bizCity, form.bizState, form.bizZip].filter(Boolean).join(", ")} />
                  <ReviewRow label="Phone" value={form.bizPhone} />
                  <ReviewRow label="Email" value={form.bizEmail} />
                  {form.website && <ReviewRow label="Website" value={form.website} />}
                  <ReviewRow label="Description" value={form.bizDescription} />
                </div>

                {/* Owner Info Review */}
                {form.owners.map((o, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1f2937" }}>
                        {i === 0 ? "Primary Owner" : `Owner ${i + 1}`}
                      </h3>
                      <button type="button" onClick={() => goToStep(2)}
                        style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: PRIMARY_DARK, cursor: "pointer", fontWeight: 600 }}>
                        Edit
                      </button>
                    </div>
                    <ReviewRow label="Name" value={`${o.firstName} ${o.lastName}`} />
                    <ReviewRow label="Title" value={o.title} />
                    <ReviewRow label="Ownership" value={`${o.ownership}%`} />
                    <ReviewRow label="SSN" value={o.ssnRaw.length >= 4 ? `●●●-●●-${o.ssnRaw.slice(-4)}` : "●●●●●●●●●"} />
                    <ReviewRow label="Date of Birth" value={o.dob} />
                    <ReviewRow label="Phone" value={o.phone} />
                    <ReviewRow label="Email" value={o.email} />
                    <ReviewRow label="Home Address" value={[o.street, o.city, o.state, o.zip].filter(Boolean).join(", ")} />
                    <ReviewRow label="DL Number" value={`●●●${o.dlNumber.slice(-3)}`} />
                    <ReviewRow label="DL State" value={o.dlState} />
                    {o.personalGuarantee && <ReviewRow label="Personal Guarantee" value={true} />}
                    {o.dlPhoto && <ReviewRow label="DL Photo" value={o.dlPhoto.name} />}
                  </div>
                ))}

                {/* Banking Review */}
                <div style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1f2937" }}>Banking Information</h3>
                    <button type="button" onClick={() => goToStep(3)}
                      style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: PRIMARY_DARK, cursor: "pointer", fontWeight: 600 }}>
                      Edit
                    </button>
                  </div>
                  <ReviewRow label="Bank Name" value={form.deposit.bankName} />
                  <ReviewRow label="Account Type" value={form.deposit.accountType} />
                  <ReviewRow label="Routing Number" value={`●●●●●${form.deposit.routingNumber.slice(-4)}`} />
                  <ReviewRow label="Account Number" value={form.deposit.accountNumberRaw.length > 4 ? `●●●●${form.deposit.accountNumberRaw.slice(-4)}` : "●●●●"} />
                  {form.voidedCheck && <ReviewRow label="Voided Check" value={form.voidedCheck.name} />}
                  {form.withdrawalDifferent && (
                    <>
                      <div style={{ margin: "12px 0 8px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Withdrawal Account</div>
                      <ReviewRow label="Bank Name" value={form.withdrawal.bankName} />
                      <ReviewRow label="Account Type" value={form.withdrawal.accountType} />
                      <ReviewRow label="Routing Number" value={`●●●●●${form.withdrawal.routingNumber.slice(-4)}`} />
                      <ReviewRow label="Account Number" value={form.withdrawal.accountNumberRaw.length > 4 ? `●●●●${form.withdrawal.accountNumberRaw.slice(-4)}` : "●●●●"} />
                    </>
                  )}
                </div>

                {/* Processing Review */}
                <div style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1f2937" }}>Processing Details</h3>
                    <button type="button" onClick={() => goToStep(4)}
                      style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: PRIMARY_DARK, cursor: "pointer", fontWeight: 600 }}>
                      Edit
                    </button>
                  </div>
                  <ReviewRow label="Avg Monthly Volume" value={`$${form.avgMonthlyVolume}`} />
                  <ReviewRow label="Avg Transaction" value={`$${form.avgTransaction}`} />
                  <ReviewRow label="In Person" value={`${form.inPerson}%`} />
                  <ReviewRow label="Telephone" value={`${form.telephone}%`} />
                  <ReviewRow label="Online" value={`${form.online}%`} />
                  <ReviewRow label="Delivery Window" value={form.deliveryWindow} />
                  <ReviewRow label="Third Party Provider" value={form.hasThirdParty === "yes" ? "Yes" : "No"} />
                  {form.hasThirdParty === "yes" && <ReviewRow label="TPP Name" value={form.tppName} />}
                </div>

                {/* Certification */}
                <div style={{ ...cardStyle, background: PRIMARY_LIGHT, border: `1.5px solid ${PRIMARY}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Lock size={20} color={PRIMARY} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={form.certified}
                          onChange={e => update({ certified: e.target.checked })}
                          style={{ accentColor: PRIMARY, width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                          I certify that all information provided in this application is true, complete, and accurate to the best of my knowledge. I understand that any misrepresentation may result in the denial or termination of merchant services.
                        </span>
                      </label>
                      {errors.certified && <p style={{ ...errorStyle, marginTop: 8 }}>{errors.certified}</p>}
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "16px 0", padding: "10px 20px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                  <Lock size={14} color="#16a34a" />
                  <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                    AES-256 encrypted · Secure submission · SSL protected
                  </span>
                </div>

                {errors.submit && (
                  <p style={{ ...errorStyle, textAlign: "center", marginBottom: 12, fontSize: 14 }}>{errors.submit}</p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, gap: 12 }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: step > 1 ? "flex" : "none",
                alignItems: "center", gap: 6, padding: "12px 24px",
                background: "white", border: `1.5px solid ${BORDER}`, borderRadius: 10,
                fontSize: 15, fontWeight: 600, color: "#374151", cursor: "pointer",
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <div style={{ flex: 1 }} />

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "12px 28px",
                  background: PRIMARY, border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 700, color: "white", cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(217,119,6,0.3)",
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "13px 32px",
                  background: submitting ? "#9ca3af" : PRIMARY, border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 700, color: "white", cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 3px 10px rgba(217,119,6,0.3)",
                }}
              >
                {submitting ? "Submitting…" : (
                  <><Lock size={16} /> Submit Application</>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ──
function Header() {
  return (
    <header style={{
      background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
      borderBottom: `1px solid ${BORDER}`, padding: "0 24px",
      display: "flex", alignItems: "center", height: 68, flexShrink: 0,
    }}>
      <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", display: "flex", alignItems: "center" }}>
        <Image
          src="/assets/buildkind-logo.jpeg"
          alt="BuildKind Tech"
          width={120} height={48}
          style={{ borderRadius: 6, objectFit: "contain", height: 44, width: "auto" }}
        />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#1f2937", color: "#9ca3af", textAlign: "center",
      padding: "20px 24px", fontSize: 13, lineHeight: 1.8,
    }}>
      <p style={{ margin: 0 }}>
        BuildKind Tech LLC &nbsp;|&nbsp; Secure Merchant Application &nbsp;|&nbsp;{" "}
        <a href="mailto:info@buildkind.tech" style={{ color: "#d1d5db", textDecoration: "none" }}>
          info@buildkind.tech
        </a>
        {" "}&nbsp;|&nbsp; (469) 613-2763
      </p>
    </footer>
  );
}

function ProgressBar({ step, onGoTo }: { step: number; onGoTo: (s: number) => void }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {/* Connector line */}
        <div style={{
          position: "absolute", top: 18, left: "10%", right: "10%",
          height: 2, background: BORDER, zIndex: 0,
        }} />
        <div style={{
          position: "absolute", top: 18, left: "10%",
          width: `${Math.max(0, (step - 1) / 4 * 80)}%`,
          height: 2, background: PRIMARY, zIndex: 1, transition: "width 0.4s ease",
        }} />

        {STEP_LABELS.map((label, i) => {
          const s = i + 1;
          const isActive = s === step;
          const isComplete = s < step;
          return (
            <div key={s}
              onClick={() => s < step && onGoTo(s)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2,
                flex: 1, cursor: s < step ? "pointer" : "default",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isComplete ? PRIMARY : isActive ? PRIMARY : "white",
                border: `2px solid ${isComplete || isActive ? PRIMARY : BORDER}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: isComplete || isActive ? "white" : "#9ca3af",
                transition: "all 0.3s", marginBottom: 8,
                boxShadow: isActive ? "0 0 0 4px rgba(217,119,6,0.2)" : "none",
              }}>
                {isComplete ? "✓" : s}
              </div>
              <span style={{
                fontSize: 11, fontWeight: isActive ? 700 : 500,
                color: isActive ? PRIMARY_DARK : isComplete ? PRIMARY : "#9ca3af",
                textAlign: "center", lineHeight: 1.3,
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepTitle({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: PRIMARY_LIGHT, borderRadius: 999, marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY_DARK }}>Step {step} of 5</span>
      </div>
      <h2 className={playfair.className} style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#111827", margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}
