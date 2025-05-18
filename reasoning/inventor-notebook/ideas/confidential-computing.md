## Viability of Running a Confidential Computing Service

**Unlock unprecedented security and flexibility for your workloads with our
confidential computing service, powered by leading cloud providers and advanced
hardware technology.**

### Summary Table

| Feature                | Intel SGX                    | AMD SEV-SNP            | AWS Nitro Enclaves       | GCP Confidential VM      |
| ---------------------- | ---------------------------- | ---------------------- | ------------------------ | ------------------------ |
| Security Level         | High (Enclave-level)         | Very High (VM-level)   | High (Enclave-level VM)  | High (VM-level)          |
| Performance (≤1GB RAM) | Excellent (Minimal Overhead) | Excellent              | Excellent                | Excellent                |
| Performance (>1GB RAM) | Moderate                     | Excellent              | Good                     | Excellent                |
| GPU Confidentiality    | Limited                      | Limited                | Limited                  | Limited                  |
| User-Provided Hardware | Easy Deployment              | Requires VM Deployment | Not supported            | Not supported            |
| Cost Effectiveness     | High (User-managed)          | High (Internal Fleet)  | Moderate (Cloud Managed) | Moderate (Cloud Managed) |
| Scalability            | Moderate                     | High                   | Very High                | Very High                |

### Confidential Computing Technologies

#### Cloud Provider Solutions:

- **Google Cloud Platform (GCP)**: Offers Confidential VMs based on AMD SEV
  technology, providing encrypted virtual machine memory, robust isolation, and
  cryptographic attestation. Suitable for large-memory workloads with minimal
  overhead.

- **Amazon Web Services (AWS)**: Provides Nitro Enclaves, which isolate
  sensitive workloads within dedicated, lightweight virtual environments. This
  solution emphasizes secure isolation, cryptographic attestation, and seamless
  integration with AWS infrastructure.

#### Hardware-based Solutions:

- **Intel SGX**: Allows the creation of secure enclaves with user-level
  deployment, offering strong security guarantees without needing entire
  OS-level reinstallation. SGX is particularly suitable for smaller,
  serverless-style workloads typically under 1GB of RAM, ensuring minimal
  performance overhead.

- **AMD SEV-SNP**: Encrypts and secures entire VM memory, ensuring high
  isolation levels suitable for comprehensive VM-level confidential computing.
  Ideal for larger workloads and scenarios requiring extensive memory
  encryption.

### Confidentiality Guarantees

Confidential computing guarantees strong isolation and encryption, preventing
unauthorized access to data during execution, storage, and transit. Security
assurances are enhanced by cryptographic remote attestation, ensuring workload
authenticity and integrity. Intel SGX and AMD SEV-SNP offer robust security
rooted in hardware-level encryption, significantly mitigating threats posed by
compromised hosts or hypervisors.

However, GPU workloads remain a notable security limitation. Current GPU
hardware does not widely support confidential computing extensions, presenting
vulnerabilities as GPU computations and memory remain exposed to potential
inspection.

### Performance Considerations

- **Serverless and Small Workloads**: Workloads with modest memory footprints
  (under 1GB RAM), common in our serverless scenarios, experience minimal
  performance overhead when utilizing confidential computing enclaves such as
  Intel SGX or Nitro Enclaves. This makes confidential computing practical and
  efficient for typical use-cases, including secure execution of smaller AI
  models or confidential data processing.

- **GPU Workloads**: Confidential computing solutions do not currently offer
  secure GPU computation without significant performance overhead due to
  software-level encryption solutions (e.g., Fully Homomorphic Encryption).
  GPU-based AI workloads thus remain a performance and security weak point.

  UPDATE: Nvidia H100 introduces confidential computing ability:
  https://developer.nvidia.com/blog/confidential-computing-on-h100-gpus-for-secure-and-trustworthy-ai

### Operational Models

- **Cloud Hosted Fleet**: Utilizing AWS Nitro Enclaves or GCP Confidential VMs
  provides immediate scalability, robust security, and straightforward
  integration.

- **Self-Hosted Fleet**: Deploying confidential computing servers internally
  using AMD SEV or Intel SGX enables greater control and potential cost savings.

- **Community-Contributed Fleet**: Allowing users to offer their hardware
  (primarily Intel SGX-enabled due to minimal OS disruption) enhances
  decentralization and resource availability, provided hardware compatibility
  can be assured.

### Cost Implications

Cloud providers typically price confidential computing at a premium compared to
standard computing instances. Discounts are primarily obtained through long-term
usage commitments rather than hardware provisioning. Hosting internally or
allowing user-contributed hardware may offer cost savings and resource
flexibility, though it requires careful management and secure configuration
practices.

### Conclusion

Running a confidential computing service leveraging cloud providers and hardware
technologies from Intel and AMD is highly viable, particularly for smaller,
confidential workloads. While CPUs currently offer strong guarantees for
confidentiality and acceptable performance overhead, GPU security remains
limited. Balancing cloud-provided, internally-hosted, and user-contributed
resources maximizes flexibility and cost-effectiveness, ensuring robust
confidentiality for diverse computational needs.

https://confidentialcontainers.org/docs/use-cases/supply-chain/
