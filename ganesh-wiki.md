# ganesh.wiki

> This is the AI's memory of Ganesh Mamidipalli. Read this before any evaluation, cover letter, outreach, PDF, or interview prep. Every fact here is grounded in real work. If something contradicts this file, this file wins.

## who

Ganesh Hemanth Mamidipalli | Wichita, KS (relocated from India 2024)
mganeshhemanth@gmail.com | +1 (316) 210-1890
ganeshmamidipalli.com | linkedin.com/in/ganesh-mamidipalli-951a95102
M.S. Business Analytics (Data Science Track), Wichita State University, GPA 3.9 (in progress)
B.Tech Electronics & Communication Engineering, Lovely Professional University, India

7+ years building production AI systems. Not a generalist. I work in regulated, technically demanding environments where domain knowledge matters as much as the ML: aviation, federal procurement, healthcare, agriculture.

Core: multi-agent system design (MCP, A2A, ADK, LangGraph) | LLM fine-tuning (QLoRA, GRPO, RLHF, SFT) on GCP Vertex AI and AWS Bedrock | RAG design and debugging including hard failure modes | explainable ML for regulated environments (SHAP, audit trails, governance) | GCP-primary, AWS cross-platform.

## experience

### NIAR, Wichita State University | AI Engineer -- GCP & MLOps Platform | Jan 2025 -- Present
National Institute for Aviation Research. Digital Twin and Emerging Technologies lab.

Multi-agent aviation compliance platform:
- Re-architected monolithic GenAI app into enterprise multi-agent platform: Google ADK + A2A + MCP
- Java backend integration services bridging legacy aviation data systems with ADK agent runtime
- BigQuery MCP Server: governed natural-language-to-SQL against aviation datasets, 35% reduction in enterprise data access latency
- Fine-tuned Gemini via Vertex AI Model Garden: QLoRA + GRPO on aviation engineering data
- Multi-hop RAG: LangChain + Vertex AI Vector Search, dynamic chunking, structured doc retrieval in agent reasoning loops
- Domain NER and entity extraction pipelines on Vertex AI, all experiments tracked via MLflow
- Multi-agent orchestration: ADK, Autogen, LangGraph with ReAct-style reasoning loops, A2A handoffs between specialized sub-agents

MLOps and infrastructure:
- PySpark on Databricks + BigQuery for risk model feature generation: 40% throughput improvement, features registered in Feature Store
- Model governance: MLflow Registry staging-to-prod, lineage tracking, Terraform CI/CD: 32% fewer deployment errors
- FastAPI + Docker + Cloud Run inference endpoints: 58% latency reduction, 99.7% benchmark compliance
- Automated validation gates: SHAP analysis, statistical tests, drift checks integrated into CI/CD
- Real-time drift monitoring: MLflow metrics + Vertex AI Model Monitoring + SLO alerting: 45% faster issue detection
- SRE principles applied to Cloud Run concurrency tuning
- CI/CD via Tekton + Jenkins: 500+ guardrail incidents resolved, prompt safety policies codified into production guardrails

AM and materials research (parallel track):
- Porosity classification: LPBF parts (Inconel 625, Inconel 718, Ti64, M789)
- Process parameter prediction: Directed Energy Deposition with nickel superalloys
- AIM-4AM (America Makes): ML framework reducing physical coupon testing 100+ to ~30 specimens using WGAN, PINNs, hierarchical Bayesian, active learning, MS-PFA. Contributed Section 2 of proposal (40% evaluation weight)
- CMH-17 Rev G statistical analysis app for NCAMP material allowables (Streamlit)
- AM process monitoring dashboards with OpenRouter AI insights

Stack: PyTorch, TensorFlow, GCP (Vertex AI, Vector Search, BigQuery, Cloud Run), Google ADK, LangChain, Java, Terraform, MLflow, Kubeflow, MCP, A2A, Docker, Kubernetes, PySpark, Databricks, Delta Lake, FastAPI

### Knowmadics | AI Engineer -- LLM Fine-Tuning & AI Security | Jul 2024 -- Jan 2025 (Remote)
Federal procurement and defense contractor context.

- LLMOps infrastructure: GCP Vertex AI + Cloud Run + Kubeflow + Terraform
- Multi-agent GenAI: Google ADK + A2A for inter-agent collaboration with audit-grade observability
- Production RAG: LangChain + Google ADK + FAISS/ChromaDB, agentic RAG where retrieval agents pass grounded context to generation agents via A2A, 25% accuracy improvement, guardrails for hallucination mitigation and PII filtering
- Langfuse + Promptflow observability: 30% faster debugging, Vertex AI Model Monitoring for continuous drift detection
- Distributed pipelines: Dask + Spark, real-time feature gen on 1M+ TPS systems with Kafka ingestion
- Hybrid recommendation system (Item-Item, K-means, Apriori): 40% lift in transaction value
- LLM evaluation: HF Leaderboard, HELM, BIG-bench, OpenCompass via torchtune, quantization + compression: 58% Kubernetes inference latency reduction
- AI Security Red Teaming: prompt injection detection, model DoS, information leakage, OWASP Top-10 LLMs compliance scoring

Stack: PyTorch, TensorFlow, GCP (Vertex AI, Cloud Run), Google ADK, LangChain, LangGraph, Java, AWS (EKS, S3, Bedrock), MLflow, Langfuse, Docker, Kubernetes, Apache Kafka, Dask, Spark

### WayCool Technologies | Senior Data Scientist / ML Engineer | Jan 2021 -- Jan 2024 (India, Remote)
Agriculture supply chain and healthcare data. 40 hospital clients. FHIR/HL7/HIPAA-compliant pipelines.

- Python ML library: scikit-learn-compliant APIs (XGBoost, LightGBM) with PseudoFE, RFE, TFE, CorrelationReducer
- Kubeflow V1 to V2 migration: scalability, API stability, downstream team velocity
- KubeRay + Ray distributed training at scale
- Hyperparameter optimization: BayesOptCV, OptunaCV, OutofTimeCV
- Jenkins CI/CD: automated package testing + PyPI publishing, 20% shorter ML development lifecycle
- Rubicon-ML experiment logging for reproducibility
- CI/CD automation for reinforcement learning-based anomaly detection

Stack: Python, Java, scikit-learn, XGBoost, LightGBM, Pandas, NumPy, Dask, Spark, Kubeflow, Jenkins, Docker, Ray, Kubernetes, Azure, Rubicon-ML

### Sagacious Research | Data Scientist / BI Analyst | Jun 2019 -- Dec 2020 (India)
- 22% accuracy improvement: customer churn prediction using XGBoost, LightGBM, Bayesian optimization
- Supervised + unsupervised models for business pattern discovery and risk modeling
- Scalable pipelines: Apache Spark, Kafka, Airflow

Stack: TensorFlow, PyTorch, scikit-learn, XGBoost, Apache Spark, Kafka, Airflow, AWS, SQL, Python, Java

## systems

### NIAR: 5-Agent Aviation Compliance Pipeline

Problem: 200+ analysts manually reviewing FAA Airworthiness Directives, cross-referencing MRO logs, writing compliance reports. A missed AD = federal violation + safety event. 2M+ historical docs, 3,000 new/day. Regulators require full traceability. Safety-critical ADs waiting days in batch queues.

Metrics: review time 4-6h to <2h (65% reduction) | p99 latency 4.2s to 1.8s/doc (58%) | throughput 1,800 to 3,000 docs/day (40%) | deployment errors 12 to 8/quarter (32%) | compliance accuracy 94% to 99.7% | human escalation 3.2% | hallucinated citations 14% to 1.3%

Doc types: FAA ADs (~800/year), MRO logs (1.2M records), engineering test records (500K), CFR filings (200K)

Why LangGraph: Agent 5 (Critic) must conditionally route back to Agent 4 (Report) with specific failure notes, not restart pipeline. LangGraph `add_conditional_edges()` with typed state is the only framework that does this cleanly. CrewAI has no conditional loop-back. AutoGen wrong abstraction level. Strands no conditional graph routing.

Pipeline:
1. Classification (Claude Enterprise/Bedrock): FAA_AD, MRO_LOG, ENG_TEST, CFR
2. NER (DistilBERT fine-tuned/SageMaker): part numbers, AD IDs, deadlines, tail numbers. DistilBERT over LLMs because LLMs hallucinate part numbers. 40% faster than BERT, <1% F1 loss. Key fix: WordPiece splitting "737-ALT-004" into 3 entities. Custom tokenization + 5K examples + post-processing B-PART/I-PART merging. F1: 0.82 to 0.96
3. Risk scoring (XGBoost + SHAP/SageMaker): SHAP required by regulators, LLMs can't produce it. Maintenance gap = highest-SHAP feature. Cross-refs full MRO history via MCP
4. Report generation (Llama 3 8B QLoRA/SageMaker): domain citation format. Claude cost prohibitive at 9K calls/day
5. Validation (Claude Enterprise): every citation verified against OpenSearch via exact-match. Fails loop back to Agent 4, max 3 iterations before human queue

MCP: no agent holds DB credentials. All access through MCP servers with audit trail (Aurora mcp_audit_log). p99 spike 120ms to 3.2s when European teams came online: asyncpg pool of 10 saturated by 50+ agent pods. Fix: pool 50 + overflow 100, circuit breaker, MCP replicas 1 to 3.

Vector DB: FAISS index corrupted after 200 CFR filings (IVF without re-training quantizer). Agent 5 failure 12% to 40%. Migrated to OpenSearch Serverless: managed, HA, real-time upsert, metadata pre-filtering, access control.

Ingestion: real-time S3 → SNS → MSK (Kafka, 1 topic/doc type) → LangGraph/EKS. Kafka over SQS: durable, replayable, offset management, multiple independent consumers. Batch: PySpark/EMR. Separated after production incident: batch backfill saturated real-time consumer group, delayed safety-critical ADs 4+ hours.

Production incidents:
- Hallucinated AD numbers (14% → 1.3%): model learned AD-YYYY-MM-DD format, interpolated plausible numbers. Fix: OpenSearch exact-match verification + QLoRA with GBNF grammar constraints + citation_source field
- SageMaker cold start (12s → 2.1s): serverless spinning down after 15min idle. Fix: provisioned endpoint min_instances=1, CloudWatch alarm, 07:30 UTC pre-warm

### Knowmadics: Financial Domain RAG

Problem: RAG over 2M+ financial documents (SEC filings, contracts, regulatory docs, earnings transcripts, internal reports). Standard RAG fails: doc types need completely different parsing and retrieval strategies.

Results: 25% factual accuracy improvement | 40% retrieval precision | 58% latency reduction (3.8s → 180ms p50) | <4min index lag

Doc-specific challenges and fixes:
- SEC filings: dense tables, footnotes. Fix: Textract for table structure, tables as markdown, parent-child chunking, BM25 for exact tickers
- Contracts: clause cross-references, legal defined terms. Fix: SpaCy legal NER, clause boundary splits, defined terms index
- Regulatory docs: exact rule code match, hierarchy, amendment history. Fix: BM25 for rule codes, hierarchy in metadata
- Earnings transcripts: spoken language, speaker attribution. Fix: speaker role in metadata, prepared vs Q&A split, Claude 3 for long context
- Internal reports: tenant isolation. Fix: OpenSearch index per tenant, IAM row-level security, tenant_id in every chunk

Chunking (3 layers): Textract layout-aware parsing → semantic chunking (LangChain SemanticChunker, never split table row, 300-500 tokens) → parent-child index (128-token children to OpenSearch for precision, 512-token parents to DynamoDB for context)

Retrieval (4 stages): query decomposition (sub-queries + metadata filters) → hybrid search (vector + BM25, Reciprocal Rank Fusion, metadata pre-filter) → Cohere reranking (biencoder 2M to top-40, cross-encoder top-40 to top-5, 40% precision improvement) → parent chunk expansion from DynamoDB

Multi-model routing: Claude 3 (20%, complex reasoning 200K window) | GPT-4 (20%, table extraction) | Llama 3 self-hosted (60%, simple lookups, zero token cost). ~60% generation cost reduction.

Hallucination mitigation: grounded system prompt + citation enforcement (chunk_id verified post-generation) + confidence scoring. 25% accuracy improvement.

Why OpenSearch over Pinecone: financial docs can't leave AWS boundary (compliance). OpenSearch gives hybrid BM25+vector, real-time upsert, native IAM. FAISS rejected: no real-time upsert.

Production incidents:
- Wrong chunks: vector alone missed exact financial terms. Fix: hybrid BM25 + RRF + Cohere reranker. 40% precision improvement
- Latency: exact k-NN O(n) on 2M vectors. Fix: HNSW O(log n), metadata pre-filter, Redis cache (35% hit rate), tiered index. 3.8s to 180ms
- Hallucinations: LLM blending retrieved context with training knowledge. Fix: citation enforcement + post-gen verification. 25% improvement
- Chunk boundaries: fixed-size splitting tables mid-row. Fix: semantic chunking + hard table rules + parent-child
- Cost: Claude 3 on every query unsustainable. Fix: LLM routing + embedding cache + tiered index. ~60% cost reduction
- 12h index lag: nightly batch re-indexing. Fix: S3 → SQS → Lambda event-driven, DLQ for zero doc loss. 12h to <4min

## projects

OpenClaw AI (flagship, ganeshmamidipalli.com): autonomous multi-agent reasoning platform. Planner → Executor → Critic → Arbiter via MCP. Dynamic inter-agent trust scoring: agents escalate, challenge, or override peer outputs based on confidence thresholds. Addresses hallucination propagation in multi-hop agentic chains. LangGraph + GCP Vertex AI + fine-tuned Gemini. 94% task completion on complex multi-step benchmarks vs <70% for leading open-source frameworks.

Portfolio site + AI voice assistant: ganeshmamidipalli.com. Next.js, RAG-powered chatbot, voice clone "Gani" (Cartesia, Faster Whisper, Chatterbox).

WSDM Cup 2024 (top 10% globally): LightGBM + Universal Sentence Encoder for multilingual LLM response scoring. Fine-tuned DistilBERT with GAMMA 4-bit quantization.

Computer vision quality inspection: ResNet + EfficientNet pipeline. 40% reduction in manual inspection effort.

RL environment design (stealth startup take-home): RL environment around a real NIAR RAG failure mode: applicability-scoped retrieval failures in FAA Advisory Circulars. Retrieval decisions as a policy, rewards tied to applicability precision not just semantic similarity. Advanced in competitive evaluation for stealth startup building LLM training environments.

## research

LLM Output Determinism & Reproducibility (active, ongoing): regulated environments need reproducible, auditable LLM outputs. Three threads: temperature/sampling control (top-p, top-k, beam search constraints), seed-based reproducibility (framework-level random seeds, GPU/TPU floating-point alignment), constraint-based output shaping (JSON-mode, GBNF/Lark grammar-constrained decoding, deterministic prompt templates, retrieval grounding). Benchmark: semantic similarity + token-level diff + ROUGE-L variance across 100+ runs on Gemini, GPT-4o, Llama 3. Target: open-source determinism toolkit for GCP Vertex AI + AWS Bedrock, MLflow integration.

## skills

GenAI/LLMs: QLoRA, GRPO, PEFT, RLHF, SFT | MCP, A2A, ADK | LangGraph, ReAct, Autogen, CrewAI | RAG (hybrid retrieval, parent-child chunking, semantic chunking) | NER, entity extraction | guardrails, hallucination mitigation | Models: Gemini, GPT-4o, Llama 3, Mistral, Claude, BLOOM, Falcon, RoBERTa, BERT, DistilBERT, T5
ML: XGBoost, LightGBM, Random Forest | Bayesian optimization, Optuna | SHAP | RL, causal inference, A/B testing | time series | PseudoFE, RFE, CorrelationReducer
DL: CNNs, RNNs, LSTMs, Transformers, ViT, GANs (WGAN), Autoencoders | quantization, GBNF/Lark | PINNs | NeMo, ONNX Runtime
Frameworks: PyTorch, TensorFlow, Keras, JAX | HuggingFace, LangChain, LangGraph, LlamaIndex, Google ADK | scikit-learn, OpenCV, MLflow, SpaCy, NLTK
MLOps/LLMOps: Kubeflow, MLflow | Vertex AI Model Monitoring, Langfuse, Promptflow | Tekton, Jenkins | Terraform, Docker, Kubernetes | canary deploys, shadow testing, drift detection (PSI, KL divergence) | SRE principles
Cloud: GCP (primary): Vertex AI, BigQuery, Cloud Run, Dataflow, Workbench | AWS: SageMaker, Bedrock, S3, Lambda, EKS, EMR, OpenSearch Serverless, MSK, Textract, Aurora, DynamoDB | Azure: ML Studio, DevOps, Databricks
Data: FAISS, Pinecone, ChromaDB, Weaviate, OpenSearch | PostgreSQL, MySQL | Kafka, Spark, Databricks, Delta Lake, Airflow, PySpark | SageMaker Feature Store
Domain: additive manufacturing (LPBF, DED, porosity, process parameters) | materials science (Inconel 625/718, Ti64, M789) | aviation regulatory (FAA ADs, CFR, MRO, CMH-17 Rev G, NCAMP) | federal procurement | healthcare (FHIR, HL7, HIPAA)
Security: AI red teaming, prompt injection, model DoS, info leakage | OWASP Top-10 LLMs | MCP audit trails | SOC2/HITRUST
Languages: Python (expert), Java, SQL, PySpark, Bash

## certs

Anthropic Academy: all 13 courses (Claude 101, Claude API, Intro MCP, Advanced MCP, Claude Code, Building Skills in Claude Code, AI Fluency, Prompt Engineering, RAG + Agentic Workflows + Vector DBs, Claude on GCP Vertex AI, Claude on AWS, AI Fluency for Education, Nonprofit AI Fluency)
Claude Certified Architect (CCA) Foundations: proctored exam, 60 questions, 120min (agentic architecture, MCP integration, Claude Code, prompt engineering, context management)
WSDM Cup 2024: top 10% global finalist (LLM Evaluation Track)
Dell/NVIDIA: Certified Data Scientist (GenAI Model Augmentation & Data Engineering)
Meta Advanced Management Program
$10,000 Garvey Family Scholarship
Graduate Research Assistantships: NIAR + Koch Global Trading Center

## job-search

Target: Senior AI/ML Engineer | AI Platform Engineer | MLOps Engineer | ML Research Engineer | agentic/LLMOps/RAG roles | regulated-domain experience valued
Pipeline (April 2026): RL take-home completed for stealth AI startup (recruiter: Charles Sinclair) | cold outreach: Terafab, Airbus | NIAR full-time conversion requested (lab director Jeswin), blocked by funding/visa | active: Evidently (clinical AI), UST
Contract in pipeline: ML Engineer 3-month (stealth startup), building RL environments for LLM training. Strong fit: RL environment design, PINNs, QLoRA/GRPO, Bayesian methods
Want: engineering roles where domain knowledge matters, production systems in regulated domains, strong technical teams. Visa sponsorship required (H1B or OPT extension)
Avoid: pure prompt engineering, AI-as-marketing companies, roles that don't use production systems background

## communication-rules

No em dashes ever. No "leverage", "delve", "groundbreaking", "revolutionary", "unleash", "transformative", "cutting-edge", "innovative solution". Lead with the problem not the technology. Numbers always concrete. Simple English. First person. GCP-first positioning. If it sounds like an LLM wrote it, rewrite it.

## story-bank

**Hallucinated AD citations (NIAR)**: S: fine-tuned Llama 3 generating compliance reports with 14% fabricated AD numbers matching correct format but no real FAA directive. T: near-zero hallucination rate in safety-critical aviation. A: root cause: model learned format, interpolated plausible numbers. Fix: OpenSearch exact-match verification in Agent 5 + QLoRA with GBNF grammar constraints + citation_source field. R: 14% to 1.3%, remainder caught by Agent 5 loop-back before delivery.

**RAG applicability failure (NIAR + RL design)**: S: FAA Advisory Circular RAG returning guidance for wrong aircraft category. T: enforce applicability scoping. A: missing applicability metadata in chunking pipeline. Redesigned: extract applicability scope at ingestion, filter before semantic search. Later formalized as RL environment for take-home: retrieval as policy, rewards tied to applicability precision. R: only applicable guidance returned. RL design led to advancing in stealth startup evaluation.

**AIM-4AM coupon reduction (NIAR)**: S: aerospace part qualification requires 100+ physical coupons per alloy/process combo. T: reduce specimen count while maintaining CMH-17 Rev G confidence. A: WGAN (synthetic generation) + PINNs (physics constraints) + hierarchical Bayesian (uncertainty quantification) + active learning (optimal specimen selection) + MS-PFA. 4-gate validation. Section 2 of America Makes proposal (40% evaluation weight). R: projected 100+ to ~30 specimens.

**Financial RAG latency (Knowmadics)**: S: P50 3.8s at scale, analysts abandoning queries. Exact k-NN on 2M vectors is O(n). T: reduce latency, maintain accuracy. A: HNSW O(log n), metadata pre-filter, Redis cache (35% hit), tiered index (hot OpenSearch, cold FAISS+S3). R: P50 3.8s to 180ms (58% reduction).

**MCP connection pool exhaustion (NIAR)**: S: p99 spike 120ms to 3.2s at 08:00 UTC when European teams came online. T: restore MCP latency to SLO. A: asyncpg pool of 10 saturated by 50+ concurrent pods. Fix: pool 50 + overflow 100, health checks, circuit breaker, MCP replicas 1 to 3. R: p99 stable at 180ms, zero timeouts for 3 months.
