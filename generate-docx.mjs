import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopPosition, TabStopType, ShadingType } from 'docx';
import fs from 'fs';
import path from 'path';

const outputPath = process.argv[2] || 'output/ganesh-cv.docx';
const roleTarget = process.argv[3] || 'AI Engineer';

console.log(`Generating DOCX: ${outputPath} | Target: ${roleTarget}`);

const children = [];
const TEAL = '1A7A7A';
const PURPLE = '5B3A8C';
const DARK = '1A1A2E';
const GRAY = '555555';
const LIGHT = '888888';

function heading(text) {
  children.push(new Paragraph({
    spacing: { before: 280, after: 80 },
    border: { bottom: { color: TEAL, size: 6, style: BorderStyle.SINGLE, space: 4 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: 'Calibri', color: TEAL })]
  }));
}

function bullet(text, bold_prefix = '') {
  const runs = [];
  if (bold_prefix) {
    runs.push(new TextRun({ text: bold_prefix, bold: true, size: 20, font: 'Calibri' }));
  }
  runs.push(new TextRun({ text: bold_prefix ? text : text, size: 20, font: 'Calibri' }));
  children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 30 }, children: bold_prefix ? runs : [new TextRun({ text, size: 20, font: 'Calibri' })] }));
}

function jobHeader(company, role, location, period) {
  children.push(new Paragraph({
    spacing: { before: 180, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: company, bold: true, size: 22, font: 'Calibri', color: PURPLE }),
      new TextRun({ text: `\t${period}`, size: 19, font: 'Calibri', color: LIGHT })
    ]
  }));
  children.push(new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: role, italics: true, size: 20, font: 'Calibri', color: DARK }),
      new TextRun({ text: `  |  ${location}`, size: 19, font: 'Calibri', color: LIGHT })
    ]
  }));
}

function stackLine(text) {
  children.push(new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: 'Tech: ', bold: true, size: 18, font: 'Calibri', color: GRAY }),
      new TextRun({ text, italics: true, size: 18, font: 'Calibri', color: GRAY })
    ]
  }));
}

// ===== HEADER =====
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: 'GANESH HEMANTH MAMIDIPALLI', bold: true, size: 30, font: 'Calibri', color: DARK })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: 'AI Engineer  |  LLM Systems  |  Generative AI Infrastructure  |  Multi-Agent Platforms  |  MLOps', size: 20, font: 'Calibri', color: TEAL })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: '(316) 210-1890  |  mganeshhemanth@gmail.com  |  linkedin.com/in/ganesh-mamidipalli-951a95102  |  ganeshmamidipalli.com', size: 18, font: 'Calibri', color: GRAY })]
}));

// ===== SUMMARY =====
heading('Professional Summary');
children.push(new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({
    text: 'AI Engineer with 8+ years of progressive experience building production-grade AI systems - from classical ML pipelines to enterprise-scale multi-agent architectures serving regulated industries. Core expertise: LLM fine-tuning (QLoRA, GRPO, RLHF), production RAG systems with measurable accuracy gains, and agentic orchestration using LangChain, LangGraph, Google ADK, MCP, and A2A protocols. Delivered 58% inference latency reduction, 35% faster enterprise data access, and 99.7% model compliance across GCP and AWS deployments. Currently researching LLM output determinism for regulated enterprise deployments (financial, healthcare, legal). M.S. Data Science, GPA 3.9/4.0.',
    size: 20, font: 'Calibri'
  })]
}));

// ===== CORE SKILLS =====
heading('Technical Skills');

const skillRows = [
  ['GenAI & LLMs', 'LLM Fine-Tuning (QLoRA, GRPO, PEFT, RLHF), RAG Pipelines, Multi-Agent Systems (MCP, A2A, ADK), Agentic AI (ReAct, LangGraph, CrewAI, Autogen), Prompt Engineering, Guardrails, Hallucination Mitigation, LLM Determinism'],
  ['ML & Deep Learning', 'PyTorch, TensorFlow, scikit-learn, XGBoost, LightGBM, CNNs, Transformers, BERT, T5, NER, Sentiment Analysis, Vector Embeddings, SHAP, A/B Testing, Time Series'],
  ['LLMs', 'Gemini, GPT-4o, Claude, Llama 3, Mistral, T5, BLOOM, RoBERTa, Falcon'],
  ['MLOps & Infra', 'MLflow, Kubeflow, Langfuse, Vertex AI Model Monitoring, Docker, Kubernetes, Terraform, Jenkins, Tekton, CI/CD, Model Registry, Drift Detection'],
  ['Cloud', 'GCP (Vertex AI, BigQuery, Cloud Run, Dataflow) | AWS (SageMaker, Bedrock, EKS, Lambda) | Azure (ML Studio, DevOps, Databricks)'],
  ['Data', 'FAISS, Pinecone, ChromaDB, Weaviate, PostgreSQL, MongoDB, Apache Kafka, Spark, PySpark, Airflow, Delta Lake, Feature Store'],
  ['Languages', 'Python (Expert), Java, SQL, Bash/Shell'],
];

for (const [cat, val] of skillRows) {
  children.push(new Paragraph({
    spacing: { after: 30 },
    children: [
      new TextRun({ text: `${cat}: `, bold: true, size: 19, font: 'Calibri', color: DARK }),
      new TextRun({ text: val, size: 19, font: 'Calibri' })
    ]
  }));
}

// ===== EXPERIENCE =====
heading('Professional Experience');

// -- NIAR --
jobHeader('National Institute for Aviation Research (NIAR)', 'AI Engineer - GCP & MLOps Platform', 'Wichita, KS', 'January 2025 - Present');
bullet('Architected enterprise multi-agent platform using Google ADK and A2A protocol with MCP tool integration; built Java backend services bridging legacy aviation data systems with AI runtime - reduced enterprise data access latency by 35%.');
bullet('Built production multi-hop RAG pipelines (LangChain + Vertex AI Vector Search) with dynamic chunking and embedding; fine-tuned Gemini via Vertex AI Model Garden using QLoRA and GRPO with A2A handoffs for specialized sub-agent collaboration.');
bullet('Designed deterministic inference pipelines with automated validation gates (SHAP analysis, statistical tests, drift checks) in CI/CD - achieved 99.7% benchmark compliance across all deployed models.');
bullet('Deployed containerized REST API inference endpoints (FastAPI + Docker + Cloud Run) achieving 58% latency reduction; implemented SRE principles for Cloud Run concurrency tuning with 99.9% uptime.');
bullet('Established model governance with MLflow Registry (staging-to-prod promotion), lineage tracking, and Terraform CI/CD - cut deployment errors by 32% and enabled full audit trails.');
bullet('Built real-time drift monitoring (MLflow + Vertex AI Model Monitoring) with SLO alerting detecting production issues 45% faster; resolved 500+ guardrail incidents via codified prompt safety policies.');
stackLine('PyTorch, TensorFlow, GCP Vertex AI, BigQuery, Cloud Run, Google ADK, LangChain, Java, Terraform, MLflow, Kubeflow, MCP, A2A, Docker, Kubernetes, PySpark, Databricks, FastAPI');

// -- Knowmadics --
jobHeader('Knowmadics', 'AI Engineer - LLM Fine-Tuning & AI Security', 'Remote', 'July 2024 - January 2025');
bullet('Built end-to-end LLMOps infrastructure on GCP Vertex AI with Kubeflow orchestration and Terraform IaC; architected multi-agent GenAI applications with A2A protocol and audit-grade observability.');
bullet('Deployed production RAG pipelines (LangChain + FAISS + ChromaDB) with agentic retrieval improving domain accuracy by 25%; embedded guardrails for hallucination mitigation and PII filtering.');
bullet('Deployed Langfuse + Promptflow observability stack achieving 30% faster debugging; evaluated LLMs across HF Leaderboard, HELM, BIG-bench via torchtune.');
bullet('Developed distributed data pipelines (Dask + Spark) for real-time feature generation on 1M+ TPS systems with Apache Kafka ingestion.');
bullet('Optimized LLM inference via quantization and model compression - reduced Kubernetes inference latency 58% while maintaining benchmark quality.');
bullet('Built AI Security Red Teaming framework: prompt injection detection, model DoS testing, information leakage scoring with OWASP Top-10 LLMs compliance.');
stackLine('PyTorch, TensorFlow, GCP Vertex AI, Cloud Run, Google ADK, LangChain, LangGraph, Java, AWS (EKS, S3, Bedrock), MLflow, Langfuse, Docker, Kubernetes, Kafka, Dask, Spark');

// -- WayCool --
jobHeader('WayCool Technologies', 'Senior Data Scientist / ML Engineer', 'India (Remote)', 'January 2021 - January 2024');
bullet('Developed production Python ML library extending scikit-learn APIs (XGBoost, LightGBM) with advanced feature selection modules (PseudoFE, RFE, TFE, CorrelationReducer) - adopted across multiple teams.');
bullet('Led Kubeflow V1 to V2 migration: architected components for training, data prep, K-Fold CV; improved scalability, API stability, and downstream team velocity.');
bullet('Built Jenkins CI/CD pipelines for automated package testing and PyPI publishing; shortened ML development lifecycle by 20%.');
bullet('Implemented KubeRay + Ray distributed training for fault-tolerant model lifecycle at scale; enhanced optimization tooling (BayesOptCV, OptunaCV, OutofTimeCV).');
stackLine('Python, Java, scikit-learn, XGBoost, LightGBM, Kubeflow, Jenkins, Docker, Ray, Kubernetes, Azure, Rubicon-ML');

// -- Sagacious --
jobHeader('Sagacious Research', 'Data Scientist / Business Intelligence Analyst', 'India', 'June 2019 - December 2020');
bullet('Boosted predictive model accuracy 22% for customer churn using XGBoost, LightGBM, and Bayesian optimization on large Spark-processed datasets.');
bullet('Built scalable data pipelines (Apache Spark, Kafka, Airflow) for large-scale analytics with k-fold and GroupCV validation (F1, AUC-ROC, precision, recall).');
stackLine('TensorFlow, PyTorch, scikit-learn, XGBoost, Apache Spark, Kafka, Airflow, AWS, SQL, Python, Java');

// ===== PROJECTS =====
heading('Key Projects & Open Source');

children.push(new Paragraph({
  spacing: { before: 80, after: 30 },
  children: [
    new TextRun({ text: 'OpenClaw AI - Multi-Agent Reasoning Platform', bold: true, size: 20, font: 'Calibri', color: PURPLE }),
    new TextRun({ text: '  |  ganeshmamidipalli.com', size: 18, font: 'Calibri', color: LIGHT })
  ]
}));
bullet('Autonomous multi-agent platform (Planner/Executor/Critic/Arbiter) with dynamic inter-agent trust scoring and MCP coordination. 94% task completion accuracy on complex benchmarks vs <70% for leading frameworks. LangGraph + Vertex AI + fine-tuned Gemini.');

children.push(new Paragraph({
  spacing: { before: 80, after: 30 },
  children: [new TextRun({ text: 'LLM Output Determinism & Reproducibility Research  |  Ongoing 2025', bold: true, size: 20, font: 'Calibri', color: PURPLE })]
}));
bullet('Engineering constraint-based decoding pipelines (JSON-mode, grammar-constrained decoding, seed protocols) for reproducible LLM outputs in regulated environments. Benchmark suite measuring consistency across 100+ runs on Gemini, GPT-4o, Llama 3.');

children.push(new Paragraph({
  spacing: { before: 80, after: 30 },
  children: [
    new TextRun({ text: 'WSDM Cup 2024 - LLM Evaluation', bold: true, size: 20, font: 'Calibri', color: PURPLE }),
    new TextRun({ text: '  |  Top 10% Globally', bold: true, size: 18, font: 'Calibri', color: TEAL })
  ]
}));
bullet('LightGBM + Universal Sentence Encoder for multilingual LLM response scoring; fine-tuned DistilBERT with 4-bit quantization.');

children.push(new Paragraph({
  spacing: { before: 80, after: 30 },
  children: [new TextRun({ text: 'Financial Domain RAG Assistant  |  Regulatory Compliance', bold: true, size: 20, font: 'Calibri', color: PURPLE })]
}));
bullet('Production RAG pipeline over financial disclosures using FAISS embeddings; LLM guardrails improved factual accuracy 25% with systematic A/B testing.');

children.push(new Paragraph({
  spacing: { before: 80, after: 30 },
  children: [new TextRun({ text: 'Computer Vision Quality Inspection System', bold: true, size: 20, font: 'Calibri', color: PURPLE })]
}));
bullet('End-to-end deep learning pipeline (ResNet, EfficientNet) for production quality inspection; reduced manual inspection effort by 40%.');

// ===== EDUCATION =====
heading('Education');

children.push(new Paragraph({
  spacing: { after: 40 },
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
  children: [
    new TextRun({ text: 'M.S. Business Analytics - Data Science Track', bold: true, size: 20, font: 'Calibri' }),
    new TextRun({ text: '  |  Wichita State University', size: 20, font: 'Calibri', color: PURPLE }),
    new TextRun({ text: '\tGPA: 3.9/4.0', size: 19, font: 'Calibri', color: LIGHT })
  ]
}));
children.push(new Paragraph({
  spacing: { after: 80 },
  children: [
    new TextRun({ text: 'B.Tech Electronics & Communication Engineering', bold: true, size: 20, font: 'Calibri' }),
    new TextRun({ text: '  |  Lovely Professional University, India', size: 20, font: 'Calibri', color: PURPLE })
  ]
}));

// ===== CERTS =====
heading('Certifications & Honors');
bullet('Top 10% Global Finalist - WSDM Cup 2024 (LLM Evaluation Track)');
bullet('Certified Data Scientist - Dell / NVIDIA GenAI Model Augmentation & Data Engineering Program');
bullet('Meta Advanced Management Program - Leadership and Technical Management');
bullet('$10,000 Garvey Family Scholarship - Academic Excellence and Research Potential');
bullet('Graduate Research Assistantships - NIAR (Aviation AI) & Koch Global Trading Center (Financial ML)');

// ===== PUBLICATIONS =====
heading('Research & Publications');
bullet('LLM Output Determinism & Reproducibility - constraint-based decoding for regulated enterprise LLM deployments (in progress, 2025)');
bullet('Transformer-based NLP models for domain-specific aviation applications - peer-reviewed, NIAR research lab');
bullet('LLM safety evaluation methodologies and guardrail design for regulated environments');
bullet('AI security frameworks: prompt injection detection and red teaming for enterprise LLM deployments');

// Generate
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: { top: 720, bottom: 720, left: 720, right: 720 } // 0.5 inch margins
      }
    },
    children
  }]
});

const buffer = await Packer.toBuffer(doc);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buffer);
console.log(`DOCX generated: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
