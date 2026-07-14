'use strict';

export interface IRecord {
  id:         string;
  title:      string;
  content:    string;
  status:     string;
  refId:      string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJob {
  id:                 string;
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
  createdAt?:         Date;
  updatedAt?:         Date;
}

export interface IApplication {
  id:                string;
  userId:            string;
  jobId:             string;
  resumeUrl:         string;
  coverLetter:       string;
  applicationStatus: string;
  createdAt?:        Date;
  updatedAt?:        Date;
}
