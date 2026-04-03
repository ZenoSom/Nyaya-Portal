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
  },
  {
    case_id: 29,
    person_name: "Neha Joshi",
    case_type: "Civil",
    severity: "medium",
    pending_days: 132,
    court: "Bhopal District Court",
    judge: "Justice Tiwari",
    status: "pending",
    filing_date: "2025-11-19"
  },
  {
    case_id: 30,
    person_name: "Arjun Nair",
    case_type: "Corporate",
    severity: "high",
    pending_days: 365,
    court: "Kerala High Court",
    judge: "Justice Menon",
    status: "ongoing",
    filing_date: "2025-04-12"
  },
  {
    case_id: 31,
    person_name: "Pooja Desai",
    case_type: "Property",
    severity: "medium",
    pending_days: 188,
    court: "Vadodara Civil Court",
    judge: "Justice Trivedi",
    status: "pending",
    filing_date: "2025-09-26"
  },
  {
    case_id: 32,
    person_name: "Karan Oberoi",
    case_type: "Criminal",
    severity: "high",
    pending_days: 425,
    court: "Punjab and Haryana High Court",
    judge: "Justice Bedi",
    status: "ongoing",
    filing_date: "2025-01-14"
  },
  {
    case_id: 33,
    person_name: "Ira Sen",
    case_type: "Family",
    severity: "low",
    pending_days: 48,
    court: "Kolkata Family Court",
    judge: "Justice Chatterjee",
    status: "pending",
    filing_date: "2026-02-16"
  },
  {
    case_id: 34,
    person_name: "Dev Mallick",
    case_type: "Civil",
    severity: "low",
    pending_days: 36,
    court: "Ranchi District Court",
    judge: "Justice Ekka",
    status: "closed",
    filing_date: "2026-02-28"
  },
  {
    case_id: 35,
    person_name: "Simran Kaur",
    case_type: "Property",
    severity: "high",
    pending_days: 292,
    court: "Chandigarh District Court",
    judge: "Justice Grewal",
    status: "pending",
    filing_date: "2025-06-11"
  },
  {
    case_id: 36,
    person_name: "Farhan Ali",
    case_type: "Corporate",
    severity: "medium",
    pending_days: 176,
    court: "Lucknow Commercial Court",
    judge: "Justice Rizvi",
    status: "ongoing",
    filing_date: "2025-10-03"
  },
  {
    case_id: 37,
    person_name: "Ritika Bose",
    case_type: "Family",
    severity: "medium",
    pending_days: 114,
    court: "Howrah Family Court",
    judge: "Justice Mukherjee",
    status: "pending",
    filing_date: "2025-12-08"
  },
  {
    case_id: 38,
    person_name: "Nitin Shetty",
    case_type: "Criminal",
    severity: "low",
    pending_days: 58,
    court: "Mangalore Sessions Court",
    judge: "Justice Shekar",
    status: "closed",
    filing_date: "2026-01-30"
  },
  {
    case_id: 39,
    person_name: "Ayesha Khan",
    case_type: "Civil",
    severity: "high",
    pending_days: 341,
    court: "Aligarh High Court Bench",
    judge: "Justice Siddiqui",
    status: "ongoing",
    filing_date: "2025-05-03"
  },
  {
    case_id: 40,
    person_name: "Manav Batra",
    case_type: "Corporate",
    severity: "low",
    pending_days: 22,
    court: "Noida Commercial Court",
    judge: "Justice Arora",
    status: "pending",
    filing_date: "2026-03-18"
  },
  {
    case_id: 41,
    person_name: "Kavya Pillai",
    case_type: "Property",
    severity: "medium",
    pending_days: 154,
    court: "Thiruvananthapuram District Court",
    judge: "Justice Pillai",
    status: "ongoing",
    filing_date: "2025-10-27"
  },
  {
    case_id: 42,
    person_name: "Yashvardhan Singh",
    case_type: "Criminal",
    severity: "high",
    pending_days: 508,
    court: "Jaipur Sessions Court",
    judge: "Justice Rathod",
    status: "pending",
    filing_date: "2024-10-08"
  },
  {
    case_id: 43,
    person_name: "Mitali Roy",
    case_type: "Family",
    severity: "low",
    pending_days: 67,
    court: "Durgapur Family Court",
    judge: "Justice Dutta",
    status: "ongoing",
    filing_date: "2026-01-17"
  },
  {
    case_id: 44,
    person_name: "Harsh Vardhan",
    case_type: "Civil",
    severity: "medium",
    pending_days: 205,
    court: "Jodhpur High Court",
    judge: "Justice Lodha",
    status: "pending",
    filing_date: "2025-08-31"
  },
  {
    case_id: 45,
    person_name: "Tanvi Kulshreshtha",
    case_type: "Corporate",
    severity: "high",
    pending_days: 389,
    court: "Mumbai Commercial Court",
    judge: "Justice Merchant",
    status: "ongoing",
    filing_date: "2025-03-08"
  },
  {
    case_id: 46,
    person_name: "Pranav Reddy",
    case_type: "Property",
    severity: "low",
    pending_days: 29,
    court: "Warangal District Court",
    judge: "Justice Naidu",
    status: "closed",
    filing_date: "2026-03-05"
  },
  {
    case_id: 47,
    person_name: "Sakshi Arvind",
    case_type: "Family",
    severity: "high",
    pending_days: 274,
    court: "Mysuru Family Court",
    judge: "Justice Hegde",
    status: "pending",
    filing_date: "2025-07-04"
  },
  {
    case_id: 48,
    person_name: "Rohan Kapoor",
    case_type: "Civil",
    severity: "medium",
    pending_days: 97,
    court: "Dehradun District Court",
    judge: "Justice Bisht",
    status: "ongoing",
    filing_date: "2025-12-21"
  }
];
