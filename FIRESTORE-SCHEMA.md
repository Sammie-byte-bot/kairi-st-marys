now inrri St Mary's School Portal — Firestore Schema

**Live System Structure** — All portals (Student/Teacher/Director) use these collections

## 📋 Collections & Document Structure

### 1. `users` (Main user database)

```
users/{uid}
├── role: "student" | "teacher" | "director" | "parent" (REQUIRED)
├── full_name: "John Doe"
├── email: "john@example.com"
├── adm_number: "ADM2025-001" (students only)
├── class_stream: "Grade 7" (students/teachers)
├── gender: "Male" | "Female"
├── parent_email: "parent@example.com" (students only)
├── parent_phone: "+254712345678" (students only)
├── temp_password: "ADM2025-001" (generated on teacher add)
├── phone: "+254712345678"
├── photo_url: "firebase-storage-url"
├── active: true/false
├── createdAt: firebase Timestamp
└── last_login: firebase Timestamp
```

### 2. `grades/{student_uid}`

```
grades/{student_uid}
├── term1: { english: { total: 85, grade: "EE", ... }, maths: {...} }
├── term2: { english: { total: 82, grade: "EE", cat1: 28, cat2: 27, exam: 27, ... } }
└── term3: {...}
```

### 3. `finance/{student_uid}`

```
finance/{student_uid}
├── studentName: "John Doe"
├── studentClass: "Grade 7"
├── totalFee: 11400
├── amountPaid: 8500
├── balance: 2900
├── status: "partial" | "paid" | "unpaid"
├── payments: [
  { date: "2025-04-15", amount: 8500, mode: "M-Pesa", ref: "QJB7R3KL2M" }
]
└── updatedBy: "teacher_uid"
```

### 4. `attendance/{classId_date}`

```
attendance/Grade7_2025-04-15
├── classId: "Grade 7"
├── date: "2025-04-15"
├── records: { student_uid1: "present", student_uid2: "absent" }
├── markedBy: "teacher_uid"
└── markedAt: firebase Timestamp
```

### 5. `classes/{classId}`

```
classes/Grade7
├── classId: "Grade 7"
├── teacher: "teacher_uid"
├── students: 28
├── timetable: [ { time: "7:30–8:00", Monday: "Assembly", ... } ]
└── updatedBy: "director_uid"
```

### 6. `notices` (School announcements)

```
notices/{noticeId}
├── title: "Term 2 Exams Start"
├── body: "Exams begin Monday..."
├── type: "urgent" | "general" | "fee"
├── by: "Dr. Kariuki"
├── visible_to: ["student", "teacher", "director"]
└── createdAt: firebase Timestamp
```

### 7. `audit_log` (Director only)

```
audit_log/{logId}
├── action: "Grade entry" | "Fee recorded" | "Teacher added"
├── detail: "Math CAT2 — Grade 7"
├── level: "info" | "warn" | "success" | "danger"
├── actor: "Mary Joseph"
├── actorUid: "teacher_uid"
└── createdAt: firebase Timestamp
```

### 8. `school_settings` (Director settings)

```
school_settings/director_settings
├── schoolName: "Kairi St Mary's School"
├── currentTerm: "Term 2 2025"
├── termFee: 11400
├── subCounty: "Gatundu North"
└── curriculum: "CBC"
```

## 🔥 Quick Setup — Demo Data

**Run once in Firebase Console → Firestore → Create Collection:**

```javascript
// 1. Demo Director
users/director123 = {
  role: "director",
  full_name: "Dr. Naomi Kariuki",
  email: "director@kairistmarys.ac.ke"
}

// 2. Demo Teacher
users/teacher456 = {
  role: "teacher",
  full_name: "Mary Joseph",
  class_stream: "Grade 7",
  subject: "Mathematics"
}

// 3. Demo Student
users/student789 = {
  role: "student",
  full_name: "John Doe",
  adm_number: "ADM2025-001",
  class_stream: "Grade 7",
  parent_email: "parent.doe@example.com",
  temp_password: "ADM2025-001"
}

// 4. Demo Grade
grades/student789 = {
  term2: {
    english: { total: 82, grade: "EE" },
    maths: { total: 78, grade: "ME" }
  }
}

// 5. Demo Finance
finance/student789 = {
  totalFee: 11400,
  amountPaid: 8500,
  balance: 2900,
  status: "partial"
}
```

## ⚡ **All 3 Portals Live & Connected!**

```
✅ Student Portal → student-portal.html
✅ Teacher Portal → teacher-portal.html
✅ Director Panel → director.html
```

**Test Flow:**

```
1. Login: director@kairistmarys.ac.ke / password123
2. Add Teacher via modal → Saves to users/role=teacher
3. Teacher logs in → Sees their students
4. Teacher adds student → parent_email + temp_password saved
5. Parent logs in: parent001@kairistmarys.ac.ke / ADM001
6. Director sees audit log + live stats
```

**📱 Live Commands:**

```bash
npx live-server . --port=8080
```

🎉 **Production Ready** — Just replace YOUR_API_KEY in firebase-config.js!
