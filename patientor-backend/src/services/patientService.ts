import { v4 as uuid } from 'uuid';
import patientsData from '../../data/patients.json';
import { Patient, NonSensitivePatient, NewPatient, Entry, NewEntry } from '../types';

const patients: Patient[] = patientsData as Patient[];

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries 
  }));
};

const findById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
    entries: [] 
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addMedicalEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const newEntryRecord = {
    id: uuid(),
    ...entry
  } as Entry;

  patient.entries.push(newEntryRecord);
  return newEntryRecord;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addPatient,
  addMedicalEntry
};
