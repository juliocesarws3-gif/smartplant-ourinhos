# 🏭 SmartPlant Ourinhos • Industrial Predictive Maintenance & IIoT 4.0
### *Plataforma de Manutenção Preditiva Baseada em Condição (PdM) & Indústria 4.0*

<p align="center">
  <img src="https://img.shields.io/badge/Google_Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Antigravity" />
  <img src="https://img.shields.io/badge/Gemini_3.8_Flash-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini 3.8 Flash" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/DuckDB_OLAP-FFF000?style=for-the-badge&logo=duckdb&logoColor=black" alt="DuckDB" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Firebase_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/SENAI_Ourinhos-ED1C24?style=for-the-badge&logo=sensenet&logoColor=white" alt="SENAI Ourinhos" />
</p>

---

## 🇧🇷 Português (Brasil)

### 1. Visão Geral do Projeto
O **SmartPlant Ourinhos** é uma plataforma industrial inteligente desenvolvida para monitoramento da saúde de máquinas fabris em tempo real, mitigando paradas não planejadas de linha de produção através de **Manutenção Preditiva Baseada em Condição (PdM)**.

Desenvolvido segundo a metodologia **Spec-Driven Development (SDD)** no ambiente **Google Antigravity**, o sistema atende aos padrões da **Indústria 4.0** e às normas internacionais **ISO 10816-3** (severidade vibracional RMS) e **ISO 15243** (padrões de fadiga mecânica).

### 2. Destaques Tecnológicos & Arquitetura
1. **Engenharia de Dados Massiva:** Ingestão de **1.200 leituras IIoT** distribuídas em 25 atributos sensoriais (temperatura, vibração RMS, pressão, corrente elétrica, ruído e horímetro) processadas sub-milisegundo via **DuckDB OLAP**.
2. **RAG Técnico Especializado:** Extração e contextualização semântica das diretivas do **"Guia Técnico e Dicionário de Dados - Hackathon SENAI Antigravity"**.
3. **Agente de Diagnóstico Gemini AI:** Processamento de causas raízes, probabilidade de quebra em 48h, protocolos de intervenção mecânica e lista otimizada de sobressalentes.
4. **Scraper Vivo de Cotação de Peças:** Varredura em tempo real por *Part Number* com cálculo de variação de preços, lead time de fornecedores e economia de compras.
5. **Ordens de Serviço (OS) Reativas:** Sincronização em tempo real NoSQL com **Firebase Firestore** para controle de ordens de serviço e atualização do status operacional das máquinas.
6. **Interface Industrial Clean Ops:** Desenvolvida em **React 19 + TypeScript + Tailwind CSS v4** inspirada nos protótipos de alta fidelidade do **Stitch**.

### 3. Agentes e Skill Packs Antigravity Utilizados
* 🤖 `agente-orquestrador` (Camada 2 - Inteligência de Roteamento e Autocura)
* 📚 `@app-builder` & `@clean-code` (Engenharia de Código Limpo e Arquitetura Modular)
* 🎨 `@frontend-design` & `@design-spec` (Design Tokens e Sistema Visual Industrial)
* 🧪 `@tdd-workflow` & `@verify-changes` (Garantia de 100% de Aprovação em Testes Automatizados)

### 4. Como Executar (Turnkey 1-Clique)
No Windows, basta executar o inicializador na raiz:
```cmd
executar.bat
```
Para finalizar todos os processos:
```cmd
encerrar.bat
```

---

## 🇺🇸 English

### 1. Project Overview
**SmartPlant Ourinhos** is an intelligent industrial platform engineered for real-time factory machine health monitoring, preventing unplanned production downtime through **Condition-Based Predictive Maintenance (PdM)**.

Architected via **Spec-Driven Development (SDD)** with **Google Antigravity**, this software complies with **Industry 4.0** standards, **ISO 10816-3** (RMS vibration severity), and **ISO 15243** (bearing fatigue and spalling).

### 2. Core Technological Features
1. **Massive OLAP Data Engineering:** Sub-millisecond analytical ingestion of **1,200 IIoT sensor readings** across 25 industrial parameters using **DuckDB**.
2. **Technical RAG Knowledge Engine:** Semantic indexing and retrieval of the official **SENAI Technical Guide & Data Dictionary**.
3. **Gemini AI Predictive Diagnostician:** Root-cause failure analysis, 48h thermal/vibration failure risk forecasting, intervention checklists, and optimized spare parts acquisition.
4. **Live Web Scraper for Spare Parts:** Real-time web quotation by *Part Number*, comparing ERP benchmarks, lead times, and procurement savings.
5. **Reactive Service Orders (OS):** Live NoSQL synchronization via **Firebase Firestore** with instant updates to machine operational status.
6. **Clean Ops Industrial Workspace:** Built with **React 19, TypeScript, and Tailwind CSS v4** reflecting high-fidelity designs generated in **Stitch**.

### 3. Quick Start (Turnkey Windows)
To launch both the FastAPI Backend and Vite React Frontend with one click:
```cmd
executar.bat
```
To safely terminate all running processes:
```cmd
encerrar.bat
```

---

<p align="center">
  <b>Escola SENAI Ourinhos • Google Antigravity • Edição Hackathon 2026</b>
</p>
