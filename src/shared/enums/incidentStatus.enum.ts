export enum IncidentStatus {
    OPEN = 'open', // Recién creado
    IN_PROGRESS = 'in_progress', // En atención
    RESOLVED = 'resolved', // Problema resuelto
    CLOSED = 'closed', // Verificado y cerrado formalmente
    ESCALATED = 'escalated', // Escalado a un nivel superior
    CANCELLED = 'cancelled', // Cancelado
}