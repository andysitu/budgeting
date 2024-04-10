dotnet --list-sdks

dotnet new web -o api -f net8.0
dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 8.0

dotnet run
https://localhost:{PORT}/swagger
dotnet watch run

dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design

dotnet ef migrations add InitialCreate
dotnet ef database update
