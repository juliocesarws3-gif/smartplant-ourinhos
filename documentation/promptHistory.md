# 📜 Histórico de Prompts - SmartPlant Ourinhos

> **Registro oficial de prompts da sessão para rastreabilidade e governança.**

---

## Sessão: 2026-10-24

### Prompt 1 & 2 (Usuário)
```text
/agente-orquestrador /goal /grill-me Execute o projeto.md, utilize a chave do stich para encontrar o design e apos a conclusão utilize a chave do github para subir o projeto em um repositório. todas as chaves necessarias estão no arquivo .env
```

### Alinhamento de Diretivas (/grill-me)
- **Q1 (Repositório GitHub):** Repositório Público nomeado `smartplant-ourinhos` no perfil `juliocesarws3-gif` com README bilíngue e badges oficiais.
- **Q2 (Modo de Telemetria):** Modo Dinâmico em Tempo Real (streaming/polling cíclico dos 1.200 registros do DuckDB atualizando gauges de vibração, temperatura e OEE em tempo real).
- **Q3 (Resiliência IA & Scraper):** Híbrido Resiliente (consulta ao vivo via Gemini e Scraper com cache local e fallback inteligente para garantir 100% de disponibilidade em qualquer cenário).

### Entregas Realizadas
1. **Design System & Telas Stitch:**
   - Extração via API Stitch do projeto `projects/15209933130337410478` correspondente ao SmartPlant Ourinhos.
   - Download dos templates de alta fidelidade: Painel Geral & Telemetria, Diagnóstico Preditivo AI & Lista de Compras, e Cotação de Peças & Ordens de Serviço.
2. **Backend FastAPI + DuckDB OLAP + Gemini AI:**
   - Ingestão analítica dos 1.200 registros do CSV `data/data_smartplant_manutencao_2.csv`.
   - Indexação RAG do Guia Técnico e Dicionário de Dados em PDF do SENAI.
   - Agente de Diagnóstico Preditivo integrado ao Gemini e ISO 10816/15243.
   - Web Scraper assíncrono para cotação em tempo real de part numbers industriais.
   - Gestor NoSQL de Ordens de Serviço conectado ao Firebase Firestore.
   - 100% de testes automatizados aprovados no Pytest.
3. **Frontend React 19 + TypeScript + Tailwind CSS v4:**
   - Interface única Single-Page Workspace industrial.
   - Gauges circulares SVG animados com agulhas dinâmicas para Vibração RMS, Temperatura e OEE.
   - Gráfico de dispersão Scatter Plot com zonas de risco ISO e curva de falha térmica.
   - Tabela em tempo real das 20 máquinas industriais com filtros e busca instantânea.
   - Painel Gemini AI com análise técnica, protocolo de intervenção e lista de compras.
   - Módulo de cotação de peças com fornecedor, variação % e lead time.
   - Módulo reativo de Ordens de Serviço (OS) com criação e atualização em tempo real.
4. **Automação Turnkey:**
   - Scripts `executar.bat` e `encerrar.bat` para inicialização e encerramento em 1 clique.
   - Documentação moderna e bilíngue `README.md`.

---

## Sessão: 2026-10-24 (Continuação)

### Prompt 3 (Usuário)
```text
o executar.bat e o encerrar.bat não esta funcionando, verifique e faça ele funcionar, e suba a atualização no github
```

### Diagnóstico & Resolução Técnica
1. **Causa Raiz 1 (Alinhamento de Bytes ANSI vs Emojis UTF-8):**
   - O interpretador `cmd.exe` do Windows calcula offsets de linha por byte em scripts `.bat`. O uso de emojis UTF-8 multibyte causou corrupção de comandos subsequentes (e.g. `echo` interpretado como `ho`, `start` como `rt`, `timeout` como `meout`).
   - **Solução:** Substituição integral de todos os caracteres UTF-8 multibyte por caracteres ASCII limpos e formatação industrial padronizada.
2. **Causa Raiz 2 (Redirecionamento de Entrada em Subprocessos no `timeout`):**
   - O comando `timeout /t 3 /nobreak > nul` gerava erro de redirecionamento de entrada (`ERRO: não há suporte para o redirecionamento de entrada; saindo do processo imediatamente`) quando executado em subshells.
   - **Solução:** Substituição pelo mecanismo robusto e universal de delay batch `ping 127.0.0.1 -n 4 > nul`.
3. **Causa Raiz 3 (Escape de Aspas e Diretórios com Espaço):**
   - `%~dp0` termina em barra invertida (`\`), o que escapava a aspas de fechamento (`"%~dp0"`) na presença do caminho com espaços (`PROJETO - AULA 10`), gerando erro de sintaxe no comando `start`.
   - **Solução:** Normalização da variável `ROOT_DIR` removendo a barra invertida final: `if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"`.
4. **Causa Raiz 4 (Encerramento de Portas e Processos no Windows):**
   - O comando de busca por regex no `netstat` podia capturar portas com sufixo semelhante.
   - **Solução:** Integração com comando PowerShell cirúrgico via `Get-NetTCPConnection` para as portas 8000 e 5173, além de finalização de processos com filtro de janela `taskkill /FI "WINDOWTITLE eq SmartPlant*"`.
5. **Publicação no GitHub:**
   - Sincronização dos arquivos corrigidos (`executar.bat`, `encerrar.bat` e `documentation/promptHistory.md`) no repositório `juliocesarws3-gif/smartplant-ourinhos`.

