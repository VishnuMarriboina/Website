import type { ProtobufDescriptor } from './types';

export const SERVICE_B_DESCRIPTOR: ProtobufDescriptor = {
  nested: {
    serviceb: {
      nested: {
        ServiceB: {
          methods: {
            HealthCheck:         { requestType: 'HealthCheckRequest',       responseType: 'HealthCheckResponse'     },
            GetById:             { requestType: 'GetByIdRequest',           responseType: 'RecordResponse'          },
            GetAll:              { requestType: 'GetAllRequest',            responseType: 'GetAllResponse'          },
            Create:              { requestType: 'CreateRecordRequest',      responseType: 'RecordResponse'          },
            Update:              { requestType: 'UpdateRecordRequest',      responseType: 'RecordResponse'          },
            Delete:              { requestType: 'DeleteRecordRequest',      responseType: 'StatusResponse'          },
            GetJobs:             { requestType: 'GetJobsRequest',           responseType: 'GetJobsResponse'         },
            GetJobById:          { requestType: 'GetByIdRequest',           responseType: 'JobResponse'             },
            CreateJob:           { requestType: 'CreateJobRequest',         responseType: 'JobResponse'             },
            UpdateJob:           { requestType: 'UpdateJobRequest',         responseType: 'JobResponse'             },
            DeleteJob:           { requestType: 'DeleteRecordRequest',      responseType: 'StatusResponse'          },
            ActivateJob:         { requestType: 'GetByIdRequest',           responseType: 'JobResponse'             },
            DeactivateJob:       { requestType: 'GetByIdRequest',           responseType: 'JobResponse'             },
            CreateApplication:   { requestType: 'CreateApplicationRequest', responseType: 'ApplicationResponse'     },
            GetApplicationById:  { requestType: 'GetByIdRequest',           responseType: 'ApplicationResponse'     },
            GetApplications:     { requestType: 'GetApplicationsRequest',   responseType: 'GetApplicationsResponse' },
            GetUserApplications:     { requestType: 'GetUserAppRequest',                responseType: 'GetApplicationsResponse'      },
            GetJobApplications:      { requestType: 'GetByIdRequest',                   responseType: 'GetApplicationsResponse'      },
            UpdateApplicationStatus: { requestType: 'UpdateApplicationStatusRequest',    responseType: 'ApplicationResponse'          },
            DeleteApplication:       { requestType: 'GetByIdRequest',                   responseType: 'StatusResponse'               },
          },
        },
        Record: {
          fields: {
            id:        { type: 'string', id: 1 },
            title:     { type: 'string', id: 2 },
            content:   { type: 'string', id: 3 },
            status:    { type: 'string', id: 4 },
            refId:     { type: 'string', id: 5 },
            createdAt: { type: 'string', id: 6 },
            updatedAt: { type: 'string', id: 7 },
          },
        },
        GetByIdRequest:  { fields: { id: { type: 'string', id: 1 } } },
        GetAllRequest: {
          fields: {
            page:   { type: 'int32',  id: 1 },
            limit:  { type: 'int32',  id: 2 },
            status: { type: 'string', id: 3 },
            refId:  { type: 'string', id: 4 },
          },
        },
        CreateRecordRequest: {
          fields: {
            title:   { type: 'string', id: 1 },
            content: { type: 'string', id: 2 },
            status:  { type: 'string', id: 3 },
            refId:   { type: 'string', id: 4 },
          },
        },
        UpdateRecordRequest: {
          fields: {
            id:      { type: 'string', id: 1 },
            title:   { type: 'string', id: 2 },
            content: { type: 'string', id: 3 },
            status:  { type: 'string', id: 4 },
          },
        },
        DeleteRecordRequest: { fields: { id: { type: 'string', id: 1 } } },
        RecordResponse: {
          fields: {
            success: { type: 'bool',   id: 1 },
            message: { type: 'string', id: 2 },
            data:    { type: 'Record', id: 3 },
          },
        },
        GetAllResponse: {
          fields: {
            success: { type: 'bool',           id: 1 },
            message: { type: 'string',         id: 2 },
            data:    { rule: 'repeated', type: 'Record', id: 3 },
            meta:    { type: 'PaginationMeta', id: 4 },
          },
        },
        PaginationMeta: {
          fields: {
            total:      { type: 'int32', id: 1 },
            page:       { type: 'int32', id: 2 },
            limit:      { type: 'int32', id: 3 },
            totalPages: { type: 'int32', id: 4 },
            hasNext:    { type: 'bool',  id: 5 },
            hasPrev:    { type: 'bool',  id: 6 },
          },
        },
        StatusResponse: {
          fields: {
            success: { type: 'bool',   id: 1 },
            message: { type: 'string', id: 2 },
          },
        },
        HealthCheckRequest:  { fields: {} },
        HealthCheckResponse: {
          fields: {
            status:    { type: 'string', id: 1 },
            service:   { type: 'string', id: 2 },
            timestamp: { type: 'string', id: 3 },
          },
        },
        // ── Job ──────────────────────────────────────────────────────────────
        Job: {
          fields: {
            id:                 { type: 'string', id: 1 },
            title:              { type: 'string', id: 2 },
            description:        { type: 'string', id: 3 },
            department:         { type: 'string', id: 4 },
            location:           { type: 'string', id: 5 },
            experienceRequired: { type: 'string', id: 6 },
            salaryRange:        { type: 'string', id: 7 },
            status:             { type: 'string', id: 8 },
            createdAt:          { type: 'string', id: 9 },
            updatedAt:          { type: 'string', id: 10 },
          },
        },
        GetJobsRequest: {
          fields: {
            page:       { type: 'int32',  id: 1 },
            limit:      { type: 'int32',  id: 2 },
            status:     { type: 'string', id: 3 },
            department: { type: 'string', id: 4 },
            search:     { type: 'string', id: 5 },
          },
        },
        CreateJobRequest: {
          fields: {
            title:              { type: 'string', id: 1 },
            description:        { type: 'string', id: 2 },
            department:         { type: 'string', id: 3 },
            location:           { type: 'string', id: 4 },
            experienceRequired: { type: 'string', id: 5 },
            salaryRange:        { type: 'string', id: 6 },
            status:             { type: 'string', id: 7 },
          },
        },
        UpdateJobRequest: {
          fields: {
            id:                 { type: 'string', id: 1 },
            title:              { type: 'string', id: 2 },
            description:        { type: 'string', id: 3 },
            department:         { type: 'string', id: 4 },
            location:           { type: 'string', id: 5 },
            experienceRequired: { type: 'string', id: 6 },
            salaryRange:        { type: 'string', id: 7 },
            status:             { type: 'string', id: 8 },
          },
        },
        JobResponse: {
          fields: {
            success: { type: 'bool',   id: 1 },
            message: { type: 'string', id: 2 },
            data:    { type: 'Job',    id: 3 },
          },
        },
        GetJobsResponse: {
          fields: {
            success: { type: 'bool',           id: 1 },
            message: { type: 'string',         id: 2 },
            data:    { rule: 'repeated', type: 'Job', id: 3 },
            meta:    { type: 'PaginationMeta', id: 4 },
          },
        },
        // ── Application ───────────────────────────────────────────────────────
        Application: {
          fields: {
            id:                { type: 'string', id: 1 },
            userId:            { type: 'string', id: 2 },
            jobId:             { type: 'string', id: 3 },
            resumeUrl:         { type: 'string', id: 4 },
            coverLetter:       { type: 'string', id: 5 },
            applicationStatus: { type: 'string', id: 6 },
            createdAt:         { type: 'string', id: 7 },
          },
        },
        CreateApplicationRequest: {
          fields: {
            userId:      { type: 'string', id: 1 },
            jobId:       { type: 'string', id: 2 },
            resumeUrl:   { type: 'string', id: 3 },
            coverLetter: { type: 'string', id: 4 },
          },
        },
        ApplicationResponse: {
          fields: {
            success: { type: 'bool',        id: 1 },
            message: { type: 'string',      id: 2 },
            data:    { type: 'Application', id: 3 },
          },
        },
        GetApplicationsRequest: {
          fields: {
            page:              { type: 'int32',  id: 1 },
            limit:             { type: 'int32',  id: 2 },
            applicationStatus: { type: 'string', id: 3 },
          },
        },
        GetUserAppRequest: {
          fields: {
            userId: { type: 'string', id: 1 },
            page:   { type: 'int32',  id: 2 },
            limit:  { type: 'int32',  id: 3 },
          },
        },
        GetApplicationsResponse: {
          fields: {
            success: { type: 'bool',                id: 1 },
            message: { type: 'string',              id: 2 },
            data:    { rule: 'repeated', type: 'Application', id: 3 },
            meta:    { type: 'PaginationMeta',      id: 4 },
          },
        },
        UpdateApplicationStatusRequest: {
          fields: {
            id:                { type: 'string', id: 1 },
            applicationStatus: { type: 'string', id: 2 },
          },
        },
      },
    },
  },
};
