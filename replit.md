# Sky Alliance Discord Bot - Architecture Overview

## Overview

This project is a Discord bot for the Sky Alliance virtual airline alliance in GeoFS. It provides user management, XP tracking, airline management, and administrative functions for a Discord server managing a virtual airline alliance community.

## User Preferences

Preferred communication style: Simple, everyday language.
Data preferences: Include comprehensive airline data - all major Sky Alliance members.
Interface preferences: Supports both prefix commands (!help) and modern slash commands (/help).

## System Architecture

### Backend Architecture
- **Node.js**: Primary runtime environment
- **Discord.js v14**: Main Discord API interaction library
- **Event-driven architecture**: Uses Discord.js event system for message handling and bot lifecycle management
- **Command pattern**: Organized command structure with separate handlers for different command categories
- **Database abstraction**: Custom model layer built on top of SQLite/Drizzle ORM

### Data Storage Solutions
- **Primary Database**: SQLite with potential for PostgreSQL migration via Drizzle ORM
- **ORM**: Drizzle ORM for database operations
- **Neon Database**: Configured for serverless PostgreSQL (optional/future use)
- **Schema Design**: User profiles, airlines, hubs, codeshares, applications, events, and news

### Authentication and Authorization
- **Discord OAuth**: Uses Discord's built-in authentication through bot tokens
- **Role-based permissions**: Custom permission system checking Discord roles and permissions
- **Admin controls**: Separate admin command category with permission validation

## Key Components

### Command System
- **Command Handler**: Dynamically loads commands from multiple files
- **Command Categories**: 
  - General commands (help, info, rules)
  - XP system commands (profile, leaderboard)
  - Admin commands (user management, applications)
- **Command Structure**: Each command has name, description, usage, and execute function

### XP and Leveling System
- **Message XP**: Users gain XP from regular Discord messages
- **Activity rewards**: Different XP amounts for various activities (messages, events, flights)
- **Level calculation**: Level = XP / 100 + 1 (configurable multiplier)
- **Leaderboard**: Ranking system for user engagement

### Application Management
- **Application Handler**: Manages airline applications to join the alliance
- **Workflow**: Create → Pending → Approved/Rejected
- **Admin review**: Admins can approve or reject applications

### Database Models
- **User Model**: Stores Discord user data, XP, level, airline assignment
- **Airline Model**: Virtual airline information (IATA/ICAO codes, hubs, descriptions)
- **Hub Model**: Airport hub information
- **Application Model**: Tracks airline applications and their status

## Data Flow

1. **Message Processing**: Discord messages → Event handler → Command parser → Command execution
2. **XP Flow**: User message → XP calculation → Database update → Level recalculation
3. **Application Flow**: User applies → Creates application record → Admin review → Status update
4. **Database Operations**: Models → Database abstraction → SQLite/Drizzle → Data persistence

## External Dependencies

### Discord Integration
- **Discord.js**: Full Discord API integration
- **WebSocket**: Real-time Discord gateway connection
- **Intents**: Guild messages, message content, guild members

### Database Stack
- **SQLite3**: Local development database
- **Drizzle ORM**: Database query builder and migration tool
- **Neon Database**: Cloud PostgreSQL option for production

### Utilities
- **Embed System**: Standardized Discord message formatting
- **Permission System**: Role-based access control
- **Data Files**: Static airline and hub information

## Deployment Strategy

### Environment Configuration
- **Environment Variables**: 
  - `DISCORD_BOT_TOKEN`: Required Discord bot authentication
  - `DATABASE_URL`: Optional for PostgreSQL connection
- **Configuration**: Centralized config file for bot settings, colors, roles, channels

### Database Setup
- **Initialization**: Automatic table creation on startup
- **Migration Path**: SQLite for development, PostgreSQL for production
- **Schema Evolution**: Drizzle ORM handles schema changes and migrations

### Bot Lifecycle
1. **Startup**: Initialize database → Load commands → Connect to Discord
2. **Runtime**: Handle events → Process commands → Update user data
3. **Error Handling**: Graceful error recovery with user-friendly messages

### Scalability Considerations
- **Database**: Can migrate from SQLite to PostgreSQL without code changes
- **Command System**: Modular design allows easy addition of new commands
- **Event System**: Extensible event handling for new Discord features
- **Configuration**: Centralized settings for easy environment management