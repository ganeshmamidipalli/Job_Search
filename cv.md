# Ganesh Hemanth Mamidipalli

**AI Engineer | LLM Systems | Generative AI Infrastructure | Multi-Agent Platforms | MLOps**

(316) 210-1890 | mganeshhemanth@gmail.com | [LinkedIn](https://linkedin.com/in/ganesh-mamidipalli-951a95102) | [GitHub](https://github.com/ganeshmamidipalli) | [Portfolio](https://ganeshmamidipalli.com)

---

## Professional Summary

AI Engineer with 8+ years building production AI systems that ship -- from classical ML pipelines processing millions of records to enterprise multi-agent architectures serving regulated industries. Delivered measurable results: 58% inference latency reduction, 35% faster enterprise data access, 32% fewer deployment errors, and 94% task completion on multi-agent benchmarks. Deep expertise in LLM fine-tuning (QLoRA, GRPO, RLHF), production RAG pipelines, and agentic orchestration (LangChain, LangGraph, Google ADK, MCP, A2A). Currently researching LLM output determinism for financial, healthcare, and legal deployments. M.S. Data Science, GPA 3.9/4.0.

---

## Technical Skills

### GenAI & LLMs
LLM Fine-Tuning (QLoRA, GRPO, PEFT, RLHF, SFT), RAG Pipelines, Multi-Agent Systems (MCP, A2A, ADK), Agentic AI (ReAct, LangGraph, CrewAI, Autogen), Prompt Engineering, Guardrails, Hallucination Mitigation, LLM Determinism & Reproducibility

### ML & Deep Learning
PyTorch, TensorFlow, scikit-learn, XGBoost, LightGBM, CNNs, Transformers, BERT, RoBERTa, T5, NER, Sentiment Analysis, Vector Embeddings, SHAP, Bayesian Optimization, A/B Testing, Time Series Forecasting

### LLMs & Models
Gemini, GPT-4o, Claude, Llama 3, Mistral, T5, BLOOM, RoBERTa, Falcon, DistilBERT

### MLOps & Infrastructure
MLflow, Kubeflow, Langfuse, Promptflow, Vertex AI Model Monitoring, Docker, Kubernetes, Terraform, Jenkins, Tekton, CI/CD, Model Registry, Canary Deploys, Drift Detection, SRE Principles

### Cloud
GCP (Vertex AI, BigQuery, Cloud Run, Dataflow, Workbench) | AWS (SageMaker, Bedrock, EKS, Lambda, S3) | Azure (ML Studio, DevOps, Databricks)

### Data & Databases
FAISS, Pinecone, ChromaDB, Weaviate, PostgreSQL, MongoDB, MySQL, Apache Kafka, Apache Spark, PySpark, Airflow, Delta Lake, Feature Store, ETL/ELT

### Programming
Python (Expert), Java, SQL, Pandas, NumPy, SciPy, Bash/Shell

### Security & Governance
AI Red Teaming, Prompt Injection Detection, OWASP Top-10 LLMs, PII Handling, Model Audit Trails, ITPM Compliance

---

## Professional Experience

### AI Engineer - GCP & MLOps Platform | National Institute for Aviation Research (NIAR) | Wichita, KS
**January 2025 - Present**

- Built enterprise multi-agent platform (Google ADK + A2A protocol + MCP) that connects 6 specialized AI agents to legacy aviation data systems via Java backend services -- reduced enterprise data access latency by 35% and enabled natural-language SQL queries across 12M+ records through BigQuery MCP Server.
- Deployed production multi-hop RAG pipeline (LangChain + Vertex AI Vector Search) processing 50K+ aviation documents with dynamic chunking and hybrid retrieval; fine-tuned Gemini on domain data using QLoRA and GRPO -- improved domain-specific answer accuracy from 67% to 89%.
- Designed deterministic inference pipeline with automated validation gates (SHAP analysis, statistical tests, drift detection) enforced at every CI/CD deploy -- achieved 99.7% benchmark compliance across all production models with zero compliance violations.
- Deployed containerized REST API endpoints (FastAPI + Docker + Cloud Run) serving 10K+ daily inference requests at p95 latency of 380ms (down from 920ms) -- 58% latency reduction with 99.9% uptime using SRE concurrency tuning.
- Established model governance framework: MLflow Registry with staging-to-production promotion gates, full lineage tracking, and Terraform-managed infrastructure -- cut deployment errors from 47 to 32 per quarter (32% reduction).
- Built real-time drift monitoring (MLflow metrics + Vertex AI Model Monitoring) with SLO-based alerting detecting data drift and model degradation 45% faster than manual review; resolved 500+ guardrail incidents by codifying prompt safety policies.

**Stack:** PyTorch, TensorFlow, GCP (Vertex AI, BigQuery, Cloud Run), Google ADK, LangChain, Java, Terraform, MLflow, Kubeflow, MCP, A2A, Docker, Kubernetes, PySpark, Databricks, FastAPI

### AI Engineer - LLM Fine-Tuning & AI Security | Knowmadics | Remote
**July 2024 - January 2025**

- Architected end-to-end LLMOps infrastructure on GCP Vertex AI: Kubeflow orchestration, Terraform-provisioned resources, multi-agent GenAI applications with A2A protocol -- enabled 4 specialized agents to collaborate on complex document analysis tasks with full audit trails.
- Built production agentic RAG pipeline (LangChain + FAISS + ChromaDB) where retrieval agents pass grounded context to generation agents via A2A protocol -- improved domain retrieval accuracy from 71% to 89% (25% gain) with embedded guardrails for hallucination mitigation and PII filtering.
- Deployed Langfuse + Promptflow observability stack monitoring 50K+ daily LLM calls -- achieved 30% faster root-cause analysis on production issues; implemented Vertex AI Model Monitoring for continuous drift detection.
- Built distributed data processing pipelines (Dask + Spark) ingesting 1M+ transactions per second via Apache Kafka for real-time feature generation powering recommendation and risk models.
- Optimized LLM inference for production: quantization (GPTQ, AWQ), model compression, and hyperparameter tuning reduced Kubernetes inference latency from 1.2s to 504ms (58% reduction) while maintaining >95% on HELM benchmarks.
- Developed AI Security Red Teaming framework testing 15 attack vectors: prompt injection, model DoS, information leakage, jailbreaking -- delivered OWASP Top-10 LLMs compliance scoring adopted as standard across 3 product teams.

**Stack:** PyTorch, TensorFlow, GCP (Vertex AI, Cloud Run), Google ADK, LangChain, LangGraph, Java, AWS (EKS, S3, Bedrock), MLflow, Langfuse, Docker, Kubernetes, Apache Kafka, Dask, Spark

### Senior Data Scientist / ML Engineer | WayCool Technologies | India (Remote)
**January 2021 - January 2024**

- Built production Python ML library extending scikit-learn APIs with 4 advanced feature selection modules (PseudoFE, RFE, TFE, CorrelationReducer) -- adopted by 3 downstream teams, reduced feature engineering time by 40% across 12 production models.
- Led Kubeflow V1 to V2 migration: redesigned 8 pipeline components (XGBoost training, data prep, K-Fold CV, GroupCV), coordinated rollout across 4 teams -- improved API stability, eliminated 15 recurring pipeline failures, increased team deployment velocity 30%.
- Built Jenkins CI/CD pipelines automating package testing and PyPI publishing for internal ML libraries -- shortened ML development lifecycle by 20% (from 5 weeks to 4 weeks average per model iteration).
- Implemented KubeRay + Ray distributed training framework enabling fault-tolerant model training on datasets 10x larger than previous capacity; built hyperparameter optimization suite (BayesOptCV, OptunaCV, OutofTimeCV) reducing tuning time by 35%.
- Incorporated Rubicon-ML for automated experiment logging -- achieved full reproducibility across 200+ experiments with searchable hyperparameter and metric tracking.

**Stack:** Python, Java, scikit-learn, XGBoost, LightGBM, Pandas, NumPy, Dask, Spark, Kubeflow, Jenkins, Docker, Ray, Kubernetes, Azure, Rubicon-ML

### Data Scientist / Business Intelligence Analyst | Sagacious Research | India
**June 2019 - December 2020**

- Boosted customer churn prediction accuracy from 74% to 96% (22% improvement) using XGBoost, LightGBM, and Bayesian optimization on 5M+ row Spark-processed datasets -- model directly informed retention strategy saving estimated $2M annually.
- Built scalable data pipelines (Apache Spark + Kafka + Airflow) processing 100GB+ daily for analytics; applied k-fold and GroupCV validation measuring F1, AUC-ROC, precision, and recall across 8 production models.
- Deployed supervised (logistic regression, random forests, GBMs) and unsupervised models (K-means, PCA, anomaly detection) for business pattern discovery and risk modeling across 3 business units.

**Stack:** TensorFlow, PyTorch, scikit-learn, XGBoost, Apache Spark, Apache Kafka, Airflow, AWS, SQL, Python, Java, Pandas, NumPy

---

## Active Research

### LLM Output Determinism & Reproducibility (Ongoing, 2025)

- Investigating non-deterministic LLM behavior in regulated enterprises (financial, healthcare, legal) where reproducible, auditable outputs are compliance requirements.
- Engineering constraint-based decoding pipelines: structured output schemas (JSON-mode, GBNF/Lark grammar-constrained decoding), deterministic prompt templates, and retrieval grounding to eliminate stochastic drift in multi-hop reasoning chains.
- Building evaluation benchmark measuring output consistency (semantic similarity, token-level diff, ROUGE-L variance) across 100+ repeated inference runs on Gemini, GPT-4o, Llama 3.
- Target: open-source determinism toolkit for enterprise LLM deployments on GCP Vertex AI and AWS Bedrock with MLflow integration.

---

## Projects & Open Source

### OpenClaw AI - Autonomous Multi-Agent Reasoning Platform
[ganeshmamidipalli.com](https://ganeshmamidipalli.com)

- Built autonomous multi-agent platform orchestrating 4 specialized agents (Planner, Executor, Critic, Arbiter) coordinated via MCP with bounded context windows and adversarial-resilient guardrails.
- Implemented dynamic inter-agent trust scoring where agents escalate, challenge, or override peer outputs based on confidence thresholds -- directly solving hallucination propagation in multi-hop chains.
- Achieved 94% task completion accuracy on complex multi-step benchmarks vs <70% for leading open-source frameworks (AutoGen, CrewAI).
- Stack: LangGraph, GCP Vertex AI, fine-tuned Gemini, MCP, Python.

### Multi-Agent AI Platform - MCP & A2A Protocol
- Enterprise multi-agent system using MCP + A2A for secure, compliant AI orchestration with BigQuery MCP Server for natural-language-to-SQL execution under strict ITPM governance.

### Financial Domain RAG Assistant - Regulatory Compliance
- Production RAG pipeline over financial disclosures and regulatory filings using FAISS embeddings; LLM guardrails improved factual accuracy by 25% validated through systematic A/B testing across 1,000+ queries.

### WSDM Cup 2024 - LLM Evaluation (Top 10% Globally)
- Built LightGBM + Universal Sentence Encoder model for multilingual LLM response scoring; fine-tuned DistilBERT with GAMMA 4-bit quantization. Competed against 2,000+ teams worldwide.

### Computer Vision Quality Inspection System
- End-to-end deep learning pipeline (ResNet, EfficientNet) for production quality inspection; reduced manual inspection effort by 40% processing 10K+ images daily.

---

## Education

- **M.S. Business Analytics - Data Science Track** | Wichita State University | GPA: 3.9/4.0
- **B.Tech Electronics & Communication Engineering** | Lovely Professional University, India

---

## Certifications & Honors

- Top 10% Global Finalist - WSDM Cup 2024 (LLM Evaluation Track, 2,000+ teams)
- Certified Data Scientist - Dell / NVIDIA GenAI Model Augmentation & Data Engineering
- Meta Advanced Management Program - Leadership and Technical Management
- $10,000 Garvey Family Scholarship - Academic Excellence and Research Potential
- Graduate Research Assistantships - NIAR (Aviation AI) & Koch Global Trading Center (Financial ML)

---

## Research & Publications

- LLM Output Determinism & Reproducibility - constraint-based decoding for regulated enterprise deployments (in progress, 2025)
- Transformer-based NLP models for domain-specific aviation applications - peer-reviewed, NIAR research lab
- LLM safety evaluation methodologies and guardrail design for regulated environments
- AI security frameworks: prompt injection detection and red teaming for enterprise LLM deployments
