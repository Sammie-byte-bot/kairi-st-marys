// admissions.js - Firestore integration for admissions management
import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ════════════════════════════════════════════════════════════════
// 1. AVAILABLE SPACES MANAGEMENT
// ════════════════════════════════════════════════════════════════

export const DEFAULT_AVAILABLE_SPACES = {
  "Pre-Primary 1": 12,
  "Pre-Primary 2": 12,
  "Grade 1": 20,
  "Grade 2": 20,
  "Grade 3": 20,
  "Grade 4": 15,
  "Grade 5": 15,
  "Grade 6": 15,
  "Grade 7 (JSS)": 30,
  "Grade 8 (JSS)": 30,
  "Grade 9 (JSS)": 30,
};

export const DEFAULT_REQUIREMENTS = [
  "Completed application form",
  "Birth certificate (copy)",
  "Previous school report (Grades 2+)",
  "National ID of parent/guardian",
  "2 passport photos of child",
  "Registration fee: KES 2,500",
];

// Get or initialize available spaces from Firestore
export async function getAvailableSpaces() {
  try {
    const docRef = doc(db, "admissions", "availableSpaces");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize with defaults if doesn't exist
      await setDoc(docRef, DEFAULT_AVAILABLE_SPACES);
      return DEFAULT_AVAILABLE_SPACES;
    }
  } catch (error) {
    console.error("Error getting available spaces:", error);
    return DEFAULT_AVAILABLE_SPACES;
  }
}

// Get requirements
export async function getRequirements() {
  try {
    const docRef = doc(db, "admissions", "requirements");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().list || DEFAULT_REQUIREMENTS;
    } else {
      // Initialize with defaults if doesn't exist
      await setDoc(docRef, { list: DEFAULT_REQUIREMENTS });
      return DEFAULT_REQUIREMENTS;
    }
  } catch (error) {
    console.error("Error getting requirements:", error);
    return DEFAULT_REQUIREMENTS;
  }
}

// Update available spaces for a specific class
export async function updateAvailableSpaces(updates) {
  try {
    const docRef = doc(db, "admissions", "availableSpaces");
    await updateDoc(docRef, updates);
    return { success: true, message: "Updated successfully" };
  } catch (error) {
    console.error("Error updating available spaces:", error);
    throw error;
  }
}

// Update requirements
export async function updateRequirements(requirementsList) {
  try {
    const docRef = doc(db, "admissions", "requirements");
    await setDoc(docRef, { list: requirementsList }, { merge: true });
    return { success: true, message: "Requirements updated successfully" };
  } catch (error) {
    console.error("Error updating requirements:", error);
    throw error;
  }
}

// ════════════════════════════════════════════════════════════════
// 2. APPLICATION SUBMISSIONS
// ════════════════════════════════════════════════════════════════

export async function submitApplication(applicationData) {
  try {
    const timestamp = new Date();

    const application = {
      ...applicationData,
      status: "pending", // pending, approved, rejected
      submittedAt: timestamp.toISOString(),
      createdAt: timestamp,
      notes: "",
      reviewed: false,
    };

    const docRef = await addDoc(collection(db, "applications"), application);

    return {
      success: true,
      applicationId: docRef.id,
      message: "Application submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
}

// Get all applications for director view
export async function getAllApplications() {
  try {
    const querySnapshot = await getDocs(collection(db, "applications"));
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return applications;
  } catch (error) {
    console.error("Error getting applications:", error);
    return [];
  }
}

// Get applications by status
export async function getApplicationsByStatus(status) {
  try {
    const q = query(
      collection(db, "applications"),
      where("status", "==", status),
    );
    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return applications;
  } catch (error) {
    console.error("Error getting applications by status:", error);
    return [];
  }
}

// Get applications by class
export async function getApplicationsByClass(className) {
  try {
    const q = query(
      collection(db, "applications"),
      where("applyingFor", "==", className),
    );
    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return applications;
  } catch (error) {
    console.error("Error getting applications by class:", error);
    return [];
  }
}

// Update application status
export async function updateApplicationStatus(
  applicationId,
  status,
  notes = "",
) {
  try {
    const docRef = doc(db, "applications", applicationId);
    await updateDoc(docRef, {
      status: status,
      reviewed: true,
      notes: notes,
      reviewedAt: new Date().toISOString(),
    });
    return { success: true, message: `Application ${status}` };
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}

// Get single application
export async function getApplication(applicationId) {
  try {
    const docRef = doc(db, "applications", applicationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Application not found");
    }
  } catch (error) {
    console.error("Error getting application:", error);
    throw error;
  }
}

// Delete application
export async function deleteApplication(applicationId) {
  try {
    await deleteDoc(doc(db, "applications", applicationId));
    return { success: true, message: "Application deleted" };
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
}

// Listen to real-time updates of applications
export function listenToApplications(callback) {
  try {
    const unsubscribe = onSnapshot(
      collection(db, "applications"),
      (querySnapshot) => {
        const applications = [];
        querySnapshot.forEach((doc) => {
          applications.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(applications);
      },
    );
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up listener:", error);
    return () => {};
  }
}

// ════════════════════════════════════════════════════════════════
// 3. STATISTICS & ANALYTICS
// ════════════════════════════════════════════════════════════════

export async function getAdmissionsStats() {
  try {
    const allApplications = await getAllApplications();

    const stats = {
      total: allApplications.length,
      pending: allApplications.filter((a) => a.status === "pending").length,
      approved: allApplications.filter((a) => a.status === "approved").length,
      rejected: allApplications.filter((a) => a.status === "rejected").length,
      byClass: {},
      byGender: {
        male: 0,
        female: 0,
        other: 0,
      },
    };

    // Count by class and gender
    allApplications.forEach((app) => {
      // By class
      if (!stats.byClass[app.applyingFor]) {
        stats.byClass[app.applyingFor] = 0;
      }
      stats.byClass[app.applyingFor]++;

      // By gender (if provided in form)
      if (app.gender) {
        stats.byGender[app.gender.toLowerCase()] =
          (stats.byGender[app.gender.toLowerCase()] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting admissions stats:", error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }
}
