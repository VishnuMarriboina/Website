import { Types } from 'mongoose';

export interface IRecord {
  _id?:      Types.ObjectId;
  title:     string;
  content:   string;
  status:    string;
  refId:     string;
  createdAt?: Date;
  updatedAt?: Date;
  id?:        string;
}

export interface IJob {
  _id?:               Types.ObjectId;
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
  createdAt?:         Date;
  updatedAt?:         Date;
  id?:                string;
}

export interface IApplication {
  _id?:               Types.ObjectId;
  userId:             string;
  jobId:              string;
  resumeUrl:          string;
  coverLetter:        string;
  applicationStatus:  string;
  createdAt?:         Date;
  updatedAt?:         Date;
  id?:                string;
}
