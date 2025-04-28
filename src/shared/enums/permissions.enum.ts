export enum AppPermissions {    
    EMPLOYEES_CREATE = 'employees:create',
    EMPLOYEES_VIEW = 'employees:view',
    EMPLOYEES_EDIT = 'employees:edit',
    EMPLOYEES_DELETE = 'employees:delete',
        
    ROLES_CREATE = 'roles:create',
    ROLES_VIEW = 'roles:view',
    ROLES_EDIT = 'roles:edit',
    ROLES_DELETE = 'roles:delete',    
        
    VEHICLES_CREATE = 'vehicles:create',
    VEHICLES_VIEW = 'vehicles:view',
    VEHICLES_EDIT = 'vehicles:edit',
    VEHICLES_DELETE = 'vehicles:delete',
    
    VEHICLE_TYPES_CREATE = 'vehicle-types:create',
    VEHICLE_TYPES_VIEW = 'vehicle-types:view',
    VEHICLE_TYPES_EDIT = 'vehicle-types:edit',
    VEHICLE_TYPES_DELETE = 'vehicle-types:delete',
        
    USERS_CREATE = 'users:create',
    USERS_VIEW = 'users:view',
    USERS_EDIT = 'users:edit',
    USERS_DELETE = 'users:delete',
        
    PERMISSIONS_CREATE = 'permissions:create',
    PERMISSIONS_VIEW = 'permissions:view',
    PERMISSIONS_EDIT = 'permissions:edit',
    PERMISSIONS_DELETE = 'permissions:delete',
    PERMISSIONS_ASSIGN = 'permissions:assign',
    PERMISSIONS_UNASSIGN = 'permissions:unassign',

    ACCESS_LOGS_CREATE = 'access-logs:create',
    ACCESS_LOGS_VIEW = 'access-logs:view',
    ACCESS_LOGS_EDIT = 'access-logs:edit',
    ACCESS_LOGS_DELETE = 'access-logs:delete',

    INCIDENTS_CREATE = 'incidents:create',
    INCIDENTS_VIEW = 'incidents:view',
    INCIDENTS_EDIT = 'incidents:edit',
    INCIDENTS_DELETE = 'incidents:delete',    

    DASHBOARD_VIEW = 'dashboard:view',
    
    REPORTS_CREATE = 'daily-reports:create',
    REPORTS_VIEW = 'daily-reports:view',
    REPORTS_DELETE = 'daily-reports:delete',
}