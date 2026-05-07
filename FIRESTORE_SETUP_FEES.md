F# Fee Collections (Director → Student fee recording)

This file documents the **exact Firestore collections** and **fields** used by:

- `director.html` (Director records fees)
- `teacher-portal.html` (Teacher views/updates finance records)

When the director records a fee, the app writes to:

- `fee_payments` (payment history log)
- `finance` (aggregated totals used for status/balance)

---

## 1) `fee_payments` (Collection) ✅ created when director clicks **Save Payment**

**Purpose:** Store each individual payment record (history).

**Document shape (fields written by `saveFeePayment()`):**

- `student_name` : `String` (student name typed/selected)
- `student_id` : `String` (the selected student’s `users/{uid}` id) or `null`
- `amount` : `Number`
- `date` : `String` (from `<input type="date">`, e.g. `2025-05-06`)
- `method` : `String` (M-Pesa/Cash/Bank Transfer/Cheque)
- `reference` : `String` (receipt/mpesa reference)
- `recorded_by` : `String` (DIRECTOR.uid)
- `createdAt` : `Timestamp` (via `serverTimestamp()`)

**Write location in code:**
`addDoc(collection(db, "fee_payments"), payData)`

---

## 2) `finance` (Collection) ✅ updated/created for balance shown in portals

**Purpose:** Keep the **aggregated finance state per student** so student/director screens can compute balance.

**Document ID:** `finance/{autoDocId}` (code uses `addDoc` and `doc(db, "finance", existing.id)`)

**Fields written/updated by `saveFeePayment()`**

### If finance record exists (update)

- `total_paid` : `Number` (existing + new payment amount)
- `payment_history` : `Array` (push new entry)
- `updatedAt` : `Timestamp`

### If finance record does NOT exist (create)

- `student_id` : `String` (student uid)
- `studentName` : `String`
- `studentClass` : `String`
- `total_paid` : `Number` (initial = payment amount)
- `termly_total` : `Number` (from `SCHOOL_SETTINGS.termFee` or default `11400`)
- `payment_history` : `Array` of objects:
  - `{ date: Date, mode: String, amount: Number, ref: String }`
- `updatedAt` : `Timestamp`

**Write location in code:**

- Create: `addDoc(collection(db, "finance"), newFin)`
- Update: `updateDoc(doc(db, "finance", existing.id), { ... })`

---

## 3) `users` (Collection) ✅ needed for director to select the student

**Purpose:** Director loads students using:

- `users` where `role == "student"`

**At minimum, each student document should include: **

- `fullName` or `full_name`
- `adm_number`
- `class_stream`
- `gender`
- `parent_email`

---

4. `settings` (Collection) ✅ needed for term fee amount

Director reads:

- `settings/school`

**At minimum:**

- `termFee` : `Number`

If `termFee` isn’t present, the UI falls back to **11400**.

---

## Why director payments may not show in Student Portal (common mismatch)

Student portal does **NOT** read `fee_payments`. It reads the **aggregated** document:

- `finance/{student_uid}`

So if `finance/{student_uid}` isn’t created/updated (for example, if director can’t match the selected student to `users/{uid}`), then payments appear in `fee_payments` but **students won’t see them**.

---

## Resulting behavior (Director fee entry)

1. Director selects student in modal.
2. Clicks **Save Payment**.
3. A row is inserted into **`fee_payments`**.
4. **`finance`** for that student is created/updated.
5. Fee tables and balances update (because director also calls `renderFees()`).
