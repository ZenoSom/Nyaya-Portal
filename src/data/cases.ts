export interface Case {
  case_id: number;
  person_name: string;
  case_type: 'Criminal' | 'Civil' | 'Property' | 'Corporate' | 'Family';
  severity: 'low' | 'medium' | 'high';
  pending_days: number;
  court: string;
  judge: string;
  status: 'pending' | 'closed' | 'ongoing';
  filing_date: string;
}

export const cases: Case[] = [
  {
    case_id: 1,
    person_name: "Rahul Sharma",
    case_type: "Criminal",
    severity: "high",
    pending_days: 320,
    court: "Delhi High Court",
    judge: "Justice Mehta",
    status: "pending",
    filing_date: "2025-05-15"
  },
  {
    case_id: 2,
    person_name: "Priya Patel",
    case_type: "Civil",
    severity: "medium",
    pending_days: 150,
    court: "Mumbai District Court",
    judge: "Justice Kulkarni",
    status: "ongoing",
    filing_date: "2025-11-02"
  },
  {
    case_id: 3,
    person_name: "Amit Singh",
    case_type: "Property",
    severity: "low",
    pending_days: 45,
    court: "Allahabad High Court",
    judge: "Justice Verma",
    status: "pending",
    filing_date: "2026-02-18"
  },
  {
    case_id: 4,
    person_name: "Anjali Gupta",
    case_type: "Corporate",
    severity: "medium",
    pending_days: 210,
    court: "Karnataka High Court",
    judge: "Justice Rao",
    status: "pending",
    filing_date: "2025-09-05"
  },
  {
    case_id: 5,
    person_name: "Vikram Malhotra",
    case_type: "Criminal",
    severity: "high",
    pending_days: 410,
    court: "Supreme Court of India",
    judge: "Justice Chandrachud",
    status: "ongoing",
    filing_date: "2025-02-10"
  },
  {
    case_id: 6,
    person_name: "Sanya Mirza",
    case_type: "Family",
    severity: "low",
    pending_days: 85,
    court: "Hyderabad Family Court",
    judge: "Justice Reddy",
    status: "pending",
    filing_date: "2026-01-05"
  },
  {
    case_id: 7,
    person_name: "Rajesh Kumar",
    case_type: "Civil",
    severity: "medium",
    pending_days: 120,
    court: "Patna High Court",
    judge: "Justice Sinha",
    status: "ongoing",
    filing_date: "2025-12-01"
  },
  {
    case_id: 8,
    person_name: "Meera Iyer",
    case_type: "Property",
    severity: "high",
    pending_days: 500,
    court: "Madras High Court",
    judge: "Justice Subramanian",
    status: "pending",
    filing_date: "2024-11-15"
  },
  {
    case_id: 9,
    person_name: "Suresh Prabhu",
    case_type: "Corporate",
    severity: "low",
    pending_days: 30,
    court: "NCLT Delhi",
    judge: "Justice Bansal",
    status: "pending",
    filing_date: "2026-03-04"
  },
  {
    case_id: 10,
    person_name: "Kavita Krishnan",
    case_type: "Criminal",
    severity: "medium",
    pending_days: 180,
    court: "Chandigarh District Court",
    judge: "Justice Dhillon",
    status: "ongoing",
    filing_date: "2025-10-05"
  },
  {
    case_id: 11,
    person_name: "Arjun Kapoor",
    case_type: "Civil",
    severity: "high",
    pending_days: 275,
    court: "Rajasthan High Court",
    judge: "Justice Shekhawat",
    status: "pending",
    filing_date: "2025-07-02"
  },
  {
    case_id: 12,
    person_name: "Deepika Padukone",
    case_type: "Family",
    severity: "medium",
    pending_days: 60,
    court: "Bangalore Family Court",
    judge: "Justice Gowda",
    status: "ongoing",
    filing_date: "2026-02-02"
  },
  {
    case_id: 13,
    person_name: "Ranveer Singh",
    case_type: "Property",
    severity: "low",
    pending_days: 15,
    court: "Pune Civil Court",
    judge: "Justice Kulkarni",
    status: "pending",
    filing_date: "2026-03-19"
  },
  {
    case_id: 14,
    person_name: "Alia Bhatt",
    case_type: "Corporate",
    severity: "high",
    pending_days: 420,
    court: "Bombay High Court",
    judge: "Justice Merchant",
    status: "ongoing",
    filing_date: "2025-02-07"
  },
  {
    case_id: 15,
    person_name: "Varun Dhawan",
    case_type: "Criminal",
    severity: "medium",
    pending_days: 95,
    court: "Indore District Court",
    judge: "Justice Shukla",
    status: "pending",
    filing_date: "2025-12-29"
  },
  {
    case_id: 16,
    person_name: "Sara Ali Khan",
    case_type: "Civil",
    severity: "low",
    pending_days: 40,
    court: "Lucknow High Court",
    judge: "Justice Trivedi",
    status: "ongoing",
    filing_date: "2026-02-22"
  },
  {
    case_id: 17,
    person_name: "Kartik Aaryan",
    case_type: "Property",
    severity: "high",
    pending_days: 310,
    court: "Gwalior High Court",
    judge: "Justice Scindia",
    status: "pending",
    filing_date: "2025-05-29"
  },
  {
    case_id: 18,
    person_name: "Janhvi Kapoor",
    case_type: "Family",
    severity: "medium",
    pending_days: 110,
    court: "Chennai Family Court",
    judge: "Justice Mani",
    status: "ongoing",
    filing_date: "2025-12-14"
  },
  {
    case_id: 19,
    person_name: "Ishaan Khatter",
    case_type: "Corporate",
    severity: "low",
    pending_days: 20,
    court: "Kolkata High Court",
    judge: "Justice Banerjee",
    status: "pending",
    filing_date: "2026-03-14"
  },
  {
    case_id: 20,
    person_name: "Ananya Panday",
    case_type: "Criminal",
    severity: "high",
    pending_days: 550,
    court: "Delhi Sessions Court",
    judge: "Justice Bakshi",
    status: "ongoing",
    filing_date: "2024-09-30"
  },
  {
    case_id: 21,
    person_name: "Tiger Shroff",
    case_type: "Civil",
    severity: "medium",
    pending_days: 140,
    court: "Ahmedabad High Court",
    judge: "Justice Patel",
    status: "pending",
    filing_date: "2025-11-14"
  },
  {
    case_id: 22,
    person_name: "Disha Patani",
    case_type: "Property",
    severity: "low",
    pending_days: 55,
    court: "Surat District Court",
    judge: "Justice Shah",
    status: "ongoing",
    filing_date: "2026-02-07"
  },
  {
    case_id: 23,
    person_name: "Vicky Kaushal",
    case_type: "Family",
    severity: "high",
    pending_days: 380,
    court: "Amritsar High Court",
    judge: "Justice Sandhu",
    status: "pending",
    filing_date: "2025-03-19"
  },
  {
    case_id: 24,
    person_name: "Katrina Kaif",
    case_type: "Corporate",
    severity: "medium",
    pending_days: 200,
    court: "Jaipur High Court",
    judge: "Justice Rathore",
    status: "ongoing",
    filing_date: "2025-09-15"
  },
  {
    case_id: 25,
    person_name: "Ayushmann Khurrana",
    case_type: "Criminal",
    severity: "low",
    pending_days: 70,
    court: "Ludhiana District Court",
    judge: "Justice Gill",
    status: "pending",
    filing_date: "2026-01-23"
  },
  {
    case_id: 26,
    person_name: "Bhumi Pednekar",
    case_type: "Civil",
    severity: "high",
    pending_days: 480,
    court: "Nagpur High Court",
    judge: "Justice Deshpande",
    status: "ongoing",
    filing_date: "2024-12-03"
  },
  {
    case_id: 27,
    person_name: "Rajkummar Rao",
    case_type: "Property",
    severity: "medium",
    pending_days: 165,
    court: "Gurgaon District Court",
    judge: "Justice Yadav",
    status: "pending",
    filing_date: "2025-10-20"
  },
  {
    case_id: 28,
    person_name: "Shraddha Kapoor",
    case_type: "Family",
    severity: "low",
    pending_days: 25,
    court: "Shimla High Court",
    judge: "Justice Thakur",
    status: "ongoing",
    filing_date: "2026-03-09"
  }
];
