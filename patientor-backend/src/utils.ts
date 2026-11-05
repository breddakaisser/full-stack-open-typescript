import { NewPatient, Gender, NewEntry, Diagnosis, HealthCheckRating } from './types';

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }
  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating === undefined || typeof rating !== 'number' || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating: ' + rating);
  }
  return rating;
};

// Main function parsing the general incoming entry structures
export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing entry data');
  }

  if ('description' in object && 'date' in object && 'specialist' in object && 'type' in object) {
    const baseEntry = {
      description: parseName(object.description), // reuses existing string validator
      date: parseDateOfBirth(object.date),        // reuses existing date validator
      specialist: parseName(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
    };

    switch (object.type) {
      case 'HealthCheck':
        if ('healthCheckRating' in object) {
          return {
            ...baseEntry,
            type: 'HealthCheck',
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };
        }
        break;
      case 'Hospital':
        if ('discharge' in object && typeof object.discharge === 'object' && object.discharge !== null && 'date' in object.discharge && 'criteria' in object.discharge) {
          return {
            ...baseEntry,
            type: 'Hospital',
            discharge: {
              date: parseDateOfBirth(object.discharge.date),
              criteria: parseName(object.discharge.criteria),
            },
          };
        }
        throw new Error('Missing discharge details for Hospital entry');
      case 'OccupationalHealthcare':
        if ('employerName' in object) {
          const entry: NewEntry = {
            ...baseEntry,
            type: 'OccupationalHealthcare',
            employerName: parseName(object.employerName),
          };
          if ('sickLeave' in object && typeof object.sickLeave === 'object' && object.sickLeave !== null && 'startDate' in object.sickLeave && 'endDate' in object.sickLeave) {
            entry.sickLeave = {
              startDate: parseDateOfBirth(object.sickLeave.startDate),
              endDate: parseDateOfBirth(object.sickLeave.endDate),
            };
          }
          return entry;
        }
        throw new Error('Missing employer name for Occupational Healthcare entry');
      default:
        throw new Error('Incorrect or unmapped entry type');
    }
  }

  throw new Error('Required common fields missing in entry form submission');
};


const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  return parseString(name, 'name');
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDateOfBirth = (date: unknown): string => {
  const parsedDate = parseDate(date, 'date of birth');
  if (!isDate(parsedDate)) {
    throw new Error('Incorrect or missing date of birth: ' + date);
  }
  return parsedDate;
};

const parseSsn = (ssn: unknown): string => {
  return parseString(ssn, 'ssn');
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newEntry: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: []
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatient;

const parseString = (text: unknown, fieldName: string): string => {
  if (typeof text !== 'string') throw new Error(`Incorrect or missing ${fieldName}`);
  return text;
};

const parseDate = (date: unknown, fieldName: string): string => {
  if (typeof date !== 'string' || !Boolean(Date.parse(date))) {
    throw new Error(`Incorrect or missing format for ${fieldName}`);
  }
  return date;
};
