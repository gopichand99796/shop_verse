# ShopVerse Phase 1 ER Diagram

```mermaid
classDiagram
  class User {
    ObjectId _id
    string name
    string email
    string passwordHash
    string role
  }

  class Address {
    string label
    string line1
    string line2
    string city
    string postalCode
    string country
  }

  class Product {
    ObjectId _id
    string name
    string slug
    number price
    number discountPrice
    ObjectId category
    string brand
    number stock
  }

  class Category {
    ObjectId _id
    string name
    string slug
    ObjectId parentCategory
  }

  class Cart {
    ObjectId _id
    ObjectId user
    [{ product:ObjectId, qty:number, priceAtAdd:number }] items
  }

  class Order {
    ObjectId _id
    ObjectId user
    [{ product:ObjectId, qty:number, priceAtAdd:number }] items
    string paymentStatus
    string orderStatus
  }

  class Coupon {
    ObjectId _id
    string code
    string type
    number value
    Date expiryDate
  }

  class Banner {
    ObjectId _id
    string title
    string image
    string link
  }

  class Review {
    ObjectId _id
    ObjectId product
    ObjectId user
    number rating
    string comment
  }

  %% Relationships
  User "1" -- "1" Cart : has
  User "1" -- "*" Order : places
  User "1" -- "*" Review : writes
  Product "1" -- "*" Review : has
  Category "1" -- "*" Product : categorizes
  Product "*" -- "1" Category : belongs_to
  Coupon "*" -- "*" Order : applied_to

```
