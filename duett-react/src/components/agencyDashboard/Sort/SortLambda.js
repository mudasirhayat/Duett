import { getServiceHours } from '../../../lib/helpers';

export const sortLambda = {
id: (user) => user.id,
  clientName: (user) => user.patient.name.toLowerCase(),
  zipCode: (u) => u.patient.zip,
  hours: (u) => getServiceHours(u.services[0].frequency, u.services[0].hours),
  lastRefreshed: (u) => new Date(u.refreshed_time),
  posted: (u) => new Date(u.refreshed_time),
  status: (u) => u.status,
  birthday: (u) => new Date(u.patient.birth_date),
  matched: (u) => new Date(u.services[0].match_date),
};
