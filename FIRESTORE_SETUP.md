# St. Mary's Academy - Firestore Database Schema

This document outlines the required Firestore structure to power the website and portals.

## 1. `admissions` (Collection)

**Source:** "Join Our School" form in `index.html`.
Each document represents a new student application.

- **child_first_name**: `String` (e.g., "Amara")
- **child_last_name**: `String` (e.g., "Kimani")
- **dob**: `Timestamp` (Firestore Date object)
- **applying_for**: `String` (e.g., "Grade 4")
- **parent_name**: `String`
- **parent_phone**: `String`
- **parent_email**: `String`
- **message**: `String`
- **status**: `String` (Default: "pending", Options: "reviewed", "interviewed", "accepted")
- **submitted_at**: `Timestamp` (Server-side timestamp)

## 2. `contact_messages` (Collection)

**Source:** "Send Us a Message" form in `index.html`.

- **sender_name**: `String`
- **sender_phone**: `String`
- **sender_email**: `String`
- **subject**: `String` (e.g., "Fee Structure Request")
- **message**: `String`
- **created_at**: `Timestamp`

## 3. `users` (Collection)

**Source:** `login.html` and Profile section in `student-portal.html`.
**Document ID:** Use the Firebase Authentication `uid`.

- **full_name**: `String`
- **role**: `String` ("student", "teacher", or "director")
- **adm_number**: `String` (e.g., "2024/GAT/101")
- **nemis_id**: `String`
- **class_stream**: `String` (e.g., "Grade 4 Blue")
- **parent_name**: `String`
- **house**: `String` ("Nyeri House")
- **photo_url**: `String` (Link to Firebase Storage)
- **year_joined**: `Number` (e.g., 2021)
- **is_active**: `Boolean` (true/false)

## 4. `academic_records` (Collection)

**Source:** CBC Gradebook in `student-portal.html`.

- **student_id**: `String` (The `uid` from the users collection)
- **term**: `Number` (1, 2, or 3)
- **year**: `Number` (e.g., 2025)
- **overall_level**: `String` ("EE", "ME", "AE", "BE")
- **subjects**: `Map` (An object containing nested data)
  - **english**: `Map` { `level`: "EE", `remarks`: "String" }
  - **maths**: `Map` { `level`: "ME", `remarks`: "String" }
  - **science**: `Map` { `level`: "EE", `remarks`: "String" }

## 5. `finance` (Collection)

**Source:** Fees Portal in `student-portal.html`.

- **student_id**: `String` (The `uid`)
- **termly_total**: `Number` (e.g., 15000)
- **arrears**: `Number` (e.g., 5000)
- **arrears**: `Number` (e.g., 5000) - *Optional, can be calculated*
- **total_paid**: `Number` (e.g., 10000)
- **balance**: `Number` (e.g., 5000) - *Optional, can be calculated*
- **status**: `String` ("paid", "partial", "unpaid") - *Optional, can be calculated*
- **studentName**: `String` (e.g., "John Doe") - *For easier lookup/display*
- **studentClass**: `String` (e.g., "Grade 7") - *For easier lookup/display*
- **updatedAt**: `Timestamp`
- **payment_history**: `Array` (List of Map objects)
  - `Map` {
    `date`: `Timestamp`,
    `mode`: `String` (M-Pesa/Bank),
    `amount`: `Number`,
    `receipt_url`: `String`
    }

## 6. `attendance` (Collection)

**Source:** Attendance Heatmap in `student-portal.html`.
**Document ID:** `student_id_YYYY_MM` (e.g., `user123_2025_04`)

- **student_id**: `String`
- **month**: `Number`
- **year**: `Number`
- **daily_records**: `Map` (Keys are day numbers as strings)
  - `"01"`: "present"
  - `"05"`: "absent"
  - `"12"`: "present"

## 7. `notices` (Collection)

**Source:** School Notices in `student-portal.html`.

- **title**: `String`
- **content**: `String`
- **category**: `String` ("urgent", "info", "general")
- **posted_by**: `String` ("Director" or "Academic Office")
- **posted_at**: `Timestamp`
- **target_audience**: `String` ("all", "grade_4", "teachers")

## 8. `assignments` (Collection)

**Source:** Assignments Tracker in `student-portal.html`.

- **subject**: `String`
- **title**: `String`
- **teacher_name**: `String`
- **due_date**: `Timestamp`
- **description**: `String`
- **class_id**: `String` (matches `class_stream` in users)
- **status**: `String` ("open", "closed")

---
