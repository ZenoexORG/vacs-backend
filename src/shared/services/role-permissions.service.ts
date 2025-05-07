import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RolePermissionsService implements OnModuleInit {
	private rolePermissionsMap: Map<string, string[]> = new Map();

	constructor(
		@InjectRepository(Role)
		private rolesRepository: Repository<Role>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) { }

	async onModuleInit() {
		await this.loadRolePermissions();
	}

	async loadRolePermissions() {
		const roles = await this.rolesRepository.find({
			relations: { permissions: true },
		});

		roles.forEach(role => {
			const permissions = role.permissions?.map(permission => permission.name) || [];
			this.rolePermissionsMap.set(role.name, permissions);
			this.cacheManager.set(`role:${role.name}:permissions`, permissions, 3600);
		});
	}

	async getPermissionsForRole(roleName: string): Promise<string[]> {
		const cachedPermissions = await this.cacheManager.get<string[]>(`role:${roleName}:permissions`);
		if (cachedPermissions) {
			return cachedPermissions;
		}

		const permissions = this.rolePermissionsMap.get(roleName) || [];

		await this.cacheManager.set(`role:${roleName}:permissions`, permissions, 3600);

		return permissions;
	}

	async refreshRolePermissions() {
		await this.loadRolePermissions();
	}
}