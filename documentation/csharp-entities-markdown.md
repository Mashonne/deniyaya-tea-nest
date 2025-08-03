# DeniyayaTeaNest - Backend Entity Models Documentation

## Overview
This document outlines the core entity models for the DeniyayaTeaNest backend system built with .NET Core. These entities represent the fundamental data structures for managing the tea shop's operations including products, orders, customers, and users.

## Core Architecture

### Base Entity Pattern
All entities inherit from a common `BaseEntity` class that provides standard fields for tracking and soft deletion.

### Entity Relationships
- **Users** create and manage **Orders**
- **Orders** contain multiple **OrderItems**
- **OrderItems** reference **Products**
- **Customers** place **Orders** and provide **Feedback**

## Enumeration Types

### UserRole
Defines the access levels for system users:
```csharp
public enum UserRole
{
    Admin,      // Full system access
    Manager,    // Operational management
    Staff       // Basic operations
}
```

### TeaType
Categories for tea products:
```csharp
public enum TeaType
{
    BlackTea,
    GreenTea,
    WhiteTea,
    HerbalTea,
    OolongTea,
    FlavoredTea,
    Other
}
```

### OrderStatus
Order lifecycle states:
```csharp
public enum OrderStatus
{
    Pending,     // Order placed, awaiting processing
    Processing,  // Order being prepared
    Completed,   // Order ready/delivered
    Cancelled    // Order cancelled
}
```

## Entity Models

### 1. BaseEntity (Abstract)
**File**: `Core/Entities/BaseEntity.cs`  
**Purpose**: Provides common fields for all entities

#### Properties
- `Id` (Guid): Unique identifier
- `CreatedAt` (DateTime): Record creation timestamp
- `UpdatedAt` (DateTime): Last modification timestamp
- `IsActive` (bool): Active/inactive status
- `IsDeleted` (bool): Soft deletion flag

#### Implementation
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
}
```

### 2. Product Entity
**File**: `Core/Entities/Product.cs`  
**Purpose**: Represents tea products in inventory

#### Properties
- `Name` (string): Product display name
- `Type` (TeaType): Tea category
- `Description` (string?): Optional product description
- `Price` (decimal): Selling price
- `QuantityInStock` (int): Current inventory count
- `ReorderLevel` (int): Minimum stock threshold
- `Unit` (string): Measurement unit (default: "g")
- `ImageUrl` (string?): Product image path

#### Relationships
- Has many `OrderItems` (1:N)

#### Implementation
```csharp
public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public TeaType Type { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int QuantityInStock { get; set; }
    public int ReorderLevel { get; set; } = 10;
    public string Unit { get; set; } = "g";
    public string? ImageUrl { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
```

### 3. User Entity
**File**: `Core/Entities/User.cs`  
**Purpose**: System users (staff members)

#### Properties
- `Email` (string): Login email address
- `PasswordHash` (string): Encrypted password
- `Name` (string): Display name
- `Role` (UserRole): Access level

#### Relationships
- Has many `Orders` (1:N)

#### Security Notes
- Passwords stored as hashed values
- Email serves as unique identifier for login

### 4. Customer Entity
**File**: `Core/Entities/Customer.cs`  
**Purpose**: Customer information management

#### Properties
- `Name` (string): Customer full name
- `Phone` (string?): Contact number
- `Email` (string?): Email address
- `Address` (string?): Delivery address

#### Relationships
- Has many `Orders` (1:N)
- Has many `Feedbacks` (1:N)

#### Business Rules
- Either phone or email should be provided
- Customer records are never hard-deleted

### 5. Order Entity
**File**: `Core/Entities/Order.cs`  
**Purpose**: Customer order transactions

#### Properties
- `OrderNumber` (string): Unique order identifier
- `CustomerId` (Guid?): Optional customer reference
- `UserId` (Guid): Staff who created the order
- `Status` (OrderStatus): Current order state
- `TotalAmount` (decimal): Order total
- `Notes` (string?): Special instructions

#### Relationships
- Belongs to `Customer` (N:1) - Optional
- Belongs to `User` (N:1) - Required
- Has many `OrderItems` (1:N)

#### Business Logic
- Order number generated automatically
- Total amount calculated from items
- Status transitions tracked in audit log

### 6. OrderItem Entity
**File**: `Core/Entities/OrderItem.cs`  
**Purpose**: Individual line items in orders

#### Properties
- `OrderId` (Guid): Parent order reference
- `ProductId` (Guid): Product reference
- `Quantity` (int): Ordered quantity
- `Price` (decimal): Price at time of order

#### Relationships
- Belongs to `Order` (N:1)
- Belongs to `Product` (N:1)

#### Important Notes
- Price is captured at order time (historical pricing)
- Quantity affects product stock levels

### 7. Feedback Entity
**File**: `Core/Entities/Feedback.cs`  
**Purpose**: Customer reviews and ratings

#### Properties
- `CustomerId` (Guid): Customer reference
- `Rating` (int): 1-5 star rating
- `Comment` (string?): Optional text feedback

#### Relationships
- Belongs to `Customer` (N:1)

## Repository Pattern

### Generic Repository Interface
**File**: `Core/Interfaces/Repositories/IGenericRepository.cs`  
**Purpose**: Standard CRUD operations for all entities

#### Methods
```csharp
public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task<int> SaveChangesAsync();
}
```

#### Usage Example
```csharp
// In a service class
public class ProductService
{
    private readonly IGenericRepository<Product> _productRepo;
    
    public async Task<Product?> GetProductAsync(Guid id)
    {
        return await _productRepo.GetByIdAsync(id);
    }
}
```

## Database Considerations

### Entity Framework Configuration
- All entities use Guid as primary key
- Soft deletion implemented via `IsDeleted` flag
- Automatic timestamp updates on save
- Lazy loading disabled by default

### Indexing Strategy
- Email fields indexed for user lookup
- Order number indexed for search
- Product name indexed for search
- Customer phone/email indexed

### Data Integrity
- Foreign key constraints enforced
- Cascade delete disabled (soft delete only)
- Required fields validated at database level

## Migration Notes

### Initial Migration
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Seeding Data
- Default admin user created on first run
- Sample tea products can be seeded
- Test customers for development

## Best Practices

### Entity Usage
1. Always use repository pattern for data access
2. Never expose entities directly to API
3. Use DTOs for API contracts
4. Implement validation in service layer

### Performance Considerations
1. Use `AsNoTracking()` for read-only queries
2. Implement pagination for list operations
3. Eager load related data when needed
4. Cache frequently accessed data

### Security Guidelines
1. Never store plain text passwords
2. Validate all user inputs
3. Implement audit logging for sensitive operations
4. Use parameterized queries only