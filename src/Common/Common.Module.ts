import { Module } from '@nestjs/common';

import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { AsyncLocalStorage } from 'async_hooks';
import { AppConfig } from '@App/Config/App.Config';

@Module({
	imports: [AsyncLocalStorage],
	providers: [
		AppConfig,
		{
			provide: AsyncLocalStorage,
			useValue: new AsyncLocalStorage()
		},
		UserHelper
	],
	exports: [UserHelper, AsyncLocalStorage]
})
export class CommonModule {}
