`dotnet --list-sdks`

`dotnet new web -o api -f net8.0`
`dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 8.0`

dotnet run
https://localhost:{PORT}/swagger
`dotnet watch run`

`dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL`
`dotnet tool install --global dotnet-ef`
`dotnet add package Microsoft.EntityFrameworkCore.Design`
`dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore`

`dotnet ef migrations add InitialCreate`
`dotnet ef database update`

Identity with API
https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0

Remove all migrations and start over
`dotnet ef database update 0`
`dotnet ef migrations remove`

# SQL

`psql -U postgres`
`create database ...;`
`create user ... with password '...'`
`grant all privileges on database ... to ...;`
`grant usage on schema public to ...`
`alter database budgeting to ...`

`\connect DBNAME`

View tables
`\dt`
`\dt+`
`SELECT * FROM pg_catalog.pg_tables`
