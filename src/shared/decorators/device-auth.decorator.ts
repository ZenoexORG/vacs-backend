import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiKeyGuard } from "src/shared/guards/api.guard";
import { ApiHeader, ApiSecurity } from "@nestjs/swagger";

export function DeviceAuth() {
	return applyDecorators(
		UseGuards(ApiKeyGuard),
		ApiSecurity("X-API-KEY"),
		ApiHeader({
			name: "X-API-KEY",
			description: "API key for device authentication",
			required: true,
		}),
	);
}