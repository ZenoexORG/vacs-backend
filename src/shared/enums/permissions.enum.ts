export enum AppPermissions {
    EMPLOYEE_CREATE = 'employees:create',
    EMPLOYEE_VIEW = 'employees:view',
    EMPLOYEE_UPDATE = 'employees:edit',
    EMPLOYEE_DELETE = 'employees:delete',

    ROLE_CREATE = 'roles:create',
    ROLE_VIEW = 'roles:view',
    ROLE_UPDATE = 'roles:edit',
    ROLE_DELETE = 'roles:delete',

    VEHICLE_CREATE = 'vehicles:create',
    VEHICLE_VIEW = 'vehicles:view',
    VEHICLE_UPDATE = 'vehicles:edit',
    VEHICLE_DELETE = 'vehicles:delete',

    VEHICLE_TYPES_CREATE = 'vehicle-types:create',
    VEHICLE_TYPES_VIEW = 'vehicle-types:view',
    VEHICLE_TYPES_UPDATE = 'vehicle-types:edit',
    VEHICLE_TYPES_DELETE = 'vehicle-types:delete',

    USER_CREATE = 'users:create',
    USER_VIEW = 'users:view',
    USER_UPDATE = 'users:edit',
    USER_DELETE = 'users:delete',

    PERMISSION_CREATE = 'permissions:create',
    PERMISSION_VIEW = 'permissions:view',
    PERMISSION_UPDATE = 'permissions:edit',
    PERMISSION_DELETE = 'permissions:delete',
    PERMISSION_ASSIGN = 'permissions:assign',
    PERMISSION_UNASSIGN = 'permissions:unassign',

    ACCESS_LOG_CREATE = 'access-logs:create',
    ACCESS_LOG_VIEW = 'access-logs:view',
    ACCESS_LOG_UPDATE = 'access-logs:edit',
    ACCESS_LOG_DELETE = 'access-logs:delete',

    INCIDENTS_CREATE = 'incidents:create',
    INCIDENTS_VIEW = 'incidents:view',
    INCIDENTS_UPDATE = 'incidents:edit',
    INCIDENTS_DELETE = 'incidents:delete',

    DASHBOARD_VIEW = 'dashboard:view',

    REPORTS_GENERATE = 'daily-reports:generate',
    REPORTS_VIEW = 'daily-reports:view',
    REPORTS_DELETE = 'daily-reports:delete',
}
