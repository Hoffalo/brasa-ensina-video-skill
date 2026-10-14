# BRASA Ensina: skill para o Claude Code

Uma skill do [Claude Code](https://claude.com/claude-code) que produz um episódio do **BRASA Ensina** para o YouTube
do início ao fim, no Adobe Premiere Pro + After Effects. Ela cobre o corte bruto a partir das gravações da
apresentadora, os motion graphics no estilo da casa no AE, e os SFX, as transições CRT e os marcadores de preset no
Premiere. O Claude para num checkpoint ao fim de cada etapa para você revisar.

- `SKILL.md`: o fluxo de trabalho, os checkpoints e as regras fundamentais (é o que o Claude lê primeiro)
- `references/`: as regras detalhadas de cada etapa (corte, estilo dos gráficos = **THE STANDARD**, construção dos
  gráficos, SFX, ferramentas)
- `tools/ae-mcp-bridge/`: o painel ponte do After Effects e os scripts que a skill usa
- `docs/patterns-log.md`: o registro de todas as regras e correções

---

## Instalação

### Opção A: deixar o Claude Code instalar
Abra o Claude Code e cole:

> Instale a skill de https://github.com/Hoffalo/brasa-ensina-video-skill. Clone em
> `~/.claude/skills/brasa-ensina-video`, copie `tools/ae-mcp-bridge` para `~/Documents/ae-mcp-bridge`, instale
> `tools/ae-mcp-bridge/mcp-bridge-auto.jsx` na pasta `Scripts/ScriptUI Panels` do After Effects e me diga o que
> mais eu preciso configurar segundo o README.

### Opção B: manualmente
```bash
git clone https://github.com/Hoffalo/brasa-ensina-video-skill ~/.claude/skills/brasa-ensina-video
```
```bash
cp -r ~/.claude/skills/brasa-ensina-video/tools/ae-mcp-bridge ~/Documents/ae-mcp-bridge
```
Depois copie `tools/ae-mcp-bridge/mcp-bridge-auto.jsx` para
`C:\Program Files\Adobe\Adobe After Effects <versão>\Support Files\Scripts\ScriptUI Panels\` e reinicie o AE.

### O que mais o computador precisa
| Requisito | Para quê |
|---|---|
| Premiere Pro com o **servidor MCP do Premiere** e o painel MCP Bridge dele conectado ao Claude Code | o Claude edita a timeline |
| After Effects com **Window → mcp-bridge-auto.jsx** aberto e "Auto-run commands" marcado; em Preferences → Scripting & Expressions, "Allow Scripts to Write Files and Access Network" ativado | o Claude roda scripts no AE |
| Python 3.12 com `faster-whisper` (GPU opcional, funciona na CPU) e `Pillow`; `ffmpeg` no PATH | transcrição, pontos de corte, folhas de contato |
| Fontes **Hagrid** (Extrabold) e **Lato** (Regular/Bold) | tipografia da casa |
| Biblioteca de SFX em `Documents\Assets Gerais\Sound Effects\` e transições CRT em `Documents\Assets Gerais\THE MASTER BUNDLE\THE MASTER BUNDLE\CRT TRANSITION\NN TR.mp4` (01–15) | etapa 3 |
| Seus presets de efeito do Premiere "Smooth In Text", "Smooth Out Text" e "Smooth Zoom In" | você aplica nos marcadores do Claude |

Alguns scripts têm caminhos absolutos do Windows (`C:/Users/lolo/...`) e caminhos de episódio. Em outro computador,
peça ao Claude para ajustá-los antes do primeiro uso.

---

## Como usar

Abra uma sessão do Claude Code e diga algo como *"vamos fazer o vídeo do BRASA Ensina sobre X"*. A skill carrega
sozinha. Cada etapa termina num **checkpoint**: o Claude para, você revisa e depois manda continuar.

### Antes da etapa 1: corte bruto
Entregue ao chat:
- a **pasta do episódio** (`Documents\Projetos\BRASA\BRASA Ensina\<episódio>\`) com as gravações brutas;
- o **roteiro** (PDF);
- o **projeto do Premiere** aberto, com os arquivos brutos importados (uma transcrição, ou a transcrição de uma
  stringout, é opcional; o Claude transcreve tudo de qualquer forma).

O Claude monta uma sequência nova, `<episódio> - CORTE v1` (ele nunca mexe na sua sequência bruta), mais um arquivo
de notas.
**Checkpoint 1, sua vez:** ajuste os takes ou cortes que quiser, adicione a **vinheta** e a **música** e avise
quando terminar.

### Antes da etapa 2: motion graphics
- Abra o projeto do After Effects do episódio (o `Motions.aep` dele, com uma comp que tenha o fundo da casa e o rig
  de Null + câmera) e confira se o **painel mcp-bridge-auto** está aberto e com o auto-run ligado.
- Avise o Claude quando o seu corte final estiver pronto (ele lê o corte do projeto do Premiere).

O Claude planeja o tempo da apresentadora versus os gráficos, constrói cada comp no estilo THE STANDARD (coluna à
esquerda + cards que entram girando + um globo ou checklist sincronizado, plano do título e depois um único movimento
de câmera), confere os frames e te passa uma **lista de importação**.
**Checkpoint 2, sua vez:** revise as comps no AE, depois **importe-as no Premiere** (o Claude não consegue importar
comps do AE) e diga "importei".

### Etapa 3: posicionamento, SFX e transições
O Claude posiciona os gráficos, as transições CRT (TR 01–15, em Screen), todos os SFX (−10 dB) e **marcadores** onde
for preciso aplicar um preset do Premiere.
**Checkpoint final, sua vez:** aplique os presets nos marcadores (**Smooth Zoom In** nos clipes da apresentadora,
**Smooth In/Out Text** nos cards G0), assista ao vídeo e dê o seu feedback.

### O que é sempre responsabilidade sua
- Manter o Premiere e o AE abertos com os painéis ponte rodando. Se o AE reiniciar, reabra o painel (comandos parados
  em "pending" significam que o painel não está rodando). Feche qualquer diálogo do AE (fontes ou mídias faltando)
  que trave a ponte.
- Importar as comps do AE no Premiere e aplicar os presets de efeito. O Claude coloca marcadores para isso.
- Depois de reiniciar o computador ou o AE, não salvar uma janela antiga do AE por cima do trabalho do Claude.
- **Dar feedback à vontade.** Cada correção vira uma regra nesta skill (`references/` + `docs/patterns-log.md`) na
  mesma hora, para você não precisar se repetir.

---

## Atualizações
As regras são adicionadas à skill enquanto você trabalha. Para publicá-las, peça ao Claude *"faz commit e push da
skill"*, ou rode `git add -A && git commit -m "..." && git push` em `~/.claude/skills/brasa-ensina-video`. Para
atualizar a pasta `tools/` com a sua cópia de trabalho, peça antes ao Claude para sincronizar
`~/Documents/ae-mcp-bridge` com ela.
