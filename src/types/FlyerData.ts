export interface FlyerData {
  fullName: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  favouriteQuote: string;
  socialHandle: string;
  hobbies: string;
  bestCourse: string;
  bestLecturer: string;
  bestLevel: string;
  worstLevel: string;
  favouriteCourseMate: string;
  ifNotSoftware: string;
  bestExperienceInAuchi: string;
  worstExperienceInAuchi: string;
  photo: string; // base64 data URL
}

export const LEVEL_OPTIONS = ['ND1', 'ND2', 'HND1', 'HND2'] as const;
export type Level = typeof LEVEL_OPTIONS[number];

export const NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
  'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT',
  'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
  'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
  'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
] as const;
