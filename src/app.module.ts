import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyModule } from "@modules/agency/agency.module";
import { CompanyModule } from "@modules/company/company.module";
import { EquipmentModule } from "@modules/equipment/equipment.module";
import { RolModule } from "@modules/rol/rol.module";
import { UserModule } from "@modules/user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          port: parseInt(process.env.PORT, 10) || 3000,
          database: {
            host: process.env.DB_HOST || "127.0.0.1",
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USERNAME || "postgres",
            password: process.env.DB_PASSWORD || "postgres",
            name: process.env.DB_DATABASE || "postgres",
          },
          environment: process.env.NODE_ENV,
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get("database"));
        return {
          type: "postgres",
          host: configService.get("database.host"),
          port: configService.get("database.port"),
          username: configService.get("database.username"),
          password: configService.get("database.password"),
          database: configService.get("database.name"),
          autoLoadEntities: true,
          synchronize: false,
          logging: configService.get("environment") === "dev",
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    CompanyModule,
    RolModule,
    UserModule,
    AgencyModule,
    EquipmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
