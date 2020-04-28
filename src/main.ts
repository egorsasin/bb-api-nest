import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';
import { ConfigReader } from 'neconfig';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.enableCors();

  const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf-8');
    }
  }

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  app.useGlobalFilters(new HttpExceptionFilter);

  const config = app.get(ConfigReader);
  const port = config.getIntOrThrow('PORT');

  await app.listen(port);
  console.log(`Server listening on port ${ port }`);
}

bootstrap();
