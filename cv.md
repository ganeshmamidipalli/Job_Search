# Ganesh Hemanth Mamidipalli

**Software Engineer -- LLM Systems -- Generative AI Infrastructure -- Agentic Platforms -- MLOps**

+1 (316) 210-1890 | mganeshhemanth@gmail.com | [LinkedIn](https://linkedin.com/in/ganesh-mamidipalli-951a95102) | [Portfolio](https://ganeshmamidipalli.com)

---

## Professional Summary

Software Engineer specializing in LLM Systems, Generative AI Infrastructure, and Agentic Platforms -- with 8+ years building production-grade AI systems from classical ML foundations through enterprise-scale multi-agent architectures. Deep hands-on expertise in LLM fine-tuning (QLoRA, GRPO, RLHF), Retrieval-Augmented Generation (RAG pipelines, vector stores, chunking strategies), and agentic orchestration using LangChain, LangGraph, Google ADK, MCP, and A2A protocols. Proven track record designing scalable distributed backend services, REST APIs, and containerized inference endpoints (Docker, Kubernetes, Cloud Run) on GCP and AWS. Currently researching LLM output determinism and reproducibility -- engineering constraint-based decoding pipelines for regulated enterprise deployments.

---

## Technical Skills

### GenAI & LLMs
LLM Fine-Tuning (QLoRA, GRPO, PEFT, RLHF, SFT), Multi-Agent Systems (MCP, A2A, ADK), Agentic AI (ReAct, Autogen, CrewAI, LangGraph), RAG Pipelines, NER, Entity Extraction, Prompt Engineering, Guardrails, Hallucination Mitigation, LLM Determinism & Reproducibility

### Machine Learning
Classification, Regression, Clustering, Anomaly Detection, Ensemble Methods (XGBoost, LightGBM, Random Forest), Recommender Systems, Bayesian Optimization, Reinforcement Learning, Causal Inference, A/B Testing, SHAP, Feature Engineering, Hyperparameter Optimization, Time Series Forecasting

### Deep Learning
CNNs, RNNs, LSTMs, Transformers, Attention Mechanisms, Vision Transformers (ViT), GANs, Autoencoders, Neural Architecture Search, Transfer Learning, Model Quantization, MoE, Knowledge Distillation

### NLP
Transformers, BERT, RoBERTa, DistilBERT, T5, BLOOM, NER, Entity Extraction, Text Classification, Summarization, Sentiment Analysis, Topic Modeling, NLU, NLG, Semantic Search, Vector Embeddings

### Frameworks
PyTorch, TensorFlow, Keras, JAX, Hugging Face Transformers, LangChain, LangGraph, LlamaIndex, Google ADK, Scikit-learn, OpenCV, ONNX Runtime, MLflow, LightGBM, XGBoost, SpaCy, NLTK, NeMo, Stable Diffusion

### LLMs & Models
Gemini, GPT-4o, Llama 3, Mistral, T5, BLOOM, RoBERTa, BERT, DistilBERT, Claude, Falcon

### MLOps / LLMOps
Kubeflow, MLflow, Vertex AI Model Monitoring, Langfuse, Promptflow, Tekton, Jenkins, CI/CD, Terraform (IaC), Docker, Kubernetes, Model Governance, Model Registry, Canary Deploys, Shadow Testing, Drift Detection, SRE Principles

### Cloud -- GCP (Primary)
Vertex AI, BigQuery, Cloud Run, BigQuery MCP Server, GCP Pipelines, Workbench, Dataflow

### Cloud -- AWS
SageMaker, Bedrock, S3, Lambda, EKS, EMR, Rekognition

### Cloud -- Azure
Azure ML Studio, Azure DevOps, Databricks

### Data & Databases
FAISS, Pinecone, ChromaDB, Weaviate, Vector DBs, MongoDB, PostgreSQL, MySQL, Apache Kafka, Apache Spark, Databricks, Delta Lake, Airflow, PySpark, ETL/ELT, Feature Store

### Programming
Python (Expert), Java, SQL, Pandas, NumPy, SciPy, PySpark, Bash/Shell

### Visualization
Tableau, Power BI, Matplotlib, Seaborn, Advanced Excel

### Security / Governance
AI Red Teaming, Prompt Injection Detection, OWASP Top-10 LLMs, PII Handling, Model Audit Trails, ITPM Compliance

---

## Professional Experience

### AI Engineer -- GCP & MLOps Platform | National Institute for Aviation Research (NIAR) | Wichita, KS
**Jan 2025 -- Present**

- Architected enterprise-grade multi-agent platform using Google ADK and A2A protocol for cross-agent communication, with MCP for tool integration; built Java-based backend integration services bridging legacy aviation data systems with the ADK agent runtime, and connected agents to BigQuery MCP Server for governed NL-to-SQL execution -- reducing enterprise data access latency by 35%.
- Built production multi-hop RAG pipelines (LangChain + Vertex AI Vector Search) with dynamic chunking, embedding, and structured document retrieval integrated into agent reasoning loops; fine-tuned Gemini on domain-specific data via Vertex AI Model Garden using QLoRA and GRPO, with A2A handoffs enabling specialized sub-agents to collaborate on complex retrieval + reasoning tasks.
- Designed and evaluated multi-agent orchestration patterns using Google ADK, Autogen, and LangGraph -- implementing ReAct-style reasoning loops where specialized extraction agents pass structured outputs to downstream reasoning agents via A2A protocol; engineered domain NER and Entity Extraction pipelines on Vertex AI with all experiments tracked via MLflow for reproducibility.
- Built scalable PySpark pipelines on Databricks + GCP BigQuery for risk model feature generation, improving pipeline throughput ~40% and registering features in Feature Store.
- Established model governance with MLflow Registry (staging to prod), lineage tracking, and Terraform CI/CD, cutting deployment errors by 32%.
- Designed and deployed containerized REST API inference endpoints (FastAPI + Docker + Cloud Run) achieving 58% latency reduction and 99.7% benchmark compliance; implemented automated validation gates (SHAP analysis, statistical tests, drift checks) integrated into CI/CD to enforce model quality at every deploy.
- Built real-time drift monitoring using MLflow metrics + Vertex AI Model Monitoring with SLO alerting -- detecting issues 45% faster; applied SRE principles to Cloud Run concurrency tuning for operational reliability.
- Built CI/CD pipelines via Tekton and Jenkins for automated LLM deployment, containerization, and rollout (Docker + Kubernetes); resolved 500+ guardrail incidents by codifying prompt safety policies into production guardrails -- improving model utilization ~35%.

**Stack:** PyTorch, TensorFlow, GCP (Vertex AI, Vertex AI Vector Search, BigQuery, Cloud Run), Google ADK, LangChain, Java, Terraform, MLflow, Kubeflow, MCP, A2A, Docker, Kubernetes, PySpark, Databricks, Delta Lake, FastAPI

### AI Engineer -- LLM Fine-Tuning & AI Security | Knowmadics | Remote
**Jul 2024 -- Jan 2025**

- Built end-to-end LLMOps infrastructure on GCP Vertex AI and Cloud Run with Kubeflow orchestration and Terraform-provisioned infrastructure; architected multi-agent GenAI applications using Google ADK and A2A protocol -- enabling specialized agents to collaborate on complex tasks via standardized inter-agent handoffs with audit-grade observability.
- Architected production RAG pipelines (LangChain + Google ADK) with FAISS and ChromaDB vector stores -- implemented agentic RAG where retrieval agents pass grounded context to generation agents via A2A protocol, improving domain retrieval accuracy 25%; embedded guardrails for hallucination mitigation and PII filtering directly into the inference path on Vertex AI.
- Deployed Langfuse + Promptflow observability stack -- achieved 30% faster debugging cycles; implemented Vertex AI Model Monitoring for continuous drift detection and performance tracking.
- Developed distributed data processing pipelines using Dask and Spark for real-time feature generation on 1M+ TPS systems with Apache Kafka ingestion.
- Built real-time Hybrid Recommendation System (Item-Item model, K-means clustering, Apriori) driving 40% lift in total transaction value; built Streamlit NL-to-SQL converter reducing issue resolution time significantly.
- Evaluated LLMs across HF Leaderboard, HELM, BIG-bench, and OpenCompass using torchtune; optimized models for production via quantization, model compression, and hyperparameter tuning -- reducing Kubernetes inference latency 58% while maintaining benchmark quality scores.
- Developed AI Security Red Teaming framework: prompt injection detection, model DoS, information leakage -- with OWASP Top-10 LLMs compliance scoring.

**Stack:** PyTorch, TensorFlow, GCP (Vertex AI, Cloud Run), Google ADK, LangChain, LangGraph, Java, AWS (EKS, S3, Bedrock), MLflow, Langfuse, Docker, Kubernetes, Apache Kafka, Dask, Spark

### Senior Data Scientist / ML Engineer | WayCool Technologies | India (Remote)
**Jan 2021 -- Jan 2024**

- Developed versatile Python ML library extending scikit-learn-compliant APIs (XGBoost, LightGBM) with advanced feature selection modules: PseudoFE, Recursive Feature Elimination (RFE), Target Feature Elimination (TFE), and CorrelationReducer.
- Architected multiple Kubeflow components for XGBoost training, data preparation, K-Fold CV, and GroupCV; led Kubeflow V1 to V2 migration improving scalability, API stability, and downstream team velocity.
- Leveraged KubeRay + Ray distributed framework for fault-tolerant end-to-end model training lifecycles at scale; enhanced hyperparameter optimization tooling: BayesOptCV, OptunaCV, OutofTimeCV.
- Built Jenkins CI/CD pipelines for automated package testing and PyPI publishing; shortened ML development lifecycle by 20% and implemented CI/CD automation for reinforcement learning-based anomaly detection systems.
- Incorporated Rubicon-ML for automated experiment logging -- boosting reproducibility and streamlining ML workflow tracking across hyperparameters and metrics.

**Stack:** Python, Java, scikit-learn, XGBoost, LightGBM, Pandas, NumPy, Dask, Spark, Kubeflow, Jenkins, Docker, Ray, Kubernetes, Azure, Rubicon-ML

### Data Scientist / Business Intelligence Analyst | Sagacious Research | India
**Jun 2019 -- Dec 2020**

- Boosted predictive model accuracy by 22% for customer churn prediction using XGBoost, LightGBM, and Bayesian optimization; engineered high-impact features from large Spark-processed datasets.
- Deployed supervised learning models (logistic regression, decision trees, random forests, GBMs) and unsupervised techniques (clustering, PCA, anomaly detection) for business pattern discovery and risk modeling.
- Built scalable data pipelines using Apache Spark, Kafka, and Airflow for large-scale analytics; applied k-fold and GroupCV validation strategies evaluating F1, AUC-ROC, precision, and recall.

**Stack:** TensorFlow, PyTorch, Scikit-Learn, XGBoost, Apache Spark, Apache Kafka, Airflow, AWS, SQL, Python, Java, Pandas, NumPy

---

## Active Research

### LLM Output Determinism & Reproducibility (Ongoing)

Investigating the core challenge of non-deterministic LLM behavior in regulated enterprise environments where reproducible, auditable outputs are a compliance requirement. Research focuses on:

- **Temperature & Sampling Control:** Systematic study of top-p, top-k, temperature scheduling, and beam search constraints to minimize output variance across inference runs while preserving response quality.
- **Seed-based Reproducibility Protocols:** Engineering deterministic decoding pipelines by controlling random seeds at framework level (PyTorch, TensorFlow) and aligning hardware floating-point behavior across GPU/TPU runs.
- **Constraint-Based Output Shaping:** Combining structured output schemas (JSON-mode, grammar-constrained decoding via GBNF/Lark), deterministic prompt templates, and retrieval grounding to eliminate stochastic drift in multi-hop reasoning chains.
- **Evaluation Framework:** Building benchmark suite measuring output consistency (semantic similarity, token-level diff, ROUGE-L variance) across 100+ repeated inference runs on Gemini, GPT-4o, Llama 3 -- targeting use cases in legal, financial, and healthcare document analysis.

Target outcome: open-source determinism toolkit for enterprise LLM deployments on GCP Vertex AI and AWS Bedrock, with integration into MLflow for experiment reproducibility tracking.

---

## Personal Projects & Open-Source

### OpenClaw AI -- Flagship Personal Project
[ganeshmamidipalli.com](https://ganeshmamidipalli.com)

Autonomous multi-agent reasoning platform solving adaptive decision intelligence for constrained, adversarial environments. Orchestrates a hierarchy of specialized agents (Planner, Executor, Critic, Arbiter) coordinated via MCP, each with bounded context windows and adversarial-resilient guardrails. Implements dynamic inter-agent trust scoring -- agents escalate, challenge, or override peer outputs based on confidence thresholds -- directly tackling the hallucination propagation problem in multi-hop agentic chains. Built on LangGraph + GCP Vertex AI with fine-tuned Gemini on edge-case reasoning datasets; achieves 94% task completion accuracy on complex multi-step benchmarks versus below 70% for leading open-source frameworks.

### Multi-Agent AI Platform -- MCP & A2A Protocol
Enterprise multi-agent system using MCP + A2A for secure, compliant AI orchestration; integrated BigQuery MCP Server for NL-to-SQL execution against enterprise data with strict ITPM governance.

### Financial Domain RAG Assistant -- Regulatory Compliance
Production RAG pipeline over financial disclosures and regulatory filings using FAISS embeddings; LLM guardrails integration improved factual accuracy by 25% with systematic A/B testing.

### WSDM Cup 2024 -- LLM Evaluation (Top 10% Globally)
Built LightGBM + Universal Sentence Encoder model for multilingual LLM response scoring; fine-tuned DistilBERT with GAMMA 4-bit quantization achieving top 10% global ranking.

### Computer Vision Quality Inspection System
End-to-end deep learning inspection pipeline using ResNet and EfficientNet; production-grade system with optimized inference reducing manual inspection effort by 40%.

---

## Education

- **M.S. in Business Analytics -- Data Science Track** | Wichita State University | GPA: 3.9/4.0
- **B.Tech in Electronics & Communication Engineering** | Lovely Professional University, India

---

## Certifications & Honors

- Top 10% Global Finalist -- WSDM Cup 2024 (LLM Evaluation Track)
- Certified Data Scientist -- Dell / NVIDIA GenAI Model Augmentation & Data Engineering Program
- Meta Advanced Management Program -- Leadership and technical management certification
- $10,000 Garvey Family Scholarship -- Academic excellence and research potential recognition
- Graduate Research Assistantships -- NIAR (Aviation AI) & Koch Global Trading Center (Financial ML)

---

## Research & Publications

- LLM Output Determinism & Reproducibility -- active research on constraint-based decoding (2025)
- Transformer-based NLP models for domain-specific aviation applications -- peer-reviewed contributions, NIAR
- LLM safety evaluation methodologies and guardrail design for regulated environments
- AI security frameworks: prompt injection detection and red teaming methodologies
