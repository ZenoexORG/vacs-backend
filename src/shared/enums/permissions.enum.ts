export enum AppPermissions {    
    EMPLOYEE_CREATE = 'employees:write',
    EMPLOYEE_READ = 'employees:read',
    EMPLOYEE_UPDATE = 'employees:edit',
    EMPLOYEE_DELETE = 'employees:delete',
        
    ROLE_CREATE = 'roles:write',
    ROLE_READ = 'roles:read',
    ROLE_UPDATE = 'roles:edit',
    ROLE_DELETE = 'roles:delete',    
        
    VEHICLE_CREATE = 'vehicles:write',
    VEHICLE_READ = 'vehicles:read',
    VEHICLE_UPDATE = 'vehicles:edit',
    VEHICLE_DELETE = 'vehicles:delete',
    
    VEHICLE_TYPES_CREATE = 'vehicle-types:write',
    VEHICLE_TYPES_READ = 'vehicle-types:read',
    VEHICLE_TYPES_UPDATE = 'vehicle-types:edit',
    VEHICLE_TYPES_DELETE = 'vehicle-types:delete',
        
    USER_CREATE = 'users:write',
    USER_READ = 'users:read',
    USER_UPDATE = 'users:edit',
    USER_DELETE = 'users:delete',
        
    PERMISSION_CREATE = 'permissions:write',
    PERMISSION_READ = 'permissions:read',
    PERMISSION_UPDATE = 'permissions:edit',
    PERMISSION_DELETE = 'permissions:delete',
    PERMISSION_ASSIGN = 'permissions:assign',
    PERMISSION_UNASSIGN = 'permissions:unassign',

    ACCESS_LOG_CREATE = 'access-logs:write',
    ACCESS_LOG_READ = 'access-logs:read',
    ACCESS_LOG_UPDATE = 'access-logs:edit',
    ACCESS_LOG_DELETE = 'access-logs:delete',

    INCIDENTS_CREATE = 'incidents:write',
    INCIDENTS_READ = 'incidents:read',
    INCIDENTS_UPDATE = 'incidents:edit',
    INCIDENTS_DELETE = 'incidents:delete',    

    DASHBOARD_READ = 'dashboard:read',
    
    REPORTS_GENERATE = 'daily-reports:generate',
    REPORTS_READ = 'daily-reports:read',
    REPORTS_DELETE = 'daily-reports:delete',
}