# **ServiceGen**

# **System Specification Document (SystemSpec)**

Version: 0.1.0  
 Derived from: ServiceGen BRD v1.0

---

# **1\. System Architecture Overview**

ServiceGen is a multi-tenant modular SaaS platform composed of the following bounded contexts:

1. Identity & Tenant Domain

2. Service Domain

3. Chatbot Engine Domain

4. Data Source & Embedding Domain

5. Channel Connector Domain

6. Billing & Subscription Domain

7. Marketing & CRM Domain

8. Observability & Governance Domain

Architecture style:

* Modular Monolith (Phase 1\)

* Event-ready

* API-first

* Multi-tenant enforced at persistence layer

---

# **2\. Identity & Tenant Domain Specification**

## **2.1 Data Model**

### **tenants**

tenant\_id (UUID, PK)  
name (string)  
region (string)  
default\_language (string)  
created\_at (timestamp)  
deleted\_at (timestamp, nullable)

### **users**

user\_id (UUID, PK)  
tenant\_id (FK)  
email (string, unique per tenant)  
password\_hash (string)  
role (enum: admin, manager, editor, viewer)  
created\_at  
---

## **2.2 Tenant Deletion Model**

Deletion Type: Soft Delete

Process:

1. Set tenant.deleted\_at \= now()

2. Invalidate all active sessions

3. Archive associated S3/MinIO namespace

4. Emit domain event:  
    tenant.deleted

Cascade rules:

* Services → soft delete

* Users → soft delete

* Subscriptions → mark as cancelled

---

# **3\. Service Domain Specification**

## **3.1 Data Model**

### **services**

service\_id (UUID)  
tenant\_id (FK)  
name (string)  
description (text)  
status (enum: draft, active, archived)  
created\_at  
archived\_at  
---

## **3.2 Service State Machine**

draft → active → archived  
archived → (no transitions)

Constraints:

* Only active services may process messages

* Archived services reject inbound requests

---

# **4\. Chatbot Engine Specification**

## **4.1 Configuration Model**

### **chatbots**

chatbot\_id (UUID)  
service\_id (FK)  
model\_type (string)  
system\_prompt (text)  
temperature (float)  
language (string)  
---

## **4.2 Request Processing Flow**

1. Receive inbound message

2. Identify service context

3. Retrieve relevant embeddings

4. Construct RAG prompt

5. Call LLM provider

6. Store response

7. Return structured JSON response

---

## **4.3 Conversation Storage**

### **conversations**

conversation\_id  
service\_id  
channel\_id  
started\_at

### **messages**

message\_id  
conversation\_id  
sender\_type (user | bot)  
content  
created\_at  
---

# **5\. Data Source & Embedding Domain**

## **5.1 Storage**

Raw files:

* S3 or MinIO  
   Path:

tenant/\<tenant\_id\>/service/\<service\_id\>/datasources/  
---

## **5.2 Embedding Model**

### **embeddings**

embedding\_id  
service\_id  
vector (array\<float\>)  
source\_reference  
created\_at

Vector store:

* Qdrant (default)

* Namespace \= tenant\_id

---

# **6\. Channel Connector Specification**

## **6.1 Unified Message Contract**

Inbound normalized structure:

{  
 "tenant\_id": "",  
 "service\_id": "",  
 "channel": "",  
 "external\_user\_id": "",  
 "message\_text": "",  
 "timestamp": ""  
}  
---

## **6.2 Deployment Model**

Channel deployment creates:

* Webhook registration

* Channel credential storage

* Deployment status record

---

# **7\. Billing & Subscription Specification**

## **7.1 Data Model**

### **subscriptions**

subscription\_id  
tenant\_id  
plan (free, starter, business, enterprise)  
status (active, cancelled, past\_due)  
started\_at  
ended\_at

### **usage\_metrics**

tenant\_id  
metric\_type (agents, requests, embeddings, messages)  
value  
period\_start  
period\_end  
---

## **7.2 Overage Computation**

If usage \> plan threshold:

* Generate billing event

* Add line item to invoice

* Persist overage record

---

# **8\. Marketing & CRM Specification**

## **8.1 Lead Model**

### **leads**

lead\_id  
tenant\_id  
email  
source (form, chatbot)  
status  
created\_at  
---

## **8.2 Campaign Model**

### **campaigns**

campaign\_id  
tenant\_id  
name  
scheduled\_at  
status  
---

# **9\. Multi-Tenancy Enforcement**

All database queries MUST include:

WHERE tenant\_id \= \<context.tenant\_id\>

Row-Level Security required in production.

---

# **10\. Security Specification**

* JWT tokens include:

  * user\_id

  * tenant\_id

  * role

* Passwords hashed (bcrypt/argon2)

* Secrets encrypted at rest

* PCI zone isolated

---

# **11\. Observability Specification**

Metrics:

* chat\_latency\_ms

* embedding\_generation\_failures

* billing\_overage\_events

* campaign\_send\_failures

Structured logging format:

{  
 timestamp,  
 level,  
 tenant\_id,  
 service\_id,  
 event\_type,  
 metadata  
}  
---

# **12\. Failure & Error Model**

Error categories:

* AUTH\_ERROR

* TENANT\_NOT\_FOUND

* SERVICE\_ARCHIVED

* BILLING\_LIMIT\_EXCEEDED

* CHANNEL\_VALIDATION\_FAILED

All errors return:

{  
 error\_code,  
 message,  
 correlation\_id  
}

## **13\. Non-Functional Requirements (Technical Enforcement)**

* Chat response \< 3 seconds (p95)

* Payment processing \< 2 seconds

* Service creation \< 1 second

* Minimum uptime target: 99.5%

* PIPEDA baseline compliance

* Audit logging mandatory

