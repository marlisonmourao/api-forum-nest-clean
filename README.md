# 🚀 API Forum

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

A modern, scalable, and high-performance forum API built with NestJS, following clean architecture principles and best practices. This project implements a robust backend system for forum applications with features like real-time notifications, file uploads, and advanced search capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technical Stack](#-technical-stack)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- 🔐 JWT-based authentication and authorization
- 👥 User management with role-based access control
- 💬 Forum posts and comments system
- 🔍 Advanced search functionality
- 📱 Real-time notifications
- 📎 File uploads with AWS S3 integration
- 🔄 Caching with Redis
- 📊 Analytics and reporting

### Technical Features
- 🏗️ Clean Architecture implementation
- 🧪 Comprehensive test coverage
- 📈 Performance monitoring
- 🔒 Security best practices
- 📝 API documentation with Swagger
- 🐳 Docker containerization
- 🔄 CI/CD pipeline ready

## 🏗️ Architecture

The project follows a clean architecture approach with clear separation of concerns:

```
src/
├── core/           # Core business logic and use cases
│   ├── use-cases/  # Application business rules
│   ├── services/   # Business services
│   └── interfaces/ # Core interfaces
├── domain/         # Domain entities and interfaces
│   ├── entities/   # Business entities
│   ├── value-objects/ # Value objects
│   └── repositories/ # Repository interfaces
└── infra/          # Infrastructure layer
    ├── controllers/ # API endpoints
    ├── repositories/ # Repository implementations
    ├── services/    # Infrastructure services
    └── middlewares/ # Custom middlewares
```

### Architecture Diagram

```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Controllers]
    C --> D[Use Cases]
    D --> E[Domain Entities]
    D --> F[Repositories]
    F --> G[(PostgreSQL)]
    F --> H[(Redis Cache)]
    F --> I[(AWS S3)]
    J[Background Jobs] --> F
    K[WebSocket] --> C
```

### Data Flow
1. Client requests enter through the API Gateway
2. Controllers handle request validation and routing
3. Use Cases implement business logic
4. Domain Entities represent core business objects
5. Repositories handle data persistence
6. Infrastructure services manage external integrations

## 🛠️ Technical Stack

### Backend
- **Framework**: NestJS v10
- **Language**: TypeScript v5
- **Runtime**: Node.js v18+
- **Package Manager**: pnpm

### Database & Cache
- **Primary Database**: PostgreSQL v15
- **ORM**: Prisma v6
- **Cache**: Redis v7
- **Search**: PostgreSQL Full-Text Search

### Storage & CDN
- **File Storage**: AWS S3
- **CDN**: CloudFront (optional)

### Authentication & Security
- **Auth**: JWT + Passport
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Rate Limiting**: Express Rate Limit

### Testing & Quality
- **Unit Testing**: Vitest
- **E2E Testing**: Vitest + Supertest
- **Code Quality**: Biome
- **Coverage**: Vitest Coverage

### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (configurable)
- **Monitoring**: Prometheus + Grafana (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm v8 or higher
- Docker and Docker Compose
- PostgreSQL v15
- Redis v7
- AWS Account (for S3)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/marlisonmourao/api-forum.git
cd api-forum
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/forum"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="1d"

# AWS
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_BUCKET_NAME="your-bucket-name"

# Application
PORT=3000
NODE_ENV=development
API_PREFIX=api
```

5. Start the development environment:
```bash
docker-compose up -d
```

6. Run database migrations:
```bash
pnpm prisma migrate dev
```

7. Seed the database (optional):
```bash
pnpm prisma db seed
```

## 💻 Development

### Running the Application

#### Development Mode
```bash
pnpm start:dev
```

#### Production Mode
```bash
pnpm build
pnpm start:prod
```

#### Debug Mode
```bash
pnpm start:debug
```

### Code Generation

```bash
# Generate a new module
pnpm nest g module module-name

# Generate a new controller
pnpm nest g controller controller-name

# Generate a new service
pnpm nest g service service-name
```

### Database Management

```bash
# Generate a migration
pnpm prisma migrate dev --name migration-name

# Reset database
pnpm prisma migrate reset

# View database
pnpm prisma studio
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
pnpm test

# e2e tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Test Structure
```
test/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/           # End-to-end tests
```

## 🚀 Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t api-forum .
```

2. Run the container:
```bash
docker run -p 3000:3000 api-forum
```

### Production Considerations

- Use environment variables for configuration
- Enable compression
- Set up proper logging
- Configure rate limiting
- Set up monitoring
- Use HTTPS
- Configure CORS properly
- Set up backup strategy

## 📚 API Documentation

The API documentation is available at `/api` when running the application. It includes:

- OpenAPI/Swagger documentation
- Request/Response examples
- Authentication requirements
- Rate limiting information
- Error codes and handling

## 🔒 Security

### Implemented Security Measures

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection
- Security headers
- Request validation

### Security Best Practices

1. Keep dependencies updated
2. Use environment variables
3. Implement proper error handling
4. Follow the principle of least privilege
5. Regular security audits
6. Input sanitization
7. Proper logging
8. Regular backups

## 📈 Performance

### Optimization Techniques

- Redis caching
- Database indexing
- Query optimization
- Connection pooling
- Compression
- Lazy loading
- Pagination
- Background jobs

### Monitoring

- Request/Response times
- Error rates
- Resource usage
- Cache hit rates
- Database performance
- API endpoint usage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Create an issue describing the feature/bug
2. Get approval from maintainers
3. Create a feature branch
4. Write tests
5. Implement the feature
6. Update documentation
7. Submit PR
8. Code review
9. Merge

### Code Style

- Follow TypeScript best practices
- Use Biome for formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Prisma team for the excellent ORM
- All contributors who have helped shape this project
- Open source community for inspiration and tools

## 📞 Support

For support, please:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/yourusername/api-forum/issues)
3. Create a new issue if needed

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
