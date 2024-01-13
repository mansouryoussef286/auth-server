import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Configuration from '@App/Config/Configuration';

export interface Config {
  Env: string;
  Version: string;
}

@Injectable()
export class AppConfig {
  constructor(
    @Inject(Configuration.KEY)
    public Config: ConfigType<typeof Configuration>,
  ) {}
}
