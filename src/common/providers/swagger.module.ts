import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('REST API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);
}
