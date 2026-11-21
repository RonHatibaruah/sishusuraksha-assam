export type DangerSignSeverity = 'RED_CRITICAL' | 'YELLOW_URGENT' | 'GREEN_OBSERVE';

export type FacilityLevel = 'NICU_TERTIARY' | 'SNCU_DISTRICT' | 'NBSU_FRU' | 'HOME_HBNC';

export type TransportMode = '108_AMBULANCE' | '102_AMBULANCE' | 'BOAT_AMBULANCE' | 'FACILITY_TRANSFER' | 'OWN_TRANSPORT';

export interface NewbornProfile {
  id: string;
  babyName: string;
  motherName: string;
  fatherName: string;
  contactNumber: string;
  dob: string;
  ageDays: number;
  gestationalWeeks: number;
  birthWeightGrams: number;
  currentWeightGrams: number;
  gender: 'MALE' | 'FEMALE';
  deliveryType: 'INSTITUTIONAL_GOVT' | 'INSTITUTIONAL_PVT' | 'HOME_DELIVERY';
  district: string;
  block: string;
  subCentre: string;
  village: string;
  isCharArea: boolean;
  isTeaGarden: boolean;
  ashaId: string;
  ashaName: string;
  ashaPhone: string;
  anmName: string;
  primaryHealthCentre: string;
  status: 'AT_HOME_HBNC' | 'REFERRED' | 'IN_TRANSIT' | 'ADMITTED_SNCU' | 'ADMITTED_NICU' | 'DISCHARGED_STABLE';
}

export interface DangerSignsAssessment {
  // Vital measurements
  temperatureCelsius: number;
  respiratoryRate: number; // breaths per minute
  heartRate: number; // bpm
  spo2Percentage: number;
  
  // Danger Sign Booleans
  hypothermia: boolean; // <36.0 C
  severeHypothermia: boolean; // <35.5 C
  fever: boolean; // >37.5 C
  fastBreathing: boolean; // >=60 breaths/min
  severeChestIndrawing: boolean;
  grunting: boolean;
  centralCyanosis: boolean;
  lethargyOrUnconscious: boolean;
  unableToFeedOrSuckle: boolean;
  convulsions: boolean;
  jaundicePalmsSoles: boolean;
  jaundiceWithin24Hours: boolean;
  umbilicalCordPusRedness: boolean;
  skinPustulesExtensive: boolean;
  diarrheaWithSevereDehydration: boolean;
  weightLossExcessive: boolean; // >10% of birth weight or <1800g
}

export interface TriageResult {
  severity: DangerSignSeverity;
  score: number; // 0-10 triage danger index
  recommendedFacility: FacilityLevel;
  primaryConcern: string;
  detectedDangerSigns: string[];
  immediatePreReferralSteps: string[];
  urgencyWindowMinutes: number;
  requiresSpecializedTransport: boolean;
}

export interface FacilityStatus {
  id: string;
  name: string;
  district: string;
  type: FacilityLevel;
  totalBeds: number;
  occupiedBeds: number;
  radiantWarmersTotal: number;
  radiantWarmersOccupied: number;
  phototherapyUnitsTotal: number;
  phototherapyUnitsAvailable: number;
  cpapVentilatorsTotal: number;
  cpapVentilatorsAvailable: number;
  pediatricianOnDuty: boolean;
  staffNurseCount: number;
  ambulanceAvailable108: boolean;
  hasBoatAmbulanceDock: boolean;
  contactNumber: string;
  lat: number;
  lng: number;
}

export interface ReferralRecord {
  id: string;
  newbornId: string;
  babyMotherName: string;
  timestamp: string;
  originFacility: string;
  destinationFacilityId: string;
  destinationFacilityName: string;
  severity: DangerSignSeverity;
  primaryDiagnosis: string;
  transportMode: TransportMode;
  transportId: string; // e.g. "AS-01-108-4421" or "MAJULI-BOAT-02"
  ambulanceStatus: 'DISPATCHED' | 'EN_ROUTE_PICKUP' | 'PATIENT_LOADED' | 'IN_TRANSIT' | 'ARRIVED_FACILITY' | 'ADMITTED';
  etaMinutes: number;
  distanceKm: number;
  preArrivalAlertAcknowledged: boolean;
  vitalsEnRoute: {
    temp: number;
    spo2: number;
    heartRate: number;
    respiratoryRate: number;
  };
  bedAssigned: string | null;
  admittingPediatrician: string;
}

export interface HBNCVisit {
  visitDay: 1 | 3 | 7 | 14 | 21 | 28 | 42;
  dueDate: string;
  completedDate?: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED_OVERDUE' | 'SCHEDULED';
  weightGrams?: number;
  feedingStatus?: 'EXCLUSIVE_BREASTFEEDING' | 'PARTIAL' | 'NOT_FEEDING';
  temperatureCelsius?: number;
  respiratoryRate?: number;
  dangerSignsDetected?: boolean;
  ashaNotes?: string;
  escalatedToBPHN?: boolean;
}

export interface CaregiverAdvisory {
  id: string;
  newbornId: string;
  recipientPhone: string;
  channel: 'WHATSAPP' | 'SMS' | 'VOICE_IVRS';
  language: 'ASSAMESE' | 'ENGLISH' | 'BENGALI' | 'BODO';
  topic: 'DANGER_SIGNS' | 'KMC_WARMTH' | 'EXCLUSIVE_BREASTFEEDING' | 'IMMUNIZATION' | 'HBNC_VISIT_REMINDER';
  messageText: string;
  messageAssamese: string;
  timestamp: string;
  deliveryStatus: 'DELIVERED' | 'READ' | 'PENDING';
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'STATE_MISSION_DIRECTOR' | 'DISTRICT_SURVEILLANCE_OFFICER' | 'PEDIATRICIAN_FACILITY_INCHARGE' | 'BPHN_SUPERVISOR' | 'ASHA_FIELD_WORKER';
  email: string;
  facilityOrDistrict: string;
}
