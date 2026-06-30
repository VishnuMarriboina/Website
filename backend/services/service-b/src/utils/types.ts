export interface GrpcRecordDto {
  id:        string;
  title:     string;
  content:   string;
  status:    string;
  refId:     string;
  createdAt: string;
  updatedAt: string;
}

export interface GrpcJobDto {
  id:                 string;
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
  createdAt:          string;
  updatedAt:          string;
}

export interface GrpcApplicationDto {
  id:                string;
  userId:            string;
  jobId:             string;
  resumeUrl:         string;
  coverLetter:       string;
  applicationStatus: string;
  createdAt:         string;
}
